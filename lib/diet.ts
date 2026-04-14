/**
 * Diet module - pure diet blending calculation
 * TypeScript port of js/diet.js (calculation only, no DOM)
 */

import { getDietById, getGeoById, normalizeWeights } from './data';
import { getFoodExplanations, GENE_META, legacyKeyMap } from './genetics';
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
    const isAncestral =
      blended.commonFoods.includes(food) ||
      blended.allProteins.includes(food) ||
      blended.allFats.includes(food) ||
      blended.allHerbs.includes(food);
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

// ============================================================================
// Trait-level genetic food callouts
// ============================================================================

interface TraitCalloutDef {
  foods: string[];
  strengthNote: string;
  watchNote: string;
  isStrength: (t: Record<string, unknown>) => boolean;
  isWatch: (t: Record<string, unknown>) => boolean;
}

function getFreq(t: Record<string, unknown>): number {
  return ((t.frequency as number) || (t.allele_frequency_percent as number) || 0);
}

const TRAIT_FOOD_CALLOUTS: Record<string, TraitCalloutDef> = {
  pufa_metabolism: {
    foods: ['salmon', 'mackerel', 'sardines', 'herring', 'anchovies', 'tuna', 'trout', 'walnuts', 'flaxseed', 'chia seeds', 'hemp seeds', 'fatty fish'],
    strengthNote: 'Your ancestry carries strong omega-3 conversion variants — fatty fish and omega-3-rich seeds from your heritage are especially well-matched to your metabolism.',
    watchNote: 'Your ancestry suggests reduced omega-3 conversion capacity — regular consumption of fatty fish from your heritage helps compensate by providing pre-formed EPA and DHA.',
    isStrength: t => getFreq(t) >= 55,
    isWatch: t => getFreq(t) < 40,
  },
  lactase_persistence: {
    foods: ['milk', 'yoghurt', 'cheese', 'kefir', 'butter', 'ghee', 'cream', 'dairy', 'fermented dairy', 'cultured milk', 'labneh'],
    strengthNote: 'Your ancestry has high rates of lactase persistence — dairy and fermented dairy from your heritage are well-tolerated and culturally meaningful.',
    watchNote: 'Your ancestry has lower lactase persistence — fermented dairy (yoghurt, kefir) is typically much better tolerated than fresh milk as fermentation breaks down lactose.',
    isStrength: t => getFreq(t) >= 60,
    isWatch: t => getFreq(t) < 35,
  },
  starch_digestion: {
    foods: ['oats', 'barley', 'rice', 'potatoes', 'bread', 'wheat', 'millet', 'cassava', 'yam', 'sweet potato', 'taro', 'porridge', 'polenta'],
    strengthNote: 'Your ancestry has strong starch-digesting AMY1 variants — whole grain staples and root vegetables from your heritage are excellent, well-matched fuel sources.',
    watchNote: 'Your ancestry suggests lower AMY1 copy number — refined starches may cause sharper blood sugar swings; favour whole grains and legumes from your heritage.',
    isStrength: t => getFreq(t) >= 55,
    isWatch: t => getFreq(t) < 35,
  },
  hfe_iron_overload: {
    foods: ['red meat', 'liver', 'organ meat', 'shellfish', 'mussels', 'oysters', 'beef', 'lamb', 'pork', 'black pudding'],
    strengthNote: '',
    watchNote: 'Your ancestry carries iron-accumulation variants — limit high-haem iron foods like red meat and organ meats; pair with plant foods or tea to moderate absorption.',
    isStrength: () => false,
    isWatch: t => getFreq(t) >= 20,
  },
  mthfr_folate: {
    foods: ['lentils', 'spinach', 'asparagus', 'broccoli', 'chickpeas', 'edamame', 'leafy greens', 'kale', 'beetroot', 'dark leafy greens', 'black-eyed peas'],
    strengthNote: 'Your ancestry has efficient folate metabolism — folate-rich legumes and greens from your heritage support optimal methylation.',
    watchNote: 'Your ancestry carries MTHFR variants that reduce folate conversion — prioritise leafy greens and legumes from your heritage as natural folate sources.',
    isStrength: t => getFreq(t) >= 60,
    isWatch: t => getFreq(t) < 40,
  },
  antioxidant_capacity: {
    foods: ['blueberries', 'turmeric', 'garlic', 'dark chocolate', 'berries', 'green tea', 'pomegranate', 'olive oil', 'herbs', 'spices', 'red wine', 'blackcurrants'],
    strengthNote: 'Your ancestry has strong antioxidant genetics — colourful plant foods and herbs from your tradition provide excellent free-radical protection.',
    watchNote: 'Your ancestry shows lower intrinsic antioxidant capacity — antioxidant-rich foods from your heritage (berries, turmeric, garlic) are especially important.',
    isStrength: t => getFreq(t) >= 55,
    isWatch: t => getFreq(t) < 35,
  },
  salt_sensitivity: {
    foods: ['salt', 'cured meats', 'soy sauce', 'miso', 'pickled vegetables', 'anchovies', 'olives', 'kimchi', 'sauerkraut', 'salted fish', 'preserved foods', 'brine'],
    strengthNote: '',
    watchNote: 'Your ancestry carries salt-sensitivity variants — preserved and fermented foods in your tradition are culturally important but worth moderating in quantity.',
    isStrength: () => false,
    isWatch: t => getFreq(t) >= 30,
  },
  glucose_metabolism: {
    foods: ['cinnamon', 'oats', 'lentils', 'barley', 'chickpeas', 'vinegar', 'berries', 'legumes', 'brown rice', 'whole grains', 'bitter melon'],
    strengthNote: 'Your ancestry has efficient glucose metabolism — complex carbohydrates from your heritage provide steady, well-regulated energy.',
    watchNote: 'Your ancestry suggests glucose metabolism variants — foods like oats, lentils and cinnamon from your heritage help moderate blood sugar response.',
    isStrength: t => getFreq(t) >= 55,
    isWatch: t => getFreq(t) < 40,
  },
  vitamin_d_metabolism: {
    foods: ['salmon', 'mackerel', 'herring', 'sardines', 'eggs', 'mushrooms', 'cod liver oil', 'trout', 'tuna', 'fortified milk', 'liver'],
    strengthNote: 'Your ancestry has efficient vitamin D metabolism — dietary vitamin D from fish and eggs in your heritage is well-utilised.',
    watchNote: 'Your ancestry shows reduced vitamin D metabolism efficiency — regular consumption of vitamin D-rich foods from your heritage is especially important.',
    isStrength: t => getFreq(t) >= 55,
    isWatch: t => getFreq(t) < 40,
  },
  saturated_fat_response: {
    foods: ['beef', 'lamb', 'pork', 'butter', 'lard', 'tallow', 'ghee', 'cream', 'coconut oil', 'olive oil', 'avocado', 'duck fat'],
    strengthNote: 'Your ancestry handles dietary saturated fat efficiently — traditional animal fats in your heritage can be consumed thoughtfully in their cultural context.',
    watchNote: 'Your ancestry carries variants linked to heightened saturated fat response — favour olive oil and plant-based fats over animal fats where possible.',
    isStrength: t => getFreq(t) >= 60,
    isWatch: t => getFreq(t) < 35,
  },
  bitter_taste_perception: {
    foods: ['broccoli', 'cauliflower', 'kale', 'brussels sprouts', 'arugula', 'radicchio', 'rocket', 'cabbage', 'mustard greens', 'bitter melon', 'chicory', 'watercress'],
    strengthNote: 'Your ancestry has high bitter taste sensitivity — cruciferous vegetables from your tradition (broccoli, kale) are excellent detox foods you\'re primed to appreciate.',
    watchNote: 'Your ancestry has lower bitter taste sensitivity — cruciferous vegetables from your tradition can be eaten freely without the bitterness barrier others experience.',
    isStrength: t => getFreq(t) >= 55,
    isWatch: t => getFreq(t) < 30,
  },
  alcohol_metabolism: {
    foods: ['wine', 'beer', 'fermented beverages', 'sake', 'kefir', 'kombucha', 'vinegar', 'sourdough', 'mead', 'kvass'],
    strengthNote: '',
    watchNote: 'Your ancestry carries slower alcohol metabolism variants — fermented beverages in your tradition are best enjoyed in smaller quantities and with food.',
    isStrength: () => false,
    isWatch: t => getFreq(t) < 40,
  },
};

export type TraitCallout = {
  traitKey: string;
  icon: string;
  title: string;
  note: string;
  matchedFoods: string[];
  isWatch: boolean;
};

/**
 * For each curated trait in TRAIT_FOOD_CALLOUTS, check whether the user's genetics
 * show a strength or watch pattern, then intersect the trait's candidate foods with
 * the user's blended diet. Returns strengths first, max 6 total.
 */
export function getTraitFoodCallouts(
  blended: BlendedDiet,
  genetics: Record<string, unknown>
): TraitCallout[] {
  // Build a set of all blended foods (lowercase) for matching
  const allBlendedFoods = [
    ...blended.commonFoods,
    ...blended.allProteins,
    ...blended.allFats,
    ...blended.allHerbs,
  ].map(f => f.toLowerCase());

  const strengths: TraitCallout[] = [];
  const watches: TraitCallout[] = [];

  const legacyMap = legacyKeyMap as Record<string, string>;
  // reverse map: displayKey → calcKey
  const reverseMap: Record<string, string> = {};
  for (const [calcKey, displayKey] of Object.entries(legacyMap)) {
    reverseMap[displayKey] = calcKey;
  }

  for (const [traitKey, def] of Object.entries(TRAIT_FOOD_CALLOUTS)) {
    // Try the display key first, then the calc key via reverse map
    let traitData = genetics[traitKey] as Record<string, unknown> | undefined;
    if (!traitData) {
      const calcKey = reverseMap[traitKey];
      if (calcKey) traitData = genetics[calcKey] as Record<string, unknown> | undefined;
    }
    if (!traitData || typeof traitData !== 'object') continue;

    // Intersect candidate foods with blended diet (case-insensitive partial match)
    const matchedFoods = def.foods.filter(candidate => {
      const c = candidate.toLowerCase();
      return allBlendedFoods.some(bf => bf.includes(c) || c.includes(bf));
    });
    if (matchedFoods.length === 0) continue;

    const meta = (GENE_META as Record<string, { icon: string; title: string }>)[traitKey] || {
      icon: '🧬',
      title: traitKey.replace(/_/g, ' '),
    };

    if (def.isStrength(traitData) && def.strengthNote) {
      strengths.push({
        traitKey,
        icon: meta.icon,
        title: meta.title,
        note: def.strengthNote,
        matchedFoods: matchedFoods.slice(0, 6),
        isWatch: false,
      });
    } else if (def.isWatch(traitData) && def.watchNote) {
      watches.push({
        traitKey,
        icon: meta.icon,
        title: meta.title,
        note: def.watchNote,
        matchedFoods: matchedFoods.slice(0, 6),
        isWatch: true,
      });
    }
  }

  return [...strengths, ...watches].slice(0, 6);
}

// ============================================================================
// Ancestry-based food tiering (replaces genetics-scored tiering)
// ============================================================================

export interface AncestryFoodEntry { food: string; count: number }
export interface AncestryTieredGroups {
  enjoy: AncestryFoodEntry[];
  minimize: AncestryFoodEntry[];
  avoid: AncestryFoodEntry[];
}

/**
 * Split foods into enjoy (2+ ancestries) and minimize/Regional (1 ancestry).
 * `avoid` is always empty — kept for shape compatibility with TieredFoodSection.
 */
export function tieredFoodGroupsByAncestry(
  foods: string[],
  blended: BlendedDiet
): AncestryTieredGroups {
  const enjoy: AncestryFoodEntry[] = [];
  const minimize: AncestryFoodEntry[] = [];

  for (const food of foods) {
    const foodLower = food.toLowerCase();
    let count = 0;
    for (const diet of blended.diets) {
      const dietFoods = [
        ...(diet.staples || []),
        ...(diet.common_foods || []),
        ...(diet.proteins || []),
        ...(diet.fats || []),
        ...(diet.herbs_spices || []),
      ];
      if (dietFoods.some(f => f.toLowerCase() === foodLower)) {
        count++;
      }
    }
    if (count >= 2) {
      enjoy.push({ food, count });
    } else {
      minimize.push({ food, count });
    }
  }

  return { enjoy, minimize, avoid: [] };
}
