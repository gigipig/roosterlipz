# Batch 6: Longevity Genes

Population frequency data for 4 longevity-related genes across 66 populations.

## Key Findings

| Gene | Key Pattern | Notable |
|------|-------------|---------|
| **TERT** | C allele higher in Europeans (53%) than East Asians (43%) | Associated with telomere length |
| **Klotho KL-VS** | ~15% Europeans, **ABSENT** in East Asians | Dramatic population difference |
| **CETP I405V** | V allele >30% globally | Protective in Ashkenazi, RISK in Chinese |
| **APOE** | ε4 highest in hunter-gatherers (26-41%), lowest in agricultural (7-10%) | ε2 protective, absent in Native Americans |

---

## Output 1: genetics-reference.json

```json
{
  "tert_telomere": {
    "gene": "TERT",
    "variant": "rs2736100",
    "chromosome": "5p15.33",
    "change": "A>C (intronic)",
    "inheritance": "additive",
    "notes": "C allele associated with longer telomeres and enhanced telomerase activity. Higher in European populations (53%) than East Asian (43%).",
    "phenotype_templates": {
      "enhanced_maintenance": {
        "name": "Enhanced Telomere Maintenance",
        "dietary_impact": "Strong baseline telomere support; benefits from antioxidant-rich diet to protect telomeres from oxidative stress"
      },
      "standard_maintenance": {
        "name": "Standard Telomere Maintenance",
        "dietary_impact": "Benefits from telomere-supportive nutrients: omega-3s, vitamin D, folate, B12, and polyphenol-rich foods"
      }
    },
    "dietary_recommendation": {
      "notes": "All genotypes benefit from telomere-protective nutrition: omega-3 fatty acids, vitamin D, folate and B12, polyphenols from berries and green tea. Mediterranean diet pattern consistently associated with longer telomeres."
    }
  },
  "klotho_aging": {
    "gene": "KL",
    "variant": "rs9536314 (F352V)",
    "chromosome": "13q12",
    "change": "T>G (F352V)",
    "inheritance": "heterozygote_advantage",
    "notes": "KL-VS haplotype present in ~15% of Caucasians as heterozygotes, ~1% homozygotes. ABSENT in East Asian populations (0/874 Koreans). Present in South Asians (Indians). Heterozygotes show longevity and cognitive benefits.",
    "phenotype_templates": {
      "longevity_variant": {
        "name": "Longevity-Associated Variant (KL-VS)",
        "dietary_impact": "Heterozygous KL-VS associated with enhanced cognitive aging and longevity; benefits from phosphate-balanced diet and adequate vitamin D"
      },
      "standard_klotho": {
        "name": "Standard Klotho Function",
        "dietary_impact": "Standard Klotho signaling; benefits from phosphate moderation, vitamin D adequacy, and mineral balance"
      }
    },
    "dietary_recommendation": {
      "notes": "Klotho regulates phosphate and vitamin D metabolism. Moderate phosphate intake (limit processed foods), adequate vitamin D, magnesium sufficiency."
    }
  },
  "cetp_longevity": {
    "gene": "CETP",
    "variant": "rs5882 (I405V)",
    "chromosome": "16q21",
    "change": "A>G (I405V)",
    "inheritance": "codominant",
    "notes": "V allele frequency >30% in most populations. VV genotype associated with longevity in Ashkenazi Jews. CAUTION: Shows OPPOSITE effect in East Asian populations where VV is a RISK genotype.",
    "phenotype_templates": {
      "longevity_lipids": {
        "name": "Longevity Lipid Profile",
        "dietary_impact": "VV genotype associated with favorable HDL in Western diets; benefits from heart-healthy fats"
      },
      "standard_lipids": {
        "name": "Standard Lipid Metabolism",
        "dietary_impact": "Standard CETP activity; benefits from omega-3s, olive oil, avoiding trans fats"
      }
    },
    "dietary_recommendation": {
      "notes": "CETP effect is population and diet-dependent. Replace saturated/trans fats with unsaturated fats, omega-3 rich fish, olive oil, nuts."
    }
  },
  "apoe_brain_health": {
    "gene": "APOE",
    "variant": "rs429358 + rs7412",
    "chromosome": "19q13.32",
    "change": "Defines ε2/ε3/ε4 haplotypes",
    "inheritance": "codominant",
    "notes": "Three major alleles: ε4 (ancestral, 14-25% globally), ε3 (most common), ε2 (protective, 0-15%). ε4 highest in hunter-gatherers (Pygmies 41%, Khoi San 37%), lowest in agricultural populations (Mediterranean 7-10%). ε2 absent in Native Americans.",
    "phenotype_templates": {
      "enhanced_clearance": {
        "name": "Enhanced Lipid Clearance (ε2 carrier)",
        "dietary_impact": "ε2 associated with efficient lipid clearance and brain protection; flexible dietary fat intake"
      },
      "balanced_metabolism": {
        "name": "Balanced Lipid Metabolism (ε3/ε3)",
        "dietary_impact": "Most common genotype; benefits from Mediterranean-style diet"
      },
      "efficient_absorption": {
        "name": "Efficient Fat Absorption (ε4 carrier)",
        "dietary_impact": "Ancestral genotype; benefits from lower saturated fat, higher omega-3, DHA supplementation"
      }
    },
    "dietary_recommendation": {
      "notes": "ε4 carriers benefit most from: reduced saturated fat, increased omega-3/DHA, Mediterranean/MIND diet, limiting alcohol. ε2 carriers have more dietary flexibility."
    }
  }
}
```

---

## Output 2: genetics-frequencies.json (Selected Populations)

```json
{
  "populations": {
    "japan": {
      "tert_telomere": { "f": 43, "t": "enhanced_maintenance", "notes": "Direct data: 42.6% C allele" },
      "klotho_aging": { "f": 0, "t": "standard_klotho", "notes": "CONFIRMED ABSENT in East Asians" },
      "cetp_longevity": { "f": 9, "t": "standard_lipids", "notes": "CAUTION: VV is RISK genotype in East Asians" },
      "apoe_brain_health": { "f_e2": 4, "f_e4": 10, "t": "balanced_metabolism" }
    },
    "korea": {
      "tert_telomere": { "f": 43, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 0, "t": "standard_klotho", "notes": "0/874 Koreans tested" },
      "cetp_longevity": { "f": 9, "t": "standard_lipids" },
      "apoe_brain_health": { "f_e2": 4, "f_e4": 10, "t": "balanced_metabolism" }
    },
    "nordic": {
      "tert_telomere": { "f": 53, "t": "enhanced_maintenance", "notes": "Swedish direct: 53% C allele" },
      "klotho_aging": { "f": 15, "t": "longevity_variant" },
      "cetp_longevity": { "f": 12, "t": "longevity_lipids" },
      "apoe_brain_health": { "f_e2": 8, "f_e4": 19, "t": "efficient_absorption", "notes": "Finnish ε4 highest in Europe" }
    },
    "western_europe": {
      "tert_telomere": { "f": 52, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 15, "t": "longevity_variant", "notes": "~25% heterozygotes" },
      "cetp_longevity": { "f": 12, "t": "longevity_lipids", "notes": "VV protective; Ashkenazi studies" },
      "apoe_brain_health": { "f_e2": 8, "f_e4": 15, "t": "balanced_metabolism" }
    },
    "west_africa": {
      "tert_telomere": { "f": 47, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 8, "t": "longevity_variant" },
      "cetp_longevity": { "f": 13, "t": "longevity_lipids" },
      "apoe_brain_health": { "f_e2": 11, "f_e4": 22, "t": "efficient_absorption", "notes": "High both ε2 and ε4" }
    },
    "central_africa": {
      "tert_telomere": { "f": 47, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 8, "t": "longevity_variant" },
      "cetp_longevity": { "f": 13, "t": "longevity_lipids" },
      "apoe_brain_health": { "f_e2": 11, "f_e4": 25, "t": "efficient_absorption", "notes": "Pygmies 41% ε4" }
    },
    "southern_africa": {
      "tert_telomere": { "f": 47, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 8, "t": "longevity_variant" },
      "cetp_longevity": { "f": 13, "t": "longevity_lipids" },
      "apoe_brain_health": { "f_e2": 11, "f_e4": 30, "t": "efficient_absorption", "notes": "Khoi San 37% ε4" }
    },
    "aboriginal_aus": {
      "tert_telomere": { "f": 45, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 0, "t": "standard_klotho" },
      "cetp_longevity": { "f": 12, "t": "longevity_lipids" },
      "apoe_brain_health": { "f_e2": 5, "f_e4": 26, "t": "efficient_absorption", "notes": "High ε4 reflects hunter-gatherer ancestry" }
    },
    "inuit": {
      "tert_telomere": { "f": 40, "t": "standard_maintenance" },
      "klotho_aging": { "f": 0, "t": "standard_klotho" },
      "cetp_longevity": { "f": 7, "t": "standard_lipids" },
      "apoe_brain_health": { "f_e2": 0, "f_e4": 22, "t": "efficient_absorption", "notes": "ε4 advantageous for high-fat Arctic diet; ε2 absent" }
    },
    "amazon": {
      "tert_telomere": { "f": 40, "t": "standard_maintenance" },
      "klotho_aging": { "f": 0, "t": "standard_klotho" },
      "cetp_longevity": { "f": 10, "t": "standard_lipids" },
      "apoe_brain_health": { "f_e2": 0, "f_e4": 18, "t": "efficient_absorption", "notes": "ε2 absent in Native Americans" }
    },
    "med_southern": {
      "tert_telomere": { "f": 51, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 14, "t": "longevity_variant" },
      "cetp_longevity": { "f": 12, "t": "longevity_lipids" },
      "apoe_brain_health": { "f_e2": 7, "f_e4": 8, "t": "balanced_metabolism", "notes": "Lowest ε4 globally (7-10%)" }
    },
    "north_india": {
      "tert_telomere": { "f": 46, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 10, "t": "longevity_variant", "notes": "Present in Indian populations" },
      "cetp_longevity": { "f": 11, "t": "longevity_lipids" },
      "apoe_brain_health": { "f_e2": 4, "f_e4": 10, "t": "balanced_metabolism" }
    },
    "persian": {
      "tert_telomere": { "f": 49, "t": "enhanced_maintenance" },
      "klotho_aging": { "f": 0, "t": "standard_klotho", "notes": "Absent in Iranians (confirmed)" },
      "cetp_longevity": { "f": 10, "t": "longevity_lipids" },
      "apoe_brain_health": { "f_e2": 5, "f_e4": 9, "t": "balanced_metabolism" }
    }
  }
}
```

---

## Critical Implementation Notes

### 1. Klotho KL-VS: Dramatic Population Difference
- **Europeans**: ~15% carriers
- **East Asians**: **0%** (confirmed absent)
- **South Asians (Indians)**: Present (~10%)
- **Iranians/Persians**: Absent
- **Implication**: Cannot use KL-VS for East Asian users

### 2. CETP I405V: Trans-Ethnic Effect Reversal
**CRITICAL WARNING**:
- **Western populations**: VV = longevity protective
- **East Asian populations**: VV = RISK factor
- **Implication**: Must frame differently by ancestry

### 3. APOE ε4: Thrifty Gene Hypothesis
- Highest in hunter-gatherers (Pygmies 41%, Khoi San 37%)
- Lowest in agricultural populations (Mediterranean 7-10%)
- ε4 may be BENEFICIAL for traditional high-fat diets
- **ε2 is ABSENT** in Native Americans

## Sources
- gnomAD v4.1.0, 1000 Genomes Phase 3
- Korean KL-VS study (n=874)
- Swedish/Chinese TERT comparison
- Ashkenazi centenarian CETP studies
- Global APOE distribution reviews
