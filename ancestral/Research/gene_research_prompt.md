# Research Agent Prompt — New Gene Data for Ancestral Diet Explorer

## Your task

You are a population genetics and nutrigenomics research agent. You must research allele frequencies and dietary phenotype data for **9 specific genes** across **66 ancestral populations**, then produce three output files that can be dropped directly into a live application with zero reformatting.

Do not summarise. Do not explain your reasoning inline. Produce the output files exactly as specified.

---

## Application context

The app calculates personalised dietary recommendations by blending each user's ancestral genetic heritage. For each population, it stores:

1. **Static gene metadata** — `public/genetics-reference.json` — one entry per trait; same regardless of population. Includes gene symbol, key SNP, inheritance pattern, phenotype templates, and dietary recommendations.

2. **Population-frequency data** — `public/genetics-frequencies.json` — one entry per population × trait; stores allele frequencies, phenotype probabilities, and inferred phenotypes using a compressed key format.

3. **Display metadata** — a `GENE_META` object in `lib/genetics.ts` — one entry per trait; stores icon, display title, and CSS class.

---

## The 9 genes to research

For each gene below, the **trait key** is the identifier used throughout the codebase. Use it exactly.

| # | Trait key | Gene(s) | Primary SNP(s) | Phenotype axis |
|---|---|---|---|---|
| 1 | `pon1_antioxidant` | PON1 | rs662 (Q192R), rs854560 (L55M) | paraoxonase activity: `fast` / `intermediate` / `slow` |
| 2 | `gckr_carb_sensitivity` | GCKR | rs1260326 (P446L) | carb sensitivity: `normal` / `intermediate` / `sensitive` |
| 3 | `fgf21_carb_preference` | FGF21 | rs838133, rs838145 | macronutrient preference: `fat_preferring` / `balanced` / `carb_preferring` |
| 4 | `apoa5_triglycerides` | APOA5 | rs662799 (-1131T>C) | triglyceride fat response: `normal` / `intermediate` / `elevated` |
| 5 | `slc6a4_serotonin` | SLC6A4 | 5-HTTLPR (L/S alleles — use rs25531 + insertion/deletion polymorphism) | serotonin transport: `efficient` / `intermediate` / `reduced` |
| 6 | `hnmt_histamine` | HNMT | rs1801105 (T939C) | intracellular histamine clearance: `normal` / `intermediate` / `reduced` |
| 7 | `cyp4f2_vitamin_e` | CYP4F2 | rs2108622 (V433M) | vitamin E/K catabolism: `normal` / `intermediate` / `reduced_catabolism` |
| 8 | `apoc3_omega3_response` | APOC3 | rs2854116, rs2854117 (C1/C2 haplotype) | omega-3 response: `responsive` / `intermediate` / `blunted` |
| 9 | `cyp19a1_phytoestrogen` | CYP19A1 | rs10046, rs4646 | phytoestrogen metabolism: `low_aromatase` / `moderate` / `high_aromatase` |

---

## The 66 population IDs

These are the exact string keys used in the application. Every population must have an entry for every trait in Output File 2.

```
aboriginal_aus, amazon, anatolian, andean, arabian, australian_coastal,
balkan, bengal, brazilian_coastal, california_coast, canadian_prairies,
caribbean_creole, caribbean_taino, caucasus, central_africa, central_asia,
central_europe, eastern_europe, eastern_woodlands, ethiopia, gaucho,
great_plains, highland_se_asia, horn_somalia, inuit, japan, korea, kurdish,
maasai, maghreb, malagasy, maori, med_levant, med_southern, melanesia,
mesoamerica, mesopotamian, mestizo_mesoamerican, micronesia, mongolia, nepal,
nile_valley, nilotic, nordic, north_china, north_india, pacific_nw, patagonia,
persian, polynesia, sahel, se_asia_island, se_asia_main, siberia,
sichuan_sw_china, south_china, south_india, southeast_us, southern_africa,
southwest_us, subarctic, sudanian, tibet, west_africa, west_india,
western_europe
```

**Proxy population rules** — when a specific population has no published data, use the closest documented genetic proxy and note it in the `notes` field. Acceptable proxies:

- Isolated/small island populations (micronesia, polynesia, melanesia, maori, pacific_nw, inuit, subarctic) → use nearest continental population data + apply known founder-effect adjustments
- Admixed populations (caribbean_creole, mestizo_mesoamerican, malagasy, brazilian_coastal, gaucho) → use weighted average of known source populations and note proportions
- Historical/archaeological populations (caribbean_taino, california_coast, eastern_woodlands, etc.) → use nearest modern descendant population data
- When no data exists: set `f` to the global average and set `pc: 0` (zero confidence) with a note explaining

---

## Primary research sources (use in priority order)

1. **gnomAD v3.1.2** (gnomad.broadinstitute.org) — allele frequencies by superpopulation (AFR, AMR, EAS, EUR, MID, SAS, ASJ, FIN). This is your primary source for `f` values.
2. **1000 Genomes Phase 3** — finer population stratification where gnomAD superpopulations are too coarse
3. **Ensembl / NCBI ClinVar** — variant metadata and inheritance
4. **Published GWAS / meta-analyses** — for phenotype probabilities and dietary-impact estimates
5. **PopHuman / ALFRED database** — for populations not covered by gnomAD

**gnomAD → app population mapping guide:**

| gnomAD | App populations |
|---|---|
| AFR | west_africa, central_africa, southern_africa, maasai, ethiopia, horn_somalia, nilotic, sudanian, sahel |
| EAS | japan, korea, north_china, south_china, sichuan_sw_china, se_asia_main, se_asia_island, highland_se_asia |
| EUR | western_europe, central_europe, eastern_europe, balkan |
| FIN | nordic (partial) |
| SAS | north_india, south_india, bengal, west_india |
| MID | arabian, persian, med_levant, anatolian, mesopotamian, kurdish |
| AMR | andean, amazon, mesoamerica, caribbean_taino |
| ASJ | use for reference only; no direct app population |

Populations requiring literature lookup (no gnomAD direct match): aboriginal_aus, australian_coastal, inuit, subarctic, pacific_nw, polynesia, melanesia, micronesia, maori, tibet, mongolia, central_asia, siberia, caucasus, maghreb, nile_valley, patagonia, gaucho, malagasy

---

## Exact output schemas

### Output File 1 — `gene-reference-additions.json`

One entry per trait. This file will be **merged** into the existing `genetics-reference.json` under its `traits` object.

```json
{
  "traits": {
    "pon1_antioxidant": {
      "gene": "PON1",
      "genes": ["PON1"],
      "variant": "rs662 (Q192R) + rs854560 (L55M)",
      "inheritance": "additive",
      "risk_allele": "R (rs662)",
      "phenotype_details": {
        "name": "Intermediate Paraoxonase Activity",
        "dietary_impact": "[default dietary impact text for intermediate phenotype]"
      },
      "dietary_recommendation": {
        "oxidised_fat_sensitivity": "moderate",
        "recommended_sources": ["[list]"],
        "limit": ["[list]"],
        "notes": "[clinical note]"
      },
      "phenotype_templates": {
        "fast": {
          "name": "High Paraoxonase Activity",
          "dietary_impact": "[text]"
        },
        "intermediate": {
          "name": "Moderate Paraoxonase Activity",
          "dietary_impact": "[text]"
        },
        "slow": {
          "name": "Low Paraoxonase Activity",
          "dietary_impact": "[text — more sensitive to oxidised/processed fats; prioritise antioxidant-rich foods alongside dietary fats]"
        }
      }
    }
    // ... repeat for all 9 traits
  }
}
```

**Required fields per entry:** `gene`, `genes` (array), `variant`, `inheritance`, `phenotype_details`, `dietary_recommendation`, `phenotype_templates` (one key per phenotype type listed in the gene table above).

The `dietary_recommendation` object should include actionable fields appropriate to the gene — e.g. for PON1: `oxidised_fat_sensitivity`, `recommended_antioxidants`, `limit`; for SLC6A4: `tryptophan_priority`, `carbohydrate_approach`, `meal_timing_note`.

---

### Output File 2 — `gene-frequencies-additions.json`

One entry per population containing all 9 new traits. This file will be **merged** into the existing `genetics-frequencies.json` — each population object will have the 9 new trait keys added to it.

**Compressed key format — use exactly these abbreviations:**

| Compressed key | Meaning | Type |
|---|---|---|
| `f` | allele frequency percent of the effect/risk allele (0–100) | number |
| `p` | phenotype probability (0.0–1.0) — probability of the named `t` phenotype | number |
| `t` | inferred phenotype string (must match a key in the trait's `phenotype_templates`) | string |
| `pc` | population confidence (0–1) — use 1 for well-sourced, 0.5 for proxy, 0 for global average fallback | number |
| `desc` | brief human-readable description of the population's pattern (1–2 sentences) | string |
| `notes` | source note, proxy explanation, or clinical caveat | string |

**SLC6A4 special case:** because 5-HTTLPR is a length polymorphism (not a standard SNP), store the S allele frequency as `f` (0–100), derive `p` from S/S + S/L genotype probability using Hardy-Weinberg, and add a `"method": "HTTLPR_HWE"` field.

**APOC3 special case:** two SNPs form a haplotype. Store the C2 haplotype frequency as `f`, and add `"snps": { "rs2854116": { "f": [value] }, "rs2854117": { "f": [value] } }`.

```json
{
  "aboriginal_aus": {
    "pon1_antioxidant": {
      "f": 62,
      "p": 0.62,
      "t": "intermediate",
      "pc": 0.5,
      "desc": "Moderate R allele frequency; intermediate paraoxonase activity. Traditional diet rich in native animal fats with limited processed fat exposure.",
      "notes": "Proxy: using Australian Indigenous data from Baker Heart Institute studies. Limited gnomAD coverage for this population."
    },
    "gckr_carb_sensitivity": { ... },
    "fgf21_carb_preference": { ... },
    "apoa5_triglycerides": { ... },
    "slc6a4_serotonin": { ... },
    "hnmt_histamine": { ... },
    "cyp4f2_vitamin_e": { ... },
    "apoc3_omega3_response": { ... },
    "cyp19a1_phytoestrogen": { ... }
  },
  "amazon": { ... },
  // ... all 66 populations
}
```

Every population must have all 9 trait keys. Never omit a population or trait — use the fallback rule (global average + `pc: 0`) if data is unavailable.

---

### Output File 3 — `gene-meta-additions.txt`

A plain text block containing the 9 GENE_META entries to be added to `lib/genetics.ts`. Format exactly as:

```javascript
// === NEW GENE_META ENTRIES — add inside the GENE_META object ===
pon1_antioxidant:       { icon: '🫒', title: 'Antioxidant Protection',     cssClass: 'pon1' },
gckr_carb_sensitivity:  { icon: '🍞', title: 'Carb Sensitivity',           cssClass: 'gckr' },
fgf21_carb_preference:  { icon: '🍬', title: 'Carb vs Fat Preference',     cssClass: 'fgf21' },
apoa5_triglycerides:    { icon: '🥩', title: 'Fat & Triglycerides',        cssClass: 'apoa5' },
slc6a4_serotonin:       { icon: '🧠', title: 'Serotonin & Cravings',       cssClass: 'slc6a4' },
hnmt_histamine:         { icon: '🫙', title: 'Histamine Clearance (HNMT)', cssClass: 'hnmt' },
cyp4f2_vitamin_e:       { icon: '🫑', title: 'Vitamin E Metabolism',       cssClass: 'cyp4f2' },
apoc3_omega3_response:  { icon: '🐠', title: 'Omega-3 Response',           cssClass: 'apoc3' },
cyp19a1_phytoestrogen:  { icon: '🌿', title: 'Phytoestrogen Metabolism',   cssClass: 'cyp19a1' },
```

You may adjust icons to better fit each trait's biological meaning, but keep the same trait keys and cssClass format.

---

## Quality requirements

1. **Every `t` value must exactly match a key in that trait's `phenotype_templates`** in Output File 1. Mismatches will break the rendering pipeline.

2. **`f` is always 0–100 (percent), `p` is always 0.0–1.0.** Do not swap them.

3. **For PON1**, research *both* rs662 and rs854560 — the combined haplotype (QQ/QR/RR × LL/LM/MM) is what determines functional activity. Derive a combined phenotype from the two-locus genotype. If full haplotype data is unavailable, prioritise rs662 and note it.

4. **For SLC6A4**, note that the biallelic S/S genotype — not mere S carrier status — drives the strongest dietary tryptophan response. Phenotype `reduced` = S/S; `intermediate` = L/S; `efficient` = L/L. Use Hardy-Weinberg to derive probabilities from allele frequency.

5. **For FGF21**, distinguish between rs838133 (sweet/alcohol preference) and rs838145 (fat vs. carb preference axis). If haplotype data is available use it; otherwise report whichever SNP has the stronger dietary association per the literature.

6. **Write `desc` from the perspective of that population's ancestral diet** — e.g. for a starch-heavy agricultural population with sensitive GCKR, note that the traditional diet was low-glycaemic millet/teff, not refined grains. This field appears in the UI.

7. **Do not invent frequencies.** If a population has no published data and no reasonable proxy, set `f` to the global minor allele frequency, set `pc: 0`, and write in `notes`: `"No population-specific data. Using global MAF as fallback (gnomAD v3.1.2). Treat as uncertain."`

8. **Cite sources inline in `notes` fields** using short format: e.g. `"gnomAD v3.1.2 AFR"`, `"1KGP Phase 3 EAS"`, `"Brophy 2002 (PMID:11799393)"`, `"proxy: SAS gnomAD adjusted for Tibetan altitude-selection literature"`.

---

## File naming

Save your three output files as:
- `gene-reference-additions.json`
- `gene-frequencies-additions.json`
- `gene-meta-additions.txt`

These names match the merge scripts that will process them. Do not use any other names.

---

## Scope check before you begin

Before generating output, confirm you have data for:
- [ ] All 9 genes × their primary SNPs
- [ ] All 66 population IDs covered (even if some use fallback)
- [ ] All phenotype `t` values match their `phenotype_templates` keys
- [ ] `f` range is 0–100 everywhere
- [ ] `p` range is 0.0–1.0 everywhere
- [ ] `pc` is set appropriately (1 / 0.5 / 0) for every entry
- [ ] `notes` cites a source or explains a proxy for every entry

Do not output partial results. Complete all 66 populations for all 9 genes before writing any file.
