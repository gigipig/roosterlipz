/**
 * Data module - handles loading and lookup of culture/diet/genetics data
 * TypeScript port of js/data.js
 */

import type { GeoEntry, DietEntry, NationalitiesGrouped, NationalityEntry, AncientRootsEntry } from './types';

// ============================================================================
// Internal data stores
// ============================================================================

let geoData: { cultures: GeoEntry[] } | null = null;
let dietData: { cultures: DietEntry[] } | null = null;
let geneticsData: { version?: string; cultures: Array<{ id: string; genetic_adaptations: Record<string, unknown> }> } | null = null;
let ancientRootsData: Array<{ id: string; ancient_roots: AncientRootsEntry }> | null = null;

// Key expansion map (reverse of compression in migration script)
const FREQ_KEY_EXPANSION: Record<string, string> = {
  'f': 'allele_frequency_percent',
  'p': 'phenotype_probability',
  'cn': 'average_copy_number',
  'nf': 'null_frequency_percent',
  't': 'inferred_phenotype',
  'pc': 'phenotype_confidence',
  'af1': 'african_allele_gc14010',
  'me': 'middle_eastern_allele_tg13915',
  'af2': 'african_allele_cg13907'
};

function buildTraitObject(ref: Record<string, unknown> | null, freq: Record<string, unknown>): Record<string, unknown> | null {
  if (!ref) return null;

  const trait: Record<string, unknown> = {};

  if (ref.gene) trait.gene = ref.gene;
  if (ref.genes) trait.genes = ref.genes;
  if (ref.variant) trait.variant = ref.variant;
  if (ref.inheritance) trait.inheritance = ref.inheritance;
  if (ref.risk_allele) trait.risk_allele = ref.risk_allele;

  for (const [compressedKey, value] of Object.entries(freq)) {
    if (value === undefined || value === null) continue;
    const expandedKey = FREQ_KEY_EXPANSION[compressedKey];
    if (expandedKey) {
      trait[expandedKey] = value;
    }
  }

  // Handle nested structures
  const freqAny = freq as Record<string, Record<string, unknown>>;
  if (freqAny.ADH1B) {
    trait.ADH1B = {
      allele_frequency_percent: freqAny.ADH1B.f,
      variant: freqAny.ADH1B.v || (ref as Record<string, Record<string, unknown>>).ADH1B?.variant
    };
  }
  if (freqAny.ALDH2) {
    trait.ALDH2 = {
      allele_frequency_percent: freqAny.ALDH2.f,
      variant: freqAny.ALDH2.v || (ref as Record<string, Record<string, unknown>>).ALDH2?.variant
    };
  }
  if (freqAny.snps) {
    trait.snps = {};
    for (const [snpId, snpData] of Object.entries(freqAny.snps)) {
      (trait.snps as Record<string, unknown>)[snpId] = {
        allele_frequency_percent: (snpData as Record<string, unknown>).f,
        risk_allele: (snpData as Record<string, unknown>).r
      };
    }
  }

  const phenotypeKey = (trait.inferred_phenotype as string) || 'unknown';
  const refAny = ref as Record<string, Record<string, unknown>>;
  const template = refAny.phenotype_templates?.[phenotypeKey] || refAny.phenotype_details || {};

  trait.phenotype_details = {
    name: (template as Record<string, unknown>).name || phenotypeKey,
    description: freq.desc || (template as Record<string, unknown>).description || '',
    dietary_impact: (template as Record<string, unknown>).dietary_impact || ''
  };

  if (ref.dietary_recommendation) {
    trait.dietary_recommendation = { ...(ref.dietary_recommendation as object) };
    if (freq.notes) {
      (trait.dietary_recommendation as Record<string, unknown>).notes = freq.notes;
    }
  } else {
    trait.dietary_recommendation = { notes: freq.notes || '' };
  }

  return trait;
}

function mergeGeneticsData(
  reference: { version?: string; traits: Record<string, Record<string, unknown>> },
  frequencies: { populations: Record<string, Record<string, Record<string, unknown>>> }
) {
  const cultures: Array<{ id: string; genetic_adaptations: Record<string, unknown> }> = [];

  for (const [populationId, popFreqs] of Object.entries(frequencies.populations)) {
    const genetic_adaptations: Record<string, unknown> = {};

    for (const [traitKey, freqData] of Object.entries(popFreqs)) {
      const refTrait = reference.traits[traitKey];
      const mergedTrait = buildTraitObject(refTrait || null, freqData);
      if (mergedTrait) {
        genetic_adaptations[traitKey] = mergedTrait;
      }
    }

    cultures.push({ id: populationId, genetic_adaptations });
  }

  return { version: reference.version, cultures };
}

// ============================================================================
// Public API
// ============================================================================

export async function loadData(): Promise<void> {
  const base = '/ancestral';
  const [geo, diet, geneticsRef, geneticsFreq, ancientRoots] = await Promise.all([
    fetch(`${base}/cultures.json`).then(r => r.json()),
    fetch(`${base}/diets.json`).then(r => r.json()),
    fetch(`${base}/genetics-reference.json`).then(r => r.json()),
    fetch(`${base}/genetics-frequencies.json`).then(r => r.json()),
    fetch(`${base}/ancient_roots_data.json`).then(r => r.json())
  ]);

  geoData = geo;
  dietData = diet;
  geneticsData = mergeGeneticsData(geneticsRef, geneticsFreq);
  ancientRootsData = (ancientRoots as { ancient_roots_data: Array<{ id: string; ancient_roots: AncientRootsEntry }> }).ancient_roots_data;
}

export function getGeoById(id: string): GeoEntry | undefined {
  return geoData?.cultures.find(c => c.id === id);
}

export function getDietById(id: string): DietEntry | undefined {
  const diet = dietData?.cultures.find(c => c.id === id);
  if (!diet) return undefined;
  const genetics = geneticsData?.cultures.find(c => c.id === id);
  if (genetics) {
    diet.genetic_adaptations = genetics.genetic_adaptations;
  }
  return diet;
}

export function getGeneticsById(id: string) {
  return geneticsData?.cultures.find(c => c.id === id);
}

export function getAncientRootsById(id: string): AncientRootsEntry | undefined {
  return ancientRootsData?.find(c => c.id === id)?.ancient_roots;
}

export function normalizeWeights(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  return sum > 0 ? weights.map(w => w / sum) : weights;
}

// ============================================================================
// NATIONALITY_TO_REGION mapping
// ============================================================================

export const NATIONALITY_TO_REGION: Record<string, Record<string, { name: string; regionId: string }>> = {
  'Africa': {
    'egyptian': { name: 'Egyptian', regionId: 'nile_valley' },
    'sudanese': { name: 'Sudanese', regionId: 'nile_valley' },
    'moroccan': { name: 'Moroccan', regionId: 'maghreb' },
    'algerian': { name: 'Algerian', regionId: 'maghreb' },
    'tunisian': { name: 'Tunisian', regionId: 'maghreb' },
    'libyan': { name: 'Libyan', regionId: 'maghreb' },
    'berber': { name: 'Berber/Amazigh', regionId: 'maghreb' },
    'nigerian': { name: 'Nigerian', regionId: 'west_africa' },
    'ghanaian': { name: 'Ghanaian', regionId: 'west_africa' },
    'senegalese': { name: 'Senegalese', regionId: 'west_africa' },
    'ivorian': { name: 'Ivorian', regionId: 'west_africa' },
    'guinean': { name: 'Guinean', regionId: 'west_africa' },
    'sierra_leonean': { name: 'Sierra Leonean', regionId: 'west_africa' },
    'liberian': { name: 'Liberian', regionId: 'west_africa' },
    'cape_verdean': { name: 'Cape Verdean', regionId: 'west_africa' },
    'malian': { name: 'Malian', regionId: 'sahel' },
    'nigerien': { name: 'Nigerien', regionId: 'sahel' },
    'chadian': { name: 'Chadian', regionId: 'sahel' },
    'burkinabe': { name: 'Burkinabé', regionId: 'sahel' },
    'ethiopian': { name: 'Ethiopian', regionId: 'ethiopia' },
    'eritrean': { name: 'Eritrean', regionId: 'ethiopia' },
    'somali': { name: 'Somali', regionId: 'horn_somalia' },
    'kenyan': { name: 'Kenyan', regionId: 'maasai' },
    'tanzanian': { name: 'Tanzanian', regionId: 'maasai' },
    'ugandan': { name: 'Ugandan', regionId: 'nilotic' },
    'rwandan': { name: 'Rwandan', regionId: 'nilotic' },
    'burundian': { name: 'Burundian', regionId: 'nilotic' },
    'south_sudanese': { name: 'South Sudanese', regionId: 'nilotic' },
    'congolese': { name: 'Congolese', regionId: 'central_africa' },
    'cameroonian': { name: 'Cameroonian', regionId: 'central_africa' },
    'gabonese': { name: 'Gabonese', regionId: 'central_africa' },
    'central_african': { name: 'Central African', regionId: 'sudanian' },
    'south_african': { name: 'South African', regionId: 'southern_africa' },
    'zimbabwean': { name: 'Zimbabwean', regionId: 'southern_africa' },
    'zambian': { name: 'Zambian', regionId: 'southern_africa' },
    'botswanan': { name: 'Botswanan', regionId: 'southern_africa' },
    'namibian': { name: 'Namibian', regionId: 'southern_africa' },
    'mozambican': { name: 'Mozambican', regionId: 'southern_africa' },
    'angolan': { name: 'Angolan', regionId: 'southern_africa' },
    'malawian': { name: 'Malawian', regionId: 'southern_africa' },
    'malagasy': { name: 'Malagasy', regionId: 'malagasy' },
    'mauritian': { name: 'Mauritian', regionId: 'southern_africa' }
  },
  'Europe': {
    'polish': { name: 'Polish', regionId: 'eastern_europe' },
    'ukrainian': { name: 'Ukrainian', regionId: 'eastern_europe' },
    'russian': { name: 'Russian', regionId: 'eastern_europe' },
    'belarusian': { name: 'Belarusian', regionId: 'eastern_europe' },
    'lithuanian': { name: 'Lithuanian', regionId: 'eastern_europe' },
    'latvian': { name: 'Latvian', regionId: 'eastern_europe' },
    'estonian': { name: 'Estonian', regionId: 'eastern_europe' },
    'german': { name: 'German', regionId: 'central_europe' },
    'austrian': { name: 'Austrian', regionId: 'central_europe' },
    'swiss': { name: 'Swiss', regionId: 'central_europe' },
    'czech': { name: 'Czech', regionId: 'central_europe' },
    'slovak': { name: 'Slovak', regionId: 'central_europe' },
    'hungarian': { name: 'Hungarian', regionId: 'central_europe' },
    'british': { name: 'British', regionId: 'western_europe' },
    'english': { name: 'English', regionId: 'western_europe' },
    'scottish': { name: 'Scottish', regionId: 'western_europe' },
    'welsh': { name: 'Welsh', regionId: 'western_europe' },
    'irish': { name: 'Irish', regionId: 'western_europe' },
    'french': { name: 'French', regionId: 'western_europe' },
    'dutch': { name: 'Dutch', regionId: 'western_europe' },
    'belgian': { name: 'Belgian', regionId: 'western_europe' },
    'swedish': { name: 'Swedish', regionId: 'nordic' },
    'norwegian': { name: 'Norwegian', regionId: 'nordic' },
    'danish': { name: 'Danish', regionId: 'nordic' },
    'finnish': { name: 'Finnish', regionId: 'nordic' },
    'icelandic': { name: 'Icelandic', regionId: 'nordic' },
    'sami': { name: 'Sámi', regionId: 'nordic' },
    'italian': { name: 'Italian', regionId: 'med_southern' },
    'greek': { name: 'Greek', regionId: 'med_southern' },
    'spanish': { name: 'Spanish', regionId: 'med_southern' },
    'portuguese': { name: 'Portuguese', regionId: 'med_southern' },
    'maltese': { name: 'Maltese', regionId: 'med_southern' },
    'cypriot': { name: 'Cypriot', regionId: 'med_southern' },
    'basque': { name: 'Basque', regionId: 'med_southern' },
    'catalan': { name: 'Catalan', regionId: 'med_southern' },
    'serbian': { name: 'Serbian', regionId: 'balkan' },
    'croatian': { name: 'Croatian', regionId: 'balkan' },
    'bosnian': { name: 'Bosnian', regionId: 'balkan' },
    'albanian': { name: 'Albanian', regionId: 'balkan' },
    'bulgarian': { name: 'Bulgarian', regionId: 'balkan' },
    'romanian': { name: 'Romanian', regionId: 'balkan' },
    'slovenian': { name: 'Slovenian', regionId: 'balkan' },
    'macedonian': { name: 'Macedonian', regionId: 'balkan' },
    'georgian': { name: 'Georgian', regionId: 'caucasus' },
    'armenian': { name: 'Armenian', regionId: 'caucasus' },
    'azerbaijani': { name: 'Azerbaijani', regionId: 'caucasus' },
    'ashkenazi_jewish': { name: 'Ashkenazi Jewish', regionId: 'eastern_europe' },
    'sephardic_jewish': { name: 'Sephardic Jewish', regionId: 'med_southern' },
    'mizrahi_jewish': { name: 'Mizrahi Jewish', regionId: 'med_levant' },
    'roma': { name: 'Roma/Romani', regionId: 'balkan' }
  },
  'Middle East': {
    'lebanese': { name: 'Lebanese', regionId: 'med_levant' },
    'syrian': { name: 'Syrian', regionId: 'med_levant' },
    'palestinian': { name: 'Palestinian', regionId: 'med_levant' },
    'jordanian': { name: 'Jordanian', regionId: 'med_levant' },
    'israeli': { name: 'Israeli', regionId: 'med_levant' },
    'iraqi': { name: 'Iraqi', regionId: 'mesopotamian' },
    'kurdish': { name: 'Kurdish', regionId: 'kurdish' },
    'turkish': { name: 'Turkish', regionId: 'anatolian' },
    'saudi': { name: 'Saudi', regionId: 'arabian' },
    'emirati': { name: 'Emirati', regionId: 'arabian' },
    'kuwaiti': { name: 'Kuwaiti', regionId: 'arabian' },
    'qatari': { name: 'Qatari', regionId: 'arabian' },
    'bahraini': { name: 'Bahraini', regionId: 'arabian' },
    'omani': { name: 'Omani', regionId: 'arabian' },
    'yemeni': { name: 'Yemeni', regionId: 'arabian' },
    'iranian': { name: 'Iranian', regionId: 'persian' },
    'afghan': { name: 'Afghan', regionId: 'persian' },
    'tajik': { name: 'Tajik', regionId: 'persian' }
  },
  'East Asia': {
    'japanese': { name: 'Japanese', regionId: 'japan' },
    'okinawan': { name: 'Okinawan', regionId: 'japan' },
    'ainu': { name: 'Ainu', regionId: 'japan' },
    'korean': { name: 'Korean', regionId: 'korea' },
    'chinese': { name: 'Chinese', regionId: 'north_china' },
    'northern_chinese': { name: 'Northern Chinese', regionId: 'north_china' },
    'cantonese': { name: 'Cantonese', regionId: 'south_china' },
    'southern_chinese': { name: 'Southern Chinese', regionId: 'south_china' },
    'fujianese': { name: 'Fujianese/Hokkien', regionId: 'south_china' },
    'hakka': { name: 'Hakka', regionId: 'south_china' },
    'hong_konger': { name: 'Hong Konger', regionId: 'south_china' },
    'taiwanese': { name: 'Taiwanese', regionId: 'south_china' },
    'sichuanese': { name: 'Sichuanese', regionId: 'sichuan_sw_china' },
    'tibetan': { name: 'Tibetan', regionId: 'tibet' },
    'uyghur': { name: 'Uyghur', regionId: 'central_asia' }
  },
  'Southeast Asia': {
    'thai': { name: 'Thai', regionId: 'se_asia_main' },
    'vietnamese': { name: 'Vietnamese', regionId: 'se_asia_main' },
    'cambodian': { name: 'Cambodian', regionId: 'se_asia_main' },
    'laotian': { name: 'Laotian', regionId: 'se_asia_main' },
    'burmese': { name: 'Burmese', regionId: 'se_asia_main' },
    'indonesian': { name: 'Indonesian', regionId: 'se_asia_island' },
    'javanese': { name: 'Javanese', regionId: 'se_asia_island' },
    'balinese': { name: 'Balinese', regionId: 'se_asia_island' },
    'filipino': { name: 'Filipino', regionId: 'se_asia_island' },
    'malaysian': { name: 'Malaysian', regionId: 'se_asia_island' },
    'singaporean': { name: 'Singaporean', regionId: 'se_asia_island' },
    'bruneian': { name: 'Bruneian', regionId: 'se_asia_island' },
    'east_timorese': { name: 'East Timorese', regionId: 'se_asia_island' },
    'hmong': { name: 'Hmong', regionId: 'highland_se_asia' },
    'karen': { name: 'Karen', regionId: 'highland_se_asia' }
  },
  'South Asia': {
    'indian': { name: 'Indian', regionId: 'north_india' },
    'north_indian': { name: 'North Indian', regionId: 'north_india' },
    'punjabi': { name: 'Punjabi', regionId: 'north_india' },
    'pakistani': { name: 'Pakistani', regionId: 'north_india' },
    'kashmiri': { name: 'Kashmiri', regionId: 'north_india' },
    'pashtun': { name: 'Pashtun', regionId: 'north_india' },
    'south_indian': { name: 'South Indian', regionId: 'south_india' },
    'tamil': { name: 'Tamil', regionId: 'south_india' },
    'telugu': { name: 'Telugu', regionId: 'south_india' },
    'malayali': { name: 'Malayali (Kerala)', regionId: 'south_india' },
    'kannada': { name: 'Kannada', regionId: 'south_india' },
    'sri_lankan': { name: 'Sri Lankan', regionId: 'south_india' },
    'gujarati': { name: 'Gujarati', regionId: 'west_india' },
    'maharashtrian': { name: 'Maharashtrian', regionId: 'west_india' },
    'goan': { name: 'Goan', regionId: 'west_india' },
    'bengali': { name: 'Bengali', regionId: 'bengal' },
    'bangladeshi': { name: 'Bangladeshi', regionId: 'bengal' },
    'nepali': { name: 'Nepali', regionId: 'nepal' },
    'bhutanese': { name: 'Bhutanese', regionId: 'nepal' },
    'maldivian': { name: 'Maldivian', regionId: 'south_india' }
  },
  'Central Asia': {
    'kazakh': { name: 'Kazakh', regionId: 'central_asia' },
    'kyrgyz': { name: 'Kyrgyz', regionId: 'central_asia' },
    'uzbek': { name: 'Uzbek', regionId: 'central_asia' },
    'turkmen': { name: 'Turkmen', regionId: 'central_asia' },
    'mongolian': { name: 'Mongolian', regionId: 'mongolia' },
    'siberian': { name: 'Siberian', regionId: 'siberia' },
    'yakut': { name: 'Yakut (Sakha)', regionId: 'siberia' },
    'buryat': { name: 'Buryat', regionId: 'siberia' }
  },
  'The Americas': {
    'inuit': { name: 'Inuit', regionId: 'inuit' },
    'yupik': { name: 'Yupik', regionId: 'inuit' },
    'haida': { name: 'Haida', regionId: 'pacific_nw' },
    'tlingit': { name: 'Tlingit', regionId: 'pacific_nw' },
    'salish': { name: 'Salish', regionId: 'pacific_nw' },
    'lakota': { name: 'Lakota/Sioux', regionId: 'great_plains' },
    'cheyenne': { name: 'Cheyenne', regionId: 'great_plains' },
    'blackfoot': { name: 'Blackfoot', regionId: 'great_plains' },
    'iroquois': { name: 'Iroquois', regionId: 'eastern_woodlands' },
    'cherokee': { name: 'Cherokee', regionId: 'eastern_woodlands' },
    'ojibwe': { name: 'Ojibwe', regionId: 'eastern_woodlands' },
    'navajo': { name: 'Navajo', regionId: 'southwest_us' },
    'pueblo': { name: 'Pueblo', regionId: 'southwest_us' },
    'apache': { name: 'Apache', regionId: 'southwest_us' },
    'cree': { name: 'Cree', regionId: 'subarctic' },
    'dene': { name: 'Dene', regionId: 'subarctic' },
    'maya': { name: 'Maya', regionId: 'mesoamerica' },
    'nahua': { name: 'Nahua/Aztec', regionId: 'mesoamerica' },
    'mexican': { name: 'Mexican', regionId: 'mestizo_mesoamerican' },
    'guatemalan': { name: 'Guatemalan', regionId: 'mestizo_mesoamerican' },
    'honduran': { name: 'Honduran', regionId: 'mestizo_mesoamerican' },
    'salvadoran': { name: 'Salvadoran', regionId: 'mestizo_mesoamerican' },
    'nicaraguan': { name: 'Nicaraguan', regionId: 'mestizo_mesoamerican' },
    'costa_rican': { name: 'Costa Rican', regionId: 'mestizo_mesoamerican' },
    'panamanian': { name: 'Panamanian', regionId: 'mestizo_mesoamerican' },
    'cuban': { name: 'Cuban', regionId: 'caribbean_creole' },
    'dominican': { name: 'Dominican', regionId: 'caribbean_creole' },
    'puerto_rican': { name: 'Puerto Rican', regionId: 'caribbean_creole' },
    'jamaican': { name: 'Jamaican', regionId: 'caribbean_creole' },
    'haitian': { name: 'Haitian', regionId: 'caribbean_creole' },
    'trinidadian': { name: 'Trinidadian', regionId: 'caribbean_creole' },
    'barbadian': { name: 'Barbadian', regionId: 'caribbean_creole' },
    'bahamian': { name: 'Bahamian', regionId: 'caribbean_creole' },
    'quechua': { name: 'Quechua', regionId: 'andean' },
    'aymara': { name: 'Aymara', regionId: 'andean' },
    'peruvian': { name: 'Peruvian', regionId: 'andean' },
    'bolivian': { name: 'Bolivian', regionId: 'andean' },
    'ecuadorian': { name: 'Ecuadorian', regionId: 'andean' },
    'colombian': { name: 'Colombian', regionId: 'andean' },
    'venezuelan': { name: 'Venezuelan', regionId: 'andean' },
    'chilean': { name: 'Chilean', regionId: 'patagonia' },
    'mapuche': { name: 'Mapuche', regionId: 'patagonia' },
    'argentine': { name: 'Argentine', regionId: 'gaucho' },
    'uruguayan': { name: 'Uruguayan', regionId: 'gaucho' },
    'paraguayan': { name: 'Paraguayan', regionId: 'gaucho' },
    'brazilian': { name: 'Brazilian', regionId: 'brazilian_coastal' },
    'guyanese': { name: 'Guyanese', regionId: 'amazon' },
    'surinamese': { name: 'Surinamese', regionId: 'amazon' },
    'american': { name: 'American', regionId: 'eastern_woodlands' },
    'african_american': { name: 'African American', regionId: 'southeast_us' },
    'cajun': { name: 'Cajun', regionId: 'southeast_us' },
    'canadian': { name: 'Canadian', regionId: 'canadian_prairies' },
    'quebecois': { name: 'Québécois', regionId: 'western_europe' },
    'metis': { name: 'Métis', regionId: 'subarctic' }
  },
  'Oceania': {
    'aboriginal_australian': { name: 'Aboriginal Australian', regionId: 'aboriginal_aus' },
    'torres_strait_islander': { name: 'Torres Strait Islander', regionId: 'aboriginal_aus' },
    'australian': { name: 'Australian', regionId: 'western_europe' },
    'new_zealander': { name: 'New Zealander', regionId: 'western_europe' },
    'maori': { name: 'Māori', regionId: 'maori' },
    'papua_new_guinean': { name: 'Papua New Guinean', regionId: 'melanesia' },
    'fijian': { name: 'Fijian', regionId: 'melanesia' },
    'solomon_islander': { name: 'Solomon Islander', regionId: 'melanesia' },
    'ni_vanuatu': { name: 'Ni-Vanuatu', regionId: 'melanesia' },
    'new_caledonian': { name: 'New Caledonian', regionId: 'melanesia' },
    'micronesian': { name: 'Micronesian', regionId: 'micronesia' },
    'chamorro': { name: 'Chamorro (Guam)', regionId: 'micronesia' },
    'palauan': { name: 'Palauan', regionId: 'micronesia' },
    'samoan': { name: 'Samoan', regionId: 'polynesia' },
    'tongan': { name: 'Tongan', regionId: 'polynesia' },
    'hawaiian': { name: 'Hawaiian', regionId: 'polynesia' },
    'tahitian': { name: 'Tahitian', regionId: 'polynesia' },
    'cook_islander': { name: 'Cook Islander', regionId: 'polynesia' }
  }
};

export function getNationalitiesGrouped(): NationalitiesGrouped {
  const grouped: NationalitiesGrouped = {};
  for (const [continent, nationalities] of Object.entries(NATIONALITY_TO_REGION)) {
    grouped[continent] = Object.entries(nationalities)
      .map(([id, data]) => ({ id, name: data.name, regionId: data.regionId } as NationalityEntry))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  return grouped;
}

export function getRegionIdFromNationality(nationalityId: string): string | null {
  if (getDietById(nationalityId)) return nationalityId;
  for (const nationalities of Object.values(NATIONALITY_TO_REGION)) {
    if (nationalities[nationalityId]) {
      return nationalities[nationalityId].regionId;
    }
  }
  return null;
}

export function getDisplayNameFromId(id: string): string {
  for (const nationalities of Object.values(NATIONALITY_TO_REGION)) {
    if (nationalities[id]) return nationalities[id].name;
  }
  const geo = getGeoById(id);
  return geo ? geo.name : id;
}
