# Gene Research Instructions

I'm building a genetic diet app that calculates ancestral diet recommendations based on grandparent ethnicities. I need population frequency data for positive genetic traits related to diet and metabolism.

> **Output format:** All results must be written as **JSON-formatted text** in your response — no markdown tables, no prose frequency lists. Structure your output exactly as shown in the examples below so it can be copied directly into the app's data files.

---

## Data Architecture (v6.0-split)

The genetics data is split into two files for efficiency:

### 1. `genetics-reference.json` - Static gene metadata (add once per gene)

```json
{
  "traits": {
    "sirt1_fasting": {
      "gene": "SIRT1",
      "variant": "rs7895833",
      "inheritance": "additive",
      "phenotype_templates": {
        "enhanced": {
          "name": "Enhanced Fasting Response",
          "dietary_impact": "Intermittent fasting may be especially beneficial"
        },
        "standard": {
          "name": "Standard Fasting Response",
          "dietary_impact": "Normal fasting adaptation"
        }
      },
      "dietary_recommendation": {
        "notes": "Time-restricted eating patterns may enhance metabolic benefits"
      }
    }
  }
}
```

### 2. `genetics-frequencies.json` - Population-specific data (add for each population)

Uses compressed keys to save space:

- `f` = allele_frequency_percent (0-100)
- `p` = phenotype_probability (0-1)
- `t` = phenotype template key (matches phenotype_templates above)
- `cn` = average_copy_number (for CNV genes like AMY1)
- `desc` = custom description (optional, for population-specific notes)
- `notes` = custom dietary notes (optional)

```json
{
  "populations": {
    "nordic": {
      "sirt1_fasting": {
        "f": 45,
        "p": 0.45,
        "t": "enhanced",
        "notes": "Higher frequency in Northern European populations"
      }
    },
    "japan": {
      "sirt1_fasting": {
        "f": 52,
        "p": 0.52,
        "t": "enhanced"
      }
    }
  }
}
```

---

## Target Populations (66 total)

Research data for these population IDs:

```
aboriginal_aus, amazon, anatolian, andean, arabian, australian_coastal,
balkan, bengal, brazilian_coastal, california_coast, canadian_prairies,
caribbean_creole, caribbean_taino, caucasus, central_africa, central_asia,
central_europe, eastern_europe, eastern_woodlands, ethiopia, gaucho,
great_plains, highland_se_asia, horn_somalia, inuit, japan, korea, kurdish,
maasai, maghreb, malagasy, maori, med_levant, med_southern, melanesia,
mesoamerica, mesopotamian, mestizo_mesoamerican, micronesia, mongolia,
nepal, nile_valley, nilotic, nordic, north_china, north_india, pacific_nw,
patagonia, persian, polynesia, sahel, se_asia_island, se_asia_main, siberia,
sichuan_sw_china, south_china, south_india, southeast_us, southern_africa,
southwest_us, subarctic, sudanian, tibet, west_africa, west_india, western_europe
```

---

## Research Output Format

**Output must be in JSON only — no markdown tables.** For each gene batch, provide TWO JSON outputs:

### Output 1: Reference Entry (one per gene)

The `beneficial_allele` field clarifies which allele the frequency data refers to. The `thresholds` field tells the app what frequency constitutes a "strong", "moderate", or "low" expression of the trait — used for generating dietary recommendations.

```json
{
  "gene_key": {
    "gene": "GENE_NAME",
    "variant": "rs number",
    "inheritance": "additive|dominant|recessive|codominant",
    "beneficial_allele": "A|G|T|C (whichever allele is stored in frequencies)",
    "thresholds": {
      "high": 65,
      "moderate": 40
    },
    "phenotype_templates": {
      "high": {
        "name": "Strong [Trait Name]",
        "dietary_impact": "Specific dietary advice for high frequency"
      },
      "moderate": {
        "name": "Moderate [Trait Name]",
        "dietary_impact": "Specific dietary advice for moderate frequency"
      },
      "low": {
        "name": "Standard [Trait Name]",
        "dietary_impact": "Specific dietary advice for low frequency"
      }
    }
  }
}
```

### Output 2: Frequency Data (one entry per population)

**Important:** Always store the **beneficial allele** frequency (not the risk allele). High frequency = stronger trait expression.

The `tier` field should always be included:
- `D` = directly measured in that population or genetic equivalent
- `P` = proxy from closely related population
- `E` = extrapolated from superpopulation or regional average

If a gene lacks sufficient cross-population data (fewer than 10 populations with D or P tier data), **skip it** and note the limitation rather than extrapolating for all 66 populations.

```json
{
  "population_id": {
    "gene_key": {
      "f": 0-100,
      "t": "high|moderate|low",
      "tier": "D|P|E",
      "notes": "Optional: population-specific notes only if meaningfully different"
    }
  }
}
```

---

## Research Batches

### Batch 1: Fasting & Metabolic Flexibility

| Gene     | Key                       | Focus                                 |
| -------- | ------------------------- | ------------------------------------- |
| SIRT1    | `sirt1_fasting`           | Fasting/longevity response, rs7895833 |
| PPARGC1A | `ppargc1a_metabolic_flex` | Fat/carb fuel switching, rs8192678    |
| FOXO3    | `foxo3_longevity_fasting` | Longevity variant, rs2802292          |
| PRKAA1/2 | `ampk_energy_sensing`     | Energy sensing efficiency             |

### Batch 2: Antioxidant Capacity

| Gene  | Key                 | Focus                           |
| ----- | ------------------- | ------------------------------- |
| SOD2  | `sod2_antioxidant`  | Superoxide defense, rs4880      |
| CAT   | `cat_antioxidant`   | Catalase activity               |
| GPX1  | `gpx1_selenium`     | Selenium utilization, rs1050450 |
| NRF2  | `nrf2_detox`        | Detox pathway activation        |
| GSTP1 | `gstp1_antioxidant` | Glutathione S-transferase       |

### Batch 3: Thermic Effect & Metabolism

| Gene  | Key                         | Focus                                |
| ----- | --------------------------- | ------------------------------------ |
| UCP1  | `ucp1_brown_fat`            | Brown fat activity                   |
| UCP2  | `ucp2_metabolic_rate`       | Metabolic rate                       |
| UCP3  | `ucp3_muscle_thermogenesis` | Muscle thermogenesis                 |
| DIO2  | `dio2_thyroid`              | Thyroid hormone activation, rs225014 |
| TRPM8 | `trpm8_cold_tolerance`      | Cold tolerance                       |

### Batch 4: Protein & Muscle

| Gene  | Key                | Focus                              |
| ----- | ------------------ | ---------------------------------- |
| ACTN3 | `actn3_power`      | Power/endurance balance, rs1815739 |
| MSTN  | `mstn_muscle`      | Muscle growth potential            |
| IL6   | `il6_recovery`     | Exercise recovery, rs1800795       |
| IGF1  | `igf1_growth`      | Growth factor response             |
| VEGF  | `vegf_circulation` | Circulation & oxygen delivery      |

### Batch 5: Gut Microbiome

| Gene | Key                 | Focus                     |
| ---- | ------------------- | ------------------------- |
| FUT2 | `fut2_secretor`     | Secretor status, rs601338 |
| MUC2 | `muc2_gut_barrier`  | Gut barrier function      |
| TLR4 | `tlr4_gut_immunity` | Gut immune response       |

### Batch 6: Longevity

| Gene   | Key                 | Focus                                  |
| ------ | ------------------- | -------------------------------------- |
| TERT   | `tert_telomere`     | Telomere maintenance                   |
| Klotho | `klotho_aging`      | Healthy aging, rs9536314               |
| CETP   | `cetp_longevity`    | Longevity lipids                       |
| APOE   | `apoe_brain_health` | Brain health & lipids, rs429358/rs7412 |

### Batch 7: Nutrient Absorption

| Gene    | Key                  | Focus                    |
| ------- | -------------------- | ------------------------ |
| SLC23A1 | `slc23a1_vitamin_c`  | Vitamin C absorption     |
| TCN2    | `tcn2_b12_transport` | B12 transport efficiency |
| SLC30A8 | `slc30a8_zinc`       | Zinc transport           |
| ATP7A   | `atp7a_copper`       | Copper metabolism        |

### Batch 8: Cholesterol & Lipids

| Gene  | Key                 | Focus                  |
| ----- | ------------------- | ---------------------- |
| PCSK9 | `pcsk9_ldl`         | LDL clearance          |
| APOA1 | `apoa1_hdl`         | HDL production         |
| LDLR  | `ldlr_cholesterol`  | Cholesterol receptor   |
| LPL   | `lpl_triglycerides` | Triglyceride clearance |

### Batch 9: Taste & Appetite

| Gene  | Key                   | Focus                    |
| ----- | --------------------- | ------------------------ |
| TRPV1 | `trpv1_spice`         | Spice tolerance          |
| CRHR1 | `crhr1_stress_eating` | Stress eating resilience |
| POMC  | `pomc_satiety`        | Satiety signaling        |
| NPY   | `npy_appetite`        | Appetite balance         |

---

## Research Requirements

1. **Cite sources**: GWAS studies, 1000 Genomes, gnomAD, published papers
2. **Positive framing**: Frame findings as strengths, not just risks
   - "Efficient fasting response" not "fasting intolerance risk"
   - "Strong antioxidant capacity" not "oxidative stress susceptibility"
3. **Population-specific notes**: Note any unique adaptations (e.g., thrifty gene hypothesis)
4. **Flag limited data**: Indicate where data is extrapolated or limited

---

## How to Add New Genes

### Step 1: Add to `genetics-reference.json`

Add the gene under `traits` with static metadata.

### Step 2: Add to `genetics-frequencies.json`

Add frequency data under each population in `populations`.

### Step 3: Add to `js/genetics.js`

1. Add to `GENE_META` (~line 1280) for display metadata
2. Add to `TRAIT_ANALYSIS_CONFIG` (~line 1918) for strength/watch thresholds

Example GENE_META entry:

```javascript
sirt1_fasting: { icon: '🧘', title: 'Fasting Adaptation (SIRT1)', cssClass: 'sirt1' },
```

Example TRAIT_ANALYSIS_CONFIG entry:

```javascript
sirt1_fasting: {
  valueGetter: t => t.frequency || t.allele_frequency_percent || 0,
  strengthMin: 30, strengthTitle: 'Fasting Adaptation',
  strengthDetail: () => 'Your SIRT1 genetics support intermittent fasting',
  strengthIcon: '🧘'
},
```

---

## Example Research Prompt

```
Research population frequency data for SIRT1 (rs7895833) fasting response variant.

I need:
1. Allele frequency (%) for the beneficial allele in these populations:
   nordic, japan, north_china, south_china, west_africa, ethiopia, etc.

2. Phenotype interpretation:
   - What frequency indicates "enhanced" fasting response?
   - What is "standard"?

3. Sources: gnomAD, 1000 Genomes, or published GWAS studies

Format output as JSON matching the genetics-frequencies.json structure.
```
