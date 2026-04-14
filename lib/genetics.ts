// @ts-nocheck
/* eslint-disable */
/**
 * Genetics module - Mendelian inheritance calculations
 * TypeScript port of js/genetics.js — @ts-nocheck preserves math verbatim
 * DOM rendering functions are not imported by React components
 */

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
  'olive oil': ['saturated_fat_response', 'lipc_hdl'],
  lard: ['saturated_fat_response'],
  tallow: ['saturated_fat_response'],
  'animal fats': ['saturated_fat_response'],
  'coconut oil': ['saturated_fat_response'],
  'palm oil': ['saturated_fat_response'],

  // Red meat → Iron metabolism
  beef: ['hfe_iron_overload', 'saturated_fat_response'],
  lamb: ['hfe_iron_overload', 'saturated_fat_response'],
  goat: ['hfe_iron_overload'],
  venison: ['hfe_iron_overload'],
  'red meat': ['hfe_iron_overload', 'saturated_fat_response'],
  game: ['hfe_iron_overload'],

  // Organ meats
  liver: ['hfe_iron_overload', 'fut2_secretor', 'beta_carotene_conversion'],
  'organ meats': ['hfe_iron_overload', 'fut2_secretor'],

  // Cruciferous vegetables
  broccoli: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception'],
  cabbage: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception'],
  kale: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception', 'beta_carotene_conversion'],
  'brussels sprouts': ['cruciferous_metabolism_gstm1', 'bitter_taste_perception'],
  cauliflower: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1'],

  // Leafy greens → Folate
  spinach: ['mthfr_folate', 'hfe_iron_overload'],
  'leafy greens': ['mthfr_folate', 'beta_carotene_conversion'],
  greens: ['mthfr_folate'],
  chard: ['mthfr_folate'],

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
  eggs: ['vitamin_d_metabolism', 'fut2_secretor', 'beta_carotene_conversion'],

  // Legumes
  legumes: ['starch_digestion', 'mthfr_folate'],
  lentils: ['mthfr_folate', 'hfe_iron_overload'],
  beans: ['starch_digestion', 'mthfr_folate'],
  chickpeas: ['starch_digestion', 'mthfr_folate'],

  // Nuts (general)
  nuts: ['pufa_metabolism'],
  almonds: ['gc_vitamin_d'],

  // Berries and antioxidant-rich foods
  berries: ['antioxidant_capacity'],
  'dark berries': ['antioxidant_capacity'],
  blueberries: ['antioxidant_capacity'],

  // Seafood (shellfish)
  shellfish: ['fut2_secretor', 'hfe_iron_overload'],
  oysters: ['hfe_iron_overload', 'fut2_secretor'],
  mussels: ['hfe_iron_overload', 'fut2_secretor'],
  crab: ['fut2_secretor', 'pufa_metabolism'],
  shrimp: ['fut2_secretor', 'pufa_metabolism'],
  abalone: ['fut2_secretor', 'hfe_iron_overload'],

  // Game meats
  kangaroo: ['hfe_iron_overload'],
  emu: ['hfe_iron_overload'],
  'wild game': ['hfe_iron_overload'],
  venison: ['hfe_iron_overload'],
  bison: ['hfe_iron_overload'],
  'guinea pig': ['hfe_iron_overload'],
  rabbit: ['hfe_iron_overload'],
  duck: ['hfe_iron_overload', 'pufa_metabolism'],
  goose: ['hfe_iron_overload', 'saturated_fat_response'],

  // Poultry
  chicken: ['fut2_secretor'],
  turkey: ['fut2_secretor'],
  poultry: ['fut2_secretor'],

  // Camelids and specialty meats
  camel: ['hfe_iron_overload'],
  'camel meat': ['hfe_iron_overload'],
  llama: ['hfe_iron_overload'],
  alpaca: ['hfe_iron_overload'],

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
  okra: ['mthfr_folate'],
  'collard greens': ['mthfr_folate', 'cruciferous_metabolism_gstm1'],
  'mustard greens': ['mthfr_folate', 'cruciferous_metabolism_gstm1'],
  seaweed: ['hfe_iron_overload', 'fut2_secretor'],
  kelp: ['hfe_iron_overload'],
  nori: ['fut2_secretor'],

  // Fermented foods
  'fermented vegetables': ['salt_sensitivity'],
  kimchi: ['salt_sensitivity', 'cruciferous_metabolism_gstm1'],
  sauerkraut: ['cruciferous_metabolism_gstm1', 'salt_sensitivity'],
  miso: ['salt_sensitivity'],
  tempeh: ['fut2_secretor'],
  natto: ['fut2_secretor'],

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
  insects: ['hfe_iron_overload'],
  'witchetty grubs': ['hfe_iron_overload'],

  // Seeds
  seeds: ['pufa_metabolism'],
  'pumpkin seeds': ['hfe_iron_overload'],
  'sunflower seeds': ['pufa_metabolism'],
  sesame: ['hfe_iron_overload'],
  'native seeds': ['starch_digestion'],

  // Additional fish varieties
  cod: ['pufa_metabolism', 'vitamin_d_metabolism'],
  codfish: ['pufa_metabolism', 'vitamin_d_metabolism'],
  tuna: ['pufa_metabolism', 'fut2_secretor'],
  trout: ['pufa_metabolism', 'vitamin_d_metabolism'],
  carp: ['pufa_metabolism'],
  catfish: ['pufa_metabolism'],
  tilapia: ['pufa_metabolism'],
  hilsa: ['pufa_metabolism'],
  mullet: ['pufa_metabolism'],
  bream: ['pufa_metabolism'],
  snapper: ['pufa_metabolism'],

  // Organ meats and specialty
  'bone marrow': ['hfe_iron_overload', 'saturated_fat_response'],
  'blood sausage': ['hfe_iron_overload'],
  'dried meat': ['hfe_iron_overload', 'salt_sensitivity'],
  jerky: ['hfe_iron_overload', 'salt_sensitivity'],
  pemmican: ['hfe_iron_overload', 'saturated_fat_response'],

  // Batch 7: New gene food mappings
  // MTHFR/Folate foods
  'leafy greens': ['mthfr_folate', 'beta_carotene_conversion'],
  spinach: ['mthfr_folate', 'hfe_iron_overload'],
  kale: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception', 'tas2r38_bitter', 'mthfr_folate'],
  asparagus: ['mthfr_folate'],
  'fortified cereals': ['mthfr_folate'],

  // FTO/Satiety foods - high protein
  'lean protein': ['fto_obesity'],
  'greek yogurt': ['lactase_persistence', 'fto_obesity'],
  'cottage cheese': ['lactase_persistence', 'fto_obesity'],
  'protein foods': ['fto_obesity'],

  // HFE/Iron overload foods
  'red meat': ['hfe_iron_overload', 'saturated_fat_response'],
  liver: ['hfe_iron_overload', 'fut2_secretor', 'beta_carotene_conversion', 'bco1_vitamin_a'],
  'organ meats': ['hfe_iron_overload', 'fut2_secretor'],
  'iron supplements': ['hfe_iron_overload'],

  // TAS2R38/Bitter taste foods
  broccoli: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception', 'tas2r38_bitter'],
  'brussels sprouts': ['cruciferous_metabolism_gstm1', 'bitter_taste_perception', 'tas2r38_bitter'],
  cabbage: ['cruciferous_metabolism_gstm1', 'cruciferous_metabolism_gstt1', 'bitter_taste_perception', 'tas2r38_bitter'],
  arugula: ['bitter_taste_perception', 'tas2r38_bitter'],
  radicchio: ['bitter_taste_perception', 'tas2r38_bitter'],
  grapefruit: ['bitter_taste_perception', 'tas2r38_bitter'],
  'dark chocolate': ['bitter_taste_perception', 'tas2r38_bitter', 'antioxidant_capacity'],

  // TCF7L2/Diabetes foods
  nuts: ['pufa_metabolism', 'tcf7l2_diabetes'],
  almonds: ['gc_vitamin_d', 'tcf7l2_diabetes'],
  walnuts: ['pufa_metabolism', 'tcf7l2_diabetes'],
  'whole grains': ['starch_digestion', 'tcf7l2_diabetes'],
  'refined carbs': ['tcf7l2_diabetes', 'glucose_metabolism'],
  'white bread': ['starch_digestion', 'tcf7l2_diabetes'],
  'sugary foods': ['tcf7l2_diabetes', 'glucose_metabolism'],

  // BCO1/Vitamin A foods
  carrots: ['beta_carotene_conversion', 'bco1_vitamin_a'],
  'sweet potato': ['beta_carotene_conversion', 'bco1_vitamin_a', 'starch_digestion'],
  pumpkin: ['beta_carotene_conversion', 'bco1_vitamin_a'],
  butternut: ['beta_carotene_conversion', 'bco1_vitamin_a'],
  mango: ['beta_carotene_conversion', 'bco1_vitamin_a'],
  papaya: ['beta_carotene_conversion', 'bco1_vitamin_a'],
  eggs: ['vitamin_d_metabolism', 'fut2_secretor', 'beta_carotene_conversion', 'bco1_vitamin_a'],

  // MC4R/Appetite foods
  'ultra-processed foods': ['fto_obesity', 'mc4r_appetite'],
  'processed snacks': ['fto_obesity', 'mc4r_appetite'],
  chips: ['fto_obesity', 'mc4r_appetite'],
  candy: ['fto_obesity', 'mc4r_appetite', 'tcf7l2_diabetes'],
  'fast food': ['fto_obesity', 'mc4r_appetite'],

  // ACE/Salt sensitivity foods
  'salty foods': ['salt_sensitivity', 'ace_salt_sensitivity'],
  'processed meats': ['salt_sensitivity', 'ace_salt_sensitivity', 'nat2_acetylator'],
  bacon: ['salt_sensitivity', 'ace_salt_sensitivity', 'nat2_acetylator'],
  ham: ['salt_sensitivity', 'ace_salt_sensitivity'],
  sausage: ['salt_sensitivity', 'ace_salt_sensitivity', 'nat2_acetylator'],
  'canned foods': ['salt_sensitivity', 'ace_salt_sensitivity'],
  'soy sauce': ['salt_sensitivity', 'ace_salt_sensitivity'],
  pickles: ['salt_sensitivity', 'ace_salt_sensitivity'],
  bananas: ['ace_salt_sensitivity'],
  'potassium foods': ['ace_salt_sensitivity'],

  // NAT2/Acetylator foods
  'grilled meat': ['nat2_acetylator'],
  'charred meat': ['nat2_acetylator'],
  'well-done meat': ['nat2_acetylator'],
  'barbecue': ['nat2_acetylator'],
  'smoked meat': ['nat2_acetylator'],
  steak: ['hfe_iron_overload', 'nat2_acetylator'],

  // Tier 2 gene food mappings
  // LIPC/HDL foods
  'olive oil': ['saturated_fat_response', 'lipc_hdl'],
  'healthy fats': ['lipc_hdl', 'pufa_metabolism'],
  avocado: ['lipc_hdl', 'pufa_metabolism'],

  // PPARA/PUFA foods
  'fatty fish': ['pufa_metabolism', 'vitamin_d_metabolism', 'ppara_pufa'],
  salmon: ['pufa_metabolism', 'vitamin_d_metabolism', 'ppara_pufa'],
  flaxseed: ['pufa_metabolism', 'ppara_pufa'],
  'fish oil': ['pufa_metabolism', 'ppara_pufa'],

  // DRD2/Food reward
  'comfort food': ['drd2_food_reward', 'fto_obesity'],
  desserts: ['drd2_food_reward', 'tcf7l2_diabetes'],
  'ice cream': ['lactase_persistence', 'drd2_food_reward'],

  // FUT2/B12 foods
  'b12 foods': ['fut2_secretor'],
  'fortified foods': ['mthfr_folate', 'fut2_secretor'],
  'nutritional yeast': ['fut2_secretor'],

  // GC/Vitamin D foods
  'vitamin d foods': ['vitamin_d_metabolism', 'gc_vitamin_d'],
  'fortified milk': ['lactase_persistence', 'gc_vitamin_d', 'vitamin_d_metabolism'],
  mushrooms: ['gc_vitamin_d', 'vitamin_d_metabolism'],

  // PEMT/Choline foods
  'egg yolks': ['pemt_choline', 'bco1_vitamin_a', 'vitamin_d_metabolism'],
  soybeans: ['pemt_choline', 'mthfr_folate'],
  'beef liver': ['pemt_choline', 'hfe_iron_overload', 'bco1_vitamin_a', 'hfe_iron_overload'],

  // FABP2/Fat absorption
  'high-fat meals': ['fabp2_fat_absorption', 'saturated_fat_response'],
  'fried foods': ['fabp2_fat_absorption', 'drd2_food_reward'],
  'fatty meats': ['fabp2_fat_absorption', 'saturated_fat_response', 'hfe_iron_overload'],

  // TMPRSS6/Iron foods
  'iron-rich foods': ['hfe_iron_overload', 'tmprss6_iron'],
  'fortified cereals': ['mthfr_folate', 'tmprss6_iron', 'hfe_iron_overload'],
  'vitamin c foods': ['tmprss6_iron'],

  // Tier 3 gene food mappings
  // AGT salt sensitivity (complements ACE)
  'high sodium foods': ['salt_sensitivity', 'ace_salt_sensitivity', 'agt_salt'],
  'restaurant food': ['salt_sensitivity', 'ace_salt_sensitivity', 'agt_salt'],
  'canned soup': ['salt_sensitivity', 'ace_salt_sensitivity', 'agt_salt'],

  // ADRB2/Weight loss
  'calorie-restricted diet': ['adrb2_weight_loss'],
  'diet foods': ['adrb2_weight_loss'],

  // TAS1R2/Sweet taste
  'sweet foods': ['tas1r2_sweet', 'tcf7l2_diabetes'],
  'sugary drinks': ['tas1r2_sweet', 'tcf7l2_diabetes'],
  'fruit juice': ['tas1r2_sweet'],
  'sweetened beverages': ['tas1r2_sweet'],

  // OPRM1/Food reward (complements DRD2)
  'palatable foods': ['oprm1_food_reward', 'drd2_food_reward'],
  'comfort foods': ['oprm1_food_reward', 'drd2_food_reward', 'fto_obesity'],
  'rich desserts': ['oprm1_food_reward', 'drd2_food_reward'],

  // ADRB3/Thermogenesis
  'spicy foods': ['adrb3_thermogenesis'],
  'capsaicin': ['adrb3_thermogenesis'],
  'hot peppers': ['adrb3_thermogenesis'],
  'green tea': ['adrb3_thermogenesis', 'caffeine_metabolism'],
  'chili': ['adrb3_thermogenesis'],

  // IRS1/Insulin - carb foods
  'complex carbs': ['irs1_insulin', 'starch_digestion'],
  'whole grain bread': ['irs1_insulin', 'starch_digestion'],
  'brown rice': ['irs1_insulin', 'starch_digestion'],
  'oatmeal': ['irs1_insulin', 'starch_digestion'],

  // PPARG/MUFA foods
  'mufa foods': ['pparg_adipocyte', 'lipc_hdl'],
  'olives': ['pparg_adipocyte', 'lipc_hdl'],
  'avocados': ['pparg_adipocyte', 'lipc_hdl', 'pufa_metabolism'],
  'macadamia nuts': ['pparg_adipocyte'],

  // UGT1A1/Fasting
  'intermittent fasting': ['ugt1a1_fasting'],
  'extended fasting': ['ugt1a1_fasting'],

  // ── Mediterranean herbs & aromatics ─────────────────────────────────────
  'garlic': ['antioxidant_capacity', 'lipc_hdl', 'ace_salt_sensitivity'],
  'onion': ['antioxidant_capacity', 'lipc_hdl'],
  'oregano': ['antioxidant_capacity'],
  'basil': ['antioxidant_capacity'],
  'rosemary': ['antioxidant_capacity'],
  'thyme': ['antioxidant_capacity'],
  'parsley': ['mthfr_folate', 'antioxidant_capacity'],
  'dill': ['antioxidant_capacity'],
  'mint': ['antioxidant_capacity'],
  'bay leaf': ['antioxidant_capacity'],
  'sage': ['antioxidant_capacity'],
  'cumin': ['antioxidant_capacity', 'adrb3_thermogenesis'],
  'sumac': ['antioxidant_capacity'],
  "za'atar": ['antioxidant_capacity'],
  'paprika': ['beta_carotene_conversion', 'antioxidant_capacity'],
  'saffron': ['antioxidant_capacity'],
  'turmeric': ['antioxidant_capacity'],
  'ginger': ['antioxidant_capacity', 'adrb3_thermogenesis'],
  'cinnamon': ['glucose_metabolism', 'tcf7l2_diabetes'],
  'black pepper': ['antioxidant_capacity'],
  'fennel': ['antioxidant_capacity'],
  'cardamom': ['antioxidant_capacity'],
  'black cumin': ['antioxidant_capacity'],

  // ── Additional herbs & spices ──────────────────────────────────────────────
  'caraway':    ['antioxidant_capacity'],
  'juniper':    ['antioxidant_capacity'],
  'coriander':  ['antioxidant_capacity', 'adrb3_thermogenesis'],
  'chives':     ['mthfr_folate', 'antioxidant_capacity'],
  'tarragon':   ['antioxidant_capacity'],
  'marjoram':   ['antioxidant_capacity'],
  'lovage':     ['antioxidant_capacity'],
  'allspice':   ['antioxidant_capacity'],
  'cloves':     ['antioxidant_capacity', 'glucose_metabolism'],
  'fenugreek':  ['glucose_metabolism', 'tcf7l2_diabetes'],
  'star anise': ['antioxidant_capacity'],
  'capers':     ['antioxidant_capacity', 'ace_salt_sensitivity'],

  // ── Mediterranean & Balkan proteins ─────────────────────────────────────
  'pork': ['hfe_iron_overload', 'saturated_fat_response'],
  'pork belly': ['hfe_iron_overload', 'saturated_fat_response', 'nat2_acetylator'],
  'prosciutto': ['salt_sensitivity', 'ace_salt_sensitivity', 'hfe_iron_overload', 'nat2_acetylator'],
  'halloumi': ['lactase_persistence', 'saturated_fat_response'],
  'mozzarella': ['lactase_persistence'],
  'labneh': ['lactase_persistence'],
  'tzatziki': ['lactase_persistence'],
  'octopus': ['pufa_metabolism', 'fut2_secretor'],
  'squid': ['pufa_metabolism', 'fut2_secretor'],
  'calamari': ['pufa_metabolism', 'fut2_secretor'],
  'sea bass': ['pufa_metabolism', 'vitamin_d_metabolism'],
  'sea bream': ['pufa_metabolism', 'vitamin_d_metabolism'],
  'prawn': ['pufa_metabolism', 'fut2_secretor'],
  'lobster': ['pufa_metabolism', 'fut2_secretor'],

  // ── Mediterranean produce & condiments ──────────────────────────────────
  'ajvar': ['beta_carotene_conversion', 'antioxidant_capacity'],
  'tahini': ['hfe_iron_overload', 'pufa_metabolism'],
  'hummus': ['mthfr_folate', 'starch_digestion'],
  'falafel': ['mthfr_folate', 'starch_digestion'],
  'zucchini': ['antioxidant_capacity'],
  'courgette': ['antioxidant_capacity'],
  'aubergine': ['antioxidant_capacity'],
  'grape leaves': ['mthfr_folate'],
  'grapes': ['antioxidant_capacity', 'alcohol_metabolism'],
  'pomegranate': ['antioxidant_capacity'],
  'lemon': ['antioxidant_capacity', 'tmprss6_iron'],
  'artichoke': ['antioxidant_capacity', 'lipc_hdl'],
  'leek': ['mthfr_folate', 'antioxidant_capacity'],
  'pine nuts': ['pufa_metabolism', 'hfe_iron_overload'],
  'pistachios': ['pufa_metabolism', 'tcf7l2_diabetes'],
  'honey': ['glucose_metabolism', 'tas1r2_sweet'],

  // ── Mediterranean bread & pastry ────────────────────────────────────────
  'phyllo': ['starch_digestion'],
  'burek': ['starch_digestion', 'saturated_fat_response'],
  'polenta': ['starch_digestion'],

  // ── Northern & Eastern European produce ─────────────────────────────────
  'beetroot': ['mthfr_folate', 'antioxidant_capacity'],
  'beets': ['mthfr_folate', 'antioxidant_capacity'],
  'horseradish': ['cruciferous_metabolism_gstm1', 'bitter_taste_perception'],
  'turnip': ['cruciferous_metabolism_gstm1'],
  'radish': ['cruciferous_metabolism_gstm1', 'bitter_taste_perception'],
  'watercress': ['cruciferous_metabolism_gstm1', 'mthfr_folate'],
  'root vegetables': ['starch_digestion', 'beta_carotene_conversion'],
  'celeriac': ['antioxidant_capacity'],
  'mustard': ['cruciferous_metabolism_gstm1', 'bitter_taste_perception'],
  'lingonberry': ['antioxidant_capacity'],
  'cloudberry': ['antioxidant_capacity'],
  'bilberry': ['antioxidant_capacity'],

  // ── Nordic & Arctic proteins ─────────────────────────────────────────────
  'reindeer': ['hfe_iron_overload'],
  'smoked salmon': ['pufa_metabolism', 'vitamin_d_metabolism', 'salt_sensitivity'],
  'lutefisk': ['pufa_metabolism', 'vitamin_d_metabolism'],

  // ── South & East Asian foods ─────────────────────────────────────────────
  'tofu': ['pemt_choline', 'mthfr_folate'],
  'edamame': ['mthfr_folate', 'pemt_choline'],
  'matcha': ['caffeine_metabolism', 'antioxidant_capacity'],
  'soy milk': ['pemt_choline'],
  'paneer': ['lactase_persistence'],
  'dal': ['mthfr_folate', 'hfe_iron_overload'],
  'dahl': ['mthfr_folate', 'hfe_iron_overload'],
  'gochujang': ['adrb3_thermogenesis', 'salt_sensitivity'],
  'wakame': ['hfe_iron_overload', 'fut2_secretor'],
  'sake': ['alcohol_metabolism'],

  // ── African & Caribbean foods ─────────────────────────────────────────────
  'peanuts': ['pufa_metabolism', 'tcf7l2_diabetes'],
  'groundnuts': ['pufa_metabolism', 'tcf7l2_diabetes'],
  'fufu': ['starch_digestion'],
  'ugali': ['starch_digestion'],
  'injera': ['starch_digestion'],
  'berbere': ['antioxidant_capacity', 'adrb3_thermogenesis'],
  'suya': ['nat2_acetylator', 'hfe_iron_overload'],
  'palm nuts': ['saturated_fat_response']
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
    antioxidant_capacity: 'Antioxidant support',
    salt_sensitivity: 'Watch sodium intake',
    saturated_fat_response: 'Matches ancestral fat metabolism',
    glucose_metabolism: 'Monitor blood sugar impact',
    // Batch 7
    mthfr_folate: 'Active folate source',
    hfe_iron_overload: 'Watch iron intake',
    tas2r38_bitter: trait.phenotype?.includes('Taster')
      ? 'May taste bitter to you'
      : 'Mild bitter taste for you',
    tcf7l2_diabetes: 'Monitor blood sugar impact',
    bco1_vitamin_a: 'Vitamin A conversion support',
    mc4r_appetite: 'Watch portion size',
    ace_salt_sensitivity: 'Watch sodium intake',
    nat2_acetylator: trait.phenotype?.includes('Slow')
      ? 'Limit charred or well-done cooking'
      : 'Normal carcinogen processing',
    // Batch 8
    lipc_hdl: 'Supports healthy cholesterol',
    ppara_pufa: 'Boosts omega-3 benefits',
    gc_vitamin_d: 'Supports vitamin D binding',
    pemt_choline: 'Choline source',
    fabp2_fat_absorption: 'Watch fat absorption rate',
    tmprss6_iron: 'Supports iron regulation',
    drd2_food_reward: 'Watch reward-driven eating',
    // Batch 9
    agt_salt: 'Watch sodium intake',
    tas1r2_sweet: 'Heightened sweet preference',
    adrb3_thermogenesis: 'Metabolism boost',
    irs1_insulin: 'Supports insulin sensitivity',
    pparg_adipocyte: 'Supports healthy fat storage',
    ugt1a1_fasting: 'Fasting metabolic support',
    abcg2_gout: 'Watch uric acid foods',
    slc2a9_urate: 'Watch uric acid foods',
    oprm1_food_reward: 'Watch reward-driven eating'
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
  },

  edar_adaptation: {
    term: 'East Asian Adaptation (EDAR)',
    definition: 'A variant that arose around 30,000 years ago in East Asia and spread to near-fixation. It affects multiple traits simultaneously — more sweat glands, thicker hair shafts, and different breast tissue structure. One of the clearest examples of recent positive selection in humans.',
    gene: 'EDAR gene',
    inheritance: 'Dominant - one copy sufficient'
  },

  // Nutrient metabolism — additional entries
  beta_carotene_conversion: {
    term: 'Vitamin A Conversion (BCO1)',
    definition: 'BCO1 converts beta-carotene from plants into active vitamin A (retinol). Common variants reduce this conversion by up to 69%, meaning some people can eat plenty of carrots and sweet potatoes yet still be vitamin A deficient.',
    gene: 'BCO1 gene',
    inheritance: 'Additive - efficiency varies with genotype'
  },
  salt_sensitivity: {
    term: 'Salt Sensitivity (AGT)',
    definition: 'How much blood pressure rises in response to dietary sodium. Carriers of this AGT variant have a more reactive renin-angiotensin system, so salty meals cause a larger and more sustained blood pressure increase.',
    gene: 'AGT gene',
    inheritance: 'Additive - each copy increases blood pressure response to sodium'
  },
  salt_sensitive_hypertension: {
    term: 'Salt & Blood Pressure (ADD1)',
    definition: 'The ADD1 gene variant causes kidneys to retain more sodium. Studies show carriers experience up to 12-fold greater blood pressure sensitivity to dietary salt compared to non-carriers.',
    gene: 'ADD1 gene',
    inheritance: 'Additive - increases sodium retention in kidneys'
  },
  insulin_sensitivity: {
    term: 'Insulin Sensitivity (PPARG)',
    definition: 'PPARG regulates fat cell development and insulin response. The common Pro12 variant is associated with slightly lower insulin sensitivity, while the rarer Ala12 variant provides some protection against Type 2 diabetes.',
    gene: 'PPARG gene',
    inheritance: 'Additive - Pro12Ala variant'
  },
  antioxidant_capacity: {
    term: 'Antioxidant Capacity (SOD2)',
    definition: 'SOD2 is the main antioxidant enzyme inside mitochondria, neutralising free radicals during energy production. The Ala16Val variant affects how efficiently it is transported into the mitochondria and activated.',
    gene: 'SOD2 gene',
    inheritance: 'Additive - affects mitochondrial targeting'
  },
  cruciferous_metabolism_gstm1: {
    term: 'Detox Enzyme GSTM1',
    definition: 'Around half of people inherit a complete deletion of the GSTM1 gene, leaving them without this detoxification enzyme. Cruciferous vegetables are especially valuable for these individuals because they activate compensating detox pathways.',
    gene: 'GSTM1 (gene deletion)',
    inheritance: 'Recessive deletion — ~50% of people lack both copies'
  },
  cruciferous_metabolism_gstt1: {
    term: 'Detox Enzyme GSTT1',
    definition: 'Like GSTM1, the GSTT1 gene can be completely absent. This enzyme processes environmental toxins and reactive compounds from vegetables. Frequency of deletion varies widely across ancestries.',
    gene: 'GSTT1 (gene deletion)',
    inheritance: 'Recessive deletion — frequency varies by ancestry'
  },

  // Batch 2 — Population-specific variants
  g6pd_deficiency: {
    term: 'G6PD Deficiency',
    definition: 'G6PD protects red blood cells from oxidative damage. Deficiency — the most common enzyme disorder worldwide — is found mainly in populations from Africa, the Mediterranean, and Southeast Asia. Certain foods (notably fava beans) and some medications can trigger red blood cell breakdown.',
    gene: 'G6PD gene',
    inheritance: 'X-linked recessive — affects males more severely'
  },
  abca1_r230c: {
    term: 'ABCA1 Cholesterol Efflux (R230C)',
    definition: 'A variant almost exclusive to Indigenous American populations that alters how the ABCA1 transporter moves cholesterol out of cells. Unusually, carriers may respond better to higher-fat rather than higher-carbohydrate diets — the opposite of typical cardiovascular advice.',
    gene: 'ABCA1 gene',
    inheritance: 'Additive - R230C variant'
  },
  slc16a11_diabetes: {
    term: 'SLC16A11 Diabetes Risk',
    definition: 'A variant common in Mexican and Central American populations that impairs how liver cells handle lipids, raising Type 2 diabetes risk independently of body weight. Early lifestyle intervention is particularly effective for carriers.',
    gene: 'SLC16A11 gene',
    inheritance: 'Additive - each copy increases risk'
  },
  tbc1d4_diabetes: {
    term: 'Arctic Diabetes Variant (TBC1D4)',
    definition: 'Found in Inuit and some Siberian populations, this variant impairs how muscles take up glucose via insulin. Exercise is uniquely important for carriers because it activates a separate glucose uptake route that bypasses this insulin-resistance pathway.',
    gene: 'TBC1D4 gene',
    inheritance: 'Recessive — two copies for full effect'
  },

  // Batch 3 — Vitamin D & Methylation Panel
  cyp2r1_vitamin_d: {
    term: 'Vitamin D Hydroxylation (CYP2R1)',
    definition: 'CYP2R1 is the liver enzyme that converts vitamin D into its measurable storage form (25-hydroxyvitamin D). Variants that reduce its activity mean less usable vitamin D in the body, even with adequate sun exposure or dietary intake.',
    gene: 'CYP2R1 gene',
    inheritance: 'Additive - affects enzyme activity level'
  },
  vdr_response: {
    term: 'Vitamin D Receptor (VDR)',
    definition: 'The VDR receptor translates vitamin D\'s hormonal signal into cellular action — affecting bone density, immune function, and more. Certain variants reduce receptor responsiveness, so higher vitamin D levels are needed to achieve the same effect in the body.',
    gene: 'VDR gene',
    inheritance: 'Additive - affects receptor responsiveness'
  },
  mtr_b12_methylation: {
    term: 'MTR B12 Recycling',
    definition: 'The MTR enzyme uses active B12 (methylcobalamin) to recycle homocysteine back into the useful amino acid methionine. Reduced MTR activity raises homocysteine — a marker linked to cardiovascular and neurological risk.',
    gene: 'MTR gene',
    inheritance: 'Additive - affects enzyme recycling rate'
  },
  mtrr_methylation: {
    term: 'MTRR Methylation Support',
    definition: 'MTRR regenerates the active form of B12 that MTR depends on. If MTRR is impaired, the methylation cycle gradually runs low on usable B12 — compounding any MTR or MTHFR issues. This is especially relevant during pregnancy.',
    gene: 'MTRR gene',
    inheritance: 'Additive - compounds other methylation variants'
  },
  comt_methylation: {
    term: 'COMT Enzyme Activity',
    definition: 'COMT breaks down dopamine, adrenaline, and oestrogen after they have done their job. Slow COMT means these compounds linger longer, which can heighten stress responses and raise oestrogen levels. Cruciferous vegetables help clear oestrogen via a separate metabolic pathway, compensating for slower COMT.',
    gene: 'COMT gene',
    inheritance: 'Additive - two copies of the slow variant cause the greatest effect'
  },
  cyp11b2_hypertension: {
    term: 'Aldosterone & Salt Response (CYP11B2)',
    definition: 'CYP11B2 produces aldosterone, the hormone that tells kidneys to retain sodium. A variant common in West African populations raises aldosterone output, making blood pressure significantly more sensitive to dietary salt.',
    gene: 'CYP11B2 gene',
    inheritance: 'Additive - each copy increases aldosterone production'
  },
  agtr1_hypertension: {
    term: 'Angiotensin Receptor (AGTR1)',
    definition: 'AGTR1 mediates the blood pressure-raising effects of angiotensin II. A variant that amplifies this receptor\'s sensitivity makes blood pressure more reactive to both salt and psychological stress.',
    gene: 'AGTR1 gene',
    inheritance: 'Additive - each copy increases receptor sensitivity'
  },

  // Batch 4 — Appetite & Behaviour
  lepr_satiety: {
    term: 'Leptin Receptor & Satiety (LEPR)',
    definition: 'Leptin is the hormone fat cells release to signal fullness. Variants in its receptor (LEPR) blunt the brain\'s response to this signal, so the message "I have eaten enough" arrives more weakly or more slowly.',
    gene: 'LEPR gene',
    inheritance: 'Additive - affects receptor sensitivity'
  },
  bdnf_fat_appetite: {
    term: 'BDNF Fat Appetite',
    definition: 'BDNF helps regulate appetite specifically for dietary fat. Certain variants cause increased fat-seeking behaviour — but only on higher-fat diets. Switching to a low-fat eating pattern effectively eliminates this variant\'s effect.',
    gene: 'BDNF gene',
    inheritance: 'Additive - fat-specific appetite effect'
  },
  cd36_fat_taste: {
    term: 'Fat Taste Sensitivity (CD36)',
    definition: 'CD36 receptors on the tongue detect the presence of dietary fat. Variants that reduce CD36 activity raise the detection threshold, meaning you may need more fat in food to sense it as satisfying — leading to unconsciously higher fat portions.',
    gene: 'CD36 gene',
    inheritance: 'Additive - affects fat detection threshold'
  },
  fads2_vegetarian: {
    term: 'Vegetarian Fat Adaptation (FADS2)',
    definition: 'A variant selected in historically vegetarian populations (notably South Asian) that boosts conversion of plant omega-3s to EPA and DHA. It increases efficiency on plant-based diets, but also amplifies inflammatory arachidonic acid if omega-6 oils are consumed in excess.',
    gene: 'FADS2 gene',
    inheritance: 'Additive - selected in vegetarian-ancestry populations'
  },

  // Batch 5 — Chrononutrition & Sensitivity
  clock_chronotype: {
    term: 'Circadian Meal Timing (CLOCK)',
    definition: 'The CLOCK gene drives your internal 24-hour rhythm. A variant associated with evening chronotype shifts natural hunger and metabolic peaks later in the day, which can conflict with daytime meal patterns and promote weight gain over time.',
    gene: 'CLOCK gene',
    inheritance: 'Additive - affects circadian phase preference'
  },
  per1_meal_timing: {
    term: 'Meal Regularity Response (PER1)',
    definition: 'PER1 is a core circadian clock gene. Certain variants make people particularly responsive to consistent meal timing — eating at the same times each day is linked to significantly less long-term weight gain in carriers compared to irregular eating.',
    gene: 'PER1 gene',
    inheritance: 'Additive - affects response to meal timing consistency'
  },
  dao_histamine: {
    term: 'Histamine Tolerance (DAO)',
    definition: 'DAO is the gut enzyme that breaks down histamine ingested from food. Low DAO activity means histamine from aged cheese, fermented foods, wine, and cured meats accumulates in the body, causing flushing, headaches, or digestive symptoms.',
    gene: 'AOC1 (DAO) gene',
    inheritance: 'Additive - reduces enzyme production'
  },
  adora2a_caffeine_anxiety: {
    term: 'Caffeine Sensitivity — Anxiety (ADORA2A)',
    definition: 'This is separate from caffeine metabolism speed (CYP1A2). ADORA2A variants make the brain more sensitive to caffeine\'s adenosine-blocking effect, causing anxiety, jitteriness, or sleep disruption even at doses that someone with fast CYP1A2 metabolism would clear quickly.',
    gene: 'ADORA2A gene',
    inheritance: 'Additive - affects adenosine receptor sensitivity'
  },

  // Batch 6 — Gout & Founder Variants
  abcg2_gout: {
    term: 'Uric Acid Transport & Gout (ABCG2)',
    definition: 'ABCG2 pumps uric acid out of the body through the gut. A loss-of-function variant reduces this efflux, causing uric acid to build up in joints and triggering gout attacks — particularly after purine-rich meals (organ meats, shellfish, beer).',
    gene: 'ABCG2 gene',
    inheritance: 'Additive - each copy reduces uric acid excretion'
  },
  slc2a9_urate: {
    term: 'Urate Metabolism (SLC2A9)',
    definition: 'SLC2A9 reabsorbs urate back into the blood from the kidneys. The T allele increases reabsorption, raising blood uric acid. In some populations this variant is nearly universal, making gout risk almost entirely a dietary and lifestyle question.',
    gene: 'SLC2A9 gene',
    inheritance: 'Additive - T allele increases urate reabsorption'
  },
  ashkenazi_ldlr_fh: {
    term: 'Familial Hypercholesterolaemia Risk (LDLR)',
    definition: 'Certain LDLR variants that cause familial hypercholesterolaemia — very high LDL cholesterol from birth — are notably more common in Ashkenazi Jewish populations due to a founder effect. The condition requires both dietary management and often medication to prevent early cardiovascular disease.',
    gene: 'LDLR gene',
    inheritance: 'Dominant - one copy causes elevated LDL'
  },

  // Batch 7 — High-Priority Nutrigenomic Genes
  mthfr_folate: {
    term: 'Folate Metabolism (MTHFR)',
    definition: 'MTHFR converts folate (B9) into its active form, methylfolate, used in DNA synthesis and neurotransmitter production. The C677T variant reduces this by 30–70%, raising homocysteine. Standard folic acid may not be fully effective for TT carriers — methylfolate is the more direct supplement.',
    gene: 'MTHFR gene',
    inheritance: 'Additive — two copies (TT) cause the greatest reduction'
  },
  fto_obesity: {
    term: 'Satiety & Appetite (FTO)',
    definition: 'The FTO region influences how strongly the brain registers fullness after meals. Risk variants blunt satiety signalling, so carriers tend to eat more and feel hungry again sooner. High-protein meals specifically counteract this by activating alternative fullness pathways.',
    gene: 'FTO gene',
    inheritance: 'Additive - each copy modestly increases appetite drive'
  },
  hfe_iron_overload: {
    term: 'Iron Overload Risk (HFE)',
    definition: 'The HFE C282Y variant — most common in Northern European populations — causes the body to absorb too much iron from food. Excess iron gradually deposits in the liver, heart, and joints. Diet and, if diagnosed, therapeutic blood donation are the main management tools.',
    gene: 'HFE gene',
    inheritance: 'Recessive — two C282Y copies typically required for haemochromatosis'
  },
  tas2r38_bitter: {
    term: 'Bitter Taste (TAS2R38)',
    definition: 'TAS2R38 detects PROP and PTC bitter compounds. Supertaster haplotypes make cruciferous vegetables, dark coffee, and bitter greens taste noticeably more intense — shaping food preferences in ways that can reduce vegetable intake without targeted cooking adjustments.',
    gene: 'TAS2R38 gene',
    inheritance: 'Additive - haplotype-based'
  },
  tcf7l2_diabetes: {
    term: 'Diabetes Risk (TCF7L2)',
    definition: 'TCF7L2 is the strongest common genetic predictor of Type 2 diabetes, affecting how the pancreas secretes insulin after meals. Research shows nut consumption and Mediterranean eating patterns specifically reduce risk in T allele carriers — more than in non-carriers.',
    gene: 'TCF7L2 gene',
    inheritance: 'Additive - each T copy raises T2D risk by ~40–50%'
  },
  bco1_vitamin_a: {
    term: 'Vitamin A Conversion (BCO1)',
    definition: 'BCO1 converts beta-carotene from plants into active retinol (vitamin A). Multiple BCO1 variants reduce this conversion by up to 69% — meaning plant-based eaters with these variants may not get enough vitamin A from vegetables alone, regardless of how many they eat.',
    gene: 'BCO1 gene',
    inheritance: 'Additive - multiple variants reduce conversion efficiency'
  },
  mc4r_appetite: {
    term: 'Appetite Regulation (MC4R)',
    definition: 'MC4R is a central receptor in the brain\'s energy-balance circuit. Risk variants reduce the fullness signal after meals. High-protein diets specifically activate a parallel satiety pathway that works around this deficit, making protein intake especially important for carriers.',
    gene: 'MC4R gene',
    inheritance: 'Additive - each copy modestly reduces satiety'
  },
  ace_salt_sensitivity: {
    term: 'Salt Sensitivity (ACE)',
    definition: 'The ACE gene controls angiotensin-converting enzyme, a key regulator of blood pressure and fluid balance. The insertion (I) allele is associated with greater salt sensitivity; II homozygotes show the most blood pressure change in response to dietary sodium.',
    gene: 'ACE gene',
    inheritance: 'Additive - I/D insertion-deletion variant'
  },
  nat2_acetylator: {
    term: 'Meat Carcinogen Metabolism (NAT2)',
    definition: 'NAT2 metabolises heterocyclic amines — compounds formed when meat is cooked at high temperatures. Slow acetylators process these carcinogens more slowly, so they linger in the body longer. Cooking method (braising vs. charring) makes a meaningful difference for slow NAT2 carriers.',
    gene: 'NAT2 gene',
    inheritance: 'Recessive - two slow alleles required for slow acetylator status'
  },

  // Batch 8 — Tier 2 Nutrigenomic Genes
  lipc_hdl: {
    term: 'HDL & Fat Response (LIPC)',
    definition: 'Hepatic lipase (LIPC) breaks down HDL and VLDL particles. The T allele reduces enzyme activity. This reverses the typical "dietary fat raises HDL" relationship for TT carriers, meaning standard heart-health fat advice may not apply in the expected direction.',
    gene: 'LIPC gene',
    inheritance: 'Additive - C(-514)T promoter variant'
  },
  ppara_pufa: {
    term: 'PUFA Metabolism (PPARA)',
    definition: 'PPARA is a nuclear receptor that switches on fat-burning genes in response to polyunsaturated fats. The rare Val162 variant reduces this activation — some carriers need higher PUFA intake (fatty fish, flaxseed, walnuts) to maintain normal blood lipid levels.',
    gene: 'PPARA gene',
    inheritance: 'Additive - Val162 variant'
  },
  drd2_food_reward: {
    term: 'Food Reward (DRD2)',
    definition: 'DRD2 encodes a dopamine receptor central to pleasure and reward. The A1 allele reduces receptor density, weakening the reward signal from eating — which can drive eating more to achieve the same satisfaction, particularly with processed or palatable foods.',
    gene: 'DRD2 gene',
    inheritance: 'Additive - A1 allele reduces receptor density'
  },

  gc_vitamin_d: {
    term: 'Vitamin D Binding (GC)',
    definition: 'The GC protein binds and transports vitamin D through the bloodstream. Different haplotypes (Gc1f, Gc1s, Gc2) affect both resting vitamin D levels and supplement response — Gc2 carriers may need up to four times the dose to reach the same blood levels as Gc1f carriers.',
    gene: 'GC gene',
    inheritance: 'Additive - haplotype-based (Gc1f / Gc1s / Gc2)'
  },
  pemt_choline: {
    term: 'Choline Synthesis (PEMT)',
    definition: 'PEMT is the liver enzyme that produces choline endogenously. A common variant reduces this synthesis, making dietary choline (from eggs, liver, and soy) essential rather than optional — particularly during pregnancy and for liver health.',
    gene: 'PEMT gene',
    inheritance: 'Additive - reduces endogenous choline synthesis'
  },
  fabp2_fat_absorption: {
    term: 'Fat Absorption (FABP2)',
    definition: 'FABP2 is an intestinal protein that binds and shuttles long-chain fatty acids from the gut into the bloodstream. The Thr54 variant absorbs fatty acids roughly twice as efficiently as the Ala54 form — so carriers absorb more fat and calories from the same meal.',
    gene: 'FABP2 gene',
    inheritance: 'Additive - Ala54Thr variant increases absorption rate'
  },
  tmprss6_iron: {
    term: 'Iron Absorption (TMPRSS6)',
    definition: 'TMPRSS6 suppresses hepcidin, the hormone that acts as the body\'s iron gate. The T allele is less effective at this suppression, allowing more hepcidin to block intestinal iron absorption — reducing dietary iron uptake by around 30% in carriers.',
    gene: 'TMPRSS6 gene',
    inheritance: 'Additive - T allele reduces iron absorption'
  },

  // Batch 9 — Tier 3 Nutrigenomic Genes
  agt_salt: {
    term: 'Salt & Blood Pressure (AGT)',
    definition: 'AGT produces angiotensinogen, the precursor to the blood-pressure hormone angiotensin II. The M235T variant raises baseline angiotensinogen levels, amplifying sodium-driven blood pressure responses — this variant is common in West African and South Asian ancestries.',
    gene: 'AGT gene',
    inheritance: 'Additive - M235T variant'
  },
  adrb2_weight_loss: {
    term: 'Weight Loss Response (ADRB2)',
    definition: 'ADRB2 is the adrenaline receptor on fat cells that triggers fat breakdown. The Glu27 variant is linked to a stronger response to caloric restriction — carriers tend to lose more weight on energy-deficit diets than carriers of the Gln27 form.',
    gene: 'ADRB2 gene',
    inheritance: 'Additive - Gln27Glu variant'
  },
  tas1r2_sweet: {
    term: 'Sweet Taste (TAS1R2)',
    definition: 'TAS1R2 forms half of the tongue\'s sweet taste receptor complex. Variants that reduce sensitivity can lower the perceived sweetness of sugary foods, making it easier to eat large amounts without them tasting "too sweet" — a potential driver of excess sugar intake.',
    gene: 'TAS1R2 gene',
    inheritance: 'Additive - affects sweet receptor sensitivity'
  },
  oprm1_food_reward: {
    term: 'Food Pleasure (OPRM1)',
    definition: 'The mu-opioid receptor mediates the pleasurable sensation from eating palatable food. The G allele amplifies this hedonic response, making rewarding foods feel more intensely satisfying and potentially harder to moderate through willpower alone.',
    gene: 'OPRM1 gene',
    inheritance: 'Additive - A118G variant'
  },
  adrb3_thermogenesis: {
    term: 'Thermogenesis (ADRB3)',
    definition: 'ADRB3 is the adrenaline receptor on brown adipose (fat-burning) tissue that generates body heat. The Arg64 variant impairs this receptor, reducing the amount of energy burned as heat — contributing to easier weight gain and lower metabolic flexibility, especially with a sedentary lifestyle.',
    gene: 'ADRB3 gene',
    inheritance: 'Additive - Trp64Arg variant'
  },
  irs1_insulin: {
    term: 'Insulin Signalling (IRS1)',
    definition: 'IRS1 is a docking molecule in the insulin signalling chain inside cells. The common Gly972Arg variant slightly impairs glucose uptake signalling. CC carriers respond well to high-complex-carbohydrate diets; those with the T allele may benefit from a more moderate carbohydrate approach.',
    gene: 'IRS1 gene',
    inheritance: 'Additive - Gly972Arg variant'
  },
  pparg_adipocyte: {
    term: 'Fat Cell Response (PPARG)',
    definition: 'PPARG governs how fat cells develop and how sensitively they respond to insulin. The protective Ala12 variant improves insulin sensitivity compared to the predominant Pro12 form, and responds particularly well to monounsaturated fat-rich diets such as Mediterranean eating.',
    gene: 'PPARG gene',
    inheritance: 'Additive - Pro12Ala variant'
  },
  ugt1a1_fasting: {
    term: 'Fasting Response (UGT1A1)',
    definition: 'UGT1A1 processes bilirubin in the liver. The *28 allele reduces enzyme activity, causing mild bilirubin accumulation — most noticeable during prolonged fasting when bilirubin can build to the point of visible yellowing (Gilbert\'s syndrome). Regular meal timing prevents episodes entirely.',
    gene: 'UGT1A1 gene',
    inheritance: 'Recessive — two *28 copies for Gilbert\'s syndrome'
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


  glucose_metabolism: {
    snp: 'rs7903146',
    studies: [
      'Grant et al. (2006) Nature Genetics - TCF7L2 as strongest genetic contributor to T2D risk (OR 1.4-1.5)',
      'Cornelis et al. (2009) Diabetologia - TCF7L2 modifies response to whole grain dietary interventions'
    ],
    databases: ['gnomAD v4', 'GWAS Catalog', 'DIAGRAM Consortium']
  },


  beta_carotene_conversion: {
    snp: 'rs12934922, rs7501331, rs6564851',
    studies: [
      'Leung et al. (2009) FASEB Journal - BCO1 variants reduce beta-carotene conversion by up to 69%',
      'Ferrucci et al. (2009) American Journal of Clinical Nutrition - GWAS for plasma carotenoids (P = 1.6 × 10⁻²⁴)'
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


  celiac_susceptibility: {
    snp: 'rs2187668 (HLA-DQ2.5), rs7454108 (HLA-DQ8)',
    studies: [
      'Sollid et al. (1989) Journal of Experimental Medicine - HLA-DQ association with celiac disease',
      'Romanos et al. (2009) PLoS ONE - Tag SNPs for celiac risk stratification'
    ],
    databases: ['gnomAD v4', 'ClinVar', 'HLA databases']
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
  glucose_metabolism: { icon: '🍬', title: 'Glucose Metabolism', cssClass: 'glucose' },
  beta_carotene_conversion: { icon: '🥕', title: 'Vitamin A Conversion', cssClass: 'beta-carotene' },
  salt_sensitivity: { icon: '🧂', title: 'Salt Sensitivity', cssClass: 'salt' },
  salt_sensitive_hypertension: { icon: '💓', title: 'Salt & Blood Pressure', cssClass: 'salt-bp' },
  bitter_taste_perception: { icon: '🥦', title: 'Bitter Taste Perception', cssClass: 'bitter' },
  celiac_susceptibility: { icon: '🌾', title: 'Celiac Susceptibility', cssClass: 'celiac' },
  insulin_sensitivity: { icon: '💉', title: 'Insulin Sensitivity', cssClass: 'insulin' },
  antioxidant_capacity: { icon: '🫐', title: 'Antioxidant Capacity', cssClass: 'antioxidant' },
  cruciferous_metabolism_gstm1: { icon: '🥗', title: 'Detox Enzyme (GSTM1)', cssClass: 'detox' },
  cruciferous_metabolism_gstt1: { icon: '🥗', title: 'Detox Enzyme (GSTT1)', cssClass: 'detox' },

  // Population-specific adaptations
  alcohol_metabolism: { icon: '🍺', title: 'Alcohol Metabolism', cssClass: 'alcohol' },
  arctic_fat_metabolism: { icon: '🧊', title: 'Arctic Fat Metabolism', cssClass: 'arctic' },
  polynesian_energy_storage: { icon: '⚡', title: 'Energy Storage', cssClass: 'energy' },
  altitude_adaptation_epas1: { icon: '🏔️', title: 'Altitude Adaptation', cssClass: 'altitude' },
  edar_adaptation: { icon: '🌡️', title: 'East Asian Variant', cssClass: 'edar' },

  // Batch 2: Population-specific high-impact variants
  g6pd_deficiency: { icon: '🫘', title: 'G6PD Deficiency', cssClass: 'g6pd' },
  abca1_r230c: { icon: '🫀', title: 'Cholesterol Efflux (R230C)', cssClass: 'abca1' },
  slc16a11_diabetes: { icon: '🩸', title: 'SLC16A11 Diabetes Risk', cssClass: 'slc16a11' },
  tbc1d4_diabetes: { icon: '🏔️', title: 'Arctic Diabetes Risk (TBC1D4)', cssClass: 'tbc1d4' },

  // Batch 3: Multi-gene panels
  // Vitamin D Panel
  cyp2r1_vitamin_d: { icon: '☀️', title: 'Vitamin D Hydroxylation', cssClass: 'vit-d-hydrox' },
  vdr_response: { icon: '🦴', title: 'Vitamin D Receptor', cssClass: 'vdr' },
  // Methylation Panel
  mtr_b12_methylation: { icon: '🔄', title: 'MTR B12 Methylation', cssClass: 'mtr' },
  mtrr_methylation: { icon: '🔄', title: 'MTRR Methylation Support', cssClass: 'mtrr' },
  comt_methylation: { icon: '🥦', title: 'COMT Enzyme Activity', cssClass: 'comt' },
  // African Salt Panel
  cyp11b2_hypertension: { icon: '💓', title: 'Aldosterone & Salt Response', cssClass: 'cyp11b2' },
  agtr1_hypertension: { icon: '💓', title: 'Angiotensin Receptor & BP', cssClass: 'agtr1' },

  // Batch 4: Behavior/Appetite genes
  lepr_satiety: { icon: '🍽️', title: 'Leptin Receptor & Satiety', cssClass: 'lepr' },
  bdnf_fat_appetite: { icon: '🧠', title: 'BDNF Fat Appetite', cssClass: 'bdnf' },
  cd36_fat_taste: { icon: '👅', title: 'Fat Taste Sensitivity', cssClass: 'cd36' },
  fads2_vegetarian: { icon: '🌱', title: 'Vegetarian Fat Adaptation', cssClass: 'fads2' },

  // Batch 5: Chrononutrition and Sensitivity
  clock_chronotype: { icon: '🕐', title: 'Circadian Meal Timing', cssClass: 'clock' },
  per1_meal_timing: { icon: '⏰', title: 'Meal Regularity Response', cssClass: 'per1' },
  dao_histamine: { icon: '🧀', title: 'Histamine Tolerance (DAO)', cssClass: 'dao' },
  adora2a_caffeine_anxiety: { icon: '😰', title: 'Caffeine Sensitivity (Anxiety)', cssClass: 'adora2a' },

  // Batch 6: Founder/Regional Variants
  abcg2_gout: { icon: '🦶', title: 'Uric Acid Transport (Gout)', cssClass: 'abcg2' },
  slc2a9_urate: { icon: '🦶', title: 'Urate Metabolism', cssClass: 'slc2a9' },
  ashkenazi_ldlr_fh: { icon: '❤️', title: 'Familial Hypercholesterolemia', cssClass: 'ldlr-fh' },

  // Batch 7: High-Priority Nutrigenomic Genes
  mthfr_folate: { icon: '🧬', title: 'Folate Metabolism (MTHFR)', cssClass: 'mthfr' },
  fto_obesity: { icon: '🍽️', title: 'Satiety & Appetite (FTO)', cssClass: 'fto' },
  hfe_iron_overload: { icon: '🩸', title: 'Iron Overload Risk (HFE)', cssClass: 'hfe' },
  tas2r38_bitter: { icon: '😝', title: 'Bitter Taste (TAS2R38)', cssClass: 'tas2r38' },
  tcf7l2_diabetes: { icon: '🍬', title: 'Diabetes Risk (TCF7L2)', cssClass: 'tcf7l2' },
  bco1_vitamin_a: { icon: '🥕', title: 'Vitamin A Conversion (BCO1)', cssClass: 'bco1' },
  mc4r_appetite: { icon: '🧠', title: 'Appetite Regulation (MC4R)', cssClass: 'mc4r' },
  ace_salt_sensitivity: { icon: '🧂', title: 'Salt Sensitivity (ACE)', cssClass: 'ace' },
  nat2_acetylator: { icon: '🥩', title: 'Meat Carcinogen Metabolism (NAT2)', cssClass: 'nat2' },

  // Batch 8: Tier 2 Nutrigenomic Genes
  lipc_hdl: { icon: '💗', title: 'HDL & Fat Response (LIPC)', cssClass: 'lipc' },
  ppara_pufa: { icon: '🐟', title: 'PUFA Metabolism (PPARA)', cssClass: 'ppara' },
  drd2_food_reward: { icon: '🎰', title: 'Food Reward (DRD2)', cssClass: 'drd2' },
  gc_vitamin_d: { icon: '☀️', title: 'Vitamin D Binding (GC)', cssClass: 'gc' },
  pemt_choline: { icon: '🥚', title: 'Choline Synthesis (PEMT)', cssClass: 'pemt' },
  fabp2_fat_absorption: { icon: '🧈', title: 'Fat Absorption (FABP2)', cssClass: 'fabp2' },
  tmprss6_iron: { icon: '🩸', title: 'Iron Absorption (TMPRSS6)', cssClass: 'tmprss6' },

  // Batch 9: Tier 3 Nutrigenomic Genes
  agt_salt: { icon: '🧂', title: 'Salt & BP Response (AGT)', cssClass: 'agt' },
  adrb2_weight_loss: { icon: '⚖️', title: 'Weight Loss Response (ADRB2)', cssClass: 'adrb2' },
  tas1r2_sweet: { icon: '🍭', title: 'Sweet Taste (TAS1R2)', cssClass: 'tas1r2' },
  oprm1_food_reward: { icon: '🎯', title: 'Food Pleasure (OPRM1)', cssClass: 'oprm1' },
  adrb3_thermogenesis: { icon: '🔥', title: 'Thermogenesis (ADRB3)', cssClass: 'adrb3' },
  irs1_insulin: { icon: '💉', title: 'Insulin Signaling (IRS1)', cssClass: 'irs1' },
  pparg_adipocyte: { icon: '🫒', title: 'Fat Cell Response (PPARG)', cssClass: 'pparg' },
  ugt1a1_fasting: { icon: '⏰', title: 'Fasting Response (UGT1A1)', cssClass: 'ugt1a1' },

  // ============================================================================
  // BATCH 10: POSITIVE TRAIT CATEGORIES (Scaffolded for future research)
  // These categories emphasize genetic STRENGTHS rather than risks
  // ============================================================================

  // --- Fasting & Metabolic Flexibility ---
  // Genes that indicate ability to thrive on intermittent fasting or time-restricted eating
  sirt1_fasting: { icon: '🧘', title: 'Fasting Adaptation (SIRT1)', cssClass: 'sirt1' },
  ppargc1a_metabolic_flex: { icon: '⚡', title: 'Metabolic Flexibility (PGC-1α)', cssClass: 'ppargc1a' },
  foxo3_longevity_fasting: { icon: '🌿', title: 'Fasting Longevity Response (FOXO3)', cssClass: 'foxo3' },
  ampk_energy_sensing: { icon: '🔋', title: 'Energy Sensing Efficiency (AMPK)', cssClass: 'ampk' },

  // --- Gut Microbiome Interaction ---
  // Genes affecting prebiotic utilization, fiber fermentation, and gut health
  fut2_secretor: { icon: '🦠', title: 'Secretor Status (FUT2)', cssClass: 'fut2-secretor' },
  muc2_gut_barrier: { icon: '🛡️', title: 'Gut Barrier Function (MUC2)', cssClass: 'muc2' },
  tlr4_gut_immunity: { icon: '🦠', title: 'Gut Immune Response (TLR4)', cssClass: 'tlr4' },

  // --- Antioxidant & Cellular Protection ---
  // Genes indicating strong endogenous antioxidant capacity
  sod2_antioxidant: { icon: '🛡️', title: 'Superoxide Defense (SOD2)', cssClass: 'sod2' },
  cat_antioxidant: { icon: '🫐', title: 'Catalase Activity (CAT)', cssClass: 'cat' },
  gpx1_selenium: { icon: '🥜', title: 'Selenium Utilization (GPX1)', cssClass: 'gpx1' },
  nrf2_detox: { icon: '🥦', title: 'Detox Pathway Activation (NRF2)', cssClass: 'nrf2' },
  gstp1_antioxidant: { icon: '🍇', title: 'Glutathione S-Transferase (GSTP1)', cssClass: 'gstp1' },

  // --- Thermic Effect & Metabolism Boost ---
  // Genes affecting calorie burn, brown fat activity, and metabolic rate
  ucp1_brown_fat: { icon: '🔥', title: 'Brown Fat Activity (UCP1)', cssClass: 'ucp1' },
  ucp2_metabolic_rate: { icon: '⚡', title: 'Metabolic Rate (UCP2)', cssClass: 'ucp2' },
  ucp3_muscle_thermogenesis: { icon: '💪', title: 'Muscle Thermogenesis (UCP3)', cssClass: 'ucp3' },
  dio2_thyroid: { icon: '🦋', title: 'Thyroid Hormone Activation (DIO2)', cssClass: 'dio2' },
  trpm8_cold_tolerance: { icon: '❄️', title: 'Cold Tolerance (TRPM8)', cssClass: 'trpm8' },

  // --- Protein Utilization & Muscle ---
  // Genes affecting protein synthesis, muscle building, and recovery
  actn3_power: { icon: '🏋️', title: 'Power/Endurance Balance (ACTN3)', cssClass: 'actn3' },
  mstn_muscle: { icon: '💪', title: 'Muscle Growth Potential (MSTN)', cssClass: 'mstn' },
  il6_recovery: { icon: '🔄', title: 'Exercise Recovery (IL-6)', cssClass: 'il6' },
  igf1_growth: { icon: '📈', title: 'Growth Factor Response (IGF-1)', cssClass: 'igf1' },
  vegf_circulation: { icon: '🩸', title: 'Circulation & Oxygen Delivery (VEGF)', cssClass: 'vegf' },

  // --- Longevity & Cellular Health ---
  // Genes associated with healthy aging and cellular maintenance
  tert_telomere: { icon: '🧬', title: 'Telomere Maintenance (TERT)', cssClass: 'tert' },
  klotho_aging: { icon: '🌳', title: 'Healthy Aging (Klotho)', cssClass: 'klotho' },
  cetp_longevity: { icon: '❤️', title: 'Longevity Lipids (CETP)', cssClass: 'cetp' },
  apoe_brain_health: { icon: '🧠', title: 'Brain Health & Lipids (APOE)', cssClass: 'apoe' },

  // --- Nutrient Absorption Efficiency ---
  // Genes indicating superior absorption of key nutrients
  slc23a1_vitamin_c: { icon: '🍊', title: 'Vitamin C Absorption (SLC23A1)', cssClass: 'slc23a1' },
  slc30a8_zinc: { icon: '🦪', title: 'Zinc Transport (SLC30A8)', cssClass: 'slc30a8' },
  tcn2_b12_transport: { icon: '🔴', title: 'B12 Transport Efficiency (TCN2)', cssClass: 'tcn2' },
  atp7a_copper: { icon: '🥩', title: 'Copper Metabolism (ATP7A)', cssClass: 'atp7a' },
  slc11a2_iron_absorption: { icon: '🥬', title: 'Iron Absorption (SLC11A2)', cssClass: 'slc11a2' },

  // --- Cholesterol & Lipid Optimization ---
  // Genes affecting healthy lipid profiles and dietary cholesterol response
  pcsk9_ldl: { icon: '💚', title: 'LDL Clearance (PCSK9)', cssClass: 'pcsk9' },
  apoa1_hdl: { icon: '💛', title: 'HDL Production (APOA1)', cssClass: 'apoa1' },
  ldlr_cholesterol: { icon: '❤️', title: 'Cholesterol Receptor (LDLR)', cssClass: 'ldlr' },
  lpl_triglycerides: { icon: '🫒', title: 'Triglyceride Clearance (LPL)', cssClass: 'lpl' },

  // --- Taste & Food Preference (Positive framing) ---
  // Genes that may enhance dietary compliance through taste preferences
  tas1r3_umami: { icon: '🍲', title: 'Umami Taste (TAS1R3)', cssClass: 'tas1r3' },
  or7d4_savory: { icon: '🥘', title: 'Savory Preference (OR7D4)', cssClass: 'or7d4' },
  trpv1_spice: { icon: '🌶️', title: 'Spice Tolerance (TRPV1)', cssClass: 'trpv1' },

  // --- Stress Resilience & Appetite Regulation ---
  // Genes affecting emotional eating, stress response, and food-mood connection
  crhr1_stress_eating: { icon: '🧘', title: 'Stress Eating Resilience (CRHR1)', cssClass: 'crhr1' },
  npy_appetite: { icon: '😊', title: 'Appetite Balance (NPY)', cssClass: 'npy' },
  agrp_hunger: { icon: '🍽️', title: 'Hunger Signaling (AgRP)', cssClass: 'agrp' },
  pomc_satiety: { icon: '✅', title: 'Satiety Signaling (POMC)', cssClass: 'pomc' },

  // --- New Dietary Phenotype Genes ---
  pon1_antioxidant:      { icon: '🫒', title: 'Antioxidant Protection',     cssClass: 'pon1' },
  gckr_carb_sensitivity: { icon: '🍞', title: 'Carb Sensitivity',           cssClass: 'gckr' },
  fgf21_carb_preference: { icon: '🍬', title: 'Carb vs Fat Preference',     cssClass: 'fgf21' },
  apoa5_triglycerides:   { icon: '🥩', title: 'Fat & Triglycerides',        cssClass: 'apoa5' },
  slc6a4_serotonin:      { icon: '🧠', title: 'Serotonin & Cravings',       cssClass: 'slc6a4' },
  hnmt_histamine:        { icon: '🫙', title: 'Histamine Clearance (HNMT)', cssClass: 'hnmt' },
  cyp4f2_vitamin_e:      { icon: '🫑', title: 'Vitamin E Metabolism',       cssClass: 'cyp4f2' },
  apoc3_omega3_response: { icon: '🐟', title: 'Omega-3 Response',           cssClass: 'apoc3' },
  cyp19a1_phytoestrogen: { icon: '🌿', title: 'Phytoestrogen Metabolism',   cssClass: 'cyp19a1' }
};

/**
 * Maps GENE_META display keys → category ID for grouping in the Genetics tab.
 */
const GENE_CATEGORY_MAP: Record<string, string> = {
  // Macronutrient Processing
  lactase_persistence: 'macro', starch_digestion: 'macro', pufa_metabolism: 'macro',
  saturated_fat_response: 'macro', glucose_metabolism: 'macro', insulin_sensitivity: 'macro',
  beta_carotene_conversion: 'macro', fads2_vegetarian: 'macro', ppara_pufa: 'macro',
  fabp2_fat_absorption: 'macro', irs1_insulin: 'macro', pparg_adipocyte: 'macro',
  celiac_susceptibility: 'macro',

  // Vitamins & Minerals
  vitamin_d_metabolism: 'vitamins',
  cyp2r1_vitamin_d: 'vitamins',
  vdr_response: 'vitamins', mtr_b12_methylation: 'vitamins', mtrr_methylation: 'vitamins',
  bco1_vitamin_a: 'vitamins', gc_vitamin_d: 'vitamins',
  pemt_choline: 'vitamins', tmprss6_iron: 'vitamins', slc23a1_vitamin_c: 'vitamins',
  slc30a8_zinc: 'vitamins', tcn2_b12_transport: 'vitamins', atp7a_copper: 'vitamins',
  slc11a2_iron_absorption: 'vitamins', mthfr_folate: 'vitamins', hfe_iron_overload: 'vitamins',
  comt_methylation: 'vitamins',

  // Cardiovascular & Blood Pressure
  salt_sensitivity: 'cardio', salt_sensitive_hypertension: 'cardio',
  cyp11b2_hypertension: 'cardio', agtr1_hypertension: 'cardio', lipc_hdl: 'cardio',
  pcsk9_ldl: 'cardio', apoa1_hdl: 'cardio', ldlr_cholesterol: 'cardio',
  lpl_triglycerides: 'cardio', apoe_brain_health: 'cardio', ashkenazi_ldlr_fh: 'cardio',
  cetp_longevity: 'cardio', ace_salt_sensitivity: 'cardio', agt_salt: 'cardio',
  abcg2_gout: 'cardio', slc2a9_urate: 'cardio',

  // Appetite, Taste & Behavior
  bitter_taste_perception: 'appetite',
  caffeine_metabolism: 'appetite', lepr_satiety: 'appetite', bdnf_fat_appetite: 'appetite',
  cd36_fat_taste: 'appetite', drd2_food_reward: 'appetite', oprm1_food_reward: 'appetite',
  fto_obesity: 'appetite', mc4r_appetite: 'appetite', npy_appetite: 'appetite',
  agrp_hunger: 'appetite', pomc_satiety: 'appetite', crhr1_stress_eating: 'appetite',
  adrb2_weight_loss: 'appetite', tas2r38_bitter: 'appetite', tas1r2_sweet: 'appetite',
  tas1r3_umami: 'appetite', or7d4_savory: 'appetite', trpv1_spice: 'appetite',
  dao_histamine: 'appetite', adora2a_caffeine_anxiety: 'appetite', nat2_acetylator: 'appetite',

  // Population-Specific Adaptations
  alcohol_metabolism: 'population', arctic_fat_metabolism: 'population',
  polynesian_energy_storage: 'population', altitude_adaptation_epas1: 'population',
  edar_adaptation: 'population', g6pd_deficiency: 'population', abca1_r230c: 'population',
  slc16a11_diabetes: 'population', tbc1d4_diabetes: 'population',

  // Detox & Cellular Defense
  antioxidant_capacity: 'detox', cruciferous_metabolism_gstm1: 'detox',
  cruciferous_metabolism_gstt1: 'detox', sod2_antioxidant: 'detox', cat_antioxidant: 'detox',
  gpx1_selenium: 'detox', nrf2_detox: 'detox',
  gstp1_antioxidant: 'detox',

  // Metabolic Flexibility, Longevity & Performance
  sirt1_fasting: 'metabolic', ppargc1a_metabolic_flex: 'metabolic',
  foxo3_longevity_fasting: 'metabolic', ampk_energy_sensing: 'metabolic',
  ucp1_brown_fat: 'metabolic', ucp2_metabolic_rate: 'metabolic',
  ucp3_muscle_thermogenesis: 'metabolic', dio2_thyroid: 'metabolic',
  trpm8_cold_tolerance: 'metabolic', adrb3_thermogenesis: 'metabolic',
  ugt1a1_fasting: 'metabolic', clock_chronotype: 'metabolic', per1_meal_timing: 'metabolic',
  actn3_power: 'metabolic', mstn_muscle: 'metabolic', il6_recovery: 'metabolic',
  igf1_growth: 'metabolic', vegf_circulation: 'metabolic', tert_telomere: 'metabolic',
  klotho_aging: 'metabolic', fut2_secretor: 'metabolic',
  muc2_gut_barrier: 'metabolic', tlr4_gut_immunity: 'metabolic',

  // New dietary phenotype genes
  gckr_carb_sensitivity: 'macro', fgf21_carb_preference: 'macro', apoc3_omega3_response: 'macro',
  apoa5_triglycerides: 'cardio',
  cyp4f2_vitamin_e: 'vitamins',
  slc6a4_serotonin: 'appetite', hnmt_histamine: 'appetite',
  pon1_antioxidant: 'detox',
  cyp19a1_phytoestrogen: 'metabolic',
};

const GENE_CATEGORY_INFO: Record<string, { label: string; icon: string }> = {
  macro:      { label: 'Macronutrient Processing',          icon: '🍽️' },
  vitamins:   { label: 'Vitamins & Minerals',               icon: '💊' },
  cardio:     { label: 'Cardiovascular & Blood Pressure',   icon: '🫀' },
  appetite:   { label: 'Appetite, Taste & Behavior',        icon: '🧠' },
  population: { label: 'Population-Specific Adaptations',  icon: '🌍' },
  detox:      { label: 'Detox & Cellular Defense',          icon: '🛡️' },
  metabolic:  { label: 'Metabolic Flexibility & Longevity', icon: '⚡' },
  other:      { label: 'Other Traits',                      icon: '🧬' },
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
  glucose_metabolism: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 35, phenotype: 'Higher T2DM Risk', rec: '🍬 <strong>Elevated diabetes risk:</strong> Prioritize low glycemic foods, limit refined carbs, emphasize fiber and regular exercise' },
      { min: 25, phenotype: 'Moderate T2DM Risk', rec: '🍬 <strong>Moderate diabetes risk:</strong> Emphasize low glycemic index carbohydrates, regular physical activity' },
      { min: 0, phenotype: 'Lower T2DM Risk', rec: '🍬 <strong>Lower diabetes risk:</strong> Standard carbohydrate guidelines apply' }
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
  celiac_susceptibility: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 25, phenotype: 'Higher Celiac Risk', rec: '🌾 <strong>Elevated celiac susceptibility:</strong> Monitor for gluten sensitivity symptoms, consider testing if GI issues arise' },
      { min: 15, phenotype: 'Moderate Celiac Risk', rec: '🌾 <strong>Moderate celiac susceptibility:</strong> Be aware of potential gluten sensitivity' },
      { min: 0, phenotype: 'Lower Celiac Risk', rec: '🌾 <strong>Lower celiac risk:</strong> Standard gluten intake typically fine' }
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
  },

  // Batch 2: Population-specific high-impact variants
  g6pd_deficiency: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'recessive',
    thresholds: [
      { min: 40, phenotype: 'High G6PD Deficiency Risk', rec: '🫘 <strong>High risk:</strong> Strictly avoid fava beans and oxidative foods, HbA1c unreliable for diabetes monitoring' },
      { min: 15, phenotype: 'Moderate G6PD Carrier Risk', rec: '🫘 <strong>Carrier risk:</strong> Limit fava beans, be aware of oxidative stress triggers in foods and medications' },
      { min: 0, phenotype: 'Low G6PD Deficiency Risk', rec: '🫘 <strong>Low risk:</strong> No specific G6PD-related dietary restrictions' }
    ]
  },
  abca1_r230c: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 8, phenotype: 'ABCA1 R230C Carrier Population', rec: '🫀 <strong>R230C variant:</strong> Lower-carb, higher-fat diet may improve metabolic markers — opposite of typical advice. Monitor HDL cholesterol.' },
      { min: 3, phenotype: 'Low ABCA1 R230C Frequency', rec: '🫀 <strong>Low R230C frequency:</strong> Standard dietary fat guidelines apply, some Indigenous American ancestry detected' },
      { min: 0, phenotype: 'ABCA1 R230C Absent', rec: '🫀 <strong>Standard:</strong> No R230C-related dietary modifications needed' }
    ]
  },
  slc16a11_diabetes: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 30, phenotype: 'High SLC16A11 Diabetes Risk', rec: '🩸 <strong>Elevated risk:</strong> Prioritize weight management and Mediterranean diet pattern, monitor fasting glucose early in life' },
      { min: 10, phenotype: 'Moderate SLC16A11 Risk', rec: '🩸 <strong>Moderate risk:</strong> Maintain healthy weight, regular glucose monitoring recommended' },
      { min: 0, phenotype: 'Low SLC16A11 Risk', rec: '🩸 <strong>Low risk:</strong> No SLC16A11-specific dietary modifications needed' }
    ]
  },
  tbc1d4_diabetes: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'recessive',
    thresholds: [
      { min: 10, phenotype: 'Elevated TBC1D4 Diabetes Risk', rec: '🏔️ <strong>Arctic variant:</strong> Exercise is critical — preserves glucose uptake despite insulin resistance. Request oral glucose tolerance test, not HbA1c. Traditional diet recommended.' },
      { min: 3, phenotype: 'Low TBC1D4 Carrier Frequency', rec: '🏔️ <strong>Low carrier frequency:</strong> Minimal TBC1D4 risk, standard diabetes screening appropriate' },
      { min: 0, phenotype: 'TBC1D4 Absent', rec: '🏔️ <strong>Standard:</strong> No TBC1D4-related risk detected' }
    ]
  },

  // Batch 3: Vitamin D Panel
  cyp2r1_vitamin_d: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'Reduced Vitamin D Activation', rec: '☀️ <strong>Impaired hydroxylation:</strong> May need higher vitamin D intake (2000-4000 IU/day), monitor 25(OH)D levels, adequate sun exposure critical' },
      { min: 30, phenotype: 'Moderate Vitamin D Activation', rec: '☀️ <strong>Moderate hydroxylation:</strong> Ensure 1000-2000 IU/day vitamin D, consider testing levels' },
      { min: 0, phenotype: 'Normal Vitamin D Activation', rec: '☀️ <strong>Normal hydroxylation:</strong> Standard vitamin D recommendations (600-1000 IU/day) typically sufficient' }
    ]
  },
  vdr_response: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 45, phenotype: 'Reduced VDR Response', rec: '🦴 <strong>Reduced receptor response:</strong> May need >2000 IU/day vitamin D for target levels, prioritize calcium-rich foods' },
      { min: 25, phenotype: 'Moderate VDR Response', rec: '🦴 <strong>Moderate response:</strong> Standard to slightly elevated vitamin D intake recommended' },
      { min: 0, phenotype: 'Normal VDR Response', rec: '🦴 <strong>Normal response:</strong> Standard vitamin D and calcium recommendations apply' }
    ]
  },

  // Batch 3: Methylation Panel
  mtr_b12_methylation: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Impaired MTR B12 Recycling', rec: '🔄 <strong>Impaired B12 recycling:</strong> Recommend methylcobalamin form of B12, monitor homocysteine levels' },
      { min: 20, phenotype: 'Moderate MTR Activity', rec: '🔄 <strong>Moderate MTR:</strong> Consider methylcobalamin, ensure adequate B12 intake' },
      { min: 0, phenotype: 'Normal MTR Activity', rec: '🔄 <strong>Normal MTR:</strong> Standard B12 recommendations apply' }
    ]
  },
  mtrr_methylation: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 45, phenotype: 'Significantly Impaired MTRR', rec: '🔄 <strong>Impaired MTRR:</strong> GG genotype — strongly recommend methylcobalamin + methylfolate, monitor in pregnancy' },
      { min: 25, phenotype: 'Moderate MTRR Function', rec: '🔄 <strong>Moderate MTRR:</strong> Consider methylated B vitamins, adequate folate intake important' },
      { min: 0, phenotype: 'Normal MTRR Function', rec: '🔄 <strong>Normal MTRR:</strong> Standard B vitamin recommendations apply' }
    ]
  },
  comt_methylation: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 45, phenotype: 'Slow COMT Activity', rec: '🥦 <strong>Slow COMT:</strong> Increase cruciferous vegetables for estrogen clearance, may be sensitive to caffeine/stress, limit catecholamine-boosting foods' },
      { min: 25, phenotype: 'Intermediate COMT Activity', rec: '🥦 <strong>Intermediate COMT:</strong> Balanced intake of cruciferous vegetables recommended' },
      { min: 0, phenotype: 'Fast COMT Activity', rec: '🥦 <strong>Fast COMT:</strong> Standard dietary recommendations, may tolerate caffeine well' }
    ]
  },

  // Batch 3: African Salt Panel
  cyp11b2_hypertension: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 60, phenotype: 'Elevated Aldosterone Response', rec: '💓 <strong>High aldosterone:</strong> Aggressive sodium restriction (<1500mg/day) recommended, monitor blood pressure closely' },
      { min: 35, phenotype: 'Moderate Aldosterone Response', rec: '💓 <strong>Moderate aldosterone:</strong> Moderate sodium restriction (1500-2300mg/day) advisable' },
      { min: 0, phenotype: 'Normal Aldosterone Response', rec: '💓 <strong>Normal aldosterone:</strong> Standard sodium guidelines apply' }
    ]
  },
  agtr1_hypertension: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 60, phenotype: 'Elevated Angiotensin Response', rec: '💓 <strong>High angiotensin:</strong> Aggressive sodium restriction + potassium-rich diet (DASH pattern) strongly recommended' },
      { min: 35, phenotype: 'Moderate Angiotensin Response', rec: '💓 <strong>Moderate angiotensin:</strong> DASH diet pattern beneficial, moderate sodium restriction' },
      { min: 0, phenotype: 'Normal Angiotensin Response', rec: '💓 <strong>Normal angiotensin:</strong> Standard cardiovascular guidelines apply' }
    ]
  },

  // Batch 4: Behavior/Appetite genes
  lepr_satiety: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Reduced Leptin Sensitivity', rec: '🍽️ <strong>Reduced satiety:</strong> Structured eating and strict portion control critical, monitor glucose regularly, protein-rich meals help' },
      { min: 25, phenotype: 'Moderate Leptin Sensitivity', rec: '🍽️ <strong>Moderate satiety:</strong> Mindful eating practices beneficial, maintain regular meal times' },
      { min: 0, phenotype: 'Normal Leptin Sensitivity', rec: '🍽️ <strong>Normal satiety:</strong> Standard dietary guidelines apply' }
    ]
  },
  bdnf_fat_appetite: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 35, phenotype: 'Fat-Specific Hyperphagia Risk', rec: '🧠 <strong>Fat hyperphagia:</strong> Strictly limit dietary fat — low-fat diet more effective than general calorie restriction. Effect is FAT-SPECIFIC, not seen on low-fat diets.' },
      { min: 15, phenotype: 'Moderate Fat Appetite Response', rec: '🧠 <strong>Moderate fat response:</strong> Moderate dietary fat intake, emphasize lean proteins and complex carbs' },
      { min: 0, phenotype: 'Normal Fat Appetite Response', rec: '🧠 <strong>Normal fat response:</strong> Standard macronutrient balance appropriate' }
    ]
  },
  cd36_fat_taste: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Reduced Fat Taste Sensitivity', rec: '👅 <strong>Reduced fat taste:</strong> Higher fat detection threshold — practice mindful eating, track fat intake, use texture modifications for satiety' },
      { min: 20, phenotype: 'Moderate Fat Taste Sensitivity', rec: '👅 <strong>Moderate fat taste:</strong> Pay attention to fat content, don\'t rely solely on taste cues' },
      { min: 0, phenotype: 'Normal Fat Taste Sensitivity', rec: '👅 <strong>Normal fat taste:</strong> Can use taste cues to regulate fat intake effectively' }
    ]
  },
  fads2_vegetarian: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'High Plant Fat Conversion', rec: '🌱 <strong>Efficient converter:</strong> Good EPA/DHA synthesis from plants, but reduce omega-6 oils (corn, soybean) to limit arachidonic acid. Favor mustard oil, olive oil, or ghee.' },
      { min: 25, phenotype: 'Moderate Plant Fat Conversion', rec: '🌱 <strong>Moderate conversion:</strong> Some benefit from plant omega-3, supplement with fish oil if not vegetarian' },
      { min: 0, phenotype: 'Low Plant Fat Conversion', rec: '🌱 <strong>Low conversion:</strong> Rely on preformed EPA/DHA from fish, fish oil, or algae rather than plant ALA sources' }
    ]
  },

  // Batch 5: Chrononutrition
  clock_chronotype: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 30, phenotype: 'Evening Chronotype Risk', rec: '🕐 <strong>Evening chronotype:</strong> Avoid eating within 2 hours of sleep, front-load calories to morning/afternoon for better weight management' },
      { min: 15, phenotype: 'Moderate Chronotype Variation', rec: '🕐 <strong>Moderate:</strong> Earlier dinner timing may be beneficial, avoid late-night snacking' },
      { min: 0, phenotype: 'Morning Chronotype Tendency', rec: '🕐 <strong>Morning tendency:</strong> Standard meal timing appropriate' }
    ]
  },
  per1_meal_timing: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 35, phenotype: 'High Meal Timing Response', rec: '⏰ <strong>High responder:</strong> Consistent meal timing within 1-hour daily window especially beneficial — 11.6% decrease in long-term weight gain' },
      { min: 20, phenotype: 'Moderate Meal Timing Response', rec: '⏰ <strong>Moderate responder:</strong> Regular eating schedule recommended for weight management' },
      { min: 0, phenotype: 'Lower Meal Timing Response', rec: '⏰ <strong>Lower responder:</strong> Less sensitive to meal timing variations' }
    ]
  },

  // Batch 5: Sensitivity genes
  dao_histamine: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 30, phenotype: 'Likely Histamine Intolerant', rec: '🧀 <strong>Low DAO:</strong> Avoid aged cheese, fermented foods, cured meats, wine. Consider DAO supplements before high-histamine meals.' },
      { min: 15, phenotype: 'Moderate DAO Activity', rec: '🧀 <strong>Moderate DAO:</strong> Monitor reactions to aged/fermented foods, moderate intake' },
      { min: 0, phenotype: 'Normal DAO Activity', rec: '🧀 <strong>Normal DAO:</strong> No specific restrictions on fermented or aged foods' }
    ]
  },
  adora2a_caffeine_anxiety: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Caffeine Sensitive', rec: '😰 <strong>Caffeine sensitive:</strong> Limit to <100mg/day for anxiety OR avoid after noon for insomnia. Separate from metabolism speed — you can be a fast metabolizer but still sensitive.' },
      { min: 25, phenotype: 'Moderate Caffeine Sensitivity', rec: '😰 <strong>Moderate sensitivity:</strong> Consider limiting to 200mg/day, avoid after 2pm if sleep issues' },
      { min: 0, phenotype: 'Normal Caffeine Tolerance', rec: '😰 <strong>Normal tolerance:</strong> Standard caffeine intake (up to 400mg/day) typically well-tolerated' }
    ]
  },

  // Batch 6: Gout Panel
  abcg2_gout: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 25, phenotype: 'Elevated Gout Risk', rec: '🦶 <strong>High gout risk:</strong> Strict purine restriction (limit organ meats, shellfish, beer). Hydrate 2-3L/day. Cherry juice may help.' },
      { min: 10, phenotype: 'Moderate Gout Risk', rec: '🦶 <strong>Moderate risk:</strong> Limit high-purine foods, stay well hydrated, limit beer and spirits' },
      { min: 0, phenotype: 'Low Gout Risk', rec: '🦶 <strong>Lower risk:</strong> Standard dietary guidelines apply' }
    ]
  },
  slc2a9_urate: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 90, phenotype: 'Near-Universal Urate Variant', rec: '🦶 <strong>Population-wide concern:</strong> Gout prevention is baseline lifestyle — prioritize hydration and purine restriction' },
      { min: 70, phenotype: 'High Urate Variant Frequency', rec: '🦶 <strong>High frequency:</strong> Good hydration and moderate purine intake recommended as baseline' },
      { min: 0, phenotype: 'Moderate Urate Variant', rec: '🦶 <strong>Moderate:</strong> Standard gout prevention guidelines apply' }
    ]
  },

  // Batch 6: Founder Variants
  ashkenazi_ldlr_fh: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'dominant',
    thresholds: [
      { min: 1, phenotype: 'Elevated FH Carrier Frequency', rec: '❤️ <strong>Elevated FH risk:</strong> Screen LDL cholesterol early, statin therapy may be needed, strictly limit saturated fat' },
      { min: 0.1, phenotype: 'Population Carrier Rate', rec: '❤️ <strong>General carrier rate:</strong> Standard lipid screening, earlier if family history of early heart disease' },
      { min: 0, phenotype: 'Minimal FH Risk', rec: '❤️ <strong>Low risk:</strong> This LDLR variant rare in this population, standard cardiovascular screening' }
    ]
  },

  // Batch 7: High-Priority Nutrigenomic Genes
  mthfr_folate: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'High MTHFR Variant Frequency', rec: '🧬 <strong>Higher folate needs:</strong> TT genotype common. Use methylfolate (5-MTHF), not folic acid. Emphasize leafy greens, legumes, methylated B vitamins.' },
      { min: 25, phenotype: 'Moderate MTHFR Variant Frequency', rec: '🧬 <strong>Moderate folate needs:</strong> Consider methylfolate supplements. Ensure adequate leafy greens and B vitamins.' },
      { min: 0, phenotype: 'Lower MTHFR Variant Frequency', rec: '🧬 <strong>Standard folate needs:</strong> Standard folic acid and dietary folate typically sufficient.' }
    ]
  },
  fto_obesity: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Higher Satiety Challenge', rec: '🍽️ <strong>Satiety support needed:</strong> High-protein meals (≥25% calories) improve fullness. Structured eating times, avoid energy-dense snacks.' },
      { min: 25, phenotype: 'Moderate Satiety Response', rec: '🍽️ <strong>Moderate satiety:</strong> Protein-rich meals beneficial. Regular meal patterns recommended.' },
      { min: 0, phenotype: 'Standard Satiety Response', rec: '🍽️ <strong>Standard satiety:</strong> Normal appetite regulation. Standard dietary guidelines apply.' }
    ]
  },
  hfe_iron_overload: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'recessive',
    thresholds: [
      { min: 3, phenotype: 'Hemochromatosis Risk Population', rec: '🩸 <strong>Iron overload risk:</strong> Avoid iron supplements unless deficient. Limit red meat and organ meats. Avoid vitamin C with iron-rich meals. Monitor ferritin.' },
      { min: 0.5, phenotype: 'Low Hemochromatosis Carrier Rate', rec: '🩸 <strong>Low carrier rate:</strong> Standard iron intake. Family history of iron overload warrants testing.' },
      { min: 0, phenotype: 'Minimal Hemochromatosis Risk', rec: '🩸 <strong>Minimal HFE risk:</strong> C282Y variant virtually absent. Standard iron recommendations apply.' }
    ]
  },
  tas2r38_bitter: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 55, phenotype: 'High Supertaster Population', rec: '😝 <strong>High bitter sensitivity:</strong> Many find cruciferous vegetables intensely bitter. Try roasting, sautéing with fat/garlic, or pairing with cheese.' },
      { min: 40, phenotype: 'Mixed Taster Distribution', rec: '😝 <strong>Mixed taster population:</strong> Varied bitter sensitivity. Cooking methods can improve vegetable palatability for sensitive individuals.' },
      { min: 0, phenotype: 'Higher Non-Taster Frequency', rec: '😝 <strong>More non-tasters:</strong> Cruciferous vegetables taste milder. May need to monitor vegetable variety for nutrition.' }
    ]
  },
  tcf7l2_diabetes: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 28, phenotype: 'Higher T2DM Genetic Risk', rec: '🍬 <strong>Elevated diabetes risk:</strong> Limit refined carbs. Emphasize nuts, legumes, Mediterranean diet. Nut consumption reduces metabolic syndrome risk 34% in T carriers.' },
      { min: 15, phenotype: 'Moderate T2DM Genetic Risk', rec: '🍬 <strong>Moderate diabetes risk:</strong> Low glycemic index carbs preferred. Regular activity important.' },
      { min: 0, phenotype: 'Lower T2DM Genetic Risk', rec: '🍬 <strong>Lower genetic risk:</strong> TCF7L2 risk variant uncommon. Standard carbohydrate guidelines apply.' }
    ]
  },
  bco1_vitamin_a: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 42, phenotype: 'Higher Poor Converter Frequency', rec: '🥕 <strong>Poor vitamin A converters common:</strong> Don\'t rely solely on beta-carotene. Include preformed vitamin A from eggs, dairy, or liver. Critical for vegetarians.' },
      { min: 32, phenotype: 'Mixed Converter Distribution', rec: '🥕 <strong>Mixed converter efficiency:</strong> Include both beta-carotene and preformed vitamin A sources for optimal status.' },
      { min: 0, phenotype: 'Better Converter Population', rec: '🥕 <strong>Better converters:</strong> Beta-carotene from orange/yellow vegetables converts efficiently. Plant sources adequate for most.' }
    ]
  },
  mc4r_appetite: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 25, phenotype: 'Higher Appetite Drive', rec: '🧠 <strong>Increased appetite drive:</strong> MC4R variants reduce satiety signaling. Use portion control, high-protein meals, and avoid ultra-processed snacks.' },
      { min: 18, phenotype: 'Moderate Appetite Drive', rec: '🧠 <strong>Moderate appetite:</strong> Some appetite-affecting variants present. Structured meals and protein emphasis helpful.' },
      { min: 0, phenotype: 'Lower Appetite Drive Risk', rec: '🧠 <strong>Standard appetite regulation:</strong> MC4R risk variants less common. Standard dietary guidelines apply.' }
    ]
  },
  ace_salt_sensitivity: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 55, phenotype: 'Higher DD Genotype (Less Salt-Sensitive)', rec: '🧂 <strong>Mixed salt sensitivity:</strong> DD genotype common but II individuals (~20%) are highly salt-sensitive. Monitor BP response to sodium.' },
      { min: 45, phenotype: 'Balanced I/D Distribution', rec: '🧂 <strong>Moderate salt sensitivity:</strong> Significant II genotype frequency. Sodium moderation (<2300mg/day) recommended.' },
      { min: 0, phenotype: 'Higher II Genotype (More Salt-Sensitive)', rec: '🧂 <strong>High salt sensitivity population:</strong> More II genotypes. Strict sodium limits (<1500mg/day), DASH diet, potassium-rich foods critical.' }
    ]
  },
  nat2_acetylator: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'recessive',
    thresholds: [
      { min: 50, phenotype: 'High Slow Acetylator Population', rec: '🥩 <strong>Many slow acetylators:</strong> Limit charred/well-done meat. Use lower-temp cooking (braising, steaming). Marinate before grilling to reduce carcinogens.' },
      { min: 30, phenotype: 'Mixed Acetylator Distribution', rec: '🥩 <strong>Mixed acetylator status:</strong> Moderate slow acetylator frequency. Limit heavily charred meats as precaution.' },
      { min: 0, phenotype: 'Mostly Rapid Acetylators', rec: '🥩 <strong>Rapid acetylators common:</strong> Most metabolize meat carcinogens efficiently. Standard grilling guidelines apply.' }
    ]
  },

  // Batch 8: Tier 2 Nutrigenomic Genes
  lipc_hdl: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'High T Allele (Lower Lipase)', rec: '💗 <strong>Lower hepatic lipase:</strong> Many TT genotypes. CC individuals benefit from moderate fat for HDL; TT should limit saturated fat.' },
      { min: 25, phenotype: 'Mixed LIPC Genotypes', rec: '💗 <strong>Mixed lipase activity:</strong> Variable HDL response to dietary fat. Monitor lipids and adjust fat intake accordingly.' },
      { min: 0, phenotype: 'Lower T Allele (Higher Lipase)', rec: '💗 <strong>Higher hepatic lipase:</strong> TT rare. Most can include moderate healthy fats. Saturated fat still limited for cardiovascular health.' }
    ]
  },
  ppara_pufa: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 5, phenotype: 'Val162 Carriers Present', rec: '🐟 <strong>PPARA Val162 carriers:</strong> Some individuals need ≥8% calories from PUFAs for normal lipids. Emphasize fatty fish, flaxseed, walnuts.' },
      { min: 0, phenotype: 'Val162 Rare', rec: '🐟 <strong>Val162 rare:</strong> Standard fat guidelines apply. PUFA intake still beneficial for general health.' }
    ]
  },
  drd2_food_reward: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 35, phenotype: 'High A1 Allele Frequency', rec: '🎰 <strong>Food reward genetics:</strong> Many have reduced D2 receptors. Structured eating, whole foods over processed, mindful eating practices recommended.' },
      { min: 22, phenotype: 'Moderate A1 Frequency', rec: '🎰 <strong>Moderate reward-seeking:</strong> Some vulnerability to palatable food overconsumption. Avoid ultra-processed food environments.' },
      { min: 0, phenotype: 'Lower A1 Frequency', rec: '🎰 <strong>Standard reward response:</strong> Most have normal dopamine receptor density. Standard dietary guidelines apply.' }
    ]
  },
  gc_vitamin_d: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 25, phenotype: 'Higher Risk Allele Frequency', rec: '☀️ <strong>Vitamin D binding affected:</strong> Many may need higher vitamin D intake (2000-4000 IU/day). Monitor 25(OH)D levels.' },
      { min: 15, phenotype: 'Moderate Risk Frequency', rec: '☀️ <strong>Moderate vitamin D genetics:</strong> Some may need above-standard vitamin D intake. Consider testing levels.' },
      { min: 0, phenotype: 'Lower Risk Frequency', rec: '☀️ <strong>Efficient vitamin D binding:</strong> Standard vitamin D recommendations typically adequate.' }
    ]
  },
  pemt_choline: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 70, phenotype: 'High C Allele (Very Common)', rec: '🥚 <strong>Choline needs elevated:</strong> Most carry C allele. Women especially need dietary choline (eggs, liver, soy). Critical during pregnancy.' },
      { min: 50, phenotype: 'Moderate C Allele', rec: '🥚 <strong>Moderate choline genetics:</strong> Many need dietary choline. Include eggs, liver, soybeans regularly.' },
      { min: 0, phenotype: 'Lower C Allele', rec: '🥚 <strong>Better endogenous synthesis:</strong> Less dependent on dietary choline, but adequate intake still recommended.' }
    ]
  },
  fabp2_fat_absorption: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 35, phenotype: 'Higher Thr54 Frequency', rec: '🧈 <strong>Enhanced fat absorption:</strong> Many absorb fat efficiently. Moderate-fat, PUFA-rich, high-fiber diet recommended to manage postprandial lipids.' },
      { min: 27, phenotype: 'Moderate Thr54 Frequency', rec: '🧈 <strong>Mixed fat absorption:</strong> Some have enhanced absorption. Emphasize healthy fats, avoid high-saturated-fat meals.' },
      { min: 0, phenotype: 'Lower Thr54 Frequency', rec: '🧈 <strong>Standard fat absorption:</strong> Standard fat handling. General healthy fat guidelines apply.' }
    ]
  },
  tmprss6_iron: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 55, phenotype: 'High T Allele (Lower Absorption)', rec: '🩸 <strong>Lower iron absorption:</strong> Many TT genotypes absorb ~30% less iron. Pair iron foods with vitamin C. Important for menstruating women.' },
      { min: 40, phenotype: 'Moderate T Allele Frequency', rec: '🩸 <strong>Mixed iron absorption:</strong> Variable iron uptake genetics. Monitor iron status, especially in at-risk groups.' },
      { min: 0, phenotype: 'Lower T Allele (Better Absorption)', rec: '🩸 <strong>Better iron absorption:</strong> Most absorb iron efficiently. Standard dietary iron guidelines apply.' }
    ]
  },

  // Batch 9: Tier 3 Nutrigenomic Genes
  agt_salt: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 70, phenotype: 'Very High Salt Sensitivity', rec: '🧂 <strong>High salt sensitivity:</strong> Most carry T allele. Sodium restriction (<2000mg/day) strongly recommended. DASH diet highly beneficial.' },
      { min: 50, phenotype: 'Elevated Salt Sensitivity', rec: '🧂 <strong>Elevated salt response:</strong> Many salt-sensitive. Moderate sodium (<2300mg/day), emphasize potassium-rich foods.' },
      { min: 0, phenotype: 'Lower Salt Sensitivity', rec: '🧂 <strong>Lower salt response:</strong> AGT T allele less common. Standard sodium guidelines apply, though moderation still wise.' }
    ]
  },
  adrb2_weight_loss: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 40, phenotype: 'Good Weight Loss Responders', rec: '⚖️ <strong>Enhanced diet response:</strong> Many Glu27 carriers respond well to energy restriction. Caloric deficit diets effective.' },
      { min: 25, phenotype: 'Mixed Weight Loss Response', rec: '⚖️ <strong>Variable diet response:</strong> Mixed ADRB2 genetics. Standard weight loss approaches recommended.' },
      { min: 0, phenotype: 'Lower Glu27 Frequency', rec: '⚖️ <strong>Standard response:</strong> Gln27 predominates. Weight loss may require more intensive approaches.' }
    ]
  },
  tas1r2_sweet: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 60, phenotype: 'Reduced Sweet Discrimination Common', rec: '🍭 <strong>Sugar awareness needed:</strong> Many TT genotypes may overconsume sugar. Label reading and portion awareness helpful, especially if overweight.' },
      { min: 50, phenotype: 'Mixed Sweet Sensitivity', rec: '🍭 <strong>Variable sweet taste:</strong> Mixed genetics. General sugar moderation recommended.' },
      { min: 0, phenotype: 'Better Sweet Discrimination', rec: '🍭 <strong>Better sweet sensing:</strong> Most discriminate sugar levels well. Standard sugar guidelines apply.' }
    ]
  },
  oprm1_food_reward: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 30, phenotype: 'Higher Hedonic Response', rec: '🎯 <strong>Enhanced food pleasure:</strong> Many G carriers experience heightened food reward. Mindful eating, distinguishing hunger from craving important.' },
      { min: 15, phenotype: 'Moderate Hedonic Response', rec: '🎯 <strong>Some enhanced reward:</strong> Some G carriers present. Awareness of hedonic eating patterns helpful.' },
      { min: 0, phenotype: 'Standard Hedonic Response', rec: '🎯 <strong>Standard food pleasure:</strong> G allele rare. Normal food reward response predominates.' }
    ]
  },
  adrb3_thermogenesis: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 18, phenotype: 'Reduced Thermogenesis Risk', rec: '🔥 <strong>Lower thermogenesis:</strong> Arg64 affects brown fat function. Thermogenic foods (capsaicin, green tea), physical activity, avoiding prolonged sitting help.' },
      { min: 10, phenotype: 'Some Thermogenesis Reduction', rec: '🔥 <strong>Some reduced thermogenesis:</strong> Arg64 present in some. General activity and avoiding sedentary time beneficial.' },
      { min: 0, phenotype: 'Normal Thermogenesis', rec: '🔥 <strong>Normal thermogenesis:</strong> Arg64 rare. Standard metabolic function predominates.' }
    ]
  },
  irs1_insulin: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 65, phenotype: 'High CC Genotype', rec: '💉 <strong>Good carb responders:</strong> Many CC genotypes respond well to high-complex-carb, low-saturated-fat diets for insulin sensitivity.' },
      { min: 55, phenotype: 'Moderate C Allele', rec: '💉 <strong>Mixed insulin genetics:</strong> Variable IRS1 status. Balanced macros with emphasis on complex carbs recommended.' },
      { min: 0, phenotype: 'Lower C Allele', rec: '💉 <strong>Consider lower carb:</strong> More T allele carriers. May benefit from moderate carb rather than high-carb approaches.' }
    ]
  },
  pparg_adipocyte: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'additive',
    thresholds: [
      { min: 10, phenotype: 'Ala12 Carriers Present', rec: '🫒 <strong>MUFA responders:</strong> Some Ala12 carriers with T2DM protection. MUFA-rich Mediterranean diet pattern beneficial.' },
      { min: 5, phenotype: 'Low Ala12 Frequency', rec: '🫒 <strong>Few Ala12 carriers:</strong> Variant uncommon. Standard dietary fat guidelines apply; MUFA still beneficial for all.' },
      { min: 0, phenotype: 'Ala12 Rare', rec: '🫒 <strong>Ala12 very rare:</strong> Pro12 predominates. Standard metabolic recommendations apply.' }
    ]
  },
  ugt1a1_fasting: {
    freqPath: 'allele_frequency_percent',
    inheritance: 'recessive',
    thresholds: [
      { min: 35, phenotype: 'Higher Gilbert\'s Frequency', rec: '⏰ <strong>Fasting caution:</strong> ~10%+ may have Gilbert\'s syndrome. *28/*28 individuals should avoid prolonged fasting to prevent jaundice episodes.' },
      { min: 25, phenotype: 'Moderate *28 Frequency', rec: '⏰ <strong>Some Gilbert\'s risk:</strong> Some *28/*28 homozygotes. Those with history of fasting-induced jaundice should eat regular meals.' },
      { min: 0, phenotype: 'Lower *28 Frequency', rec: '⏰ <strong>Lower Gilbert\'s risk:</strong> *28 allele less common. Standard fasting/intermittent fasting typically fine.' }
    ]
  }
};

// ============================================================================
// TRAIT ANALYSIS CONFIG - Data-driven Key Takeaways for all genes
// ============================================================================

const TRAIT_ANALYSIS_CONFIG = {
  // ============================================================================
  // CORE METABOLIC TRAITS (custom value getters)
  // Thresholds adjusted: lower strength thresholds, "absence of risk = strength"
  // ============================================================================
  lactase: {
    valueGetter: t => (t.probability || 0) * 100,
    strengthMin: 55, strengthTitle: 'Strong Dairy Tolerance',
    strengthDetail: v => `${v.toFixed(0)}% lactase persistence — dairy is well-suited to your genetics`,
    strengthIcon: '🥛',
    watchMax: 30, watchTitle: 'Dairy Sensitivity Likely',
    watchDetail: () => 'Consider fermented dairy (yogurt, kefir) or lactose-free options',
    watchIcon: '🥛'
  },
  amy1: {
    valueGetter: t => (t.copies || 0),
    strengthMin: 6, strengthTitle: 'Excellent Starch Digestion',
    strengthDetail: v => `${v.toFixed(0)} AMY1 copies — you digest starches efficiently`,
    strengthIcon: '🌾',
    watchMax: 4, watchTitle: 'Lower Starch Tolerance',
    watchDetail: () => 'Consider moderating refined carbohydrates and grains',
    watchIcon: '🌾'
  },
  fads: {
    valueGetter: t => (t.efficiency || 0),
    strengthMin: 55, strengthTitle: 'Efficient Omega-3 Conversion',
    strengthDetail: () => 'Plant omega-3s (flax, chia, walnuts) convert well for you',
    strengthIcon: '🐟',
    watchMax: 35, watchTitle: 'Limited Omega-3 Conversion',
    watchDetail: () => 'Prioritize direct marine sources (fatty fish, fish oil) over plant sources',
    watchIcon: '🐟'
  },

  // ============================================================================
  // NUTRIENT METABOLISM (frequency-based)
  // Added strengthMax entries: low risk allele frequency = genetic advantage
  // ============================================================================
  caffeine_metabolism: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 35, strengthTitle: 'Fast Caffeine Metabolizer',
    strengthDetail: () => 'You clear caffeine quickly — moderate coffee intake is fine',
    strengthIcon: '☕',
    watchMin: 55, watchTitle: 'Slow Caffeine Metabolizer',
    watchDetail: () => 'Limit caffeine to mornings; may affect sleep and blood pressure',
    watchIcon: '☕'
  },
  saturated_fat_response: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 20, strengthTitle: 'Healthy Fat Processing',
    strengthDetail: () => 'Your genetics handle saturated fats well — enjoy traditional fats in moderation',
    strengthIcon: '🥑',
    watchMin: 45, watchTitle: 'Saturated Fat Sensitivity',
    watchDetail: () => 'Your genetics suggest keeping saturated fat below 22g/day',
    watchIcon: '🥓'
  },
  glucose_metabolism: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 18, strengthTitle: 'Stable Blood Sugar Genetics',
    strengthDetail: () => 'Your genetics support healthy glucose regulation — a balanced diet works well',
    strengthIcon: '⚡',
    watchMin: 40, watchTitle: 'Blood Sugar Sensitivity',
    watchDetail: () => 'Focus on weight management and Mediterranean-style eating',
    watchIcon: '🍬'
  },
  salt_sensitivity: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 40, strengthTitle: 'Salt Resilient',
    strengthDetail: () => 'Your blood pressure is less affected by sodium — enjoy traditional salted foods',
    strengthIcon: '🧂',
    watchMin: 70, watchTitle: 'Salt Sensitive',
    watchDetail: () => 'Keep sodium under 2,000mg/day; increase potassium-rich foods',
    watchIcon: '🧂'
  },
  salt_sensitive_hypertension: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 40, strengthTitle: 'Blood Pressure Resilience',
    strengthDetail: () => 'Your cardiovascular genetics are favorable — maintain healthy habits',
    strengthIcon: '💚',
    watchMin: 70, watchTitle: 'Salt Sensitive Hypertension',
    watchDetail: () => 'Keep sodium under 2,000mg/day; increase potassium-rich foods',
    watchIcon: '🧂'
  },
  beta_carotene_conversion: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 25, strengthTitle: 'Efficient Vitamin A Conversion',
    strengthDetail: () => 'You convert plant carotenoids to vitamin A well — colorful vegetables benefit you',
    strengthIcon: '🥕',
    watchMin: 50, watchTitle: 'Poor Vitamin A Conversion',
    watchDetail: () => "Don't rely solely on carrots/sweet potatoes; include eggs, fish, or liver",
    watchIcon: '🥕'
  },
  bitter_taste_perception: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 35, strengthTitle: 'Broad Vegetable Palate',
    strengthDetail: () => 'Bitter vegetables taste milder to you — cruciferous veggies are easy to enjoy',
    strengthIcon: '🥗',
    watchMin: 65, watchTitle: 'Supertaster',
    watchDetail: () => 'Bitter vegetables (broccoli, kale) may taste intense — try roasting or adding fats',
    watchIcon: '🥦'
  },
  celiac_susceptibility: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 8, strengthTitle: 'Low Gluten Sensitivity Risk',
    strengthDetail: () => 'Your genetics show low celiac risk — whole grains can be part of your diet',
    strengthIcon: '🍞',
    watchMin: 20, watchTitle: 'Celiac Susceptibility',
    watchDetail: () => 'If you have GI symptoms, consider celiac testing',
    watchIcon: '🌾'
  },
  alcohol_metabolism: {
    valueGetter: t => t.probability !== undefined ? (1 - t.probability) * 100 : 0,
    strengthMax: 20, strengthTitle: 'Efficient Alcohol Processing',
    strengthDetail: () => 'Your body processes alcohol normally — moderate consumption is lower risk',
    strengthIcon: '🍷',
    watchMin: 50, watchTitle: 'Alcohol Flush Response',
    watchDetail: () => 'Likely to experience facial flushing with alcohol; increased health risks with heavy drinking',
    watchIcon: '🍺'
  },
  aldh2: {
    valueGetter: t => t.probability !== undefined ? (1 - t.probability) * 100 : 0,
    strengthMax: 20, strengthTitle: 'Efficient Alcohol Processing',
    strengthDetail: () => 'Your body processes alcohol normally — moderate consumption is lower risk',
    strengthIcon: '🍷',
    watchMin: 50, watchTitle: 'Alcohol Flush Response',
    watchDetail: () => 'Likely to experience facial flushing with alcohol; increased health risks with heavy drinking',
    watchIcon: '🍺'
  },
  cpt1a: {
    valueGetter: t => (t.probability || 0) * 100,
    strengthMin: 30, strengthTitle: 'Arctic Fat Adaptation',
    strengthDetail: () => 'Your metabolism is optimized for high-fat, low-carb diets',
    strengthIcon: '🧊'
  },
  arctic_fat_metabolism: {
    valueGetter: t => (t.probability || 0) * 100,
    strengthMin: 30, strengthTitle: 'Arctic Fat Adaptation',
    strengthDetail: () => 'Your metabolism is optimized for high-fat, low-carb diets',
    strengthIcon: '🧊'
  },
  altitude_adaptation_epas1: {
    valueGetter: t => (t.probability || 0) * 100,
    strengthMin: 30, strengthTitle: 'High-Altitude Adaptation',
    strengthDetail: () => 'Better oxygen efficiency at high elevations',
    strengthIcon: '🏔️'
  },
  altitude: {
    valueGetter: t => (t.probability || 0) * 100,
    strengthMin: 30, strengthTitle: 'High-Altitude Adaptation',
    strengthDetail: () => 'Better oxygen efficiency at high elevations',
    strengthIcon: '🏔️'
  },

  // ============================================================================
  // BATCH 2: Population-specific variants
  // Added positive framing for absence of risk variants
  // ============================================================================
  g6pd_deficiency: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 3, strengthTitle: 'Normal Oxidative Stress Response',
    strengthDetail: () => 'No G6PD concerns — fava beans and legumes are great protein sources for you',
    strengthIcon: '🫘',
    watchMin: 15, watchTitle: 'G6PD Deficiency Risk',
    watchDetail: () => 'Avoid fava beans and oxidative foods; monitor with your doctor',
    watchIcon: '🫘'
  },
  abca1_r230c: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 2, strengthTitle: 'Standard Cholesterol Metabolism',
    strengthDetail: () => 'Your cholesterol efflux follows typical patterns — standard dietary advice applies',
    strengthIcon: '💚',
    watchMin: 8, watchTitle: 'Reversed Diet Advice (ABCA1)',
    watchDetail: () => 'Lower-carb, higher-fat diet may improve your metabolic markers — opposite of typical advice',
    watchIcon: '🫀'
  },
  slc16a11_diabetes: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 5, strengthTitle: 'Low SLC16A11 Diabetes Risk',
    strengthDetail: () => 'Your genetics show lower risk for this diabetes pathway',
    strengthIcon: '💪',
    watchMin: 20, watchTitle: 'SLC16A11 Diabetes Risk',
    watchDetail: () => 'Prioritize weight management; monitor fasting glucose early in life',
    watchIcon: '🩸'
  },
  tbc1d4_diabetes: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 2, strengthTitle: 'Normal Glucose Uptake',
    strengthDetail: () => 'Your muscle glucose uptake genetics are typical — standard exercise benefits apply',
    strengthIcon: '🏃',
    watchMin: 8, watchTitle: 'Arctic Diabetes Variant',
    watchDetail: () => 'Exercise is critical for glucose uptake; request oral glucose tolerance test',
    watchIcon: '🏔️'
  },

  // ============================================================================
  // BATCH 3: Vitamin D & Methylation Panel
  // Added positive framing for efficient vitamin processing
  // ============================================================================
  cyp2r1_vitamin_d: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 25, strengthTitle: 'Efficient Vitamin D Activation',
    strengthDetail: () => 'Your body activates vitamin D efficiently — standard sun exposure and diet work well',
    strengthIcon: '☀️',
    watchMin: 50, watchTitle: 'Needs Higher Vitamin D',
    watchDetail: () => 'Impaired vitamin D activation — may need 2000-4000 IU/day',
    watchIcon: '☀️'
  },
  vdr_response: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 22, strengthTitle: 'Strong Vitamin D Response',
    strengthDetail: () => 'Your vitamin D receptors work efficiently — bones and immunity benefit from moderate intake',
    strengthIcon: '🦴',
    watchMin: 45, watchTitle: 'Reduced Vitamin D Response',
    watchDetail: () => 'May need >2000 IU/day vitamin D; prioritize calcium-rich foods',
    watchIcon: '🦴'
  },
  mtr_b12_methylation: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 18, strengthTitle: 'Efficient B12 Recycling',
    strengthDetail: () => 'Your B12 methylation cycle works well — standard B12 sources are effective',
    strengthIcon: '🔄',
    watchMin: 40, watchTitle: 'B12 Recycling Impaired',
    watchDetail: () => 'Consider methylcobalamin form of B12; monitor homocysteine',
    watchIcon: '🔄'
  },
  mtrr_methylation: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 22, strengthTitle: 'Good Methylation Support',
    strengthDetail: () => 'Your methylation enzymes function well — balanced diet supports cellular health',
    strengthIcon: '✨',
    watchMin: 45, watchTitle: 'Methylation Support Needed',
    watchDetail: () => 'Recommend methylcobalamin + methylfolate supplementation',
    watchIcon: '🔄'
  },
  comt_methylation: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 22, strengthTitle: 'Balanced COMT Activity',
    strengthDetail: () => 'Your stress hormone clearance is well-regulated — caffeine tolerance is typical',
    strengthIcon: '🧘',
    watchMin: 45, watchTitle: 'Slow COMT — Eat Cruciferous',
    watchDetail: () => 'Increase cruciferous vegetables for estrogen clearance; may be caffeine-sensitive',
    watchIcon: '🥦'
  },

  // ============================================================================
  // BATCH 3: Salt Panel
  // Added positive framing for cardiovascular resilience
  // ============================================================================
  cyp11b2_hypertension: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 30, strengthTitle: 'Balanced Aldosterone Response',
    strengthDetail: () => 'Your salt-hormone balance is well-regulated — enjoy traditional seasoning in moderation',
    strengthIcon: '💚',
    watchMin: 60, watchTitle: 'Sodium Restriction Needed',
    watchDetail: () => 'Elevated aldosterone response — limit sodium to <1500mg/day',
    watchIcon: '💓'
  },
  agtr1_hypertension: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 30, strengthTitle: 'Healthy Angiotensin Response',
    strengthDetail: () => 'Your blood pressure regulation genetics are favorable — maintain healthy habits',
    strengthIcon: '💚',
    watchMin: 60, watchTitle: 'Sodium + Potassium Focus',
    watchDetail: () => 'Elevated angiotensin response — DASH diet pattern strongly recommended',
    watchIcon: '💓'
  },

  // ============================================================================
  // BATCH 4: Appetite/Behavior Genes
  // Added positive framing for appetite regulation strengths
  // ============================================================================
  lepr_satiety: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 20, strengthTitle: 'Strong Satiety Signals',
    strengthDetail: () => 'Your leptin signaling works well — you feel full appropriately after meals',
    strengthIcon: '😊',
    watchMin: 45, watchTitle: 'Structured Eating Needed',
    watchDetail: () => 'Reduced leptin sensitivity — strict portion control and protein-rich meals help',
    watchIcon: '🍽️'
  },
  bdnf_fat_appetite: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 18, strengthTitle: 'Balanced Fat Appetite',
    strengthDetail: () => 'Your brain-fat signaling is well-regulated — healthy fats satisfy appropriately',
    strengthIcon: '🧠',
    watchMin: 40, watchTitle: 'Limit Dietary Fat',
    watchDetail: () => 'Fat-specific hyperphagia risk — low-fat diet more effective than general calorie restriction',
    watchIcon: '🧠'
  },
  cd36_fat_taste: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 20, strengthTitle: 'Good Fat Taste Sensitivity',
    strengthDetail: () => 'You detect dietary fat easily — helps with natural portion control',
    strengthIcon: '👅',
    watchMin: 45, watchTitle: 'Mindful Eating for Fat',
    watchDetail: () => 'Reduced fat taste sensitivity — track fat intake, use texture cues for satiety',
    watchIcon: '👅'
  },
  fads2_vegetarian: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 35, strengthTitle: 'Efficient Plant Fat Conversion',
    strengthDetail: () => 'Good EPA/DHA synthesis from plants — reduce omega-6 oils, favor olive oil',
    strengthIcon: '🌱'
  },

  // ============================================================================
  // BATCH 5: Chrononutrition & Sensitivity
  // Added positive framing for circadian alignment
  // ============================================================================
  clock_chronotype: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 15, strengthTitle: 'Flexible Meal Timing',
    strengthDetail: () => 'Your circadian genes are adaptable — meal timing is less critical for you',
    strengthIcon: '🕐',
    watchMin: 35, watchTitle: 'Eat Earlier in the Day',
    watchDetail: () => 'Evening chronotype risk — front-load calories to morning/afternoon',
    watchIcon: '🕐'
  },
  per1_meal_timing: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 25, strengthTitle: 'Regular Timing Helps Weight',
    strengthDetail: () => 'Consistent meal timing especially beneficial — up to 11.6% decrease in weight gain',
    strengthIcon: '⏰'
  },
  dao_histamine: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 15, strengthTitle: 'Good Histamine Tolerance',
    strengthDetail: () => 'Your DAO enzyme works well — enjoy aged cheeses and fermented foods freely',
    strengthIcon: '🧀',
    watchMin: 35, watchTitle: 'Histamine Sensitivity',
    watchDetail: () => 'Avoid aged cheese, wine, cured meats; consider DAO supplements',
    watchIcon: '🧀'
  },
  adora2a_caffeine_anxiety: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 20, strengthTitle: 'Caffeine Well-Tolerated',
    strengthDetail: () => 'Low caffeine anxiety risk — coffee can be part of your daily routine',
    strengthIcon: '☕',
    watchMin: 45, watchTitle: 'Caffeine Anxiety Risk',
    watchDetail: () => 'Limit caffeine to <100mg/day or consider decaf — sensitivity is separate from metabolism speed',
    watchIcon: '😰'
  },

  // ============================================================================
  // BATCH 6: Gout & Founder Variants
  // Added positive framing for low uric acid risk
  // ============================================================================
  abcg2_gout: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 12, strengthTitle: 'Efficient Uric Acid Clearance',
    strengthDetail: () => 'Your urate transport works well — enjoy shellfish and organ meats in moderation',
    strengthIcon: '🦪',
    watchMin: 28, watchTitle: 'Gout Risk — Limit Purines',
    watchDetail: () => 'Restrict organ meats, shellfish, beer; hydrate 2-3L/day',
    watchIcon: '🦶'
  },
  slc2a9_urate: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 70, strengthTitle: 'Good Urate Metabolism',
    strengthDetail: () => 'Your uric acid metabolism is efficient — standard hydration and diet work well',
    strengthIcon: '💧',
    watchMin: 90, watchTitle: 'Population-Wide Gout Concern',
    watchDetail: () => 'Gout prevention is baseline lifestyle — prioritize hydration and purine restriction',
    watchIcon: '🦶'
  },
  ashkenazi_ldlr_fh: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 0.2, strengthTitle: 'Low FH Carrier Risk',
    strengthDetail: () => 'Low familial hypercholesterolemia risk — standard lipid monitoring is adequate',
    strengthIcon: '❤️',
    watchMin: 0.8, watchTitle: 'Screen LDL Early',
    watchDetail: () => 'Elevated familial hypercholesterolemia carrier frequency — early lipid screening recommended',
    watchIcon: '❤️'
  },

  // ============================================================================
  // BATCH 10: POSITIVE TRAIT ANALYSIS (Scaffolded for future research)
  // These traits emphasize genetic STRENGTHS — ready for data population
  // ============================================================================

  // --- Fasting & Metabolic Flexibility ---
  sirt1_fasting: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 30, strengthTitle: 'Fasting Adaptation',
    strengthDetail: () => 'Your SIRT1 genetics support intermittent fasting — time-restricted eating may be especially beneficial',
    strengthIcon: '🧘'
  },
  ppargc1a_metabolic_flex: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 35, strengthTitle: 'Metabolic Flexibility',
    strengthDetail: () => 'You efficiently switch between burning carbs and fats — varied diets work well for you',
    strengthIcon: '⚡'
  },
  foxo3_longevity_fasting: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 25, strengthTitle: 'Longevity Fasting Response',
    strengthDetail: () => 'FOXO3 variant associated with longevity — fasting may activate protective pathways',
    strengthIcon: '🌿'
  },

  // --- Gut Microbiome Interaction ---
  fut2_secretor: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 70, strengthTitle: 'Secretor Status (Gut Health)',
    strengthDetail: () => 'You secrete blood type antigens in gut — supports beneficial Bifidobacteria growth',
    strengthIcon: '🦠',
    watchMax: 25, watchTitle: 'Non-Secretor',
    watchDetail: () => 'May have lower Bifidobacteria — prioritize prebiotic fiber and fermented foods',
    watchIcon: '🦠'
  },

  // --- Antioxidant & Cellular Protection ---
  sod2_antioxidant: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 40, strengthTitle: 'Strong Superoxide Defense',
    strengthDetail: () => 'Your SOD2 enzyme efficiently neutralizes free radicals — cellular protection is robust',
    strengthIcon: '🛡️',
    watchMax: 20, watchTitle: 'Antioxidant Support Needed',
    watchDetail: () => 'Consider extra antioxidant-rich foods: berries, dark chocolate, green tea',
    watchIcon: '🫐'
  },
  gpx1_selenium: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 35, strengthTitle: 'Efficient Selenium Utilization',
    strengthDetail: () => 'Your GPX1 enzyme uses selenium efficiently — Brazil nuts and seafood support antioxidant capacity',
    strengthIcon: '🥜'
  },
  nrf2_detox: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 30, strengthTitle: 'Strong Detox Pathway',
    strengthDetail: () => 'Your NRF2 pathway is robust — cruciferous vegetables enhance natural detoxification',
    strengthIcon: '🥦'
  },

  // --- Thermic Effect & Metabolism ---
  ucp1_brown_fat: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 35, strengthTitle: 'Active Brown Fat',
    strengthDetail: () => 'Your brown fat is metabolically active — cold exposure may enhance calorie burn',
    strengthIcon: '🔥'
  },
  ucp3_muscle_thermogenesis: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 30, strengthTitle: 'Efficient Muscle Thermogenesis',
    strengthDetail: () => 'Your muscles burn calories efficiently — high-protein diet supports metabolic rate',
    strengthIcon: '💪'
  },
  dio2_thyroid: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 25, strengthTitle: 'Optimal Thyroid Conversion',
    strengthDetail: () => 'Your body converts T4 to active T3 efficiently — metabolism is well-supported',
    strengthIcon: '🦋',
    watchMin: 45, watchTitle: 'Thyroid Conversion Slower',
    watchDetail: () => 'May benefit from selenium and zinc for thyroid hormone conversion',
    watchIcon: '🦋'
  },

  // --- Protein Utilization & Muscle ---
  actn3_power: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 40, strengthTitle: 'Power Muscle Fiber Type',
    strengthDetail: () => 'You have more fast-twitch muscle fibers — protein timing around workouts is beneficial',
    strengthIcon: '🏋️'
  },
  // Note: ACTN3 is special - both variants have advantages (power vs endurance)
  actn3_endurance: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 30, strengthTitle: 'Endurance Muscle Fiber Type',
    strengthDetail: () => 'You have more slow-twitch muscle fibers — steady-state cardio and complex carbs support performance',
    strengthIcon: '🏃'
  },
  il6_recovery: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 25, strengthTitle: 'Efficient Exercise Recovery',
    strengthDetail: () => 'Your inflammatory response to exercise is well-regulated — supports faster recovery',
    strengthIcon: '🔄'
  },

  // --- Longevity & Cellular Health ---
  klotho_aging: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 20, strengthTitle: 'Longevity Variant',
    strengthDetail: () => 'Klotho variant associated with healthy aging — supports cognitive function and metabolism',
    strengthIcon: '🌳'
  },
  cetp_longevity: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 25, strengthTitle: 'Favorable HDL Profile',
    strengthDetail: () => 'Your CETP genetics favor high HDL — cardiovascular protection is enhanced',
    strengthIcon: '❤️'
  },

  // --- Nutrient Absorption Efficiency ---
  slc23a1_vitamin_c: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 40, strengthTitle: 'Efficient Vitamin C Absorption',
    strengthDetail: () => 'You absorb vitamin C efficiently — citrus fruits and vegetables are highly effective',
    strengthIcon: '🍊'
  },
  tcn2_b12_transport: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 35, strengthTitle: 'Efficient B12 Transport',
    strengthDetail: () => 'Your B12 reaches cells efficiently — meat, fish, and eggs are well-utilized',
    strengthIcon: '🔴'
  },

  // --- Cholesterol & Lipid Optimization ---
  pcsk9_ldl: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 15, strengthTitle: 'Enhanced LDL Clearance',
    strengthDetail: () => 'Your PCSK9 genetics favor efficient LDL removal — heart-protective',
    strengthIcon: '💚'
  },
  apoa1_hdl: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 30, strengthTitle: 'Strong HDL Production',
    strengthDetail: () => 'Your genetics support high HDL cholesterol — olive oil and fish enhance this',
    strengthIcon: '💛'
  },
  lpl_triglycerides: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 35, strengthTitle: 'Efficient Triglyceride Clearance',
    strengthDetail: () => 'You clear dietary fats efficiently — healthy fats are well-metabolized',
    strengthIcon: '🫒'
  },

  // --- Taste & Food Preference ---
  trpv1_spice: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 40, strengthTitle: 'Spice Tolerance',
    strengthDetail: () => 'You tolerate capsaicin well — spicy foods may boost metabolism and aid digestion',
    strengthIcon: '🌶️'
  },

  // --- Stress Resilience & Appetite ---
  crhr1_stress_eating: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMax: 25, strengthTitle: 'Stress Eating Resilience',
    strengthDetail: () => 'Your genetics protect against stress-driven eating — appetite stays stable under pressure',
    strengthIcon: '🧘'
  },
  pomc_satiety: {
    valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
    strengthMin: 35, strengthTitle: 'Strong Satiety Signals',
    strengthDetail: () => 'Your POMC pathway signals fullness effectively — natural appetite regulation is strong',
    strengthIcon: '✅'
  }
};

// ============================================================================
// NUTRIENT GAP CONFIG - RDA comparison based on genetics
// ============================================================================

const NUTRIENT_GAP_CONFIG = [
  { gene: 'cyp2r1_vitamin_d', nutrient: 'Vitamin D', unit: 'IU', standardRDA: 600, modifiedRDA: '2000-4000', direction: 'increase', triggerMin: 40, reason: 'Impaired CYP2R1 hydroxylation reduces vitamin D activation' },
  { gene: 'vdr_response', nutrient: 'Vitamin D', unit: 'IU', standardRDA: 600, modifiedRDA: '1000-2000', direction: 'increase', triggerMin: 35, reason: 'Reduced VDR receptor response requires higher intake' },
  { gene: 'mthfr_folate', nutrient: 'Folate (as methylfolate)', unit: 'mcg', standardRDA: 400, modifiedRDA: '600-800', direction: 'increase', triggerMin: 40, reason: 'MTHFR variants reduce folate processing efficiency' },
  { gene: 'mtr_b12_methylation', nutrient: 'Vitamin B12 (methylcobalamin)', unit: 'mcg', standardRDA: 2.4, modifiedRDA: '5-10', direction: 'increase', triggerMin: 30, reason: 'MTR variants impair B12 recycling in methionine cycle' },
  { gene: 'mtrr_methylation', nutrient: 'Vitamin B12 (methylcobalamin)', unit: 'mcg', standardRDA: 2.4, modifiedRDA: '5-10', direction: 'increase', triggerMin: 35, reason: 'MTRR variants reduce methionine synthase reductase activity' },
  { gene: 'hfe_iron_overload', nutrient: 'Iron', unit: 'mg', standardRDA: 18, modifiedRDA: '8', direction: 'decrease', triggerMin: 5, reason: 'HFE variants increase iron absorption — lower intake prevents overload' },
  { gene: 'beta_carotene_conversion', nutrient: 'Vitamin A (preformed)', unit: 'mcg RAE', standardRDA: 900, modifiedRDA: '900 preformed', direction: 'change', triggerMin: 40, reason: 'BCO1 variants impair beta-carotene to retinol conversion' },
  { gene: 'caffeine_metabolism', nutrient: 'Caffeine limit', unit: 'mg', standardRDA: 400, modifiedRDA: '200', direction: 'decrease', triggerMin: 50, reason: 'CYP1A2 slow metabolizer — caffeine lingers longer, raises CV risk' },
  { gene: 'adora2a_caffeine_anxiety', nutrient: 'Caffeine limit', unit: 'mg', standardRDA: 400, modifiedRDA: '100', direction: 'decrease', triggerMin: 35, reason: 'ADORA2A variants increase anxiety response to caffeine' },
  { gene: 'salt_sensitivity', nutrient: 'Sodium', unit: 'mg', standardRDA: 2300, modifiedRDA: '1500', direction: 'decrease', triggerMin: 50, reason: 'ACE/AGT variants increase blood pressure response to sodium' },
  { gene: 'cyp11b2_hypertension', nutrient: 'Sodium', unit: 'mg', standardRDA: 2300, modifiedRDA: '1500', direction: 'decrease', triggerMin: 50, reason: 'CYP11B2 variant elevates aldosterone, amplifying sodium retention' },
  { gene: 'agtr1_hypertension', nutrient: 'Sodium', unit: 'mg', standardRDA: 2300, modifiedRDA: '1500', direction: 'decrease', triggerMin: 50, reason: 'AGTR1 variant increases angiotensin response' },
  { gene: 'comt_methylation', nutrient: 'Cruciferous vegetables', unit: 'servings', standardRDA: 2, modifiedRDA: '4+', direction: 'increase', triggerMin: 35, reason: 'Slow COMT needs cruciferous support for estrogen clearance' },
  { gene: 'dao_histamine', nutrient: 'Histamine foods', unit: '', standardRDA: 'No limit', modifiedRDA: 'Avoid aged/fermented', direction: 'decrease', triggerMin: 25, reason: 'Low DAO enzyme cannot break down dietary histamine' }
];

// ============================================================================
// DAILY GUIDELINE RULES - Time-of-day recommendations
// ============================================================================

const DAILY_GUIDELINE_RULES = [
  { gene: 'clock_chronotype', triggerMin: 25, period: 'evening', type: 'timing', note: 'Evening chronotype — eat dinner at least 2 hours before sleep', foods: [] },
  { gene: 'per1_meal_timing', triggerMin: 30, period: 'all', type: 'timing', note: 'Consistent daily meal times within a 1-hour window aids weight management', foods: [] },
  { gene: 'caffeine_metabolism', triggerMin: 50, period: 'morning', type: 'limit', note: 'Slow caffeine metabolizer — limit caffeine to morning only', foods: ['coffee', 'espresso', 'black tea', 'energy drinks'] },
  { gene: 'adora2a_caffeine_anxiety', triggerMin: 35, period: 'morning', type: 'limit', note: 'Caffeine sensitivity — consider decaf or herbal tea', foods: ['coffee', 'espresso', 'black tea'] },
  { gene: 'dao_histamine', triggerMin: 25, period: 'all', type: 'limit', note: 'Low DAO enzyme — limit histamine-rich foods throughout the day', foods: ['aged cheese', 'wine', 'cured meats', 'sauerkraut', 'soy sauce', 'fermented foods'] },
  { gene: 'glucose_metabolism', triggerMin: 25, period: 'morning', type: 'prefer', note: 'Elevated diabetes risk — protein-first breakfast stabilizes blood sugar', foods: ['eggs', 'Greek yogurt', 'nuts', 'fish', 'chicken'] },
  { gene: 'lepr_satiety', triggerMin: 35, period: 'all', type: 'prefer', note: 'Reduced leptin sensitivity — prioritize protein and fiber at every meal', foods: ['legumes', 'lean meat', 'fish', 'vegetables', 'whole grains'] },
  { gene: 'bdnf_fat_appetite', triggerMin: 30, period: 'all', type: 'limit', note: 'BDNF fat-specific appetite — limit high-fat meals and snacks', foods: ['fried foods', 'creamy sauces', 'pastries', 'chips'] },
  { gene: 'lactase', triggerMin: 0, triggerMax: 40, period: 'all', type: 'limit', note: 'Low lactase persistence — limit fresh dairy, prefer fermented', foods: ['milk', 'ice cream', 'fresh cheese'], useProbability: true },
  { gene: 'hfe_iron_overload', triggerMin: 5, period: 'all', type: 'limit', note: 'Iron overload risk — limit red meat to 2-3 times per week', foods: ['red meat', 'liver', 'organ meats'] },
  { gene: 'comt_methylation', triggerMin: 35, period: 'all', type: 'prefer', note: 'Slow COMT — include cruciferous vegetables daily for estrogen clearance', foods: ['broccoli', 'kale', 'cabbage', 'cauliflower', 'brussels sprouts'] },
  { gene: 'abcg2_gout', triggerMin: 20, period: 'all', type: 'limit', note: 'Gout risk — limit purine-rich foods', foods: ['organ meats', 'shellfish', 'beer', 'anchovies'] },
  { gene: 'g6pd_deficiency', triggerMin: 10, period: 'all', type: 'limit', note: 'G6PD deficiency risk — strictly avoid fava beans', foods: ['fava beans', 'broad beans'] },
  { gene: 'salt_sensitivity', triggerMin: 50, period: 'all', type: 'prefer', note: 'Salt sensitive — prefer potassium-rich foods', foods: ['bananas', 'sweet potatoes', 'spinach', 'avocado', 'beans'] },
  { gene: 'cyp2r1_vitamin_d', triggerMin: 40, period: 'morning', type: 'prefer', note: 'Impaired vitamin D activation — include vitamin D foods early', foods: ['fatty fish', 'eggs', 'fortified milk', 'mushrooms'] }
];

/**
 * Population-specific genes that require minimum frequency thresholds to display
 */
const POPULATION_SPECIFIC_GENES = {
  alcohol_metabolism: { minFreq: 5, freqPath: 'ALDH2.allele_frequency_percent' },
  arctic_fat_metabolism: { minFreq: 10, freqPath: 'allele_frequency_percent' },
  polynesian_energy_storage: { minFreq: 5, freqPath: 'allele_frequency_percent' },
  altitude_adaptation_epas1: { minFreq: 10, freqPath: 'allele_frequency_percent' },
  edar_adaptation: { minFreq: 10, freqPath: 'allele_frequency_percent' },
  // Batch 2 additions
  g6pd_deficiency: { minFreq: 5, freqPath: 'allele_frequency_percent' },
  abca1_r230c: { minFreq: 3, freqPath: 'allele_frequency_percent' },
  slc16a11_diabetes: { minFreq: 5, freqPath: 'allele_frequency_percent' },
  tbc1d4_diabetes: { minFreq: 3, freqPath: 'allele_frequency_percent' }
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

  const gp_data = grandparents.map(gp => gp?.genetic_adaptations?.[geneKey] ?? null);
  const gp_freqs = gp_data.map(gen => gen ? getNestedValue(gen, config.freqPath) : null);

  // Skip if no data available
  if (gp_freqs.every(f => f === null || f === undefined)) return null;

  const validFreqs = gp_freqs.filter(f => f !== null && f !== undefined);
  if (validFreqs.length === 0) return null;

  // Calculate average frequency across grandparents
  const avg_freq = validFreqs.reduce((a, b) => a + b, 0) / validFreqs.length;

  // Average phenotype_confidence (pc) across grandparents — default 1 if absent (real data)
  const validConfs = gp_data
    .filter(gen => gen !== null)
    .map(gen => (typeof gen.phenotype_confidence === 'number' ? gen.phenotype_confidence : 1));
  const avg_phenotype_confidence = validConfs.length > 0
    ? validConfs.reduce((a, b) => a + b, 0) / validConfs.length
    : 1;

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
    phenotype_confidence: avg_phenotype_confidence,
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
  // Check all LP alleles (European, African, Middle Eastern) and use the highest
  const gp_freqs = grandparents.map(gp => {
    const lp = gp.genetic_adaptations?.lactase_persistence;
    if (!lp) return 0;

    const european = lp.allele_frequency_percent || 0;  // rs4988235
    const african_gc14010 = lp.african_allele_gc14010 || 0;  // rs145946881
    const middle_eastern = lp.middle_eastern_allele_tg13915 || 0;  // rs41380347
    const african_cg13907 = lp.african_allele_cg13907 || 0;  // rs41525747

    return Math.max(european, african_gc14010, middle_eastern, african_cg13907);
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
    'vitamin_d_metabolism', 'apoe_brain_health', 'altitude_adaptation_epas1',
    'altitude_egln1', 'edar_adaptation', 'crebrf_adaptation'
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
 * Config for composite category score cards.
 * Each category averages getTraitMeterInfo().value across listed traits.
 * invert: true → high value = bad outcome (score = 100 - value).
 * altKey: try genetics[altKey] if genetics[key] is not found.
 */
const CATEGORY_SCORE_CONFIG = [
  {
    id: 'carb_metabolism',
    title: 'Carb Metabolism',
    icon: '🌾',
    description: 'How efficiently you digest and regulate carbohydrates',
    traits: [
      { key: 'amy1',                invert: false },
      { key: 'glucose_metabolism',  invert: true  },
      { key: 'insulin_sensitivity', invert: true  },
      { key: 'celiac_susceptibility', invert: true }
    ]
  },
  {
    id: 'fat_metabolism',
    title: 'Fat Metabolism',
    icon: '🐟',
    description: 'Your ability to process and convert dietary fats',
    traits: [
      { key: 'fads',                  invert: false },
      { key: 'saturated_fat_response', invert: true  },
      { key: 'lipc_hdl',         invert: false }
    ]
  },
  {
    id: 'vitamin_absorption',
    title: 'Vitamin Absorption',
    icon: '☀️',
    description: 'How well you absorb and utilize key micronutrients',
    traits: [
      { key: 'vitamin_d_metabolism',    altKey: 'slc24a5', invert: false },
      { key: 'gc_vitamin_d',     invert: false },
      { key: 'mthfr_folate',       invert: true  },
      { key: 'hfe_iron_overload',         invert: false },
      { key: 'beta_carotene_conversion', invert: false },
      { key: 'fut2_secretor',  invert: true  }
    ]
  },
  {
    id: 'food_tolerance',
    title: 'Food Tolerance',
    icon: '🎯',
    description: 'Sensitivity to common dietary compounds',
    traits: [
      { key: 'lactase',               invert: false },
      { key: 'bitter_taste_perception', invert: true  },
      { key: 'aldh2',                 invert: false },
      { key: 'caffeine_metabolism',    invert: true  }
    ]
  }
];

/**
 * Calculate composite category scores from genetics results.
 * @param {Object} genetics - Mendelian genetics result object
 * @returns {Array} Array of category score objects (nulls filtered out)
 */
function calculateCategoryScores(genetics) {
  if (!genetics) return [];

  return CATEGORY_SCORE_CONFIG.map(category => {
    const values = [];

    category.traits.forEach(traitCfg => {
      const trait = genetics[traitCfg.key] || (traitCfg.altKey && genetics[traitCfg.altKey]);
      if (!trait) return;

      const resolvedKey = genetics[traitCfg.key] ? traitCfg.key : (traitCfg.altKey || traitCfg.key);
      const { value } = getTraitMeterInfo(resolvedKey, trait);
      values.push(traitCfg.invert ? (100 - value) : value);
    });

    if (values.length === 0) return null;

    const score = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    let statusClass, statusLabel;
    if (score >= 65) {
      statusClass = 'high';
      statusLabel = 'Well Adapted';
    } else if (score >= 40) {
      statusClass = 'moderate';
      statusLabel = 'Mixed Signals';
    } else {
      statusClass = 'low';
      statusLabel = 'Needs Attention';
    }

    return {
      id: category.id,
      title: category.title,
      icon: category.icon,
      description: category.description,
      score,
      statusClass,
      statusLabel,
      traitCount: values.length
    };
  }).filter(Boolean);
}

/**
 * Render a single-sentence genetic identity headline for the top of the Genetics tab.
 * Leads with the user's strongest category + flags their lowest if it needs attention.
 * @param {Object} genetics - Mendelian genetics result object
 * @returns {string} HTML
 */
function renderGeneticHeadline(genetics) {
  const categories = calculateCategoryScores(genetics);
  if (categories.length === 0) return '';

  const sorted = [...categories].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  let headline;
  if (best.score >= 65) {
    headline = `Your ancestry suggests <strong>${best.title.toLowerCase()}</strong> as a natural strength`;
    if (worst && worst.score < 45 && worst.id !== best.id) {
      headline += ` — with <strong>${worst.title.toLowerCase()}</strong> worth keeping an eye on`;
    }
    headline += '.';
  } else {
    headline = `Your ancestry shows a balanced genetic profile — no single area dominates, which means your diet has room to flex.`;
  }

  const { strengths } = analyzeGeneticTraits(genetics);
  const topStrength = strengths[0];

  return `
    <div class="genetic-headline">
      <div class="genetic-headline-icon">🧬</div>
      <div class="genetic-headline-body">
        <p class="genetic-headline-copy">${headline}</p>
        ${topStrength ? `<p class="genetic-headline-detail">${topStrength.icon} ${topStrength.title}: ${topStrength.detail}</p>` : ''}
      </div>
    </div>`;
}

/**
 * Render category score cards.
 * @param {Object} genetics - Mendelian genetics result object
 * @param {boolean} compact - true for Overview tab strip, false for full Genetics tab cards
 * @returns {string} HTML
 */
function renderCategoryScores(genetics, compact = false) {
  const categories = calculateCategoryScores(genetics);
  if (categories.length === 0) return '';

  if (compact) {
    const cards = categories.map(cat => `
      <div class="category-score-card category-score-card--compact">
        <div class="category-score-num ${cat.statusClass}">${cat.score}</div>
        <div class="category-score-bar-wrap">
          <div class="category-score-bar meter-fill ${cat.statusClass}" style="width:${cat.score}%"></div>
        </div>
        <div class="category-score-title">${cat.icon} ${cat.title}</div>
        <span class="category-score-badge--${cat.statusClass}">${cat.statusLabel}</span>
      </div>`).join('');

    return `
      <div class="category-scores-section category-scores-section--compact">
        <div class="category-scores-grid category-scores-grid--compact">${cards}</div>
      </div>`;
  }

  const cards = categories.map(cat => `
    <div class="category-score-card">
      <div class="category-score-top">
        <div class="category-score-num ${cat.statusClass}">${cat.score}</div>
        <span class="category-score-badge--${cat.statusClass}">${cat.statusLabel}</span>
      </div>
      <div class="category-score-title">${cat.icon} ${cat.title}</div>
      <div class="category-score-desc">${cat.description}</div>
      <div class="category-score-bar-wrap">
        <div class="category-score-bar meter-fill ${cat.statusClass}" style="width:${cat.score}%"></div>
      </div>
      <div class="category-score-trait-count">${cat.traitCount} trait${cat.traitCount !== 1 ? 's' : ''} analyzed</div>
    </div>`).join('');

  return `
    <div class="category-scores-section">
      <h3>Genetic Category Scores</h3>
      <div class="category-scores-grid">${cards}</div>
    </div>`;
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

  Object.keys(genetics).forEach(key => {
    const trait = genetics[key];
    const config = TRAIT_ANALYSIS_CONFIG[key];
    if (!config || !trait) return;

    const value = config.valueGetter(trait);

    // Check for strength
    if (config.strengthMin !== undefined && value >= config.strengthMin) {
      strengths.push({
        icon: config.strengthIcon || '🧬',
        title: config.strengthTitle,
        detail: typeof config.strengthDetail === 'function' ? config.strengthDetail(value) : config.strengthDetail
      });
    } else if (config.strengthMax !== undefined && value < config.strengthMax) {
      strengths.push({
        icon: config.strengthIcon || '🧬',
        title: config.strengthTitle,
        detail: typeof config.strengthDetail === 'function' ? config.strengthDetail(value) : config.strengthDetail
      });
    }

    // Check for watch item
    if (config.watchMin !== undefined && value >= config.watchMin) {
      watchItems.push({
        icon: config.watchIcon || '⚠️',
        title: config.watchTitle,
        detail: typeof config.watchDetail === 'function' ? config.watchDetail(value) : config.watchDetail
      });
    } else if (config.watchMax !== undefined && value < config.watchMax && value > 0) {
      watchItems.push({
        icon: config.watchIcon || '⚠️',
        title: config.watchTitle,
        detail: typeof config.watchDetail === 'function' ? config.watchDetail(value) : config.watchDetail
      });
    }
  });

  // Limit to top 5 each (expanded from 3 for 47 genes)
  return {
    strengths: strengths.slice(0, 5),
    watchItems: watchItems.slice(0, 5)
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
 * Render Top Priorities banner for the Diet tab.
 * Shows up to 2 watch items + 1 strength from analyzeGeneticTraits().
 * These are the highest-impact dietary signals for this user.
 * @param {Object} genetics
 * @returns {string} HTML
 */
function renderTopPriorities(genetics) {
  if (!genetics) return '';

  const { strengths, watchItems } = analyzeGeneticTraits(genetics);
  if (strengths.length === 0 && watchItems.length === 0) return '';

  const items = [];
  watchItems.slice(0, 2).forEach(item => items.push({ ...item, type: 'watch' }));
  if (items.length < 3 && strengths.length > 0) {
    items.push({ ...strengths[0], type: 'strength' });
  }
  if (items.length === 0) return '';

  const cards = items.map(item => {
    const isWatch = item.type === 'watch';
    return `
      <div class="priority-card priority-card--${isWatch ? 'watch' : 'strength'}">
        <div class="priority-card-header">
          <span class="priority-icon">${item.icon}</span>
          <span class="priority-title">${item.title}</span>
          <span class="priority-badge priority-badge--${isWatch ? 'watch' : 'strength'}">${isWatch ? '⚠ Watch' : '✓ Strength'}</span>
        </div>
        <p class="priority-detail">${item.detail}</p>
      </div>`;
  }).join('');

  return `
    <div class="top-priorities-section">
      <h3>🎯 Your Dietary Priorities</h3>
      <p class="top-priorities-subtitle">Highest-impact changes based on your genetic profile</p>
      <div class="priorities-grid">${cards}</div>
    </div>`;
}

/**
 * Render the Nutrient Gap Analysis section
 * @param {Object} genetics - The Mendelian genetics results
 * @returns {string} HTML for the nutrient gap section
 */
function renderNutrientGapAnalysis(genetics) {
  if (!genetics) return '';

  const triggered = [];
  const seenNutrients = {};

  NUTRIENT_GAP_CONFIG.forEach(entry => {
    const trait = genetics[entry.gene];
    if (!trait) return;
    const freq = trait.frequency || trait.allele_frequency_percent || 0;
    if (freq < entry.triggerMin) return;

    // Deduplicate by nutrient — keep worst case (highest modified RDA for increase, lowest for decrease)
    if (seenNutrients[entry.nutrient]) {
      // Already have this nutrient, skip unless this is more aggressive
      return;
    }
    seenNutrients[entry.nutrient] = true;
    triggered.push(entry);
  });

  if (triggered.length === 0) return '';

  const arrowMap = {
    increase: { symbol: '&#x2B06;', cssClass: 'increase', label: 'Increase' },
    decrease: { symbol: '&#x2B07;', cssClass: 'decrease', label: 'Decrease' },
    change: { symbol: '&#x1F504;', cssClass: 'change', label: 'Change form' }
  };

  let html = `
    <div class="nutrient-gap-section">
      <h3>🎯 Nutrient Gap Analysis</h3>
      <p class="nutrient-gap-intro">Based on your genetics, some nutrient targets differ from standard recommendations.</p>
      <div class="nutrient-gap-table">
        <div class="nutrient-row nutrient-row-header">
          <span class="nutrient-name">Nutrient</span>
          <span class="nutrient-standard">Standard</span>
          <span class="nutrient-arrow-col"></span>
          <span class="nutrient-modified">Your Target</span>
          <span class="nutrient-reason">Why</span>
        </div>
  `;

  triggered.forEach(entry => {
    const arrow = arrowMap[entry.direction] || arrowMap.change;
    const standardDisplay = typeof entry.standardRDA === 'number'
      ? `${entry.standardRDA} ${entry.unit}`
      : `${entry.standardRDA}`;
    const modifiedDisplay = `${entry.modifiedRDA} ${entry.unit}`.trim();

    html += `
        <div class="nutrient-row">
          <span class="nutrient-name">${entry.nutrient}</span>
          <span class="nutrient-standard">${standardDisplay}</span>
          <span class="nutrient-arrow ${arrow.cssClass}">${arrow.symbol}</span>
          <span class="nutrient-modified">${modifiedDisplay}</span>
          <span class="nutrient-reason">${entry.reason}</span>
        </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

/**
 * Render Daily Guidelines section.
 * 2.3: Each rule renders as its own block with a GENE_META driver badge.
 * 2.4: Rules with period:'all' are pulled into a dedicated "All Day" strip
 *      above the morning/afternoon/evening grid, eliminating triple-repetition.
 * @param {Object} genetics
 * @param {Object} blended - optional, for bold-highlighting foods in user's diet
 * @returns {string} HTML
 */
function renderDailyGuidelines(genetics, blended) {
  if (!genetics) return '';

  // Legacy key map needed to resolve GENE_META for rules using short keys
  const ruleKeyMap = {
    lactase: 'lactase_persistence',
    amy1: 'starch_digestion',
    fads: 'pufa_metabolism',
    aldh2: 'alcohol_metabolism',
    crebrf: 'polynesian_energy_storage',
    cpt1a: 'arctic_fat_metabolism'
  };

  const triggered = [];

  DAILY_GUIDELINE_RULES.forEach(rule => {
    const trait = genetics[rule.gene];
    if (!trait) return;
    let value;
    if (rule.useProbability) {
      value = (trait.probability || 0) * 100;
      if (rule.triggerMax !== undefined && value > rule.triggerMax) return;
      if (rule.triggerMin !== undefined && value < rule.triggerMin) return;
    } else {
      value = trait.frequency || trait.allele_frequency_percent || 0;
      if (value < rule.triggerMin) return;
    }
    triggered.push(rule);
  });

  if (triggered.length === 0) return '';

  // Cross-reference foods against blended diet for bold highlight
  const allBlendedFoods = blended
    ? [...(blended.commonFoods || []), ...(blended.allProteins || []), ...(blended.allFats || []), ...(blended.allHerbs || [])].map(f => f.toLowerCase())
    : [];

  // Helper: resolve GENE_META for a rule's gene key
  function getRuleMeta(geneKey) {
    const metaKey = ruleKeyMap[geneKey] || geneKey;
    return GENE_META[metaKey] || { icon: '🧬', title: geneKey };
  }

  // Helper: render a single rule as a self-contained block with gene badge
  function renderRuleBlock(rule, compact) {
    const meta = getRuleMeta(rule.gene);
    const typePillClass = rule.type === 'prefer' ? 'rule-type-prefer' : rule.type === 'limit' ? 'rule-type-limit' : 'rule-type-timing';
    const typeLabel = rule.type === 'prefer' ? 'Prefer' : rule.type === 'limit' ? 'Limit' : 'Timing';

    let foodsHtml = '';
    if (rule.foods && rule.foods.length > 0) {
      const foodClass = rule.type === 'prefer' ? 'prefer' : 'limit';
      foodsHtml = `<div class="period-rule-foods">` +
        rule.foods.map(f => {
          const inDiet = allBlendedFoods.some(bf => bf.includes(f.toLowerCase()) || f.toLowerCase().includes(bf));
          return `<span class="guideline-food ${foodClass}${inDiet ? ' in-diet' : ''}">${f}</span>`;
        }).join('') +
      `</div>`;
    }

    return `
      <div class="period-rule${compact ? ' period-rule--compact' : ''}">
        <div class="period-rule-header">
          <span class="guideline-gene-badge">${meta.icon} ${meta.title}</span>
          <span class="rule-type-pill ${typePillClass}">${typeLabel}</span>
        </div>
        ${foodsHtml}
        ${rule.note ? `<div class="guideline-note">${rule.note}</div>` : ''}
      </div>`;
  }

  // Separate 'all' rules from period-specific rules
  const allDayRules = triggered.filter(r => r.period === 'all');
  const periodRules = triggered.filter(r => r.period !== 'all');

  // Group period-specific rules
  const periods = {
    morning:   { emoji: '🌅', label: 'Morning',   rules: [] },
    afternoon: { emoji: '☀️', label: 'Afternoon', rules: [] },
    evening:   { emoji: '🌙', label: 'Evening',   rules: [] }
  };
  periodRules.forEach(rule => {
    if (periods[rule.period]) periods[rule.period].rules.push(rule);
  });

  const hasPeriodicRules = Object.values(periods).some(p => p.rules.length > 0);

  let html = `
    <div class="daily-guidelines">
      <h3>📅 Daily Guidelines</h3>
      <p class="daily-guidelines-intro">Personalized timing and food recommendations based on your genetic profile.</p>`;

  // ── All Day strip ──────────────────────────────────────────────────
  if (allDayRules.length > 0) {
    html += `
      <div class="all-day-strip">
        <div class="all-day-header">
          <span class="all-day-label">All Day</span>
          <span class="all-day-count">${allDayRules.length} rule${allDayRules.length > 1 ? 's' : ''}</span>
        </div>
        <div class="all-day-rules">
          ${allDayRules.map(r => renderRuleBlock(r, true)).join('')}
        </div>
      </div>`;
  }

  // ── Period grid ───────────────────────────────────────────────────
  if (hasPeriodicRules) {
    html += `<div class="daily-guidelines-grid">`;
    Object.entries(periods).forEach(([, period]) => {
      if (period.rules.length === 0) return;
      html += `
        <div class="meal-period-card">
          <h4>${period.emoji} ${period.label}</h4>
          ${period.rules.map(r => renderRuleBlock(r, false)).join('')}
        </div>`;
    });
    html += `</div>`;
  }

  html += `</div>`;
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

  const traitCount = Object.keys(genetics).length;

  let html = '<div class="genetic-section">';
  html += `<details class="trait-meters-details">`;
  html += `<summary class="trait-meters-summary"><span class="trait-meters-summary-text">View all ${traitCount} genetic traits</span><span class="trait-meters-hint">Click any trait to expand details</span></summary>`;

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
            <div class="meter-title-group">
              <span class="meter-title">${meta.title}</span>
              ${trait.recommendation ? `<span class="meter-diet-note">${trait.recommendation.split('.')[0]}.</span>` : ''}
            </div>
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
  html += '</details>';
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


// ============================================================================
// MODULE EXPORTS
// ============================================================================

export {
  GENE_META,
  GENE_GLOSSARY,
  GENE_SOURCES,
  GENE_CATEGORY_MAP,
  GENE_CATEGORY_INFO,
  DAILY_GUIDELINE_RULES,
  FOOD_GENETICS_MAP,
  GENERIC_GENE_CONFIG,
  CATEGORY_SCORE_CONFIG,
  TRAIT_ANALYSIS_CONFIG,
  NUTRIENT_GAP_CONFIG,
  calculateMendelianGenetics,
  calculateCategoryScores,
  analyzeGeneticTraits,
  getTraitMeterInfo,
  getFoodExplanations,
  blendGeneticAdaptations
};

export const legacyKeyMap = {
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
