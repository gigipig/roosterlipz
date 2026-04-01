/**
 * Migration script: Add new genetics research batches (19 Feb 2026)
 * Batches 1-6: Fasting/Metabolic, Antioxidant, Thermic, Protein/Muscle,
 *              Gut Microbiome, Longevity
 * Run: node scripts/add-batches-19feb26.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const refPath = path.join(ROOT, 'genetics-reference.json');
const freqPath = path.join(ROOT, 'genetics-frequencies.json');

console.log('Reading files...');
const ref = JSON.parse(fs.readFileSync(refPath, 'utf8'));
const freq = JSON.parse(fs.readFileSync(freqPath, 'utf8'));

// ============================================================
// BATCH 1: Fasting & Metabolic Flexibility
// ============================================================

// SIRT1 rs7895833 — A allele frequency (enhanced fasting/longevity)
const SIRT1 = {
  aboriginal_aus:55, amazon:62, anatolian:72, andean:63, arabian:75,
  australian_coastal:55, balkan:78, bengal:58, brazilian_coastal:65,
  california_coast:62, canadian_prairies:65, caribbean_creole:72,
  caribbean_taino:65, caucasus:78, central_africa:80, central_asia:65,
  central_europe:79, eastern_europe:79, eastern_woodlands:64, ethiopia:78,
  gaucho:67, great_plains:64, highland_se_asia:40, horn_somalia:75,
  inuit:55, japan:29, korea:29, kurdish:73, maasai:78, maghreb:76,
  malagasy:70, maori:50, med_levant:75, med_southern:74, melanesia:55,
  mesoamerica:62, mesopotamian:74, mestizo_mesoamerican:61, micronesia:50,
  mongolia:35, nepal:50, nile_valley:77, nilotic:78, nordic:79,
  north_china:35, north_india:60, pacific_nw:60, patagonia:63, persian:73,
  polynesia:48, sahel:79, se_asia_island:42, se_asia_main:40, siberia:38,
  sichuan_sw_china:33, south_china:32, south_india:58, southeast_us:75,
  southern_africa:78, southwest_us:63, subarctic:55, sudanian:79, tibet:40,
  west_africa:80, west_india:59, western_europe:80
};

// PPARGC1A rs8192678 — G/Gly allele frequency (metabolic flexibility)
const PPARGC1A = {
  aboriginal_aus:55, amazon:72, anatolian:67, andean:72, arabian:69,
  australian_coastal:55, balkan:67, bengal:69, brazilian_coastal:71,
  california_coast:70, canadian_prairies:68, caribbean_creole:78,
  caribbean_taino:72, caucasus:67, central_africa:95, central_asia:65,
  central_europe:66, eastern_europe:70, eastern_woodlands:70, ethiopia:93,
  gaucho:68, great_plains:70, highland_se_asia:57, horn_somalia:90,
  inuit:58, japan:52, korea:57, kurdish:68, maasai:94, maghreb:72,
  malagasy:75, maori:48, med_levant:67, med_southern:63, melanesia:52,
  mesoamerica:72, mesopotamian:68, mestizo_mesoamerican:72, micronesia:50,
  mongolia:58, nepal:63, nile_valley:92, nilotic:94, nordic:66,
  north_china:63, north_india:72, pacific_nw:68, patagonia:70, persian:69,
  polynesia:46, sahel:95, se_asia_island:55, se_asia_main:57, siberia:55,
  sichuan_sw_china:56, south_china:55, south_india:71, southeast_us:80,
  southern_africa:94, southwest_us:72, subarctic:60, sudanian:95, tibet:58,
  west_africa:96, west_india:72, western_europe:65
};

// FOXO3 rs2802292 — G allele frequency (longevity/fasting response)
const FOXO3 = {
  aboriginal_aus:45, amazon:50, anatolian:42, andean:48, arabian:44,
  australian_coastal:45, balkan:40, bengal:37, brazilian_coastal:50,
  california_coast:45, canadian_prairies:44, caribbean_creole:58,
  caribbean_taino:48, caucasus:42, central_africa:73, central_asia:35,
  central_europe:37, eastern_europe:43, eastern_woodlands:44, ethiopia:70,
  gaucho:48, great_plains:44, highland_se_asia:30, horn_somalia:65,
  inuit:25, japan:27, korea:25, kurdish:43, maasai:72, maghreb:50,
  malagasy:55, maori:30, med_levant:42, med_southern:38, melanesia:40,
  mesoamerica:47, mesopotamian:43, mestizo_mesoamerican:47, micronesia:35,
  mongolia:27, nepal:33, nile_valley:68, nilotic:72, nordic:40,
  north_china:28, north_india:38, pacific_nw:43, patagonia:48, persian:43,
  polynesia:28, sahel:73, se_asia_island:36, se_asia_main:33, siberia:22,
  sichuan_sw_china:30, south_china:33, south_india:37, southeast_us:60,
  southern_africa:72, southwest_us:47, subarctic:28, sudanian:73, tibet:26,
  west_africa:73, west_india:38, western_europe:36
};

// ============================================================
// BATCH 2: Antioxidant Capacity
// ============================================================

// SOD2 rs4880 — C/Ala allele frequency (mitochondrial antioxidant)
const SOD2 = {
  aboriginal_aus:25, amazon:59, anatolian:47, andean:59, arabian:48,
  australian_coastal:25, balkan:50, bengal:52, brazilian_coastal:48,
  california_coast:54, canadian_prairies:52, caribbean_creole:45,
  caribbean_taino:55, caucasus:47, central_africa:43, central_asia:35,
  central_europe:50, eastern_europe:53, eastern_woodlands:54, ethiopia:43,
  gaucho:52, great_plains:54, highland_se_asia:15, horn_somalia:43,
  inuit:25, japan:12, korea:12, kurdish:45, maasai:43, maghreb:44,
  malagasy:30, maori:18, med_levant:45, med_southern:49, melanesia:22,
  mesoamerica:56, mesopotamian:45, mestizo_mesoamerican:61, micronesia:17,
  mongolia:14, nepal:35, nile_valley:43, nilotic:43, nordic:46,
  north_china:13, north_india:52, pacific_nw:54, patagonia:59, persian:45,
  polynesia:18, sahel:43, se_asia_island:15, se_asia_main:15, siberia:40,
  sichuan_sw_china:13, south_china:13, south_india:52, southeast_us:48,
  southern_africa:43, southwest_us:55, subarctic:35, sudanian:43, tibet:14,
  west_africa:43, west_india:52, western_europe:50
};

// CAT rs1001179 — T allele frequency (catalase/hydrogen peroxide defense)
const CAT = {
  aboriginal_aus:5, amazon:10, anatolian:19, andean:10, arabian:18,
  australian_coastal:5, balkan:22, bengal:12, brazilian_coastal:16,
  california_coast:10, canadian_prairies:18, caribbean_creole:14,
  caribbean_taino:10, caucasus:19, central_africa:8, central_asia:12,
  central_europe:22, eastern_europe:22, eastern_woodlands:10, ethiopia:8,
  gaucho:19, great_plains:10, highland_se_asia:3, horn_somalia:8,
  inuit:5, japan:3, korea:3, kurdish:17, maasai:8, maghreb:14,
  malagasy:6, maori:5, med_levant:17, med_southern:22, melanesia:5,
  mesoamerica:10, mesopotamian:17, mestizo_mesoamerican:15, micronesia:4,
  mongolia:5, nepal:8, nile_valley:10, nilotic:8, nordic:26,
  north_china:3, north_india:12, pacific_nw:10, patagonia:10, persian:17,
  polynesia:5, sahel:8, se_asia_island:3, se_asia_main:2, siberia:15,
  sichuan_sw_china:3, south_china:3, south_india:12, southeast_us:16,
  southern_africa:8, southwest_us:15, subarctic:8, sudanian:8, tibet:3,
  west_africa:8, west_india:12, western_europe:22
};

// GPX1 rs1050450 — C/Pro allele frequency (glutathione peroxidase)
const GPX1 = {
  aboriginal_aus:80, amazon:85, anatolian:68, andean:85, arabian:72,
  australian_coastal:80, balkan:69, bengal:76, brazilian_coastal:73,
  california_coast:84, canadian_prairies:74, caribbean_creole:70,
  caribbean_taino:84, caucasus:69, central_africa:71, central_asia:78,
  central_europe:69, eastern_europe:68, eastern_woodlands:84, ethiopia:71,
  gaucho:71, great_plains:84, highland_se_asia:90, horn_somalia:71,
  inuit:90, japan:93, korea:92, kurdish:68, maasai:71, maghreb:70,
  malagasy:78, maori:82, med_levant:68, med_southern:69, melanesia:80,
  mesoamerica:85, mesopotamian:68, mestizo_mesoamerican:84, micronesia:85,
  mongolia:93, nepal:83, nile_valley:70, nilotic:71, nordic:65,
  north_china:94, north_india:76, pacific_nw:84, patagonia:85, persian:68,
  polynesia:82, sahel:71, se_asia_island:90, se_asia_main:93, siberia:72,
  sichuan_sw_china:94, south_china:94, south_india:76, southeast_us:70,
  southern_africa:71, southwest_us:78, subarctic:80, sudanian:71, tibet:93,
  west_africa:71, west_india:76, western_europe:68
};

// NFE2L2 rs6721961 — C allele frequency (NRF2 antioxidant master regulator)
const NFE2L2 = {
  aboriginal_aus:78, amazon:82, anatolian:88, andean:82, arabian:93,
  australian_coastal:78, balkan:88, bengal:85, brazilian_coastal:88,
  california_coast:82, canadian_prairies:86, caribbean_creole:90,
  caribbean_taino:82, caucasus:88, central_africa:94, central_asia:82,
  central_europe:88, eastern_europe:85, eastern_woodlands:82, ethiopia:94,
  gaucho:87, great_plains:82, highland_se_asia:76, horn_somalia:93,
  inuit:78, japan:74, korea:70, kurdish:88, maasai:94, maghreb:90,
  malagasy:86, maori:78, med_levant:88, med_southern:88, melanesia:78,
  mesoamerica:82, mesopotamian:88, mestizo_mesoamerican:86, micronesia:76,
  mongolia:73, nepal:80, nile_valley:93, nilotic:94, nordic:83,
  north_china:73, north_india:85, pacific_nw:82, patagonia:82, persian:88,
  polynesia:78, sahel:94, se_asia_island:76, se_asia_main:77, siberia:81,
  sichuan_sw_china:73, south_china:73, south_india:85, southeast_us:88,
  southern_africa:94, southwest_us:86, subarctic:80, sudanian:94, tibet:73,
  west_africa:94, west_india:85, western_europe:90
};

// GSTP1 rs1695 — A/Ile allele frequency (glutathione S-transferase)
const GSTP1 = {
  aboriginal_aus:75, amazon:55, anatolian:71, andean:50, arabian:72,
  australian_coastal:75, balkan:67, bengal:73, brazilian_coastal:60,
  california_coast:60, canadian_prairies:65, caribbean_creole:60,
  caribbean_taino:60, caucasus:71, central_africa:52, central_asia:72,
  central_europe:67, eastern_europe:69, eastern_woodlands:60, ethiopia:55,
  gaucho:64, great_plains:60, highland_se_asia:78, horn_somalia:55,
  inuit:70, japan:86, korea:81, kurdish:72, maasai:50, maghreb:65,
  malagasy:62, maori:75, med_levant:72, med_southern:69, melanesia:75,
  mesoamerica:56, mesopotamian:72, mestizo_mesoamerican:53, micronesia:76,
  mongolia:80, nepal:75, nile_valley:58, nilotic:50, nordic:72,
  north_china:82, north_india:73, pacific_nw:60, patagonia:50, persian:72,
  polynesia:77, sahel:50, se_asia_island:78, se_asia_main:76, siberia:65,
  sichuan_sw_china:82, south_china:82, south_india:73, southeast_us:62,
  southern_africa:50, southwest_us:62, subarctic:65, sudanian:50, tibet:80,
  west_africa:50, west_india:73, western_europe:67
};

// ============================================================
// BATCH 3: Thermic Effect & Metabolism
// ============================================================

// UCP1 rs1800592 — A allele frequency (brown fat thermogenesis)
const UCP1 = {
  aboriginal_aus:33, amazon:58, anatolian:73.5, andean:60, arabian:70,
  australian_coastal:33, balkan:75, bengal:61, brazilian_coastal:53,
  california_coast:64, canadian_prairies:66, caribbean_creole:49,
  caribbean_taino:58, caucasus:74, central_africa:25, central_asia:60,
  central_europe:76, eastern_europe:73, eastern_woodlands:65, ethiopia:46,
  gaucho:68, great_plains:65, highland_se_asia:48, horn_somalia:53,
  inuit:52, japan:51, korea:52, kurdish:72, maasai:28, maghreb:65,
  malagasy:37, maori:45, med_levant:72, med_southern:75, melanesia:33,
  mesoamerica:62, mesopotamian:72, mestizo_mesoamerican:56, micronesia:45,
  mongolia:52, nepal:58, nile_valley:54, nilotic:28, nordic:77,
  north_china:52, north_india:63, pacific_nw:65, patagonia:58, persian:72,
  polynesia:45, sahel:25, se_asia_island:50, se_asia_main:48, siberia:44,
  sichuan_sw_china:52, south_china:53, south_india:59, southeast_us:56,
  southern_africa:25, southwest_us:65, subarctic:54, sudanian:24, tibet:53,
  west_africa:24, west_india:62, western_europe:76
};

// UCP2 rs659366 — A allele frequency (metabolic rate)
const UCP2 = {
  aboriginal_aus:38, amazon:50, anatolian:37, andean:49, arabian:38,
  australian_coastal:38, balkan:36, bengal:42, brazilian_coastal:38,
  california_coast:50, canadian_prairies:42, caribbean_creole:38,
  caribbean_taino:50, caucasus:37, central_africa:35, central_asia:44,
  central_europe:38, eastern_europe:37, eastern_woodlands:50, ethiopia:37,
  gaucho:40, great_plains:50, highland_se_asia:48, horn_somalia:37,
  inuit:49, japan:54, korea:52, kurdish:38, maasai:37, maghreb:37,
  malagasy:41, maori:46, med_levant:38, med_southern:35, melanesia:38,
  mesoamerica:50, mesopotamian:38, mestizo_mesoamerican:47, micronesia:45,
  mongolia:52, nepal:44, nile_valley:37, nilotic:37, nordic:38,
  north_china:52, north_india:40, pacific_nw:50, patagonia:50, persian:38,
  polynesia:46, sahel:36, se_asia_island:49, se_asia_main:48, siberia:48,
  sichuan_sw_china:49, south_china:51, south_india:39, southeast_us:37,
  southern_africa:35, southwest_us:50, subarctic:49, sudanian:35, tibet:48,
  west_africa:35, west_india:39, western_europe:38
};

// UCP3 rs1800849 — T allele frequency (muscle thermogenesis)
const UCP3 = {
  aboriginal_aus:15, amazon:26, anatolian:22, andean:25, arabian:22,
  australian_coastal:15, balkan:21, bengal:24, brazilian_coastal:17,
  california_coast:26, canadian_prairies:22, caribbean_creole:17,
  caribbean_taino:26, caucasus:21, central_africa:10, central_asia:23,
  central_europe:21, eastern_europe:21, eastern_woodlands:26, ethiopia:16,
  gaucho:21, great_plains:26, highland_se_asia:23, horn_somalia:18,
  inuit:37, japan:24, korea:24, kurdish:22, maasai:12, maghreb:19,
  malagasy:17, maori:22, med_levant:22, med_southern:22, melanesia:15,
  mesoamerica:26, mesopotamian:22, mestizo_mesoamerican:24, micronesia:21,
  mongolia:24, nepal:24, nile_valley:18, nilotic:12, nordic:21,
  north_china:24, north_india:24, pacific_nw:26, patagonia:26, persian:22,
  polynesia:22, sahel:11, se_asia_island:24, se_asia_main:23, siberia:45,
  sichuan_sw_china:24, south_china:24, south_india:23, southeast_us:18,
  southern_africa:10, southwest_us:26, subarctic:36, sudanian:10, tibet:24,
  west_africa:10, west_india:23, western_europe:22
};

// DIO2 rs225014 — T/Thr92 allele frequency (thyroid hormone conversion)
const DIO2 = {
  aboriginal_aus:55, amazon:70, anatolian:60, andean:65, arabian:58,
  australian_coastal:55, balkan:61, bengal:63, brazilian_coastal:57,
  california_coast:70, canadian_prairies:66, caribbean_creole:57,
  caribbean_taino:70, caucasus:60, central_africa:49, central_asia:71,
  central_europe:62, eastern_europe:60, eastern_woodlands:70, ethiopia:54,
  gaucho:62, great_plains:70, highland_se_asia:84, horn_somalia:55,
  inuit:76, japan:86, korea:85, kurdish:58, maasai:48, maghreb:56,
  malagasy:61, maori:78, med_levant:58, med_southern:62, melanesia:55,
  mesoamerica:70, mesopotamian:58, mestizo_mesoamerican:66, micronesia:76,
  mongolia:84, nepal:73, nile_valley:55, nilotic:48, nordic:58,
  north_china:85, north_india:66, pacific_nw:70, patagonia:70, persian:58,
  polynesia:78, sahel:50, se_asia_island:84, se_asia_main:84, siberia:80,
  sichuan_sw_china:84, south_china:84, south_india:66, southeast_us:57,
  southern_africa:49, southwest_us:70, subarctic:75, sudanian:49, tibet:81,
  west_africa:49, west_india:66, western_europe:61
};

// TRPM8 rs10166942 — T allele frequency (cold tolerance)
const TRPM8 = {
  aboriginal_aus:10, amazon:45, anatolian:71, andean:50, arabian:60,
  australian_coastal:10, balkan:80, bengal:52, brazilian_coastal:47,
  california_coast:50, canadian_prairies:63, caribbean_creole:40,
  caribbean_taino:45, caucasus:73, central_africa:5, central_asia:46,
  central_europe:82, eastern_europe:84, eastern_woodlands:55, ethiopia:29,
  gaucho:68, great_plains:55, highland_se_asia:30, horn_somalia:37,
  inuit:58, japan:45, korea:42, kurdish:60, maasai:7, maghreb:44,
  malagasy:18, maori:26, med_levant:60, med_southern:82, melanesia:10,
  mesoamerica:55, mesopotamian:60, mestizo_mesoamerican:58, micronesia:25,
  mongolia:45, nepal:43, nile_valley:42, nilotic:7, nordic:87,
  north_china:39, north_india:55, pacific_nw:55, patagonia:55, persian:60,
  polynesia:26, sahel:5, se_asia_island:32, se_asia_main:30, siberia:60,
  sichuan_sw_china:33, south_china:36, south_india:38, southeast_us:52,
  southern_africa:4, southwest_us:55, subarctic:58, sudanian:5, tibet:38,
  west_africa:5, west_india:53, western_europe:81
};

// ============================================================
// BATCH 4: Protein & Muscle
// ============================================================

// ACTN3 rs1815739 — C/R allele frequency (power muscle fiber)
const ACTN3 = {
  aboriginal_aus:80, amazon:32, anatolian:55, andean:34, arabian:54,
  australian_coastal:80, balkan:57, bengal:40, brazilian_coastal:58,
  california_coast:38, canadian_prairies:45, caribbean_creole:83,
  caribbean_taino:53, caucasus:58, central_africa:88, central_asia:52,
  central_europe:57, eastern_europe:60, eastern_woodlands:48, ethiopia:77,
  gaucho:40, great_plains:45, highland_se_asia:55, horn_somalia:82,
  inuit:35, japan:47, korea:55, kurdish:55, maasai:90, maghreb:65,
  malagasy:68, maori:40, med_levant:55, med_southern:57, melanesia:80,
  mesoamerica:35, mesopotamian:54, mestizo_mesoamerican:38, micronesia:55,
  mongolia:52, nepal:45, nile_valley:72, nilotic:88, nordic:55,
  north_china:55, north_india:43, pacific_nw:42, patagonia:33, persian:56,
  polynesia:34, sahel:88, se_asia_island:56, se_asia_main:54, siberia:52,
  sichuan_sw_china:55, south_china:55, south_india:42, southeast_us:65,
  southern_africa:90, southwest_us:42, subarctic:38, sudanian:90, tibet:50,
  west_africa:93, west_india:42, western_europe:57
};

// IL6 rs1800795 — C allele frequency (lower inflammation, faster recovery)
const IL6 = {
  aboriginal_aus:1, amazon:12, anatolian:28, andean:10, arabian:20,
  australian_coastal:1, balkan:42, bengal:14, brazilian_coastal:28,
  california_coast:12, canadian_prairies:18, caribbean_creole:8,
  caribbean_taino:22, caucasus:32, central_africa:2, central_asia:12,
  central_europe:43, eastern_europe:45, eastern_woodlands:25, ethiopia:5,
  gaucho:20, great_plains:25, highland_se_asia:1, horn_somalia:4,
  inuit:20, japan:0, korea:0, kurdish:22, maasai:2, maghreb:12,
  malagasy:2, maori:8, med_levant:26, med_southern:42, melanesia:1,
  mesoamerica:8, mesopotamian:20, mestizo_mesoamerican:15, micronesia:2,
  mongolia:3, nepal:7, nile_valley:8, nilotic:2, nordic:49,
  north_china:0, north_india:16, pacific_nw:20, patagonia:10, persian:22,
  polynesia:17, sahel:3, se_asia_island:1, se_asia_main:1, siberia:26,
  sichuan_sw_china:0, south_china:0, south_india:14, southeast_us:30,
  southern_africa:2, southwest_us:18, subarctic:22, sudanian:2, tibet:2,
  west_africa:2, west_india:16, western_europe:43
};

// IGF1 rs35767 — A allele frequency (growth factor/muscle development)
const IGF1 = {
  aboriginal_aus:38, amazon:20, anatolian:20, andean:18, arabian:19,
  australian_coastal:38, balkan:16, bengal:25, brazilian_coastal:25,
  california_coast:22, canadian_prairies:20, caribbean_creole:40,
  caribbean_taino:28, caucasus:22, central_africa:45, central_asia:20,
  central_europe:16, eastern_europe:16, eastern_woodlands:20, ethiopia:40,
  gaucho:22, great_plains:20, highland_se_asia:35, horn_somalia:38,
  inuit:18, japan:36, korea:33, kurdish:20, maasai:45, maghreb:30,
  malagasy:38, maori:25, med_levant:19, med_southern:16, melanesia:38,
  mesoamerica:22, mesopotamian:19, mestizo_mesoamerican:23, micronesia:30,
  mongolia:30, nepal:30, nile_valley:35, nilotic:45, nordic:15,
  north_china:37, north_india:25, pacific_nw:20, patagonia:20, persian:19,
  polynesia:25, sahel:42, se_asia_island:35, se_asia_main:37, siberia:17,
  sichuan_sw_china:36, south_china:37, south_india:25, southeast_us:22,
  southern_africa:45, southwest_us:23, subarctic:18, sudanian:44, tibet:32,
  west_africa:45, west_india:25, western_europe:16
};

// VEGFA rs2010963 — G allele frequency (circulation/oxygen delivery)
const VEGFA = {
  aboriginal_aus:65, amazon:63, anatolian:61, andean:63, arabian:55,
  australian_coastal:65, balkan:68, bengal:73, brazilian_coastal:68,
  california_coast:63, canadian_prairies:64, caribbean_creole:68,
  caribbean_taino:66, caucasus:65, central_africa:68, central_asia:62,
  central_europe:69, eastern_europe:70, eastern_woodlands:64, ethiopia:67,
  gaucho:66, great_plains:64, highland_se_asia:59, horn_somalia:67,
  inuit:62, japan:57, korea:56, kurdish:58, maasai:68, maghreb:62,
  malagasy:64, maori:62, med_levant:58, med_southern:69, melanesia:65,
  mesoamerica:63, mesopotamian:61, mestizo_mesoamerican:65, micronesia:62,
  mongolia:60, nepal:68, nile_valley:66, nilotic:68, nordic:73,
  north_china:58, north_india:73, pacific_nw:64, patagonia:63, persian:52,
  polynesia:62, sahel:67, se_asia_island:59, se_asia_main:61, siberia:73,
  sichuan_sw_china:58, south_china:58, south_india:82, southeast_us:68,
  southern_africa:68, southwest_us:65, subarctic:66, sudanian:68, tibet:62,
  west_africa:68, west_india:73, western_europe:68
};

// ============================================================
// BATCH 5: Gut Microbiome (format already matches frequencies.json)
// f = phenotype frequency %, t = phenotype template
// ============================================================

const FUT2_SECRETOR = {
  aboriginal_aus:{f:2,t:'non_secretor'}, amazon:{f:2,t:'non_secretor'},
  anatolian:{f:24,t:'non_secretor'}, andean:{f:3,t:'non_secretor'},
  arabian:{f:25,t:'non_secretor'}, australian_coastal:{f:24,t:'non_secretor'},
  balkan:{f:22,t:'non_secretor'}, bengal:{f:25,t:'non_secretor'},
  brazilian_coastal:{f:19,t:'non_secretor'}, california_coast:{f:3,t:'non_secretor'},
  canadian_prairies:{f:19,t:'non_secretor'}, caribbean_creole:{f:22,t:'non_secretor'},
  caribbean_taino:{f:3,t:'non_secretor'}, caucasus:{f:22,t:'non_secretor'},
  central_africa:{f:24,t:'non_secretor'}, central_asia:{f:20,t:'non_secretor'},
  central_europe:{f:23,t:'non_secretor'}, eastern_europe:{f:21,t:'non_secretor'},
  eastern_woodlands:{f:3,t:'non_secretor'}, ethiopia:{f:22,t:'non_secretor'},
  gaucho:{f:19,t:'non_secretor'}, great_plains:{f:3,t:'non_secretor'},
  highland_se_asia:{f:17,t:'non_secretor'}, horn_somalia:{f:22,t:'non_secretor'},
  inuit:{f:1,t:'non_secretor'}, japan:{f:18,t:'non_secretor'},
  korea:{f:18,t:'non_secretor'}, kurdish:{f:24,t:'non_secretor'},
  maasai:{f:23,t:'non_secretor'}, maghreb:{f:23,t:'non_secretor'},
  malagasy:{f:17,t:'non_secretor'}, maori:{f:18,t:'non_secretor'},
  med_levant:{f:23,t:'non_secretor'}, med_southern:{f:23,t:'non_secretor'},
  melanesia:{f:15,t:'non_secretor'}, mesoamerica:{f:3,t:'non_secretor'},
  mesopotamian:{f:25,t:'non_secretor'}, mestizo_mesoamerican:{f:12,t:'non_secretor'},
  micronesia:{f:15,t:'non_secretor'}, mongolia:{f:18,t:'non_secretor'},
  nepal:{f:18,t:'non_secretor'}, nile_valley:{f:24,t:'non_secretor'},
  nilotic:{f:25,t:'non_secretor'}, nordic:{f:17,t:'non_secretor'},
  north_china:{f:20,t:'non_secretor'}, north_india:{f:20,t:'non_secretor'},
  pacific_nw:{f:3,t:'non_secretor'}, patagonia:{f:2,t:'non_secretor'},
  persian:{f:24,t:'non_secretor'}, polynesia:{f:18,t:'non_secretor'},
  sahel:{f:24,t:'non_secretor'}, se_asia_island:{f:17,t:'non_secretor'},
  se_asia_main:{f:18,t:'non_secretor'}, siberia:{f:22,t:'non_secretor'},
  sichuan_sw_china:{f:18,t:'non_secretor'}, south_china:{f:20,t:'non_secretor'},
  south_india:{f:20,t:'non_secretor'}, southeast_us:{f:21,t:'non_secretor'},
  southern_africa:{f:23,t:'non_secretor'}, southwest_us:{f:15,t:'non_secretor'},
  subarctic:{f:2,t:'non_secretor'}, sudanian:{f:25,t:'non_secretor'},
  tibet:{f:17,t:'non_secretor'}, west_africa:{f:25,t:'non_secretor'},
  west_india:{f:20,t:'non_secretor'}, western_europe:{f:24,t:'non_secretor'}
};

const MUC2 = {
  aboriginal_aus:{f:55,t:'strong_barrier'}, amazon:{f:28,t:'strong_barrier'},
  anatolian:{f:26,t:'strong_barrier'}, andean:{f:26,t:'strong_barrier'},
  arabian:{f:26,t:'strong_barrier'}, australian_coastal:{f:24,t:'strong_barrier'},
  balkan:{f:24,t:'strong_barrier'}, bengal:{f:30,t:'strong_barrier'},
  brazilian_coastal:{f:33,t:'strong_barrier'}, california_coast:{f:30,t:'strong_barrier'},
  canadian_prairies:{f:25,t:'strong_barrier'}, caribbean_creole:{f:44,t:'strong_barrier'},
  caribbean_taino:{f:31,t:'strong_barrier'}, caucasus:{f:26,t:'strong_barrier'},
  central_africa:{f:60,t:'strong_barrier'}, central_asia:{f:39,t:'strong_barrier'},
  central_europe:{f:24,t:'strong_barrier'}, eastern_europe:{f:24,t:'strong_barrier'},
  eastern_woodlands:{f:30,t:'strong_barrier'}, ethiopia:{f:48,t:'strong_barrier'},
  gaucho:{f:26,t:'strong_barrier'}, great_plains:{f:30,t:'strong_barrier'},
  highland_se_asia:{f:58,t:'strong_barrier'}, horn_somalia:{f:48,t:'strong_barrier'},
  inuit:{f:58,t:'strong_barrier'}, japan:{f:72,t:'strong_barrier'},
  korea:{f:70,t:'strong_barrier'}, kurdish:{f:26,t:'strong_barrier'},
  maasai:{f:55,t:'strong_barrier'}, maghreb:{f:39,t:'strong_barrier'},
  malagasy:{f:66,t:'strong_barrier'}, maori:{f:64,t:'strong_barrier'},
  med_levant:{f:26,t:'strong_barrier'}, med_southern:{f:24,t:'strong_barrier'},
  melanesia:{f:58,t:'strong_barrier'}, mesoamerica:{f:28,t:'strong_barrier'},
  mesopotamian:{f:26,t:'strong_barrier'}, mestizo_mesoamerican:{f:22,t:'strong_barrier'},
  micronesia:{f:62,t:'strong_barrier'}, mongolia:{f:70,t:'strong_barrier'},
  nepal:{f:39,t:'strong_barrier'}, nile_valley:{f:44,t:'strong_barrier'},
  nilotic:{f:58,t:'strong_barrier'}, nordic:{f:24,t:'strong_barrier'},
  north_china:{f:70,t:'strong_barrier'}, north_india:{f:31,t:'strong_barrier'},
  pacific_nw:{f:28,t:'strong_barrier'}, patagonia:{f:26,t:'strong_barrier'},
  persian:{f:26,t:'strong_barrier'}, polynesia:{f:64,t:'strong_barrier'},
  sahel:{f:60,t:'strong_barrier'}, se_asia_island:{f:62,t:'strong_barrier'},
  se_asia_main:{f:64,t:'strong_barrier'}, siberia:{f:58,t:'strong_barrier'},
  sichuan_sw_china:{f:68,t:'strong_barrier'}, south_china:{f:68,t:'strong_barrier'},
  south_india:{f:31,t:'strong_barrier'}, southeast_us:{f:29,t:'strong_barrier'},
  southern_africa:{f:60,t:'strong_barrier'}, southwest_us:{f:24,t:'strong_barrier'},
  subarctic:{f:30,t:'strong_barrier'}, sudanian:{f:62,t:'strong_barrier'},
  tibet:{f:66,t:'strong_barrier'}, west_africa:{f:62,t:'strong_barrier'},
  west_india:{f:31,t:'strong_barrier'}, western_europe:{f:24,t:'strong_barrier'}
};

const TLR4 = {
  aboriginal_aus:{f:1,t:'balanced_tolerance'}, amazon:{f:0,t:'balanced_tolerance'},
  anatolian:{f:10,t:'balanced_tolerance'}, andean:{f:0,t:'balanced_tolerance'},
  arabian:{f:9,t:'balanced_tolerance'}, australian_coastal:{f:12,t:'balanced_tolerance'},
  balkan:{f:12,t:'balanced_tolerance'}, bengal:{f:21,t:'balanced_tolerance'},
  brazilian_coastal:{f:9,t:'balanced_tolerance'}, california_coast:{f:1,t:'balanced_tolerance'},
  canadian_prairies:{f:4,t:'balanced_tolerance'}, caribbean_creole:{f:12,t:'balanced_tolerance'},
  caribbean_taino:{f:3,t:'balanced_tolerance'}, caucasus:{f:10,t:'balanced_tolerance'},
  central_africa:{f:15,t:'balanced_tolerance'}, central_asia:{f:6,t:'balanced_tolerance'},
  central_europe:{f:12,t:'balanced_tolerance'}, eastern_europe:{f:12,t:'balanced_tolerance'},
  eastern_woodlands:{f:1,t:'balanced_tolerance'}, ethiopia:{f:12,t:'balanced_tolerance'},
  gaucho:{f:10,t:'balanced_tolerance'}, great_plains:{f:1,t:'balanced_tolerance'},
  highland_se_asia:{f:1,t:'balanced_tolerance'}, horn_somalia:{f:10,t:'balanced_tolerance'},
  inuit:{f:0,t:'balanced_tolerance'}, japan:{f:0,t:'balanced_tolerance'},
  korea:{f:0,t:'balanced_tolerance'}, kurdish:{f:9,t:'balanced_tolerance'},
  maasai:{f:14,t:'balanced_tolerance'}, maghreb:{f:10,t:'balanced_tolerance'},
  malagasy:{f:7,t:'balanced_tolerance'}, maori:{f:1,t:'balanced_tolerance'},
  med_levant:{f:10,t:'balanced_tolerance'}, med_southern:{f:11,t:'balanced_tolerance'},
  melanesia:{f:1,t:'balanced_tolerance'}, mesoamerica:{f:0,t:'balanced_tolerance'},
  mesopotamian:{f:9,t:'balanced_tolerance'}, mestizo_mesoamerican:{f:7,t:'balanced_tolerance'},
  micronesia:{f:1,t:'balanced_tolerance'}, mongolia:{f:0,t:'balanced_tolerance'},
  nepal:{f:17,t:'balanced_tolerance'}, nile_valley:{f:13,t:'balanced_tolerance'},
  nilotic:{f:14,t:'balanced_tolerance'}, nordic:{f:13,t:'balanced_tolerance'},
  north_china:{f:0,t:'balanced_tolerance'}, north_india:{f:21,t:'balanced_tolerance'},
  pacific_nw:{f:1,t:'balanced_tolerance'}, patagonia:{f:0,t:'balanced_tolerance'},
  persian:{f:10,t:'balanced_tolerance'}, polynesia:{f:1,t:'balanced_tolerance'},
  sahel:{f:16,t:'balanced_tolerance'}, se_asia_island:{f:1,t:'balanced_tolerance'},
  se_asia_main:{f:1,t:'balanced_tolerance'}, siberia:{f:1,t:'balanced_tolerance'},
  sichuan_sw_china:{f:0,t:'balanced_tolerance'}, south_china:{f:0,t:'balanced_tolerance'},
  south_india:{f:21,t:'balanced_tolerance'}, southeast_us:{f:12,t:'balanced_tolerance'},
  southern_africa:{f:13,t:'balanced_tolerance'}, southwest_us:{f:6,t:'balanced_tolerance'},
  subarctic:{f:1,t:'balanced_tolerance'}, sudanian:{f:14,t:'balanced_tolerance'},
  tibet:{f:1,t:'balanced_tolerance'}, west_africa:{f:15,t:'balanced_tolerance'},
  west_india:{f:20,t:'balanced_tolerance'}, western_europe:{f:12,t:'balanced_tolerance'}
};

// ============================================================
// BATCH 6: Longevity (from batch6_frequencies.json)
// ============================================================

const BATCH6 = {
  aboriginal_aus:{tert:45,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:12,cetp_t:'longevity_lipids',e2:5,e4:26,apoe_t:'efficient_absorption'},
  amazon:{tert:40,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:10,cetp_t:'standard_lipids',e2:0,e4:18,apoe_t:'efficient_absorption'},
  anatolian:{tert:50,tert_t:'enhanced_maintenance',kl:12,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:6,e4:10,apoe_t:'balanced_metabolism'},
  andean:{tert:42,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:0,e4:15,apoe_t:'efficient_absorption'},
  arabian:{tert:48,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:10,cetp_t:'longevity_lipids',e2:5,e4:7,apoe_t:'balanced_metabolism'},
  australian_coastal:{tert:52,tert_t:'enhanced_maintenance',kl:15,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:8,e4:15,apoe_t:'balanced_metabolism'},
  balkan:{tert:51,tert_t:'enhanced_maintenance',kl:14,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:7,e4:12,apoe_t:'balanced_metabolism'},
  bengal:{tert:46,tert_t:'enhanced_maintenance',kl:10,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:4,e4:10,apoe_t:'balanced_metabolism'},
  brazilian_coastal:{tert:49,tert_t:'enhanced_maintenance',kl:11,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:6,e4:14,apoe_t:'balanced_metabolism'},
  california_coast:{tert:41,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:0,e4:20,apoe_t:'efficient_absorption'},
  canadian_prairies:{tert:50,tert_t:'enhanced_maintenance',kl:10,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:5,e4:14,apoe_t:'balanced_metabolism'},
  caribbean_creole:{tert:50,tert_t:'enhanced_maintenance',kl:12,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:9,e4:18,apoe_t:'balanced_metabolism'},
  caribbean_taino:{tert:42,tert_t:'standard_maintenance',kl:2,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:0,e4:16,apoe_t:'efficient_absorption'},
  caucasus:{tert:51,tert_t:'enhanced_maintenance',kl:13,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:6,e4:11,apoe_t:'balanced_metabolism'},
  central_africa:{tert:47,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:13,cetp_t:'longevity_lipids',e2:11,e4:25,apoe_t:'efficient_absorption'},
  central_asia:{tert:47,tert_t:'enhanced_maintenance',kl:6,kl_t:'standard_klotho',cetp:10,cetp_t:'standard_lipids',e2:5,e4:12,apoe_t:'balanced_metabolism'},
  central_europe:{tert:52,tert_t:'enhanced_maintenance',kl:15,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:8,e4:14,apoe_t:'balanced_metabolism'},
  eastern_europe:{tert:51,tert_t:'enhanced_maintenance',kl:14,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:7,e4:13,apoe_t:'balanced_metabolism'},
  eastern_woodlands:{tert:41,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:0,e4:18,apoe_t:'efficient_absorption'},
  ethiopia:{tert:48,tert_t:'enhanced_maintenance',kl:10,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:8,e4:18,apoe_t:'efficient_absorption'},
  gaucho:{tert:50,tert_t:'enhanced_maintenance',kl:12,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:6,e4:12,apoe_t:'balanced_metabolism'},
  great_plains:{tert:41,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:0,e4:20,apoe_t:'efficient_absorption'},
  highland_se_asia:{tert:44,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:6,e4:10,apoe_t:'balanced_metabolism'},
  horn_somalia:{tert:48,tert_t:'enhanced_maintenance',kl:9,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:8,e4:17,apoe_t:'efficient_absorption'},
  inuit:{tert:40,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:7,cetp_t:'standard_lipids',e2:0,e4:22,apoe_t:'efficient_absorption'},
  japan:{tert:43,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:4,e4:10,apoe_t:'balanced_metabolism'},
  korea:{tert:43,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:4,e4:10,apoe_t:'balanced_metabolism'},
  kurdish:{tert:49,tert_t:'enhanced_maintenance',kl:10,kl_t:'longevity_variant',cetp:10,cetp_t:'longevity_lipids',e2:6,e4:9,apoe_t:'balanced_metabolism'},
  maasai:{tert:47,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:10,e4:22,apoe_t:'efficient_absorption'},
  maghreb:{tert:49,tert_t:'enhanced_maintenance',kl:11,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:6,e4:12,apoe_t:'balanced_metabolism'},
  malagasy:{tert:45,tert_t:'enhanced_maintenance',kl:4,kl_t:'standard_klotho',cetp:10,cetp_t:'standard_lipids',e2:7,e4:16,apoe_t:'balanced_metabolism'},
  maori:{tert:44,tert_t:'enhanced_maintenance',kl:1,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:3,e4:15,apoe_t:'efficient_absorption'},
  med_levant:{tert:50,tert_t:'enhanced_maintenance',kl:12,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:6,e4:9,apoe_t:'balanced_metabolism'},
  med_southern:{tert:51,tert_t:'enhanced_maintenance',kl:14,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:7,e4:8,apoe_t:'balanced_metabolism'},
  melanesia:{tert:44,tert_t:'enhanced_maintenance',kl:1,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:4,e4:25,apoe_t:'efficient_absorption'},
  mesoamerica:{tert:41,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:0,e4:15,apoe_t:'efficient_absorption'},
  mesopotamian:{tert:49,tert_t:'enhanced_maintenance',kl:10,kl_t:'longevity_variant',cetp:10,cetp_t:'longevity_lipids',e2:5,e4:9,apoe_t:'balanced_metabolism'},
  mestizo_mesoamerican:{tert:46,tert_t:'enhanced_maintenance',kl:6,kl_t:'standard_klotho',cetp:10,cetp_t:'standard_lipids',e2:3,e4:11,apoe_t:'balanced_metabolism'},
  micronesia:{tert:43,tert_t:'enhanced_maintenance',kl:1,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:3,e4:18,apoe_t:'efficient_absorption'},
  mongolia:{tert:43,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:4,e4:12,apoe_t:'balanced_metabolism'},
  nepal:{tert:45,tert_t:'enhanced_maintenance',kl:5,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:4,e4:11,apoe_t:'balanced_metabolism'},
  nile_valley:{tert:48,tert_t:'enhanced_maintenance',kl:9,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:8,e4:16,apoe_t:'balanced_metabolism'},
  nilotic:{tert:47,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:10,e4:23,apoe_t:'efficient_absorption'},
  nordic:{tert:53,tert_t:'enhanced_maintenance',kl:15,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:8,e4:19,apoe_t:'efficient_absorption'},
  north_china:{tert:43,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:6,e4:10,apoe_t:'balanced_metabolism'},
  north_india:{tert:46,tert_t:'enhanced_maintenance',kl:10,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:4,e4:10,apoe_t:'balanced_metabolism'},
  pacific_nw:{tert:41,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:0,e4:19,apoe_t:'efficient_absorption'},
  patagonia:{tert:41,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:0,e4:16,apoe_t:'efficient_absorption'},
  persian:{tert:49,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:10,cetp_t:'longevity_lipids',e2:5,e4:9,apoe_t:'balanced_metabolism'},
  polynesia:{tert:43,tert_t:'enhanced_maintenance',kl:1,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:3,e4:16,apoe_t:'efficient_absorption'},
  sahel:{tert:47,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:10,e4:24,apoe_t:'efficient_absorption'},
  se_asia_island:{tert:44,tert_t:'enhanced_maintenance',kl:1,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:5,e4:12,apoe_t:'balanced_metabolism'},
  se_asia_main:{tert:44,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:5,e4:11,apoe_t:'balanced_metabolism'},
  siberia:{tert:45,tert_t:'enhanced_maintenance',kl:2,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:3,e4:18,apoe_t:'efficient_absorption'},
  sichuan_sw_china:{tert:43,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:5,e4:10,apoe_t:'balanced_metabolism'},
  south_china:{tert:43,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:9,cetp_t:'standard_lipids',e2:6,e4:10,apoe_t:'balanced_metabolism'},
  south_india:{tert:46,tert_t:'enhanced_maintenance',kl:10,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:4,e4:10,apoe_t:'balanced_metabolism'},
  southeast_us:{tert:50,tert_t:'enhanced_maintenance',kl:13,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:8,e4:16,apoe_t:'balanced_metabolism'},
  southern_africa:{tert:47,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:13,cetp_t:'longevity_lipids',e2:11,e4:30,apoe_t:'efficient_absorption'},
  southwest_us:{tert:48,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:10,cetp_t:'standard_lipids',e2:4,e4:12,apoe_t:'balanced_metabolism'},
  subarctic:{tert:41,tert_t:'standard_maintenance',kl:0,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:0,e4:20,apoe_t:'efficient_absorption'},
  sudanian:{tert:47,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:10,e4:23,apoe_t:'efficient_absorption'},
  tibet:{tert:43,tert_t:'enhanced_maintenance',kl:0,kl_t:'standard_klotho',cetp:8,cetp_t:'standard_lipids',e2:4,e4:11,apoe_t:'balanced_metabolism'},
  west_africa:{tert:47,tert_t:'enhanced_maintenance',kl:8,kl_t:'longevity_variant',cetp:13,cetp_t:'longevity_lipids',e2:11,e4:22,apoe_t:'efficient_absorption'},
  west_india:{tert:46,tert_t:'enhanced_maintenance',kl:10,kl_t:'longevity_variant',cetp:11,cetp_t:'longevity_lipids',e2:4,e4:10,apoe_t:'balanced_metabolism'},
  western_europe:{tert:52,tert_t:'enhanced_maintenance',kl:15,kl_t:'longevity_variant',cetp:12,cetp_t:'longevity_lipids',e2:8,e4:15,apoe_t:'balanced_metabolism'}
};

// ============================================================
// Phenotype template assignment helpers
// ============================================================

function sirt1_t(f) { return f >= 65 ? 'enhanced' : 'standard'; }
function ppargc1a_t(f) { return f >= 85 ? 'high_flex' : f >= 62 ? 'moderate_flex' : 'low_flex'; }
function foxo3_t(f) { return f >= 58 ? 'enhanced' : f >= 35 ? 'moderate' : 'standard'; }

function sod2_t(f) { return f >= 45 ? 'strong' : 'standard'; }
function cat_t(f) { return f >= 18 ? 'enhanced' : 'standard'; }
function gpx1_t(f) { return f >= 80 ? 'high' : 'standard'; }
function nrf2_t(f) { return f >= 85 ? 'enhanced' : 'standard'; }
function gstp1_t(f) { return f >= 68 ? 'efficient' : 'standard'; }

function ucp1_t(f) { return f >= 65 ? 'enhanced' : 'standard'; }
function ucp2_t(f) { return f >= 45 ? 'enhanced' : 'standard'; }
function ucp3_t(f) { return f >= 22 ? 'enhanced' : 'standard'; }
function dio2_t(f) { return f >= 70 ? 'efficient' : 'standard'; }
function trpm8_t(f) { return f >= 55 ? 'enhanced' : 'standard'; }

function actn3_t(f) { return f >= 70 ? 'power_type' : f >= 45 ? 'balanced_type' : 'endurance_type'; }
function il6_t(f) { return f >= 25 ? 'fast_recovery' : 'standard_recovery'; }
function igf1_t(f) { return f >= 30 ? 'optimized' : 'standard'; }
function vegfa_t(f) { return f >= 65 ? 'enhanced' : 'standard'; }

// ============================================================
// New trait definitions for genetics-reference.json
// ============================================================

const newTraits = {

  // ---------- BATCH 1: Fasting & Metabolic Flexibility ----------
  sirt1_fasting: {
    gene: 'SIRT1', variant: 'rs7895833', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Enhanced Fasting Response', dietary_impact: 'High SIRT1 pathway capacity — benefits from intermittent fasting, caloric restriction, and polyphenol-rich foods (resveratrol, quercetin) that activate SIRT1 signaling' },
      standard: { name: 'Standard Fasting Response', dietary_impact: 'Standard SIRT1 activity — benefits from regular meal timing, moderate caloric intake, and antioxidant-rich foods to support healthy longevity signaling' }
    }
  },

  ppargc1a_metabolic_flex: {
    gene: 'PPARGC1A', variant: 'rs8192678 (Gly482Ser)', inheritance: 'additive',
    phenotype_templates: {
      high_flex: { name: 'High Metabolic Flexibility', dietary_impact: 'Strong fat-to-carbohydrate fuel switching capacity — well-suited to varied macronutrient intake and benefits from regular aerobic exercise to maximize mitochondrial biogenesis' },
      moderate_flex: { name: 'Moderate Metabolic Flexibility', dietary_impact: 'Good metabolic flexibility — benefits from consistent protein intake, balanced macronutrients, and regular exercise to optimize PGC-1α expression' },
      low_flex: { name: 'Lower Metabolic Flexibility', dietary_impact: 'Reduced fuel-switching capacity — benefits from lower-carbohydrate dietary patterns, regular aerobic exercise, and cold exposure to upregulate UCP expression via PGC-1α pathways' }
    }
  },

  foxo3_longevity_fasting: {
    gene: 'FOXO3', variant: 'rs2802292', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Enhanced Longevity Signaling', dietary_impact: 'High FOXO3 longevity pathway capacity — benefits from caloric restriction, fasting protocols, antioxidant-rich plant foods, and omega-3 fatty acids that activate FOXO3-mediated stress resistance' },
      moderate: { name: 'Moderate FOXO3 Activity', dietary_impact: 'Moderate FOXO3 signaling — benefits from Mediterranean-style eating patterns, regular polyphenol intake, and intermittent fasting to support healthy cellular aging' },
      standard: { name: 'Standard FOXO3 Activity', dietary_impact: 'Standard FOXO3 function — focus on antioxidant-rich foods, consistent meal timing, and stress management to support longevity pathways through lifestyle factors' }
    }
  },

  // ---------- BATCH 2: Antioxidant Capacity ----------
  sod2_antioxidant: {
    gene: 'SOD2', variant: 'rs4880 (Ala16Val)', inheritance: 'additive',
    phenotype_templates: {
      strong: { name: 'Strong Mitochondrial Antioxidant', dietary_impact: 'Efficient SOD2 enzyme transport — strong mitochondrial superoxide defense; benefits from manganese-rich foods (nuts, leafy greens, whole grains) and regular aerobic exercise to further enhance mitochondrial antioxidant capacity' },
      standard: { name: 'Standard SOD2 Activity', dietary_impact: 'Standard mitochondrial antioxidant function — benefits from antioxidant-rich diet including berries, leafy greens, and selenium-containing foods to support superoxide defense' }
    }
  },

  cat_antioxidant: {
    gene: 'CAT', variant: 'rs1001179 (-262C>T)', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Enhanced Catalase Activity', dietary_impact: 'Higher catalase expression — strong hydrogen peroxide detoxification; benefits from iron-rich foods to support heme enzyme cofactor and polyphenol-rich foods that upregulate catalase expression' },
      standard: { name: 'Standard Catalase Activity', dietary_impact: 'Standard catalase function — benefits from selenium, zinc, and polyphenol-rich foods, plus limiting alcohol and high-fat foods that increase hydrogen peroxide production' }
    }
  },

  gpx1_selenium: {
    gene: 'GPX1', variant: 'rs1050450 (Pro198Leu)', inheritance: 'additive',
    phenotype_templates: {
      high: { name: 'High Glutathione Peroxidase Activity', dietary_impact: 'High GPX1 enzyme activity — excellent selenium-dependent antioxidant defense; ensure adequate selenium intake (Brazil nuts, seafood, organ meats) and glutathione precursors (N-acetyl cysteine, whey protein)' },
      standard: { name: 'Standard GPX1 Activity', dietary_impact: 'Standard glutathione peroxidase function — benefits from selenium-rich foods, sulfur amino acids (cysteine, methionine), and glycine to support glutathione synthesis' }
    }
  },

  nrf2_detox: {
    gene: 'NFE2L2', variant: 'rs6721961 (-617C>A)', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Strong NRF2 Pathway Activation', dietary_impact: 'Full NRF2 transcription — robust activation of antioxidant response elements (HO-1, NQO1, GCLC); benefits from sulforaphane-rich cruciferous vegetables, curcumin, and polyphenols that activate NRF2' },
      standard: { name: 'Standard NRF2 Activity', dietary_impact: 'Standard NRF2 function — particularly benefits from NRF2-activating foods: broccoli sprouts, garlic, green tea, and ginger to compensate with dietary induction of phase II detoxification enzymes' }
    }
  },

  gstp1_antioxidant: {
    gene: 'GSTP1', variant: 'rs1695 (Ile105Val)', inheritance: 'additive',
    phenotype_templates: {
      efficient: { name: 'Efficient Glutathione Conjugation', dietary_impact: 'High GSTP1 conjugation activity — enhanced phase II detoxification of electrophiles and xenobiotics; benefits from cruciferous vegetables, alliums (garlic, onions), and fermented foods to maintain glutathione levels' },
      standard: { name: 'Standard GSTP1 Activity', dietary_impact: 'Standard glutathione S-transferase function — benefits from dietary inducers of phase II enzymes: broccoli sprouts, rosemary, green tea, and adequate protein intake for glutathione synthesis' }
    }
  },

  // ---------- BATCH 3: Thermic Effect & Metabolism ----------
  ucp1_brown_fat: {
    gene: 'UCP1', variant: 'rs1800592 (-3826A>G)', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Enhanced Brown Fat Activity', dietary_impact: 'High UCP1 expression capacity — strong non-shivering thermogenesis; benefits from cold exposure, capsaicin, green tea EGCG, and adequate dietary fat to fuel brown adipose activity; excellent metabolic response to intermittent fasting' },
      standard: { name: 'Standard UCP1 Activity', dietary_impact: 'Standard brown fat thermogenesis — benefits from cold exposure protocols, capsaicin-containing foods, and regular aerobic exercise to promote brown fat activation and white fat browning' }
    }
  },

  ucp2_metabolic_rate: {
    gene: 'UCP2', variant: 'rs659366 (-866G>A)', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Enhanced Metabolic Rate', dietary_impact: 'Higher UCP2 transcription — elevated baseline metabolic rate and reduced reactive oxygen species production; benefits from adequate dietary zinc (a UCP2 cofactor) and moderate caloric intake' },
      standard: { name: 'Standard UCP2 Activity', dietary_impact: 'Standard UCP2 function — maintains balanced ROS production and metabolic rate; benefits from antioxidant-rich foods and regular physical activity to optimize mitochondrial efficiency' }
    }
  },

  ucp3_muscle_thermogenesis: {
    gene: 'UCP3', variant: 'rs1800849 (-55C>T)', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Enhanced Muscle Thermogenesis', dietary_impact: 'Higher UCP3 expression in skeletal muscle — elevated free fatty acid oxidation and non-shivering thermogenesis; benefits from high-protein diet, resistance training, and adequate thyroid hormone support (iodine, selenium)' },
      standard: { name: 'Standard UCP3 Activity', dietary_impact: 'Standard muscle thermogenesis — benefits from regular resistance exercise to upregulate UCP3 expression and adequate dietary fat for mitochondrial uncoupling activity' }
    }
  },

  dio2_thyroid: {
    gene: 'DIO2', variant: 'rs225014 (Thr92Ala)', inheritance: 'additive',
    phenotype_templates: {
      efficient: { name: 'Efficient Thyroid Hormone Activation', dietary_impact: 'Normal T4→T3 conversion — efficient thyroid hormone activation; ensure adequate iodine (seaweed, seafood, iodized salt) and selenium (Brazil nuts, fish) for optimal deiodinase function' },
      standard: { name: 'Standard DIO2 Activity', dietary_impact: 'Moderate T4→T3 conversion efficiency — benefits from selenium-rich foods to optimize deiodinase activity, adequate iodine intake, and avoiding goitrogenic foods in excess. May benefit from active T3 optimization through diet' }
    }
  },

  trpm8_cold_tolerance: {
    gene: 'TRPM8', variant: 'rs10166942', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Enhanced Cold Tolerance', dietary_impact: 'High TRPM8 cold receptor adaptation — strong cold-climate dietary efficiency; benefits from warming spices (ginger, cinnamon, black pepper), omega-3 rich foods for anti-inflammatory cold-stress response, and adequate caloric density during cold months' },
      standard: { name: 'Standard Cold Response', dietary_impact: 'Standard cold tolerance — benefits from warming, calorie-dense foods in cold climates, adequate omega-3s and vitamin D, and thermogenic foods (capsaicin, ginger) to support cold-weather adaptation' }
    }
  },

  // ---------- BATCH 4: Protein & Muscle ----------
  actn3_power: {
    gene: 'ACTN3', variant: 'rs1815739 (R577X)', inheritance: 'additive',
    phenotype_templates: {
      power_type: { name: 'Power-Oriented Muscle Profile', dietary_impact: 'Functional alpha-actinin-3 in fast-twitch fibers — optimized for power and sprint activities; benefits from higher protein intake (1.6-2.2g/kg), creatine-rich foods, branched-chain amino acids, and resistance training emphasis' },
      balanced_type: { name: 'Balanced Power-Endurance Profile', dietary_impact: 'Mixed fast/slow twitch fiber profile — benefits from balanced protein intake (1.4-1.8g/kg), varied training, and carbohydrate periodization to support both power and endurance activities' },
      endurance_type: { name: 'Endurance-Oriented Muscle Profile', dietary_impact: 'High proportion of slow-twitch endurance muscle fibers — optimized for sustained aerobic activity; benefits from carbohydrate-focused energy strategy, moderate protein, iron-rich foods, and CoQ10 for mitochondrial support' }
    }
  },

  il6_recovery: {
    gene: 'IL6', variant: 'rs1800795 (-174G>C)', inheritance: 'additive',
    phenotype_templates: {
      fast_recovery: { name: 'Fast Exercise Recovery', dietary_impact: 'Lower baseline IL-6 production — faster exercise-induced inflammation resolution; benefits from anti-inflammatory foods (omega-3s, turmeric, tart cherry), adequate post-exercise protein, and good sleep quality' },
      standard_recovery: { name: 'Standard Inflammation Response', dietary_impact: 'Robust IL-6 immune response — strong pathogen defense but may benefit most from anti-inflammatory dietary strategies: omega-3s, curcumin, ginger, and polyphenol-rich berries to balance inflammatory signaling' }
    }
  },

  igf1_growth: {
    gene: 'IGF1', variant: 'rs35767', inheritance: 'additive',
    phenotype_templates: {
      optimized: { name: 'Optimized Growth Factor Response', dietary_impact: 'Higher circulating IGF-1 capacity — enhanced muscle protein synthesis response; benefits from adequate protein intake (especially leucine-rich sources), resistance exercise, and zinc/magnesium adequacy for optimal anabolic signaling' },
      standard: { name: 'Standard IGF-1 Signaling', dietary_impact: 'Standard growth factor response — benefits from complete protein sources, adequate total caloric intake, and resistance exercise to maximize IGF-1 pathway activation' }
    }
  },

  vegf_circulation: {
    gene: 'VEGFA', variant: 'rs2010963 (+405G>C)', inheritance: 'additive',
    phenotype_templates: {
      enhanced: { name: 'Enhanced Circulation Capacity', dietary_impact: 'Higher VEGF production — superior angiogenesis and oxygen delivery to tissues; benefits from aerobic exercise (the strongest VEGF inducer), nitrate-rich vegetables (beet, spinach, arugula), and adequate iron for hemoglobin production' },
      standard: { name: 'Standard Circulation Response', dietary_impact: 'Standard VEGF signaling — benefits from regular aerobic exercise, dietary nitrates, and iron-rich foods to optimize oxygen delivery and vascular health' }
    }
  },

  // ---------- BATCH 5: Gut Microbiome ----------
  fut2_secretor: {
    gene: 'FUT2', variant: 'rs601338 (W143X)', inheritance: 'recessive',
    notes: 'f = non-secretor phenotype frequency (%). East Asians carry se385 (rs1047781) instead of rs601338; Pacific Islanders carry se571/se400. All null alleles combined.',
    phenotype_templates: {
      non_secretor: { name: 'Non-Secretor (Enhanced B12 Absorption)', dietary_impact: 'FUT2 non-secretor: reduced mucosal ABO antigens; benefits from targeted Bifidobacterium probiotics, prebiotic fibers (FOS, GOS, 2-FL), and monitoring B12 status. Enhanced H. pylori resistance may explain B12 absorption advantage.' },
      secretor: { name: 'Secretor (Rich Microbiome Diversity)', dietary_impact: 'FUT2 secretor: abundant ABO blood group antigens nourish beneficial gut bacteria; leverage microbiome advantage with diverse plant fibers and fermented foods. Monitor B12 if plant-based.' }
    }
  },

  muc2_gut_barrier: {
    gene: 'MUC2', variant: 'rs2856111', inheritance: 'dominant',
    notes: 'f = strong-barrier phenotype frequency (%). C allele associated with enhanced mucin production in candidate gene studies.',
    phenotype_templates: {
      strong_barrier: { name: 'Strong Gut Barrier Function', dietary_impact: 'Enhanced mucin production — robust intestinal lining integrity; well-suited to diverse dietary patterns including high-fiber and fermented food diets that feed mucin-producing microbiota' },
      standard_barrier: { name: 'Standard Gut Barrier', dietary_impact: 'Standard mucin production — benefits from gut-supportive nutrients: L-glutamine, zinc carnosine, omega-3s, polyphenols, collagen peptides, and diverse dietary fiber to stimulate mucosal defense' }
    }
  },

  tlr4_gut_immunity: {
    gene: 'TLR4', variant: 'rs4986790 / rs4986791', inheritance: 'dominant',
    notes: 'f = balanced-tolerance carrier frequency (%). Includes Asp299Gly alone (African haplotype) or with Thr399Ile (European/South Asian haplotype). Both reduce TLR4-mediated LPS signaling.',
    phenotype_templates: {
      balanced_tolerance: { name: 'Balanced Immune Tolerance', dietary_impact: 'Modulated TLR4 signaling — comfortable with diverse gut bacterial exposure; benefits from probiotic diversity, fermented foods, and gradual dietary exploration to leverage tolerant immune profile' },
      vigilant_response: { name: 'Vigilant Immune Response', dietary_impact: 'Robust innate LPS immune surveillance — strong pathogen defense; benefits from anti-inflammatory foods (turmeric, omega-3s, polyphenols), limiting ultra-processed foods, and gradual introduction of new fermented foods' }
    }
  },

  // ---------- BATCH 6: Longevity ----------
  tert_telomere: {
    gene: 'TERT', variant: 'rs2736100', inheritance: 'additive',
    notes: 'C allele associated with longer telomeres and enhanced telomerase activity.',
    phenotype_templates: {
      enhanced_maintenance: { name: 'Enhanced Telomere Maintenance', dietary_impact: 'Strong baseline telomere support — benefits from antioxidant-rich Mediterranean diet, omega-3s, vitamin D, folate, and B12 to protect telomeres from oxidative damage. Consistent aerobic exercise significantly extends telomere length.' },
      standard_maintenance: { name: 'Standard Telomere Maintenance', dietary_impact: 'Benefits from telomere-supportive nutrition: omega-3s, vitamin D, folate and B12, polyphenol-rich berries and green tea. Mediterranean diet pattern consistently associated with longer telomeres in all genotypes.' }
    }
  },

  klotho_aging: {
    gene: 'KL', variant: 'rs9536314 (F352V / KL-VS)', inheritance: 'heterozygote_advantage',
    notes: 'KL-VS haplotype: ~15% Europeans, ~10% South Asians, ABSENT in East Asians (0/874 Koreans) and Iranians. Heterozygotes show longevity and cognitive benefits.',
    phenotype_templates: {
      longevity_variant: { name: 'Longevity-Associated Klotho Variant (KL-VS)', dietary_impact: 'Heterozygous KL-VS associated with enhanced healthy aging and cognitive longevity — benefits from phosphate-balanced diet (limit processed foods high in phosphate additives), adequate vitamin D, magnesium sufficiency, and weight-bearing exercise' },
      standard_klotho: { name: 'Standard Klotho Signaling', dietary_impact: 'Standard Klotho aging pathway — benefits from phosphate moderation, vitamin D adequacy (especially in East Asian and high-latitude populations), mineral balance, and regular exercise to support healthy aging' }
    }
  },

  cetp_longevity: {
    gene: 'CETP', variant: 'rs5882 (I405V)', inheritance: 'codominant',
    notes: 'CRITICAL: VV genotype is PROTECTIVE in Western populations (Ashkenazi centenarian studies) but associated with RISK in East Asian populations. Effect is population and diet-dependent.',
    phenotype_templates: {
      longevity_lipids: { name: 'Longevity-Associated Lipid Profile', dietary_impact: 'VV genotype favors favorable HDL patterns in Western dietary contexts — benefits from heart-healthy fats (olive oil, nuts, avocado), omega-3 rich fish, and limiting saturated and trans fats to leverage protective CETP effect' },
      standard_lipids: { name: 'Standard Lipid Metabolism', dietary_impact: 'Standard CETP cholesterol transfer activity — benefits from omega-3s, olive oil, plant sterols, and avoiding trans fats. Note: VV genotype shows OPPOSITE effect in East Asian populations (rice-based traditional diets).' }
    }
  },

  apoe_brain_health: {
    gene: 'APOE', variant: 'rs429358 + rs7412', inheritance: 'codominant',
    notes: 'Three major alleles: ε4 (ancestral, highest in hunter-gatherers: Pygmies 41%, Khoi San 37%), ε3 (most common), ε2 (protective, ABSENT in Native Americans). f_e2 and f_e4 are separate allele frequencies.',
    phenotype_templates: {
      enhanced_clearance: { name: 'Enhanced Lipid Clearance (ε2 carrier)', dietary_impact: 'ε2 allele associated with efficient lipid clearance and brain protection — greatest dietary flexibility; may tolerate higher fat intake but still benefits from omega-3 DHA for neurological health' },
      balanced_metabolism: { name: 'Balanced Lipid Metabolism (ε3 pattern)', dietary_impact: 'Most common APOE pattern — benefits from Mediterranean-style diet rich in omega-3s, olive oil, and plant polyphenols. Moderate saturated fat restriction and regular aerobic exercise support optimal brain and cardiovascular health.' },
      efficient_absorption: { name: 'Efficient Fat Absorption (ε4 ancestry)', dietary_impact: 'Ancestral APOE4 pattern (common in hunter-gatherer lineages) — benefits most from reduced saturated fat, increased omega-3/DHA (fatty fish, algae oil), Mediterranean or MIND diet, limiting alcohol, and maximizing aerobic exercise for neuroprotection' }
    }
  }
};

// ============================================================
// Apply to genetics-reference.json
// ============================================================

console.log('Adding new trait definitions to reference file...');
Object.assign(ref.traits, newTraits);
console.log(`  Total traits now: ${Object.keys(ref.traits).length}`);

// ============================================================
// Apply to genetics-frequencies.json for each population
// ============================================================

console.log('Adding population frequency data...');
let popCount = 0;

for (const [popId, popData] of Object.entries(freq.populations)) {
  if (!SIRT1[popId]) {
    console.warn(`  WARNING: No data for population: ${popId}`);
    continue;
  }

  // BATCH 1
  const s = SIRT1[popId], pp = PPARGC1A[popId], fx = FOXO3[popId];
  popData.sirt1_fasting = { f: s, t: sirt1_t(s) };
  popData.ppargc1a_metabolic_flex = { f: pp, t: ppargc1a_t(pp) };
  popData.foxo3_longevity_fasting = { f: fx, t: foxo3_t(fx) };

  // BATCH 2
  const s2 = SOD2[popId], c = CAT[popId], g = GPX1[popId], n = NFE2L2[popId], gs = GSTP1[popId];
  popData.sod2_antioxidant = { f: s2, t: sod2_t(s2) };
  popData.cat_antioxidant = { f: c, t: cat_t(c) };
  popData.gpx1_selenium = { f: g, t: gpx1_t(g) };
  popData.nrf2_detox = { f: n, t: nrf2_t(n) };
  popData.gstp1_antioxidant = { f: gs, t: gstp1_t(gs) };

  // BATCH 3
  const u1 = UCP1[popId], u2 = UCP2[popId], u3 = UCP3[popId], d = DIO2[popId], tr = TRPM8[popId];
  popData.ucp1_brown_fat = { f: Math.round(u1), t: ucp1_t(u1) };
  popData.ucp2_metabolic_rate = { f: u2, t: ucp2_t(u2) };
  popData.ucp3_muscle_thermogenesis = { f: u3, t: ucp3_t(u3) };
  popData.dio2_thyroid = { f: d, t: dio2_t(d) };
  popData.trpm8_cold_tolerance = { f: tr, t: trpm8_t(tr) };

  // BATCH 4
  const a = ACTN3[popId], il = IL6[popId], ig = IGF1[popId], vg = VEGFA[popId];
  popData.actn3_power = { f: a, t: actn3_t(a) };
  popData.il6_recovery = { f: il, t: il6_t(il) };
  popData.igf1_growth = { f: ig, t: igf1_t(ig) };
  popData.vegf_circulation = { f: vg, t: vegfa_t(vg) };

  // BATCH 5
  popData.fut2_secretor = FUT2_SECRETOR[popId];
  popData.muc2_gut_barrier = MUC2[popId];
  popData.tlr4_gut_immunity = TLR4[popId];

  // BATCH 6
  const b6 = BATCH6[popId];
  if (b6) {
    popData.tert_telomere = { f: b6.tert, t: b6.tert_t };
    popData.klotho_aging = { f: b6.kl, t: b6.kl_t };
    popData.cetp_longevity = { f: b6.cetp, t: b6.cetp_t };
    popData.apoe_brain_health = { f_e2: b6.e2, f_e4: b6.e4, t: b6.apoe_t };
  }

  popCount++;
}

console.log(`  Updated ${popCount} populations`);

// ============================================================
// Write updated files
// ============================================================

console.log('Writing genetics-reference.json...');
fs.writeFileSync(refPath, JSON.stringify(ref, null, 2));

console.log('Writing genetics-frequencies.json...');
fs.writeFileSync(freqPath, JSON.stringify(freq, null, 2));

console.log('\nDone! Summary:');
console.log(`  genetics-reference.json: ${Object.keys(ref.traits).length} total traits`);
console.log(`  genetics-frequencies.json: ${popCount} populations updated`);
console.log(`  New traits added per population: 24`);
console.log('  Batches: 1 (SIRT1/PPARGC1A/FOXO3), 2 (SOD2/CAT/GPX1/NFE2L2/GSTP1),');
console.log('           3 (UCP1/UCP2/UCP3/DIO2/TRPM8), 4 (ACTN3/IL6/IGF1/VEGFA),');
console.log('           5 (FUT2-secretor/MUC2/TLR4), 6 (TERT/KL/CETP/APOE)');
