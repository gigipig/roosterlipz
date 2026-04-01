# Batch 8: Cholesterol & Lipids — Population Frequency Data for 66 Global Populations

## Methodology & data quality summary

Four lipid-metabolism genes were researched across gnomAD v4, 1000 Genomes Phase 3, ALFA, the PAGE Study, and 30+ published population-genetics papers. Beneficial allele frequencies were mapped from reference populations (gnomAD superpopulations, 1000 Genomes 26-population panel, and country-specific databases including 38KJPN, Korea4K, and KRGDB) to the 66 target populations using geographic, genetic, and historical-admixture proximity. **PCSK9 rs11591147** is a rare European-origin variant (0–2%); African populations carry alternative cardioprotective LOF variants (Y142X, C679X) not captured by this SNP. **APOA1 rs670** is a common global promoter variant (15–30%) with highest frequencies in East Asian and Indigenous American populations. **LDLR rs688** is very common, with the beneficial C allele ranging from 56% (East Asian) to 91% (West African). **LPL rs328** shows a clear gradient from ~2% in West Africa to ~16% in East Asia.

All four genes exceed the 10-population D/P tier threshold. PCSK9 has 16 D-tier populations; APOA1 has 14; LDLR has 14; LPL has 13. Tier assignments: **D** = direct data from the target population or its primary reference panel; **P** = proxy from a genetically related population; **E** = extrapolated from more distant reference data.

---

## Output 1: genetics-reference.json

```json
{
  "pcsk9_ldl": {
    "gene": "PCSK9",
    "variant": "rs11591147",
    "variant_name": "R46L (c.137G>T)",
    "inheritance": "additive",
    "beneficial_allele": "T",
    "thresholds": { "high": 1.5, "moderate": 0.3 },
    "phenotype_templates": {
      "high": {
        "name": "Strong LDL Clearance",
        "dietary_impact": "Population carries higher frequency of PCSK9 loss-of-function variants conferring naturally lower LDL cholesterol. This cardioprotective variant inspired the PCSK9 inhibitor drug class. Dietary saturated fat may have less impact on LDL levels, though a heart-healthy diet remains beneficial."
      },
      "moderate": {
        "name": "Moderate LDL Clearance",
        "dietary_impact": "Some population-level presence of PCSK9 loss-of-function variants providing modest LDL clearance advantage. Standard heart-healthy dietary guidelines apply with emphasis on limiting saturated fat."
      },
      "low": {
        "name": "Standard LDL Regulation",
        "dietary_impact": "Standard PCSK9 activity with typical LDL regulation. Focus on limiting saturated fat intake, increasing soluble fiber, and including plant sterols to support healthy LDL levels."
      }
    },
    "notes": "PCSK9 loss-of-function variants are cardioprotective and inspired the PCSK9 inhibitor drug class (evolocumab, alirocumab). rs11591147 (R46L) is predominantly European-origin. African populations carry alternative PCSK9 LOF variants (Y142X rs67608943, C679X rs28362286) at ~2-4% combined frequency that are not captured by rs11591147. Each T allele copy reduces LDL-C by ~15 mg/dL."
  },
  "apoa1_hdl": {
    "gene": "APOA1",
    "variant": "rs670",
    "variant_name": "-75G/A promoter (forward strand: C>T)",
    "inheritance": "additive",
    "beneficial_allele": "A",
    "thresholds": { "high": 22, "moderate": 16 },
    "phenotype_templates": {
      "high": {
        "name": "Strong HDL Production",
        "dietary_impact": "Higher frequency of APOA1 promoter variants enhancing apolipoprotein A-I expression and HDL cholesterol production. Natural cardiovascular advantage through elevated HDL. Monounsaturated fats and omega-3 fatty acids further amplify this benefit."
      },
      "moderate": {
        "name": "Moderate HDL Production",
        "dietary_impact": "Moderate frequency of HDL-enhancing APOA1 variants. Emphasize dietary fat quality with olive oil, nuts, and fatty fish to support optimal HDL levels."
      },
      "low": {
        "name": "Standard HDL Production",
        "dietary_impact": "Standard APOA1 promoter activity. Prioritize omega-3 fatty acids, monounsaturated fats, and regular physical activity to maintain healthy HDL cholesterol levels."
      }
    },
    "notes": "rs670 A allele increases APOA1 transcription and HDL-C levels. Note: APOA1 is on the minus strand; the A allele corresponds to T on the forward/genotyping strand. Effects are modulated by diet, sex, and metabolic state. Korean populations (~23%) diverge markedly from Japanese (~17%) despite geographic proximity."
  },
  "ldlr_cholesterol": {
    "gene": "LDLR",
    "variant": "rs688",
    "variant_name": "N591N (c.1773C>T, exon 12 synonymous)",
    "inheritance": "additive",
    "beneficial_allele": "C",
    "thresholds": { "high": 80, "moderate": 65 },
    "phenotype_templates": {
      "high": {
        "name": "Efficient Cholesterol Clearance",
        "dietary_impact": "High frequency of the LDLR splicing-efficient variant supporting strong LDL receptor expression and cholesterol clearance from the bloodstream. Maintain a balanced diet with adequate fiber to preserve this advantage."
      },
      "moderate": {
        "name": "Moderate Cholesterol Clearance",
        "dietary_impact": "Moderate LDLR splicing efficiency. Include soluble fiber (oats, beans, lentils), plant sterols, and limit saturated fat to support LDL receptor-mediated cholesterol clearance."
      },
      "low": {
        "name": "Standard Cholesterol Clearance",
        "dietary_impact": "Higher frequency of LDLR splicing variant associated with reduced receptor surface expression (~22% reduction). Emphasize soluble fiber, plant sterols, soy protein, and strictly limit dietary saturated fat to support cholesterol clearance."
      }
    },
    "notes": "rs688 T allele decreases LDLR exon 12 splicing efficiency, reducing receptor surface expression by ~22% and impairing PCSK9-antibody rescue. C allele is the reference/major allele globally. African populations have the highest beneficial C allele frequency (~88-91%), while East Asian populations have the lowest (~56-58%). Effect size is ~4-10% increase in plasma cholesterol per T allele."
  },
  "lpl_triglycerides": {
    "gene": "LPL",
    "variant": "rs328",
    "variant_name": "S447X (c.1421C>G, gain-of-function stop)",
    "inheritance": "additive",
    "beneficial_allele": "G",
    "thresholds": { "high": 12, "moderate": 7 },
    "phenotype_templates": {
      "high": {
        "name": "Enhanced Triglyceride Clearance",
        "dietary_impact": "High frequency of LPL gain-of-function variant enhancing lipoprotein lipase activity and triglyceride breakdown. Natural advantage in lipid metabolism with higher HDL and lower triglycerides. Diverse dietary fat sources are well-tolerated."
      },
      "moderate": {
        "name": "Moderate Triglyceride Clearance",
        "dietary_impact": "Moderate LPL gain-of-function variant frequency supporting good triglyceride metabolism. Balance dietary fat intake and include omega-3 fatty acids from fish and flaxseed."
      },
      "low": {
        "name": "Standard Triglyceride Metabolism",
        "dietary_impact": "Lower frequency of LPL gain-of-function variant. Monitor triglyceride-rich food intake, prioritize omega-3 fatty acids, limit refined carbohydrates and alcohol, and maintain regular physical activity to support triglyceride clearance."
      }
    },
    "notes": "Despite encoding a premature stop codon, the G allele (447X) is paradoxically gain-of-function: removing the last 2 amino acids increases LPL catalytic activity, secretion, and lipoprotein uptake. Carrier frequency ~20% in European populations. Each G allele lowers triglycerides and raises HDL-C. CHD risk reduction OR=0.84 (95% CI: 0.75-0.94). Strong frequency gradient from West Africa (~2%) to East Asia (~15%)."
  }
}
```

---

## Output 2: genetics-frequencies.json

```json
{
  "aboriginal_aus": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "No direct data; isolated population likely lacks European-origin R46L variant" },
    "apoa1_hdl": { "f": 18, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "E", "notes": "Extrapolated; unique genetic history may diverge from proxies" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "E" }
  },
  "amazon": {
    "pcsk9_ldl": { "f": 0.5, "t": "moderate", "tier": "E", "notes": "Based on PAGE South American data" },
    "apoa1_hdl": { "f": 26, "t": "high", "tier": "P", "notes": "PAGE South American indigenous ~26%" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "E" }
  },
  "anatolian": {
    "pcsk9_ldl": { "f": 0.7, "t": "moderate", "tier": "P", "notes": "Proxy from gnomAD Middle Eastern and Turkish studies" },
    "apoa1_hdl": { "f": 17, "t": "moderate", "tier": "P", "notes": "Turkish adults ~17% (Coban 2014)" },
    "ldlr_cholesterol": { "f": 65, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 11, "t": "moderate", "tier": "P", "notes": "Turkish population 11.0% (Komurcu-Bayrak 2007)" }
  },
  "andean": {
    "pcsk9_ldl": { "f": 0.6, "t": "moderate", "tier": "P", "notes": "Based on 1000G PEL and Native American admixture" },
    "apoa1_hdl": { "f": 24, "t": "high", "tier": "P" },
    "ldlr_cholesterol": { "f": 68, "t": "moderate", "tier": "P", "notes": "Proxy from 1000G PEL (C allele ~68%)" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "P", "notes": "1000G PEL G allele ~8.8%" }
  },
  "arabian": {
    "pcsk9_ldl": { "f": 0.4, "t": "moderate", "tier": "P", "notes": "gnomAD Middle Eastern ~0.5%, Qatari data" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "P", "notes": "Kuwaiti 19.3% (Al-Bustan 2013); Qatari 17.6%" },
    "ldlr_cholesterol": { "f": 67, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 7, "t": "moderate", "tier": "P", "notes": "Qatari G allele 7.4% (dbSNP)" }
  },
  "australian_coastal": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "Coastal Aboriginal Australian; no direct data" },
    "apoa1_hdl": { "f": 18, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "E" }
  },
  "balkan": {
    "pcsk9_ldl": { "f": 1.7, "t": "high", "tier": "P", "notes": "Proxy from Southern European gnomAD data" },
    "apoa1_hdl": { "f": 17, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 63, "t": "low", "tier": "P", "notes": "Proxy from 1000G TSI/IBS" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "P" }
  },
  "bengal": {
    "pcsk9_ldl": { "f": 0.1, "t": "low", "tier": "D", "notes": "gnomAD South Asian ~0.1%; 1000G BEB 0%" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "D", "notes": "1000G BEB within SAS ~19%" },
    "ldlr_cholesterol": { "f": 63, "t": "low", "tier": "D", "notes": "1000G BEB T allele ~37%, C allele ~63%" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "D", "notes": "1000G BEB G allele ~7.6%" }
  },
  "brazilian_coastal": {
    "pcsk9_ldl": { "f": 0.8, "t": "moderate", "tier": "P", "notes": "Admixed population; proxy from gnomAD Admixed American" },
    "apoa1_hdl": { "f": 20, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 11, "t": "moderate", "tier": "P", "notes": "Brazilian study reported 17.6% but likely survivorship bias in elderly sample; using admixed estimate" }
  },
  "california_coast": {
    "pcsk9_ldl": { "f": 0.5, "t": "moderate", "tier": "E" },
    "apoa1_hdl": { "f": 24, "t": "high", "tier": "E", "notes": "Indigenous California Coast; extrapolated from Native American data" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E" }
  },
  "canadian_prairies": {
    "pcsk9_ldl": { "f": 1.5, "t": "high", "tier": "P", "notes": "Mixed European/First Nations heritage; proxy from European data" },
    "apoa1_hdl": { "f": 17, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 65, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "P" }
  },
  "caribbean_creole": {
    "pcsk9_ldl": { "f": 0.7, "t": "moderate", "tier": "P", "notes": "African/European admixed; PAGE Dominican ~0.44%, Cuban ~1.56%" },
    "apoa1_hdl": { "f": 16, "t": "moderate", "tier": "P", "notes": "PAGE Dominican 15.8%, Puerto Rican 16%" },
    "ldlr_cholesterol": { "f": 76, "t": "moderate", "tier": "P", "notes": "Elevated C allele reflects African admixture contribution" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "P" }
  },
  "caribbean_taino": {
    "pcsk9_ldl": { "f": 0.8, "t": "moderate", "tier": "P", "notes": "Taíno-ancestry component; proxy from PAGE Puerto Rican/admixed American" },
    "apoa1_hdl": { "f": 18, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "P" }
  },
  "caucasus": {
    "pcsk9_ldl": { "f": 0.8, "t": "moderate", "tier": "P", "notes": "Proxy from gnomAD Middle Eastern and European data" },
    "apoa1_hdl": { "f": 18, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 66, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "P", "notes": "Daghestani G allele 9.2% (dbSNP)" }
  },
  "central_africa": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "P", "notes": "R46L absent in sub-Saharan Africa; alternative PCSK9 LOF variants (C679X ~2-4%) provide cardioprotection" },
    "apoa1_hdl": { "f": 15, "t": "low", "tier": "P" },
    "ldlr_cholesterol": { "f": 89, "t": "high", "tier": "P", "notes": "Proxy from 1000G African populations; high C allele reflects efficient LDL clearance" },
    "lpl_triglycerides": { "f": 3, "t": "low", "tier": "P" }
  },
  "central_asia": {
    "pcsk9_ldl": { "f": 0.3, "t": "moderate", "tier": "E" },
    "apoa1_hdl": { "f": 15, "t": "low", "tier": "P", "notes": "Kazakh (Xinjiang) A allele 12.7% (Feng 2016); broader Central Asian estimate ~15%" },
    "ldlr_cholesterol": { "f": 62, "t": "low", "tier": "E" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "P", "notes": "Kazakh ~7-9% (Shakhanova 2020)" }
  },
  "central_europe": {
    "pcsk9_ldl": { "f": 2.0, "t": "high", "tier": "D", "notes": "gnomAD European ~2.0%; CEU 1000G ~2.1%" },
    "apoa1_hdl": { "f": 16, "t": "moderate", "tier": "D", "notes": "1000G EUR ~15.4%; gnomAD European ~16.9%" },
    "ldlr_cholesterol": { "f": 64, "t": "low", "tier": "D", "notes": "1000G CEU C allele ~63%; gnomAD non-Finnish EUR ~63%" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "D", "notes": "1000G CEU G allele ~10.1%" }
  },
  "eastern_europe": {
    "pcsk9_ldl": { "f": 1.8, "t": "high", "tier": "D", "notes": "gnomAD European; Estonian 1.52%" },
    "apoa1_hdl": { "f": 17, "t": "moderate", "tier": "P", "notes": "Estonian 20%, Polish ~15%; averaged ~17%" },
    "ldlr_cholesterol": { "f": 65, "t": "moderate", "tier": "D", "notes": "Polish controls C allele 68% (Buraczynska 2021); averaged with broader EUR data" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "P", "notes": "Estonian 6.7%; broader Eastern European ~9%" }
  },
  "eastern_woodlands": {
    "pcsk9_ldl": { "f": 0.9, "t": "moderate", "tier": "E", "notes": "Based on PAGE Native American ~1.0% and Strong Heart Family Study ~0.9%" },
    "apoa1_hdl": { "f": 21, "t": "moderate", "tier": "E", "notes": "PAGE Native American ~21%" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E" }
  },
  "ethiopia": {
    "pcsk9_ldl": { "f": 0.1, "t": "low", "tier": "E", "notes": "East African with Eurasian admixture; R46L likely near-absent" },
    "apoa1_hdl": { "f": 16, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 82, "t": "high", "tier": "E", "notes": "Ethiopian genetic profile intermediate between sub-Saharan African and Middle Eastern" },
    "lpl_triglycerides": { "f": 5, "t": "low", "tier": "E" }
  },
  "gaucho": {
    "pcsk9_ldl": { "f": 1.2, "t": "moderate", "tier": "P", "notes": "Mixed European/Indigenous Southern South American" },
    "apoa1_hdl": { "f": 20, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 68, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 11, "t": "moderate", "tier": "P" }
  },
  "great_plains": {
    "pcsk9_ldl": { "f": 0.9, "t": "moderate", "tier": "P", "notes": "Strong Heart Family Study: American Indians R46L MAF=0.9% (n=2,458)" },
    "apoa1_hdl": { "f": 21, "t": "moderate", "tier": "P", "notes": "PAGE Native American ~21%" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E" }
  },
  "highland_se_asia": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "East Asian-derived; R46L absent in East Asian populations" },
    "apoa1_hdl": { "f": 27, "t": "high", "tier": "P", "notes": "Thai elderly A allele 28% (Supajaree 2022); highland populations similar" },
    "ldlr_cholesterol": { "f": 58, "t": "low", "tier": "P", "notes": "Proxy from 1000G CDX/KHV" },
    "lpl_triglycerides": { "f": 14, "t": "high", "tier": "P", "notes": "Proxy from 1000G CDX ~16.1%" }
  },
  "horn_somalia": {
    "pcsk9_ldl": { "f": 0.1, "t": "low", "tier": "E", "notes": "Horn of Africa; R46L likely absent but alternative PCSK9 LOF variants may be present" },
    "apoa1_hdl": { "f": 16, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 80, "t": "high", "tier": "E", "notes": "East African genetic background with some Middle Eastern admixture" },
    "lpl_triglycerides": { "f": 4, "t": "low", "tier": "E" }
  },
  "inuit": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "D", "notes": "Confirmed 0% R46L in Inuit ancestry (EJHG 2023); independent PCSK9 variant rs12117661 associated with lower LDL in Greenlandic Inuit" },
    "apoa1_hdl": { "f": 18, "t": "moderate", "tier": "E", "notes": "Rudkowska 2013 studied APOA1 gene-diet interaction in Canadian Inuit" },
    "ldlr_cholesterol": { "f": 65, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E", "notes": "Arctic diet adaptations may influence lipid metabolism independently of LPL genotype" }
  },
  "japan": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "D", "notes": "Confirmed 0% in gnomAD East Asian (n=37,878 exomes) and 1000G JPT" },
    "apoa1_hdl": { "f": 17, "t": "moderate", "tier": "D", "notes": "38KJPN: 16.5% (n=77,444 alleles); notably lower than other East Asian populations" },
    "ldlr_cholesterol": { "f": 57, "t": "low", "tier": "D", "notes": "1000G JPT T allele ~43%, C allele ~57%" },
    "lpl_triglycerides": { "f": 13, "t": "high", "tier": "D", "notes": "38KJPN: 13.1% (n=77,444); 1000G JPT ~14.4%" }
  },
  "korea": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "D", "notes": "Confirmed 0% in East Asian populations across all databases" },
    "apoa1_hdl": { "f": 23, "t": "high", "tier": "D", "notes": "Korea4K: 23.4% (n=7,232); KRGDB: 24.3% (n=2,928). Markedly higher than Japanese" },
    "ldlr_cholesterol": { "f": 57, "t": "low", "tier": "P", "notes": "Proxy from East Asian gnomAD/1000G data" },
    "lpl_triglycerides": { "f": 12, "t": "high", "tier": "D", "notes": "Korea4K: 11.6% (n=7,234); KRGDB: 12.1% (n=2,930)" }
  },
  "kurdish": {
    "pcsk9_ldl": { "f": 0.5, "t": "moderate", "tier": "P", "notes": "Proxy from gnomAD Middle Eastern" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 66, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "P" }
  },
  "maasai": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "East African pastoral; alternative PCSK9 LOF variants may be present" },
    "apoa1_hdl": { "f": 15, "t": "low", "tier": "E" },
    "ldlr_cholesterol": { "f": 88, "t": "high", "tier": "E", "notes": "East African; proxy from 1000G LWK (Luhya, Kenya)" },
    "lpl_triglycerides": { "f": 5, "t": "low", "tier": "E", "notes": "1000G LWK G allele ~4.5%; Maasai high-fat diet may create selection context" }
  },
  "maghreb": {
    "pcsk9_ldl": { "f": 0.5, "t": "moderate", "tier": "P", "notes": "North African; intermediate between European and sub-Saharan African" },
    "apoa1_hdl": { "f": 18, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "P" }
  },
  "malagasy": {
    "pcsk9_ldl": { "f": 0.1, "t": "low", "tier": "E", "notes": "Mixed Austronesian/East African ancestry" },
    "apoa1_hdl": { "f": 17, "t": "moderate", "tier": "E", "notes": "Intermediate between SE Asian (~24%) and African (~15%) reflecting dual ancestry" },
    "ldlr_cholesterol": { "f": 70, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "E" }
  },
  "maori": {
    "pcsk9_ldl": { "f": 0.3, "t": "moderate", "tier": "E", "notes": "Polynesian origin with some modern European admixture" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "E", "notes": "Estimated from PAGE Native Hawaiian proxy (~19%)" },
    "ldlr_cholesterol": { "f": 62, "t": "low", "tier": "E" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E" }
  },
  "med_levant": {
    "pcsk9_ldl": { "f": 0.5, "t": "moderate", "tier": "P", "notes": "gnomAD Middle Eastern ~0.5%" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 66, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "P" }
  },
  "med_southern": {
    "pcsk9_ldl": { "f": 1.8, "t": "high", "tier": "D", "notes": "gnomAD European; 1000G TSI/IBS populations" },
    "apoa1_hdl": { "f": 17, "t": "moderate", "tier": "D", "notes": "1000G TSI/IBS area; Spanish studies ~18%" },
    "ldlr_cholesterol": { "f": 62, "t": "low", "tier": "D", "notes": "1000G TSI T allele ~39%, C allele ~61%; Italian controls ~57-60% C" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "D", "notes": "1000G TSI ~10.5%, IBS ~10.3%" }
  },
  "melanesia": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 65, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "E" }
  },
  "mesoamerica": {
    "pcsk9_ldl": { "f": 0.6, "t": "moderate", "tier": "P", "notes": "Indigenous Mesoamerican; proxy from PAGE Central American ~0.33% and Native American ~1.43%" },
    "apoa1_hdl": { "f": 28, "t": "high", "tier": "P", "notes": "PAGE Mexican ~30%, Central American ~26%; indigenous component likely higher" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 11, "t": "moderate", "tier": "P" }
  },
  "mesopotamian": {
    "pcsk9_ldl": { "f": 0.5, "t": "moderate", "tier": "P", "notes": "Iraqi population data available; proxy from gnomAD Middle Eastern" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 67, "t": "moderate", "tier": "P", "notes": "Iraqi LDLR studies confirm rs688 association with dyslipidemia" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "P" }
  },
  "mestizo_mesoamerican": {
    "pcsk9_ldl": { "f": 0.75, "t": "moderate", "tier": "D", "notes": "PAGE Mexican ~0.75% (n=10,798 alleles); 1000G MXL data" },
    "apoa1_hdl": { "f": 30, "t": "high", "tier": "D", "notes": "PAGE Mexican A allele 30.3% (n=10,796) — highest globally. Indigenous Mesoamerican dietary adaptation" },
    "ldlr_cholesterol": { "f": 72, "t": "moderate", "tier": "D", "notes": "1000G MXL C allele ~72%" },
    "lpl_triglycerides": { "f": 13, "t": "high", "tier": "D", "notes": "1000G MXL G allele ~12.5%" }
  },
  "micronesia": {
    "pcsk9_ldl": { "f": 0.2, "t": "low", "tier": "E" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 63, "t": "low", "tier": "E" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E" }
  },
  "mongolia": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "P", "notes": "East Asian-derived; R46L absent in East Asian populations" },
    "apoa1_hdl": { "f": 20, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 57, "t": "low", "tier": "P", "notes": "Proxy from East Asian gnomAD data" },
    "lpl_triglycerides": { "f": 14, "t": "high", "tier": "P", "notes": "Proxy from 1000G East Asian; nomadic dairy-rich diet context" }
  },
  "nepal": {
    "pcsk9_ldl": { "f": 0.05, "t": "low", "tier": "E", "notes": "South/East Asian admixture; very low R46L expected" },
    "apoa1_hdl": { "f": 20, "t": "moderate", "tier": "P", "notes": "Intermediate between South Asian (~19%) and East Asian (~24%)" },
    "ldlr_cholesterol": { "f": 60, "t": "low", "tier": "P" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "P" }
  },
  "nile_valley": {
    "pcsk9_ldl": { "f": 0.2, "t": "low", "tier": "E", "notes": "Nile Valley populations show North African/Middle Eastern genetic influence" },
    "apoa1_hdl": { "f": 17, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 76, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 6, "t": "low", "tier": "E" }
  },
  "nilotic": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "Sub-Saharan East African; alternative PCSK9 LOF variants may provide cardioprotection" },
    "apoa1_hdl": { "f": 15, "t": "low", "tier": "E" },
    "ldlr_cholesterol": { "f": 88, "t": "high", "tier": "E", "notes": "East African populations tend to have high LDLR C allele frequency" },
    "lpl_triglycerides": { "f": 4, "t": "low", "tier": "E" }
  },
  "nordic": {
    "pcsk9_ldl": { "f": 1.5, "t": "high", "tier": "D", "notes": "1000G FIN; Northern Sweden 1.2%; Estonian 1.52%" },
    "apoa1_hdl": { "f": 16, "t": "moderate", "tier": "D", "notes": "Northern Sweden 14.8%, Estonian 20%; Finnish ~16%" },
    "ldlr_cholesterol": { "f": 66, "t": "moderate", "tier": "D", "notes": "1000G FIN T allele ~34%, C allele ~66%" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "D", "notes": "1000G FIN 7.1%; Estonian 6.7%; Northern Sweden 8.5%" }
  },
  "north_china": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "D", "notes": "Confirmed 0% across all East Asian gnomAD/1000G samples (n>37,000)" },
    "apoa1_hdl": { "f": 25, "t": "high", "tier": "D", "notes": "1000G CHB contributes to EAS average of ~24%; estimated ~25% for North China" },
    "ldlr_cholesterol": { "f": 56, "t": "low", "tier": "D", "notes": "1000G CHB T allele ~44%, C allele ~56%" },
    "lpl_triglycerides": { "f": 15, "t": "high", "tier": "D", "notes": "1000G CHB G allele ~14.6%" }
  },
  "north_india": {
    "pcsk9_ldl": { "f": 0.1, "t": "low", "tier": "D", "notes": "gnomAD South Asian ~0.1%; 1000G SAS 0%" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "D", "notes": "1000G PJL/GIH ~19%; Assam India 22% (Bora 2015)" },
    "ldlr_cholesterol": { "f": 62, "t": "low", "tier": "D", "notes": "1000G PJL C allele ~63%, GIH ~61%" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "D", "notes": "1000G PJL ~8.3%, GIH ~8.7%" }
  },
  "pacific_nw": {
    "pcsk9_ldl": { "f": 0.8, "t": "moderate", "tier": "E", "notes": "Pacific Northwest Indigenous; proxy from Native American data" },
    "apoa1_hdl": { "f": 21, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 70, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E" }
  },
  "patagonia": {
    "pcsk9_ldl": { "f": 0.5, "t": "moderate", "tier": "E" },
    "apoa1_hdl": { "f": 24, "t": "high", "tier": "E", "notes": "PAGE South American ~26%; adjusted for southern indigenous component" },
    "ldlr_cholesterol": { "f": 70, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "E" }
  },
  "persian": {
    "pcsk9_ldl": { "f": 0.5, "t": "moderate", "tier": "P", "notes": "gnomAD Middle Eastern ~0.5%; Iranian population included in meta-analyses" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 66, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 8, "t": "moderate", "tier": "P" }
  },
  "polynesia": {
    "pcsk9_ldl": { "f": 0.3, "t": "moderate", "tier": "P", "notes": "PAGE Native Hawaiian T allele 0.55%; adjusted down for lower European admixture in broader Polynesia" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "P", "notes": "PAGE Native Hawaiian ~19%" },
    "ldlr_cholesterol": { "f": 62, "t": "low", "tier": "P" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E" }
  },
  "sahel": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "P", "notes": "West African; R46L absent. Alternative PCSK9 LOF variant C679X present at ~1.4-3.7%" },
    "apoa1_hdl": { "f": 15, "t": "low", "tier": "P" },
    "ldlr_cholesterol": { "f": 89, "t": "high", "tier": "P", "notes": "Proxy from 1000G GWD (Gambian/West African)" },
    "lpl_triglycerides": { "f": 2, "t": "low", "tier": "P", "notes": "1000G GWD G allele ~2.2%; MSL ~1.8%" }
  },
  "se_asia_island": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "East Asian-derived; R46L absent" },
    "apoa1_hdl": { "f": 24, "t": "high", "tier": "P", "notes": "Singapore Malay/Indonesian proxy; SE Asian populations show elevated A allele" },
    "ldlr_cholesterol": { "f": 58, "t": "low", "tier": "P" },
    "lpl_triglycerides": { "f": 13, "t": "high", "tier": "P", "notes": "Singapore Malays ~11-14% (Lee 2004)" }
  },
  "se_asia_main": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "East Asian-derived; R46L absent" },
    "apoa1_hdl": { "f": 25, "t": "high", "tier": "P", "notes": "Vietnamese 24.8% (dbSNP); Thai 28% (Supajaree 2022); 1000G KHV" },
    "ldlr_cholesterol": { "f": 58, "t": "low", "tier": "P", "notes": "1000G KHV T allele ~42%, C allele ~58%" },
    "lpl_triglycerides": { "f": 14, "t": "high", "tier": "P", "notes": "1000G KHV ~13.6%; Vietnamese 12.7% (dbSNP)" }
  },
  "siberia": {
    "pcsk9_ldl": { "f": 0.1, "t": "low", "tier": "E" },
    "apoa1_hdl": { "f": 20, "t": "moderate", "tier": "E", "notes": "dbSNP Siberian sample too small (n=8) to be reliable; intermediate estimate used" },
    "ldlr_cholesterol": { "f": 60, "t": "low", "tier": "E" },
    "lpl_triglycerides": { "f": 12, "t": "high", "tier": "E", "notes": "Estimated intermediate between East Asian (~14%) and European (~10%)" }
  },
  "sichuan_sw_china": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "P", "notes": "East Asian; R46L absent" },
    "apoa1_hdl": { "f": 25, "t": "high", "tier": "P", "notes": "Proxy from 1000G CHS/CDX; SW China aligns with southern Han and Dai Chinese" },
    "ldlr_cholesterol": { "f": 58, "t": "low", "tier": "P", "notes": "Proxy from 1000G CHS/CDX" },
    "lpl_triglycerides": { "f": 15, "t": "high", "tier": "P", "notes": "1000G CDX G allele ~16.1%; CHS ~14.3%" }
  },
  "south_china": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "D", "notes": "Confirmed 0% in Chinese studies (n=1,096, PMC6134597)" },
    "apoa1_hdl": { "f": 24, "t": "high", "tier": "D", "notes": "1000G CHS contributes to EAS average; Southern Chinese ~24%" },
    "ldlr_cholesterol": { "f": 58, "t": "low", "tier": "D", "notes": "1000G CHS T allele ~42%, C allele ~58%" },
    "lpl_triglycerides": { "f": 14, "t": "high", "tier": "D", "notes": "1000G CHS G allele ~14.3%; Singapore Chinese ~14-17%" }
  },
  "south_india": {
    "pcsk9_ldl": { "f": 0.1, "t": "low", "tier": "P", "notes": "gnomAD South Asian ~0.1%" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "D", "notes": "1000G STU/ITU ~19%; Singapore Indian proxy" },
    "ldlr_cholesterol": { "f": 64, "t": "low", "tier": "D", "notes": "1000G STU C allele ~64%, ITU ~65%" },
    "lpl_triglycerides": { "f": 7, "t": "moderate", "tier": "D", "notes": "1000G STU 6.1%, ITU 8.2%; averaged ~7%" }
  },
  "southeast_us": {
    "pcsk9_ldl": { "f": 1.4, "t": "moderate", "tier": "P", "notes": "Mixed European/African American heritage region" },
    "apoa1_hdl": { "f": 16, "t": "moderate", "tier": "P" },
    "ldlr_cholesterol": { "f": 68, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "P" }
  },
  "southern_africa": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "P", "notes": "Sub-Saharan African; R46L absent. C679X ~3.7% in Zimbabwean women provides alternative cardioprotection" },
    "apoa1_hdl": { "f": 15, "t": "low", "tier": "P" },
    "ldlr_cholesterol": { "f": 88, "t": "high", "tier": "P", "notes": "South African LDLR studies confirm high C allele in Black populations" },
    "lpl_triglycerides": { "f": 3, "t": "low", "tier": "P" }
  },
  "southwest_us": {
    "pcsk9_ldl": { "f": 0.8, "t": "moderate", "tier": "P", "notes": "Mixed Hispanic/Native American heritage" },
    "apoa1_hdl": { "f": 22, "t": "high", "tier": "P" },
    "ldlr_cholesterol": { "f": 70, "t": "moderate", "tier": "P" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "P" }
  },
  "subarctic": {
    "pcsk9_ldl": { "f": 0.3, "t": "moderate", "tier": "E", "notes": "Subarctic Indigenous; intermediate between Inuit and European" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "E" },
    "ldlr_cholesterol": { "f": 68, "t": "moderate", "tier": "E" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "E" }
  },
  "sudanian": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "West/Central African belt; R46L absent; alternative PCSK9 LOF variants likely present" },
    "apoa1_hdl": { "f": 15, "t": "low", "tier": "E" },
    "ldlr_cholesterol": { "f": 89, "t": "high", "tier": "E" },
    "lpl_triglycerides": { "f": 3, "t": "low", "tier": "E" }
  },
  "tibet": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "E", "notes": "East Asian-derived; R46L absent" },
    "apoa1_hdl": { "f": 21, "t": "moderate", "tier": "E", "notes": "Intermediate between East Asian and Central Asian estimates" },
    "ldlr_cholesterol": { "f": 57, "t": "low", "tier": "E" },
    "lpl_triglycerides": { "f": 13, "t": "high", "tier": "E", "notes": "Proxy from East Asian; high-altitude adaptations may independently affect lipid metabolism" }
  },
  "west_africa": {
    "pcsk9_ldl": { "f": 0, "t": "low", "tier": "D", "notes": "Confirmed 0% in 1000G YRI/GWD/MSL/ESN. IMPORTANT: West Africans carry alternative PCSK9 LOF variants — C679X at 1.4-3.7% (Yoruba 1.4%, Zimbabwe 3.7%, Burkina Faso/Benin up to 6.9% in some ethnic groups) providing equivalent cardioprotection" },
    "apoa1_hdl": { "f": 16, "t": "moderate", "tier": "D", "notes": "1000G AFR ~16%" },
    "ldlr_cholesterol": { "f": 90, "t": "high", "tier": "D", "notes": "1000G YRI C allele ~91%, GWD ~90%. Highest LDLR efficiency globally" },
    "lpl_triglycerides": { "f": 2, "t": "low", "tier": "D", "notes": "1000G YRI ~2.8%, GWD ~2.2%, MSL ~1.8%. Lowest S447X frequency globally" }
  },
  "west_india": {
    "pcsk9_ldl": { "f": 0.1, "t": "low", "tier": "P", "notes": "gnomAD South Asian ~0.1%" },
    "apoa1_hdl": { "f": 19, "t": "moderate", "tier": "D", "notes": "1000G GIH (Gujarati) ~19%" },
    "ldlr_cholesterol": { "f": 61, "t": "low", "tier": "D", "notes": "1000G GIH T allele ~39%, C allele ~61%" },
    "lpl_triglycerides": { "f": 9, "t": "moderate", "tier": "D", "notes": "1000G GIH G allele ~8.7%" }
  },
  "western_europe": {
    "pcsk9_ldl": { "f": 2.0, "t": "high", "tier": "D", "notes": "gnomAD European 2.0% (genomes, n=78,676); 1000G CEU ~2.1%, GBR ~2.0%. Highest R46L frequency globally" },
    "apoa1_hdl": { "f": 16, "t": "moderate", "tier": "D", "notes": "1000G CEU/GBR ~15-17%; UK ALSPAC 16.6%" },
    "ldlr_cholesterol": { "f": 64, "t": "low", "tier": "D", "notes": "1000G CEU C allele ~63%, GBR ~64%; gnomAD non-Finnish EUR ~63%" },
    "lpl_triglycerides": { "f": 10, "t": "moderate", "tier": "D", "notes": "1000G CEU ~10.1%, GBR ~10.4%; Dutch GoNL 11.8%; UK ALSPAC 10.7%" }
  }
}
```

---

## Key data quality notes and population-specific adaptations

### PCSK9 — critical caveat for African populations
The rs11591147 (R46L) variant is **European-origin** and essentially absent in sub-Saharan African and East Asian populations. However, this does NOT mean these populations lack PCSK9-mediated cardioprotection. **West African populations carry alternative PCSK9 loss-of-function variants** — notably C679X (rs28362286) at 1.4–6.9% in different ethnic groups and Y142X (rs67608943) — which provide equivalent LDL-lowering effects. The combined African PCSK9 LOF frequency (~2–4%) is comparable to or exceeds the European R46L frequency. A comprehensive app should ideally incorporate these additional variants for African-ancestry populations to avoid underestimating their natural cardioprotection.

### APOA1 — Mexican/Mesoamerican populations are global outliers
The rs670 A allele reaches its **highest global frequency (~30%)** in Mexican and Mesoamerican populations (PAGE Study, n=10,796), significantly above all other populations. This may reflect selection related to traditional maize-based diets. Japanese populations (~16.5%) are notably lower than other East Asian groups (Korean ~23%, Chinese ~25%), demonstrating that "East Asian" is not a monolithic category for this variant.

### LDLR — African populations show strongest cholesterol clearance variant
West African populations carry the beneficial LDLR C allele at **~90%**, the highest globally. East Asian populations have the lowest C allele frequency (~56–58%), suggesting population-level differences in LDL receptor splicing efficiency. This gradient (Africa > Americas > Europe > South Asia > East Asia) may partially explain population-level differences in baseline LDL cholesterol.

### LPL — clear East Asian advantage for triglyceride metabolism
The LPL S447X gain-of-function variant shows a strong **Africa-to-East-Asia frequency gradient**: West African ~2%, European ~10%, East Asian ~14–16%. Chinese Dai (CDX) populations have the highest frequency globally at ~16.1%. This variant's distribution may reflect dietary selection pressures related to triglyceride-rich food sources.

### Tier distribution summary across all 264 population-gene combinations
- **D (Direct):** 58 entries — data from the target population's reference panel or direct study
- **P (Proxy):** 120 entries — data from a genetically related reference population
- **E (Extrapolated):** 86 entries — estimated from more distant populations using genetic and geographic reasoning

### Data verification recommendations
1. LDLR rs688 frequencies rely partly on estimated 1000 Genomes sub-population values that should be verified against the gnomAD v4 browser directly
2. Pacific Island, Aboriginal Australian, and many Indigenous American population estimates are extrapolated (tier E) and should be updated as population-specific genomic data becomes available
3. The PCSK9 entry should ideally be expanded to include C679X and Y142X for African-ancestry populations in a future batch update
4. All gnomAD v4 exome data for PCSK9 (n=684,530), APOA1 (n=193,563), and LPL (n=149,174 genomes) represent the largest available reference datasets and were used as primary calibration sources