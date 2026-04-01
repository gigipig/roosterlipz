/**
 * Core TypeScript types for Ancestral Diet Explorer
 */

// ============================================================================
// User / Profile
// ============================================================================

export interface FamilyTree {
  maternalGrandmother: string | null;
  maternalGrandfather: string | null;
  paternalGrandmother: string | null;
  paternalGrandfather: string | null;
}

export interface DNATestEntry {
  regionId: string | null;
  percent: number;
}

export interface UserAncestry {
  mode: 'family' | 'dna';
  familyTree: FamilyTree;
  dnaTest: DNATestEntry[];
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  ancestry: UserAncestry;
  savedDiet: SavedDiet | null;
  bookmarkedRecipes: string[];
  healthConcerns: string[];
}

export interface SavedDiet {
  calculatedAt: string;
  mode: 'family' | 'dna';
  data: {
    blended: BlendedDiet;
    mendelianGenetics?: Record<string, GeneticTrait>;
  };
}

// ============================================================================
// Diet / Geo Data
// ============================================================================

export interface Macros {
  carbs_pct: number;
  protein_pct: number;
  fat_pct: number;
}

export interface DietEntry {
  id: string;
  macros: Macros;
  staples: string[];
  common_foods: string[];
  proteins: string[];
  fats: string[];
  herbs_spices: string[];
  cooking_methods: string[];
  diet_signature?: string;
  genetic_adaptations?: Record<string, unknown>;
}

export interface GeoEntry {
  id: string;
  name: string;
  culture?: string;
  [key: string]: unknown;
}

export interface BlendedDiet {
  diets: DietEntry[];
  geos: GeoEntry[];
  weights: number[];
  blendedMacros: Macros;
  commonFoods: string[];
  allProteins: string[];
  allFats: string[];
  allHerbs: string[];
  allCooking: string[];
}

// ============================================================================
// Genetics
// ============================================================================

export interface GeneticTrait {
  probability?: number | null;
  frequency?: number | null;
  copies?: number;
  efficiency?: number;
  prob_range?: { min: number; max: number };
  copy_range?: { min: number; max: number };
  phenotype?: string;
  recommendation?: string;
  allele_frequency_percent?: number | null;
  inferred_phenotype?: string;
  phenotype_details?: {
    name?: string;
    description?: string;
    dietary_impact?: string;
  };
  dietary_recommendation?: {
    recommendation?: string;
    notes?: string;
  };
  [key: string]: unknown;
}

export interface GeneMetaEntry {
  icon: string;
  title: string;
  cssClass: string;
}

export interface TraitMeterInfo {
  value: number;
  statusLabel: string;
  statusClass: 'high' | 'moderate' | 'low';
}

export interface GeneticStrength {
  icon: string;
  title: string;
  detail: string;
}

export interface GeneticAnalysis {
  strengths: GeneticStrength[];
  watchItems: GeneticStrength[];
}

export interface CategoryScore {
  id: string;
  title: string;
  icon: string;
  description: string;
  score: number;
  statusClass: 'high' | 'moderate' | 'low';
  statusLabel: string;
  traitCount: number;
}

// ============================================================================
// Recipes
// ============================================================================

export interface GeneticRelevanceEntry {
  trait: string;
  relevance: 'high' | 'moderate' | 'low';
  note?: string;
}

export interface Recipe {
  id: string;
  name: string;
  regionIds: string[];
  prepTime?: number;
  cookTime?: number;
  difficulty?: string;
  servings?: number;
  ingredients?: string[];
  instructions?: string[];
  geneticRelevance?: GeneticRelevanceEntry[];
  nutritionalHighlights?: string[];
  culturalContext?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ScoredRecipe {
  recipe: Recipe;
  score: number;
}

// ============================================================================
// Ancient Roots
// ============================================================================

export interface AncientRootsEntry {
  peoples: string[];
  era: string;
  environment: string;
  subsistence: string;
  genetic_legacy: string;
}

// ============================================================================
// Nationality / Region mappings
// ============================================================================

export interface NationalityEntry {
  id: string;
  name: string;
  regionId: string;
}

export interface NationalitiesGrouped {
  [continent: string]: NationalityEntry[];
}
