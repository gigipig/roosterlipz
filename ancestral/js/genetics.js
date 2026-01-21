/**
 * Genetics module - Mendelian inheritance calculations and rendering
 */

// ============================================================================
// GENE CONFIGURATION - Add new genes here for automatic support
// ============================================================================

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
 * Render Mendelian genetics results
 * Uses GENE_META for display - add new genes there for automatic support
 */
function renderMendelianGenetics(genetics) {
  if (!genetics || Object.keys(genetics).length === 0) return '';

  let html = '<div class="genetic-section">';
  html += '<h3>🧬 Your Predicted Genetic Profile</h3>';
  html += '<p style="font-size: 12px; color: #7f8c8d; margin-bottom: 16px; line-height: 1.5;">Based on Mendelian inheritance from your grandparents\' populations. These are probability-based predictions, not diagnostic results.</p>';

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

  Object.keys(genetics).forEach(key => {
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

    const cssClass = meta.cssClass || meta.class || 'generic';

    html += `
      <div class="genetic-trait ${cssClass}">
        <h4>${meta.icon} ${meta.title} (${trait.inheritance})</h4>
        <div class="phenotype">${trait.phenotype}</div>
        ${probabilityText ? `<div class="probability">${probabilityText}</div>` : ''}
        <div class="gene-info">${trait.explanation}</div>
        <div class="recommendation">${trait.recommendation}</div>
      </div>
    `;
  });

  html += '</div>';
  return html;
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
