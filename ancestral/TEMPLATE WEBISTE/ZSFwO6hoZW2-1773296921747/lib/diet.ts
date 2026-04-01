/**
 * Diet module - pure diet blending calculation
 * TypeScript port of js/diet.js (calculation only, no DOM)
 */

import { getDietById, getGeoById, normalizeWeights } from './data';
import { getFoodExplanations } from './genetics';
import type { BlendedDiet } from './types';

// ============================================================================
// Tiered food scoring (ported from js/diet.js)
// ============================================================================

export interface HealthConcernConfig {
  id: string;
  icon: string;
  label: string;
  keywords: string[];
}

export const HEALTH_CONCERN_CONFIG: HealthConcernConfig[] = [
  {
    id: 'heart_health',
    icon: '🫀',
    label: 'Heart Health',
    keywords: ['pork', 'bacon', 'lard', 'butter', 'cream', 'sausage', 'chorizo', 'salami', 'prosciutto', 'pancetta', 'liver', 'kidney', 'suet', 'ghee', 'tallow', 'fatback']
  },
  {
    id: 'blood_pressure',
    icon: '🧂',
    label: 'Blood Pressure',
    keywords: ['salt', 'cured', 'smoked', 'pickled', 'preserved', 'soy sauce', 'miso', 'anchov', 'caper', 'brine', 'kimchi', 'sauerkraut', 'jerky', 'feta', 'halloumi', 'olives']
  },
  {
    id: 'blood_sugar',
    icon: '🍬',
    label: 'Blood Sugar',
    keywords: ['white rice', 'white bread', 'pasta', 'sugar', 'honey', 'syrup', 'noodle', 'flour', 'pastry', 'baklava', 'sweet']
  },
  {
    id: 'weight',
    icon: '⚖️',
    label: 'Weight Management',
    keywords: ['fried', 'lard', 'cream', 'butter', 'fatback', 'tallow', 'ghee', 'suet']
  },
  {
    id: 'digestive',
    icon: '🫁',
    label: 'Digestive Issues',
    keywords: ['cabbage', 'broccoli', 'cauliflower', 'bean', 'lentil', 'chickpea', 'onion', 'garlic', 'leek', 'dairy', 'wheat', 'rye']
  }
];

const WATCH_KEYWORDS = /\b(limit|watch|monitor|avoid|be cautious|may taste bitter)\b/i;
const STRONG_WATCH_KEYWORDS = /\b(limit|avoid|restrict)\b/i;

export interface FoodExplanation {
  traitKey: string;
  icon: string;
  title: string;
  phenotype?: string;
  percentage?: string;
  shortReason: string;
}

export type FoodTier = 1 | 2 | 3 | 4;

export interface FoodScore {
  /** 1=superfood, 2=enjoy, 3=minimize, 4=avoid */
  tier: FoodTier;
  positiveReasons: FoodExplanation[];
  watchReasons: FoodExplanation[];
  strongWatchReasons: FoodExplanation[];
  healthConcernFlags: string[]; // emoji icons of matching health concerns
}

/**
 * Score a single food for a user based on their genetics and health concerns.
 * Tier 1 = ancestral superfood (genetics confirms), 2 = enjoy, 3 = minimize, 4 = avoid.
 */
export function scoreFoodForUser(
  food: string,
  mendelianGenetics: Record<string, unknown> | null | undefined,
  isAncestral: boolean,
  activeHealthConcerns: string[] = []
): FoodScore {
  const explanations = mendelianGenetics
    ? (getFoodExplanations as (food: string, g: unknown) => FoodExplanation[])(food, mendelianGenetics)
    : [];

  const positiveReasons = explanations.filter(e => !WATCH_KEYWORDS.test(e.shortReason));
  const watchReasons = explanations.filter(e => WATCH_KEYWORDS.test(e.shortReason));
  const strongWatchReasons = watchReasons.filter(e => STRONG_WATCH_KEYWORDS.test(e.shortReason));

  let tier: FoodTier;
  if (strongWatchReasons.length > 0 && positiveReasons.length === 0)    tier = 4;
  else if (watchReasons.length > 0 && positiveReasons.length === 0)     tier = 3;
  else if (isAncestral && positiveReasons.length > 0)                   tier = 1;
  else                                                                   tier = 2;

  const foodLower = food.toLowerCase();
  const healthConcernFlags = HEALTH_CONCERN_CONFIG
    .filter(c => activeHealthConcerns.includes(c.id) && c.keywords.some(k => foodLower.includes(k.toLowerCase())))
    .map(c => c.icon);

  return { tier, positiveReasons, watchReasons, strongWatchReasons, healthConcernFlags };
}

export interface TieredFoodGroups {
  enjoy: Array<{ food: string; score: FoodScore }>;
  minimize: Array<{ food: string; score: FoodScore }>;
  avoid: Array<{ food: string; score: FoodScore }>;
}

/** Score a list of foods and split them into enjoy/minimize/avoid groups. */
export function tieredFoodGroups(
  foods: string[],
  mendelianGenetics: Record<string, unknown> | null | undefined,
  isAncestral: boolean,
  activeHealthConcerns: string[] = []
): TieredFoodGroups {
  const enjoy: TieredFoodGroups['enjoy'] = [];
  const minimize: TieredFoodGroups['minimize'] = [];
  const avoid: TieredFoodGroups['avoid'] = [];

  for (const food of foods) {
    const score = scoreFoodForUser(food, mendelianGenetics, isAncestral, activeHealthConcerns);
    if (score.tier === 4) avoid.push({ food, score });
    else if (score.tier === 3) minimize.push({ food, score });
    else enjoy.push({ food, score });
  }

  return { enjoy, minimize, avoid };
}

/** Return Tier-1 "superfood" entries from the full food pool. Capped at 8. */
export function getSignatureFoods(
  blended: BlendedDiet,
  mendelianGenetics: Record<string, unknown> | null | undefined,
  activeHealthConcerns: string[] = []
): Array<{ food: string; score: FoodScore; ancestries: string[] }> {
  if (!mendelianGenetics) return [];

  const allFoods = [
    ...blended.commonFoods,
    ...blended.allProteins,
    ...blended.allFats,
    ...blended.allHerbs,
  ];
  const seen = new Set<string>();
  const result: Array<{ food: string; score: FoodScore; ancestries: string[] }> = [];

  for (const food of allFoods) {
    if (seen.has(food)) continue;
    seen.add(food);
    const isAncestral = blended.commonFoods.includes(food);
    const score = scoreFoodForUser(food, mendelianGenetics, isAncestral, activeHealthConcerns);
    if (score.tier === 1) {
      const ancestries = blended.geos
        .filter((_, i) => {
          const diet = blended.diets[i];
          return (
            diet.staples.includes(food) ||
            diet.common_foods.includes(food) ||
            diet.proteins.includes(food) ||
            diet.fats.includes(food)
          );
        })
        .map(g => g.name);
      result.push({ food, score, ancestries });
    }
  }

  return result.slice(0, 8);
}

/**
 * Blend diets from multiple regions
 */
export function blendDiets(regionIds: string[], weights: number[]): BlendedDiet | null {
  const normalizedWeights = weights.length === regionIds.length
    ? normalizeWeights(weights)
    : Array(regionIds.length).fill(1 / regionIds.length);

  // Merge duplicate regionIds
  const regionWeightMap: Record<string, number> = {};
  regionIds.forEach((id, i) => {
    regionWeightMap[id] = (regionWeightMap[id] || 0) + normalizedWeights[i];
  });
  const mergedIds = Object.keys(regionWeightMap);
  const mergedWeights = mergedIds.map(id => regionWeightMap[id]);

  const entries = mergedIds
    .map((id, i) => ({ diet: getDietById(id), geo: getGeoById(id), weight: mergedWeights[i] }))
    .filter(e => e.diet != null && e.geo != null);

  const diets = entries.map(e => e.diet!);
  const geos = entries.map(e => e.geo!);
  const finalWeights = entries.map(e => e.weight);

  if (diets.length === 0) return null;

  const blendedMacros = diets.reduce(
    (acc, diet, idx) => {
      const w = finalWeights[idx];
      return {
        carbs_pct: acc.carbs_pct + diet.macros.carbs_pct * w,
        protein_pct: acc.protein_pct + diet.macros.protein_pct * w,
        fat_pct: acc.fat_pct + diet.macros.fat_pct * w
      };
    },
    { carbs_pct: 0, protein_pct: 0, fat_pct: 0 }
  );

  Object.keys(blendedMacros).forEach(key => {
    (blendedMacros as Record<string, number>)[key] = Math.round((blendedMacros as Record<string, number>)[key]);
  });

  const foodRegionCount: Record<string, number> = {};
  diets.forEach(diet => {
    const regionFoods = new Set([...diet.staples, ...diet.common_foods]);
    regionFoods.forEach(food => {
      foodRegionCount[food] = (foodRegionCount[food] || 0) + 1;
    });
  });

  const commonFoods = diets.length > 1
    ? Object.entries(foodRegionCount)
        .filter(([, count]) => count >= 2)
        .map(([food]) => food)
    : Object.keys(foodRegionCount);

  const allProteins = [...new Set(diets.flatMap(d => d.proteins))];
  const allFats = [...new Set(diets.flatMap(d => d.fats))];
  const allHerbs = [...new Set(diets.flatMap(d => d.herbs_spices))];
  const allCooking = [...new Set(diets.flatMap(d => d.cooking_methods))];

  return {
    diets,
    geos,
    weights: finalWeights,
    blendedMacros,
    commonFoods,
    allProteins,
    allFats,
    allHerbs,
    allCooking
  };
}

/**
 * Generate a diet archetype label for a blended diet
 */
export function generateDietArchetype(blended: BlendedDiet): string {
  if (!blended || !blended.diets.length) return '';

  const topGeo = blended.geos.reduce((best, geo, i) =>
    blended.weights[i] > blended.weights[blended.geos.indexOf(best)] ? geo : best
  );

  const name = topGeo.name || '';
  const macro = blended.blendedMacros;

  let adaptation = '';
  if (macro.fat_pct >= 40) adaptation = 'Fat-Adaptive';
  else if (macro.carbs_pct >= 55) adaptation = 'Carb-Fueled';
  else if (macro.protein_pct >= 25) adaptation = 'Protein-Rich';
  else adaptation = 'Balanced';

  return `${name} · ${adaptation}`;
}
