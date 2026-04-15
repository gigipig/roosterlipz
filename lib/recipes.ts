/**
 * Recipes module - pure logic (loading, scoring)
 * TypeScript port of js/recipes.js (no DOM)
 */

import type { Recipe, ScoredRecipe, BlendedDiet } from './types';
import { getTraitMeterInfo } from './genetics';

let recipesCache: Recipe[] | null = null;

export async function loadRecipes(): Promise<Recipe[]> {
  if (recipesCache) return recipesCache;
  try {
    const response = await fetch('/ancestral/recipes.json');
    if (!response.ok) throw new Error('Failed to load recipes');
    const data = await response.json();
    recipesCache = data.recipes || [];
    return recipesCache!;
  } catch (e) {
    console.warn('Could not load recipes:', e);
    recipesCache = [];
    return [];
  }
}

const NEARBY_REGIONS: Record<string, string[]> = {
  'central_europe': ['eastern_europe', 'western_europe', 'nordic'],
  'balkan': ['eastern_europe', 'med_southern', 'caucasus', 'anatolian'],
  'caucasus': ['anatolian', 'persian', 'eastern_europe'],
  'anatolian': ['med_levant', 'caucasus', 'balkan', 'med_southern'],
  'persian': ['med_levant', 'central_asia', 'arabian'],
  'arabian': ['med_levant', 'persian', 'nile_valley'],
  'mesopotamian': ['med_levant', 'persian', 'kurdish'],
  'kurdish': ['med_levant', 'anatolian', 'mesopotamian'],
  'bengal': ['north_india', 'south_india', 'se_asia_main'],
  'west_india': ['north_india', 'south_india'],
  'nepal': ['north_india', 'tibet'],
  'tibet': ['north_china', 'nepal', 'central_asia'],
  'north_china': ['south_china', 'korea', 'japan'],
  'south_china': ['north_china', 'se_asia_main', 'se_asia_island'],
  'korea': ['japan', 'north_china'],
  'se_asia_island': ['se_asia_main', 'south_china'],
  'highland_se_asia': ['se_asia_main', 'south_china'],
  'ethiopia': ['horn_somalia', 'nile_valley', 'west_africa'],
  'horn_somalia': ['ethiopia', 'arabian', 'maasai'],
  'nile_valley': ['maghreb', 'ethiopia', 'med_levant'],
  'maghreb': ['med_southern', 'nile_valley', 'west_africa'],
  'central_africa': ['west_africa', 'southern_africa'],
  'southern_africa': ['central_africa', 'west_africa'],
  'sahel': ['west_africa', 'maghreb'],
  'nilotic': ['maasai', 'ethiopia', 'central_africa'],
  'maasai': ['nilotic', 'ethiopia'],
  'andean': ['mesoamerica', 'mestizo_mesoamerican'],
  'caribbean_creole': ['west_africa', 'mesoamerica', 'mestizo_mesoamerican'],
  'caribbean_taino': ['mesoamerica', 'caribbean_creole'],
  'amazon': ['andean', 'mesoamerica'],
  'brazilian_coastal': ['andean', 'west_africa', 'med_southern'],
  'gaucho': ['andean', 'med_southern'],
  'patagonia': ['gaucho', 'andean'],
  'inuit': ['nordic', 'subarctic'],
  'pacific_nw': ['subarctic', 'japan'],
  'great_plains': ['eastern_woodlands', 'southwest_us'],
  'eastern_woodlands': ['great_plains', 'western_europe'],
  'southwest_us': ['mesoamerica', 'great_plains'],
  'subarctic': ['inuit', 'nordic'],
  'polynesia': ['se_asia_island', 'melanesia'],
  'melanesia': ['se_asia_island', 'polynesia'],
  'micronesia': ['se_asia_island', 'polynesia'],
  'aboriginal_aus': ['melanesia', 'se_asia_island'],
  'maori': ['polynesia'],
  'mongolia': ['central_asia', 'north_china'],
  'siberia': ['mongolia', 'central_asia', 'inuit'],
  'central_asia': ['persian', 'mongolia', 'north_china'],
  'canadian_prairies': ['great_plains', 'western_europe'],
  'california_coast': ['southwest_us', 'mesoamerica'],
  'southeast_us': ['eastern_woodlands', 'west_africa'],
  'mestizo_mesoamerican': ['mesoamerica', 'med_southern'],
  'malagasy': ['se_asia_island', 'southern_africa'],
  'sudanian': ['sahel', 'west_africa'],
  'australian_coastal': ['aboriginal_aus', 'se_asia_island'],
  'sichuan_sw_china': ['south_china', 'north_china', 'se_asia_main']
};

export function calculateRecipeGeneticScore(recipe: Recipe, mendelianGenetics: Record<string, unknown>): number {
  if (!recipe.geneticRelevance || !recipe.geneticRelevance.length) return 50;

  const relevanceWeights: Record<string, number> = { high: 3, moderate: 2, low: 1 };
  let totalWeight = 0;
  let weightedScore = 0;

  recipe.geneticRelevance.forEach(gr => {
    const weight = relevanceWeights[gr.relevance] || 1;
    totalWeight += weight;

    const trait = mendelianGenetics[gr.trait];
    if (!trait) {
      weightedScore += weight * 50;
      return;
    }

    const meterInfo = getTraitMeterInfo(gr.trait, trait);
    if (meterInfo) {
      weightedScore += weight * meterInfo.value;
    } else {
      weightedScore += weight * 50;
    }
  });

  if (totalWeight === 0) return 50;
  return Math.round(weightedScore / totalWeight);
}

export function getScoreLevel(score: number): { label: string; cssClass: string } {
  if (score >= 65) return { label: 'Great Match', cssClass: 'recipe-score-high' };
  if (score >= 40) return { label: 'Good Match', cssClass: 'recipe-score-moderate' };
  return { label: 'Try It', cssClass: 'recipe-score-low' };
}

export async function getRecipesForUser(
  blended: BlendedDiet,
  mendelianGenetics?: Record<string, unknown>
): Promise<ScoredRecipe[]> {
  const recipes = await loadRecipes();
  if (!recipes.length) return [];

  const userRegionIds = blended.diets.map(d => d.id).filter(Boolean);
  if (!userRegionIds.length) return [];

  let matched = recipes.filter(recipe =>
    recipe.regionIds?.some(rid => userRegionIds.includes(rid))
  );

  if (matched.length === 0) {
    const nearbyIds = new Set<string>();
    userRegionIds.forEach(rid => {
      (NEARBY_REGIONS[rid] || []).forEach(n => nearbyIds.add(n));
    });
    matched = recipes.filter(recipe =>
      recipe.regionIds?.some(rid => nearbyIds.has(rid))
    );
  }

  const scored = matched.map(recipe => ({
    recipe,
    score: mendelianGenetics
      ? calculateRecipeGeneticScore(recipe, mendelianGenetics)
      : 50
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored;
}
