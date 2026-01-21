/**
 * Script to add Tier 1-3 nutrigenomics genes to genetics.json
 * Run with: node scripts/add_new_genes.js
 */

const fs = require('fs');
const path = require('path');

// Population mapping: 66 cultures -> 13 research populations
const populationMapping = {
  // Oceanian
  aboriginal_aus: 'oceanian',
  australian_coastal: 'oceanian',
  melanesia: 'oceanian',
  micronesia: 'oceanian',
  polynesia: 'oceanian',
  maori: 'oceanian',

  // Indigenous American
  amazon: 'indigenous_american',
  andean: 'indigenous_american',
  mesoamerica: 'indigenous_american',
  caribbean_taino: 'indigenous_american',
  great_plains: 'indigenous_american',
  eastern_woodlands: 'indigenous_american',
  pacific_nw: 'indigenous_american',
  california_coast: 'indigenous_american',
  southwest_us: 'indigenous_american',
  southeast_us: 'indigenous_american',
  subarctic: 'indigenous_american',
  inuit: 'indigenous_american',
  canadian_prairies: 'indigenous_american',
  patagonia: 'indigenous_american',
  brazilian_coastal: 'indigenous_american',
  gaucho: 'indigenous_american',
  mestizo_mesoamerican: 'indigenous_american',
  caribbean_creole: 'indigenous_american',

  // European North
  nordic: 'european_north',
  western_europe: 'european_north',
  central_europe: 'european_north',
  eastern_europe: 'european_north',
  balkan: 'european_north', // Could be south, but genetically closer to central

  // European South / Mediterranean
  med_southern: 'european_south',
  med_levant: 'european_south',
  anatolian: 'european_south',
  caucasus: 'european_south',

  // Middle Eastern
  arabian: 'middle_eastern',
  mesopotamian: 'middle_eastern',
  persian: 'middle_eastern',
  kurdish: 'middle_eastern',

  // North African
  maghreb: 'north_african',
  nile_valley: 'north_african',

  // West African
  west_africa: 'west_african',
  sahel: 'west_african',
  sudanian: 'west_african',

  // East African
  ethiopia: 'east_african',
  horn_somalia: 'east_african',
  nilotic: 'east_african',
  maasai: 'east_african',

  // South African (Central/Southern Africa)
  central_africa: 'south_african',
  southern_africa: 'south_african',
  malagasy: 'south_african', // Mixed but closer to African

  // South Asian
  north_india: 'south_asian',
  south_india: 'south_asian',
  west_india: 'south_asian',
  bengal: 'south_asian',
  nepal: 'south_asian',

  // East Asian
  north_china: 'east_asian',
  south_china: 'east_asian',
  sichuan_sw_china: 'east_asian',
  japan: 'east_asian',
  korea: 'east_asian',
  mongolia: 'east_asian',
  tibet: 'east_asian',

  // Southeast Asian
  se_asia_main: 'southeast_asian',
  se_asia_island: 'southeast_asian',
  highland_se_asia: 'southeast_asian',

  // Central Asian
  central_asia: 'central_asian',
  siberia: 'central_asian',
};

// Tier 1 data (parsed from markdown - using midpoints of ranges)
const tier1Data = {
  CYP1A2: {
    snp: 'rs762551',
    trait: 'caffeine_metabolism',
    risk_allele: 'C',
    risk_phenotype: 'slow metabolizer',
    populations: {
      european_north: { freq: 30 },
      european_south: { freq: 32 },
      middle_eastern: { freq: 31 },
      north_african: { freq: 37 },
      west_african: { freq: 46 },
      east_african: { freq: 47 },
      south_african: { freq: 42 },
      south_asian: { freq: 45 },
      east_asian: { freq: 35 },
      southeast_asian: { freq: 31 },
      central_asian: { freq: 24 },
      oceanian: { freq: 22 },
      indigenous_american: { freq: 26 }
    }
  },
  APOA2: {
    snp: 'rs5082',
    trait: 'saturated_fat_response',
    risk_allele: 'C',
    risk_phenotype: 'obesity risk with high saturated fat',
    populations: {
      european_north: { freq: 40 },
      european_south: { freq: 36 },
      middle_eastern: { freq: 34 },
      north_african: { freq: 32 },
      west_african: { freq: 17 },
      east_african: { freq: 17 },
      south_african: { freq: null }, // NO DATA
      south_asian: { freq: 22 },
      east_asian: { freq: 7 },
      southeast_asian: { freq: 9 },
      central_asian: { freq: 20 },
      oceanian: { freq: null }, // NO DATA
      indigenous_american: { freq: 24 }
    }
  },
  MTHFR: {
    snp: 'rs1801133',
    trait: 'folate_metabolism',
    risk_allele: 'T',
    risk_phenotype: 'reduced enzyme activity',
    populations: {
      european_north: { freq: 30 },
      european_south: { freq: 42 },
      middle_eastern: { freq: 26 },
      north_african: { freq: 22 },
      west_african: { freq: 10 },
      east_african: { freq: 7 },
      south_african: { freq: 3 },
      south_asian: { freq: 14 },
      east_asian: { freq: 36 },
      southeast_asian: { freq: 20 },
      central_asian: { freq: 26 },
      oceanian: { freq: 8 },
      indigenous_american: { freq: 54 }
    }
  },
  HFE: {
    snp: 'rs1800562',
    trait: 'iron_metabolism',
    risk_allele: 'A',
    risk_phenotype: 'hemochromatosis risk',
    populations: {
      european_north: { freq: 7 },
      european_south: { freq: 2.5 },
      middle_eastern: { freq: 0.25 },
      north_african: { freq: 0.5 },
      west_african: { freq: 0.5 },
      east_african: { freq: 0.1 },
      south_african: { freq: 0 },
      south_asian: { freq: 0.2 },
      east_asian: { freq: 0.02 },
      southeast_asian: { freq: 0.15 },
      central_asian: { freq: 0.6 },
      oceanian: { freq: 0 },
      indigenous_american: { freq: 0 }
    }
  },
  TCF7L2: {
    snp: 'rs7903146',
    trait: 'glucose_metabolism',
    risk_allele: 'T',
    risk_phenotype: 'type 2 diabetes risk',
    populations: {
      european_north: { freq: 25 },
      european_south: { freq: 30 },
      middle_eastern: { freq: 40 },
      north_african: { freq: 32 },
      west_african: { freq: 30 },
      east_african: { freq: 30 },
      south_african: { freq: null }, // NO DATA
      south_asian: { freq: 30 },
      east_asian: { freq: 3.5 },
      southeast_asian: { freq: 5 },
      central_asian: { freq: null }, // NO DATA
      oceanian: { freq: 10 },
      indigenous_american: { freq: 17 }
    }
  },
  FTO: {
    snp: 'rs9939609',
    trait: 'obesity_appetite',
    risk_allele: 'A',
    risk_phenotype: 'increased obesity risk',
    populations: {
      european_north: { freq: 42 },
      european_south: { freq: 41 },
      middle_eastern: { freq: 47 },
      north_african: { freq: 45 },
      west_african: { freq: 50 },
      east_african: { freq: 47 },
      south_african: { freq: 47 },
      south_asian: { freq: 33 },
      east_asian: { freq: 16 },
      southeast_asian: { freq: 20 },
      central_asian: { freq: 28 },
      oceanian: { freq: 17 },
      indigenous_american: { freq: 8 }
    }
  }
};

// Load Tier 2 and Tier 3 data
const tier2Path = path.join(__dirname, '..', 'Research', 'tier 2.json');
const tier3Path = path.join(__dirname, '..', 'Research', 'tier 3.json');
const geneticsPath = path.join(__dirname, '..', 'genetics.json');

const tier2Data = JSON.parse(fs.readFileSync(tier2Path, 'utf8'));
const tier3Data = JSON.parse(fs.readFileSync(tier3Path, 'utf8'));
const geneticsData = JSON.parse(fs.readFileSync(geneticsPath, 'utf8'));

// Helper function to get frequency for a culture
function getFrequency(geneData, cultureId) {
  const researchPop = populationMapping[cultureId];
  if (!researchPop) {
    console.warn(`No mapping for culture: ${cultureId}`);
    return null;
  }

  const popData = geneData.populations[researchPop];
  if (!popData) return null;

  return popData.freq !== undefined ? popData.freq : popData.null_freq;
}

// Generate dietary recommendations based on gene and frequency
function generateDietaryRecommendation(gene, snp, trait, freq, riskAllele, riskPhenotype) {
  const recommendations = {
    // Tier 1
    caffeine_metabolism: {
      low: { // <25% slow metabolizers
        caffeine_tolerance: 'high',
        recommendation: 'Normal caffeine metabolism. Standard intake of up to 400mg/day typically well-tolerated.',
        max_daily_mg: 400
      },
      moderate: { // 25-40%
        caffeine_tolerance: 'moderate',
        recommendation: 'Moderate caffeine metabolism. Consider limiting to 200-300mg/day, avoid afternoon caffeine.',
        max_daily_mg: 300
      },
      high: { // >40%
        caffeine_tolerance: 'low',
        recommendation: 'Slower caffeine metabolism common. Limit to 100-200mg/day, avoid caffeine after noon.',
        max_daily_mg: 200
      }
    },
    saturated_fat_response: {
      low: { // <15%
        sat_fat_sensitivity: 'low',
        recommendation: 'Low saturated fat sensitivity. Standard healthy fat guidelines apply.',
        sat_fat_limit_percent: 10
      },
      moderate: { // 15-30%
        sat_fat_sensitivity: 'moderate',
        recommendation: 'Moderate saturated fat sensitivity. Consider limiting saturated fat to <8% of calories.',
        sat_fat_limit_percent: 8
      },
      high: { // >30%
        sat_fat_sensitivity: 'high',
        recommendation: 'Higher saturated fat sensitivity common. Limit saturated fat to <6% of calories, emphasize MUFA/PUFA.',
        sat_fat_limit_percent: 6
      }
    },
    folate_metabolism: {
      low: { // <15%
        folate_needs: 'standard',
        recommendation: 'Standard folate metabolism. RDA of 400mcg DFE typically sufficient.',
        daily_mcg: 400
      },
      moderate: { // 15-35%
        folate_needs: 'elevated',
        recommendation: 'Some reduced folate metabolism. Consider 400-600mcg DFE, emphasize leafy greens.',
        daily_mcg: 500
      },
      high: { // >35%
        folate_needs: 'high',
        recommendation: 'Reduced MTHFR activity common. Consider 600-800mcg DFE, methylfolate may be beneficial.',
        daily_mcg: 600
      }
    },
    iron_metabolism: {
      low: { // <1%
        iron_overload_risk: 'minimal',
        recommendation: 'Very low hemochromatosis risk. Standard iron guidelines apply.',
        screening: 'Not typically needed'
      },
      moderate: { // 1-5%
        iron_overload_risk: 'moderate',
        recommendation: 'Some hemochromatosis risk present. Avoid excessive iron supplementation, monitor ferritin.',
        screening: 'Consider periodic ferritin testing'
      },
      high: { // >5%
        iron_overload_risk: 'elevated',
        recommendation: 'Elevated hemochromatosis risk. Avoid iron supplements unless deficient, limit red meat, monitor ferritin regularly.',
        screening: 'Recommend periodic ferritin and transferrin saturation testing'
      }
    },
    glucose_metabolism: {
      low: { // <10%
        diabetes_risk: 'lower',
        recommendation: 'Lower genetic T2DM risk from TCF7L2. Standard healthy diet guidelines.',
        carb_quality: 'Standard whole food carbohydrates'
      },
      moderate: { // 10-25%
        diabetes_risk: 'moderate',
        recommendation: 'Moderate T2DM genetic risk. Emphasize low glycemic foods, regular physical activity.',
        carb_quality: 'Prefer low glycemic index carbohydrates'
      },
      high: { // >25%
        diabetes_risk: 'elevated',
        recommendation: 'Elevated T2DM genetic risk. Prioritize blood sugar management, limit refined carbs, emphasize fiber.',
        carb_quality: 'Low glycemic, high fiber carbohydrates preferred'
      }
    },
    obesity_appetite: {
      low: { // <20%
        obesity_risk: 'lower',
        recommendation: 'Lower FTO-related obesity risk. Standard caloric guidelines.',
        satiety_strategy: 'Standard portion control'
      },
      moderate: { // 20-40%
        obesity_risk: 'moderate',
        recommendation: 'Moderate FTO-related appetite effects. Emphasize protein and fiber for satiety.',
        satiety_strategy: 'Protein-first meals, high fiber foods'
      },
      high: { // >40%
        obesity_risk: 'elevated',
        recommendation: 'Higher FTO-related appetite drive common. Focus on satiety-promoting foods, mindful eating.',
        satiety_strategy: 'High protein, high fiber meals; avoid calorie-dense snacks'
      }
    },
    // Tier 2
    beta_carotene_conversion: {
      low: { // <25%
        conversion_efficiency: 'good',
        recommendation: 'Efficient beta-carotene to vitamin A conversion. Plant sources adequate.',
        vitamin_a_source: 'Plant carotenoids sufficient'
      },
      moderate: { // 25-40%
        conversion_efficiency: 'moderate',
        recommendation: 'Moderate conversion efficiency. Include some preformed vitamin A (eggs, dairy).',
        vitamin_a_source: 'Mix of plant carotenoids and animal sources'
      },
      high: { // >40%
        conversion_efficiency: 'poor',
        recommendation: 'Reduced beta-carotene conversion common. Prioritize preformed vitamin A (liver, eggs, dairy).',
        vitamin_a_source: 'Preformed vitamin A preferred'
      }
    },
    vitamin_d_transport: {
      low: { // <20% for Gc2 haplotype
        vdbp_efficiency: 'high',
        recommendation: 'Efficient vitamin D binding protein. Standard vitamin D guidelines.',
        supplementation: 'Standard 600-800 IU/day if deficient'
      },
      moderate: { // 20-40%
        vdbp_efficiency: 'moderate',
        recommendation: 'Moderate VDBP efficiency. May need higher vitamin D intake, especially at high latitudes.',
        supplementation: 'Consider 1000-2000 IU/day'
      },
      high: { // >40%
        vdbp_efficiency: 'reduced',
        recommendation: 'Reduced VDBP efficiency common. Higher vitamin D needs, regular monitoring advised.',
        supplementation: 'May need 2000+ IU/day; test 25(OH)D levels'
      }
    },
    salt_sensitivity: {
      low: { // <50%
        salt_response: 'standard',
        recommendation: 'Standard blood pressure response to sodium. General guidelines of <2300mg/day.',
        daily_sodium_mg: 2300
      },
      moderate: { // 50-75%
        salt_response: 'sensitive',
        recommendation: 'Salt sensitivity common. Consider limiting sodium to <1500mg/day, emphasize potassium.',
        daily_sodium_mg: 1500
      },
      high: { // >75%
        salt_response: 'highly_sensitive',
        recommendation: 'High salt sensitivity prevalent. Strict sodium limit <1200mg/day, DASH diet recommended.',
        daily_sodium_mg: 1200
      }
    },
    salt_hypertension: {
      low: { // <25%
        hypertension_risk: 'standard',
        recommendation: 'Standard salt-related hypertension risk. General sodium guidelines.',
        intervention: 'Standard dietary guidelines'
      },
      moderate: { // 25-45%
        hypertension_risk: 'elevated',
        recommendation: 'Elevated salt-sensitive hypertension risk. Sodium restriction more important.',
        intervention: 'DASH-style diet, potassium-rich foods'
      },
      high: { // >45%
        hypertension_risk: 'high',
        recommendation: 'High salt-sensitive hypertension risk. Strict sodium control essential.',
        intervention: 'DASH diet strongly recommended, monitor blood pressure'
      }
    },
    bitter_taste: {
      low: { // <45%
        taste_sensitivity: 'non-taster',
        recommendation: 'Less sensitive to bitter compounds. May tolerate cruciferous vegetables easily.',
        vegetable_strategy: 'Raw cruciferous vegetables well-tolerated'
      },
      moderate: { // 45-55%
        taste_sensitivity: 'moderate',
        recommendation: 'Mixed bitter taste perception. Cooking can reduce bitterness if needed.',
        vegetable_strategy: 'Lightly cook bitter vegetables if needed'
      },
      high: { // >55%
        taste_sensitivity: 'supertaster',
        recommendation: 'Supertaster genetics common. May avoid bitter vegetables - try roasting, pairing with fats.',
        vegetable_strategy: 'Roast or sauté cruciferous vegetables, pair with cheese/oil'
      }
    },
    // Tier 3
    b12_absorption: {
      low: { // <60% secretor
        b12_risk: 'standard',
        recommendation: 'Standard B12 status. Regular dietary sources adequate for most.',
        monitoring: 'Standard'
      },
      moderate: { // 60-85%
        b12_risk: 'slightly_elevated',
        recommendation: 'Secretor status may affect B12. Ensure adequate dietary B12, consider monitoring.',
        monitoring: 'Periodic B12 testing if vegetarian/vegan'
      },
      high: { // >85%
        b12_risk: 'elevated',
        recommendation: 'High secretor prevalence. B12 absorption may be affected. Monitor B12 levels.',
        monitoring: 'Consider annual B12 testing'
      }
    },
    appetite_regulation: {
      low: { // <15%
        appetite_drive: 'standard',
        recommendation: 'Standard MC4R-related appetite regulation.',
        strategy: 'Standard portion control'
      },
      moderate: { // 15-25%
        appetite_drive: 'elevated',
        recommendation: 'Some increased appetite/snacking tendency. Plan structured meals.',
        strategy: 'Regular meal timing, protein at each meal'
      },
      high: { // >25%
        appetite_drive: 'high',
        recommendation: 'Higher appetite drive common. Focus on satiety strategies.',
        strategy: 'High protein, high fiber; avoid grazing; structured eating times'
      }
    },
    celiac_susceptibility: {
      low: { // <8%
        celiac_risk: 'low',
        recommendation: 'Low HLA-DQ2/DQ8 frequency. Celiac risk is lower but not absent.',
        gluten: 'Standard gluten consumption unless symptomatic'
      },
      moderate: { // 8-15%
        celiac_risk: 'moderate',
        recommendation: 'Moderate celiac genetic risk. Monitor for symptoms, test if GI issues.',
        gluten: 'Standard consumption; test if symptoms develop'
      },
      high: { // >15%
        celiac_risk: 'elevated',
        recommendation: 'Higher celiac genetic susceptibility. Be aware of symptoms.',
        gluten: 'Screen if GI symptoms, fatigue, or unexplained iron deficiency'
      }
    },
    hdl_metabolism: {
      low: { // <25%
        hdl_response: 'standard',
        recommendation: 'Standard HDL metabolism. General healthy fat guidelines.',
        fat_strategy: 'Balanced fat intake'
      },
      moderate: { // 25-35%
        hdl_response: 'variable',
        recommendation: 'Variable HDL response to diet. May benefit from MUFA-rich diet.',
        fat_strategy: 'Emphasize olive oil, nuts, avocado'
      },
      high: { // >35%
        hdl_response: 'enhanced',
        recommendation: 'Enhanced HDL response possible. Mediterranean-style fat profile beneficial.',
        fat_strategy: 'Mediterranean diet, limit saturated fat'
      }
    },
    insulin_sensitivity: {
      low: { // <88% Pro12
        insulin_risk: 'protected',
        recommendation: 'Ala12 variant provides some T2DM protection. Standard guidelines.',
        fat_guidance: 'Standard healthy fat guidelines'
      },
      moderate: { // 88-94%
        insulin_risk: 'moderate',
        recommendation: 'Moderate insulin sensitivity genetics. Limit saturated fat intake.',
        fat_guidance: 'Limit saturated fat, favor unsaturated'
      },
      high: { // >94%
        insulin_risk: 'reduced',
        recommendation: 'Higher prevalence of reduced insulin sensitivity genetics. Strict sat fat limits.',
        fat_guidance: 'Minimize saturated fat, emphasize omega-3'
      }
    },
    antioxidant_capacity: {
      low: { // <25%
        oxidative_stress: 'standard',
        recommendation: 'Standard mitochondrial antioxidant function. Regular antioxidant intake.',
        antioxidants: 'Standard dietary antioxidants'
      },
      moderate: { // 25-45%
        oxidative_stress: 'variable',
        recommendation: 'Variable antioxidant transport efficiency. Ensure adequate antioxidant intake.',
        antioxidants: 'Emphasize colorful fruits and vegetables'
      },
      high: { // >45%
        oxidative_stress: 'context_dependent',
        recommendation: 'Ala16 variant common. Antioxidant needs may vary by context.',
        antioxidants: 'Varied antioxidant-rich diet; avoid mega-dose supplements'
      }
    },
    cruciferous_metabolism: {
      low: { // <35% null
        detox_capacity: 'high',
        recommendation: 'GST enzymes present. Efficient cruciferous vegetable metabolism.',
        crucifers: 'Regular cruciferous intake beneficial'
      },
      moderate: { // 35-50%
        detox_capacity: 'moderate',
        recommendation: 'Moderate GST null frequency. Crucifers still beneficial.',
        crucifers: 'Regular intake; may have enhanced cancer-protective effects'
      },
      high: { // >50%
        detox_capacity: 'reduced',
        recommendation: 'High GST null frequency. Cruciferous vegetables especially important.',
        crucifers: 'Higher cruciferous intake may compensate for reduced GST activity'
      }
    }
  };

  // Determine level based on frequency
  const config = recommendations[trait];
  if (!config || freq === null || freq === undefined) {
    return { notes: 'Insufficient population data for specific recommendations' };
  }

  // Thresholds vary by trait
  const thresholds = {
    caffeine_metabolism: [25, 40],
    saturated_fat_response: [15, 30],
    folate_metabolism: [15, 35],
    iron_metabolism: [1, 5],
    glucose_metabolism: [10, 25],
    obesity_appetite: [20, 40],
    beta_carotene_conversion: [25, 40],
    vitamin_d_transport: [20, 40],
    salt_sensitivity: [50, 75],
    salt_hypertension: [25, 45],
    bitter_taste: [45, 55],
    b12_absorption: [60, 85],
    appetite_regulation: [15, 25],
    celiac_susceptibility: [8, 15],
    hdl_metabolism: [25, 35],
    insulin_sensitivity: [88, 94],
    antioxidant_capacity: [25, 45],
    cruciferous_metabolism: [35, 50]
  };

  const [lowThresh, highThresh] = thresholds[trait] || [25, 50];

  let level;
  if (freq < lowThresh) level = 'low';
  else if (freq < highThresh) level = 'moderate';
  else level = 'high';

  return config[level] || { notes: 'Standard recommendations apply' };
}

// Determine phenotype based on frequency
function determinePhenotype(trait, freq) {
  if (freq === null || freq === undefined) return 'unknown';

  const phenotypes = {
    caffeine_metabolism: { low: 'fast_metabolizer', moderate: 'intermediate', high: 'slow_metabolizer' },
    saturated_fat_response: { low: 'normal_response', moderate: 'moderate_sensitivity', high: 'high_sensitivity' },
    folate_metabolism: { low: 'normal', moderate: 'reduced', high: 'significantly_reduced' },
    iron_metabolism: { low: 'normal', moderate: 'carrier_risk', high: 'elevated_risk' },
    glucose_metabolism: { low: 'normal', moderate: 'moderate_risk', high: 'elevated_risk' },
    obesity_appetite: { low: 'normal', moderate: 'moderate_risk', high: 'elevated_risk' },
    beta_carotene_conversion: { low: 'efficient', moderate: 'moderate', high: 'poor_converter' },
    vitamin_d_transport: { low: 'efficient', moderate: 'moderate', high: 'reduced_efficiency' },
    salt_sensitivity: { low: 'normal', moderate: 'sensitive', high: 'highly_sensitive' },
    salt_hypertension: { low: 'normal', moderate: 'elevated_risk', high: 'high_risk' },
    bitter_taste: { low: 'non_taster', moderate: 'medium_taster', high: 'supertaster' },
    b12_absorption: { low: 'optimal', moderate: 'adequate', high: 'monitor_recommended' },
    appetite_regulation: { low: 'normal', moderate: 'elevated_appetite', high: 'high_appetite_drive' },
    celiac_susceptibility: { low: 'low_risk', moderate: 'moderate_risk', high: 'elevated_risk' },
    hdl_metabolism: { low: 'standard', moderate: 'variable', high: 'enhanced_response' },
    insulin_sensitivity: { low: 'protected', moderate: 'moderate', high: 'reduced' },
    antioxidant_capacity: { low: 'standard', moderate: 'variable', high: 'context_dependent' },
    cruciferous_metabolism: { low: 'efficient', moderate: 'moderate', high: 'reduced' }
  };

  const thresholds = {
    caffeine_metabolism: [25, 40],
    saturated_fat_response: [15, 30],
    folate_metabolism: [15, 35],
    iron_metabolism: [1, 5],
    glucose_metabolism: [10, 25],
    obesity_appetite: [20, 40],
    beta_carotene_conversion: [25, 40],
    vitamin_d_transport: [20, 40],
    salt_sensitivity: [50, 75],
    salt_hypertension: [25, 45],
    bitter_taste: [45, 55],
    b12_absorption: [60, 85],
    appetite_regulation: [15, 25],
    celiac_susceptibility: [8, 15],
    hdl_metabolism: [25, 35],
    insulin_sensitivity: [88, 94],
    antioxidant_capacity: [25, 45],
    cruciferous_metabolism: [35, 50]
  };

  const config = phenotypes[trait];
  const [lowThresh, highThresh] = thresholds[trait] || [25, 50];

  if (!config) return 'standard';

  if (freq < lowThresh) return config.low;
  if (freq < highThresh) return config.moderate;
  return config.high;
}

// Add gene to culture
function addGeneToCulture(culture, geneName, geneData, traitKey) {
  const freq = getFrequency(geneData, culture.id);
  const trait = geneData.trait;

  const phenotype = determinePhenotype(trait, freq);
  const dietaryRec = generateDietaryRecommendation(
    geneName,
    geneData.snp,
    trait,
    freq,
    geneData.risk_allele,
    geneData.risk_phenotype
  );

  const entry = {
    gene: geneName,
    variant: geneData.snp,
    allele_frequency_percent: freq,
    inheritance: 'additive',
    risk_allele: geneData.risk_allele,
    inferred_phenotype: phenotype,
    phenotype_probability: freq !== null ? freq / 100 : null,
    phenotype_details: {
      name: geneData.risk_phenotype,
      description: `${geneData.risk_allele} allele frequency: ${freq !== null ? freq + '%' : 'unknown'} in this population`,
      dietary_impact: dietaryRec.recommendation || 'Standard guidelines apply'
    },
    dietary_recommendation: dietaryRec
  };

  culture.genetic_adaptations[traitKey] = entry;
}

// Process each culture
console.log(`Processing ${geneticsData.cultures.length} cultures...`);

geneticsData.cultures.forEach(culture => {
  // Tier 1 genes
  addGeneToCulture(culture, 'CYP1A2', tier1Data.CYP1A2, 'caffeine_metabolism');
  addGeneToCulture(culture, 'APOA2', tier1Data.APOA2, 'saturated_fat_response');
  addGeneToCulture(culture, 'MTHFR', tier1Data.MTHFR, 'folate_metabolism');
  addGeneToCulture(culture, 'HFE', tier1Data.HFE, 'iron_metabolism');
  addGeneToCulture(culture, 'TCF7L2', tier1Data.TCF7L2, 'glucose_metabolism');
  addGeneToCulture(culture, 'FTO', tier1Data.FTO, 'obesity_risk');

  // Tier 2 genes
  tier2Data.genes.forEach(geneEntry => {
    const traitKey = geneEntry.trait;
    // Skip if already added (for multi-SNP genes, just use first)
    if (!culture.genetic_adaptations[traitKey]) {
      addGeneToCulture(culture, geneEntry.gene, geneEntry, traitKey);
    }
  });

  // Tier 3 genes
  tier3Data.genes.forEach(geneEntry => {
    const traitKey = geneEntry.trait;
    // For APOE, update existing entry rather than replace
    if (geneEntry.gene === 'APOE' && geneEntry.snp === 'rs429358') {
      // Update existing cholesterol_metabolism with new SNP data
      if (culture.genetic_adaptations.cholesterol_metabolism) {
        const existing = culture.genetic_adaptations.cholesterol_metabolism;
        const freq = getFrequency(geneEntry, culture.id);
        existing.snps = existing.snps || {};
        existing.snps.rs429358 = { allele_frequency_percent: freq, risk_allele: 'C' };
      }
    } else if (geneEntry.gene === 'APOE' && geneEntry.snp === 'rs7412') {
      if (culture.genetic_adaptations.cholesterol_metabolism) {
        const existing = culture.genetic_adaptations.cholesterol_metabolism;
        const freq = getFrequency(geneEntry, culture.id);
        existing.snps = existing.snps || {};
        existing.snps.rs7412 = { allele_frequency_percent: freq, risk_allele: 'T' };
      }
    } else if (!culture.genetic_adaptations[traitKey]) {
      addGeneToCulture(culture, geneEntry.gene, geneEntry, traitKey);
    }
  });

  // Tier 3 deletion polymorphisms
  ['GSTM1', 'GSTT1'].forEach(gene => {
    const deletionData = tier3Data.deletion_polymorphisms[gene];
    if (deletionData) {
      const researchPop = populationMapping[culture.id];
      const popData = deletionData.populations[researchPop];
      const nullFreq = popData ? popData.null_freq : null;

      const traitKey = 'cruciferous_metabolism_' + gene.toLowerCase();
      const phenotype = determinePhenotype('cruciferous_metabolism', nullFreq);
      const dietaryRec = generateDietaryRecommendation(gene, 'deletion', 'cruciferous_metabolism', nullFreq, 'null', deletionData.effect);

      culture.genetic_adaptations[traitKey] = {
        gene: gene,
        variant: 'gene_deletion',
        null_frequency_percent: nullFreq,
        inheritance: 'recessive',
        inferred_phenotype: phenotype,
        phenotype_probability: nullFreq !== null ? nullFreq / 100 : null,
        phenotype_details: {
          name: deletionData.effect,
          description: `${gene} null frequency: ${nullFreq !== null ? nullFreq + '%' : 'unknown'} in this population`,
          dietary_impact: deletionData.clinical_note
        },
        dietary_recommendation: dietaryRec
      };
    }
  });
});

// Update version
geneticsData.version = '4.0';

// Write output
const outputPath = path.join(__dirname, '..', 'genetics.json');
fs.writeFileSync(outputPath, JSON.stringify(geneticsData, null, 2));

console.log('Done! Updated genetics.json with new genes.');
console.log(`New version: ${geneticsData.version}`);
console.log(`Cultures processed: ${geneticsData.cultures.length}`);

// Summary of genes added
const sampleCulture = geneticsData.cultures[0];
const geneCount = Object.keys(sampleCulture.genetic_adaptations).length;
console.log(`Genetic adaptations per culture: ${geneCount}`);
