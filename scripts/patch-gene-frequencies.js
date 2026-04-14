// scripts/patch-gene-frequencies.js
// Fills data gaps in genetics-frequencies.json:
// - cholesterol_metabolism (APOE ε4) to 36 missing pops
// - alcohol_metabolism (ADH1B) to 17 missing pops
// - vitamin_d_metabolism to 18 missing pops
// - pufa_metabolism (FADS1) to 5 missing pops
// - starch_digestion (AMY1) to 10 missing pops
// - altitude traits (altitude_adaptation + 3 subtypes) to relevant pops
// - pcsk9_protective to 5 more African pops
// - adh1b_african to 5 more African pops
// - bitter_taste (TAS2R38) to 62 missing pops
// - b12_metabolism (FUT2) to 65 missing pops
// Never overwrites existing values.

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'genetics-frequencies.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Helper: build a standard cholesterol_metabolism entry
function apoe(f, t, rs429, rs7412f, notes) {
  return {
    f,
    t,
    snps: {
      rs429358: { f: rs429, r: 'C' },
      rs7412: { f: rs7412f, r: 'T' },
    },
    notes,
  };
}

// Helper: build a standard alcohol_metabolism entry
function adh(adh1bF, p, variant, notes, aldh2F) {
  const entry = {
    p,
    t: 'standard',
    ADH1B: { f: adh1bF, v: variant },
    notes,
  };
  if (aldh2F !== undefined) entry.ALDH2 = { f: aldh2F, v: 'rs671' };
  return entry;
}

// Helper: build a vitamin_d_metabolism entry
function vitd(f, t, notes, desc) {
  const entry = { f, t, notes };
  if (desc) entry.desc = desc;
  return entry;
}

// Helper: build a pufa_metabolism entry
function pufa(f, p, t, notes) {
  return { f, p, t, notes };
}

// Helper: build a starch_digestion entry
function amy1(cn, t, notes) {
  return { cn, t, pc: 1, notes };
}

// Helper: build a bitter_taste entry
function bitter(f, t, notes) {
  const entry = { f, t };
  if (notes) entry.notes = notes;
  return entry;
}

// Helper: build a b12_metabolism entry
function b12(f) {
  return {
    f,
    t: 'secretor_status',
    notes: 'FUT2 secretor allele frequency; affects vitamin B12 absorption and gut microbiome composition',
  };
}

const PATCHES = {

  // ============================================================
  // 1. CHOLESTEROL_METABOLISM (APOE ε4) — 36 populations
  // ============================================================
  anatolian: {
    cholesterol_metabolism: apoe(14, 'moderate_apoe4', 8, 7, 'Moderate ε4; similar to Southern European baseline. Traditional Anatolian diet rich in olive oil, legumes, and vegetables.'),
  },
  arabian: {
    cholesterol_metabolism: apoe(12, 'moderate_apoe4', 7, 6, 'Lower ε4 in Arabian Peninsula populations. Traditional date, lean meat, and legume diet.'),
  },
  balkan: {
    cholesterol_metabolism: apoe(14, 'moderate_apoe4', 8, 7, 'Standard Southern European range. Mediterranean-influenced diet patterns may offer protection.'),
  },
  bengal: {
    cholesterol_metabolism: apoe(12, 'moderate_apoe4', 7, 5, 'South Asian average; ε2 slightly lower than European. Plant-rich traditional diet may mitigate risk.'),
  },
  brazilian_coastal: {
    cholesterol_metabolism: apoe(16, 'moderate_apoe4', 9, 7, 'Slightly elevated due to African admixture in this mixed population.'),
  },
  canadian_prairies: {
    cholesterol_metabolism: apoe(14, 'moderate_apoe4', 8, 7, 'Standard European-derived frequency. High-fat prairie diet may have metabolic implications.'),
  },
  caucasus: {
    cholesterol_metabolism: apoe(13, 'moderate_apoe4', 7, 7, 'Intermediate between European and Middle Eastern; moderate ε4 frequency.'),
  },
  central_asia: {
    cholesterol_metabolism: apoe(11, 'moderate_apoe4', 6, 5, 'Moderate ε4 reflecting partial East Asian ancestry. Traditional nomadic diet high in animal products.'),
  },
  central_europe: {
    cholesterol_metabolism: apoe(15, 'moderate_apoe4', 8, 8, 'Standard European level; ε2 carrier rate ~8%. Central European diet high in dairy and pork.'),
  },
  eastern_europe: {
    cholesterol_metabolism: apoe(14, 'moderate_apoe4', 8, 7, 'Standard Slavic/Eastern European range.'),
  },
  ethiopia: {
    cholesterol_metabolism: apoe(22, 'elevated_apoe4', 12, 8, 'Elevated ε4 consistent with East African gradient. Traditional high-fibre injera-based diet may be protective.'),
  },
  highland_se_asia: {
    cholesterol_metabolism: apoe(10, 'moderate_apoe4', 6, 5, 'Lower ε4 reflecting East/SE Asian baseline.'),
  },
  horn_somalia: {
    cholesterol_metabolism: apoe(22, 'elevated_apoe4', 12, 8, 'Elevated ε4 consistent with Horn of Africa populations. Traditional camel milk and lean meat diet.'),
  },
  japan: {
    cholesterol_metabolism: apoe(9, 'moderate_apoe4', 5, 4, 'Low ε4 frequency; among lowest globally. Traditional Japanese diet rich in fish and vegetables may further reduce cardiovascular risk.'),
  },
  korea: {
    cholesterol_metabolism: apoe(9, 'moderate_apoe4', 5, 4, 'Low ε4 consistent with East Asian range. High-vegetable and fermented food diet characteristic.'),
  },
  kurdish: {
    cholesterol_metabolism: apoe(14, 'moderate_apoe4', 8, 6, 'Standard Middle Eastern/Iranian Plateau range.'),
  },
  maasai: {
    cholesterol_metabolism: apoe(28, 'elevated_apoe4', 15, 8, 'Elevated ε4 consistent with East African pastoralist heritage. Traditional Maasai diet of blood, milk, and meat.'),
  },
  med_levant: {
    cholesterol_metabolism: apoe(13, 'moderate_apoe4', 7, 7, 'Moderate ε4 frequency. Mediterranean Levantine diet rich in olive oil, legumes, and vegetables.'),
  },
  med_southern: {
    cholesterol_metabolism: apoe(13, 'moderate_apoe4', 7, 7, 'Moderate ε4; Mediterranean diet historically protective against cardiovascular risk.'),
  },
  mongolia: {
    cholesterol_metabolism: apoe(9, 'moderate_apoe4', 5, 4, 'Lower ε4 in Mongolian steppe populations despite high-fat nomadic diet.'),
  },
  nepal: {
    cholesterol_metabolism: apoe(11, 'moderate_apoe4', 6, 5, 'Moderate ε4 reflecting South/East Asian blend. High-altitude traditional diet.'),
  },
  nordic: {
    cholesterol_metabolism: apoe(16, 'moderate_apoe4', 9, 8, 'Slightly elevated Northern European ε4. Traditional high-fat diet from fish and dairy.'),
  },
  north_china: {
    cholesterol_metabolism: apoe(8, 'moderate_apoe4', 5, 4, 'Very low ε4; among lowest globally. Northern Chinese agricultural diet rich in millet and wheat.'),
  },
  north_india: {
    cholesterol_metabolism: apoe(12, 'moderate_apoe4', 7, 6, 'Standard South Asian; Indo-Aryan heritage. Traditional vegetarian-heavy diet may be protective.'),
  },
  persian: {
    cholesterol_metabolism: apoe(13, 'moderate_apoe4', 7, 6, 'Standard Middle Eastern Iranian range. Traditional Persian diet rich in herbs and grains.'),
  },
  sahel: {
    cholesterol_metabolism: apoe(26, 'elevated_apoe4', 14, 8, 'Elevated ε4 consistent with Sahelian West African populations. Traditional millet and sorghum diet.'),
  },
  se_asia_island: {
    cholesterol_metabolism: apoe(10, 'moderate_apoe4', 6, 5, 'Moderate ε4 in Austronesian island populations.'),
  },
  se_asia_main: {
    cholesterol_metabolism: apoe(10, 'moderate_apoe4', 6, 5, 'Moderate ε4 in mainland Southeast Asian populations.'),
  },
  siberia: {
    cholesterol_metabolism: apoe(13, 'moderate_apoe4', 7, 6, 'Moderate ε4 in Siberian indigenous populations. Traditional high-fat reindeer-based diet.'),
  },
  sichuan_sw_china: {
    cholesterol_metabolism: apoe(8, 'moderate_apoe4', 5, 4, 'Low ε4 consistent with Chinese populations. Traditional Sichuan diet rich in vegetables and legumes.'),
  },
  south_china: {
    cholesterol_metabolism: apoe(8, 'moderate_apoe4', 5, 4, 'Low ε4; similar to other Chinese populations.'),
  },
  south_india: {
    cholesterol_metabolism: apoe(11, 'moderate_apoe4', 6, 6, 'Moderate ε4 in Dravidian South Indian populations. Traditional rice and legume diet.'),
  },
  southeast_us: {
    cholesterol_metabolism: apoe(15, 'moderate_apoe4', 8, 7, 'Moderate ε4 reflecting mixed European/African heritage in Southeast US.'),
  },
  tibet: {
    cholesterol_metabolism: apoe(9, 'moderate_apoe4', 5, 4, 'Low ε4 consistent with East Asian/Tibetan ancestry. Traditional high-fat barley and yak butter diet.'),
  },
  west_india: {
    cholesterol_metabolism: apoe(12, 'moderate_apoe4', 7, 6, 'Standard South Asian range. Traditional vegetarian diet may be protective.'),
  },
  western_europe: {
    cholesterol_metabolism: apoe(14, 'moderate_apoe4', 8, 8, 'Moderate ε4 frequency typical of Western European populations. Standard European baseline.'),
  },

  // ============================================================
  // 2. ALCOHOL_METABOLISM (ADH1B) — 17 populations
  // ============================================================
  // anatolian (already initialised above — add to same object below via merge logic)
  // arabian, bengal, etc. — added inline in their respective pop blocks above/below

  // ============================================================
  // 3. VITAMIN_D_METABOLISM — 18 populations
  // ============================================================

  // ============================================================
  // 4. PUFA_METABOLISM (FADS1) — 5 populations
  // ============================================================

  // ============================================================
  // (Traits 2-4 and the remaining traits for pops already in section 1
  //  are accumulated below in the per-population blocks)
  // ============================================================

};

// Build remaining patches per population (avoids duplicating pop keys)
const additionalPatches = {

  // --- A ---
  aboriginal_aus: {
    bitter_taste: bitter(55, 'taster'),
    b12_metabolism: b12(48),
  },
  amazon: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  andean: {
    altitude_adaptation: { f: 40, t: 'partial', desc: 'SENP1/ANP32D pathway — independent evolution from Tibetan', notes: 'Andean adaptation operates via SENP1 and ANP32D variants rather than EPAS1/EGLN1; independently evolved high-altitude response.' },
    altitude_adaptation_egln1: { f: 18, t: 'present', desc: 'Andean EGLN1 variant; independent from Tibetan PHD2 variant', notes: 'Andean EGLN1 variant at 15-20% contributes to altitude adaptation alongside SENP1/ANP32D; independently evolved.' },
    altitude_egln1: { f: 18, p: 0.18, t: 'altitude_adapted', notes: 'EGLN1 altitude adaptation in Andean populations; combined with SENP1/ANP32D pathway.' },
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  anatolian: {
    alcohol_metabolism: adh(10, 0.90, 'rs1229984', 'Slightly higher fast allele than Western Europe; standard metabolism predominates.'),
    vitamin_d_metabolism: vitd(99, 'light', 'High UV-efficiency skin pigmentation; adequate vitamin D at Middle Eastern latitudes.', 'Light skin pigmentation for vitamin D synthesis'),
    pufa_metabolism: pufa(70, 0.70, 'efficient', 'Efficient ALA→EPA/DHA conversion; consistent with Mediterranean/Middle Eastern ancestry.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(46),
  },
  arabian: {
    alcohol_metabolism: adh(6, 0.94, 'rs1229984', 'Low fast ADH1B allele; standard metabolism. Cultural prohibition may have historically reduced selection pressure.'),
    vitamin_d_metabolism: vitd(98, 'light', 'Very high VDR-efficiency; high sun exposure across Arabian Peninsula.', 'Light skin pigmentation; high UV environment'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(46),
  },
  australian_coastal: {
    starch_digestion: amy1(5.8, 'moderate', 'AMY1 copies: 5.8 (2024 pangenome study). Coastal hunter-gatherer ancestry pattern.'),
    bitter_taste: bitter(55, 'taster'),
    b12_metabolism: b12(48),
  },

  // --- B ---
  balkan: {
    alcohol_metabolism: adh(12, 0.88, 'rs1229984', 'Standard alcohol metabolism; traditional culture includes moderate wine and rakija consumption.'),
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(48),
  },
  bengal: {
    alcohol_metabolism: adh(18, 0.82, 'rs1229984', 'Moderately elevated fast ADH1B allele; South Asian pattern. Standard metabolism predominates.'),
    vitamin_d_metabolism: vitd(68, 'dark', 'Dark skin reduces vitamin D synthesis; dietary sources important despite moderate UV.'),
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(46),
  },
  brazilian_coastal: {
    alcohol_metabolism: adh(8, 0.92, 'rs1229984', 'Admixed; predominantly standard alcohol metabolism.'),
    vitamin_d_metabolism: vitd(35, 'dark', 'Admixed population with significant dark pigmentation component; higher dietary vitamin D needs especially in southern regions.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(48),
  },

  // --- C ---
  california_coast: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  canadian_prairies: {
    alcohol_metabolism: adh(5, 0.95, 'rs1229984', 'Predominantly European-derived; normal alcohol metabolism.'),
    vitamin_d_metabolism: vitd(95, 'light', 'Predominantly European heritage; winter supplementation recommended at high prairie latitude.', 'Light skin pigmentation for high-latitude vitamin D synthesis'),
    bitter_taste: bitter(48, 'taster'),
    b12_metabolism: b12(48),
  },
  caribbean_creole: {
    starch_digestion: amy1(6.5, 'moderate', 'AMY1 copies: 6.5 (2024 pangenome study). Mixed agricultural/hunter-gatherer heritage.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(48),
  },
  caribbean_taino: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  caucasus: {
    alcohol_metabolism: adh(10, 0.90, 'rs1229984', 'Standard alcohol metabolism in Caucasian populations; moderate fast allele.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(46),
  },
  central_africa: {
    pcsk9_protective: { f: 2, p: 0.02, t: 'cardioprotective', desc: 'PCSK9 loss-of-function variant', notes: 'PCSK9 loss-of-function variant at ~2% in Central African populations; provides LDL reduction.' },
    adh1b_african: { f: 10 },
    bitter_taste: bitter(48, 'diverse', 'High TAS2R38 haplotype diversity typical of Central African populations.'),
    b12_metabolism: b12(48),
  },
  central_asia: {
    alcohol_metabolism: adh(20, 0.80, 'rs1229984', 'Elevated fast ADH1B allele reflecting partial East Asian heritage; standard metabolism predominates.'),
    vitamin_d_metabolism: vitd(72, 'medium', 'Central Asian populations show intermediate skin pigmentation; seasonal UV variation in continental climate.'),
    bitter_taste: bitter(60, 'taster'),
    b12_metabolism: b12(46),
  },
  central_europe: {
    alcohol_metabolism: adh(5, 0.95, 'rs1229984', 'Standard alcohol metabolism typical of Central European populations.'),
    bitter_taste: bitter(48, 'taster'),
    b12_metabolism: b12(48),
  },

  // --- E ---
  eastern_europe: {
    alcohol_metabolism: adh(5, 0.95, 'rs1229984', 'Standard alcohol metabolism; Eastern European pattern.'),
    pufa_metabolism: pufa(50, 0.50, 'moderate', 'Moderate conversion efficiency; mix of plant and marine omega-3 sources optimal.'),
    bitter_taste: bitter(48, 'taster'),
    b12_metabolism: b12(48),
  },
  eastern_woodlands: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  ethiopia: {
    altitude_adaptation: { f: 18, t: 'partial', desc: 'Partial altitude adaptation in highland Ethiopian populations', notes: 'Ethiopian highland populations (Amhara, Oromo) show limited altitude adaptation; BRINP3 variant contributes. Less pronounced than Andean/Tibetan.' },
    altitude_adaptation_egln1: { f: 12, t: 'present', notes: 'EGLN1 variant in Ethiopian highland populations; partial altitude adaptation mechanism.' },
    altitude_egln1: { f: 12, p: 0.12, t: 'altitude_adapted', notes: 'EGLN1 altitude adaptation in Ethiopian highland populations; partial adaptation mechanism.' },
    bitter_taste: bitter(48, 'diverse', 'Sub-Saharan African TAS2R38 diversity pattern.'),
    b12_metabolism: b12(48),
  },

  // --- G ---
  gaucho: {
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(48),
  },
  great_plains: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },

  // --- H ---
  highland_se_asia: {
    alcohol_metabolism: adh(65, 0.877, 'rs1229984', 'Fast alcohol metabolism provides some protection; fermented foods well-tolerated.'),
    vitamin_d_metabolism: vitd(38, 'dark', 'SE Asian skin tone; dietary vitamin D needs elevated with moderate UV exposure.'),
    bitter_taste: bitter(60, 'taster'),
    b12_metabolism: b12(50),
  },
  horn_somalia: {
    pcsk9_protective: { f: 1, p: 0.01, t: 'cardioprotective', desc: 'PCSK9 loss-of-function variant', notes: 'PCSK9 loss-of-function variant at ~1% in Somali/Horn of Africa populations.' },
    adh1b_african: { f: 7 },
    bitter_taste: bitter(48, 'diverse', 'Horn of Africa TAS2R38 diversity pattern.'),
    b12_metabolism: b12(48),
  },

  // --- I ---
  inuit: {
    bitter_taste: bitter(55, 'taster'),
    b12_metabolism: b12(44),
  },

  // --- J ---
  japan: {
    vitamin_d_metabolism: vitd(55, 'medium', 'Moderate vitamin D synthesis capacity; traditional Japanese diet rich in oily fish (salmon, mackerel, sardines) provides substantial dietary vitamin D.', 'Moderate skin pigmentation; adequate UV at Japanese latitudes'),
    bitter_taste: bitter(65, 'taster', '64-66% PAV (taster) haplotype in East Asian populations.'),
    b12_metabolism: b12(52),
  },

  // --- K ---
  korea: {
    vitamin_d_metabolism: vitd(52, 'medium', 'Moderate skin pigmentation; adequate UV at most Korean latitudes. Fermented foods and fish provide some dietary vitamin D.'),
    bitter_taste: bitter(65, 'taster'),
    b12_metabolism: b12(52),
  },
  kurdish: {
    alcohol_metabolism: adh(10, 0.90, 'rs1229984', 'Standard alcohol metabolism in Kurdish/Iranian Plateau populations.'),
    vitamin_d_metabolism: vitd(88, 'light', 'Kurdish/Middle Eastern populations show predominantly light skin; high sun exposure in Middle East provides adequate vitamin D.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(46),
  },

  // --- M ---
  maasai: {
    alcohol_metabolism: adh(12, 0.88, 'rs2066702', 'African ADH1B variant (rs2066702); standard alcohol metabolism.'),
    bitter_taste: bitter(48, 'diverse', 'East African TAS2R38 diversity consistent with Sub-Saharan African pattern.'),
    b12_metabolism: b12(48),
  },
  maghreb: {
    starch_digestion: amy1(7.0, 'high', 'AMY1 copies: 7.0 (2024 pangenome study). North African Berber agricultural ancestry pattern.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(46),
  },
  malagasy: {
    starch_digestion: amy1(6.5, 'moderate', 'AMY1 copies: 6.5 (2024 pangenome study). Mixed SE Asian/African ancestry pattern.'),
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(50),
  },
  maori: {
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(50),
  },
  med_levant: {
    alcohol_metabolism: adh(8, 0.92, 'rs1229984', 'Standard alcohol metabolism in Levantine populations.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(46),
  },
  med_southern: {
    alcohol_metabolism: adh(10, 0.90, 'rs1229984', 'Standard alcohol metabolism; Mediterranean populations with moderate fast allele.'),
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(46),
  },
  melanesia: {
    starch_digestion: amy1(6.0, 'moderate', 'AMY1 copies: 6.0 (2024 pangenome study). Tropical horticulture ancestry pattern.'),
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(50),
  },
  mesoamerica: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  mesopotamian: {
    starch_digestion: amy1(7.5, 'high', 'AMY1 copies: 7.5 (2024 pangenome study). Fertile Crescent — origin of cereal agriculture.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(46),
  },
  mestizo_mesoamerican: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(46),
  },
  micronesia: {
    starch_digestion: amy1(5.8, 'moderate', 'AMY1 copies: 5.8 (2024 pangenome study). Island horticulture/fishing ancestry pattern.'),
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(50),
  },
  mongolia: {
    vitamin_d_metabolism: vitd(50, 'medium', 'Moderate skin pigmentation; low winter UV at high latitude. Traditional fermented dairy (airag) provides some vitamin D.'),
    bitter_taste: bitter(62, 'taster'),
    b12_metabolism: b12(52),
  },

  // --- N ---
  nepal: {
    alcohol_metabolism: adh(22, 0.78, 'rs1229984', 'Elevated fast ADH1B allele in Himalayan populations with South/East Asian admixture; standard metabolism predominates.'),
    vitamin_d_metabolism: vitd(62, 'medium', 'Intermediate skin pigmentation; intense high-altitude UV compensates. Traditional diet includes ghee and dairy.'),
    altitude_adaptation: { f: 55, t: 'present', desc: 'EGLN1-dominated altitude adaptation; partial EPAS1 overlap in Sherpa', notes: 'Sherpa populations show strong altitude adaptation primarily via EGLN1; partial EPAS1 Denisovan introgression in some highland subpopulations.' },
    altitude_adaptation_epas1: { f: 38, t: 'present', notes: 'Partial EPAS1 Denisovan-derived variant shared with Sherpa populations; less prevalent than Tibet (76%).' },
    altitude_adaptation_egln1: { f: 60, t: 'present', desc: 'EGLN1 PHD2 variant in highland Nepalese', notes: 'EGLN1 altitude adaptation at 60% in Sherpa/highland Nepalese; works in concert with EPAS1.' },
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(46),
  },
  nile_valley: {
    starch_digestion: amy1(7.5, 'high', 'AMY1 copies: 7.5 (2024 pangenome study). Ancient Egyptian agricultural tradition.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(48),
  },
  nilotic: {
    starch_digestion: amy1(5.5, 'moderate', 'AMY1 copies: 5.5 (2024 pangenome study). Pastoral/mixed Nilotic ancestry pattern.'),
    pcsk9_protective: { f: 2, p: 0.02, t: 'cardioprotective', desc: 'PCSK9 loss-of-function variant', notes: 'PCSK9 loss-of-function variant at ~2% in East African Nilotic populations.' },
    adh1b_african: { f: 9 },
    bitter_taste: bitter(48, 'diverse', 'East African/Nilotic TAS2R38 diversity pattern.'),
    b12_metabolism: b12(48),
  },
  nordic: {
    bitter_taste: bitter(48, 'taster'),
    b12_metabolism: b12(48),
  },
  north_china: {
    alcohol_metabolism: adh(65, 0.35, 'rs1229984', 'ALDH2 deficiency causes acetaldehyde buildup; elevated cancer risk with alcohol consumption.'),
    vitamin_d_metabolism: vitd(55, 'medium', 'Northern Chinese populations show moderate skin pigmentation; traditional grain-based diet low in vitamin D — fish and eggs are primary sources.'),
    pufa_metabolism: pufa(48, 0.48, 'moderate', 'Moderate conversion efficiency; traditional northern Chinese diet benefits from direct marine omega-3 sources.'),
    bitter_taste: bitter(65, 'taster', '64-66% PAV (taster) haplotype consistent with East Asian populations.'),
    b12_metabolism: b12(52),
  },
  north_india: {
    alcohol_metabolism: adh(16, 0.84, 'rs1229984', 'Moderately elevated fast ADH1B allele; standard metabolism predominates.'),
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(46),
  },

  // --- P ---
  pacific_nw: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  patagonia: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  persian: {
    alcohol_metabolism: adh(12, 0.88, 'rs1229984', 'Standard alcohol metabolism in Iranian populations; moderate fast allele.'),
    vitamin_d_metabolism: vitd(97, 'light', 'Light skin pigmentation typical of Iranian populations; high sun exposure provides adequate vitamin D.', 'Light skin; high UV in Iranian plateau'),
    pufa_metabolism: pufa(62, 0.62, 'moderate', 'Moderate-high FADS1 conversion efficiency; traditional Persian diet includes walnuts and oily fish.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(46),
  },
  polynesia: {
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(50),
  },

  // --- S ---
  sahel: {
    pcsk9_protective: { f: 2, p: 0.02, t: 'cardioprotective', desc: 'PCSK9 loss-of-function variant', notes: 'PCSK9 loss-of-function variant at ~2% in Sahelian populations; similar to West African frequency.' },
    adh1b_african: { f: 11 },
    bitter_taste: bitter(48, 'diverse', 'Sahelian/West African TAS2R38 diversity pattern.'),
    b12_metabolism: b12(48),
  },
  se_asia_island: {
    alcohol_metabolism: adh(35, 0.65, 'rs1229984', 'ALDH2 deficiency present in island SE Asian populations; acetaldehyde buildup risk.'),
    vitamin_d_metabolism: vitd(35, 'dark', 'Island SE Asian populations have darker skin pigmentation. High equatorial UV largely compensates; vitamin D generally adequate.'),
    bitter_taste: bitter(60, 'taster'),
    b12_metabolism: b12(50),
  },
  se_asia_main: {
    alcohol_metabolism: adh(40, 0.60, 'rs1229984', 'Elevated ADH1B fast allele with some ALDH2 deficiency; mainland SE Asian pattern.'),
    vitamin_d_metabolism: vitd(40, 'dark', 'Mainland SE Asian populations. Tropical UV levels generally maintain adequate vitamin D despite darker skin.'),
    bitter_taste: bitter(60, 'taster'),
    b12_metabolism: b12(50),
  },
  siberia: {
    alcohol_metabolism: adh(30, 0.70, 'rs1229984', 'Elevated fast ADH1B allele from East Asian heritage; standard metabolism predominates in most Siberian populations.'),
    vitamin_d_metabolism: vitd(42, 'dark', 'Siberian indigenous populations; extreme UV seasonality — traditional diet of fish, seal, and reindeer liver provides critical dietary vitamin D.'),
    bitter_taste: bitter(62, 'taster'),
    b12_metabolism: b12(52),
  },
  sichuan_sw_china: {
    vitamin_d_metabolism: vitd(52, 'medium', 'Moderate skin pigmentation; persistent cloud cover in Sichuan basin may reduce effective UV exposure.'),
    bitter_taste: bitter(62, 'taster'),
    b12_metabolism: b12(52),
  },
  south_china: {
    vitamin_d_metabolism: vitd(45, 'dark', 'Southern Chinese populations; moderately dark skin at tropical latitudes. Higher UV in southern China.'),
    bitter_taste: bitter(62, 'taster'),
    b12_metabolism: b12(52),
  },
  south_india: {
    alcohol_metabolism: adh(12, 0.88, 'rs1229984', 'Standard South Indian range; moderate fast ADH1B allele.'),
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(46),
  },
  southeast_us: {
    alcohol_metabolism: adh(5, 0.95, 'rs1229984', 'Predominantly European-derived; normal alcohol metabolism.'),
    vitamin_d_metabolism: vitd(55, 'medium', 'Mixed European/African heritage; high UV in Southern states.', 'Mixed heritage; high-UV southern latitude'),
    pufa_metabolism: pufa(55, 0.55, 'moderate', 'Moderate conversion efficiency; mixed European/African ancestry.'),
    bitter_taste: bitter(50, 'taster'),
    b12_metabolism: b12(48),
  },
  southern_africa: {
    pcsk9_protective: { f: 1, p: 0.01, t: 'cardioprotective', desc: 'PCSK9 loss-of-function variant', notes: 'PCSK9 loss-of-function variant at ~1% in Khoisan/Bantu Southern African populations.' },
    adh1b_african: { f: 8 },
    bitter_taste: bitter(48, 'diverse', 'Southern African TAS2R38 diversity pattern; Khoisan show highest global diversity.'),
    b12_metabolism: b12(48),
  },
  southwest_us: {
    bitter_taste: bitter(52, 'taster'),
    b12_metabolism: b12(44),
  },
  subarctic: {
    bitter_taste: bitter(55, 'taster'),
    b12_metabolism: b12(44),
  },
  sudanian: {
    starch_digestion: amy1(7.0, 'high', 'AMY1 copies: 7.0 (2024 pangenome study). Sudanian savanna agricultural ancestry pattern.'),
    bitter_taste: bitter(48, 'diverse', 'Sudanian/West African TAS2R38 diversity pattern.'),
    b12_metabolism: b12(48),
  },

  // --- T ---
  tibet: {
    altitude_adaptation: { f: 74, t: 'present', desc: 'Combined EPAS1+EGLN1 altitude adaptation package', notes: 'Strongest known altitude adaptation; EPAS1 (76%) from Denisovan introgression + EGLN1 (71%) PHD2 variant. Supports barley and yak-butter-based high-altitude diet.' },
    vitamin_d_metabolism: vitd(42, 'dark', 'Tibetans have dark skin for UV protection at extreme altitude. Traditional diet includes yak butter providing dietary vitamin D.'),
    bitter_taste: bitter(62, 'taster'),
    b12_metabolism: b12(52),
  },

  // --- W ---
  west_africa: {
    bitter_taste: bitter(45, 'diverse', 'Highest TAS2R38 haplotype diversity globally; unique AAI intermediate haplotype at 19-23%.'),
    b12_metabolism: b12(48),
  },
  west_india: {
    alcohol_metabolism: adh(14, 0.86, 'rs1229984', 'Standard alcohol metabolism; slightly elevated fast allele in Western Indian populations.'),
    vitamin_d_metabolism: vitd(68, 'medium', 'Western Indian populations (Gujarat, Rajasthan) show intermediate to light South Asian skin; high regional UV.'),
    bitter_taste: bitter(58, 'taster'),
    b12_metabolism: b12(46),
  },
  western_europe: {
    alcohol_metabolism: adh(4, 0.96, 'rs1229984', 'Low fast ADH1B allele; standard European pattern. Normal alcohol metabolism.'),
    pufa_metabolism: pufa(52, 0.52, 'moderate', 'Moderate FADS1 conversion efficiency consistent with Northern/Western European range.', 'Moderate G allele (~52%). Mixed conversion efficiency.'),
    bitter_taste: bitter(48, 'taster'),
    // b12_metabolism already exists for western_europe
  },

};

// Merge additionalPatches into PATCHES
for (const [popId, traits] of Object.entries(additionalPatches)) {
  if (!PATCHES[popId]) {
    PATCHES[popId] = {};
  }
  Object.assign(PATCHES[popId], traits);
}

// Fix north_china alcohol_metabolism — should be aldh2_deficient like japan/korea/south_china
// (overwrite the helper-built standard entry with correct aldh2_deficient structure)
PATCHES['north_china'].alcohol_metabolism = {
  p: 0.328,
  t: 'aldh2_deficient',
  ADH1B: { f: 65, v: 'rs1229984' },
  ALDH2: { f: 20, v: 'rs671' },
  notes: 'ALDH2 deficiency causes acetaldehyde buildup; elevated cancer risk with alcohol consumption.',
};

// se_asia_island / se_asia_main — also have partial ALDH2 deficiency
PATCHES['se_asia_island'].alcohol_metabolism = {
  p: 0.438,
  t: 'aldh2_deficient',
  ADH1B: { f: 35, v: 'rs1229984' },
  ALDH2: { f: 12, v: 'rs671' },
  notes: 'Partial ALDH2 deficiency in island SE Asian populations; reduced alcohol tolerance.',
};
PATCHES['se_asia_main'].alcohol_metabolism = {
  p: 0.36,
  t: 'aldh2_deficient',
  ADH1B: { f: 40, v: 'rs1229984' },
  ALDH2: { f: 15, v: 'rs671' },
  notes: 'ALDH2 deficiency present in mainland SE Asian populations; acetaldehyde buildup risk with alcohol.',
};

// highland_se_asia already has alcohol_metabolism in existing data — this will be skipped by no-overwrite logic
// but we added it in additionalPatches as fast_protective; let's correct the structure to match existing pattern
PATCHES['highland_se_asia'].alcohol_metabolism = {
  p: 0.877,
  t: 'fast_protective',
  ADH1B: { f: 65, v: 'rs1229984' },
  ALDH2: { f: 15, v: 'rs671' },
  notes: 'Fast alcohol metabolism provides some protection; fermented foods well-tolerated.',
};

// Apply all patches
let added = 0;
let skipped = 0;
const log = [];

for (const [popId, traits] of Object.entries(PATCHES)) {
  if (!data.populations[popId]) {
    console.warn(`WARNING: Population not found: ${popId}`);
    continue;
  }
  for (const [traitKey, entry] of Object.entries(traits)) {
    if (data.populations[popId][traitKey] !== undefined) {
      skipped++;
      continue;
    }
    data.populations[popId][traitKey] = entry;
    added++;
    log.push(`  + ${popId}.${traitKey}`);
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

console.log(`\nDone.`);
console.log(`  Added:   ${added} new trait entries`);
console.log(`  Skipped: ${skipped} (already existed)`);
console.log(`\nNew entries added:`);
log.sort().forEach(l => console.log(l));
