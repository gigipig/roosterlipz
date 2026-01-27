/**
 * Genetics module - Mendelian inheritance calculations and rendering
 */

// ============================================================================
// FOOD-GENETICS MAPPING - Links foods to relevant genetic traits
// ============================================================================

/**
 * Maps food names/categories to relevant genetic traits
 * Used to generate "Why this food?" explanations
 */
const FOOD_GENETICS_MAP = {
  // Dairy products → Lactase persistence
  dairy: ['lactase_persistence'],
  milk: ['lactase_persistence'],
  yogurt: ['lactase_persistence'],
  cheese: ['lactase_persistence'],
  butter: ['lactase_persistence', 'saturated_fat_response'],
  cream: ['lactase_persistence', 'saturated_fat_response'],
  kefir: ['lactase_persistence'],
  'fermented dairy': ['lactase_persistence'],
  ghee: ['saturated_fat_response'],

  // Grains/Starches → AMY1 starch digestion
  wheat: ['starch_digestion'],
  rice: ['starch_digestion'],
  barley: ['starch_digestion'],
  oats: ['starch_digestion'],
  rye: ['starch_digestion'],
  millet: ['starch_digestion'],
  sorghum: ['starch_digestion'],
  teff: ['starch_digestion'],
  bulgur: ['starch_digestion'],
  bread: ['starch_digestion', 'celiac_susceptibility'],
  grains: ['starch_digestion'],
  cereals: ['starch_digestion'],
  pasta: ['starch_digestion', 'celiac_susceptibility'],
  noodles: ['starch_digestion'],
  potatoes: ['starch_digestion'],
  'sweet potatoes': ['starch_digestion', 'beta_carotene_conversion'],
  cassava: ['starch_digestion'],
  yams: ['starch_digestion'],
  taro: ['starch_digestion'],
  maize: ['starch_digestion'],
  corn: ['starch_digestion'],

  // Fatty fish → PUFA/Omega-3 metabolism + Vitamin D
  fish: ['pufa_metabolism', 'vitamin_d_metabolism'],
  salmon: ['pufa_metabolism', 'vitamin_d_metabolism'],
  sardines: ['pufa_metabolism', 'vitamin_d_metabolism'],
  herring: ['pufa_metabolism', 'vitamin_d_metabolism'],
  mackerel: ['pufa_metabolism', 'vitamin_d_metabolism'],
  anchovies: ['pufa_metabolism'],
  'fatty fish': ['pufa_metabolism', 'vitamin_d_metabolism'],
  'fish oil': ['pufa_metabolism'],
  'fermented fish': ['pufa_metabolism'],

  // Plant omega-3 sources
  flax: ['pufa_metabolism'],
  chia: ['pufa_metabolism'],
  walnuts: ['pufa_metabolism'],
  'hemp seeds': ['pufa_metabolism'],

  // Fats and oils
  'olive oil': ['saturated_fat_response', 'hdl_metabolism'],
  lard: ['saturated_fat_response'],
  tallow: ['saturated_fat_response'],
  'animal fats': ['saturated_fat_response'],
  'coconut oil': ['saturated_fat_response'],
  'palm oil': ['saturated_fat_response'],

  // Red meat → Iron metabolism
  beef: ['iron_metabolism', 'saturated_fat_response'],
  lamb: ['iron_metabolism', 'saturated_fat_response'],
  goat: ['iron_metabolism'],
  venison: ['iron_metabolism'],
  'red meat': ['iron_metabolism', 'saturated_fat_response'],
  game: ['iron_metabolism'],

  // Organ meats
  liver: ['iron_metabolism', 'vitamin_b12_absorption', 'beta_carotene_conversion'],
  'organ meats': ['iron_metabolism', 'vitamin_b12_absorption'],

  // Cruciferous vegetables
  broccoli: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception'],
  cabbage: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception'],
  kale: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception', 'beta_carotene_conversion'],
  'brussels sprouts': ['cruciferous_metabolism_gstm1', 'bitter_taste_perception'],
  cauliflower: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1'],

  // Leafy greens → Folate
  spinach: ['folate_metabolism', 'iron_metabolism'],
  'leafy greens': ['folate_metabolism', 'beta_carotene_conversion'],
  greens: ['folate_metabolism'],
  chard: ['folate_metabolism'],

  // Beta-carotene rich foods
  carrots: ['beta_carotene_conversion'],
  'sweet potato': ['beta_carotene_conversion', 'starch_digestion'],
  pumpkin: ['beta_carotene_conversion'],
  squash: ['beta_carotene_conversion'],

  // Caffeine
  coffee: ['caffeine_metabolism'],
  tea: ['caffeine_metabolism'],

  // Alcohol-related
  wine: ['alcohol_metabolism'],
  beer: ['alcohol_metabolism'],
  'fermented beverages': ['alcohol_metabolism'],

  // Salt-rich/preserved foods
  'preserved fish': ['salt_sensitivity'],
  'salted fish': ['salt_sensitivity'],
  'fermented vegetables': ['salt_sensitivity'],
  'pickled foods': ['salt_sensitivity'],

  // Eggs → multiple nutrients
  eggs: ['vitamin_d_metabolism', 'vitamin_b12_absorption', 'beta_carotene_conversion'],

  // Legumes
  legumes: ['starch_digestion', 'folate_metabolism'],
  lentils: ['folate_metabolism', 'iron_metabolism'],
  beans: ['starch_digestion', 'folate_metabolism'],
  chickpeas: ['starch_digestion', 'folate_metabolism'],

  // Nuts (general)
  nuts: ['pufa_metabolism'],
  almonds: ['vitamin_d_transport'],

  // Berries and antioxidant-rich foods
  berries: ['antioxidant_capacity'],
  'dark berries': ['antioxidant_capacity'],
  blueberries: ['antioxidant_capacity'],

  // Seafood (shellfish)
  shellfish: ['vitamin_b12_absorption', 'iron_metabolism'],
  oysters: ['iron_metabolism', 'vitamin_b12_absorption'],
  mussels: ['iron_metabolism', 'vitamin_b12_absorption'],
  crab: ['vitamin_b12_absorption', 'pufa_metabolism'],
  shrimp: ['vitamin_b12_absorption', 'pufa_metabolism'],
  abalone: ['vitamin_b12_absorption', 'iron_metabolism'],

  // Game meats
  kangaroo: ['iron_metabolism'],
  emu: ['iron_metabolism'],
  'wild game': ['iron_metabolism'],
  venison: ['iron_metabolism'],
  bison: ['iron_metabolism'],
  'guinea pig': ['iron_metabolism'],
  rabbit: ['iron_metabolism'],
  duck: ['iron_metabolism', 'pufa_metabolism'],
  goose: ['iron_metabolism', 'saturated_fat_response'],

  // Poultry
  chicken: ['vitamin_b12_absorption'],
  turkey: ['vitamin_b12_absorption'],
  poultry: ['vitamin_b12_absorption'],

  // Camelids and specialty meats
  camel: ['iron_metabolism'],
  'camel meat': ['iron_metabolism'],
  llama: ['iron_metabolism'],
  alpaca: ['iron_metabolism'],

  // Additional dairy variations
  'camel milk': ['lactase_persistence'],
  'goat milk': ['lactase_persistence'],
  'sheep milk': ['lactase_persistence'],
  'fermented milk': ['lactase_persistence'],
  skyr: ['lactase_persistence'],
  lassi: ['lactase_persistence'],
  ayran: ['lactase_persistence'],
  'white cheese': ['lactase_persistence'],
  feta: ['lactase_persistence'],
  'clotted cream': ['lactase_persistence', 'saturated_fat_response'],
  kajmak: ['lactase_persistence', 'saturated_fat_response'],

  // Additional grains and starches
  quinoa: ['starch_digestion'],
  amaranth: ['starch_digestion'],
  buckwheat: ['starch_digestion'],
  spelt: ['starch_digestion', 'celiac_susceptibility'],
  farro: ['starch_digestion', 'celiac_susceptibility'],
  couscous: ['starch_digestion'],
  plantains: ['starch_digestion'],
  breadfruit: ['starch_digestion'],
  sago: ['starch_digestion'],
  tapioca: ['starch_digestion'],
  roots: ['starch_digestion'],
  tubers: ['starch_digestion'],
  'native tubers': ['starch_digestion'],

  // Additional vegetables
  eggplant: ['antioxidant_capacity'],
  peppers: ['beta_carotene_conversion', 'antioxidant_capacity'],
  'bell peppers': ['beta_carotene_conversion'],
  tomatoes: ['antioxidant_capacity'],
  okra: ['folate_metabolism'],
  'collard greens': ['folate_metabolism', 'cruciferous_metabolism_gstm1'],
  'mustard greens': ['folate_metabolism', 'cruciferous_metabolism_gstm1'],
  seaweed: ['iron_metabolism', 'vitamin_b12_absorption'],
  kelp: ['iron_metabolism'],
  nori: ['vitamin_b12_absorption'],

  // Fermented foods
  'fermented vegetables': ['salt_sensitivity'],
  kimchi: ['salt_sensitivity', 'cruciferous_metabolism_gstm1'],
  sauerkraut: ['cruciferous_metabolism_gstm1', 'salt_sensitivity'],
  miso: ['salt_sensitivity'],
  tempeh: ['vitamin_b12_absorption'],
  natto: ['vitamin_b12_absorption'],

  // Oils and fats
  'mustard oil': ['pufa_metabolism'],
  'sesame oil': ['pufa_metabolism'],
  'fish oils': ['pufa_metabolism', 'vitamin_d_metabolism'],
  'palm oil': ['saturated_fat_response', 'beta_carotene_conversion'],
  'dende oil': ['saturated_fat_response', 'beta_carotene_conversion'],
  'emu fat': ['saturated_fat_response'],
  'camel fat': ['saturated_fat_response'],

  // Fruits
  dates: ['starch_digestion', 'glucose_metabolism'],
  'dried fruits': ['glucose_metabolism'],
  figs: ['glucose_metabolism'],
  mango: ['beta_carotene_conversion'],
  papaya: ['beta_carotene_conversion'],
  'tropical fruits': ['antioxidant_capacity'],
  'bush fruits': ['antioxidant_capacity'],
  coconut: ['saturated_fat_response'],
  'coconut milk': ['saturated_fat_response'],
  'coconut oil': ['saturated_fat_response'],

  // Insects (protein source)
  insects: ['iron_metabolism'],
  'witchetty grubs': ['iron_metabolism'],

  // Seeds
  seeds: ['pufa_metabolism'],
  'pumpkin seeds': ['iron_metabolism'],
  'sunflower seeds': ['pufa_metabolism'],
  sesame: ['iron_metabolism'],
  'native seeds': ['starch_digestion'],

  // Additional fish varieties
  cod: ['pufa_metabolism', 'vitamin_d_metabolism'],
  codfish: ['pufa_metabolism', 'vitamin_d_metabolism'],
  tuna: ['pufa_metabolism', 'vitamin_b12_absorption'],
  trout: ['pufa_metabolism', 'vitamin_d_metabolism'],
  carp: ['pufa_metabolism'],
  catfish: ['pufa_metabolism'],
  tilapia: ['pufa_metabolism'],
  hilsa: ['pufa_metabolism'],
  mullet: ['pufa_metabolism'],
  bream: ['pufa_metabolism'],
  snapper: ['pufa_metabolism'],

  // Organ meats and specialty
  'bone marrow': ['iron_metabolism', 'saturated_fat_response'],
  'blood sausage': ['iron_metabolism'],
  'dried meat': ['iron_metabolism', 'salt_sensitivity'],
  jerky: ['iron_metabolism', 'salt_sensitivity'],
  pemmican: ['iron_metabolism', 'saturated_fat_response']
};

/**
 * Normalize food name for matching (handles underscores, spaces, case)
 * @param {string} food - Raw food name
 * @returns {string} Normalized food name
 */
function normalizeFood(food) {
  return food.toLowerCase().trim().replace(/_/g, ' ');
}

/**
 * Get genetic explanations for a food item
 * @param {string} food - The food name
 * @param {Object} mendelianGenetics - The user's calculated genetic profile
 * @returns {Array} Array of explanation objects with trait info
 */
function getFoodExplanations(food, mendelianGenetics) {
  if (!food || !mendelianGenetics) return [];

  const normalizedFood = normalizeFood(food);

  // Find matching genetic traits for this food
  let matchedTraits = [];

  // Direct match (check both original and normalized versions)
  if (FOOD_GENETICS_MAP[normalizedFood]) {
    matchedTraits = FOOD_GENETICS_MAP[normalizedFood];
  } else {
    // Check all map keys with normalization
    for (const [foodKey, traits] of Object.entries(FOOD_GENETICS_MAP)) {
      const normalizedKey = normalizeFood(foodKey);
      if (normalizedFood === normalizedKey) {
        matchedTraits = traits;
        break;
      }
    }
  }

  // If no direct match, try partial matching
  if (matchedTraits.length === 0) {
    for (const [foodKey, traits] of Object.entries(FOOD_GENETICS_MAP)) {
      const normalizedKey = normalizeFood(foodKey);
      if (normalizedFood.includes(normalizedKey) || normalizedKey.includes(normalizedFood)) {
        matchedTraits = [...new Set([...matchedTraits, ...traits])];
      }
    }
  }

  if (matchedTraits.length === 0) return [];

  // Build explanations from user's genetic profile
  const explanations = [];

  // Map of genetics result keys to their trait keys
  const keyMap = {
    lactase: 'lactase_persistence',
    amy1: 'starch_digestion',
    fads: 'pufa_metabolism',
    slc24a5: 'vitamin_d_metabolism',
    aldh2: 'alcohol_metabolism',
    crebrf: 'polynesian_energy_storage',
    cpt1a: 'arctic_fat_metabolism'
  };

  // Reverse map for lookup
  const reverseKeyMap = {};
  for (const [k, v] of Object.entries(keyMap)) {
    reverseKeyMap[v] = k;
  }

  for (const traitKey of matchedTraits) {
    // Find the trait in user's genetics (check both direct key and mapped key)
    const lookupKey = reverseKeyMap[traitKey] || traitKey;
    const trait = mendelianGenetics[lookupKey] || mendelianGenetics[traitKey];

    if (trait) {
      const meta = GENE_META[traitKey] || GENE_META[lookupKey] || { icon: '🧬', title: traitKey };

      let percentage = '';
      if (trait.probability !== null && trait.probability !== undefined) {
        percentage = `${(trait.probability * 100).toFixed(0)}%`;
      } else if (trait.frequency !== null && trait.frequency !== undefined) {
        percentage = `${trait.frequency.toFixed(0)}%`;
      } else if (trait.efficiency !== null && trait.efficiency !== undefined) {
        percentage = `${trait.efficiency.toFixed(0)}%`;
      } else if (trait.copies) {
        percentage = `${trait.copies.toFixed(1)} copies`;
      }

      explanations.push({
        traitKey,
        icon: meta.icon,
        title: meta.title,
        phenotype: trait.phenotype,
        percentage,
        shortReason: getShortReason(traitKey, trait)
      });
    }
  }

  return explanations;
}

/**
 * Get a short reason explaining why a food relates to a genetic trait
 */
function getShortReason(traitKey, trait) {
  const reasons = {
    lactase_persistence: trait.phenotype === 'Lactase Persistent'
      ? 'You digest lactose well'
      : 'Consider fermented forms',
    starch_digestion: trait.copies >= 7
      ? 'High starch tolerance'
      : 'Moderate starch digestion',
    pufa_metabolism: trait.efficiency >= 70
      ? 'Good omega-3 conversion'
      : 'Direct omega-3 sources help',
    vitamin_d_metabolism: 'Supports vitamin D needs',
    saturated_fat_response: 'Matches fat metabolism',
    iron_metabolism: 'Supports iron balance',
    folate_metabolism: 'Supports folate needs',
    caffeine_metabolism: trait.phenotype?.includes('Slow')
      ? 'Metabolize slowly - limit intake'
      : 'Normal caffeine processing',
    alcohol_metabolism: 'Related to alcohol processing',
    beta_carotene_conversion: 'Vitamin A source',
    celiac_susceptibility: 'Monitor gluten response',
    bitter_taste_perception: trait.phenotype === 'Supertaster'
      ? 'May taste bitter to you'
      : 'Tastes milder for you',
    cruciferous_metabolism_gstm1: 'Detox enzyme support',
    cruciferous_metabolism_gstt1: 'Detox enzyme support',
    hdl_metabolism: 'Heart-healthy fats',
    vitamin_b12_absorption: 'B12 source',
    antioxidant_capacity: 'Antioxidant support',
    salt_sensitivity: 'Watch sodium intake'
  };

  return reasons[traitKey] || 'Genetically relevant';
}

// ============================================================================
// GENE CONFIGURATION - Add new genes here for automatic support
// ============================================================================

/**
 * Glossary definitions for genetic terms - shown as tooltips for education
 */
const GENE_GLOSSARY = {
  // Core metabolic traits
  lactase_persistence: {
    term: 'Lactase Persistence',
    definition: 'The ability to digest lactose (milk sugar) into adulthood. Most mammals lose this ability after weaning, but some human populations evolved to keep producing lactase enzyme throughout life.',
    gene: 'LCT gene',
    inheritance: 'Dominant - one copy of the variant is enough to digest lactose'
  },
  starch_digestion: {
    term: 'AMY1 Copy Number',
    definition: 'AMY1 genes produce salivary amylase, which breaks down starches. People can have 2-15+ copies of this gene. More copies = better starch digestion and higher carb tolerance.',
    gene: 'AMY1 gene',
    inheritance: 'Additive - more copies means more enzyme production'
  },
  pufa_metabolism: {
    term: 'Omega-3 Conversion (FADS1)',
    definition: 'Your ability to convert plant omega-3s (ALA from flax, chia) into the active forms (EPA/DHA) your body needs. Some people convert efficiently; others need direct marine sources.',
    gene: 'FADS1/FADS2 genes',
    inheritance: 'Additive - efficiency varies with genotype'
  },
  vitamin_d_metabolism: {
    term: 'Vitamin D Synthesis',
    definition: 'Related to skin pigmentation. Lighter skin produces vitamin D more efficiently from sunlight but burns easily. Darker skin is protective but may need more dietary vitamin D.',
    gene: 'SLC24A5 gene',
    inheritance: 'Additive - affects pigmentation level'
  },

  // Nutrient metabolism
  caffeine_metabolism: {
    term: 'Caffeine Metabolism',
    definition: 'How quickly your liver breaks down caffeine. Slow metabolizers feel effects longer and may experience anxiety or sleep issues. Fast metabolizers clear caffeine quickly.',
    gene: 'CYP1A2 gene',
    inheritance: 'Additive - determines enzyme activity level'
  },
  saturated_fat_response: {
    term: 'Saturated Fat Response',
    definition: 'How your cholesterol levels respond to dietary saturated fat. Some people show large increases in LDL cholesterol; others are less affected.',
    gene: 'APOE gene',
    inheritance: 'Varies by variant'
  },
  folate_metabolism: {
    term: 'Folate Metabolism (MTHFR)',
    definition: 'Your ability to convert folate (B9) into its active form. Reduced function may increase homocysteine levels and affect pregnancy health.',
    gene: 'MTHFR gene',
    inheritance: 'Additive - two copies cause greater reduction'
  },
  iron_metabolism: {
    term: 'Iron Metabolism (HFE)',
    definition: 'Related to hemochromatosis, where the body absorbs too much iron. Excess iron can damage organs over time.',
    gene: 'HFE gene',
    inheritance: 'Recessive - usually need two copies for clinical effect'
  },
  glucose_metabolism: {
    term: 'Glucose Metabolism (TCF7L2)',
    definition: 'Affects insulin secretion and blood sugar regulation. The risk variant is associated with higher Type 2 diabetes risk.',
    gene: 'TCF7L2 gene',
    inheritance: 'Additive - each copy increases risk slightly'
  },
  celiac_susceptibility: {
    term: 'Celiac Susceptibility',
    definition: 'Having HLA-DQ2 or HLA-DQ8 is necessary but not sufficient for celiac disease. About 30% of people carry these genes, but only 1-3% develop celiac.',
    gene: 'HLA-DQ genes',
    inheritance: 'Genetic predisposition, not deterministic'
  },
  bitter_taste_perception: {
    term: 'Bitter Taste Perception',
    definition: '"Supertasters" perceive bitter compounds in cruciferous vegetables, coffee, and grapefruit more intensely. This may affect food preferences.',
    gene: 'TAS2R38 gene',
    inheritance: 'Dominant - one copy creates supertaster phenotype'
  },

  // Population-specific
  alcohol_metabolism: {
    term: 'Alcohol Flush Response (ALDH2)',
    definition: 'Common in East Asian populations. Causes facial flushing, rapid heartbeat, and nausea with alcohol due to acetaldehyde buildup.',
    gene: 'ALDH2 gene',
    inheritance: 'Dominant-negative - one copy causes the flush response'
  },
  arctic_fat_metabolism: {
    term: 'Arctic Fat Metabolism (CPT1A)',
    definition: 'Found in Inuit and some Siberian populations. Optimizes fat metabolism for very high-fat, low-carb diets traditional to Arctic regions.',
    gene: 'CPT1A gene',
    inheritance: 'Recessive - two copies for full adaptation'
  },
  polynesian_energy_storage: {
    term: 'Thrifty Gene (CREBRF)',
    definition: 'Found in Polynesian populations. Promotes efficient energy storage, which was beneficial for long ocean voyages but may increase obesity risk with modern diets.',
    gene: 'CREBRF gene',
    inheritance: 'Additive'
  },
  altitude_adaptation_epas1: {
    term: 'High-Altitude Adaptation',
    definition: 'Found in Tibetan populations (inherited from Denisovans). Prevents excessive red blood cell production at high altitude, reducing blood thickness.',
    gene: 'EPAS1 gene',
    inheritance: 'Additive'
  }
};

// ============================================================================
// GENE SOURCES - Scientific citations for each genetic trait
// ============================================================================

/**
 * Maps genetic traits to their scientific sources and citations
 * Used to generate the Sources section at the bottom of results
 */
const GENE_SOURCES = {
  // Core metabolic traits
  lactase_persistence: {
    snp: 'rs4988235',
    studies: [
      'Enattah et al. (2002) Nature Genetics - Identification of lactase persistence variant in MCM6 regulatory region',
      'Ingram et al. (2009) European Journal of Human Genetics - Global distribution of lactase persistence alleles'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  starch_digestion: {
    gene: 'AMY1',
    studies: [
      'Perry et al. (2007) Nature Genetics - Diet and evolution of human amylase gene copy number variation',
      'Mandel et al. (2010) Journal of Nutrition - AMY1 copy number correlates with salivary amylase activity'
    ],
    databases: ['Population-specific studies']
  },

  pufa_metabolism: {
    snp: 'rs174537',
    studies: [
      'Mathias et al. (2012) PLoS ONE - FADS genetic variants and omega-6 polyunsaturated fatty acid metabolism',
      'Ameur et al. (2012) Genome Biology - Genetic adaptation of fatty acid metabolism in European populations'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  vitamin_d_metabolism: {
    snp: 'rs1426654 (SLC24A5), rs4588 (GC)',
    studies: [
      'Lamason et al. (2005) Science - SLC24A5 affects pigmentation and vitamin D synthesis',
      'Wang et al. (2010) Lancet - GC genetic variants affect vitamin D status and supplementation response'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3', 'GWAS Catalog']
  },

  // Nutrient metabolism
  caffeine_metabolism: {
    snp: 'rs762551',
    studies: [
      'Cornelis et al. (2006) JAMA - CYP1A2 genotype modifies coffee-associated myocardial infarction risk (n=4,028)',
      'Palatini et al. (2009) Journal of Hypertension - HARVEST study: CYP1A2 and hypertension risk with coffee (7.5-year follow-up)'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  saturated_fat_response: {
    snp: 'rs5082 (APOA2)',
    studies: [
      'Corella et al. (2009) Archives of Internal Medicine - APOA2 gene-saturated fat interaction and obesity (replicated across 3 US populations)',
      'Smith et al. (2013) Molecular Nutrition & Food Research - 20-year follow-up confirmation of APOA2-saturated fat interaction'
    ],
    databases: ['gnomAD v4', 'Framingham Offspring Study', 'GOLDN Study']
  },

  folate_metabolism: {
    snp: 'rs1801133 (C677T)',
    studies: [
      'Frosst et al. (1995) Nature Genetics - Original identification of MTHFR C677T variant',
      'Tanaka et al. (2009) American Journal of Human Genetics - GWAS meta-analysis confirming MTHFR as strongest folate modifier (P = 1.26 × 10⁻¹⁹)'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3', 'ClinVar']
  },

  iron_metabolism: {
    snp: 'rs1800562 (C282Y), rs1799945 (H63D)',
    studies: [
      'Feder et al. (1996) Nature Genetics - HFE gene identification in hereditary hemochromatosis',
      'Allen et al. (2008) New England Journal of Medicine - Population screening for hemochromatosis'
    ],
    databases: ['gnomAD v4', 'ClinVar', 'OMIM']
  },

  glucose_metabolism: {
    snp: 'rs7903146',
    studies: [
      'Grant et al. (2006) Nature Genetics - TCF7L2 as strongest genetic contributor to T2D risk (OR 1.4-1.5)',
      'Cornelis et al. (2009) Diabetologia - TCF7L2 modifies response to whole grain dietary interventions'
    ],
    databases: ['gnomAD v4', 'GWAS Catalog', 'DIAGRAM Consortium']
  },

  obesity_risk: {
    snp: 'rs9939609',
    studies: [
      'Frayling et al. (2007) Science - FTO gene identified as first GWAS obesity locus',
      'Kilpeläinen et al. (2011) PLoS Medicine - Meta-analysis: physical activity attenuates FTO effect by 30%'
    ],
    databases: ['gnomAD v4', 'GIANT Consortium', 'UK Biobank']
  },

  beta_carotene_conversion: {
    snp: 'rs12934922, rs7501331, rs6564851',
    studies: [
      'Leung et al. (2009) FASEB Journal - BCO1 variants reduce beta-carotene conversion by up to 69%',
      'Ferrucci et al. (2009) American Journal of Clinical Nutrition - GWAS for plasma carotenoids (P = 1.6 × 10⁻²⁴)'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  vitamin_d_transport: {
    snp: 'rs4588, rs7041',
    studies: [
      'Powe et al. (2013) New England Journal of Medicine - GC haplotypes determine vitamin D binding protein levels',
      'Barry et al. (2014) American Journal of Clinical Nutrition - GC variants affect supplementation response (2.9-4.1x non-responder risk)'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  salt_sensitivity: {
    snp: 'rs699 (M235T)',
    studies: [
      'Jeunemaitre et al. (1992) Cell - AGT gene linkage to essential hypertension',
      'Gu et al. (2007) Hypertension - AGT genotype and blood pressure response to sodium restriction'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  salt_sensitive_hypertension: {
    snp: 'rs4961 (G460W)',
    studies: [
      'Cusi et al. (1997) Lancet - ADD1 polymorphism and salt-sensitive hypertension',
      'Barlassina et al. (2001) Hypertension - ADD1 460W shows 12-fold increased sodium sensitivity'
    ],
    databases: ['gnomAD v4', 'Literature meta-analyses']
  },

  bitter_taste_perception: {
    snp: 'rs713598, rs1726866, rs10246939',
    studies: [
      'Kim et al. (2003) Science - TAS2R38 haplotypes explain 85% of bitter taste variance',
      'Lipchock et al. (2017) UK Biobank - Food preference associations in 445,779 participants'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3', 'UK Biobank']
  },

  vitamin_b12_absorption: {
    snp: 'rs601338',
    studies: [
      'Hazra et al. (2008) Nature Genetics - FUT2 as strongest genetic determinant of B12 status (P = 5.36 × 10⁻¹⁷)',
      'Tanwar et al. (2013) PLoS ONE - Secretor status and gut microbiome interactions'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  appetite_regulation: {
    snp: 'rs17782313',
    studies: [
      'Loos et al. (2008) Nature Genetics - MC4R association with appetite and obesity risk',
      'Qi et al. (2014) Diabetes - High-protein diets reduce cravings in MC4R risk carriers'
    ],
    databases: ['gnomAD v4', 'GIANT Consortium']
  },

  celiac_susceptibility: {
    snp: 'rs2187668 (HLA-DQ2.5), rs7454108 (HLA-DQ8)',
    studies: [
      'Sollid et al. (1989) Journal of Experimental Medicine - HLA-DQ association with celiac disease',
      'Romanos et al. (2009) PLoS ONE - Tag SNPs for celiac risk stratification'
    ],
    databases: ['gnomAD v4', 'ClinVar', 'HLA databases']
  },

  hdl_metabolism: {
    snp: 'rs1800588',
    studies: [
      'Ordovas et al. (2002) American Journal of Clinical Nutrition - LIPC promoter variant and HDL-C levels',
      'Raitakari et al. (2005) Cardiovascular Diabetology - Young Finns Study: LIPC and lipid response to diet'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  insulin_sensitivity: {
    snp: 'rs1801282 (Pro12Ala)',
    studies: [
      'Altshuler et al. (2000) Nature Genetics - PPARG Pro12Ala and T2D risk',
      'Luan et al. (2001) BMJ - PPARG interaction with dietary fat ratio'
    ],
    databases: ['gnomAD v4', 'DIAGRAM Consortium']
  },

  antioxidant_capacity: {
    snp: 'rs4880 (Ala16Val)',
    studies: [
      'Sutton et al. (2003) Pharmacogenetics - SOD2 polymorphism and mitochondrial targeting',
      'Huang et al. (2005) Cancer Research - SOD2 genotype and antioxidant interactions'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  // Population-specific adaptations
  alcohol_metabolism: {
    snp: 'rs1229984 (ADH1B), rs671 (ALDH2)',
    studies: [
      'Li et al. (2009) PLoS Genetics - ADH1B selection and alcohol metabolism in East Asia',
      'Eng et al. (2007) Gastroenterology - ALDH2 deficiency and esophageal cancer risk'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  },

  arctic_fat_metabolism: {
    snp: 'rs80356779 (P479L)',
    studies: [
      'Clemente et al. (2014) AJHG - CPT1A P479L Arctic adaptation for high-fat diet',
      'Lemas et al. (2012) Molecular Genetics and Metabolism - CPT1A variant in Inuit populations'
    ],
    databases: ['gnomAD v4', 'Population-specific studies']
  },

  polynesian_energy_storage: {
    snp: 'rs373863828',
    studies: [
      'Minster et al. (2016) Nature Genetics - CREBRF missense variant in Samoans (1.4x obesity risk)',
      'Krishnan et al. (2018) Nature Communications - CREBRF affects adipocyte energy storage'
    ],
    databases: ['gnomAD v4', 'PAGE Study']
  },

  altitude_adaptation_epas1: {
    gene: 'EPAS1',
    studies: [
      'Yi et al. (2010) Science - EPAS1 Tibetan adaptation from Denisovan introgression',
      'Huerta-Sánchez et al. (2014) Nature - EPAS1 haplotype and high-altitude adaptation'
    ],
    databases: ['gnomAD v4', 'Archaic hominin genome databases']
  },

  // Detoxification enzymes (gene deletions)
  cruciferous_metabolism_gstm1: {
    gene: 'GSTM1 (deletion polymorphism)',
    studies: [
      'Strange et al. (2001) Mutation Research - GSTM1 null polymorphism and cancer susceptibility meta-analysis',
      'Gasper et al. (2005) American Journal of Clinical Nutrition - GSTM1 genotype modifies isothiocyanate metabolism from cruciferous vegetables'
    ],
    databases: ['Population meta-analyses', 'Literature compilations']
  },

  cruciferous_metabolism_gstt1: {
    gene: 'GSTT1 (deletion polymorphism)',
    studies: [
      'Seow et al. (2005) Carcinogenesis - GSTT1-functional individuals show 30% reduced MI risk from cruciferous vegetable intake',
      'Lampe et al. (2000) Cancer Epidemiology Biomarkers - GST genotypes modify cruciferous vegetable associations with cancer risk'
    ],
    databases: ['Population meta-analyses', 'Literature compilations']
  },

  // East Asian adaptation
  edar_adaptation: {
    snp: 'rs3827760 (V370A)',
    studies: [
      'Kamberov et al. (2013) Cell - EDAR V370A increases eccrine gland density and affects hair/tooth morphology',
      'Tan et al. (2013) Molecular Biology and Evolution - EDAR selection in East Asian populations ~30,000 years ago'
    ],
    databases: ['gnomAD v4', '1000 Genomes Phase 3']
  }
};

/**
 * Get sources for a specific gene
 * @param {string} geneKey - The gene key
 * @returns {Object|null} Source entry or null
 */
function getGeneSources(geneKey) {
  return GENE_SOURCES[geneKey] || null;
}

/**
 * Render the Sources & References section
 * @param {Object} mendelianGenetics - The calculated genetic data (to know which traits to cite)
 * @returns {string} HTML for the sources section
 */
function renderSourcesSection(mendelianGenetics) {
  if (!mendelianGenetics) return '';

  // Collect all genes that were displayed in results
  const displayedGenes = new Set();

  // Core traits that are always calculated
  displayedGenes.add('lactase_persistence');
  displayedGenes.add('starch_digestion');
  displayedGenes.add('pufa_metabolism');
  displayedGenes.add('vitamin_d_metabolism');

  // Add any generic genes that were calculated
  if (mendelianGenetics.generic) {
    Object.keys(mendelianGenetics.generic).forEach(gene => {
      displayedGenes.add(gene);
    });
  }

  // Add population-specific adaptations
  if (mendelianGenetics.populationSpecific) {
    mendelianGenetics.populationSpecific.forEach(adaptation => {
      if (adaptation.gene) {
        displayedGenes.add(adaptation.gene);
      }
    });
  }

  // Build citations HTML
  const citations = [];
  const databases = new Set();

  displayedGenes.forEach(geneKey => {
    const sources = GENE_SOURCES[geneKey];
    if (sources) {
      const meta = GENE_META[geneKey];
      const glossary = GENE_GLOSSARY[geneKey];
      const title = meta?.title || glossary?.term || geneKey;

      if (sources.studies) {
        sources.studies.forEach(study => {
          citations.push({ gene: title, citation: study });
        });
      }

      if (sources.databases) {
        sources.databases.forEach(db => databases.add(db));
      }
    }
  });

  if (citations.length === 0) return '';

  // Group citations by first author's last name for cleaner display
  const sortedCitations = citations.sort((a, b) =>
    a.citation.localeCompare(b.citation)
  );

  let html = `
    <div class="sources-section collapsible">
      <div class="sources-header" onclick="toggleSourcesSection(this)">
        <h3>Sources & References</h3>
        <span class="sources-count">${sortedCitations.length} citations</span>
        <span class="sources-expand-icon">▼</span>
      </div>
      <div class="sources-content">
        <p class="sources-intro">The genetic traits shown above are based on peer-reviewed research and population genetics databases.</p>

        <div class="sources-list">
          <h4>Key Studies</h4>
          <ul class="citation-list">
            ${sortedCitations.map(c => `<li><span class="citation-gene">${c.gene}:</span> ${c.citation}</li>`).join('')}
          </ul>
        </div>

        <div class="sources-databases">
          <h4>Population Data Sources</h4>
          <p>${Array.from(databases).sort().join(', ')}</p>
        </div>

        <p class="sources-note">
          Population allele frequencies used in calculations are derived from these databases and may not reflect individual genetic variation.
          For personal genetic information, consult a certified genetic counselor or healthcare provider.
        </p>
      </div>
    </div>
  `;

  return html;
}

/**
 * Get glossary entry for a gene
 * @param {string} geneKey - The gene key
 * @returns {Object|null} Glossary entry or null
 */
function getGlossaryEntry(geneKey) {
  // Map legacy keys to glossary keys
  const keyMap = {
    lactase: 'lactase_persistence',
    amy1: 'starch_digestion',
    fads: 'pufa_metabolism',
    slc24a5: 'vitamin_d_metabolism',
    aldh2: 'alcohol_metabolism',
    crebrf: 'polynesian_energy_storage',
    cpt1a: 'arctic_fat_metabolism',
    altitude: 'altitude_adaptation_epas1'
  };

  const lookupKey = keyMap[geneKey] || geneKey;
  return GENE_GLOSSARY[lookupKey] || null;
}

/**
 * Render a glossary info icon with click-to-open popover
 * @param {string} geneKey - The gene key
 * @returns {string} HTML for the info icon
 */
function renderGlossaryIcon(geneKey) {
  const entry = getGlossaryEntry(geneKey);
  if (!entry) return '';

  // Escape quotes for data attributes
  const escapedDef = entry.definition.replace(/"/g, '&quot;');
  const escapedTerm = entry.term.replace(/"/g, '&quot;');

  return `<span class="glossary-icon"
    data-gene-key="${geneKey}"
    data-term="${escapedTerm}"
    data-definition="${escapedDef}"
    data-gene="${entry.gene}"
    data-inheritance="${entry.inheritance}"
    onclick="showGenePopover(event, this)">ℹ️</span>`;
}

/**
 * Show gene info popover
 */
function showGenePopover(event, iconElement) {
  event.stopPropagation();

  // Remove any existing popover
  closeGenePopover();

  const term = iconElement.dataset.term;
  const definition = iconElement.dataset.definition;
  const gene = iconElement.dataset.gene;
  const inheritance = iconElement.dataset.inheritance;

  // Create popover element
  const popover = document.createElement('div');
  popover.className = 'gene-popover';
  popover.innerHTML = `
    <div class="gene-popover-header">
      <span class="gene-popover-title">${term}</span>
      <button class="gene-popover-close" onclick="closeGenePopover()">&times;</button>
    </div>
    <div class="gene-popover-body">
      <p class="gene-popover-definition">${definition}</p>
      <div class="gene-popover-details">
        <div class="gene-popover-detail">
          <span class="detail-label">Gene:</span>
          <span class="detail-value">${gene}</span>
        </div>
        <div class="gene-popover-detail">
          <span class="detail-label">Inheritance:</span>
          <span class="detail-value">${inheritance}</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popover);

  // Position the popover near the icon
  const iconRect = iconElement.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();

  let top = iconRect.bottom + 8 + window.scrollY;
  let left = iconRect.left + (iconRect.width / 2) - (popoverRect.width / 2) + window.scrollX;

  // Keep within viewport
  if (left < 10) left = 10;
  if (left + popoverRect.width > window.innerWidth - 10) {
    left = window.innerWidth - popoverRect.width - 10;
  }

  // If would go below viewport, show above instead
  if (top + popoverRect.height > window.innerHeight + window.scrollY - 10) {
    top = iconRect.top - popoverRect.height - 8 + window.scrollY;
  }

  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;

  // Mark icon as active
  iconElement.classList.add('active');

  // Close on click outside (after a brief delay to prevent immediate close)
  setTimeout(() => {
    document.addEventListener('click', closeGenePopoverOnClickOutside);
  }, 10);
}

/**
 * Close gene popover
 */
function closeGenePopover() {
  const existingPopover = document.querySelector('.gene-popover');
  if (existingPopover) {
    existingPopover.remove();
  }

  // Remove active state from icons
  document.querySelectorAll('.glossary-icon.active').forEach(icon => {
    icon.classList.remove('active');
  });

  document.removeEventListener('click', closeGenePopoverOnClickOutside);
}

/**
 * Close popover when clicking outside
 */
function closeGenePopoverOnClickOutside(event) {
  const popover = document.querySelector('.gene-popover');
  if (popover && !popover.contains(event.target) && !event.target.classList.contains('glossary-icon')) {
    closeGenePopover();
  }
}

/**
 * Gene metadata for display - add new genes here
 * When you add a gene to genetics.json, add its metadata here to enable display
 */
const GENE_META = {
  // Core metabolic traits (custom calculation)
  lactase_persistence: { icon: '🥛', title: 'Dairy Tolerance', cssClass: 'dairy' },
  starch_digestion: { icon: '🌾', title: 'Starch Metabolism', cssClass: 'starch' },
  pufa_metabolism: { icon: '🐟', title: 'Omega-3 Conversion', cssClass: 'omega3' },
  vitamin_d_metabolism: { icon: '☀️', title: 'Vitamin D Synthesis', cssClass: 'vitamind' },

  // Nutrient metabolism (generic additive)
  caffeine_metabolism: { icon: '☕', title: 'Caffeine Metabolism', cssClass: 'caffeine' },
  saturated_fat_response: { icon: '🥓', title: 'Saturated Fat Response', cssClass: 'sat-fat' },
  folate_metabolism: { icon: '🥬', title: 'Folate Metabolism', cssClass: 'folate' },
  iron_metabolism: { icon: '🩸', title: 'Iron Metabolism', cssClass: 'iron' },
  glucose_metabolism: { icon: '🍬', title: 'Glucose Metabolism', cssClass: 'glucose' },
  obesity_risk: { icon: '⚖️', title: 'Obesity Risk', cssClass: 'obesity' },
  beta_carotene_conversion: { icon: '🥕', title: 'Vitamin A Conversion', cssClass: 'beta-carotene' },
  vitamin_d_transport: { icon: '💊', title: 'Vitamin D Transport', cssClass: 'vit-d-transport' },
  salt_sensitivity: { icon: '🧂', title: 'Salt Sensitivity', cssClass: 'salt' },
  salt_sensitive_hypertension: { icon: '💓', title: 'Salt & Blood Pressure', cssClass: 'salt-bp' },
  bitter_taste_perception: { icon: '🥦', title: 'Bitter Taste Perception', cssClass: 'bitter' },
  vitamin_b12_absorption: { icon: '🔴', title: 'Vitamin B12 Absorption', cssClass: 'b12' },
  appetite_regulation: { icon: '🍽️', title: 'Appetite Regulation', cssClass: 'appetite' },
  celiac_susceptibility: { icon: '🌾', title: 'Celiac Susceptibility', cssClass: 'celiac' },
  hdl_metabolism: { icon: '❤️', title: 'HDL Cholesterol', cssClass: 'hdl' },
  insulin_sensitivity: { icon: '💉', title: 'Insulin Sensitivity', cssClass: 'insulin' },
  antioxidant_capacity: { icon: '🫐', title: 'Antioxidant Capacity', cssClass: 'antioxidant' },
  cruciferous_metabolism_gstm1: { icon: '🥗', title: 'Detox Enzyme (GSTM1)', cssClass: 'detox' },
  cruciferous_metabolism_gstt1: { icon: '🥗', title: 'Detox Enzyme (GSTT1)', cssClass: 'detox' },

  // Population-specific adaptations
  alcohol_metabolism: { icon: '🍺', title: 'Alcohol Metabolism', cssClass: 'alcohol' },
  arctic_fat_metabolism: { icon: '🧊', title: 'Arctic Fat Metabolism', cssClass: 'arctic' },
  polynesian_energy_storage: { icon: '⚡', title: 'Energy Storage', cssClass: 'energy' },
  altitude_adaptation_epas1: { icon: '🏔️', title: 'Altitude Adaptation', cssClass: 'altitude' },
  edar_adaptation: { icon: '🌡️', title: 'East Asian Variant', cssClass: 'edar' }
};

/**
 * Configuration for generic additive gene calculations
 * Keys that are NOT in this list use custom calculation functions
 * Add new genes here to enable automatic Mendelian calculation
 */
const GENERIC_GENE_CONFIG = {
  caffeine_metabolism: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'Slow Caffeine Metabolizer', rec: '☕ <strong>Slow metabolizer:</strong> Limit caffeine to 200mg/day, avoid after noon' },
      { min: 30, phenotype: 'Moderate Caffeine Metabolizer', rec: '☕ <strong>Moderate metabolizer:</strong> Up to 300mg/day typically well-tolerated' },
      { min: 0, phenotype: 'Fast Caffeine Metabolizer', rec: '☕ <strong>Fast metabolizer:</strong> Standard intake up to 400mg/day typically fine' }
    ]
  },
  saturated_fat_response: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'High Saturated Fat Sensitivity', rec: '🥓 <strong>High sensitivity:</strong> Limit saturated fat to <6% of calories, emphasize olive oil and fish' },
      { min: 25, phenotype: 'Moderate Saturated Fat Sensitivity', rec: '🥓 <strong>Moderate sensitivity:</strong> Keep saturated fat <8% of calories' },
      { min: 0, phenotype: 'Lower Saturated Fat Sensitivity', rec: '🥓 <strong>Lower sensitivity:</strong> Standard saturated fat guidelines apply' }
    ]
  },
  folate_metabolism: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Reduced Folate Metabolism', rec: '🥬 <strong>Higher folate needs:</strong> Emphasize leafy greens, consider methylfolate supplements (600+ mcg/day)' },
      { min: 20, phenotype: 'Moderate Folate Metabolism', rec: '🥬 <strong>Moderate folate needs:</strong> Ensure adequate leafy greens and fortified foods (500 mcg/day)' },
      { min: 0, phenotype: 'Normal Folate Metabolism', rec: '🥬 <strong>Standard folate needs:</strong> RDA of 400 mcg/day typically sufficient' }
    ]
  },
  iron_metabolism: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 8, phenotype: 'Elevated Iron Storage Risk', rec: '🩸 <strong>Hemochromatosis risk:</strong> Monitor ferritin levels, avoid iron supplements unless deficient, limit red meat' },
      { min: 3, phenotype: 'Moderate Iron Storage Risk', rec: '🩸 <strong>Moderate iron risk:</strong> Standard iron intake, periodic ferritin monitoring recommended' },
      { min: 0, phenotype: 'Normal Iron Metabolism', rec: '🩸 <strong>Standard iron metabolism:</strong> Normal dietary iron guidelines apply' }
    ]
  },
  glucose_metabolism: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 35, phenotype: 'Higher T2DM Risk', rec: '🍬 <strong>Elevated diabetes risk:</strong> Prioritize low glycemic foods, limit refined carbs, emphasize fiber and regular exercise' },
      { min: 25, phenotype: 'Moderate T2DM Risk', rec: '🍬 <strong>Moderate diabetes risk:</strong> Emphasize low glycemic index carbohydrates, regular physical activity' },
      { min: 0, phenotype: 'Lower T2DM Risk', rec: '🍬 <strong>Lower diabetes risk:</strong> Standard carbohydrate guidelines apply' }
    ]
  },
  obesity_risk: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 45, phenotype: 'Higher Obesity Risk', rec: '⚖️ <strong>Higher FTO-related risk:</strong> Focus on protein-rich meals for satiety, mindful eating, avoid calorie-dense snacks' },
      { min: 30, phenotype: 'Moderate Obesity Risk', rec: '⚖️ <strong>Moderate FTO-related risk:</strong> Standard portion control, regular physical activity recommended' },
      { min: 0, phenotype: 'Lower Obesity Risk', rec: '⚖️ <strong>Lower FTO-related risk:</strong> Standard caloric guidelines apply' }
    ]
  },
  beta_carotene_conversion: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 45, phenotype: 'Poor Vitamin A Converter', rec: '🥕 <strong>Poor converter:</strong> Include preformed vitamin A (eggs, dairy, liver) rather than relying solely on beta-carotene' },
      { min: 25, phenotype: 'Moderate Vitamin A Converter', rec: '🥕 <strong>Moderate converter:</strong> Mix of beta-carotene and preformed vitamin A sources recommended' },
      { min: 0, phenotype: 'Good Vitamin A Converter', rec: '🥕 <strong>Good converter:</strong> Beta-carotene from vegetables converts efficiently to vitamin A' }
    ]
  },
  vitamin_d_transport: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Reduced Vitamin D Transport', rec: '💊 <strong>Lower vitamin D binding:</strong> May need higher vitamin D intake or supplementation' },
      { min: 20, phenotype: 'Moderate Vitamin D Transport', rec: '💊 <strong>Moderate vitamin D transport:</strong> Standard vitamin D recommendations apply' },
      { min: 0, phenotype: 'Normal Vitamin D Transport', rec: '💊 <strong>Normal vitamin D transport:</strong> Efficient vitamin D utilization' }
    ]
  },
  salt_sensitivity: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'Salt Sensitive', rec: '🧂 <strong>Salt sensitive:</strong> Limit sodium to <1500mg/day, emphasize potassium-rich foods' },
      { min: 30, phenotype: 'Moderate Salt Sensitivity', rec: '🧂 <strong>Moderate salt sensitivity:</strong> Keep sodium moderate (<2000mg/day)' },
      { min: 0, phenotype: 'Lower Salt Sensitivity', rec: '🧂 <strong>Lower salt sensitivity:</strong> Standard sodium guidelines apply' }
    ]
  },
  salt_sensitive_hypertension: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 30, phenotype: 'Higher Hypertension Risk', rec: '💓 <strong>Salt-sensitive BP:</strong> Strict sodium limits, DASH diet recommended' },
      { min: 15, phenotype: 'Moderate Hypertension Risk', rec: '💓 <strong>Moderate BP sensitivity:</strong> Monitor sodium intake' },
      { min: 0, phenotype: 'Lower Hypertension Risk', rec: '💓 <strong>Lower BP sensitivity:</strong> Standard guidelines apply' }
    ]
  },
  bitter_taste_perception: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'Supertaster', rec: '🥦 <strong>Supertaster:</strong> May find cruciferous vegetables bitter - try roasting, sautéing with garlic, or pairing with cheese' },
      { min: 25, phenotype: 'Medium Taster', rec: '🥦 <strong>Medium taster:</strong> Moderate sensitivity to bitter compounds in vegetables' },
      { min: 0, phenotype: 'Non-Taster', rec: '🥦 <strong>Non-taster:</strong> Less sensitive to bitter compounds - cruciferous vegetables taste milder' }
    ]
  },
  vitamin_b12_absorption: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'Reduced B12 Status', rec: '🔴 <strong>Lower B12 levels:</strong> Emphasize B12-rich foods (meat, fish, eggs) or consider supplementation' },
      { min: 30, phenotype: 'Moderate B12 Status', rec: '🔴 <strong>Moderate B12 needs:</strong> Ensure regular B12 intake' },
      { min: 0, phenotype: 'Normal B12 Status', rec: '🔴 <strong>Normal B12:</strong> Standard dietary intake typically sufficient' }
    ]
  },
  appetite_regulation: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 30, phenotype: 'Increased Appetite Tendency', rec: '🍽️ <strong>Higher appetite drive:</strong> Focus on protein and fiber for satiety, structured meal times' },
      { min: 15, phenotype: 'Moderate Appetite', rec: '🍽️ <strong>Moderate appetite:</strong> Standard portion control strategies' },
      { min: 0, phenotype: 'Normal Appetite Regulation', rec: '🍽️ <strong>Normal appetite:</strong> Standard dietary guidelines apply' }
    ]
  },
  celiac_susceptibility: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 25, phenotype: 'Higher Celiac Risk', rec: '🌾 <strong>Elevated celiac susceptibility:</strong> Monitor for gluten sensitivity symptoms, consider testing if GI issues arise' },
      { min: 15, phenotype: 'Moderate Celiac Risk', rec: '🌾 <strong>Moderate celiac susceptibility:</strong> Be aware of potential gluten sensitivity' },
      { min: 0, phenotype: 'Lower Celiac Risk', rec: '🌾 <strong>Lower celiac risk:</strong> Standard gluten intake typically fine' }
    ]
  },
  hdl_metabolism: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Lower HDL Tendency', rec: '❤️ <strong>HDL support needed:</strong> Emphasize olive oil, fatty fish, nuts, and regular exercise' },
      { min: 20, phenotype: 'Moderate HDL Levels', rec: '❤️ <strong>Moderate HDL:</strong> Heart-healthy fats and exercise beneficial' },
      { min: 0, phenotype: 'Normal HDL Metabolism', rec: '❤️ <strong>Normal HDL:</strong> Standard cardiovascular guidelines apply' }
    ]
  },
  insulin_sensitivity: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Reduced Insulin Sensitivity', rec: '💉 <strong>Insulin resistance risk:</strong> Emphasize fiber, limit refined carbs, regular exercise crucial' },
      { min: 25, phenotype: 'Moderate Insulin Sensitivity', rec: '💉 <strong>Moderate sensitivity:</strong> Balanced macros, regular activity recommended' },
      { min: 0, phenotype: 'Normal Insulin Sensitivity', rec: '💉 <strong>Normal sensitivity:</strong> Standard dietary guidelines apply' }
    ]
  },
  antioxidant_capacity: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Lower Antioxidant Capacity', rec: '🫐 <strong>Higher antioxidant needs:</strong> Emphasize colorful fruits, vegetables, and antioxidant-rich foods' },
      { min: 20, phenotype: 'Moderate Antioxidant Capacity', rec: '🫐 <strong>Moderate capacity:</strong> Regular intake of antioxidant foods recommended' },
      { min: 0, phenotype: 'Normal Antioxidant Capacity', rec: '🫐 <strong>Normal capacity:</strong> Standard recommendations apply' }
    ]
  },
  cruciferous_metabolism_gstm1: {
    freqPath: 'null_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'GSTM1 Null (No Enzyme)', rec: '🥗 <strong>Missing GSTM1:</strong> Higher cruciferous intake may be especially beneficial for detoxification support' },
      { min: 0, phenotype: 'GSTM1 Present', rec: '🥗 <strong>GSTM1 present:</strong> Normal detoxification enzyme activity' }
    ]
  },
  cruciferous_metabolism_gstt1: {
    freqPath: 'null_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'GSTT1 Null (No Enzyme)', rec: '🥗 <strong>Missing GSTT1:</strong> Cruciferous vegetables may provide enhanced benefit' },
      { min: 0, phenotype: 'GSTT1 Present', rec: '🥗 <strong>GSTT1 present:</strong> Normal detoxification enzyme activity' }
    ]
  }
};

/**
 * Population-specific genes that require minimum frequency thresholds to display
 */
const POPULATION_SPECIFIC_GENES = {
  alcohol_metabolism: { minFreq: 5, freqPath: 'ALDH2.allele_frequency_percent' },
  arctic_fat_metabolism: { minFreq: 10, freqPath: 'allele_frequency_percent' },
  polynesian_energy_storage: { minFreq: 5, freqPath: 'allele_frequency_percent' },
  altitude_adaptation_epas1: { minFreq: 10, freqPath: 'allele_frequency_percent' },
  edar_adaptation: { minFreq: 10, freqPath: 'allele_frequency_percent' }
};

// ============================================================================
// HARDY-WEINBERG AND MENDELIAN CALCULATIONS
// ============================================================================

/**
 * Calculate genotype probabilities from allele frequency using Hardy-Weinberg
 * @param {number} freq - Derived allele frequency (0-100)
 * @returns {object} Genotype probabilities {AA, Aa, aa}
 */
function hardyWeinberg(freq) {
  const p = freq / 100;
  const q = 1 - p;

  return {
    homozygous_derived: p * p,
    heterozygous: 2 * p * q,
    homozygous_ancestral: q * q
  };
}

/**
 * Calculate offspring genotype from two parent genotype distributions
 * Uses Punnett square logic
 */
function mendelianOffspring(parent1_gt, parent2_gt) {
  const prob_AA =
    parent1_gt.homozygous_derived * parent2_gt.homozygous_derived +
    0.5 * parent1_gt.homozygous_derived * parent2_gt.heterozygous +
    0.5 * parent2_gt.homozygous_derived * parent1_gt.heterozygous +
    0.25 * parent1_gt.heterozygous * parent2_gt.heterozygous;

  const prob_aa =
    parent1_gt.homozygous_ancestral * parent2_gt.homozygous_ancestral +
    0.5 * parent1_gt.homozygous_ancestral * parent2_gt.heterozygous +
    0.5 * parent2_gt.homozygous_ancestral * parent1_gt.heterozygous +
    0.25 * parent1_gt.heterozygous * parent2_gt.heterozygous;

  const prob_Aa = 1 - prob_AA - prob_aa;

  return {
    homozygous_derived: prob_AA,
    heterozygous: prob_Aa,
    homozygous_ancestral: prob_aa
  };
}

/**
 * Calculate F1 parent genotype from two grandparent frequencies
 */
function calculateF1Parent(gp1_freq, gp2_freq) {
  const gp1_gt = hardyWeinberg(gp1_freq);
  const gp2_gt = hardyWeinberg(gp2_freq);
  return mendelianOffspring(gp1_gt, gp2_gt);
}

/**
 * Helper to get nested property value using dot notation path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Generic calculation function for additive genes using GENERIC_GENE_CONFIG
 * @param {Array} grandparents - Array of 4 grandparent diet objects
 * @param {string} geneKey - Key in genetic_adaptations (e.g., 'caffeine_metabolism')
 * @returns {Object|null} Calculated trait result or null if no data
 */
function calculateGenericGene(grandparents, geneKey) {
  const config = GENERIC_GENE_CONFIG[geneKey];
  if (!config) return null;

  const gp_freqs = grandparents.map(gp => {
    const gen = gp?.genetic_adaptations?.[geneKey];
    if (!gen) return null;
    return getNestedValue(gen, config.freqPath);
  });

  // Skip if no data available
  if (gp_freqs.every(f => f === null || f === undefined)) return null;

  const validFreqs = gp_freqs.filter(f => f !== null && f !== undefined);
  if (validFreqs.length === 0) return null;

  // Calculate average frequency across grandparents
  const avg_freq = validFreqs.reduce((a, b) => a + b, 0) / validFreqs.length;

  // Find matching threshold
  let result = null;
  for (const threshold of config.thresholds) {
    if (avg_freq >= threshold.min) {
      result = {
        phenotype: threshold.phenotype,
        recommendation: threshold.rec
      };
      break;
    }
  }

  if (!result) return null;

  const meta = GENE_META[geneKey] || { icon: '🧬', title: geneKey };

  return {
    phenotype: result.phenotype,
    frequency: avg_freq,
    inheritance: config.inheritance,
    explanation: `${avg_freq.toFixed(0)}% allele frequency across ancestry`,
    recommendation: result.recommendation,
    _meta: meta
  };
}

// ============================================================================
// TRAIT CALCULATIONS (Custom functions for complex inheritance patterns)
// ============================================================================

/**
 * Calculate lactase persistence phenotype (DOMINANT trait)
 */
function calculateLactasePersistence(grandparents) {
  const gp_freqs = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    return gen?.lactase_persistence?.allele_frequency_percent || 0;
  });

  const mother_gt = calculateF1Parent(gp_freqs[0], gp_freqs[1]);
  const father_gt = calculateF1Parent(gp_freqs[2], gp_freqs[3]);
  const offspring_gt = mendelianOffspring(mother_gt, father_gt);

  const prob_persistent = offspring_gt.homozygous_derived + offspring_gt.heterozygous;
  const is_persistent = prob_persistent >= 0.5;

  const prob_min = Math.max(0, prob_persistent - 0.15);
  const prob_max = Math.min(1, prob_persistent + 0.15);

  return {
    phenotype: is_persistent ? 'Lactase Persistent' : 'Lactase Non-Persistent',
    probability: prob_persistent,
    prob_range: { min: prob_min, max: prob_max },
    genotype: offspring_gt,
    inheritance: 'dominant',
    explanation: is_persistent
      ? 'You likely inherited at least one lactase persistence allele'
      : 'You likely inherited no lactase persistence alleles',
    recommendation: is_persistent
      ? '🥛 High dairy tolerance - can consume milk and dairy products freely'
      : '⚠ Lower dairy tolerance likely - prefer fermented dairy (yogurt, kefir, aged cheese) or lactose-free alternatives'
  };
}

/**
 * Calculate AMY1 copy number (ADDITIVE trait)
 */
function calculateAMY1(grandparents) {
  const gp_copies = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    return gen?.starch_digestion?.average_copy_number || 5;
  });

  const mother_copies = (gp_copies[0] + gp_copies[1]) / 2;
  const father_copies = (gp_copies[2] + gp_copies[3]) / 2;

  const possibleOutcomes = [];
  for (let m of [gp_copies[0], gp_copies[1]]) {
    for (let f of [gp_copies[2], gp_copies[3]]) {
      possibleOutcomes.push((m + f) / 2);
    }
  }

  const offspring_copies = (mother_copies + father_copies) / 2;
  const min_copies = Math.min(...possibleOutcomes);
  const max_copies = Math.max(...possibleOutcomes);

  let phenotype, carb_range, efficiency;
  if (offspring_copies >= 8) {
    phenotype = 'High Starch Tolerance';
    carb_range = '45-60%';
    efficiency = 'Excellent';
  } else if (offspring_copies >= 6.5) {
    phenotype = 'Good Starch Tolerance';
    carb_range = '40-50%';
    efficiency = 'Good';
  } else if (offspring_copies >= 5) {
    phenotype = 'Moderate Starch Tolerance';
    carb_range = '35-45%';
    efficiency = 'Moderate';
  } else {
    phenotype = 'Lower Starch Tolerance';
    carb_range = '25-35%';
    efficiency = 'Lower';
  }

  return {
    phenotype,
    copies: offspring_copies,
    copy_range: { min: min_copies, max: max_copies },
    inheritance: 'additive',
    explanation: `Inherited ~${offspring_copies.toFixed(1)} AMY1 copies through additive inheritance`,
    recommendation: `<strong>Optimal Carbs:</strong> ${carb_range} of calories<br>` +
                   `<strong>Efficiency:</strong> ${efficiency} starch digestion - can handle ${carb_range} carbs well`
  };
}

/**
 * Calculate FADS1 (ADDITIVE trait)
 */
function calculateFADS(grandparents) {
  const gp_freqs = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    return gen?.pufa_metabolism?.allele_frequency_percent || 50;
  });

  const mother_freq = (gp_freqs[0] + gp_freqs[1]) / 2;
  const father_freq = (gp_freqs[2] + gp_freqs[3]) / 2;
  const offspring_freq = (mother_freq + father_freq) / 2;

  const gt = hardyWeinberg(offspring_freq);

  const conversion_efficiency =
    gt.homozygous_derived * 100 +
    gt.heterozygous * 70 +
    gt.homozygous_ancestral * 40;

  let phenotype, recommendation;
  if (conversion_efficiency >= 80) {
    phenotype = 'Efficient Converter';
    recommendation = '✓ Plant-based omega-3 (flax, chia, walnuts) work well for you';
  } else if (conversion_efficiency >= 60) {
    phenotype = 'Moderate Converter';
    recommendation = '◐ Balanced approach: Mix plant sources with some fatty fish';
  } else {
    phenotype = 'Lower Efficiency';
    recommendation = '⚠ Focus on direct marine omega-3 (salmon, sardines, fish oil)';
  }

  return {
    phenotype,
    efficiency: conversion_efficiency,
    inheritance: 'additive',
    explanation: `${conversion_efficiency.toFixed(0)}% conversion efficiency from intermediate genotype`,
    recommendation
  };
}

/**
 * Calculate ALDH2 (DOMINANT-NEGATIVE)
 */
function calculateALDH2(grandparents) {
  const gp_freqs = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    return gen?.alcohol_metabolism?.ALDH2?.allele_frequency_percent || 0;
  });

  const avg_freq = gp_freqs.reduce((a, b) => a + b, 0) / gp_freqs.length;
  if (avg_freq < 5) return null;

  const mother_gt = calculateF1Parent(gp_freqs[0], gp_freqs[1]);
  const father_gt = calculateF1Parent(gp_freqs[2], gp_freqs[3]);
  const offspring_gt = mendelianOffspring(mother_gt, father_gt);

  const prob_flush = offspring_gt.homozygous_derived + offspring_gt.heterozygous;
  const has_flush = prob_flush >= 0.20;

  if (has_flush) {
    return {
      phenotype: 'Alcohol Flush Response',
      probability: prob_flush,
      inheritance: 'dominant-negative',
      explanation: 'Likely carry ALDH2*2 variant - causes facial flushing with alcohol',
      recommendation: '⚠ <strong>Reduced alcohol tolerance:</strong> Even small amounts may cause flushing, rapid heartbeat, nausea. This is a protective mechanism - reduces alcoholism risk but increases cancer risk if alcohol consumed regularly.'
    };
  }

  return null;
}

/**
 * Calculate CREBRF (Polynesian thrifty gene - ADDITIVE)
 */
function calculateCREBRF(grandparents) {
  const gp_freqs = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    const crebrf = gen?.polynesian_energy_storage || gen?.crebrf_adaptation;
    return crebrf?.allele_frequency_percent || 0;
  });

  const avg_freq = gp_freqs.reduce((a, b) => a + b, 0) / gp_freqs.length;
  if (avg_freq < 5) return null;

  const mother_freq = (gp_freqs[0] + gp_freqs[1]) / 2;
  const father_freq = (gp_freqs[2] + gp_freqs[3]) / 2;
  const offspring_freq = (mother_freq + father_freq) / 2;

  const gt = hardyWeinberg(offspring_freq);
  const prob_variant = gt.homozygous_derived + gt.heterozygous;
  const has_variant = prob_variant >= 0.15;

  if (has_variant) {
    return {
      phenotype: 'Enhanced Energy Storage',
      probability: prob_variant,
      inheritance: 'additive',
      explanation: `Likely inherited CREBRF variant (${(prob_variant*100).toFixed(0)}% probability) - "thrifty gene" adaptation`,
      recommendation: '⚡ <strong>Metabolic adaptation:</strong> Your body efficiently stores energy. Consider lower-carb, nutrient-dense foods and monitor portion sizes to manage weight.'
    };
  }

  return null;
}

/**
 * Calculate SLC24A5 (Skin pigmentation/Vitamin D - ADDITIVE)
 */
function calculateSLC24A5(grandparents) {
  const gp_freqs = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    const slc = gen?.vitamin_d_metabolism;
    return slc?.allele_frequency_percent || 0;
  });

  const mother_freq = (gp_freqs[0] + gp_freqs[1]) / 2;
  const father_freq = (gp_freqs[2] + gp_freqs[3]) / 2;
  const offspring_freq = (mother_freq + father_freq) / 2;

  let phenotype, vitd_needs, recommendation;
  if (offspring_freq < 30) {
    phenotype = 'Darker Pigmentation';
    vitd_needs = 'Higher';
    recommendation = '☀️ <strong>Higher vitamin D needs:</strong> Emphasize fatty fish, egg yolks, fortified foods, or consider supplementation';
  } else if (offspring_freq < 70) {
    phenotype = 'Intermediate Pigmentation';
    vitd_needs = 'Moderate';
    recommendation = '☀️ <strong>Moderate vitamin D needs:</strong> Include vitamin D-rich foods regularly';
  } else {
    phenotype = 'Lighter Pigmentation';
    vitd_needs = 'Lower';
    recommendation = '☀️ <strong>Efficient vitamin D synthesis:</strong> Moderate sun exposure adequate, dietary needs lower';
  }

  return {
    phenotype,
    probability: null,
    inheritance: 'additive',
    explanation: `Predicted ${phenotype.toLowerCase()} with ${vitd_needs.toLowerCase()} dietary vitamin D needs`,
    recommendation,
    vitd_needs
  };
}

/**
 * Calculate CPT1A (Arctic fat metabolism - RECESSIVE)
 */
function calculateCPT1A(grandparents) {
  const gp_freqs = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    const cpt1a = gen?.arctic_fat_metabolism;
    return cpt1a?.allele_frequency_percent || 0;
  });

  const avg_freq = gp_freqs.reduce((a, b) => a + b, 0) / gp_freqs.length;
  if (avg_freq < 10) return null;

  const mother_gt = calculateF1Parent(gp_freqs[0], gp_freqs[1]);
  const father_gt = calculateF1Parent(gp_freqs[2], gp_freqs[3]);
  const offspring_gt = mendelianOffspring(mother_gt, father_gt);

  const prob_arctic = offspring_gt.homozygous_derived;
  const has_arctic = prob_arctic >= 0.25;

  if (has_arctic) {
    return {
      phenotype: 'Arctic Fat Adaptation',
      probability: prob_arctic,
      inheritance: 'recessive',
      explanation: 'Possible CPT1A P479L variant - optimized for very high-fat ketogenic metabolism',
      recommendation: '🧊 <strong>Arctic adaptation:</strong> Your metabolism may thrive on very high-fat, low-carb diets (ketogenic-style)'
    };
  }

  return null;
}

/**
 * Calculate EDAR (East Asian variant - DOMINANT)
 */
function calculateEDAR(grandparents) {
  const gp_freqs = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    const edar = gen?.edar_adaptation;
    return edar?.allele_frequency_percent || 0;
  });

  const avg_freq = gp_freqs.reduce((a, b) => a + b, 0) / gp_freqs.length;
  if (avg_freq < 10) return null;

  const mother_gt = calculateF1Parent(gp_freqs[0], gp_freqs[1]);
  const father_gt = calculateF1Parent(gp_freqs[2], gp_freqs[3]);
  const offspring_gt = mendelianOffspring(mother_gt, father_gt);

  const prob_variant = offspring_gt.homozygous_derived + offspring_gt.heterozygous;

  return {
    phenotype: 'EDAR Variant Present',
    probability: prob_variant,
    inheritance: 'dominant',
    explanation: `${(prob_variant*100).toFixed(0)}% probability of East Asian EDAR variant affecting sweat glands and thermoregulation`,
    recommendation: '🌡️ Note: This variant has indirect effects on metabolism but limited direct dietary impact'
  };
}

/**
 * Calculate EPAS1/EGLN1 (Tibetan altitude adaptation - ADDITIVE)
 */
function calculateAltitude(grandparents) {
  const epas1_freqs = grandparents.map(gp => {
    const gen = gp.genetic_adaptations;
    const epas1 = gen?.altitude_adaptation_epas1;
    return epas1?.allele_frequency_percent || 0;
  });

  const avg_freq = epas1_freqs.reduce((a, b) => a + b, 0) / epas1_freqs.length;
  if (avg_freq < 10) return null;

  const mother_freq = (epas1_freqs[0] + epas1_freqs[1]) / 2;
  const father_freq = (epas1_freqs[2] + epas1_freqs[3]) / 2;
  const offspring_freq = (mother_freq + father_freq) / 2;

  const gt = hardyWeinberg(offspring_freq);
  const prob_variant = gt.homozygous_derived + gt.heterozygous;

  if (prob_variant >= 0.20) {
    return {
      phenotype: 'High-Altitude Adaptation',
      probability: prob_variant,
      inheritance: 'additive',
      explanation: `Likely inherited Denisovan-derived EPAS1 variant - prevents polycythemia at altitude`,
      recommendation: '🏔️ <strong>Altitude adaptation:</strong> Your body is adapted for efficient oxygen metabolism at high altitudes'
    };
  }

  return null;
}

/**
 * Calculate ALL relevant genetic traits
 * Uses data-driven approach - add genes to GENERIC_GENE_CONFIG for automatic support
 */
function calculateMendelianGenetics(grandparents) {
  if (!grandparents || grandparents.length !== 4) {
    return null;
  }

  const hasGenetic = grandparents.some(gp => gp?.genetic_adaptations);
  if (!hasGenetic) return null;

  const results = {};

  // Core metabolic traits with custom calculation logic
  results.lactase = calculateLactasePersistence(grandparents);
  results.amy1 = calculateAMY1(grandparents);
  results.fads = calculateFADS(grandparents);
  results.slc24a5 = calculateSLC24A5(grandparents);

  // Population-specific traits with custom threshold logic
  results.aldh2 = calculateALDH2(grandparents);
  results.crebrf = calculateCREBRF(grandparents);
  results.cpt1a = calculateCPT1A(grandparents);
  results.edar = calculateEDAR(grandparents);
  results.altitude = calculateAltitude(grandparents);

  // Generic additive genes from GENERIC_GENE_CONFIG (data-driven)
  // Add new genes to GENERIC_GENE_CONFIG - they will automatically appear here
  Object.keys(GENERIC_GENE_CONFIG).forEach(geneKey => {
    const result = calculateGenericGene(grandparents, geneKey);
    if (result) {
      results[geneKey] = result;
    }
  });

  // Remove null results
  Object.keys(results).forEach(key => {
    if (results[key] === null) delete results[key];
  });

  return results;
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

/**
 * Render genetic adaptations for a single diet
 */
function renderGeneticAdaptations(diet) {
  if (!diet.genetic_adaptations || Object.keys(diet.genetic_adaptations).length === 0) {
    return `
      <div class="genetic-section">
        <h3>Genetic Adaptations</h3>
        <div class="no-genetic-data">
          Genetic adaptation data not yet available for this population
        </div>
      </div>
    `;
  }

  const gen = diet.genetic_adaptations;
  let html = '<div class="genetic-section"><h3>Genetic Adaptations</h3>';

  if (gen.lactase_persistence) {
    const lp = gen.lactase_persistence;
    html += `
      <div class="genetic-trait dairy">
        <h4>🥛 Dairy Tolerance</h4>
        <div class="phenotype">${lp.phenotype_details.name}</div>
        <div class="probability">${(lp.phenotype_probability * 100).toFixed(0)}% probability</div>
        <div class="recommendation">${lp.dietary_recommendation.notes}</div>
        <div class="gene-details">Gene: ${lp.gene} | Inheritance: ${lp.inheritance}</div>
      </div>
    `;
  }

  if (gen.starch_digestion) {
    const sd = gen.starch_digestion;
    html += `
      <div class="genetic-trait starch">
        <h4>🌾 Starch Metabolism</h4>
        <div class="phenotype">${sd.phenotype_details.name}</div>
        <div class="probability">AMY1 Copy Number: ${sd.average_copy_number}</div>
        <div class="recommendation">
          <strong>Optimal Carbs:</strong> ${sd.dietary_recommendation.carb_percentage}<br>
          ${sd.dietary_recommendation.notes}
        </div>
        <div class="gene-details">Gene: ${sd.gene} | Inheritance: ${sd.inheritance}</div>
      </div>
    `;
  }

  if (gen.pufa_metabolism) {
    const pufa = gen.pufa_metabolism;
    html += `
      <div class="genetic-trait omega3">
        <h4>🐟 Omega-3 Conversion</h4>
        <div class="phenotype">${pufa.phenotype_details.name}</div>
        <div class="probability">${(pufa.phenotype_probability * 100).toFixed(0)}% efficiency</div>
        <div class="recommendation">${pufa.dietary_recommendation.notes}</div>
        <div class="gene-details">Gene: ${pufa.gene} | Inheritance: ${pufa.inheritance}</div>
      </div>
    `;
  }

  if (gen.arctic_fat_metabolism) {
    const arctic = gen.arctic_fat_metabolism;
    html += `
      <div class="genetic-trait arctic">
        <h4>🧊 Arctic Fat Adaptation</h4>
        <div class="phenotype">${arctic.phenotype_details.name}</div>
        <div class="recommendation">${arctic.dietary_recommendation.notes}</div>
        <div class="gene-details">Gene: ${arctic.gene} | ${arctic.allele_frequency_percent}% frequency</div>
      </div>
    `;
  }

  if (gen.alcohol_metabolism) {
    const alc = gen.alcohol_metabolism;
    html += `
      <div class="genetic-trait alcohol">
        <h4>🍺 Alcohol Metabolism</h4>
        <div class="phenotype">${alc.phenotype_details.name}</div>
        <div class="probability">${(alc.phenotype_probability * 100).toFixed(0)}% probability</div>
        <div class="recommendation">${alc.dietary_recommendation.recommendation}</div>
        <div class="gene-details">Genes: ${alc.genes.join(', ')} | Inheritance: ${alc.inheritance}</div>
      </div>
    `;
  }

  if (gen.polynesian_energy_storage) {
    const energy = gen.polynesian_energy_storage;
    html += `
      <div class="genetic-trait energy">
        <h4>⚡ Energy Metabolism</h4>
        <div class="phenotype">${energy.phenotype_details.name}</div>
        <div class="recommendation">${energy.dietary_recommendation.recommendation}</div>
        <div class="gene-details">Gene: ${energy.gene} | ${energy.allele_frequency_percent}% frequency</div>
      </div>
    `;
  }

  if (gen.vitamin_d_metabolism) {
    const vitd = gen.vitamin_d_metabolism;
    html += `
      <div class="genetic-trait vitamin-d">
        <h4>☀️ Vitamin D Synthesis</h4>
        <div class="phenotype">${vitd.phenotype_details.name}</div>
        <div class="recommendation">${vitd.dietary_recommendation.recommendation}</div>
        <div class="gene-details">Gene: ${vitd.gene} | ${vitd.allele_frequency_percent}% frequency</div>
      </div>
    `;
  }

  // Generic renderer for genes using shared GENE_META config
  // Keys already rendered by custom blocks above
  const customRenderedKeys = [
    'lactase_persistence', 'starch_digestion', 'pufa_metabolism',
    'arctic_fat_metabolism', 'alcohol_metabolism', 'polynesian_energy_storage',
    'vitamin_d_metabolism', 'cholesterol_metabolism', 'altitude_adaptation_epas1',
    'altitude_adaptation_egln1', 'edar_adaptation', 'crebrf_adaptation'
  ];

  Object.keys(gen).forEach(key => {
    if (customRenderedKeys.includes(key)) return;

    const trait = gen[key];
    const meta = GENE_META[key];
    if (!meta || !trait) return;

    // Skip if no meaningful data
    if (trait.allele_frequency_percent === null && trait.null_frequency_percent === null) return;

    const freq = trait.allele_frequency_percent ?? trait.null_frequency_percent;
    const freqDisplay = freq !== null ? `${freq}%` : 'unknown';
    const phenotype = trait.phenotype_details?.name || trait.inferred_phenotype || 'Standard';
    const recommendation = trait.dietary_recommendation?.recommendation ||
                          trait.dietary_recommendation?.notes ||
                          trait.phenotype_details?.dietary_impact || '';

    html += `
      <div class="genetic-trait ${key.replace(/_/g, '-')}">
        <h4>${meta.icon} ${meta.title}</h4>
        <div class="phenotype">${phenotype}</div>
        <div class="probability">${freqDisplay} frequency</div>
        ${recommendation ? `<div class="recommendation">${recommendation}</div>` : ''}
        <div class="gene-details">Gene: ${trait.gene} | Variant: ${trait.variant || 'N/A'}</div>
      </div>
    `;
  });

  html += '</div>';
  return html;
}

/**
 * Analyze genetic traits and categorize as strengths or things to watch
 * @param {Object} genetics - The Mendelian genetics results
 * @returns {Object} { strengths: [], watchItems: [] }
 */
function analyzeGeneticTraits(genetics) {
  if (!genetics) return { strengths: [], watchItems: [] };

  const strengths = [];
  const watchItems = [];

  // Legacy key mappings
  const legacyKeyMap = {
    lactase: 'lactase_persistence',
    amy1: 'starch_digestion',
    fads: 'pufa_metabolism',
    slc24a5: 'vitamin_d_metabolism',
    aldh2: 'alcohol_metabolism',
    crebrf: 'polynesian_energy_storage',
    cpt1a: 'arctic_fat_metabolism'
  };

  Object.keys(genetics).forEach(key => {
    const trait = genetics[key];
    const metaKey = legacyKeyMap[key] || key;
    const meta = trait._meta || GENE_META[metaKey] || { icon: '🧬', title: key };

    // Analyze each trait type
    if (key === 'lactase') {
      if (trait.probability >= 0.7) {
        strengths.push({
          icon: '🥛',
          title: 'Strong Dairy Tolerance',
          detail: `${(trait.probability * 100).toFixed(0)}% lactase persistence - dairy is well-suited to your genetics`
        });
      } else if (trait.probability < 0.4) {
        watchItems.push({
          icon: '🥛',
          title: 'Dairy Sensitivity Likely',
          detail: 'Consider fermented dairy (yogurt, kefir) or lactose-free options'
        });
      }
    }

    else if (key === 'amy1') {
      if (trait.copies >= 8) {
        strengths.push({
          icon: '🌾',
          title: 'Excellent Starch Digestion',
          detail: `${trait.copies.toFixed(0)} AMY1 copies - you digest starches efficiently`
        });
      } else if (trait.copies < 5) {
        watchItems.push({
          icon: '🌾',
          title: 'Lower Starch Tolerance',
          detail: 'Consider moderating refined carbohydrates and grains'
        });
      }
    }

    else if (key === 'fads') {
      if (trait.efficiency >= 70) {
        strengths.push({
          icon: '🐟',
          title: 'Efficient Omega-3 Conversion',
          detail: 'Plant omega-3s (flax, chia, walnuts) convert well for you'
        });
      } else if (trait.efficiency < 40) {
        watchItems.push({
          icon: '🐟',
          title: 'Limited Omega-3 Conversion',
          detail: 'Prioritize direct marine sources (fatty fish, fish oil) over plant sources'
        });
      }
    }

    else if (key === 'caffeine_metabolism') {
      const freq = trait.frequency || 0;
      if (freq < 30) {
        strengths.push({
          icon: '☕',
          title: 'Fast Caffeine Metabolizer',
          detail: 'You clear caffeine quickly - moderate coffee intake is fine'
        });
      } else if (freq >= 50) {
        watchItems.push({
          icon: '☕',
          title: 'Slow Caffeine Metabolizer',
          detail: 'Limit caffeine to mornings; may affect sleep and blood pressure'
        });
      }
    }

    else if (key === 'saturated_fat_response') {
      const freq = trait.frequency || 0;
      if (freq >= 35) {
        watchItems.push({
          icon: '🥓',
          title: 'Saturated Fat Sensitivity',
          detail: 'Your genetics suggest keeping saturated fat below 22g/day'
        });
      }
    }

    else if (key === 'folate_metabolism') {
      const freq = trait.frequency || 0;
      if (freq >= 40) {
        watchItems.push({
          icon: '🥬',
          title: 'Reduced Folate Processing',
          detail: 'Consider methylfolate supplements and folate-rich foods (leafy greens, legumes)'
        });
      }
    }

    else if (key === 'iron_metabolism') {
      const freq = trait.frequency || 0;
      if (freq >= 5) {
        watchItems.push({
          icon: '🩸',
          title: 'Iron Accumulation Risk',
          detail: 'Monitor iron intake; limit red meat and avoid iron supplements unless prescribed'
        });
      }
    }

    else if (key === 'glucose_metabolism') {
      const freq = trait.frequency || 0;
      if (freq >= 25) {
        watchItems.push({
          icon: '🍬',
          title: 'Blood Sugar Sensitivity',
          detail: 'Focus on weight management and Mediterranean-style eating'
        });
      }
    }

    else if (key === 'obesity_risk') {
      const freq = trait.frequency || 0;
      if (freq >= 40) {
        watchItems.push({
          icon: '⚖️',
          title: 'Higher Obesity Risk',
          detail: 'Physical activity is especially important for your genetics'
        });
      }
    }

    else if (key === 'salt_sensitivity' || key === 'salt_sensitive_hypertension') {
      const freq = trait.frequency || 0;
      if (freq >= 60) {
        watchItems.push({
          icon: '🧂',
          title: 'Salt Sensitive',
          detail: 'Keep sodium under 2,000mg/day; increase potassium-rich foods'
        });
      }
    }

    else if (key === 'beta_carotene_conversion') {
      const freq = trait.frequency || 0;
      if (freq >= 40) {
        watchItems.push({
          icon: '🥕',
          title: 'Poor Vitamin A Conversion',
          detail: 'Don\'t rely solely on carrots/sweet potatoes; include eggs, fish, or liver'
        });
      }
    }

    else if (key === 'bitter_taste_perception') {
      const freq = trait.frequency || 0;
      if (freq >= 55) {
        watchItems.push({
          icon: '🥦',
          title: 'Supertaster',
          detail: 'Bitter vegetables (broccoli, kale) may taste intense - try roasting or adding fats'
        });
      }
    }

    else if (key === 'celiac_susceptibility') {
      const freq = trait.frequency || 0;
      if (freq >= 15) {
        watchItems.push({
          icon: '🌾',
          title: 'Celiac Susceptibility',
          detail: 'If you have GI symptoms, consider celiac testing'
        });
      }
    }

    else if (key === 'aldh2' || key === 'alcohol_metabolism') {
      if (trait.probability !== undefined && trait.probability < 0.5) {
        watchItems.push({
          icon: '🍺',
          title: 'Alcohol Flush Response',
          detail: 'Likely to experience facial flushing with alcohol; increased health risks with heavy drinking'
        });
      }
    }

    else if (key === 'vitamin_d_transport') {
      const freq = trait.frequency || 0;
      if (freq >= 25) {
        watchItems.push({
          icon: '💊',
          title: 'Vitamin D Non-Responder Risk',
          detail: 'May need higher vitamin D doses; monitor levels when supplementing'
        });
      }
    }

    // Check for population-specific adaptations as strengths
    else if (key === 'cpt1a' || key === 'arctic_fat_metabolism') {
      if (trait.probability && trait.probability > 0.3) {
        strengths.push({
          icon: '🧊',
          title: 'Arctic Fat Adaptation',
          detail: 'Your metabolism is optimized for high-fat, low-carb diets'
        });
      }
    }

    else if (key === 'altitude' || key === 'altitude_adaptation_epas1') {
      if (trait.probability && trait.probability > 0.3) {
        strengths.push({
          icon: '🏔️',
          title: 'High-Altitude Adaptation',
          detail: 'Better oxygen efficiency at high elevations'
        });
      }
    }
  });

  // Limit to top 3 each
  return {
    strengths: strengths.slice(0, 3),
    watchItems: watchItems.slice(0, 3)
  };
}

/**
 * Render the Key Takeaways summary section
 * @param {Object} genetics - The Mendelian genetics results
 * @returns {string} HTML for the key takeaways section
 */
function renderKeyTakeaways(genetics) {
  if (!genetics) return '';

  const { strengths, watchItems } = analyzeGeneticTraits(genetics);

  // Need at least one item to show the section
  if (strengths.length === 0 && watchItems.length === 0) return '';

  let html = `
    <div class="key-takeaways">
      <h3>📋 Key Takeaways</h3>
      <div class="takeaways-grid">
  `;

  if (strengths.length > 0) {
    html += `
        <div class="takeaways-column strengths">
          <h4>✅ Your Genetic Strengths</h4>
          <ul>
            ${strengths.map(s => `
              <li>
                <span class="takeaway-icon">${s.icon}</span>
                <div class="takeaway-content">
                  <strong>${s.title}</strong>
                  <span>${s.detail}</span>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
    `;
  }

  if (watchItems.length > 0) {
    html += `
        <div class="takeaways-column watch-items">
          <h4>⚠️ Things to Watch</h4>
          <ul>
            ${watchItems.map(w => `
              <li>
                <span class="takeaway-icon">${w.icon}</span>
                <div class="takeaway-content">
                  <strong>${w.title}</strong>
                  <span>${w.detail}</span>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
    `;
  }

  html += `
      </div>
    </div>
  `;

  return html;
}

/**
 * Get meter value and status label for a genetic trait
 */
function getTraitMeterInfo(key, trait) {
  let value = 0;
  let statusLabel = '';
  let statusClass = '';

  if (key === 'amy1') {
    // AMY1 copies: 2-16 range, 6 is average
    value = Math.min(100, (trait.copies / 10) * 100);
    if (trait.copies >= 7) {
      statusLabel = 'High';
      statusClass = 'high';
    } else if (trait.copies >= 4) {
      statusLabel = 'Moderate';
      statusClass = 'moderate';
    } else {
      statusLabel = 'Low';
      statusClass = 'low';
    }
  } else if (key === 'fads') {
    value = trait.efficiency;
    if (trait.efficiency >= 70) {
      statusLabel = 'Efficient';
      statusClass = 'high';
    } else if (trait.efficiency >= 40) {
      statusLabel = 'Moderate';
      statusClass = 'moderate';
    } else {
      statusLabel = 'Limited';
      statusClass = 'low';
    }
  } else if (trait.probability !== null && trait.probability !== undefined) {
    value = trait.probability * 100;
    if (value >= 70) {
      statusLabel = 'Likely';
      statusClass = 'high';
    } else if (value >= 30) {
      statusLabel = 'Possible';
      statusClass = 'moderate';
    } else {
      statusLabel = 'Unlikely';
      statusClass = 'low';
    }
  } else if (trait.frequency !== null && trait.frequency !== undefined) {
    value = trait.frequency;
    if (value >= 50) {
      statusLabel = 'Common';
      statusClass = 'high';
    } else if (value >= 20) {
      statusLabel = 'Moderate';
      statusClass = 'moderate';
    } else {
      statusLabel = 'Rare';
      statusClass = 'low';
    }
  } else {
    value = 50;
    statusLabel = 'Variable';
    statusClass = 'moderate';
  }

  return { value: Math.round(value), statusLabel, statusClass };
}

/**
 * Render Mendelian genetics results
 * Uses GENE_META for display - add new genes there for automatic support
 * Displays as compact visual meters with expandable details
 */
function renderMendelianGenetics(genetics) {
  if (!genetics || Object.keys(genetics).length === 0) return '';

  let html = '<div class="genetic-section">';
  html += '<h3>Your Predicted Genetic Profile</h3>';
  html += '<p style="font-size: 12px; color: #7f8c8d; margin-bottom: 16px; line-height: 1.5;">Based on Mendelian inheritance from your grandparents\' populations. Click any trait to see details.</p>';

  html += '<div class="genetic-meters">';

  // Legacy key mappings for custom-calculated traits (key in results -> key in GENE_META)
  const legacyKeyMap = {
    lactase: 'lactase_persistence',
    amy1: 'starch_digestion',
    fads: 'pufa_metabolism',
    slc24a5: 'vitamin_d_metabolism',
    aldh2: 'alcohol_metabolism',
    crebrf: 'polynesian_energy_storage',
    cpt1a: 'arctic_fat_metabolism',
    edar: 'edar_adaptation',
    altitude: 'altitude_adaptation_epas1'
  };

  Object.keys(genetics).forEach((key, index) => {
    const trait = genetics[key];

    // Get metadata: check trait._meta first (from generic calc), then GENE_META, then legacy mapping
    let meta = trait._meta;
    if (!meta) {
      const metaKey = legacyKeyMap[key] || key;
      meta = GENE_META[metaKey];
    }
    if (!meta) {
      meta = { icon: '🧬', title: key.replace(/_/g, ' ').toUpperCase(), cssClass: 'generic' };
    }

    const { value, statusLabel, statusClass } = getTraitMeterInfo(key, trait);
    const cssClass = meta.cssClass || meta.class || 'generic';
    const glossaryIcon = renderGlossaryIcon(key);

    // Build detailed probability text for expanded view
    let probabilityText = '';
    if (key === 'amy1') {
      const range = trait.copy_range ?
        `(likely range: ${trait.copy_range.min.toFixed(1)}-${trait.copy_range.max.toFixed(1)})` : '';
      probabilityText = `${trait.copies.toFixed(1)} copies ${range}`;
    } else if (key === 'lactase' && trait.prob_range) {
      const rangeText = `${(trait.prob_range.min * 100).toFixed(0)}-${(trait.prob_range.max * 100).toFixed(0)}%`;
      probabilityText = `${(trait.probability * 100).toFixed(0)}% likely (range: ${rangeText})`;
    } else if (trait.probability !== null && trait.probability !== undefined) {
      probabilityText = `${(trait.probability * 100).toFixed(0)}% probability`;
    } else if (key === 'fads') {
      probabilityText = `${trait.efficiency.toFixed(0)}% conversion efficiency`;
    } else if (trait.frequency !== null && trait.frequency !== undefined) {
      probabilityText = `${trait.frequency.toFixed(0)}% allele frequency`;
    }

    html += `
      <div class="genetic-meter-item ${cssClass}" data-trait-index="${index}">
        <div class="meter-header" onclick="toggleTraitDetails(this)">
          <div class="meter-info">
            <span class="meter-icon">${meta.icon}</span>
            <span class="meter-title">${meta.title}</span>
          </div>
          <div class="meter-visual">
            <div class="meter-bar">
              <div class="meter-fill ${statusClass}" style="width: ${value}%"></div>
            </div>
            <span class="meter-status ${statusClass}">${statusLabel}</span>
          </div>
          <span class="meter-expand-icon">▼</span>
        </div>
        <div class="meter-details">
          <div class="detail-row">
            <span class="detail-label">Result:</span>
            <span class="detail-value">${trait.phenotype}</span>
          </div>
          ${probabilityText ? `
          <div class="detail-row">
            <span class="detail-label">Probability:</span>
            <span class="detail-value">${probabilityText}</span>
          </div>
          ` : ''}
          <div class="detail-row">
            <span class="detail-label">Inheritance:</span>
            <span class="detail-value">${trait.inheritance} ${glossaryIcon}</span>
          </div>
          <div class="detail-explanation">${trait.explanation}</div>
          <div class="detail-recommendation">
            <strong>Recommendation:</strong> ${trait.recommendation}
          </div>
        </div>
      </div>
    `;
  });

  html += '</div>'; // .genetic-meters
  html += '</div>'; // .genetic-section
  return html;
}

/**
 * Toggle expanded details for a genetic trait meter
 */
function toggleTraitDetails(headerElement) {
  const meterItem = headerElement.closest('.genetic-meter-item');
  meterItem.classList.toggle('expanded');
}

/**
 * Toggle the Sources & References section
 */
function toggleSourcesSection(headerElement) {
  const sourcesSection = headerElement.closest('.sources-section');
  sourcesSection.classList.toggle('expanded');
}

/**
 * Blend genetic adaptations from multiple diets
 */
function blendGeneticAdaptations(diets, weights) {
  let lactaseProb = 0;
  let amy1Copies = 0;
  let fadsFreq = 0;
  let hasGenetic = false;

  diets.forEach((diet, idx) => {
    if (diet.genetic_adaptations) {
      hasGenetic = true;
      const gen = diet.genetic_adaptations;
      const weight = weights[idx];

      if (gen.lactase_persistence) {
        lactaseProb += gen.lactase_persistence.phenotype_probability * weight;
      }
      if (gen.starch_digestion) {
        amy1Copies += gen.starch_digestion.average_copy_number * weight;
      }
      if (gen.pufa_metabolism) {
        fadsFreq += gen.pufa_metabolism.allele_frequency_percent * weight;
      }
    }
  });

  if (!hasGenetic) return '';

  let html = '<div class="genetic-section"><h3>Blended Genetic Profile</h3>';

  if (lactaseProb > 0) {
    const phenotype = lactaseProb >= 0.5 ? 'Lactase Persistent' : 'Lactase Non-Persistent';
    const recommendation = lactaseProb >= 0.5
      ? 'Good dairy tolerance - all forms of dairy recommended'
      : 'Lower dairy tolerance - prefer fermented dairy (yogurt, cheese) or lactose-free options';

    html += `
      <div class="genetic-trait dairy">
        <h4>🥛 Dairy Tolerance (Blended)</h4>
        <div class="phenotype">${phenotype}</div>
        <div class="probability">${(lactaseProb * 100).toFixed(0)}% probability</div>
        <div class="recommendation">${recommendation}</div>
      </div>
    `;
  }

  if (amy1Copies > 0) {
    const copies = amy1Copies.toFixed(1);
    let phenotype, carbRange;
    if (copies >= 8) {
      phenotype = 'High Starch Tolerance';
      carbRange = '45-60%';
    } else if (copies >= 6) {
      phenotype = 'Moderate Starch Tolerance';
      carbRange = '35-45%';
    } else {
      phenotype = 'Lower Starch Tolerance';
      carbRange = '25-35%';
    }

    html += `
      <div class="genetic-trait starch">
        <h4>🌾 Starch Metabolism (Blended)</h4>
        <div class="phenotype">${phenotype}</div>
        <div class="probability">Weighted AMY1: ${copies} copies</div>
        <div class="recommendation">
          <strong>Optimal Carbs:</strong> ${carbRange}<br>
          Your mixed ancestry suggests ${phenotype.toLowerCase()}
        </div>
      </div>
    `;
  }

  if (fadsFreq > 0) {
    const efficiency = fadsFreq >= 70 ? 'Efficient' : fadsFreq >= 50 ? 'Moderate' : 'Lower';
    const recommendation = efficiency === 'Efficient'
      ? 'Plant-based omega-3 sources (flax, chia, walnuts) work well'
      : efficiency === 'Moderate'
      ? 'Mix of plant and marine omega-3 sources recommended'
      : 'Prefer direct marine omega-3 (fatty fish, fish oil)';

    html += `
      <div class="genetic-trait omega3">
        <h4>🐟 Omega-3 Conversion (Blended)</h4>
        <div class="phenotype">${efficiency} Converter</div>
        <div class="probability">${fadsFreq.toFixed(0)}% weighted frequency</div>
        <div class="recommendation">${recommendation}</div>
      </div>
    `;
  }

  html += '</div>';
  return html;
}
