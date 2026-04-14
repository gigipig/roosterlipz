*different styles*
StyleURLCartoDB Lighthttps://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
CartoDB Darkhttps://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png
CartoDB Voyagerhttps://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png
Stamen Tonerhttps://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png
Stamen Watercolorhttps://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg
ESRI World Imageryhttps://server.arcgisonlin


  Future additions: Just add the gene to genetics.json and add one line to newGeneMeta in the UI.

  The app should now display all new genes when viewing a culture's genetic profile. Want to test it in the browser?




   Adding a New Gene - Streamlined Process
                                                                                                                                                                                                                                               Step 1: Add gene data to genetics.json (via the existing scripts/add_new_genes.js script or manually)
                                                                                                                                                                                                                                               Step 2: Add metadata to GENE_META in genetics.js (around line 1029):
  my_new_gene: { icon: '🧬', ti tle: 'My New Gene', cssClass: 'my-gene' },

  Step 3: Add calculation config to GENERIC_GENE_CONFIG (around line 1070):
  my_new_gene: {
    freqPath: 'allele_frequency_percent',  // path to frequency in genetic_adaptations
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'High Risk', rec: 'Recommendation for high risk' },
      { min: 25, phenotype: 'Moderate Risk', rec: 'Recommendation for moderate' },
      { min: 0, phenotype: 'Low Risk', rec: 'Recommendation for low' }
    ]
  }

  Step 4 (optional): Add CSS styling in style.css:
  .genetic-trait.my-gene {
    background: linear-gradient(135deg, #color1 0%, #color2 100%);
    color: #ffffff;
  }

  That's it - the gene will automatically:
  - Be calculated using Mendelian inheritance from grandparents
  - Display in the genetic profile with correct icon, title, and styling
  - Show phenotype, frequency, and recommendations

  The system now calculates ~20 genes for all populations (instead of just 4 for European ancestries). For genes that only appear in specific populations (like ALDH2 for East Asian, CREBRF for Polynesian), those still use custom
  calculation functions with population frequency thresholds.





---

## Gene Expansion: Prioritized Batches

Based on research 30 january26.md. Genes already in the app: lactase_persistence (European only), starch_digestion, pufa_metabolism, vitamin_d_metabolism, caffeine_metabolism, saturated_fat_response, folate_metabolism, iron_metabolism, glucose_metabolism, obesity_risk, beta_carotene_conversion, vitamin_d_transport, salt_sensitivity, salt_sensitive_hypertension, bitter_taste_perception, vitamin_b12_absorption, appetite_regulation, celiac_susceptibility, hdl_metabolism, insulin_sensitivity, antioxidant_capacity, cruciferous_metabolism (GSTM1/GSTT1), alcohol_metabolism, arctic_fat_metabolism (CPT1A - some cultures), polynesian_energy_storage (CREBRF - some cultures), altitude_adaptation_epas1, edar_adaptation.

### Batch 1: Fix existing gaps (highest priority - corrects inaccuracies)
- African lactase persistence alleles (rs145946881, rs41380347, rs41525747) — current app misclassifies lactose-tolerant Africans
- AMY1 copy number updates per 2024 pangenome study
- APOE frequency corrections (African 22% per gnomAD v4.1 vs old 12-15%)
- FADS1 population frequency corrections (81% African, near-absent Native American)

### Batch 2: Population-specific high-impact variants (large effect sizes, not yet in app)
- G6PD deficiency (rs5030868 Mediterranean, A- African) — 20-25% of African males, dietary fava bean avoidance
- ABCA1 rs9282541 R230C — Indigenous American exclusive, reverses typical diet advice
- SLC16A11 diabetes haplotype — ~50% in Mexican Natives, absent in Europeans
- TBC1D4 p.Arg684Ter — 17% in Greenlandic Inuit, 10x diabetes risk
- ADH1B rs1229984 — expand to all East Asian cultures (50.5% Taiwan)
- CREBRF/CPT1A — expand to ALL relevant cultures (currently only some)

### Batch 3: Multi-gene panels (requires new calculation logic)
- Vitamin D panel: CYP2R1 rs10741657 + GC rs4588 + VDR rs2228570/rs731236
- Methylation panel: MTR A2756G + MTRR rs1801394 + COMT rs4680
- Salt sensitivity panel: CYP11B2 rs1799998 + AGTR1 rs5186 (African-specific)

### Batch 4: Behavior/appetite genes
- LEPR rs1137101 — satiety, 1.82x T2DM risk
- BDNF rs6265 — fat-specific hyperphagia, 44.5% in Asians
- CD36 rs1761667 — fat taste threshold
- FADS2 rs66698963 — South Asian vegetarian adaptation (68-70%)

### Batch 5: Chrononutrition and sensitivity
- CLOCK rs1801260 — evening chronotype, meal timing
- PER1 rs2735611 — weight gain and meal regularity
- AOC1/DAO variants — histamine intolerance (rs10156191, rs1049742, rs2052129)
- ADORA2A rs5751876 — caffeine anxiety/insomnia beyond CYP1A2

### Batch 6: Founder/regional variants
- G6PD Mediterranean rs5030868 (Saudi/Bahrain)
- Middle Eastern lactase persistence T/G-13915
- Ashkenazi: GBA1 N370S, LDLR G197del, MTP G865X
- Gout panel for Pacific Islanders: ABCG2 rs2231142, SLC2A9 rs734553

---

## Prompt Template for Adding Genes

Use this template when prompting Claude to add a new gene. Copy, fill in the bracketed sections, and paste.

```
Add the gene [GENE_KEY] to the nutrigenomics system. Reference the research in "Research/research 30 january26.md" for scientific details.

FILES TO MODIFY:
1. genetics.json — Add a "[GENE_KEY]" entry under "genetic_adaptations" for EVERY culture (66 total). Use population-specific allele frequencies from gnomAD v4.1 and published literature. Follow the exact structure of "caffeine_metabolism" entries (gene, variant, allele_frequency_percent, inheritance, inferred_phenotype, phenotype_probability, phenotype_details, dietary_recommendation).

2. js/genetics.js line ~1029 — Add to GENE_META:
   [gene_key]: { icon: '[EMOJI]', title: '[Display Name]', cssClass: '[css-class]' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   [gene_key]: {
     freqPath: 'allele_frequency_percent',
     inheritance: '[additive|dominant|recessive]',
     thresholds: [
       { min: [HIGH], phenotype: '[High phenotype]', rec: '[EMOJI] <strong>[Label]:</strong> [recommendation]' },
       { min: [MED], phenotype: '[Moderate phenotype]', rec: '[EMOJI] <strong>[Label]:</strong> [recommendation]' },
       { min: 0, phenotype: '[Low phenotype]', rec: '[EMOJI] <strong>[Label]:</strong> [recommendation]' }
     ]
   }

4. style.css — Add styling:
   .genetic-trait.[css-class] {
     background: linear-gradient(135deg, #[color1] 0%, #[color2] 100%);
     color: #ffffff;
   }

IMPORTANT:
- Every culture in genetics.json must get an entry, even if frequency is 0% or near-0%
- Use REAL allele frequencies — do not guess. Check gnomAD, 1000 Genomes, or published GWAS
- Match the exact JSON structure of existing entries
- The gene should work with the existing Mendelian inheritance calculation system
```

### Example filled prompt (G6PD):

```
Add the gene g6pd_deficiency to the nutrigenomics system. Reference the research in "Research/research 30 january26.md" for scientific details.

FILES TO MODIFY:
1. genetics.json — Add a "g6pd_deficiency" entry under "genetic_adaptations" for EVERY culture (66 total). Key frequencies: 20-25% African males (A- variant), 65% Saudi Qatif (Mediterranean variant rs5030868), 26.4% Bahrain, near 0% in East Asian and Northern European populations. Use population-specific allele frequencies from gnomAD v4.1.

2. js/genetics.js line ~1029 — Add to GENE_META:
   g6pd_deficiency: { icon: '🫘', title: 'G6PD Deficiency', cssClass: 'g6pd' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   g6pd_deficiency: {
     freqPath: 'allele_frequency_percent',
     inheritance: 'recessive',
     thresholds: [
       { min: 40, phenotype: 'High G6PD Deficiency Risk', rec: '🫘 <strong>High risk:</strong> Strictly avoid fava beans, check medications for oxidative risk, HbA1c may be unreliable' },
       { min: 15, phenotype: 'Moderate G6PD Carrier Risk', rec: '🫘 <strong>Moderate risk:</strong> Limit fava beans, be aware of oxidative stress triggers' },
       { min: 0, phenotype: 'Low G6PD Deficiency Risk', rec: '🫘 <strong>Low risk:</strong> No specific dietary restrictions needed' }
     ]
   }

4. style.css — Add styling for .genetic-trait.g6pd

IMPORTANT:
- Every culture in genetics.json must get an entry, even if frequency is 0%
- Use REAL allele frequencies from gnomAD and published literature
- Match the exact JSON structure of existing caffeine_metabolism entries
```

### Tips for reducing credit usage:
- Do ONE gene per prompt, not multiple
- Include the specific line numbers (~1029, ~1070)
- Name all 4 files explicitly so Claude doesn't need to search
- Provide key population frequencies so Claude doesn't need to research extensively
- Say "follow the structure of caffeine_metabolism" as a concrete example

---

## Ready-to-Use Batch Prompts

### BATCH 1: Fix Existing Gaps

**Prompt 1A — African Lactase Persistence Alleles:**
```
The lactase persistence calculation in js/genetics.js (function calculateLactasePersistence at line ~1373) currently only uses rs4988235, which is European-specific. African and Middle Eastern populations carry different LP alleles that this misses entirely.

Modify the system to support multiple lactase persistence variants:

1. genetics.json — For every African, Middle Eastern, and related culture, add additional fields to the existing "lactase_persistence" entry:
   - "african_allele_gc14010": frequency for rs145946881 (G/C-14010). Key frequencies: 46% Afro-Asiatic Tanzanians, 39% Nilo-Saharan Tanzanians, present in East/Central African cultures, 0% in European/Asian cultures.
   - "middle_eastern_allele_tg13915": frequency for rs41380347 (T/G-13915). Key frequencies: 60-80% Middle Eastern pastoralists, present in Arabian/Levant/Mesopotamian cultures, 0% in European/East Asian cultures.
   - "african_allele_cg13907": frequency for rs41525747 (C/G-13907). Key frequencies: 21% Beja populations, present in Horn of Africa/Nile Valley cultures, 0% elsewhere.

2. js/genetics.js line ~1373 — Modify calculateLactasePersistence() to check ALL LP alleles and use the HIGHEST frequency among them. A person is lactase persistent if they carry ANY of the LP variants. The logic should be: for each grandparent, take the max of (allele_frequency_percent, african_allele_gc14010, middle_eastern_allele_tg13915, african_allele_cg13907), then run the existing Mendelian calculation on that combined frequency.

Reference "Research/research 30 january26.md" Part 1 and Part 2 (African populations section) for the scientific details and frequencies.

DO NOT change any other genes. Only modify lactase persistence.
```

**Prompt 1B — AMY1 Copy Number Updates:**
```
Update AMY1 (starch_digestion) copy numbers in genetics.json for all 66 cultures based on the 2024 Nature pangenome study findings.

Key corrections per "Research/research 30 january26.md":
- Agricultural populations should average 6.7-7.0 diploid copies
- Hunter-gatherer, pastoral, and fishing populations should average 4.5-5.5 copies
- The previous estimates were generally too uniform

Review each culture's "starch_digestion" > "average_copy_number" in genetics.json and adjust based on whether that culture was historically agricultural vs hunter-gatherer/pastoral/fishing. Update the phenotype_details description to reflect the 2024 data where relevant.

DO NOT modify js/genetics.js — only update genetics.json data values.
```

**Prompt 1C — Allele Frequency Corrections:**
```
Correct allele frequencies in genetics.json that are outdated per gnomAD v4.1 data. Reference "Research/research 30 january26.md" Part 1 table "Commonly cited frequencies requiring correction."

Specific corrections needed across all relevant cultures:
1. FADS1 (pufa_metabolism) rs174537: African cultures should be ~81% G allele. Native American cultures (amazon, mesoamerica, andean, great_plains, eastern_woodlands, etc.) should be near 0-5%. Verify all other cultures are reasonable.
2. FTO (obesity_risk) rs9939609: African cultures should be ~48% A allele (highest globally, not Europeans). European cultures ~41%.
3. BCO1/BCMO1 (beta_carotene_conversion): European cultures should be ~24%, African cultures ~4%. The commonly cited 42% global figure was overestimated.
4. TCF7L2 (glucose_metabolism) rs7903146: East Asian cultures should be ~3% T allele. European cultures ~30%. This is a 10-fold difference.
5. HFE (iron_metabolism) rs1800562: Irish/Celtic-adjacent cultures (western_europe, nordic) may need increase to reflect up to 14% carrier frequency.

For each correction, update allele_frequency_percent AND adjust the inferred_phenotype and phenotype_details if the new frequency changes the phenotype category.

DO NOT modify js/genetics.js — only update genetics.json data values.
```

### BATCH 2: Population-Specific High-Impact Variants

**Prompt 2A — G6PD Deficiency:**
```
Add the gene g6pd_deficiency to the nutrigenomics system.

FILES TO MODIFY:
1. genetics.json — Add "g6pd_deficiency" under "genetic_adaptations" for ALL 66 cultures. Key frequencies from "Research/research 30 january26.md":
   - African cultures (west_africa, central_africa, southern_africa, etc.): 20-25% for A- variant
   - Saudi/Arabian cultures: up to 65% (Qatif oasis) for Mediterranean variant rs5030868
   - Bahrain/Gulf: 26.4%
   - Mediterranean (med_southern, med_levant, etc.): 5-10%
   - Northern European, East Asian, Indigenous American: <1%
   Use gene "G6PD", variant "rs5030868" for Mediterranean or "rs1050828" for A- African.
   Include in phenotype_details: fava bean avoidance, oxidative food caution, HbA1c unreliability for diabetes monitoring.
   Include in dietary_recommendation: avoid list (fava beans, tonic water with quinine), notes about medication interactions.
   Follow the exact JSON structure of "caffeine_metabolism" entries.

2. js/genetics.js line ~1029 — Add to GENE_META:
   g6pd_deficiency: { icon: '🫘', title: 'G6PD Deficiency', cssClass: 'g6pd' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   g6pd_deficiency: {
     freqPath: 'allele_frequency_percent',
     inheritance: 'recessive',
     thresholds: [
       { min: 40, phenotype: 'High G6PD Deficiency Risk', rec: '🫘 <strong>High risk:</strong> Strictly avoid fava beans and oxidative foods, HbA1c unreliable for diabetes monitoring' },
       { min: 15, phenotype: 'Moderate G6PD Carrier Risk', rec: '🫘 <strong>Carrier risk:</strong> Limit fava beans, be aware of oxidative stress triggers in foods and medications' },
       { min: 0, phenotype: 'Low G6PD Deficiency Risk', rec: '🫘 <strong>Low risk:</strong> No specific G6PD-related dietary restrictions' }
     ]
   }

4. style.css — Add:
   .genetic-trait.g6pd { background: linear-gradient(135deg, #8B0000 0%, #CD5C5C 100%); color: #ffffff; }
```

**Prompt 2B — ABCA1 R230C (Indigenous American):**
```
Add the gene abca1_r230c to the nutrigenomics system.

This variant is EXCLUSIVE to Indigenous American populations. Reference "Research/research 30 january26.md" Part 2 (Indigenous American section).

FILES TO MODIFY:
1. genetics.json — Add "abca1_r230c" under "genetic_adaptations" for ALL 66 cultures. Key frequencies:
   - mestizo_mesoamerican: 10%
   - mesoamerica, amazon, andean, caribbean_taino: 5-15% (varies by admixture)
   - great_plains, eastern_woodlands, pacific_nw, southwest_us, california_coast, canadian_prairies, patagonia, southeast_us, subarctic: 3-10%
   - ALL non-American cultures: 0%
   Use gene "ABCA1", variant "rs9282541".
   Critical detail in phenotype_details: carriers show REVERSED diet response — higher fat/lower carb diets produce BETTER outcomes, opposite of typical advice. 27% reduction in cholesterol efflux, lower HDL-C.
   Follow the exact JSON structure of "caffeine_metabolism" entries.

2. js/genetics.js line ~1029 — Add to GENE_META:
   abca1_r230c: { icon: '🫀', title: 'Cholesterol Efflux (R230C)', cssClass: 'abca1' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   abca1_r230c: {
     freqPath: 'allele_frequency_percent',
     inheritance: 'additive',
     thresholds: [
       { min: 8, phenotype: 'ABCA1 R230C Carrier Population', rec: '🫀 <strong>R230C variant:</strong> Lower-carb, higher-fat diet may improve metabolic markers — opposite of typical advice. Monitor HDL cholesterol.' },
       { min: 3, phenotype: 'Low ABCA1 R230C Frequency', rec: '🫀 <strong>Low R230C frequency:</strong> Standard dietary fat guidelines apply, some Indigenous American ancestry detected' },
       { min: 0, phenotype: 'ABCA1 R230C Absent', rec: '🫀 <strong>Standard:</strong> No R230C-related dietary modifications needed' }
     ]
   }

4. style.css — Add:
   .genetic-trait.abca1 { background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: #ffffff; }
```

**Prompt 2C — SLC16A11 Diabetes Haplotype:**
```
Add the gene slc16a11_diabetes to the nutrigenomics system.

Reference "Research/research 30 january26.md" Part 2 (Indigenous American section).

FILES TO MODIFY:
1. genetics.json — Add "slc16a11_diabetes" under "genetic_adaptations" for ALL 66 cultures. Key frequencies:
   - mesoamerica, amazon, andean, caribbean_taino: 30-50%
   - mestizo_mesoamerican: ~50% (highest known)
   - great_plains, eastern_woodlands, pacific_nw, southwest_us, california_coast: 15-30%
   - ALL European, African, East Asian, etc.: 0-1% (essentially absent)
   Use gene "SLC16A11", variant "rs75493593".
   In phenotype_details: OR 1.29 for T2D, Neanderthal-introgressed, stronger effect in younger/leaner individuals, alters hepatic lipid metabolism.
   Follow the exact JSON structure of "caffeine_metabolism" entries.

2. js/genetics.js line ~1029 — Add to GENE_META:
   slc16a11_diabetes: { icon: '🩸', title: 'SLC16A11 Diabetes Risk', cssClass: 'slc16a11' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   slc16a11_diabetes: {
     freqPath: 'allele_frequency_percent',
     inheritance: 'additive',
     thresholds: [
       { min: 30, phenotype: 'High SLC16A11 Diabetes Risk', rec: '🩸 <strong>Elevated risk:</strong> Prioritize weight management and Mediterranean diet pattern, monitor fasting glucose early in life' },
       { min: 10, phenotype: 'Moderate SLC16A11 Risk', rec: '🩸 <strong>Moderate risk:</strong> Maintain healthy weight, regular glucose monitoring recommended' },
       { min: 0, phenotype: 'Low SLC16A11 Risk', rec: '🩸 <strong>Low risk:</strong> No SLC16A11-specific dietary modifications needed' }
     ]
   }

4. style.css — Add:
   .genetic-trait.slc16a11 { background: linear-gradient(135deg, #4A0E4E 0%, #8E44AD 100%); color: #ffffff; }
```

**Prompt 2D — TBC1D4 (Inuit Diabetes):**
```
Add the gene tbc1d4_diabetes to the nutrigenomics system.

Reference "Research/research 30 january26.md" Part 2 (Inuit/Arctic section).

FILES TO MODIFY:
1. genetics.json — Add "tbc1d4_diabetes" under "genetic_adaptations" for ALL 66 cultures. Key frequencies:
   - inuit: 17%
   - subarctic: 5-10%
   - siberia: 2-5%
   - ALL other cultures: 0%
   Use gene "TBC1D4", variant "p.Arg684Ter".
   In phenotype_details: 10x T2D risk in homozygotes (4% of Greenlandic Inuit), explains 10-15% of Greenland diabetes, severe muscle insulin resistance BUT preserves exercise-stimulated glucose uptake. HbA1c misses 32% of cases — oral glucose tolerance testing more reliable.
   Follow the exact JSON structure of "caffeine_metabolism" entries.

2. js/genetics.js line ~1029 — Add to GENE_META:
   tbc1d4_diabetes: { icon: '🏔️', title: 'Arctic Diabetes Risk (TBC1D4)', cssClass: 'tbc1d4' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   tbc1d4_diabetes: {
     freqPath: 'allele_frequency_percent',
     inheritance: 'recessive',
     thresholds: [
       { min: 10, phenotype: 'Elevated TBC1D4 Diabetes Risk', rec: '🏔️ <strong>Arctic variant:</strong> Exercise is critical — preserves glucose uptake despite insulin resistance. Request oral glucose tolerance test, not HbA1c. Traditional diet recommended.' },
       { min: 3, phenotype: 'Low TBC1D4 Carrier Frequency', rec: '🏔️ <strong>Low carrier frequency:</strong> Minimal TBC1D4 risk, standard diabetes screening appropriate' },
       { min: 0, phenotype: 'TBC1D4 Absent', rec: '🏔️ <strong>Standard:</strong> No TBC1D4-related risk detected' }
     ]
   }

4. style.css — Add:
   .genetic-trait.tbc1d4 { background: linear-gradient(135deg, #1B4F72 0%, #5DADE2 100%); color: #ffffff; }
```

**Prompt 2E — Expand CREBRF and CPT1A to All Relevant Cultures:**
```
Expand the existing CREBRF (polynesian_energy_storage) and CPT1A (arctic_fat_metabolism) entries in genetics.json to cover ALL relevant cultures. Currently they only exist for a few cultures.

Reference "Research/research 30 january26.md" for frequencies.

CREBRF rs373863828 — currently in polynesia and maori. ADD to:
- micronesia: 10-15%
- melanesia: 5-10%
- se_asia_island: 2-5%
- malagasy: 2-3%
- hawaiian/samoan-adjacent cultures as applicable
- ALL other cultures: 0% (virtually absent in Europeans, Africans, East Asians)
Effect: each copy +1.36-1.48 kg/m² BMI but PROTECTS against T2D (OR 0.59-0.65). Note the paradox in phenotype_details.

CPT1A rs80356779 (P479L) — currently in inuit. ADD to:
- subarctic: 40-60%
- siberia: 20-40%
- pacific_nw: 10-20% (some First Nations groups)
- mongolia: 5-10%
- ALL other cultures: 0%
Effect: adapted for high-fat marine diet, reduces DHA levels, -2.1cm height per copy. Traditional diet is metabolically optimal for carriers.

DO NOT modify js/genetics.js — only expand genetics.json entries using the same structure already present for these genes in existing cultures.
```

### BATCH 3: Multi-Gene Panels (Requires New Calculation Logic)

**Prompt 3A — Vitamin D Multi-Gene Panel:**
```
Add two new vitamin D genes to complement the existing vitamin_d_metabolism and vitamin_d_transport entries. Reference "Research/research 30 january26.md" Part 3 (Vitamin D section).

NEW GENE 1: cyp2r1_vitamin_d
FILES TO MODIFY:
1. genetics.json — Add "cyp2r1_vitamin_d" for ALL 66 cultures. Gene "CYP2R1", variant "rs10741657".
   Key frequencies: A allele 60-65% in African cultures, 40-50% European, 20-25% East Asian.
   AG/GG genotypes are 3.7x more likely to be vitamin D insufficient.
   Follow the exact JSON structure of "caffeine_metabolism" entries.

2. js/genetics.js line ~1029 — Add to GENE_META:
   cyp2r1_vitamin_d: { icon: '☀️', title: 'Vitamin D Hydroxylation', cssClass: 'vit-d-hydrox' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   cyp2r1_vitamin_d: {
     freqPath: 'allele_frequency_percent',
     inheritance: 'additive',
     thresholds: [
       { min: 50, phenotype: 'Reduced Vitamin D Activation', rec: '☀️ <strong>Impaired hydroxylation:</strong> May need higher vitamin D intake (2000-4000 IU/day), monitor 25(OH)D levels, adequate sun exposure critical' },
       { min: 30, phenotype: 'Moderate Vitamin D Activation', rec: '☀️ <strong>Moderate hydroxylation:</strong> Ensure 1000-2000 IU/day vitamin D, consider testing levels' },
       { min: 0, phenotype: 'Normal Vitamin D Activation', rec: '☀️ <strong>Normal hydroxylation:</strong> Standard vitamin D recommendations (600-1000 IU/day) typically sufficient' }
     ]
   }

4. style.css — Add:
   .genetic-trait.vit-d-hydrox { background: linear-gradient(135deg, #F39C12 0%, #F1C40F 100%); color: #333333; }

NEW GENE 2: vdr_response
1. genetics.json — Add "vdr_response" for ALL 66 cultures. Gene "VDR", variant "rs731236" (TaqI).
   Key frequencies vary moderately across populations (30-50% C allele globally).
   CC genotype may require >2000 IU/day.
   Follow the exact JSON structure of "caffeine_metabolism" entries.

2. js/genetics.js line ~1029 — Add to GENE_META:
   vdr_response: { icon: '🦴', title: 'Vitamin D Receptor', cssClass: 'vdr' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   vdr_response: {
     freqPath: 'allele_frequency_percent',
     inheritance: 'additive',
     thresholds: [
       { min: 45, phenotype: 'Reduced VDR Response', rec: '🦴 <strong>Reduced receptor response:</strong> May need >2000 IU/day vitamin D for target levels, prioritize calcium-rich foods' },
       { min: 25, phenotype: 'Moderate VDR Response', rec: '🦴 <strong>Moderate response:</strong> Standard to slightly elevated vitamin D intake recommended' },
       { min: 0, phenotype: 'Normal VDR Response', rec: '🦴 <strong>Normal response:</strong> Standard vitamin D and calcium recommendations apply' }
     ]
   }

4. style.css — Add:
   .genetic-trait.vdr { background: linear-gradient(135deg, #E67E22 0%, #FAD7A0 100%); color: #333333; }
```

**Prompt 3B — Methylation Panel:**
```
Add three methylation pathway genes to complement the existing folate_metabolism (MTHFR). Reference "Research/research 30 january26.md" Part 3 (Methylation section).

NEW GENE 1: mtr_b12_methylation
Gene "MTR", variant "A2756G". 1.7% homozygous in Caucasians. Affects B12-dependent homocysteine remethylation.
GENE_META: mtr_b12_methylation: { icon: '🔄', title: 'MTR B12 Methylation', cssClass: 'mtr' },
GENERIC_GENE_CONFIG thresholds: high (min 40) = impaired B12 recycling, recommend methylcobalamin; moderate (min 20); low (min 0) = normal.
CSS: .genetic-trait.mtr { background: linear-gradient(135deg, #2E86C1 0%, #85C1E9 100%); color: #ffffff; }

NEW GENE 2: mtrr_methylation
Gene "MTRR", variant "rs1801394" (A66G). GG = 4-fold lower B12/folate, 5x neural tube defect risk with high methylmalonic acid.
GENE_META: mtrr_methylation: { icon: '🔄', title: 'MTRR Methylation Support', cssClass: 'mtrr' },
GENERIC_GENE_CONFIG thresholds: high (min 45) = significantly impaired, recommend methylcobalamin + methylfolate; moderate (min 25); low (min 0).
CSS: .genetic-trait.mtrr { background: linear-gradient(135deg, #1A5276 0%, #76D7C4 100%); color: #ffffff; }

NEW GENE 3: comt_methylation
Gene "COMT", variant "rs4680" (Val158Met). Met/Met = 4-fold decreased enzyme function, affects catecholamine and estrogen metabolism. Cruciferous vegetables support estrogen clearance.
GENE_META: comt_methylation: { icon: '🥦', title: 'COMT Enzyme Activity', cssClass: 'comt' },
GENERIC_GENE_CONFIG thresholds: high (min 45) = slow COMT, increase cruciferous vegetables for estrogen clearance, limit caffeine/stress; moderate (min 25); low (min 0) = fast COMT, standard diet.
CSS: .genetic-trait.comt { background: linear-gradient(135deg, #196F3D 0%, #82E0AA 100%); color: #ffffff; }

For ALL three genes: add to genetics.json for all 66 cultures following the exact structure of "caffeine_metabolism" entries. Add to GENE_META (~line 1029), GENERIC_GENE_CONFIG (~line 1070), and style.css.
```

**Prompt 3C — African Salt Sensitivity Panel:**
```
Add two African-specific salt/hypertension genes to complement the existing salt_sensitivity (AGT) and salt_sensitive_hypertension (ADD1). Reference "Research/research 30 january26.md" Part 2 (African populations section).

NEW GENE 1: cyp11b2_hypertension
Gene "CYP11B2", variant "rs1799998". T allele 74% in African American cultures, 58% in Latino cultures, 30-40% in European cultures.
GENE_META: cyp11b2_hypertension: { icon: '💓', title: 'Aldosterone & Salt Response', cssClass: 'cyp11b2' },
GENERIC_GENE_CONFIG: inheritance additive, thresholds: high (min 60) = aggressive sodium restriction <1500mg/day; moderate (min 35); low (min 0).
CSS: .genetic-trait.cyp11b2 { background: linear-gradient(135deg, #922B21 0%, #E74C3C 100%); color: #ffffff; }

NEW GENE 2: agtr1_hypertension
Gene "AGTR1", variant "rs5186". T allele 79% in African American cultures, 40-50% European, 20-30% East Asian.
GENE_META: agtr1_hypertension: { icon: '💓', title: 'Angiotensin Receptor & BP', cssClass: 'agtr1' },
GENERIC_GENE_CONFIG: inheritance additive, thresholds: high (min 60) = support aggressive sodium restriction and potassium-rich diet; moderate (min 35); low (min 0).
CSS: .genetic-trait.agtr1 { background: linear-gradient(135deg, #7B241C 0%, #F1948A 100%); color: #ffffff; }

For BOTH genes: add to genetics.json for all 66 cultures following the exact structure of "caffeine_metabolism" entries. Add to GENE_META (~line 1029), GENERIC_GENE_CONFIG (~line 1070), and style.css.
```

### BATCH 4: Behavior/Appetite Genes

**Prompt 4A — Satiety and Eating Behavior:**
```
Add three eating behavior genes. Reference "Research/research 30 january26.md" Part 3 (Satiety section).

NEW GENE 1: lepr_satiety
Gene "LEPR", variant "rs1137101" (Q223R). GG = 1.82x T2DM risk, increased energy intake. Frequencies vary modestly across populations (30-50% G allele).
GENE_META: lepr_satiety: { icon: '🍽️', title: 'Leptin Receptor & Satiety', cssClass: 'lepr' },
GENERIC_GENE_CONFIG: thresholds: high (min 40) = structured eating and portion control critical, monitor glucose; moderate (min 25); low (min 0).
CSS: .genetic-trait.lepr { background: linear-gradient(135deg, #6C3483 0%, #BB8FCE 100%); color: #ffffff; }

NEW GENE 2: bdnf_fat_appetite
Gene "BDNF", variant "rs6265" (Val66Met). Met allele 44.5% in East Asian cultures, 19% globally. Met carriers show hyperphagia specifically on FAT-RICH diets — not low-fat or high-sucrose.
GENE_META: bdnf_fat_appetite: { icon: '🧠', title: 'BDNF Fat Appetite', cssClass: 'bdnf' },
GENERIC_GENE_CONFIG: thresholds: high (min 35) = strictly limit dietary fat, low-fat diet more effective than general calorie restriction; moderate (min 15); low (min 0).
CSS: .genetic-trait.bdnf { background: linear-gradient(135deg, #1F618D 0%, #AED6F1 100%); color: #ffffff; }

NEW GENE 3: cd36_fat_taste
Gene "CD36", variant "rs1761667". AA genotype 25% in Europeans, causes higher fat detection thresholds leading to unconscious fat overconsumption.
GENE_META: cd36_fat_taste: { icon: '👅', title: 'Fat Taste Sensitivity', cssClass: 'cd36' },
GENERIC_GENE_CONFIG: thresholds: high (min 40) = higher fat detection threshold, practice mindful eating, use texture modifications to enhance satiety; moderate (min 20); low (min 0) = normal fat taste perception.
CSS: .genetic-trait.cd36 { background: linear-gradient(135deg, #784212 0%, #F0B27A 100%); color: #ffffff; }

For ALL three: add to genetics.json for all 66 cultures, GENE_META (~line 1029), GENERIC_GENE_CONFIG (~line 1070), and style.css. Follow "caffeine_metabolism" structure.
```

**Prompt 4B — FADS2 Vegetarian Adaptation:**
```
Add the gene fads2_vegetarian to the nutrigenomics system. Reference "Research/research 30 january26.md" Part 2 (South Asian section).

FILES TO MODIFY:
1. genetics.json — Add "fads2_vegetarian" for ALL 66 cultures. Gene "FADS2", variant "rs66698963" (22-bp insertion/deletion).
   Key frequencies: insertion allele 68-70% in South Asian cultures (south_india, north_india, west_india, bengal, nepal), 18% in European cultures, 30-40% in Middle Eastern cultures. Represents positive selection for plant-to-animal fatty acid conversion in populations with long vegetarian traditions.
   In phenotype_details: efficient EPA/DHA conversion from plants BUT also produces more pro-inflammatory arachidonic acid. Traditional diets with balanced fatty acids (mustard oil, ghee) more compatible than Western omega-6-heavy vegetable oils.
   Follow the exact JSON structure of "caffeine_metabolism" entries.

2. js/genetics.js line ~1029 — Add to GENE_META:
   fads2_vegetarian: { icon: '🌱', title: 'Vegetarian Fat Adaptation', cssClass: 'fads2' },

3. js/genetics.js line ~1070 — Add to GENERIC_GENE_CONFIG:
   fads2_vegetarian: {
     freqPath: 'allele_frequency_percent',
     inheritance: 'additive',
     thresholds: [
       { min: 50, phenotype: 'High Plant Fat Conversion', rec: '🌱 <strong>Efficient converter:</strong> Good EPA/DHA synthesis from plants, but reduce omega-6 vegetable oils (corn, soybean) to limit arachidonic acid. Favor mustard oil, olive oil, or ghee.' },
       { min: 25, phenotype: 'Moderate Plant Fat Conversion', rec: '🌱 <strong>Moderate conversion:</strong> Some benefit from plant omega-3 sources, supplement with fish oil if not vegetarian' },
       { min: 0, phenotype: 'Low Plant Fat Conversion', rec: '🌱 <strong>Low conversion:</strong> Rely on preformed EPA/DHA from fish, fish oil, or algae supplements rather than plant ALA sources' }
     ]
   }

4. style.css — Add:
   .genetic-trait.fads2 { background: linear-gradient(135deg, #1E8449 0%, #ABEBC6 100%); color: #333333; }
```

### BATCH 5: Chrononutrition and Sensitivity

**Prompt 5A — Circadian/Chrononutrition Genes:**
```
Add two chrononutrition genes. Reference "Research/research 30 january26.md" Part 3 (Circadian section).

NEW GENE 1: clock_chronotype
Gene "CLOCK", variant "rs1801260" (3111T>C). C allele = evening chronotype, increased waist-to-hip ratio. Moderate population variation (20-35% C allele across populations).
GENE_META: clock_chronotype: { icon: '🕐', title: 'Circadian Meal Timing', cssClass: 'clock' },
GENERIC_GENE_CONFIG: thresholds: high (min 30) = evening chronotype risk, avoid eating within 2hrs of sleep, front-load calories to morning/afternoon; moderate (min 15); low (min 0) = standard meal timing fine.
CSS: .genetic-trait.clock { background: linear-gradient(135deg, #1A237E 0%, #7986CB 100%); color: #ffffff; }

NEW GENE 2: per1_meal_timing
Gene "PER1", variant "rs2735611". Associated with 11.6% decrease in long-term weight gain with consistent meal timing.
GENE_META: per1_meal_timing: { icon: '⏰', title: 'Meal Regularity Response', cssClass: 'per1' },
GENERIC_GENE_CONFIG: thresholds: high (min 35) = consistent meal timing within 1-hour daily window especially beneficial; moderate (min 20); low (min 0).
CSS: .genetic-trait.per1 { background: linear-gradient(135deg, #0D47A1 0%, #90CAF9 100%); color: #ffffff; }

For BOTH: add to genetics.json for all 66 cultures, GENE_META (~line 1029), GENERIC_GENE_CONFIG (~line 1070), and style.css. Follow "caffeine_metabolism" structure.
```

**Prompt 5B — Histamine and Caffeine Sensitivity:**
```
Add two sensitivity genes. Reference "Research/research 30 january26.md" Part 3 (Histamine and caffeine section).

NEW GENE 1: dao_histamine
Gene "AOC1" (DAO enzyme), variant "rs2052129". TT = lowest DAO activity, causes histamine intolerance in 79% of symptomatic individuals. Frequencies: 15-25% across most populations.
GENE_META: dao_histamine: { icon: '🧀', title: 'Histamine Tolerance (DAO)', cssClass: 'dao' },
GENERIC_GENE_CONFIG: thresholds: high (min 30) = likely histamine intolerant, avoid aged cheese, fermented foods, cured meats, wine, consider DAO supplements; moderate (min 15); low (min 0) = normal histamine tolerance.
CSS: .genetic-trait.dao { background: linear-gradient(135deg, #B71C1C 0%, #EF9A9A 100%); color: #ffffff; }

NEW GENE 2: adora2a_caffeine_anxiety
Gene "ADORA2A", variant "rs5751876". TT = anxiety after 100-150mg caffeine. CC = caffeine-induced insomnia. This is SEPARATE from CYP1A2 caffeine metabolism speed.
GENE_META: adora2a_caffeine_anxiety: { icon: '😰', title: 'Caffeine Sensitivity (Anxiety)', cssClass: 'adora2a' },
GENERIC_GENE_CONFIG: thresholds: high (min 40) = caffeine-sensitive, limit to <100mg/day for anxiety management OR avoid after noon for insomnia; moderate (min 25); low (min 0) = normal caffeine tolerance.
CSS: .genetic-trait.adora2a { background: linear-gradient(135deg, #4A148C 0%, #CE93D8 100%); color: #ffffff; }

For BOTH: add to genetics.json for all 66 cultures, GENE_META (~line 1029), GENERIC_GENE_CONFIG (~line 1070), and style.css. Follow "caffeine_metabolism" structure.
```

### BATCH 6: Founder/Regional Variants

**Prompt 6A — Pacific Islander Gout Panel:**
```
Add two gout-related genes critical for Pacific Islander populations. Reference "Research/research 30 january26.md" Part 2 (Pacific Islander section).

NEW GENE 1: abcg2_gout
Gene "ABCG2", variant "rs2231142". Key frequencies: 31.1% Samoans, 45.8% Filipinos, 9.4% Europeans, 1-3% Africans.
GENE_META: abcg2_gout: { icon: '🦶', title: 'Uric Acid Transport (Gout)', cssClass: 'abcg2' },
GENERIC_GENE_CONFIG: thresholds: high (min: 25) = elevated gout risk, strict purine restriction (limit organ meats, shellfish, beer), increase hydration; moderate (min 10); low (min 0).
CSS: .genetic-trait.abcg2 { background: linear-gradient(135deg, #4A235A 0%, #D2B4DE 100%); color: #ffffff; }

NEW GENE 2: slc2a9_urate
Gene "SLC2A9", variant "rs734553". Essentially FIXED (98-100%) in Pacific Islander cultures vs 75.5% European. Affects urate handling.
GENE_META: slc2a9_urate: { icon: '🦶', title: 'Urate Metabolism', cssClass: 'slc2a9' },
GENERIC_GENE_CONFIG: thresholds: high (min 90) = near-universal variant, prioritize hydration and purine restriction as baseline lifestyle; moderate (min 70); low (min 0).
CSS: .genetic-trait.slc2a9 { background: linear-gradient(135deg, #512E5F 0%, #AF7AC5 100%); color: #ffffff; }

For BOTH: add to genetics.json for all 66 cultures, GENE_META (~line 1029), GENERIC_GENE_CONFIG (~line 1070), and style.css. Follow "caffeine_metabolism" structure.
```

**Prompt 6B — Middle Eastern LP and Ashkenazi Variants:**
```
This prompt has two parts.

PART 1: The Middle Eastern lactase persistence variant T/G-13915 (rs41380347) should already be handled by Batch 1A (African Lactase Persistence Alleles prompt). Verify that prompt was completed and that the following cultures have non-zero middle_eastern_allele_tg13915 values in genetics.json: arabian, med_levant, mesopotamian, kurdish, persian, maghreb, nile_valley, caucasus. If not, add them with frequencies of 60-80% for pastoralist cultures, 30-50% for mixed cultures.

PART 2: Add ashkenazi_ldlr_fh gene for familial hypercholesterolemia screening.
Gene "LDLR", variant "G197del". Carrier frequency 1:67-69 in Ashkenazi populations (highest globally), 1:250-500 general European population.
This is relevant primarily for eastern_europe and western_europe cultures (where Ashkenazi diaspora concentrated).
GENE_META: ashkenazi_ldlr_fh: { icon: '❤️', title: 'Familial Hypercholesterolemia', cssClass: 'ldlr-fh' },
GENERIC_GENE_CONFIG: inheritance 'dominant', thresholds: high (min 1) = elevated FH carrier frequency, screen LDL cholesterol early, statin therapy may be needed, limit saturated fat strictly; low (min 0) = standard screening.
CSS: .genetic-trait.ldlr-fh { background: linear-gradient(135deg, #C0392B 0%, #F5B7B1 100%); color: #ffffff; }

For genetics.json: most cultures should be 0% or near-0%. Eastern/Western European cultures: 0.2-0.4% (general population carrier rate). The Ashkenazi-specific frequency (1.5%) cannot be captured well since there is no dedicated Ashkenazi culture in the app — note this limitation in the phenotype_details.

Add to GENE_META (~line 1029), GENERIC_GENE_CONFIG (~line 1070), and style.css.
```

---

CHANGES

  1. Features to Make It More Insightful & Useable

  Immediate Value Additions
  ┌───────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │            Feature            │                                                                                          Why It Matters                                                                                          │
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ *****Genetic trait explanations    │ Users see "Lactase Persistence: 72%" but may not understand what to do with that. Add actionable tooltips: "You likely tolerate dairy well. Consider including yogurt, kefir, and aged cheeses." │ -->
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ *****Food sensitivity warnings     │ Highlight potential issues: "Your ancestry suggests lower alcohol metabolism (ALDH2) - you may experience flush response"                                                                        │ -->
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Meal plan generator           │ Translate recommendations into concrete weekly meal examples combining recommended proteins, staples, and cooking methods                                                                        │
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Nutrient gap analysis         │ Compare their ancestral diet profile against modern nutritional guidelines - show where traditional diets excel vs. where supplementation might help                                             │
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ ✅ DONE "Why this food?" explanations │ For each recommended food, show why it appears - "Fermented dairy appears because your Nordic ancestry has 89% lactase persistence"                                                              │
  └───────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  Engagement & Discovery
  ┌────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                Feature                 │                                                      Why It Matters                                                       │
  ├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ *****Comparison mode                   │ Let users compare two ancestry profiles side-by-side (e.g., their profile vs. a partner's, or two historical populations) │
  ├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "What if" scenarios                    │ "What if one grandparent was X instead?" - helps users explore sensitivity of results                                     │
  ├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ *****Ancestry deep-dives                    │ Expandable sections for each ancestry showing historical context, migration patterns, and how the diet evolved            │ -->
  <!-- ├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ *****Genetic trait breakdown by grandparent │ Show which grandparent contributed which traits - makes inheritance tangible                                              │ -->
  └────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  Usability Improvements
  ┌───────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
  │                Feature                │                                    Why It Matters                                     │
  ├───────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ ✅ DONE Progress indicator during calculation │ The genetics calculations are complex - show users something is happening        │
  ├───────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ ✅ DONE Results export (PDF/image)            │ Users want to save/share their results                                          │
  ├───────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ *****Simplified "key takeaways" summary       │ Before the detailed breakdown: "Your top 3 dietary strengths" and "3 things to watch" │
  ├───────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ ✅ DONE Glossary/education section            │ Define terms like "lactase persistence", "AMY1 copy number" for lay audiences   │
  └───────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
  ---
  2. Features to Make This Shippable

  Critical for Launch
  ┌──────────────────────────────────┬──────────┬────────────────────────────────────────────────────────────────────────────────────┐
  │             Feature              │ Priority │                                     Rationale                                      │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Mobile-first responsive redesign │ High     │ Current CSS has responsive elements but needs polish for thumb-friendly mobile use │ -->
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ *****Loading states & error handling  │ High     │ Graceful fallbacks if JSON fails to load, clear error messages                │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ *****Accessibility (a11y)             │ High     │ ARIA labels, keyboard navigation, screen reader support, color contrast       │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ ✅ DONE Privacy policy & disclaimers  │ High     │ "This is educational, not medical advice" - legally necessary                 │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ SEO & meta tags                  │ Medium   │ Open Graph tags for social sharing, proper meta descriptions                       │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ Analytics integration            │ Medium   │ Understand how users interact (what ancestries are most selected, drop-off points) │
  └──────────────────────────────────┴──────────┴────────────────────────────────────────────────────────────────────────────────────┘
  Differentiating Features
  ┌────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │          Feature           │                                               Why It Ships                                               │
  ├────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ DNA test import            │ Let users upload 23andMe/AncestryDNA raw data or paste ethnicity percentages directly - removes friction │
  ├────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ *****Shareable results URLs     │ Generate unique links like yourapp.com/results/abc123 - viral potential                                  │ -->
  ├────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Email capture with results │ "Get your full report emailed" - builds user list for future features                                    │
  ├────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ *****Printable report           │ Clean, formatted PDF that looks professional                                                             │ -->
  └────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  Trust & Credibility
  ┌──────────────────────────────┬───────────────────────────────────────────────────────────────────────┐
  │           Feature            │                            Why It Matters                             │
  ├──────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ *****Sources & citations          │ Link genetic traits to actual studies (you have good data - cite it)  │
  ├──────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ ✅ DONE "How we calculate this" page │ Transparency about Hardy-Weinberg, Mendelian inheritance methodology  │
  ├──────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ Expert review badge          │ If reviewed by a geneticist or nutritionist, display that prominently │
  ├──────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ Version history / changelog  │ Shows the app is maintained and improving                             │
  └──────────────────────────────┴───────────────────────────────────────────────────────────────────────┘
  Monetization Paths (if relevant)
  ┌───────────────────┬──────────────────────────────────────────────────────────────────────────┐
  │       Model       │                              Implementation                              │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ Freemium          │ Basic results free, detailed trait breakdown / meal plans behind paywall │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ One-time purchase │ Full PDF report for $5-10                                                │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ Affiliate         │ Link to recommended foods on Amazon/Thrive Market with affiliate tags    │
  └───────────────────┴──────────────────────────────────────────────────────────────────────────┘