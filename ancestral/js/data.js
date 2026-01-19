/**
 * Data module - handles loading and lookup of culture/diet data
 * TRIMMED VERSION: ~220 nationalities (down from ~467)
 */

// Global data stores
let geoData = null;
let dietData = null;
let geneticsData = null;

/**
 * Load all data files
 * @returns {Promise<void>}
 */
async function loadData() {
  [geoData, dietData, geneticsData] = await Promise.all([
    fetch('./cultures.json').then(r => r.json()),
    fetch('./diets.json').then(r => r.json()),
    fetch('./genetics.json').then(r => r.json())
  ]);
}

/**
 * Get geographic data for a culture by ID
 * @param {string} id - Culture ID
 * @returns {Object|undefined} Geographic data object
 */
function getGeoById(id) {
  return geoData.cultures.find(c => c.id === id);
}

/**
 * Get diet data for a culture by ID
 * @param {string} id - Culture ID
 * @returns {Object|undefined} Diet data object
 */
function getDietById(id) {
  const diet = dietData.cultures.find(c => c.id === id);
  if (!diet) return undefined;
  const genetics = geneticsData.cultures.find(c => c.id === id);
  if (genetics) {
    diet.genetic_adaptations = genetics.genetic_adaptations;
  }
  return diet;
}

/**
 * Get genetics data for a culture by ID
 * @param {string} id - Culture ID
 * @returns {Object|undefined} Genetics data object with genetic_adaptations
 */
function getGeneticsById(id) {
  return geneticsData.cultures.find(c => c.id === id);
}

// ============================================================================
// MIXED ANCESTRY DEFAULTS
// ============================================================================
/**
 * Mixed ancestry default breakdowns for populations with known mixed heritage
 * Percentages are approximate population averages based on genetic studies
 */
const MIXED_ANCESTRY_DEFAULTS = {
  // Caribbean
  'jamaican': [
    { regionId: 'west_africa', percent: 76 },
    { regionId: 'western_europe', percent: 18 },
    { regionId: 'caribbean_taino', percent: 6 }
  ],
  'haitian': [
    { regionId: 'west_africa', percent: 86 },
    { regionId: 'western_europe', percent: 10 },
    { regionId: 'caribbean_taino', percent: 4 }
  ],
  'cuban': [
    { regionId: 'med_southern', percent: 50 },
    { regionId: 'west_africa', percent: 30 },
    { regionId: 'caribbean_taino', percent: 20 }
  ],
  'dominican': [
    { regionId: 'west_africa', percent: 45 },
    { regionId: 'med_southern', percent: 40 },
    { regionId: 'caribbean_taino', percent: 15 }
  ],
  'puerto_rican': [
    { regionId: 'med_southern', percent: 55 },
    { regionId: 'west_africa', percent: 25 },
    { regionId: 'caribbean_taino', percent: 20 }
  ],
  'trinidadian': [
    { regionId: 'west_africa', percent: 35 },
    { regionId: 'south_india', percent: 35 },
    { regionId: 'western_europe', percent: 20 },
    { regionId: 'caribbean_taino', percent: 10 }
  ],

  // Latin America
  'mexican': [
    { regionId: 'mesoamerica', percent: 55 },
    { regionId: 'med_southern', percent: 40 },
    { regionId: 'west_africa', percent: 5 }
  ],
  'guatemalan': [
    { regionId: 'mesoamerica', percent: 60 },
    { regionId: 'med_southern', percent: 35 },
    { regionId: 'west_africa', percent: 5 }
  ],
  'honduran': [
    { regionId: 'mesoamerica', percent: 50 },
    { regionId: 'med_southern', percent: 40 },
    { regionId: 'west_africa', percent: 10 }
  ],
  'salvadoran': [
    { regionId: 'mesoamerica', percent: 55 },
    { regionId: 'med_southern', percent: 40 },
    { regionId: 'west_africa', percent: 5 }
  ],
  'nicaraguan': [
    { regionId: 'mesoamerica', percent: 50 },
    { regionId: 'med_southern', percent: 40 },
    { regionId: 'west_africa', percent: 10 }
  ],
  'costa_rican': [
    { regionId: 'med_southern', percent: 60 },
    { regionId: 'mesoamerica', percent: 30 },
    { regionId: 'west_africa', percent: 10 }
  ],
  'panamanian': [
    { regionId: 'med_southern', percent: 40 },
    { regionId: 'west_africa', percent: 30 },
    { regionId: 'mesoamerica', percent: 20 },
    { regionId: 'caribbean_taino', percent: 10 }
  ],
  'colombian': [
    { regionId: 'med_southern', percent: 50 },
    { regionId: 'andean', percent: 30 },
    { regionId: 'west_africa', percent: 20 }
  ],
  'venezuelan': [
    { regionId: 'med_southern', percent: 50 },
    { regionId: 'west_africa', percent: 25 },
    { regionId: 'andean', percent: 15 },
    { regionId: 'caribbean_taino', percent: 10 }
  ],
  'ecuadorian': [
    { regionId: 'andean', percent: 50 },
    { regionId: 'med_southern', percent: 40 },
    { regionId: 'west_africa', percent: 10 }
  ],
  'peruvian': [
    { regionId: 'andean', percent: 55 },
    { regionId: 'med_southern', percent: 35 },
    { regionId: 'west_africa', percent: 5 },
    { regionId: 'south_china', percent: 5 }
  ],
  'bolivian': [
    { regionId: 'andean', percent: 65 },
    { regionId: 'med_southern', percent: 30 },
    { regionId: 'west_africa', percent: 5 }
  ],
  'chilean': [
    { regionId: 'med_southern', percent: 55 },
    { regionId: 'patagonia', percent: 35 },
    { regionId: 'west_africa', percent: 5 },
    { regionId: 'central_europe', percent: 5 }
  ],
  'argentine': [
    { regionId: 'med_southern', percent: 70 },
    { regionId: 'central_europe', percent: 15 },
    { regionId: 'gaucho', percent: 10 },
    { regionId: 'west_africa', percent: 5 }
  ],
  'uruguayan': [
    { regionId: 'med_southern', percent: 70 },
    { regionId: 'central_europe', percent: 15 },
    { regionId: 'west_africa', percent: 10 },
    { regionId: 'gaucho', percent: 5 }
  ],
  'paraguayan': [
    { regionId: 'gaucho', percent: 50 },
    { regionId: 'med_southern', percent: 45 },
    { regionId: 'west_africa', percent: 5 }
  ],

  // Brazil
  'brazilian': [
    { regionId: 'med_southern', percent: 45 },
    { regionId: 'west_africa', percent: 40 },
    { regionId: 'amazon', percent: 15 }
  ],

  // North America
  'african_american': [
    { regionId: 'west_africa', percent: 75 },
    { regionId: 'western_europe', percent: 20 },
    { regionId: 'eastern_woodlands', percent: 5 }
  ],
  'cajun': [
    { regionId: 'western_europe', percent: 70 },
    { regionId: 'west_africa', percent: 15 },
    { regionId: 'eastern_woodlands', percent: 15 }
  ],
  'metis': [
    { regionId: 'western_europe', percent: 50 },
    { regionId: 'subarctic', percent: 50 }
  ],

  // Oceania
  'australian': [
    { regionId: 'western_europe', percent: 85 },
    { regionId: 'aboriginal_aus', percent: 5 },
    { regionId: 'south_china', percent: 5 },
    { regionId: 'med_southern', percent: 5 }
  ],
  'new_zealander': [
    { regionId: 'western_europe', percent: 75 },
    { regionId: 'maori', percent: 15 },
    { regionId: 'polynesia', percent: 10 }
  ],
  'hawaiian': [
    { regionId: 'polynesia', percent: 40 },
    { regionId: 'western_europe', percent: 25 },
    { regionId: 'south_china', percent: 20 },
    { regionId: 'japan', percent: 15 }
  ],

  // Asia
  'filipino': [
    { regionId: 'se_asia_island', percent: 70 },
    { regionId: 'south_china', percent: 20 },
    { regionId: 'med_southern', percent: 10 }
  ],
  'singaporean': [
    { regionId: 'south_china', percent: 75 },
    { regionId: 'se_asia_island', percent: 15 },
    { regionId: 'south_india', percent: 10 }
  ],
  'malaysian': [
    { regionId: 'se_asia_island', percent: 55 },
    { regionId: 'south_china', percent: 30 },
    { regionId: 'south_india', percent: 15 }
  ],

  // Africa
  'malagasy': [
    { regionId: 'se_asia_island', percent: 50 },
    { regionId: 'southern_africa', percent: 40 },
    { regionId: 'arabian', percent: 10 }
  ],
  'cape_verdean': [
    { regionId: 'west_africa', percent: 60 },
    { regionId: 'med_southern', percent: 40 }
  ],
  'south_african': [
    { regionId: 'southern_africa', percent: 70 },
    { regionId: 'western_europe', percent: 15 },
    { regionId: 'south_india', percent: 10 },
    { regionId: 'se_asia_island', percent: 5 }
  ]
};

/**
 * Check if a nationality has mixed ancestry defaults
 */
function hasMixedAncestry(nationalityId) {
  return MIXED_ANCESTRY_DEFAULTS.hasOwnProperty(nationalityId);
}

/**
 * Get mixed ancestry defaults for a nationality
 */
function getMixedAncestryDefaults(nationalityId) {
  return MIXED_ANCESTRY_DEFAULTS[nationalityId] || null;
}

// ============================================================================
// NATIONALITY TO REGION MAPPING (TRIMMED: ~220 entries)
// ============================================================================
const NATIONALITY_TO_REGION = {
  // ============================================================================
  // AFRICA (~45 entries)
  // ============================================================================
  'Africa': {
    // Nile Valley
    'egyptian': { name: 'Egyptian', regionId: 'nile_valley' },
    'sudanese': { name: 'Sudanese', regionId: 'nile_valley' },
    // Maghreb
    'moroccan': { name: 'Moroccan', regionId: 'maghreb' },
    'algerian': { name: 'Algerian', regionId: 'maghreb' },
    'tunisian': { name: 'Tunisian', regionId: 'maghreb' },
    'libyan': { name: 'Libyan', regionId: 'maghreb' },
    'berber': { name: 'Berber/Amazigh', regionId: 'maghreb' },
    // West Africa
    'nigerian': { name: 'Nigerian', regionId: 'west_africa' },
    'ghanaian': { name: 'Ghanaian', regionId: 'west_africa' },
    'senegalese': { name: 'Senegalese', regionId: 'west_africa' },
    'ivorian': { name: 'Ivorian', regionId: 'west_africa' },
    'guinean': { name: 'Guinean', regionId: 'west_africa' },
    'sierra_leonean': { name: 'Sierra Leonean', regionId: 'west_africa' },
    'liberian': { name: 'Liberian', regionId: 'west_africa' },
    'cape_verdean': { name: 'Cape Verdean', regionId: 'west_africa' },
    // Sahel
    'malian': { name: 'Malian', regionId: 'sahel' },
    'nigerien': { name: 'Nigerien', regionId: 'sahel' },
    'chadian': { name: 'Chadian', regionId: 'sahel' },
    'burkinabe': { name: 'Burkinabé', regionId: 'sahel' },
    // East Africa - Horn
    'ethiopian': { name: 'Ethiopian', regionId: 'ethiopia' },
    'eritrean': { name: 'Eritrean', regionId: 'ethiopia' },
    'somali': { name: 'Somali', regionId: 'horn_somalia' },
    // East Africa - Great Lakes & Pastoralist
    'kenyan': { name: 'Kenyan', regionId: 'maasai' },
    'tanzanian': { name: 'Tanzanian', regionId: 'maasai' },
    'ugandan': { name: 'Ugandan', regionId: 'nilotic' },
    'rwandan': { name: 'Rwandan', regionId: 'nilotic' },
    'burundian': { name: 'Burundian', regionId: 'nilotic' },
    'south_sudanese': { name: 'South Sudanese', regionId: 'nilotic' },
    // Central Africa
    'congolese': { name: 'Congolese', regionId: 'central_africa' },
    'cameroonian': { name: 'Cameroonian', regionId: 'central_africa' },
    'gabonese': { name: 'Gabonese', regionId: 'central_africa' },
    'central_african': { name: 'Central African', regionId: 'sudanian' },
    // Southern Africa
    'south_african': { name: 'South African', regionId: 'southern_africa' },
    'zimbabwean': { name: 'Zimbabwean', regionId: 'southern_africa' },
    'zambian': { name: 'Zambian', regionId: 'southern_africa' },
    'botswanan': { name: 'Botswanan', regionId: 'southern_africa' },
    'namibian': { name: 'Namibian', regionId: 'southern_africa' },
    'mozambican': { name: 'Mozambican', regionId: 'southern_africa' },
    'angolan': { name: 'Angolan', regionId: 'southern_africa' },
    'malawian': { name: 'Malawian', regionId: 'southern_africa' },
    // Island
    'malagasy': { name: 'Malagasy', regionId: 'malagasy' },
    'mauritian': { name: 'Mauritian', regionId: 'southern_africa' }
  },

  // ============================================================================
  // EUROPE (~50 entries)
  // ============================================================================
  'Europe': {
    // Eastern Europe
    'polish': { name: 'Polish', regionId: 'eastern_europe' },
    'ukrainian': { name: 'Ukrainian', regionId: 'eastern_europe' },
    'russian': { name: 'Russian', regionId: 'eastern_europe' },
    'belarusian': { name: 'Belarusian', regionId: 'eastern_europe' },
    'lithuanian': { name: 'Lithuanian', regionId: 'eastern_europe' },
    'latvian': { name: 'Latvian', regionId: 'eastern_europe' },
    'estonian': { name: 'Estonian', regionId: 'eastern_europe' },
    // Central Europe
    'german': { name: 'German', regionId: 'central_europe' },
    'austrian': { name: 'Austrian', regionId: 'central_europe' },
    'swiss': { name: 'Swiss', regionId: 'central_europe' },
    'czech': { name: 'Czech', regionId: 'central_europe' },
    'slovak': { name: 'Slovak', regionId: 'central_europe' },
    'hungarian': { name: 'Hungarian', regionId: 'central_europe' },
    // Western Europe
    'british': { name: 'British', regionId: 'western_europe' },
    'english': { name: 'English', regionId: 'western_europe' },
    'scottish': { name: 'Scottish', regionId: 'western_europe' },
    'welsh': { name: 'Welsh', regionId: 'western_europe' },
    'irish': { name: 'Irish', regionId: 'western_europe' },
    'french': { name: 'French', regionId: 'western_europe' },
    'dutch': { name: 'Dutch', regionId: 'western_europe' },
    'belgian': { name: 'Belgian', regionId: 'western_europe' },
    // Nordic
    'swedish': { name: 'Swedish', regionId: 'nordic' },
    'norwegian': { name: 'Norwegian', regionId: 'nordic' },
    'danish': { name: 'Danish', regionId: 'nordic' },
    'finnish': { name: 'Finnish', regionId: 'nordic' },
    'icelandic': { name: 'Icelandic', regionId: 'nordic' },
    'sami': { name: 'Sámi', regionId: 'nordic' },
    // Mediterranean
    'italian': { name: 'Italian', regionId: 'med_southern' },
    'greek': { name: 'Greek', regionId: 'med_southern' },
    'spanish': { name: 'Spanish', regionId: 'med_southern' },
    'portuguese': { name: 'Portuguese', regionId: 'med_southern' },
    'maltese': { name: 'Maltese', regionId: 'med_southern' },
    'cypriot': { name: 'Cypriot', regionId: 'med_southern' },
    'basque': { name: 'Basque', regionId: 'med_southern' },
    'catalan': { name: 'Catalan', regionId: 'med_southern' },
    // Balkans
    'serbian': { name: 'Serbian', regionId: 'balkan' },
    'croatian': { name: 'Croatian', regionId: 'balkan' },
    'bosnian': { name: 'Bosnian', regionId: 'balkan' },
    'albanian': { name: 'Albanian', regionId: 'balkan' },
    'bulgarian': { name: 'Bulgarian', regionId: 'balkan' },
    'romanian': { name: 'Romanian', regionId: 'balkan' },
    'slovenian': { name: 'Slovenian', regionId: 'balkan' },
    'macedonian': { name: 'Macedonian', regionId: 'balkan' },
    // Caucasus
    'georgian': { name: 'Georgian', regionId: 'caucasus' },
    'armenian': { name: 'Armenian', regionId: 'caucasus' },
    'azerbaijani': { name: 'Azerbaijani', regionId: 'caucasus' },
    // Jewish diaspora
    'ashkenazi_jewish': { name: 'Ashkenazi Jewish', regionId: 'eastern_europe' },
    'sephardic_jewish': { name: 'Sephardic Jewish', regionId: 'med_southern' },
    'mizrahi_jewish': { name: 'Mizrahi Jewish', regionId: 'med_levant' },
    'roma': { name: 'Roma/Romani', regionId: 'balkan' }
  },

  // ============================================================================
  // MIDDLE EAST (~22 entries)
  // ============================================================================
  'Middle East': {
    // Levant
    'lebanese': { name: 'Lebanese', regionId: 'med_levant' },
    'syrian': { name: 'Syrian', regionId: 'med_levant' },
    'palestinian': { name: 'Palestinian', regionId: 'med_levant' },
    'jordanian': { name: 'Jordanian', regionId: 'med_levant' },
    'israeli': { name: 'Israeli', regionId: 'med_levant' },
    // Mesopotamia
    'iraqi': { name: 'Iraqi', regionId: 'mesopotamian' },
    // Kurdistan
    'kurdish': { name: 'Kurdish', regionId: 'kurdish' },
    // Anatolia
    'turkish': { name: 'Turkish', regionId: 'anatolian' },
    // Arabian Peninsula
    'saudi': { name: 'Saudi', regionId: 'arabian' },
    'emirati': { name: 'Emirati', regionId: 'arabian' },
    'kuwaiti': { name: 'Kuwaiti', regionId: 'arabian' },
    'qatari': { name: 'Qatari', regionId: 'arabian' },
    'bahraini': { name: 'Bahraini', regionId: 'arabian' },
    'omani': { name: 'Omani', regionId: 'arabian' },
    'yemeni': { name: 'Yemeni', regionId: 'arabian' },
    // Persian
    'iranian': { name: 'Iranian', regionId: 'persian' },
    'afghan': { name: 'Afghan', regionId: 'persian' },
    'tajik': { name: 'Tajik', regionId: 'persian' }
  },

  // ============================================================================
  // EAST ASIA (~18 entries)
  // ============================================================================
  'East Asia': {
    // Japan
    'japanese': { name: 'Japanese', regionId: 'japan' },
    'okinawan': { name: 'Okinawan', regionId: 'japan' },
    'ainu': { name: 'Ainu', regionId: 'japan' },
    // Korea
    'korean': { name: 'Korean', regionId: 'korea' },
    // China
    'chinese': { name: 'Chinese', regionId: 'north_china' },
    'northern_chinese': { name: 'Northern Chinese', regionId: 'north_china' },
    'cantonese': { name: 'Cantonese', regionId: 'south_china' },
    'southern_chinese': { name: 'Southern Chinese', regionId: 'south_china' },
    'fujianese': { name: 'Fujianese/Hokkien', regionId: 'south_china' },
    'hakka': { name: 'Hakka', regionId: 'south_china' },
    'hong_konger': { name: 'Hong Konger', regionId: 'south_china' },
    'taiwanese': { name: 'Taiwanese', regionId: 'south_china' },
    'sichuanese': { name: 'Sichuanese', regionId: 'sichuan_sw_china' },
    // Tibet
    'tibetan': { name: 'Tibetan', regionId: 'tibet' },
    // Uyghur
    'uyghur': { name: 'Uyghur', regionId: 'central_asia' }
  },

  // ============================================================================
  // SOUTHEAST ASIA (~18 entries)
  // ============================================================================
  'Southeast Asia': {
    // Mainland
    'thai': { name: 'Thai', regionId: 'se_asia_main' },
    'vietnamese': { name: 'Vietnamese', regionId: 'se_asia_main' },
    'cambodian': { name: 'Cambodian', regionId: 'se_asia_main' },
    'laotian': { name: 'Laotian', regionId: 'se_asia_main' },
    'burmese': { name: 'Burmese', regionId: 'se_asia_main' },
    // Island
    'indonesian': { name: 'Indonesian', regionId: 'se_asia_island' },
    'javanese': { name: 'Javanese', regionId: 'se_asia_island' },
    'balinese': { name: 'Balinese', regionId: 'se_asia_island' },
    'filipino': { name: 'Filipino', regionId: 'se_asia_island' },
    'malaysian': { name: 'Malaysian', regionId: 'se_asia_island' },
    'singaporean': { name: 'Singaporean', regionId: 'se_asia_island' },
    'bruneian': { name: 'Bruneian', regionId: 'se_asia_island' },
    'east_timorese': { name: 'East Timorese', regionId: 'se_asia_island' },
    // Highland
    'hmong': { name: 'Hmong', regionId: 'highland_se_asia' },
    'karen': { name: 'Karen', regionId: 'highland_se_asia' }
  },

  // ============================================================================
  // SOUTH ASIA (~22 entries)
  // ============================================================================
  'South Asia': {
    // North India & Pakistan
    'indian': { name: 'Indian', regionId: 'north_india' },
    'north_indian': { name: 'North Indian', regionId: 'north_india' },
    'punjabi': { name: 'Punjabi', regionId: 'north_india' },
    'pakistani': { name: 'Pakistani', regionId: 'north_india' },
    'kashmiri': { name: 'Kashmiri', regionId: 'north_india' },
    'pashtun': { name: 'Pashtun', regionId: 'north_india' },
    // South India & Sri Lanka
    'south_indian': { name: 'South Indian', regionId: 'south_india' },
    'tamil': { name: 'Tamil', regionId: 'south_india' },
    'telugu': { name: 'Telugu', regionId: 'south_india' },
    'malayali': { name: 'Malayali (Kerala)', regionId: 'south_india' },
    'kannada': { name: 'Kannada', regionId: 'south_india' },
    'sri_lankan': { name: 'Sri Lankan', regionId: 'south_india' },
    // West India
    'gujarati': { name: 'Gujarati', regionId: 'west_india' },
    'maharashtrian': { name: 'Maharashtrian', regionId: 'west_india' },
    'goan': { name: 'Goan', regionId: 'west_india' },
    // East India & Bengal
    'bengali': { name: 'Bengali', regionId: 'bengal' },
    'bangladeshi': { name: 'Bangladeshi', regionId: 'bengal' },
    // Nepal & Himalayan
    'nepali': { name: 'Nepali', regionId: 'nepal' },
    'bhutanese': { name: 'Bhutanese', regionId: 'nepal' },
    // Island
    'maldivian': { name: 'Maldivian', regionId: 'south_india' }
  },

  // ============================================================================
  // CENTRAL ASIA (~12 entries)
  // ============================================================================
  'Central Asia': {
    // Steppe
    'kazakh': { name: 'Kazakh', regionId: 'central_asia' },
    'kyrgyz': { name: 'Kyrgyz', regionId: 'central_asia' },
    'uzbek': { name: 'Uzbek', regionId: 'central_asia' },
    'turkmen': { name: 'Turkmen', regionId: 'central_asia' },
    // Mongolia
    'mongolian': { name: 'Mongolian', regionId: 'mongolia' },
    // Siberia
    'siberian': { name: 'Siberian', regionId: 'siberia' },
    'yakut': { name: 'Yakut (Sakha)', regionId: 'siberia' },
    'buryat': { name: 'Buryat', regionId: 'siberia' }
  },

  // ============================================================================
  // THE AMERICAS (~45 entries)
  // ============================================================================
  'The Americas': {
    // Arctic
    'inuit': { name: 'Inuit', regionId: 'inuit' },
    'yupik': { name: 'Yupik', regionId: 'inuit' },
    // Pacific Northwest
    'haida': { name: 'Haida', regionId: 'pacific_nw' },
    'tlingit': { name: 'Tlingit', regionId: 'pacific_nw' },
    'salish': { name: 'Salish', regionId: 'pacific_nw' },
    // Great Plains
    'lakota': { name: 'Lakota/Sioux', regionId: 'great_plains' },
    'cheyenne': { name: 'Cheyenne', regionId: 'great_plains' },
    'blackfoot': { name: 'Blackfoot', regionId: 'great_plains' },
    // Eastern Woodlands
    'iroquois': { name: 'Iroquois', regionId: 'eastern_woodlands' },
    'cherokee': { name: 'Cherokee', regionId: 'eastern_woodlands' },
    'ojibwe': { name: 'Ojibwe', regionId: 'eastern_woodlands' },
    // Southwest US
    'navajo': { name: 'Navajo', regionId: 'southwest_us' },
    'pueblo': { name: 'Pueblo', regionId: 'southwest_us' },
    'apache': { name: 'Apache', regionId: 'southwest_us' },
    // Subarctic
    'cree': { name: 'Cree', regionId: 'subarctic' },
    'dene': { name: 'Dene', regionId: 'subarctic' },
    // Mesoamerica - Indigenous
    'maya': { name: 'Maya', regionId: 'mesoamerica' },
    'nahua': { name: 'Nahua/Aztec', regionId: 'mesoamerica' },
    // Mesoamerica - Modern nations
    'mexican': { name: 'Mexican', regionId: 'mestizo_mesoamerican' },
    'guatemalan': { name: 'Guatemalan', regionId: 'mestizo_mesoamerican' },
    'honduran': { name: 'Honduran', regionId: 'mestizo_mesoamerican' },
    'salvadoran': { name: 'Salvadoran', regionId: 'mestizo_mesoamerican' },
    'nicaraguan': { name: 'Nicaraguan', regionId: 'mestizo_mesoamerican' },
    'costa_rican': { name: 'Costa Rican', regionId: 'mestizo_mesoamerican' },
    'panamanian': { name: 'Panamanian', regionId: 'mestizo_mesoamerican' },
    // Caribbean
    'cuban': { name: 'Cuban', regionId: 'caribbean_creole' },
    'dominican': { name: 'Dominican', regionId: 'caribbean_creole' },
    'puerto_rican': { name: 'Puerto Rican', regionId: 'caribbean_creole' },
    'jamaican': { name: 'Jamaican', regionId: 'caribbean_creole' },
    'haitian': { name: 'Haitian', regionId: 'caribbean_creole' },
    'trinidadian': { name: 'Trinidadian', regionId: 'caribbean_creole' },
    'barbadian': { name: 'Barbadian', regionId: 'caribbean_creole' },
    'bahamian': { name: 'Bahamian', regionId: 'caribbean_creole' },
    // South America - Andean
    'quechua': { name: 'Quechua', regionId: 'andean' },
    'aymara': { name: 'Aymara', regionId: 'andean' },
    'peruvian': { name: 'Peruvian', regionId: 'andean' },
    'bolivian': { name: 'Bolivian', regionId: 'andean' },
    'ecuadorian': { name: 'Ecuadorian', regionId: 'andean' },
    'colombian': { name: 'Colombian', regionId: 'andean' },
    'venezuelan': { name: 'Venezuelan', regionId: 'andean' },
    // South America - Southern Cone
    'chilean': { name: 'Chilean', regionId: 'patagonia' },
    'mapuche': { name: 'Mapuche', regionId: 'patagonia' },
    'argentine': { name: 'Argentine', regionId: 'gaucho' },
    'uruguayan': { name: 'Uruguayan', regionId: 'gaucho' },
    'paraguayan': { name: 'Paraguayan', regionId: 'gaucho' },
    // Brazil & Guianas
    'brazilian': { name: 'Brazilian', regionId: 'brazilian_coastal' },
    'guyanese': { name: 'Guyanese', regionId: 'amazon' },
    'surinamese': { name: 'Surinamese', regionId: 'amazon' },
    // North America - Mixed heritage
    'american': { name: 'American', regionId: 'eastern_woodlands' },
    'african_american': { name: 'African American', regionId: 'southeast_us' },
    'cajun': { name: 'Cajun', regionId: 'southeast_us' },
    'canadian': { name: 'Canadian', regionId: 'canadian_prairies' },
    'quebecois': { name: 'Québécois', regionId: 'western_europe' },
    'metis': { name: 'Métis', regionId: 'subarctic' }
  },

  // ============================================================================
  // OCEANIA (~18 entries)
  // ============================================================================
  'Oceania': {
    // Australia - Indigenous
    'aboriginal_australian': { name: 'Aboriginal Australian', regionId: 'aboriginal_aus' },
    'torres_strait_islander': { name: 'Torres Strait Islander', regionId: 'aboriginal_aus' },
    // Australia & NZ - Settler
    'australian': { name: 'Australian', regionId: 'western_europe' },
    'new_zealander': { name: 'New Zealander', regionId: 'western_europe' },
    // New Zealand - Indigenous
    'maori': { name: 'Māori', regionId: 'maori' },
    // Melanesia
    'papua_new_guinean': { name: 'Papua New Guinean', regionId: 'melanesia' },
    'fijian': { name: 'Fijian', regionId: 'melanesia' },
    'solomon_islander': { name: 'Solomon Islander', regionId: 'melanesia' },
    'ni_vanuatu': { name: 'Ni-Vanuatu', regionId: 'melanesia' },
    'new_caledonian': { name: 'New Caledonian', regionId: 'melanesia' },
    // Micronesia (consolidated)
    'micronesian': { name: 'Micronesian', regionId: 'micronesia' },
    'chamorro': { name: 'Chamorro (Guam)', regionId: 'micronesia' },
    'palauan': { name: 'Palauan', regionId: 'micronesia' },
    // Polynesia
    'samoan': { name: 'Samoan', regionId: 'polynesia' },
    'tongan': { name: 'Tongan', regionId: 'polynesia' },
    'hawaiian': { name: 'Hawaiian', regionId: 'polynesia' },
    'tahitian': { name: 'Tahitian', regionId: 'polynesia' },
    'cook_islander': { name: 'Cook Islander', regionId: 'polynesia' }
  }
};

/**
 * Get all nationalities grouped by continent
 */
function getNationalitiesGrouped() {
  const grouped = {};

  for (const [continent, nationalities] of Object.entries(NATIONALITY_TO_REGION)) {
    grouped[continent] = Object.entries(nationalities)
      .map(([id, data]) => ({ id, name: data.name, regionId: data.regionId }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return grouped;
}

/**
 * Get the dietary region ID for a nationality ID
 */
function getRegionIdFromNationality(nationalityId) {
  if (getDietById(nationalityId)) {
    return nationalityId;
  }

  for (const nationalities of Object.values(NATIONALITY_TO_REGION)) {
    if (nationalities[nationalityId]) {
      return nationalities[nationalityId].regionId;
    }
  }

  return null;
}

/**
 * Get the display name for a nationality or region ID
 */
function getDisplayNameFromId(id) {
  for (const nationalities of Object.values(NATIONALITY_TO_REGION)) {
    if (nationalities[id]) {
      return nationalities[id].name;
    }
  }

  const geo = getGeoById(id);
  return geo ? geo.name : id;
}

// ============================================================================
// REGION GROUPS
// ============================================================================
const REGION_GROUPS = {
  'Africa': [
    'central_africa', 'ethiopia', 'horn_somalia', 'maasai', 'maghreb',
    'malagasy', 'nile_valley', 'nilotic', 'sahel', 'southern_africa',
    'sudanian', 'west_africa'
  ],
  'The Americas': [
    'amazon', 'andean', 'brazilian_coastal', 'california_coast',
    'canadian_prairies', 'caribbean_creole', 'caribbean_taino',
    'eastern_woodlands', 'gaucho', 'great_plains', 'inuit', 'mesoamerica',
    'mestizo_mesoamerican', 'pacific_nw', 'patagonia', 'southeast_us',
    'southwest_us', 'subarctic'
  ],
  'Central Asia': ['central_asia', 'mongolia', 'siberia'],
  'East Asia': [
    'japan', 'korea', 'north_china', 'sichuan_sw_china', 'south_china', 'tibet'
  ],
  'Europe': [
    'balkan', 'caucasus', 'central_europe', 'eastern_europe',
    'med_southern', 'nordic', 'western_europe'
  ],
  'Middle East': [
    'anatolian', 'arabian', 'kurdish', 'med_levant', 'mesopotamian', 'persian'
  ],
  'Oceania': [
    'aboriginal_aus', 'australian_coastal', 'maori', 'melanesia',
    'micronesia', 'polynesia'
  ],
  'South Asia': ['bengal', 'nepal', 'north_india', 'south_india', 'west_india'],
  'Southeast Asia': ['highland_se_asia', 'se_asia_island', 'se_asia_main']
};

/**
 * Group cultures by their geographic location
 */
function groupCulturesByLocation() {
  const grouped = {};
  const standalone = [];

  geoData.cultures.forEach(culture => {
    let foundGroup = false;

    for (const [groupName, cultureIds] of Object.entries(REGION_GROUPS)) {
      if (cultureIds.includes(culture.id)) {
        if (!grouped[groupName]) {
          grouped[groupName] = [];
        }
        grouped[groupName].push(culture);
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      standalone.push(culture);
    }
  });

  for (const groupName in grouped) {
    grouped[groupName].sort((a, b) => a.name.localeCompare(b.name));
  }
  standalone.sort((a, b) => a.name.localeCompare(b.name));

  return { grouped, standalone };
}

/**
 * Normalize an array of weights to sum to 1
 */
function normalizeWeights(weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  return sum > 0 ? weights.map(w => w / sum) : weights;
}