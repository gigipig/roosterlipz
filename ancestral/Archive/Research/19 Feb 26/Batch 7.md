# Batch 7: Nutrient Absorption Gene Frequencies

**Four nutrient absorption genes were researched across 66 global populations.** Three genes (SLC23A1, TCN2, SLC30A8) have well-characterized functional variants with robust population frequency data from gnomAD v4 and 1000 Genomes Phase 3. ATP7A lacks any common functional variant due to extreme purifying selection; ATP7B rs1061472 (K832R) is substituted as the closest copper-transport analog — this limitation is flagged throughout. Frequency values are scaled 0–100 representing beneficial allele percentage, with tier indicators (D/P/E) denoting data provenance.

## Key variant summary and population patterns

**SLC23A1 rs33972313** (G>A, Val264Met): The beneficial G allele maintains full SVCT1 vitamin C transporter function. It is near-fixed globally (94–100%), with the deleterious A allele enriched only in Europeans (~5%) and rare or absent in East Asians. Inheritance is **additive** (~6 µmol/L plasma vitamin C reduction per A allele). Because the beneficial allele is the overwhelmingly common reference allele, all 66 populations classify as "high" — this reflects genuine biology rather than data limitation.

**TCN2 rs1801198** (G>C, Arg259Pro): The beneficial C allele (Pro259) produces transcobalamin with superior B12 binding and cellular delivery. The meta-analysis by Oussalah et al. (2017) confirmed that the G allele (Arg259) reduces holotranscobalamin (SMD = −0.445, P < 0.001) and raises homocysteine. Inheritance is **codominant**. The C allele shows a strong continental gradient: **highest in Africa (~78–82%)**, intermediate in Europe (~55–60%) and the Americas (~64%), and **lowest in South Asia (~40%) and East Asia (~44%)**. This pattern reflects the C allele's status as the ancestral allele with drift or selection reducing its frequency outside Africa.

**SLC30A8 rs13266634** (C>T, Arg325Trp): The protective T allele reduces ZnT8 zinc transporter activity, conferring **65% lower type 2 diabetes risk** in loss-of-function carriers (Flannick et al. 2014). Inheritance is **additive**. The T allele frequency follows a classic out-of-Africa gradient: **lowest in sub-Saharan Africa (~6–8%)**, moderate in Europe (~28%) and South Asia (~25%), and **highest in East Asia (~43–48%)**. Finnish Europeans are notably elevated (~34%) relative to other Europeans.

**ATP7B rs1061472** (T>C, Lys832Arg) — *substituted for ATP7A*: The beneficial T allele (Lys832) maintains normal copper-transporting ATPase function, while the C allele (Arg832) reduces copper transport efficiency and raises labile serum copper. Inheritance is **additive**. The T allele is **highest in East Asia (~57–62%)**, moderate in Africa (~52%) and Europe (~38–42%), and **lowest in Middle Eastern populations (~31%)**. Data quality is limited — only ~10 populations have direct or close-proxy data; the rest are extrapolated.

## ATP7A limitation flag

**ATP7A has zero common functional variants (MAF > 1%).** The gene is under extreme purifying selection (81st percentile intolerance score in gnomAD). No GWAS for serum copper has identified signals at the ATP7A locus. All 143 known pathogenic ATP7A variants occur at frequencies below 0.1%. ATP7B rs1061472 is used as a functional proxy because it encodes the sister copper-transporting ATPase with a well-characterized common missense polymorphism affecting copper homeostasis. SELENBP1 rs2769264 (the strongest copper GWAS hit, P = 2.63 × 10⁻²⁰) was considered but lacked retrievable population-stratified frequency data. The `atp7a_copper` key is retained per specification, but the gene field reflects ATP7B.

## Data quality by tier across all genes

For SLC23A1, TCN2, and SLC30A8, approximately **13 populations have direct (D) tier data** from 1000 Genomes sub-populations or large biobank studies, **20–25 have proxy (P) tier** data from closely related reference populations, and **28–33 are extrapolated (E)**. For ATP7B, only **3 populations have D-tier data** and **~8–12 have P-tier data**, with the remainder extrapolated — this gene has the weakest evidence base. Populations with the least direct data across all genes include aboriginal_aus, melanesia, micronesia, patagonia, and subarctic, which rely entirely on extrapolation.

---

## Output 1: Reference entry (genetics-reference.json)

```json
{
  "slc23a1_vitamin_c": {
    "gene": "SLC23A1",
    "variant": "rs33972313",
    "inheritance": "additive",
    "beneficial_allele": "G",
    "thresholds": { "high": 65, "moderate": 40 },
    "phenotype_templates": {
      "high": {
        "name": "Enhanced Vitamin C Absorption",
        "dietary_impact": "SVCT1 transporter functions at full efficiency. Standard dietary vitamin C from fruits and vegetables is well absorbed and plasma levels are maintained effectively."
      },
      "moderate": {
        "name": "Moderate Vitamin C Absorption",
        "dietary_impact": "Slightly reduced SVCT1 transporter efficiency in some individuals. Emphasizing citrus fruits, berries, bell peppers, and leafy greens helps maintain optimal vitamin C status."
      },
      "low": {
        "name": "Standard Vitamin C Absorption",
        "dietary_impact": "Reduced SVCT1 activity may lower plasma vitamin C by approximately 6 umol/L per risk allele. Higher intake of vitamin C-rich foods or targeted supplementation supports optimal levels."
      }
    },
    "notes": "The beneficial G allele is near-fixed globally (94-100%). The minor A allele causing 40-50% reduced SVCT1 transport is concentrated in European populations (~5% MAF) and essentially absent in East Asians. Additional African-specific SLC23A1 variants (rs35817838, rs34521685) also reduce vitamin C transport but are not captured by this SNP."
  },
  "tcn2_b12_transport": {
    "gene": "TCN2",
    "variant": "rs1801198",
    "inheritance": "codominant",
    "beneficial_allele": "C",
    "thresholds": { "high": 65, "moderate": 40 },
    "phenotype_templates": {
      "high": {
        "name": "Efficient B12 Transport",
        "dietary_impact": "Transcobalamin Pro259 variant supports strong holotranscobalamin binding and efficient B12 delivery to cells. Standard dietary B12 from animal products or fortified foods is effectively utilized."
      },
      "moderate": {
        "name": "Moderate B12 Transport",
        "dietary_impact": "Mixed transcobalamin function with intermediate holotranscobalamin levels. Ensuring consistent B12 intake through animal products, fortified foods, or supplementation supports adequate cellular B12 delivery."
      },
      "low": {
        "name": "Standard B12 Transport",
        "dietary_impact": "Transcobalamin Arg259 variant associated with lower holotranscobalamin and modestly elevated homocysteine. Regular B12-rich foods and potential supplementation help compensate for reduced transport efficiency."
      }
    },
    "notes": "GRCh38 forward strand: G=Ref (Arg259), C=Alt (Pro259). The C (Pro259) allele is the ancestral and globally more common allele despite being the 'alt' in the reference genome. Meta-analysis of 34 studies confirmed GG genotype has significantly lower holotranscobalamin (SMD=-0.445, P<0.001). The G allele may have experienced positive selection in malaria-endemic regions."
  },
  "slc30a8_zinc": {
    "gene": "SLC30A8",
    "variant": "rs13266634",
    "inheritance": "additive",
    "beneficial_allele": "T",
    "thresholds": { "high": 35, "moderate": 15 },
    "phenotype_templates": {
      "high": {
        "name": "Enhanced Zinc-Insulin Balance",
        "dietary_impact": "ZnT8 Trp325 variant optimizes zinc-insulin dynamics in pancreatic beta cells with improved glucose responsiveness and enhanced insulin secretion. Zinc-rich foods complement this favorable metabolic profile."
      },
      "moderate": {
        "name": "Moderate Zinc-Insulin Balance",
        "dietary_impact": "Intermediate ZnT8 zinc transport in beta cells. Balanced zinc intake through oysters, red meat, pumpkin seeds, and legumes supports healthy insulin signaling and metabolic function."
      },
      "low": {
        "name": "Standard Zinc-Insulin Balance",
        "dietary_impact": "ZnT8 Arg325 maintains standard zinc transport. Zinc-rich foods and adequate dietary zinc support metabolic health. Zinc supplementation may provide enhanced benefit for insulin response in this profile."
      }
    },
    "notes": "The T allele (Trp325) reduces ZnT8 activity, mimicking the protective effect of rare loss-of-function mutations that confer 65% T2D risk reduction (Flannick et al. 2014). Zinc supplementation response differs by genotype: Trp325 carriers show 15% greater insulin response improvement with zinc. Thresholds adjusted to high>=35, moderate>=15 because the protective T allele is a minor allele globally (max ~47% in East Asia)."
  },
  "atp7a_copper": {
    "gene": "ATP7B",
    "variant": "rs1061472",
    "inheritance": "additive",
    "beneficial_allele": "T",
    "thresholds": { "high": 50, "moderate": 35 },
    "phenotype_templates": {
      "high": {
        "name": "Efficient Copper Utilization",
        "dietary_impact": "ATP7B Lys832 variant supports optimal copper transport and ceruloplasmin loading. Standard dietary copper from shellfish, nuts, seeds, and organ meats is efficiently utilized for cuproenzyme function."
      },
      "moderate": {
        "name": "Moderate Copper Utilization",
        "dietary_impact": "Mixed copper transport efficiency. Copper-rich foods including shellfish, dark chocolate, nuts, and seeds help maintain healthy copper homeostasis and support antioxidant enzyme function."
      },
      "low": {
        "name": "Standard Copper Utilization",
        "dietary_impact": "ATP7B Arg832 variant associated with modestly altered copper handling and higher free copper fraction. Balanced copper intake and antioxidant-rich foods support optimal copper metabolism and reduce oxidative stress."
      }
    },
    "notes": "IMPORTANT: ATP7A has no common functional variants (MAF>1%) due to extreme purifying selection. No copper GWAS has identified ATP7A signals. ATP7B rs1061472 (K832R) is substituted as a proxy — it encodes the sister copper-transporting ATPase with a common functional missense variant. Genomic alleles: T=Lys832 (beneficial, normal function), C=Arg832 (reduced copper transport, higher labile copper). ATP7B is autosomal (chr13), unlike X-linked ATP7A. Data quality is limited for many populations."
  }
}
```

## Output 2: Frequency data (genetics-frequencies.json)

```json
{
  "aboriginal_aus": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E", "notes": "Oceanian population; SLC23A1 A allele absent in related EAS/Oceanian groups" },
    "tcn2_b12_transport": { "f": 52, "t": "moderate", "tier": "E", "notes": "Limited Oceanian data; estimated between EAS and unique Sahul ancestry" },
    "slc30a8_zinc": { "f": 11, "t": "low", "tier": "P", "notes": "HGDP Oceanian data ~11%; ancient Sahul lineage divergent from mainland populations" },
    "atp7a_copper": { "f": 45, "t": "moderate", "tier": "E" }
  },
  "amazon": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 65, "t": "high", "tier": "E", "notes": "Indigenous South American proxy from PEL" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "anatolian": {
    "slc23a1_vitamin_c": { "f": 96, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 55, "t": "moderate", "tier": "P", "notes": "European-Middle Eastern admixture proxy" },
    "slc30a8_zinc": { "f": 25, "t": "moderate", "tier": "P" },
    "atp7a_copper": { "f": 40, "t": "moderate", "tier": "E" }
  },
  "andean": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "P", "notes": "PEL (Peruvian) proxy" },
    "tcn2_b12_transport": { "f": 65, "t": "high", "tier": "P" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "P", "notes": "PEL proxy; PAGE Native American T=27.1%" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "arabian": {
    "slc23a1_vitamin_c": { "f": 97, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 48, "t": "moderate", "tier": "P", "notes": "Qatari data C=48.1%" },
    "slc30a8_zinc": { "f": 18, "t": "moderate", "tier": "P", "notes": "Qatari T=16.2%; gnomAD Middle Eastern T=20.5%; averaged" },
    "atp7a_copper": { "f": 31, "t": "low", "tier": "P", "notes": "Qatari data T=30.6%" }
  },
  "australian_coastal": {
    "slc23a1_vitamin_c": { "f": 95, "t": "high", "tier": "P", "notes": "Modern Australian; European-derived frequency" },
    "tcn2_b12_transport": { "f": 56, "t": "moderate", "tier": "P" },
    "slc30a8_zinc": { "f": 28, "t": "moderate", "tier": "P" },
    "atp7a_copper": { "f": 42, "t": "moderate", "tier": "P" }
  },
  "balkan": {
    "slc23a1_vitamin_c": { "f": 95, "t": "high", "tier": "P", "notes": "CEU/TSI proxy blend" },
    "tcn2_b12_transport": { "f": 57, "t": "moderate", "tier": "P" },
    "slc30a8_zinc": { "f": 27, "t": "moderate", "tier": "P" },
    "atp7a_copper": { "f": 41, "t": "moderate", "tier": "E" }
  },
  "bengal": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "D", "notes": "1000G BEB: A allele ~1.2%" },
    "tcn2_b12_transport": { "f": 40, "t": "moderate", "tier": "D", "notes": "1000G BEB C=39.5%; lowest in SAS" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "D", "notes": "1000G BEB T=25.6%" },
    "atp7a_copper": { "f": 46, "t": "moderate", "tier": "E" }
  },
  "brazilian_coastal": {
    "slc23a1_vitamin_c": { "f": 97, "t": "high", "tier": "P", "notes": "Tri-hybrid admixture (EUR+AFR+AMR)" },
    "tcn2_b12_transport": { "f": 64, "t": "moderate", "tier": "P", "notes": "Brazilian G allele ~36% (literature)" },
    "slc30a8_zinc": { "f": 24, "t": "moderate", "tier": "P" },
    "atp7a_copper": { "f": 46, "t": "moderate", "tier": "E" }
  },
  "california_coast": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 64, "t": "moderate", "tier": "E" },
    "slc30a8_zinc": { "f": 27, "t": "moderate", "tier": "P", "notes": "PAGE Native American T=27.1%" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "canadian_prairies": {
    "slc23a1_vitamin_c": { "f": 98, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 60, "t": "moderate", "tier": "E", "notes": "Indigenous-European admixture estimate" },
    "slc30a8_zinc": { "f": 28, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 46, "t": "moderate", "tier": "E" }
  },
  "caribbean_creole": {
    "slc23a1_vitamin_c": { "f": 98, "t": "high", "tier": "P", "notes": "1000G ACB proxy with European admixture" },
    "tcn2_b12_transport": { "f": 72, "t": "high", "tier": "P", "notes": "ACB C~76% with European admixture" },
    "slc30a8_zinc": { "f": 15, "t": "moderate", "tier": "P", "notes": "ACB T=9.4% elevated by European admixture" },
    "atp7a_copper": { "f": 48, "t": "moderate", "tier": "E" }
  },
  "caribbean_taino": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 65, "t": "high", "tier": "E", "notes": "Indigenous Caribbean proxy" },
    "slc30a8_zinc": { "f": 25, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 49, "t": "moderate", "tier": "E" }
  },
  "caucasus": {
    "slc23a1_vitamin_c": { "f": 96, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 55, "t": "moderate", "tier": "P", "notes": "Daghestan/Caucasus region proxy" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "P", "notes": "Daghestan data available" },
    "atp7a_copper": { "f": 40, "t": "moderate", "tier": "P", "notes": "Daghestan T=39.5%" }
  },
  "central_africa": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P", "notes": "AFR average; A allele absent in sub-Saharan Africa" },
    "tcn2_b12_transport": { "f": 79, "t": "high", "tier": "P" },
    "slc30a8_zinc": { "f": 7, "t": "low", "tier": "P" },
    "atp7a_copper": { "f": 52, "t": "high", "tier": "E" }
  },
  "central_asia": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 47, "t": "moderate", "tier": "E", "notes": "SAS-EAS admixture estimate" },
    "slc30a8_zinc": { "f": 30, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 48, "t": "moderate", "tier": "E" }
  },
  "central_europe": {
    "slc23a1_vitamin_c": { "f": 94, "t": "high", "tier": "P", "notes": "CEU proxy; highest A allele frequency region globally" },
    "tcn2_b12_transport": { "f": 57, "t": "moderate", "tier": "P", "notes": "CEU C=56.6%" },
    "slc30a8_zinc": { "f": 28, "t": "moderate", "tier": "P", "notes": "CEU T=28.3%" },
    "atp7a_copper": { "f": 42, "t": "moderate", "tier": "P" }
  },
  "eastern_europe": {
    "slc23a1_vitamin_c": { "f": 95, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 57, "t": "moderate", "tier": "P", "notes": "Estonian C=54.9% to Finnish C=59.1% range" },
    "slc30a8_zinc": { "f": 29, "t": "moderate", "tier": "P", "notes": "Intermediate between CEU and FIN" },
    "atp7a_copper": { "f": 41, "t": "moderate", "tier": "P", "notes": "Estonian T=43.4%" }
  },
  "eastern_woodlands": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 64, "t": "moderate", "tier": "E" },
    "slc30a8_zinc": { "f": 27, "t": "moderate", "tier": "E", "notes": "PAGE Native American proxy" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "ethiopia": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 75, "t": "high", "tier": "P", "notes": "East African with Eurasian back-migration admixture; slightly lower than West African" },
    "slc30a8_zinc": { "f": 10, "t": "low", "tier": "P", "notes": "East African proxy; slightly elevated vs West African due to admixture" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "gaucho": {
    "slc23a1_vitamin_c": { "f": 97, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 62, "t": "moderate", "tier": "P", "notes": "AMR-European admixture; CLM proxy" },
    "slc30a8_zinc": { "f": 27, "t": "moderate", "tier": "P" },
    "atp7a_copper": { "f": 44, "t": "moderate", "tier": "E" }
  },
  "great_plains": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 64, "t": "moderate", "tier": "E" },
    "slc30a8_zinc": { "f": 27, "t": "moderate", "tier": "E", "notes": "PAGE Native American T=27.1%" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "highland_se_asia": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P", "notes": "1000G CDX (Dai) proxy" },
    "tcn2_b12_transport": { "f": 46, "t": "moderate", "tier": "P", "notes": "CDX C=45.7%" },
    "slc30a8_zinc": { "f": 45, "t": "high", "tier": "P", "notes": "CDX T=45.2%" },
    "atp7a_copper": { "f": 56, "t": "high", "tier": "E" }
  },
  "horn_somalia": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 73, "t": "high", "tier": "E", "notes": "East African with significant Middle Eastern admixture" },
    "slc30a8_zinc": { "f": 10, "t": "low", "tier": "E" },
    "atp7a_copper": { "f": 48, "t": "moderate", "tier": "E" }
  },
  "inuit": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E", "notes": "EAS-derived Arctic population; A allele absent" },
    "tcn2_b12_transport": { "f": 52, "t": "moderate", "tier": "E", "notes": "Unique Arctic genetic profile; traditional high-B12 marine diet" },
    "slc30a8_zinc": { "f": 35, "t": "high", "tier": "E", "notes": "EAS-derived ancestry; higher than continental AMR" },
    "atp7a_copper": { "f": 48, "t": "moderate", "tier": "E" }
  },
  "japan": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "D", "notes": "1000G JPT; monomorphic for G allele" },
    "tcn2_b12_transport": { "f": 43, "t": "moderate", "tier": "D", "notes": "1000G JPT C=43.3%" },
    "slc30a8_zinc": { "f": 42, "t": "high", "tier": "D", "notes": "38KJPN T=41.6% (N=77,444 alleles); 1000G JPT T=48.1%; biobank value preferred" },
    "atp7a_copper": { "f": 58, "t": "high", "tier": "P", "notes": "EAS proxy; Korean data supports high frequency" }
  },
  "korea": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "D" },
    "tcn2_b12_transport": { "f": 48, "t": "moderate", "tier": "D", "notes": "Korea4K C=47.4%, KRGDB C=48.1%, Korea1K C=47.6%" },
    "slc30a8_zinc": { "f": 40, "t": "high", "tier": "D", "notes": "Korea4K T=39.9%, Korea1K T=40.9%" },
    "atp7a_copper": { "f": 61, "t": "high", "tier": "D", "notes": "Korean data T=60.7% (N=2,930); highest observed frequency" }
  },
  "kurdish": {
    "slc23a1_vitamin_c": { "f": 97, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 50, "t": "moderate", "tier": "E", "notes": "Middle Eastern estimate" },
    "slc30a8_zinc": { "f": 21, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 35, "t": "moderate", "tier": "E" }
  },
  "maasai": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P", "notes": "1000G LWK (Luhya/East African) proxy" },
    "tcn2_b12_transport": { "f": 77, "t": "high", "tier": "P", "notes": "LWK C=76.8%" },
    "slc30a8_zinc": { "f": 8, "t": "low", "tier": "P", "notes": "LWK T=7.6%; very low protective allele" },
    "atp7a_copper": { "f": 52, "t": "high", "tier": "E" }
  },
  "maghreb": {
    "slc23a1_vitamin_c": { "f": 98, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 62, "t": "moderate", "tier": "P", "notes": "Gueant et al. Morocco data G=38%, so C=62%" },
    "slc30a8_zinc": { "f": 20, "t": "moderate", "tier": "E", "notes": "North African; intermediate between EUR and sub-Saharan AFR" },
    "atp7a_copper": { "f": 38, "t": "moderate", "tier": "E" }
  },
  "malagasy": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E", "notes": "Bantu + Austronesian dual ancestry" },
    "tcn2_b12_transport": { "f": 65, "t": "high", "tier": "E", "notes": "AFR-EAS admixture weighted toward African ancestry" },
    "slc30a8_zinc": { "f": 22, "t": "moderate", "tier": "E", "notes": "Weighted average of African (~7%) and Austronesian (~45%) components" },
    "atp7a_copper": { "f": 52, "t": "high", "tier": "E" }
  },
  "maori": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 50, "t": "moderate", "tier": "E", "notes": "Polynesian population; strong founder effects" },
    "slc30a8_zinc": { "f": 38, "t": "high", "tier": "P", "notes": "PAGE Native Hawaiian T=38.5%; Polynesian proxy" },
    "atp7a_copper": { "f": 52, "t": "high", "tier": "E" }
  },
  "med_levant": {
    "slc23a1_vitamin_c": { "f": 97, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 52, "t": "moderate", "tier": "P", "notes": "Middle Eastern-European crossroads" },
    "slc30a8_zinc": { "f": 23, "t": "moderate", "tier": "P", "notes": "gnomAD Middle Eastern T=20.5% blended with EUR influence" },
    "atp7a_copper": { "f": 37, "t": "moderate", "tier": "E" }
  },
  "med_southern": {
    "slc23a1_vitamin_c": { "f": 95, "t": "high", "tier": "D", "notes": "1000G TSI A=5.6%, IBS A=4.7%" },
    "tcn2_b12_transport": { "f": 58, "t": "moderate", "tier": "D", "notes": "TSI C=58.9%, IBS C=56.5%" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "D", "notes": "TSI T=28.0%, IBS T=24.3%" },
    "atp7a_copper": { "f": 41, "t": "moderate", "tier": "P", "notes": "MGP Spanish T=40.4%" }
  },
  "melanesia": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 50, "t": "moderate", "tier": "E", "notes": "Highly divergent Oceanian population; unique genetic architecture" },
    "slc30a8_zinc": { "f": 12, "t": "low", "tier": "P", "notes": "HGDP Oceanian T~11%; deep divergence from continental populations" },
    "atp7a_copper": { "f": 45, "t": "moderate", "tier": "E" }
  },
  "mesoamerica": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 65, "t": "high", "tier": "E", "notes": "Indigenous Mesoamerican proxy" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "mesopotamian": {
    "slc23a1_vitamin_c": { "f": 97, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 50, "t": "moderate", "tier": "E" },
    "slc30a8_zinc": { "f": 20, "t": "moderate", "tier": "P", "notes": "gnomAD Middle Eastern T=20.5%" },
    "atp7a_copper": { "f": 33, "t": "low", "tier": "E" }
  },
  "mestizo_mesoamerican": {
    "slc23a1_vitamin_c": { "f": 98, "t": "high", "tier": "D", "notes": "1000G MXL proxy" },
    "tcn2_b12_transport": { "f": 64, "t": "moderate", "tier": "D", "notes": "MXL C=64.1%" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "D", "notes": "MXL T=25.8%; PAGE Mexican T=24.6%" },
    "atp7a_copper": { "f": 46, "t": "moderate", "tier": "E" }
  },
  "micronesia": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 50, "t": "moderate", "tier": "E" },
    "slc30a8_zinc": { "f": 30, "t": "moderate", "tier": "E", "notes": "Oceanian with EAS influence; intermediate between Melanesian and Polynesian" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "mongolia": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 45, "t": "moderate", "tier": "P", "notes": "EAS proxy" },
    "slc30a8_zinc": { "f": 43, "t": "high", "tier": "P", "notes": "EAS average proxy" },
    "atp7a_copper": { "f": 57, "t": "high", "tier": "E" }
  },
  "nepal": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 42, "t": "moderate", "tier": "P", "notes": "SAS-EAS cline; slightly above SAS average" },
    "slc30a8_zinc": { "f": 30, "t": "moderate", "tier": "P", "notes": "Between SAS (25%) and EAS (46%) reflecting Tibeto-Burman + Indo-Aryan ancestry" },
    "atp7a_copper": { "f": 48, "t": "moderate", "tier": "E" }
  },
  "nile_valley": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 68, "t": "high", "tier": "E", "notes": "Northeast African with substantial Eurasian admixture" },
    "slc30a8_zinc": { "f": 14, "t": "low", "tier": "E", "notes": "Intermediate AFR-Middle Eastern" },
    "atp7a_copper": { "f": 48, "t": "moderate", "tier": "E" }
  },
  "nilotic": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 77, "t": "high", "tier": "P", "notes": "East African; LWK proxy" },
    "slc30a8_zinc": { "f": 8, "t": "low", "tier": "P" },
    "atp7a_copper": { "f": 52, "t": "high", "tier": "E" }
  },
  "nordic": {
    "slc23a1_vitamin_c": { "f": 96, "t": "high", "tier": "D", "notes": "1000G FIN A=4.0%; lower than other EUR" },
    "tcn2_b12_transport": { "f": 60, "t": "moderate", "tier": "D", "notes": "FIN C=59.1%; Northern Sweden C=62.2%" },
    "slc30a8_zinc": { "f": 32, "t": "moderate", "tier": "D", "notes": "FIN T=33.8%; notably elevated vs other Europeans due to Finnish founder effects" },
    "atp7a_copper": { "f": 38, "t": "moderate", "tier": "D", "notes": "FINRISK T=39.1%; Northern Sweden T=37.2%" }
  },
  "north_china": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "D", "notes": "1000G CHB; monomorphic" },
    "tcn2_b12_transport": { "f": 44, "t": "moderate", "tier": "D", "notes": "CHB C=43.7%; Wuhan study G=60.7% confirming high G allele in China" },
    "slc30a8_zinc": { "f": 43, "t": "high", "tier": "D", "notes": "CHB T=42.7%" },
    "atp7a_copper": { "f": 57, "t": "high", "tier": "P" }
  },
  "north_india": {
    "slc23a1_vitamin_c": { "f": 98, "t": "high", "tier": "D", "notes": "1000G GIH A=2.4%, PJL A=2.1%" },
    "tcn2_b12_transport": { "f": 40, "t": "moderate", "tier": "D", "notes": "GIH C=39.8%, PJL C=40.6%" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "D", "notes": "GIH T=24.3%, PJL T=27.1%" },
    "atp7a_copper": { "f": 46, "t": "moderate", "tier": "E" }
  },
  "pacific_nw": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 60, "t": "moderate", "tier": "E", "notes": "Indigenous with possible ancient Asian coastal migration influence" },
    "slc30a8_zinc": { "f": 30, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "patagonia": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 65, "t": "high", "tier": "E" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 50, "t": "high", "tier": "E" }
  },
  "persian": {
    "slc23a1_vitamin_c": { "f": 97, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 48, "t": "moderate", "tier": "E", "notes": "Middle Eastern-South Asian cline" },
    "slc30a8_zinc": { "f": 22, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 34, "t": "low", "tier": "E" }
  },
  "polynesia": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 50, "t": "moderate", "tier": "E", "notes": "EAS-derived Austronesian with significant founder effects" },
    "slc30a8_zinc": { "f": 38, "t": "high", "tier": "P", "notes": "PAGE Native Hawaiian T=38.5%" },
    "atp7a_copper": { "f": 52, "t": "high", "tier": "E" }
  },
  "sahel": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P", "notes": "1000G GWD/MSL proxy" },
    "tcn2_b12_transport": { "f": 81, "t": "high", "tier": "P", "notes": "GWD C=80.5%, MSL C=81.8%; highest beneficial allele frequency" },
    "slc30a8_zinc": { "f": 6, "t": "low", "tier": "P", "notes": "GWD T=5.3%, MSL T=5.9%; lowest globally" },
    "atp7a_copper": { "f": 53, "t": "high", "tier": "E" }
  },
  "se_asia_island": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 46, "t": "moderate", "tier": "P", "notes": "Austronesian; CHS/KHV proxy" },
    "slc30a8_zinc": { "f": 44, "t": "high", "tier": "P", "notes": "EAS Austronesian proxy" },
    "atp7a_copper": { "f": 56, "t": "high", "tier": "E" }
  },
  "se_asia_main": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "D", "notes": "1000G KHV; monomorphic" },
    "tcn2_b12_transport": { "f": 46, "t": "moderate", "tier": "D", "notes": "KHV C=45.5%" },
    "slc30a8_zinc": { "f": 46, "t": "high", "tier": "D", "notes": "KHV T=46.0%; among highest globally" },
    "atp7a_copper": { "f": 56, "t": "high", "tier": "P", "notes": "Vietnamese T=55.7%" }
  },
  "siberia": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 60, "t": "moderate", "tier": "P", "notes": "Siberian dataset C=60% (N=40 alleles; small sample)" },
    "slc30a8_zinc": { "f": 38, "t": "high", "tier": "E", "notes": "EAS-EUR admixture; HGDP Siberian data unreliable (N=26)" },
    "atp7a_copper": { "f": 28, "t": "low", "tier": "P", "notes": "Siberian dataset T=28% (N=40 alleles; small sample, interpret cautiously)" }
  },
  "sichuan_sw_china": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 44, "t": "moderate", "tier": "P", "notes": "CHB/CHS average" },
    "slc30a8_zinc": { "f": 45, "t": "high", "tier": "P" },
    "atp7a_copper": { "f": 57, "t": "high", "tier": "E" }
  },
  "south_china": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "D", "notes": "1000G CHS; monomorphic" },
    "tcn2_b12_transport": { "f": 45, "t": "moderate", "tier": "D", "notes": "CHS C=44.8%" },
    "slc30a8_zinc": { "f": 47, "t": "high", "tier": "D", "notes": "CHS T=46.7%; highest in 1000G dataset" },
    "atp7a_copper": { "f": 57, "t": "high", "tier": "P" }
  },
  "south_india": {
    "slc23a1_vitamin_c": { "f": 98, "t": "high", "tier": "D", "notes": "1000G STU A=2.0%, ITU A=2.0%" },
    "tcn2_b12_transport": { "f": 42, "t": "moderate", "tier": "D", "notes": "STU C=41.4%, ITU C=43.2%; low B12 transport efficiency compounded by vegetarian diets" },
    "slc30a8_zinc": { "f": 25, "t": "moderate", "tier": "D", "notes": "STU T=24.0%, ITU T=26.5%" },
    "atp7a_copper": { "f": 46, "t": "moderate", "tier": "E" }
  },
  "southeast_us": {
    "slc23a1_vitamin_c": { "f": 96, "t": "high", "tier": "P", "notes": "European-African admixed region" },
    "tcn2_b12_transport": { "f": 60, "t": "moderate", "tier": "P" },
    "slc30a8_zinc": { "f": 24, "t": "moderate", "tier": "P" },
    "atp7a_copper": { "f": 44, "t": "moderate", "tier": "E" }
  },
  "southern_africa": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 79, "t": "high", "tier": "P", "notes": "AFR proxy; Bantu-speaking populations" },
    "slc30a8_zinc": { "f": 7, "t": "low", "tier": "P" },
    "atp7a_copper": { "f": 52, "t": "high", "tier": "E" }
  },
  "southwest_us": {
    "slc23a1_vitamin_c": { "f": 97, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 62, "t": "moderate", "tier": "P", "notes": "MXL proxy with additional European influence" },
    "slc30a8_zinc": { "f": 26, "t": "moderate", "tier": "P" },
    "atp7a_copper": { "f": 44, "t": "moderate", "tier": "E" }
  },
  "subarctic": {
    "slc23a1_vitamin_c": { "f": 99, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 58, "t": "moderate", "tier": "E" },
    "slc30a8_zinc": { "f": 30, "t": "moderate", "tier": "E" },
    "atp7a_copper": { "f": 44, "t": "moderate", "tier": "E" }
  },
  "sudanian": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "P" },
    "tcn2_b12_transport": { "f": 80, "t": "high", "tier": "P", "notes": "West-Central African proxy" },
    "slc30a8_zinc": { "f": 7, "t": "low", "tier": "P" },
    "atp7a_copper": { "f": 53, "t": "high", "tier": "E" }
  },
  "tibet": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "E" },
    "tcn2_b12_transport": { "f": 44, "t": "moderate", "tier": "E", "notes": "EAS proxy; unique high-altitude adaptations may interact with B12 metabolism" },
    "slc30a8_zinc": { "f": 43, "t": "high", "tier": "E" },
    "atp7a_copper": { "f": 55, "t": "high", "tier": "E" }
  },
  "west_africa": {
    "slc23a1_vitamin_c": { "f": 100, "t": "high", "tier": "D", "notes": "1000G YRI/GWD/MSL/ESN; monomorphic for G. Note: separate African-specific variant rs35817838 reduces SVCT1 by 75% but is not tracked here" },
    "tcn2_b12_transport": { "f": 80, "t": "high", "tier": "D", "notes": "YRI C=78.7%, GWD C=80.5%, MSL C=81.8%, ESN C=77.3%; ancestral allele highly conserved" },
    "slc30a8_zinc": { "f": 6, "t": "low", "tier": "D", "notes": "YRI T=6.9%, GWD T=5.3%, MSL T=5.9%, ESN T=6.1%; lowest protective allele globally" },
    "atp7a_copper": { "f": 53, "t": "high", "tier": "E" }
  },
  "west_india": {
    "slc23a1_vitamin_c": { "f": 98, "t": "high", "tier": "P", "notes": "GIH proxy" },
    "tcn2_b12_transport": { "f": 40, "t": "moderate", "tier": "P", "notes": "GIH C=39.8%" },
    "slc30a8_zinc": { "f": 24, "t": "moderate", "tier": "P", "notes": "GIH T=24.3%" },
    "atp7a_copper": { "f": 46, "t": "moderate", "tier": "E" }
  },
  "western_europe": {
    "slc23a1_vitamin_c": { "f": 95, "t": "high", "tier": "D", "notes": "1000G CEU A=6.1%, GBR A=4.4%; highest A allele frequency globally in CEU" },
    "tcn2_b12_transport": { "f": 56, "t": "moderate", "tier": "D", "notes": "CEU C=56.6%, GBR C=55.5%" },
    "slc30a8_zinc": { "f": 28, "t": "moderate", "tier": "D", "notes": "CEU T=28.3%, GBR T=26.9%" },
    "atp7a_copper": { "f": 42, "t": "moderate", "tier": "D", "notes": "ALSPAC T=41.8%, TWINSUK T=42.5%, GoNL T=42.7%" }
  }
}
```

## Data quality and limitations summary

The three well-characterized variants (SLC23A1 rs33972313, TCN2 rs1801198, SLC30A8 rs13266634) each have **13 populations with D-tier data** from 1000 Genomes sub-populations and **20–25 with P-tier** data from closely related reference populations. The remaining populations rely on extrapolation from superpopulation averages or admixture modeling.

**ATP7A/copper gene limitation is the most significant issue in this batch.** ATP7B rs1061472 serves as a functional proxy but has only **3 D-tier and ~10 P-tier populations**. Korean, Western European, and Nordic populations have the most reliable data; all other population estimates carry substantial uncertainty. Future copper GWAS with larger, more diverse cohorts may identify better variants.

**SLC23A1 rs33972313 provides minimal population discrimination** because the beneficial G allele is near-fixed (94–100%) globally. The variant is most informative for European-ancestry individuals where the deleterious A allele reaches ~5%. For broader population discrimination of vitamin C metabolism, the regulatory variant rs11950646 (MAF ~32–35%, associated with 13% lower plasma vitamin C per G allele) may be a more informative alternative for future batches.

**SLC30A8 thresholds were adjusted** from the default (high=65, moderate=40) to (high=35, moderate=15) because the protective T allele is a global minor allele with maximum frequency of ~47% in East Asia. Default thresholds would classify all populations as "low," providing no discrimination.

**Populations with lowest overall data confidence** (E-tier across all four genes): aboriginal_aus, melanesia, micronesia, patagonia, subarctic, mesopotamian, kurdish, horn_somalia. These populations are underrepresented in global genomic databases and would benefit from targeted sequencing studies.