/**
 * Genetics module - Mendelian inheritance calculations and rendering
 */

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

// ============================================================================
// TRAIT CALCULATIONS
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
 */
function calculateMendelianGenetics(grandparents) {
  if (!grandparents || grandparents.length !== 4) {
    return null;
  }

  const hasGenetic = grandparents.some(gp => gp.genetic_adaptations);
  if (!hasGenetic) return null;

  const results = {
    lactase: calculateLactasePersistence(grandparents),
    amy1: calculateAMY1(grandparents),
    fads: calculateFADS(grandparents),
    aldh2: calculateALDH2(grandparents),
    crebrf: calculateCREBRF(grandparents),
    slc24a5: calculateSLC24A5(grandparents),
    cpt1a: calculateCPT1A(grandparents),
    edar: calculateEDAR(grandparents),
    altitude: calculateAltitude(grandparents)
  };

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

  html += '</div>';
  return html;
}

/**
 * Render Mendelian genetics results
 */
function renderMendelianGenetics(genetics) {
  if (!genetics || Object.keys(genetics).length === 0) return '';

  let html = '<div class="genetic-section">';
  html += '<h3>🧬 Your Predicted Genetic Profile</h3>';
  html += '<p style="font-size: 12px; color: #7f8c8d; margin-bottom: 16px; line-height: 1.5;">Based on Mendelian inheritance from your grandparents\' populations. These are probability-based predictions, not diagnostic results.</p>';

  const traitMeta = {
    lactase: { icon: '🥛', title: 'Dairy Tolerance', class: 'dairy' },
    amy1: { icon: '🌾', title: 'Starch Metabolism', class: 'starch' },
    fads: { icon: '🐟', title: 'Omega-3 Conversion', class: 'omega3' },
    aldh2: { icon: '🍺', title: 'Alcohol Metabolism', class: 'alcohol' },
    crebrf: { icon: '⚡', title: 'Energy Storage', class: 'energy' },
    slc24a5: { icon: '☀️', title: 'Vitamin D Synthesis', class: 'vitamind' },
    cpt1a: { icon: '🧊', title: 'Arctic Fat Metabolism', class: 'arctic' },
    edar: { icon: '🌡️', title: 'East Asian Variant', class: 'edar' },
    altitude: { icon: '🏔️', title: 'Altitude Adaptation', class: 'altitude' }
  };

  Object.keys(genetics).forEach(key => {
    const trait = genetics[key];
    const meta = traitMeta[key] || { icon: '🧬', title: key.toUpperCase(), class: 'generic' };

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
    }

    html += `
      <div class="genetic-trait ${meta.class}">
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
