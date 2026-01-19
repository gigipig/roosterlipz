/**
 * Data module - handles loading and lookup of culture/diet data
 */

// Global data stores
let geoData = null;
let dietData = null;
let regionsGeoJSON = null;

/**
 * Load all data files
 * @returns {Promise<void>}
 */
async function loadData() {
  [geoData, dietData, regionsGeoJSON] = await Promise.all([
    fetch('./cultures.json').then(r => r.json()),
    fetch('./diets.json').then(r => r.json()),
    fetch('./regions.geojson?v=' + Date.now()).then(r => r.json())
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
  return dietData.cultures.find(c => c.id === id);
}

// ============================================================================
// MIXED ANCESTRY DEFAULTS
// ============================================================================
/**
 * Mixed ancestry default breakdowns for populations with known mixed heritage
 * When a user selects one of these nationalities, they can be prompted to use
 * these defaults or customize their own breakdown in DNA mode
 * 
 * Percentages are approximate population averages based on genetic studies
 */
const MIXED_ANCESTRY_DEFAULTS = {
  // ------------------------------------------------------------------------
  // CARIBBEAN - African diaspora + European colonizers + Indigenous remnants
  // ------------------------------------------------------------------------
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
  'barbadian': [
    { regionId: 'west_africa', percent: 80 },
    { regionId: 'western_europe', percent: 15 },
    { regionId: 'caribbean_taino', percent: 5 }
  ],
  'bahamian': [
    { regionId: 'west_africa', percent: 75 },
    { regionId: 'western_europe', percent: 20 },
    { regionId: 'caribbean_taino', percent: 5 }
  ],
  'grenadian': [
    { regionId: 'west_africa', percent: 75 },
    { regionId: 'south_india', percent: 10 },
    { regionId: 'western_europe', percent: 10 },
    { regionId: 'caribbean_taino', percent: 5 }
  ],
  'st_lucian': [
    { regionId: 'west_africa', percent: 80 },
    { regionId: 'western_europe', percent: 15 },
    { regionId: 'caribbean_taino', percent: 5 }
  ],
  'vincentian': [
    { regionId: 'west_africa', percent: 70 },
    { regionId: 'caribbean_taino', percent: 15 },
    { regionId: 'western_europe', percent: 15 }
  ],
  'antiguan': [
    { regionId: 'west_africa', percent: 80 },
    { regionId: 'western_europe', percent: 15 },
    { regionId: 'caribbean_taino', percent: 5 }
  ],
  'guyanese': [
    { regionId: 'south_india', percent: 40 },
    { regionId: 'west_africa', percent: 30 },
    { regionId: 'amazon', percent: 15 },
    { regionId: 'western_europe', percent: 15 }
  ],
  'surinamese': [
    { regionId: 'south_india', percent: 30 },
    { regionId: 'se_asia_island', percent: 25 },
    { regionId: 'west_africa', percent: 25 },
    { regionId: 'amazon', percent: 10 },
    { regionId: 'western_europe', percent: 10 }
  ],
  'garifuna': [
    { regionId: 'west_africa', percent: 65 },
    { regionId: 'caribbean_taino', percent: 25 },
    { regionId: 'western_europe', percent: 10 }
  ],

  // ------------------------------------------------------------------------
  // LATIN AMERICA - Mestizo populations (Spanish/Portuguese + Indigenous)
  // ------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------
  // BRAZIL - Complex mix varying by region
  // ------------------------------------------------------------------------
  'brazilian': [
    { regionId: 'med_southern', percent: 45 },
    { regionId: 'west_africa', percent: 40 },
    { regionId: 'amazon', percent: 10 },
    { regionId: 'central_europe', percent: 5 }
  ],
  'afro_brazilian': [
    { regionId: 'west_africa', percent: 70 },
    { regionId: 'med_southern', percent: 20 },
    { regionId: 'amazon', percent: 10 }
  ],

  // ------------------------------------------------------------------------
  // NORTH AMERICA - Mixed heritage populations
  // ------------------------------------------------------------------------
  'african_american': [
    { regionId: 'west_africa', percent: 75 },
    { regionId: 'western_europe', percent: 20 },
    { regionId: 'eastern_woodlands', percent: 5 }
  ],
  'cajun': [
    { regionId: 'western_europe', percent: 70 },
    { regionId: 'west_africa', percent: 15 },
    { regionId: 'caribbean_taino', percent: 10 },
    { regionId: 'eastern_woodlands', percent: 5 }
  ],
  'creole_louisiana': [
    { regionId: 'west_africa', percent: 40 },
    { regionId: 'western_europe', percent: 40 },
    { regionId: 'caribbean_taino', percent: 10 },
    { regionId: 'eastern_woodlands', percent: 10 }
  ],
  'metis': [
    { regionId: 'western_europe', percent: 50 },
    { regionId: 'subarctic', percent: 50 }
  ],

  // ------------------------------------------------------------------------
  // OCEANIA - Mixed heritage populations
  // ------------------------------------------------------------------------
  'australian': [
    { regionId: 'western_europe', percent: 85 },
    { regionId: 'aboriginal_aus', percent: 5 },
    { regionId: 'south_china', percent: 5 },
    { regionId: 'med_southern', percent: 5 }
  ],
  'new_zealander': [
    { regionId: 'western_europe', percent: 80 },
    { regionId: 'maori', percent: 15 },
    { regionId: 'polynesia', percent: 5 }
  ],

  // ------------------------------------------------------------------------
  // ASIA - Notable mixed populations
  // ------------------------------------------------------------------------
  'filipino': [
    { regionId: 'se_asia_island', percent: 70 },
    { regionId: 'south_china', percent: 15 },
    { regionId: 'med_southern', percent: 10 },
    { regionId: 'arabian', percent: 5 }
  ],
  'singaporean': [
    { regionId: 'south_china', percent: 60 },
    { regionId: 'se_asia_island', percent: 20 },
    { regionId: 'south_india', percent: 15 },
    { regionId: 'western_europe', percent: 5 }
  ],
  'malaysian': [
    { regionId: 'se_asia_island', percent: 55 },
    { regionId: 'south_china', percent: 30 },
    { regionId: 'south_india', percent: 10 },
    { regionId: 'arabian', percent: 5 }
  ],

  // ------------------------------------------------------------------------
  // AFRICA - Notable mixed populations
  // ------------------------------------------------------------------------
  'malagasy': [
    { regionId: 'se_asia_island', percent: 50 },
    { regionId: 'southern_africa', percent: 40 },
    { regionId: 'arabian', percent: 10 }
  ],
  'cape_verdean': [
    { regionId: 'west_africa', percent: 60 },
    { regionId: 'med_southern', percent: 40 }
  ],
  'mauritian': [
    { regionId: 'south_india', percent: 50 },
    { regionId: 'west_africa', percent: 25 },
    { regionId: 'south_china', percent: 15 },
    { regionId: 'western_europe', percent: 10 }
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
 * @param {string} nationalityId - The nationality ID
 * @returns {boolean} True if mixed ancestry defaults exist
 */
function hasMixedAncestry(nationalityId) {
  return MIXED_ANCESTRY_DEFAULTS.hasOwnProperty(nationalityId);
}

/**
 * Get mixed ancestry defaults for a nationality
 * @param {string} nationalityId - The nationality ID
 * @returns {Array|null} Array of {regionId, percent} or null
 */
function getMixedAncestryDefaults(nationalityId) {
  return MIXED_ANCESTRY_DEFAULTS[nationalityId] || null;
}

// ============================================================================
// NATIONALITY TO REGION MAPPING
// ============================================================================
/**
 * Nationality/ethnicity to region mapping for intuitive user selection
 * Users select a nationality, which maps to the underlying dietary region
 * 
 * NOTES ON MAPPING ACCURACY:
 * - Modern mixed nations (Caribbean, Latin America) use 'caribbean_creole' or regional equivalents
 * - Users with mixed heritage can use DNA mode with MIXED_ANCESTRY_DEFAULTS
 * - Indigenous groups map to their specific ancestral region
 * - Settler-colonial nations prompt for ancestral breakdown
 */
const NATIONALITY_TO_REGION = {
  // ============================================================================
  // AFRICA
  // ============================================================================
  'Africa': {
    // Nile Valley (NEW - distinct from Maghreb)
    'egyptian': { name: 'Egyptian', regionId: 'nile_valley' },
    'sudanese': { name: 'Sudanese', regionId: 'nile_valley' },
    'nubian': { name: 'Nubian', regionId: 'nile_valley' },
    // Maghreb (Berber/Arab North Africa)
    'moroccan': { name: 'Moroccan', regionId: 'maghreb' },
    'algerian': { name: 'Algerian', regionId: 'maghreb' },
    'tunisian': { name: 'Tunisian', regionId: 'maghreb' },
    'libyan': { name: 'Libyan', regionId: 'maghreb' },
    'berber': { name: 'Berber/Amazigh', regionId: 'maghreb' },
    // West Africa - Coastal & Forest
    'nigerian': { name: 'Nigerian', regionId: 'west_africa' },
    'ghanaian': { name: 'Ghanaian', regionId: 'west_africa' },
    'senegalese': { name: 'Senegalese', regionId: 'west_africa' },
    'ivorian': { name: 'Ivorian', regionId: 'west_africa' },
    'guinean': { name: 'Guinean', regionId: 'west_africa' },
    'sierra_leonean': { name: 'Sierra Leonean', regionId: 'west_africa' },
    'liberian': { name: 'Liberian', regionId: 'west_africa' },
    'togolese': { name: 'Togolese', regionId: 'west_africa' },
    'beninese': { name: 'Beninese', regionId: 'west_africa' },
    'gambian': { name: 'Gambian', regionId: 'west_africa' },
    'guinea_bissauan': { name: 'Guinea-Bissauan', regionId: 'west_africa' },
    'cape_verdean': { name: 'Cape Verdean', regionId: 'west_africa' },
    'yoruba': { name: 'Yoruba', regionId: 'west_africa' },
    'igbo': { name: 'Igbo', regionId: 'west_africa' },
    'akan': { name: 'Akan', regionId: 'west_africa' },
    'wolof': { name: 'Wolof', regionId: 'west_africa' },
    'mandinka': { name: 'Mandinka', regionId: 'west_africa' },
    'fula': { name: 'Fula/Fulani', regionId: 'sahel' },
    // Sahel
    'malian': { name: 'Malian', regionId: 'sahel' },
    'nigerien': { name: 'Nigerien', regionId: 'sahel' },
    'chadian': { name: 'Chadian', regionId: 'sahel' },
    'burkinabe': { name: 'Burkinabé', regionId: 'sahel' },
    'mauritanian': { name: 'Mauritanian', regionId: 'sahel' },
    'tuareg': { name: 'Tuareg', regionId: 'sahel' },
    'hausa': { name: 'Hausa', regionId: 'sahel' },
    // East Africa - Horn
    'ethiopian': { name: 'Ethiopian', regionId: 'ethiopia' },
    'eritrean': { name: 'Eritrean', regionId: 'ethiopia' },
    'amhara': { name: 'Amhara', regionId: 'ethiopia' },
    'oromo': { name: 'Oromo', regionId: 'ethiopia' },
    'tigrinya': { name: 'Tigrinya', regionId: 'ethiopia' },
    'somali': { name: 'Somali', regionId: 'horn_somalia' },
    'djiboutian': { name: 'Djiboutian', regionId: 'horn_somalia' },
    // East Africa - Pastoralist
    'kenyan': { name: 'Kenyan', regionId: 'maasai' },
    'tanzanian': { name: 'Tanzanian', regionId: 'maasai' },
    'maasai': { name: 'Maasai', regionId: 'maasai' },
    'samburu': { name: 'Samburu', regionId: 'maasai' },
    'kikuyu': { name: 'Kikuyu', regionId: 'nilotic' },
    // East Africa - Great Lakes
    'ugandan': { name: 'Ugandan', regionId: 'nilotic' },
    'rwandan': { name: 'Rwandan', regionId: 'nilotic' },
    'burundian': { name: 'Burundian', regionId: 'nilotic' },
    'south_sudanese': { name: 'South Sudanese', regionId: 'nilotic' },
    'dinka': { name: 'Dinka', regionId: 'nilotic' },
    'nuer': { name: 'Nuer', regionId: 'nilotic' },
    // Central Africa
    'congolese_drc': { name: 'Congolese (DRC)', regionId: 'central_africa' },
    'congolese_brazzaville': { name: 'Congolese (Brazzaville)', regionId: 'central_africa' },
    'gabonese': { name: 'Gabonese', regionId: 'central_africa' },
    'cameroonian': { name: 'Cameroonian', regionId: 'central_africa' },
    'central_african': { name: 'Central African', regionId: 'sudanian' },
    'equatorial_guinean': { name: 'Equatorial Guinean', regionId: 'central_africa' },
    'sao_tomean': { name: 'São Toméan', regionId: 'central_africa' },
    'pygmy': { name: 'Pygmy (Mbuti/Aka/Baka)', regionId: 'central_africa' },
    // Southern Africa
    'south_african': { name: 'South African', regionId: 'southern_africa' },
    'zimbabwean': { name: 'Zimbabwean', regionId: 'southern_africa' },
    'zambian': { name: 'Zambian', regionId: 'southern_africa' },
    'botswanan': { name: 'Botswanan', regionId: 'southern_africa' },
    'namibian': { name: 'Namibian', regionId: 'southern_africa' },
    'mozambican': { name: 'Mozambican', regionId: 'southern_africa' },
    'angolan': { name: 'Angolan', regionId: 'southern_africa' },
    'malawian': { name: 'Malawian', regionId: 'southern_africa' },
    'swazi': { name: 'Swazi', regionId: 'southern_africa' },
    'basotho': { name: 'Basotho (Lesotho)', regionId: 'southern_africa' },
    'zulu': { name: 'Zulu', regionId: 'southern_africa' },
    'xhosa': { name: 'Xhosa', regionId: 'southern_africa' },
    'san': { name: 'San (Bushmen)', regionId: 'southern_africa' },
    'khoikhoi': { name: 'Khoikhoi', regionId: 'southern_africa' },
    // Island Nations
    'malagasy': { name: 'Malagasy (Madagascar)', regionId: 'malagasy' },
    'mauritian': { name: 'Mauritian', regionId: 'southern_africa' },
    'seychellois': { name: 'Seychellois', regionId: 'southern_africa' },
    'comorian': { name: 'Comorian', regionId: 'southern_africa' }
  },

  // ============================================================================
  // EUROPE
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
    'moldovan': { name: 'Moldovan', regionId: 'eastern_europe' },
    // Central Europe
    'german': { name: 'German', regionId: 'central_europe' },
    'austrian': { name: 'Austrian', regionId: 'central_europe' },
    'swiss': { name: 'Swiss', regionId: 'central_europe' },
    'czech': { name: 'Czech', regionId: 'central_europe' },
    'slovak': { name: 'Slovak', regionId: 'central_europe' },
    'hungarian': { name: 'Hungarian', regionId: 'central_europe' },
    'liechtenstein': { name: 'Liechtensteiner', regionId: 'central_europe' },
    // Western Europe
    'british': { name: 'British', regionId: 'western_europe' },
    'english': { name: 'English', regionId: 'western_europe' },
    'scottish': { name: 'Scottish', regionId: 'western_europe' },
    'welsh': { name: 'Welsh', regionId: 'western_europe' },
    'irish': { name: 'Irish', regionId: 'western_europe' },
    'french': { name: 'French', regionId: 'western_europe' },
    'dutch': { name: 'Dutch', regionId: 'western_europe' },
    'belgian': { name: 'Belgian', regionId: 'western_europe' },
    'luxembourgish': { name: 'Luxembourgish', regionId: 'western_europe' },
    'breton': { name: 'Breton', regionId: 'western_europe' },
    // Nordic
    'swedish': { name: 'Swedish', regionId: 'nordic' },
    'norwegian': { name: 'Norwegian', regionId: 'nordic' },
    'danish': { name: 'Danish', regionId: 'nordic' },
    'finnish': { name: 'Finnish', regionId: 'nordic' },
    'icelandic': { name: 'Icelandic', regionId: 'nordic' },
    'faroese': { name: 'Faroese', regionId: 'nordic' },
    'sami': { name: 'Sámi', regionId: 'nordic' },
    // Mediterranean - Southern European
    'italian': { name: 'Italian', regionId: 'med_southern' },
    'greek': { name: 'Greek', regionId: 'med_southern' },
    'spanish': { name: 'Spanish', regionId: 'med_southern' },
    'portuguese': { name: 'Portuguese', regionId: 'med_southern' },
    'maltese': { name: 'Maltese', regionId: 'med_southern' },
    'cypriot': { name: 'Cypriot', regionId: 'med_southern' },
    'andorran': { name: 'Andorran', regionId: 'med_southern' },
    'sardinian': { name: 'Sardinian', regionId: 'med_southern' },
    'sicilian': { name: 'Sicilian', regionId: 'med_southern' },
    'corsican': { name: 'Corsican', regionId: 'med_southern' },
    'basque': { name: 'Basque', regionId: 'med_southern' },
    'catalan': { name: 'Catalan', regionId: 'med_southern' },
    'galician': { name: 'Galician', regionId: 'med_southern' },
    // Balkans
    'serbian': { name: 'Serbian', regionId: 'balkan' },
    'croatian': { name: 'Croatian', regionId: 'balkan' },
    'bosnian': { name: 'Bosnian', regionId: 'balkan' },
    'albanian': { name: 'Albanian', regionId: 'balkan' },
    'bulgarian': { name: 'Bulgarian', regionId: 'balkan' },
    'romanian': { name: 'Romanian', regionId: 'balkan' },
    'slovenian': { name: 'Slovenian', regionId: 'balkan' },
    'macedonian': { name: 'Macedonian', regionId: 'balkan' },
    'montenegrin': { name: 'Montenegrin', regionId: 'balkan' },
    'kosovar': { name: 'Kosovar', regionId: 'balkan' },
    // Caucasus
    'georgian': { name: 'Georgian', regionId: 'caucasus' },
    'armenian': { name: 'Armenian', regionId: 'caucasus' },
    'azerbaijani': { name: 'Azerbaijani', regionId: 'caucasus' },
    'chechen': { name: 'Chechen', regionId: 'caucasus' },
    'ossetian': { name: 'Ossetian', regionId: 'caucasus' },
    'abkhaz': { name: 'Abkhaz', regionId: 'caucasus' },
    'circassian': { name: 'Circassian', regionId: 'caucasus' },
    // Diaspora/Ethnic Groups with distinct genetic profiles
    'ashkenazi_jewish': { name: 'Ashkenazi Jewish', regionId: 'eastern_europe' },
    'sephardic_jewish': { name: 'Sephardic Jewish', regionId: 'med_southern' },
    'mizrahi_jewish': { name: 'Mizrahi Jewish', regionId: 'med_levant' },
    'roma': { name: 'Roma/Romani', regionId: 'balkan' }
  },

  // ============================================================================
  // MIDDLE EAST
  // ============================================================================
  'Middle East': {
    // Levant
    'lebanese': { name: 'Lebanese', regionId: 'med_levant' },
    'syrian': { name: 'Syrian', regionId: 'med_levant' },
    'palestinian': { name: 'Palestinian', regionId: 'med_levant' },
    'jordanian': { name: 'Jordanian', regionId: 'med_levant' },
    'israeli': { name: 'Israeli', regionId: 'med_levant' },
    'druze': { name: 'Druze', regionId: 'med_levant' },
    // Mesopotamia (NEW - distinct from Kurdish)
    'iraqi': { name: 'Iraqi', regionId: 'mesopotamian' },
    'iraqi_arab': { name: 'Iraqi Arab', regionId: 'mesopotamian' },
    'marsh_arab': { name: 'Marsh Arab', regionId: 'mesopotamian' },
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
    'bedouin': { name: 'Bedouin', regionId: 'arabian' },
    // Persian
    'iranian': { name: 'Iranian', regionId: 'persian' },
    'persian': { name: 'Persian', regionId: 'persian' },
    'afghan': { name: 'Afghan', regionId: 'persian' },
    'tajik': { name: 'Tajik', regionId: 'persian' },
    'baloch': { name: 'Baloch', regionId: 'persian' },
    'hazara': { name: 'Hazara', regionId: 'persian' }
  },

  // ============================================================================
  // EAST ASIA
  // ============================================================================
  'East Asia': {
    // Japan
    'japanese': { name: 'Japanese', regionId: 'japan' },
    'okinawan': { name: 'Okinawan', regionId: 'japan' },
    'ainu': { name: 'Ainu', regionId: 'japan' },
    // Korea
    'korean': { name: 'Korean', regionId: 'korea' },
    'north_korean': { name: 'North Korean', regionId: 'korea' },
    'south_korean': { name: 'South Korean', regionId: 'korea' },
    // China - North
    'northern_chinese': { name: 'Northern Chinese', regionId: 'north_china' },
    'manchurian': { name: 'Manchurian', regionId: 'north_china' },
    'beijing': { name: 'Beijing', regionId: 'north_china' },
    'shandong': { name: 'Shandong', regionId: 'north_china' },
    // China - South
    'cantonese': { name: 'Cantonese', regionId: 'south_china' },
    'southern_chinese': { name: 'Southern Chinese', regionId: 'south_china' },
    'fujianese': { name: 'Fujianese', regionId: 'south_china' },
    'hakka': { name: 'Hakka', regionId: 'south_china' },
    'teochew': { name: 'Teochew', regionId: 'south_china' },
    'hong_konger': { name: 'Hong Konger', regionId: 'south_china' },
    'taiwanese': { name: 'Taiwanese', regionId: 'south_china' },
    'taiwanese_indigenous': { name: 'Taiwanese Indigenous', regionId: 'se_asia_island' },
    'zhuang': { name: 'Zhuang', regionId: 'south_china' },
    // China - Southwest
    'sichuanese': { name: 'Sichuanese', regionId: 'sichuan_sw_china' },
    'hunanese': { name: 'Hunanese', regionId: 'sichuan_sw_china' },
    'yunnan': { name: 'Yunnan', regionId: 'sichuan_sw_china' },
    'guizhou': { name: 'Guizhou', regionId: 'sichuan_sw_china' },
    'yi': { name: 'Yi', regionId: 'sichuan_sw_china' },
    // Tibet
    'tibetan': { name: 'Tibetan', regionId: 'tibet' },
    // Xinjiang
    'uyghur': { name: 'Uyghur', regionId: 'central_asia' },
    // Other
    'miao_china': { name: 'Miao/Hmong (China)', regionId: 'highland_se_asia' }
  },

  // ============================================================================
  // SOUTHEAST ASIA
  // ============================================================================
  'Southeast Asia': {
    // Mainland
    'thai': { name: 'Thai', regionId: 'se_asia_main' },
    'vietnamese': { name: 'Vietnamese', regionId: 'se_asia_main' },
    'cambodian': { name: 'Cambodian', regionId: 'se_asia_main' },
    'laotian': { name: 'Laotian', regionId: 'se_asia_main' },
    'burmese': { name: 'Burmese', regionId: 'se_asia_main' },
    'khmer': { name: 'Khmer', regionId: 'se_asia_main' },
    // Island
    'indonesian': { name: 'Indonesian', regionId: 'se_asia_island' },
    'javanese': { name: 'Javanese', regionId: 'se_asia_island' },
    'sundanese': { name: 'Sundanese', regionId: 'se_asia_island' },
    'balinese': { name: 'Balinese', regionId: 'se_asia_island' },
    'minangkabau': { name: 'Minangkabau', regionId: 'se_asia_island' },
    'bugis': { name: 'Bugis', regionId: 'se_asia_island' },
    'filipino': { name: 'Filipino', regionId: 'se_asia_island' },
    'tagalog': { name: 'Tagalog', regionId: 'se_asia_island' },
    'visayan': { name: 'Visayan', regionId: 'se_asia_island' },
    'ilocano': { name: 'Ilocano', regionId: 'se_asia_island' },
    'malaysian': { name: 'Malaysian', regionId: 'se_asia_island' },
    'malay': { name: 'Malay', regionId: 'se_asia_island' },
    'singaporean': { name: 'Singaporean', regionId: 'se_asia_island' },
    'bruneian': { name: 'Bruneian', regionId: 'se_asia_island' },
    'east_timorese': { name: 'East Timorese', regionId: 'se_asia_island' },
    // Highland
    'hmong': { name: 'Hmong', regionId: 'highland_se_asia' },
    'karen': { name: 'Karen', regionId: 'highland_se_asia' },
    'shan': { name: 'Shan', regionId: 'highland_se_asia' },
    'akha': { name: 'Akha', regionId: 'highland_se_asia' }
  },

  // ============================================================================
  // SOUTH ASIA
  // ============================================================================
  'South Asia': {
    // North India & Pakistan
    'punjabi': { name: 'Punjabi', regionId: 'north_india' },
    'north_indian': { name: 'North Indian', regionId: 'north_india' },
    'kashmiri': { name: 'Kashmiri', regionId: 'north_india' },
    'pakistani': { name: 'Pakistani', regionId: 'north_india' },
    'sindhi': { name: 'Sindhi', regionId: 'north_india' },
    'pashtun': { name: 'Pashtun', regionId: 'north_india' },
    'bihari': { name: 'Bihari', regionId: 'north_india' },
    'rajasthani': { name: 'Rajasthani', regionId: 'north_india' },
    'uttar_pradesh': { name: 'Uttar Pradesh', regionId: 'north_india' },
    'haryanvi': { name: 'Haryanvi', regionId: 'north_india' },
    'himachali': { name: 'Himachali', regionId: 'north_india' },
    // South India & Sri Lanka
    'tamil': { name: 'Tamil', regionId: 'south_india' },
    'telugu': { name: 'Telugu', regionId: 'south_india' },
    'kannada': { name: 'Kannada', regionId: 'south_india' },
    'malayali': { name: 'Malayali (Kerala)', regionId: 'south_india' },
    'sri_lankan': { name: 'Sri Lankan', regionId: 'south_india' },
    'sinhalese': { name: 'Sinhalese', regionId: 'south_india' },
    'sri_lankan_tamil': { name: 'Sri Lankan Tamil', regionId: 'south_india' },
    // West India
    'gujarati': { name: 'Gujarati', regionId: 'west_india' },
    'maharashtrian': { name: 'Maharashtrian', regionId: 'west_india' },
    'goan': { name: 'Goan', regionId: 'west_india' },
    'konkani': { name: 'Konkani', regionId: 'west_india' },
    'parsi': { name: 'Parsi', regionId: 'west_india' },
    // East India & Bengal
    'bengali': { name: 'Bengali', regionId: 'bengal' },
    'bangladeshi': { name: 'Bangladeshi', regionId: 'bengal' },
    'odia': { name: 'Odia (Oriya)', regionId: 'bengal' },
    'assamese': { name: 'Assamese', regionId: 'bengal' },
    // Nepal & Himalayan
    'nepali': { name: 'Nepali', regionId: 'nepal' },
    'bhutanese': { name: 'Bhutanese', regionId: 'nepal' },
    'sherpa': { name: 'Sherpa', regionId: 'nepal' },
    'newari': { name: 'Newari', regionId: 'nepal' },
    // Island
    'maldivian': { name: 'Maldivian', regionId: 'south_india' }
  },

  // ============================================================================
  // CENTRAL ASIA
  // ============================================================================
  'Central Asia': {
    // Steppe
    'kazakh': { name: 'Kazakh', regionId: 'central_asia' },
    'kyrgyz': { name: 'Kyrgyz', regionId: 'central_asia' },
    'uzbek': { name: 'Uzbek', regionId: 'central_asia' },
    'turkmen': { name: 'Turkmen', regionId: 'central_asia' },
    'karakalpak': { name: 'Karakalpak', regionId: 'central_asia' },
    // Mongolia
    'mongolian': { name: 'Mongolian', regionId: 'mongolia' },
    'inner_mongolian': { name: 'Inner Mongolian', regionId: 'mongolia' },
    // Siberia
    'siberian': { name: 'Siberian', regionId: 'siberia' },
    'yakut': { name: 'Yakut (Sakha)', regionId: 'siberia' },
    'buryat': { name: 'Buryat', regionId: 'siberia' },
    'tuvan': { name: 'Tuvan', regionId: 'siberia' },
    'altai': { name: 'Altai', regionId: 'siberia' },
    'evenki': { name: 'Evenki', regionId: 'siberia' },
    'nenets': { name: 'Nenets', regionId: 'siberia' },
    'chukchi': { name: 'Chukchi', regionId: 'siberia' },
    'koryak': { name: 'Koryak', regionId: 'siberia' }
  },

  // ============================================================================
  // THE AMERICAS
  // ============================================================================
  'The Americas': {
    // Arctic
    'inuit': { name: 'Inuit', regionId: 'inuit' },
    'yupik': { name: 'Yupik', regionId: 'inuit' },
    'aleut': { name: 'Aleut', regionId: 'inuit' },
    'greenlandic': { name: 'Greenlandic', regionId: 'inuit' },
    // Pacific Northwest
    'haida': { name: 'Haida', regionId: 'pacific_nw' },
    'tlingit': { name: 'Tlingit', regionId: 'pacific_nw' },
    'salish': { name: 'Salish', regionId: 'pacific_nw' },
    'kwakwakawakw': { name: "Kwakwaka'wakw", regionId: 'pacific_nw' },
    'nuu_chah_nulth': { name: 'Nuu-chah-nulth', regionId: 'pacific_nw' },
    // Great Plains
    'lakota': { name: 'Lakota', regionId: 'great_plains' },
    'cheyenne': { name: 'Cheyenne', regionId: 'great_plains' },
    'sioux': { name: 'Sioux', regionId: 'great_plains' },
    'crow': { name: 'Crow', regionId: 'great_plains' },
    'blackfoot': { name: 'Blackfoot', regionId: 'great_plains' },
    'comanche': { name: 'Comanche', regionId: 'great_plains' },
    // Eastern Woodlands
    'iroquois': { name: 'Iroquois', regionId: 'eastern_woodlands' },
    'algonquin': { name: 'Algonquin', regionId: 'eastern_woodlands' },
    'cherokee': { name: 'Cherokee', regionId: 'eastern_woodlands' },
    'choctaw': { name: 'Choctaw', regionId: 'eastern_woodlands' },
    'creek': { name: 'Creek', regionId: 'eastern_woodlands' },
    'seminole': { name: 'Seminole', regionId: 'eastern_woodlands' },
    'lenape': { name: 'Lenape', regionId: 'eastern_woodlands' },
    // Southwest US
    'pueblo': { name: 'Pueblo', regionId: 'southwest_us' },
    'navajo': { name: 'Navajo', regionId: 'southwest_us' },
    'apache': { name: 'Apache', regionId: 'southwest_us' },
    'hopi': { name: 'Hopi', regionId: 'southwest_us' },
    'zuni': { name: 'Zuni', regionId: 'southwest_us' },
    // Subarctic
    'dene': { name: 'Dene', regionId: 'subarctic' },
    'cree': { name: 'Cree', regionId: 'subarctic' },
    'ojibwe': { name: 'Ojibwe', regionId: 'subarctic' },
    // California
    'california_native': { name: 'California Native', regionId: 'california_coast' },
    'miwok': { name: 'Miwok', regionId: 'california_coast' },
    'pomo': { name: 'Pomo', regionId: 'california_coast' },
    // Mesoamerica - Indigenous
    'maya': { name: 'Maya', regionId: 'mesoamerica' },
    'aztec_nahua': { name: 'Aztec/Nahua', regionId: 'mesoamerica' },
    'zapotec': { name: 'Zapotec', regionId: 'mesoamerica' },
    'mixtec': { name: 'Mixtec', regionId: 'mesoamerica' },
    'mexican_indigenous': { name: 'Mexican Indigenous', regionId: 'mesoamerica' },
    // Mesoamerica - Modern Mestizo nations
    'mexican': { name: 'Mexican', regionId: 'mestizo_mesoamerican' },
    'guatemalan': { name: 'Guatemalan', regionId: 'mestizo_mesoamerican' },
    'honduran': { name: 'Honduran', regionId: 'mestizo_mesoamerican' },
    'salvadoran': { name: 'Salvadoran', regionId: 'mestizo_mesoamerican' },
    'nicaraguan': { name: 'Nicaraguan', regionId: 'mestizo_mesoamerican' },
    'costa_rican': { name: 'Costa Rican', regionId: 'mestizo_mesoamerican' },
    'panamanian': { name: 'Panamanian', regionId: 'mestizo_mesoamerican' },
    'belizean': { name: 'Belizean', regionId: 'mestizo_mesoamerican' },
    // Caribbean - Indigenous
    'taino': { name: 'Taíno', regionId: 'caribbean_taino' },
    // Caribbean - Modern Creole nations
    'cuban': { name: 'Cuban', regionId: 'caribbean_creole' },
    'dominican': { name: 'Dominican', regionId: 'caribbean_creole' },
    'puerto_rican': { name: 'Puerto Rican', regionId: 'caribbean_creole' },
    'jamaican': { name: 'Jamaican', regionId: 'caribbean_creole' },
    'haitian': { name: 'Haitian', regionId: 'caribbean_creole' },
    'trinidadian': { name: 'Trinidadian', regionId: 'caribbean_creole' },
    'tobagonian': { name: 'Tobagonian', regionId: 'caribbean_creole' },
    'barbadian': { name: 'Barbadian', regionId: 'caribbean_creole' },
    'bahamian': { name: 'Bahamian', regionId: 'caribbean_creole' },
    'grenadian': { name: 'Grenadian', regionId: 'caribbean_creole' },
    'st_lucian': { name: 'St. Lucian', regionId: 'caribbean_creole' },
    'vincentian': { name: 'Vincentian', regionId: 'caribbean_creole' },
    'antiguan': { name: 'Antiguan', regionId: 'caribbean_creole' },
    'kittitian': { name: 'Kittitian', regionId: 'caribbean_creole' },
    'aruban': { name: 'Aruban', regionId: 'caribbean_creole' },
    'curacaoan': { name: 'Curaçaoan', regionId: 'caribbean_creole' },
    'virgin_islander': { name: 'Virgin Islander', regionId: 'caribbean_creole' },
    'garifuna': { name: 'Garifuna', regionId: 'caribbean_creole' },
    // South America - Amazon
    'amazonian': { name: 'Amazonian', regionId: 'amazon' },
    'yanomami': { name: 'Yanomami', regionId: 'amazon' },
    'kayapo': { name: 'Kayapó', regionId: 'amazon' },
    // South America - Andean Indigenous
    'quechua': { name: 'Quechua', regionId: 'andean' },
    'aymara': { name: 'Aymara', regionId: 'andean' },
    // South America - Modern Andean nations
    'peruvian': { name: 'Peruvian', regionId: 'andean' },
    'bolivian': { name: 'Bolivian', regionId: 'andean' },
    'ecuadorian': { name: 'Ecuadorian', regionId: 'andean' },
    'colombian': { name: 'Colombian', regionId: 'andean' },
    'venezuelan': { name: 'Venezuelan', regionId: 'andean' },
    // South America - Southern Cone
    'chilean': { name: 'Chilean', regionId: 'patagonia' },
    'mapuche': { name: 'Mapuche', regionId: 'patagonia' },
    'patagonian': { name: 'Patagonian', regionId: 'patagonia' },
    'argentine': { name: 'Argentine', regionId: 'gaucho' },
    'uruguayan': { name: 'Uruguayan', regionId: 'gaucho' },
    'paraguayan': { name: 'Paraguayan', regionId: 'gaucho' },
    'guarani': { name: 'Guaraní', regionId: 'gaucho' },
    // South America - Brazil
    'brazilian': { name: 'Brazilian', regionId: 'brazilian_coastal' },
    'afro_brazilian': { name: 'Afro-Brazilian', regionId: 'brazilian_coastal' },
    // South America - Guianas
    'guyanese': { name: 'Guyanese', regionId: 'amazon' },
    'surinamese': { name: 'Surinamese', regionId: 'amazon' },
    'french_guianese': { name: 'French Guianese', regionId: 'amazon' },
    // North America - Mixed heritage
    'american': { name: 'American', regionId: 'eastern_woodlands' },
    'african_american': { name: 'African American', regionId: 'southeast_us' },
    'southern_us': { name: 'Southern US', regionId: 'southeast_us' },
    'cajun': { name: 'Cajun', regionId: 'southeast_us' },
    'creole_louisiana': { name: 'Creole (Louisiana)', regionId: 'southeast_us' },
    'canadian': { name: 'Canadian', regionId: 'canadian_prairies' },
    'quebecois': { name: 'Québécois', regionId: 'western_europe' },
    'acadian': { name: 'Acadian', regionId: 'western_europe' },
    'metis': { name: 'Métis', regionId: 'subarctic' }
  },

  // ============================================================================
  // OCEANIA
  // ============================================================================
  'Oceania': {
    // Australia - Indigenous
    'aboriginal_australian': { name: 'Aboriginal Australian', regionId: 'aboriginal_aus' },
    'torres_strait_islander': { name: 'Torres Strait Islander', regionId: 'aboriginal_aus' },
    'coastal_aboriginal': { name: 'Coastal Aboriginal', regionId: 'australian_coastal' },
    // Australia & NZ - Settler
    'australian': { name: 'Australian', regionId: 'western_europe' },
    'new_zealander': { name: 'New Zealander', regionId: 'western_europe' },
    // New Zealand - Indigenous
    'maori': { name: 'Māori', regionId: 'maori' },
    // Melanesia
    'papua_new_guinean': { name: 'Papua New Guinean', regionId: 'melanesia' },
    'fijian': { name: 'Fijian', regionId: 'melanesia' },
    'solomon_islander': { name: 'Solomon Islander', regionId: 'melanesia' },
    'vanuatuan': { name: 'Vanuatuan', regionId: 'melanesia' },
    'ni_vanuatu': { name: 'Ni-Vanuatu', regionId: 'melanesia' },
    'new_caledonian': { name: 'New Caledonian', regionId: 'melanesia' },
    'kanak': { name: 'Kanak', regionId: 'melanesia' },
    // Micronesia
    'micronesian': { name: 'Micronesian', regionId: 'micronesia' },
    'marshallese': { name: 'Marshallese', regionId: 'micronesia' },
    'palauan': { name: 'Palauan', regionId: 'micronesia' },
    'chamorro': { name: 'Chamorro', regionId: 'micronesia' },
    'chuukese': { name: 'Chuukese', regionId: 'micronesia' },
    'pohnpeian': { name: 'Pohnpeian', regionId: 'micronesia' },
    'yapese': { name: 'Yapese', regionId: 'micronesia' },
    'kosraean': { name: 'Kosraean', regionId: 'micronesia' },
    'nauruan': { name: 'Nauruan', regionId: 'micronesia' },
    'kiribati': { name: 'I-Kiribati', regionId: 'micronesia' },
    // Polynesia
    'samoan': { name: 'Samoan', regionId: 'polynesia' },
    'tongan': { name: 'Tongan', regionId: 'polynesia' },
    'hawaiian': { name: 'Hawaiian', regionId: 'polynesia' },
    'tahitian': { name: 'Tahitian', regionId: 'polynesia' },
    'cook_islander': { name: 'Cook Islander', regionId: 'polynesia' },
    'niuean': { name: 'Niuean', regionId: 'polynesia' },
    'tokelauan': { name: 'Tokelauan', regionId: 'polynesia' },
    'tuvaluan': { name: 'Tuvaluan', regionId: 'polynesia' },
    'rapanui': { name: 'Rapa Nui (Easter Island)', regionId: 'polynesia' },
    'marquesan': { name: 'Marquesan', regionId: 'polynesia' }
  }
};

/**
 * Get all nationalities grouped by continent for dropdown population
 * @returns {Object} Object with continent names as keys and arrays of {id, name, regionId} as values
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
 * @param {string} nationalityId - The nationality ID (e.g., 'polish')
 * @returns {string|null} The region ID (e.g., 'eastern_europe') or null if not found
 */
function getRegionIdFromNationality(nationalityId) {
  // First check if it's already a valid region ID (for backwards compatibility)
  if (getDietById(nationalityId)) {
    return nationalityId;
  }

  // Look up in nationality mapping
  for (const nationalities of Object.values(NATIONALITY_TO_REGION)) {
    if (nationalities[nationalityId]) {
      return nationalities[nationalityId].regionId;
    }
  }

  return null;
}

/**
 * Get the display name for a nationality or region ID
 * @param {string} id - The nationality ID or region ID
 * @returns {string} The display name
 */
function getDisplayNameFromId(id) {
  // Check nationality mapping first
  for (const nationalities of Object.values(NATIONALITY_TO_REGION)) {
    if (nationalities[id]) {
      return nationalities[id].name;
    }
  }

  // Fall back to geo data for region IDs
  const geo = getGeoById(id);
  return geo ? geo.name : id;
}

// ============================================================================
// REGION GROUPS (for internal organization - REVIEWED FOR ACCURACY)
// ============================================================================
const REGION_GROUPS = {
  'Africa': [
    'central_africa',    // Congo basin rainforest peoples
    'ethiopia',          // Ethiopian/Eritrean highlands
    'horn_somalia',      // Somali/Djiboutian
    'maasai',            // East African pastoralists (Kenya/Tanzania)
    'maghreb',           // Morocco/Algeria/Tunisia/Libya (Berber)
    'malagasy',          // Madagascar (Austronesian + African) - NEW
    'nile_valley',       // Egypt/Sudan/Nubia - NEW
    'nilotic',           // Great Lakes region (Uganda/Rwanda/Burundi/South Sudan)
    'sahel',             // Mali/Niger/Chad/Burkina Faso
    'southern_africa',   // Southern Africa (Bantu/Khoisan)
    'sudanian',          // Central African savanna
    'west_africa'        // Nigeria/Ghana/Senegal coastal
  ],
  'The Americas': [
    'amazon',            // Amazonian indigenous
    'andean',            // Quechua/Aymara highlands
    'brazilian_coastal', // Afro-Brazilian fusion
    'california_coast',  // California indigenous
    'canadian_prairies', // Plains/Subarctic fusion
    'caribbean_creole',  // Caribbean Creole fusion - NEW
    'caribbean_taino',   // Taíno indigenous (historical)
    'eastern_woodlands', // Iroquois/Algonquin
    'gaucho',            // Pampas pastoralist
    'great_plains',      // Lakota/Cheyenne
    'inuit',             // Arctic Inuit/Yupik
    'mesoamerica',       // Maya/Aztec indigenous
    'mestizo_mesoamerican', // Spanish + Indigenous fusion - NEW
    'pacific_nw',        // Pacific Northwest (Haida/Tlingit/Salish)
    'patagonia',         // Mapuche/Patagonian
    'southeast_us',      // African-influenced Southern US
    'southwest_us',      // Pueblo/Navajo
    'subarctic'          // Dene/Cree
  ],
  'Central Asia': [
    'central_asia',      // Kazakh/Kyrgyz/Uzbek steppe
    'mongolia',          // Mongolian steppe
    'siberia'            // Siberian peoples
  ],
  'East Asia': [
    'japan',             // Japanese (Washoku)
    'korea',             // Korean
    'north_china',       // Northern Chinese/Manchurian
    'sichuan_sw_china',  // Sichuan/Southwest China
    'south_china',       // Southern Chinese (Cantonese/Fujian)
    'tibet'              // Tibetan Plateau
  ],
  'Europe': [
    'balkan',            // Balkans (Slavic/Ottoman/Mediterranean fusion)
    'caucasus',          // Georgia/Armenia/Azerbaijan
    'central_europe',    // Germany/Austria/Switzerland/Czech
    'eastern_europe',    // Poland/Ukraine/Russia
    'med_southern',      // Italy/Greece/Spain/Portugal
    'nordic',            // Scandinavia
    'western_europe'     // UK/Ireland/France/Benelux
  ],
  'Middle East': [
    'anatolian',         // Turkey/Anatolia
    'arabian',           // Arabian Peninsula/Bedouin
    'kurdish',           // Kurdistan regions
    'med_levant',        // Lebanon/Syria/Palestine/Jordan
    'mesopotamian',      // Iraq/Fertile Crescent - NEW
    'persian'            // Iran/Persia/Afghanistan
  ],
  'Oceania': [
    'aboriginal_aus',    // Aboriginal Australian (interior)
    'australian_coastal', // Coastal Aboriginal
    'maori',             // Māori (New Zealand)
    'melanesia',         // PNG/Fiji/Solomon Islands/Vanuatu
    'micronesia',        // Micronesian islands
    'polynesia'          // Samoa/Tonga/Hawaii/Tahiti
  ],
  'South Asia': [
    'bengal',            // Bangladesh/West Bengal
    'nepal',             // Nepal/Himalayan
    'north_india',       // Punjab/Hindi belt
    'south_india',       // Tamil Nadu/Kerala/Andhra/Karnataka
    'west_india'         // Gujarat/Maharashtra
  ],
  'Southeast Asia': [
    'highland_se_asia',  // Hmong/Karen/Shan highland peoples
    'se_asia_island',    // Indonesia/Philippines/Malaysia maritime
    'se_asia_main'       // Thailand/Cambodia/Laos/Vietnam/Myanmar
  ]
};

/**
 * Group cultures by their geographic location
 * @returns {Object} Object with grouped and standalone cultures
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

  // Sort within groups
  for (const groupName in grouped) {
    grouped[groupName].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Sort standalone
  standalone.sort((a, b) => a.name.localeCompare(b.name));

  return { grouped, standalone };
}

/**
 * Normalize an array of weights to sum to 1
 * @param {number[]} weights - Array of weights
 * @returns {number[]} Normalized weights
 */
function normalizeWeights(weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  return sum > 0 ? weights.map(w => w / sum) : weights;
}
