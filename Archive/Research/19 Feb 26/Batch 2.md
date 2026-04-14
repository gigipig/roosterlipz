# Batch 2 Antioxidant Capacity: Population Allele Frequencies for 66 Populations

**All five variants have sufficient cross-population data (≥10 D/P tier populations) and none should be skipped.** The data below maps beneficial allele frequencies from gnomAD v4, 1000 Genomes Phase 3, NCBI ALFA, PAGE Study, HGDP, and national genome projects (38KJPN, Korea4K, Estonian Biobank, GoNL, ACPOP) to the 66 target population IDs. Frequencies represent the "strong antioxidant capacity" allele as a percentage (0–100).

## Variant summary and beneficial allele definitions

| Gene | rsID | Variant | Beneficial Allele | Effect | Global Freq |
|------|------|---------|-------------------|--------|-------------|
| SOD2 | rs4880 | Ala16Val | **C (Ala)** | Efficient mitochondrial SOD2 transport, ~30–40% higher activity | ~47–50% |
| CAT | rs1001179 | −262C>T promoter | **T** | ~1.5–2× higher catalase promoter activity and mRNA expression | ~13–16% |
| GPX1 | rs1050450 | Pro198Leu | **C (Pro)** | Higher glutathione peroxidase 1 enzymatic activity | ~70% |
| NFE2L2 | rs6721961 | −617C>A promoter | **C** | Normal NRF2 transcription; full antioxidant response element activation | ~86–89% |
| GSTP1 | rs1695 | Ile105Val | **A (Ile)** | Higher glutathione S-transferase P1 conjugation activity | ~64–67% |

## Tier definitions

- **D (Direct)**: Frequency from a database population that directly represents this group (e.g., 38KJPN for japan)
- **P (Proxy)**: Frequency from a closely related database ancestry group (e.g., gnomAD European for central_europe)
- **E (Extrapolated)**: Estimated from geographic proximity, known admixture patterns, or interpolation between reference populations

## Tier counts per variant

| Variant | D | P | E | Total |
|---------|---|---|---|-------|
| SOD2 rs4880 | 2 | 34 | 30 | 66 |
| CAT rs1001179 | 1 | 12 | 53 | 66 |
| GPX1 rs1050450 | 2 | 31 | 33 | 66 |
| NFE2L2 rs6721961 | 2 | 34 | 30 | 66 |
| GSTP1 rs1695 | 2 | 32 | 32 | 66 |

**CAT rs1001179 has the weakest cross-population coverage** (13 D/P tier populations), with African and South Asian values extrapolated from global patterns. All other variants have robust D/P coverage (33–36 populations each).

---

## JSON Output: SOD2 rs4880

```json
{
  "gene": "SOD2",
  "rsid": "rs4880",
  "variant_name": "Ala16Val (c.47T>C)",
  "beneficial_allele": "C (Ala)",
  "beneficial_allele_effect": "Efficient mitochondrial SOD2 transport; enhanced superoxide dismutase activity for strong antioxidant capacity",
  "sources": [
    "gnomAD v4 Exomes/Genomes (n=699,213/76,215)",
    "1000 Genomes Phase 3 (n=2,504)",
    "NCBI ALFA (n=275,846)",
    "PAGE Study (n=39,323)",
    "38KJPN Japanese (n=38,722)",
    "Korea4K Korean (n=3,617)",
    "Estonian Biobank (n=2,240)",
    "Northern Sweden ACPOP (n=300)",
    "Qatari Genome (n=108)"
  ],
  "tier_counts": {"D": 2, "P": 34, "E": 30},
  "populations": {
    "aboriginal_aus": {"freq": 25, "tier": "E", "src": "Estimated from Oceanian genetic divergence patterns"},
    "amazon": {"freq": 59, "tier": "P", "src": "PAGE South American 59.2%"},
    "anatolian": {"freq": 47, "tier": "E", "src": "Weighted avg gnomAD European 50% and Middle Eastern 44%"},
    "andean": {"freq": 59, "tier": "P", "src": "PAGE South American 59.2%"},
    "arabian": {"freq": 48, "tier": "P", "src": "Qatari 47.7%; gnomAD Middle Eastern 44.2%"},
    "australian_coastal": {"freq": 25, "tier": "E", "src": "Estimated from Oceanian genetic patterns"},
    "balkan": {"freq": 50, "tier": "P", "src": "gnomAD v4 European 50.0%"},
    "bengal": {"freq": 52, "tier": "P", "src": "gnomAD v4 South Asian 51.9%"},
    "brazilian_coastal": {"freq": 48, "tier": "E", "src": "Estimated tri-racial admixture: EUR 50%, AFR 43%, Indigenous 59%"},
    "california_coast": {"freq": 54, "tier": "E", "src": "Based on PAGE Native American 54.0%"},
    "canadian_prairies": {"freq": 52, "tier": "E", "src": "Estimated European/Indigenous admixture"},
    "caribbean_creole": {"freq": 45, "tier": "E", "src": "Estimated African 43%/European 50% admixture"},
    "caribbean_taino": {"freq": 55, "tier": "E", "src": "Estimated Indigenous Caribbean from PAGE Central American 54.3%"},
    "caucasus": {"freq": 47, "tier": "E", "src": "Weighted avg gnomAD European and Middle Eastern"},
    "central_africa": {"freq": 43, "tier": "P", "src": "gnomAD v4 African 42.9%"},
    "central_asia": {"freq": 35, "tier": "E", "src": "Estimated between East Asian 13% and South Asian 52%"},
    "central_europe": {"freq": 50, "tier": "P", "src": "gnomAD v4 European 50.0%"},
    "eastern_europe": {"freq": 53, "tier": "P", "src": "Estonian 55.3%; gnomAD European 50.0%"},
    "eastern_woodlands": {"freq": 54, "tier": "P", "src": "PAGE Native American 54.0%"},
    "ethiopia": {"freq": 43, "tier": "P", "src": "gnomAD v4 African 42.9%; 1000G AFR 42.4%"},
    "gaucho": {"freq": 52, "tier": "E", "src": "Estimated predominantly European with Indigenous admixture"},
    "great_plains": {"freq": 54, "tier": "P", "src": "PAGE Native American 54.0%"},
    "highland_se_asia": {"freq": 15, "tier": "E", "src": "Estimated from Vietnamese 14.5% and East Asian 13%"},
    "horn_somalia": {"freq": 43, "tier": "E", "src": "gnomAD African with Middle Eastern admixture influence"},
    "inuit": {"freq": 25, "tier": "E", "src": "Estimated between East Asian 13% and Native American 54%"},
    "japan": {"freq": 12, "tier": "D", "src": "38KJPN 12.2% (n=77,444 alleles)"},
    "korea": {"freq": 12, "tier": "D", "src": "Korea4K 12.0% (n=7,234 alleles)"},
    "kurdish": {"freq": 45, "tier": "P", "src": "gnomAD v4 Middle Eastern 44.2%"},
    "maasai": {"freq": 43, "tier": "P", "src": "gnomAD v4 African 42.9%"},
    "maghreb": {"freq": 44, "tier": "E", "src": "Estimated between African 43% and Middle Eastern 45%"},
    "malagasy": {"freq": 30, "tier": "E", "src": "Estimated African 43%/SE Asian 15% admixture"},
    "maori": {"freq": 18, "tier": "E", "src": "Based on PAGE Native Hawaiian 18.2%"},
    "med_levant": {"freq": 45, "tier": "P", "src": "gnomAD v4 Middle Eastern 44.2%"},
    "med_southern": {"freq": 49, "tier": "P", "src": "gnomAD v4 European 50.0%"},
    "melanesia": {"freq": 22, "tier": "E", "src": "Estimated Oceanian, distinct from Polynesian"},
    "mesoamerica": {"freq": 56, "tier": "E", "src": "Interpolated PAGE Mexican 61% and Native American 54%"},
    "mesopotamian": {"freq": 45, "tier": "P", "src": "gnomAD v4 Middle Eastern 44.2%"},
    "mestizo_mesoamerican": {"freq": 61, "tier": "P", "src": "PAGE Mexican 61.0% (n=10,810 alleles)"},
    "micronesia": {"freq": 17, "tier": "E", "src": "Estimated between East Asian 13% and Polynesian 18%"},
    "mongolia": {"freq": 14, "tier": "P", "src": "gnomAD v4 East Asian 13.1%"},
    "nepal": {"freq": 35, "tier": "E", "src": "Estimated between South Asian 52% and East Asian 13%"},
    "nile_valley": {"freq": 43, "tier": "E", "src": "Estimated between African 43% and Middle Eastern 45%"},
    "nilotic": {"freq": 43, "tier": "P", "src": "gnomAD v4 African 42.9%"},
    "nordic": {"freq": 46, "tier": "P", "src": "Northern Sweden 46.3%; Finnish FINRISK 43.4%"},
    "north_china": {"freq": 13, "tier": "P", "src": "gnomAD v4 East Asian 13.1%"},
    "north_india": {"freq": 52, "tier": "P", "src": "gnomAD v4 South Asian 51.9%"},
    "pacific_nw": {"freq": 54, "tier": "P", "src": "PAGE Native American 54.0%"},
    "patagonia": {"freq": 59, "tier": "E", "src": "Based on PAGE South American 59.2%"},
    "persian": {"freq": 45, "tier": "P", "src": "gnomAD v4 Middle Eastern 44.2%"},
    "polynesia": {"freq": 18, "tier": "P", "src": "PAGE Native Hawaiian 18.2% (n=4,530 alleles)"},
    "sahel": {"freq": 43, "tier": "P", "src": "gnomAD v4 African 42.9%"},
    "se_asia_island": {"freq": 15, "tier": "E", "src": "Estimated between East Asian 13% and Oceanian"},
    "se_asia_main": {"freq": 15, "tier": "P", "src": "Vietnamese 14.5% (n=214 alleles)"},
    "siberia": {"freq": 40, "tier": "E", "src": "SGDP Siberian 74% (n=42, unreliable); conservatively estimated"},
    "sichuan_sw_china": {"freq": 13, "tier": "P", "src": "gnomAD v4 East Asian 13.1%"},
    "south_china": {"freq": 13, "tier": "P", "src": "gnomAD v4 East Asian 13.1%"},
    "south_india": {"freq": 52, "tier": "P", "src": "gnomAD v4 South Asian 51.9%"},
    "southeast_us": {"freq": 48, "tier": "E", "src": "Estimated European/African American admixture"},
    "southern_africa": {"freq": 43, "tier": "P", "src": "gnomAD v4 African 42.9%"},
    "southwest_us": {"freq": 55, "tier": "E", "src": "Estimated Indigenous/European admixture"},
    "subarctic": {"freq": 35, "tier": "E", "src": "Estimated between Siberian and Inuit patterns"},
    "sudanian": {"freq": 43, "tier": "P", "src": "gnomAD v4 African 42.9%"},
    "tibet": {"freq": 14, "tier": "E", "src": "East Asian-related with unique high-altitude adaptation"},
    "west_africa": {"freq": 43, "tier": "P", "src": "gnomAD v4 African 42.9%; 1000G AFR 42.4%"},
    "west_india": {"freq": 52, "tier": "P", "src": "gnomAD v4 South Asian 51.9%"},
    "western_europe": {"freq": 50, "tier": "P", "src": "gnomAD v4 European 50.0%; GoNL 50.2%"}
  }
}
```

---

## JSON Output: CAT rs1001179

```json
{
  "gene": "CAT",
  "rsid": "rs1001179",
  "variant_name": "-262C>T promoter",
  "beneficial_allele": "T",
  "beneficial_allele_effect": "~1.5-2x higher catalase promoter activity and mRNA expression; enhanced hydrogen peroxide detoxification capacity",
  "sources": [
    "gnomAD v4 Genomes global (n=74,617)",
    "TOPMed (n=132,345)",
    "1000 Genomes Phase 3 (n=2,504)",
    "Korea4K Korean (n=3,617)",
    "Estonian Biobank (n=2,240)",
    "UK ALSPAC (n=1,927) / TWINSUK (n=1,854)",
    "GoNL Netherlands (n=499)",
    "Northern Sweden ACPOP (n=300)",
    "Vietnamese VDB (n=108)",
    "Qatari Genome (n=108)",
    "Forsberg et al. 2001; Saify et al. 2016 (functional evidence)"
  ],
  "data_quality_note": "African and South Asian population frequencies are extrapolated from global database patterns; East Asian and European have direct data. CAT has 13 D/P tier populations, meeting the >=10 threshold but with weaker coverage than other variants.",
  "tier_counts": {"D": 1, "P": 12, "E": 53},
  "populations": {
    "aboriginal_aus": {"freq": 5, "tier": "E", "src": "Estimated from Oceanian/Australian Aboriginal divergence"},
    "amazon": {"freq": 10, "tier": "E", "src": "Estimated Indigenous American"},
    "anatolian": {"freq": 19, "tier": "E", "src": "Weighted avg European 22% and Middle Eastern 17%"},
    "andean": {"freq": 10, "tier": "E", "src": "Estimated Indigenous American"},
    "arabian": {"freq": 18, "tier": "P", "src": "Qatari 18.5%; Saudi controls ~15.5%"},
    "australian_coastal": {"freq": 5, "tier": "E", "src": "Estimated from Oceanian genetic patterns"},
    "balkan": {"freq": 22, "tier": "P", "src": "European average ~22%"},
    "bengal": {"freq": 12, "tier": "E", "src": "Estimated South Asian from global pattern analysis"},
    "brazilian_coastal": {"freq": 16, "tier": "E", "src": "Estimated admixture: EUR 22%, AFR ~8%, Indigenous ~10%"},
    "california_coast": {"freq": 10, "tier": "E", "src": "Estimated Indigenous American"},
    "canadian_prairies": {"freq": 18, "tier": "E", "src": "Estimated European/Indigenous admixture"},
    "caribbean_creole": {"freq": 14, "tier": "E", "src": "Estimated African ~8%/European 22% admixture"},
    "caribbean_taino": {"freq": 10, "tier": "E", "src": "Estimated Indigenous Caribbean"},
    "caucasus": {"freq": 19, "tier": "E", "src": "Weighted European/Middle Eastern"},
    "central_africa": {"freq": 8, "tier": "E", "src": "Estimated from global database proportions"},
    "central_asia": {"freq": 12, "tier": "E", "src": "Estimated mixed ancestry; Buryat data 6-17%"},
    "central_europe": {"freq": 22, "tier": "P", "src": "European average ~22%"},
    "eastern_europe": {"freq": 22, "tier": "P", "src": "Estonian 22.4%"},
    "eastern_woodlands": {"freq": 10, "tier": "E", "src": "Estimated Indigenous American"},
    "ethiopia": {"freq": 8, "tier": "E", "src": "Estimated African from global pattern analysis"},
    "gaucho": {"freq": 19, "tier": "E", "src": "Estimated predominantly European"},
    "great_plains": {"freq": 10, "tier": "E", "src": "Estimated Indigenous American"},
    "highland_se_asia": {"freq": 3, "tier": "E", "src": "Estimated from East Asian ~3%"},
    "horn_somalia": {"freq": 8, "tier": "E", "src": "Estimated African"},
    "inuit": {"freq": 5, "tier": "E", "src": "Estimated East Asian/Arctic ancestry"},
    "japan": {"freq": 3, "tier": "P", "src": "East Asian proxy from Korea4K 2.5-3%; consistent across EAS"},
    "korea": {"freq": 3, "tier": "D", "src": "Korea4K 2.54% (n=7,232); KRGDB 2.98%"},
    "kurdish": {"freq": 17, "tier": "E", "src": "Estimated Middle Eastern"},
    "maasai": {"freq": 8, "tier": "E", "src": "Estimated East African"},
    "maghreb": {"freq": 14, "tier": "E", "src": "Estimated between African 8% and Middle Eastern 17%"},
    "malagasy": {"freq": 6, "tier": "E", "src": "Estimated African 8%/SE Asian 3% admixture"},
    "maori": {"freq": 5, "tier": "E", "src": "Estimated Polynesian"},
    "med_levant": {"freq": 17, "tier": "E", "src": "Estimated Middle Eastern from Qatari 18.5%"},
    "med_southern": {"freq": 22, "tier": "P", "src": "European average ~22%"},
    "melanesia": {"freq": 5, "tier": "E", "src": "Estimated Oceanian"},
    "mesoamerica": {"freq": 10, "tier": "E", "src": "Estimated Indigenous Mesoamerican"},
    "mesopotamian": {"freq": 17, "tier": "E", "src": "Estimated Middle Eastern"},
    "mestizo_mesoamerican": {"freq": 15, "tier": "E", "src": "Estimated European/Indigenous admixture"},
    "micronesia": {"freq": 4, "tier": "E", "src": "Estimated between East Asian 3% and Oceanian 5%"},
    "mongolia": {"freq": 5, "tier": "E", "src": "East Asian with Central Asian influence; Buryat 6-17%"},
    "nepal": {"freq": 8, "tier": "E", "src": "Estimated between South Asian 12% and East Asian 3%"},
    "nile_valley": {"freq": 10, "tier": "E", "src": "Estimated between African 8% and Middle Eastern 17%"},
    "nilotic": {"freq": 8, "tier": "E", "src": "Estimated African"},
    "nordic": {"freq": 26, "tier": "P", "src": "Northern Sweden 26.3%"},
    "north_china": {"freq": 3, "tier": "P", "src": "East Asian average ~3% from Korean databases"},
    "north_india": {"freq": 12, "tier": "E", "src": "Estimated South Asian"},
    "pacific_nw": {"freq": 10, "tier": "E", "src": "Estimated Indigenous American"},
    "patagonia": {"freq": 10, "tier": "E", "src": "Estimated Indigenous American"},
    "persian": {"freq": 17, "tier": "E", "src": "Estimated Middle Eastern"},
    "polynesia": {"freq": 5, "tier": "E", "src": "Estimated Polynesian"},
    "sahel": {"freq": 8, "tier": "E", "src": "Estimated African/Sahelian"},
    "se_asia_island": {"freq": 3, "tier": "E", "src": "Estimated from East Asian pattern"},
    "se_asia_main": {"freq": 2, "tier": "P", "src": "Vietnamese 2.3% (n=216 alleles)"},
    "siberia": {"freq": 15, "tier": "E", "src": "Estimated; Buryat data range 6-17%"},
    "sichuan_sw_china": {"freq": 3, "tier": "P", "src": "East Asian average ~3%"},
    "south_china": {"freq": 3, "tier": "P", "src": "East Asian average ~3%"},
    "south_india": {"freq": 12, "tier": "E", "src": "Estimated South Asian"},
    "southeast_us": {"freq": 16, "tier": "E", "src": "Estimated European/African admixture"},
    "southern_africa": {"freq": 8, "tier": "E", "src": "Estimated African"},
    "southwest_us": {"freq": 15, "tier": "E", "src": "Estimated mixed population"},
    "subarctic": {"freq": 8, "tier": "E", "src": "Estimated between Siberian and Arctic"},
    "sudanian": {"freq": 8, "tier": "E", "src": "Estimated African"},
    "tibet": {"freq": 3, "tier": "E", "src": "Estimated East Asian-related"},
    "west_africa": {"freq": 8, "tier": "E", "src": "Estimated from global database proportions"},
    "west_india": {"freq": 12, "tier": "E", "src": "Estimated South Asian"},
    "western_europe": {"freq": 22, "tier": "P", "src": "UK ALSPAC 22.3%; GoNL 22.7%; TWINSUK 22.0%"}
  }
}
```

---

## JSON Output: GPX1 rs1050450

```json
{
  "gene": "GPX1",
  "rsid": "rs1050450",
  "variant_name": "Pro198Leu (c.593C>T)",
  "beneficial_allele": "C (Pro)",
  "beneficial_allele_effect": "Higher glutathione peroxidase 1 activity; enhanced capacity to reduce hydrogen peroxide and lipid hydroperoxides",
  "note_on_strand": "GPX1 is on minus strand. Forward strand: G=Pro(beneficial), A=Leu. All database frequencies converted to coding strand C(Pro) allele.",
  "sources": [
    "gnomAD v4 Exomes (n=697,883) / Genomes (n=74,348)",
    "1000 Genomes Phase 3 (n=2,504) and 30X (n=3,202)",
    "NCBI ALFA (n=25,407)",
    "ExAC (n=57,416)",
    "38KJPN Japanese (n=38,722)",
    "Korea4K Korean (n=3,617)",
    "Estonian Biobank (n=2,240)",
    "GoNL Netherlands (n=499)",
    "Northern Sweden ACPOP (n=300)",
    "Qatari Genome (n=108)"
  ],
  "tier_counts": {"D": 2, "P": 31, "E": 33},
  "populations": {
    "aboriginal_aus": {"freq": 80, "tier": "E", "src": "Estimated Oceanian pattern"},
    "amazon": {"freq": 85, "tier": "E", "src": "Based on gnomAD Latino 83.6%"},
    "anatolian": {"freq": 68, "tier": "E", "src": "Weighted avg European 69% and Middle Eastern 68%"},
    "andean": {"freq": 85, "tier": "E", "src": "Based on gnomAD Latino 83.6%"},
    "arabian": {"freq": 72, "tier": "P", "src": "Qatari 71.8%; gnomAD Middle Eastern 68.2%"},
    "australian_coastal": {"freq": 80, "tier": "E", "src": "Estimated Oceanian pattern"},
    "balkan": {"freq": 69, "tier": "P", "src": "gnomAD v4 European 68.6%"},
    "bengal": {"freq": 76, "tier": "P", "src": "gnomAD v4 South Asian 75.7%"},
    "brazilian_coastal": {"freq": 73, "tier": "E", "src": "Estimated admixture: EUR 69%, AFR 71%, Indigenous ~85%"},
    "california_coast": {"freq": 84, "tier": "E", "src": "Based on gnomAD Latino 83.6%"},
    "canadian_prairies": {"freq": 74, "tier": "E", "src": "Estimated European/Indigenous admixture"},
    "caribbean_creole": {"freq": 70, "tier": "E", "src": "Estimated African 71%/European 69% admixture"},
    "caribbean_taino": {"freq": 84, "tier": "E", "src": "Estimated Indigenous Caribbean"},
    "caucasus": {"freq": 69, "tier": "E", "src": "Weighted avg European and Middle Eastern"},
    "central_africa": {"freq": 71, "tier": "P", "src": "gnomAD v4 African 70.6%"},
    "central_asia": {"freq": 78, "tier": "E", "src": "Estimated between East Asian 94% and South Asian 76%"},
    "central_europe": {"freq": 69, "tier": "P", "src": "gnomAD v4 European 68.6%"},
    "eastern_europe": {"freq": 68, "tier": "P", "src": "Estonian 68.4%"},
    "eastern_woodlands": {"freq": 84, "tier": "E", "src": "Estimated Indigenous American from gnomAD Latino 83.6%"},
    "ethiopia": {"freq": 71, "tier": "P", "src": "gnomAD v4 African 70.6%; 1000G AFR 72.8%"},
    "gaucho": {"freq": 71, "tier": "E", "src": "Estimated predominantly European with Indigenous admixture"},
    "great_plains": {"freq": 84, "tier": "E", "src": "Estimated Indigenous American"},
    "highland_se_asia": {"freq": 90, "tier": "E", "src": "Estimated between East Asian 94% and South Asian 76%"},
    "horn_somalia": {"freq": 71, "tier": "E", "src": "gnomAD African proxy"},
    "inuit": {"freq": 90, "tier": "E", "src": "Estimated from East Asian 94% with Arctic ancestry"},
    "japan": {"freq": 93, "tier": "D", "src": "38KJPN 92.6% (n=77,444 alleles)"},
    "korea": {"freq": 92, "tier": "D", "src": "Korea4K 91.9% (n=7,234 alleles)"},
    "kurdish": {"freq": 68, "tier": "P", "src": "gnomAD v4 Middle Eastern 68.2%"},
    "maasai": {"freq": 71, "tier": "P", "src": "gnomAD v4 African 70.6%"},
    "maghreb": {"freq": 70, "tier": "E", "src": "Estimated between African 71% and Middle Eastern 68%"},
    "malagasy": {"freq": 78, "tier": "E", "src": "Estimated African 71%/SE Asian 93% admixture"},
    "maori": {"freq": 82, "tier": "E", "src": "Estimated Polynesian pattern"},
    "med_levant": {"freq": 68, "tier": "P", "src": "gnomAD v4 Middle Eastern 68.2%"},
    "med_southern": {"freq": 69, "tier": "P", "src": "gnomAD v4 European 68.6%"},
    "melanesia": {"freq": 80, "tier": "E", "src": "Estimated Oceanian"},
    "mesoamerica": {"freq": 85, "tier": "E", "src": "Estimated Indigenous Mesoamerican from gnomAD Latino"},
    "mesopotamian": {"freq": 68, "tier": "P", "src": "gnomAD v4 Middle Eastern 68.2%"},
    "mestizo_mesoamerican": {"freq": 84, "tier": "P", "src": "gnomAD v4 Latino/Admixed 83.6%"},
    "micronesia": {"freq": 85, "tier": "E", "src": "Estimated between East Asian 94% and Oceanian 80%"},
    "mongolia": {"freq": 93, "tier": "P", "src": "gnomAD v4 East Asian 93.7%"},
    "nepal": {"freq": 83, "tier": "E", "src": "Estimated between South Asian 76% and East Asian 94%"},
    "nile_valley": {"freq": 70, "tier": "E", "src": "Estimated between African 71% and Middle Eastern 68%"},
    "nilotic": {"freq": 71, "tier": "P", "src": "gnomAD v4 African 70.6%"},
    "nordic": {"freq": 65, "tier": "P", "src": "Northern Sweden 64.7%"},
    "north_china": {"freq": 94, "tier": "P", "src": "gnomAD v4 East Asian 93.7%"},
    "north_india": {"freq": 76, "tier": "P", "src": "gnomAD v4 South Asian 75.7%"},
    "pacific_nw": {"freq": 84, "tier": "E", "src": "Estimated Indigenous American"},
    "patagonia": {"freq": 85, "tier": "E", "src": "Estimated Indigenous American"},
    "persian": {"freq": 68, "tier": "P", "src": "gnomAD v4 Middle Eastern 68.2%"},
    "polynesia": {"freq": 82, "tier": "E", "src": "Estimated Polynesian"},
    "sahel": {"freq": 71, "tier": "P", "src": "gnomAD v4 African 70.6%"},
    "se_asia_island": {"freq": 90, "tier": "E", "src": "Estimated between East Asian 94% and Oceanian 80%"},
    "se_asia_main": {"freq": 93, "tier": "P", "src": "gnomAD v4 East Asian proxy 93.7%"},
    "siberia": {"freq": 72, "tier": "E", "src": "Estimated; uncertain between East Asian and European"},
    "sichuan_sw_china": {"freq": 94, "tier": "P", "src": "gnomAD v4 East Asian 93.7%"},
    "south_china": {"freq": 94, "tier": "P", "src": "gnomAD v4 East Asian 93.7%"},
    "south_india": {"freq": 76, "tier": "P", "src": "gnomAD v4 South Asian 75.7%"},
    "southeast_us": {"freq": 70, "tier": "E", "src": "Estimated European/African admixture"},
    "southern_africa": {"freq": 71, "tier": "P", "src": "gnomAD v4 African 70.6%"},
    "southwest_us": {"freq": 78, "tier": "E", "src": "Estimated mixed population"},
    "subarctic": {"freq": 80, "tier": "E", "src": "Estimated between Siberian and Arctic patterns"},
    "sudanian": {"freq": 71, "tier": "P", "src": "gnomAD v4 African 70.6%"},
    "tibet": {"freq": 93, "tier": "E", "src": "East Asian-related"},
    "west_africa": {"freq": 71, "tier": "P", "src": "gnomAD v4 African 70.6%; 1000G AFR 72.8%"},
    "west_india": {"freq": 76, "tier": "P", "src": "gnomAD v4 South Asian 75.7%"},
    "western_europe": {"freq": 68, "tier": "P", "src": "gnomAD v4 European 68.6%; GoNL 68.1%"}
  }
}
```

---

## JSON Output: NFE2L2 rs6721961

```json
{
  "gene": "NFE2L2",
  "rsid": "rs6721961",
  "variant_name": "-617C>A promoter (NRF2 pathway master regulator)",
  "beneficial_allele": "C (wild-type)",
  "beneficial_allele_effect": "Normal NRF2 transcription maintaining full activation of antioxidant response element (ARE) genes including HO-1, NQO1, GCLC, GSTs; strong detoxification and antioxidant capacity",
  "note_on_strand": "NFE2L2 is on minus strand. Forward strand: G=C(beneficial), T=A(risk). The A allele disrupts ARE-like autoregulatory element causing ~50% reduced NRF2 transcription (Marzec 2007 FASEB J).",
  "sources": [
    "gnomAD v4 Genomes (n=74,631) / Exomes (n=28,298)",
    "1000 Genomes Phase 3 (n=2,504) and 30X (n=3,202)",
    "NCBI ALFA (n=42,955)",
    "TOPMed (n=132,345)",
    "38KJPN Japanese (n=38,721)",
    "Korea4K Korean (n=3,617)",
    "Estonian Biobank (n=2,240)",
    "UK ALSPAC (n=1,927) / TWINSUK (n=1,854)",
    "GoNL Netherlands (n=499)",
    "Northern Sweden ACPOP (n=300)",
    "Vietnamese VDB (n=106)",
    "Qatari Genome (n=108)",
    "Siberian (n=27)"
  ],
  "tier_counts": {"D": 2, "P": 34, "E": 30},
  "populations": {
    "aboriginal_aus": {"freq": 78, "tier": "E", "src": "Estimated Oceanian pattern"},
    "amazon": {"freq": 82, "tier": "E", "src": "Based on 1000G AMR 81.0%"},
    "anatolian": {"freq": 88, "tier": "E", "src": "Weighted avg European 88% and Middle Eastern 88%"},
    "andean": {"freq": 82, "tier": "E", "src": "Based on 1000G AMR 81.0%"},
    "arabian": {"freq": 93, "tier": "P", "src": "Qatari 92.6%"},
    "australian_coastal": {"freq": 78, "tier": "E", "src": "Estimated Oceanian pattern"},
    "balkan": {"freq": 88, "tier": "P", "src": "gnomAD v4 European 87.9%"},
    "bengal": {"freq": 85, "tier": "P", "src": "gnomAD v4 South Asian 84.5%"},
    "brazilian_coastal": {"freq": 88, "tier": "E", "src": "Estimated admixture: EUR 88%, AFR 93%, Indigenous 82%"},
    "california_coast": {"freq": 82, "tier": "E", "src": "Estimated Indigenous American from 1000G AMR 81%"},
    "canadian_prairies": {"freq": 86, "tier": "E", "src": "Estimated European/Indigenous admixture"},
    "caribbean_creole": {"freq": 90, "tier": "E", "src": "Estimated African 93%/European 88% admixture"},
    "caribbean_taino": {"freq": 82, "tier": "E", "src": "Estimated Indigenous Caribbean"},
    "caucasus": {"freq": 88, "tier": "E", "src": "Weighted avg European 88% and Middle Eastern 88%"},
    "central_africa": {"freq": 94, "tier": "P", "src": "1000G AFR 94.3%; gnomAD African 92.9%"},
    "central_asia": {"freq": 82, "tier": "E", "src": "Estimated between East Asian 73% and South Asian 85%"},
    "central_europe": {"freq": 88, "tier": "P", "src": "gnomAD v4 European 87.9%"},
    "eastern_europe": {"freq": 85, "tier": "P", "src": "Estonian 84.9%"},
    "eastern_woodlands": {"freq": 82, "tier": "E", "src": "Estimated Indigenous American from 1000G AMR 81%"},
    "ethiopia": {"freq": 94, "tier": "P", "src": "1000G AFR 94.3%"},
    "gaucho": {"freq": 87, "tier": "E", "src": "Estimated predominantly European with Indigenous admixture"},
    "great_plains": {"freq": 82, "tier": "E", "src": "Estimated Indigenous American"},
    "highland_se_asia": {"freq": 76, "tier": "E", "src": "Estimated between East Asian 73% and South Asian 85%"},
    "horn_somalia": {"freq": 93, "tier": "E", "src": "African with Middle Eastern influence"},
    "inuit": {"freq": 78, "tier": "E", "src": "Estimated from East Asian 73% with Arctic ancestry"},
    "japan": {"freq": 74, "tier": "D", "src": "38KJPN 73.8% (n=77,442 alleles)"},
    "korea": {"freq": 70, "tier": "D", "src": "Korea4K 70.1% (n=7,234 alleles)"},
    "kurdish": {"freq": 88, "tier": "P", "src": "gnomAD v4 Middle Eastern 87.8%"},
    "maasai": {"freq": 94, "tier": "P", "src": "1000G AFR 94.3%"},
    "maghreb": {"freq": 90, "tier": "E", "src": "Estimated between African 94% and Middle Eastern 88%"},
    "malagasy": {"freq": 86, "tier": "E", "src": "Estimated African 94%/SE Asian 77% admixture"},
    "maori": {"freq": 78, "tier": "E", "src": "Estimated Polynesian"},
    "med_levant": {"freq": 88, "tier": "P", "src": "gnomAD v4 Middle Eastern 87.8%"},
    "med_southern": {"freq": 88, "tier": "P", "src": "gnomAD v4 European 87.9%"},
    "melanesia": {"freq": 78, "tier": "E", "src": "Estimated Oceanian"},
    "mesoamerica": {"freq": 82, "tier": "E", "src": "Estimated Indigenous Mesoamerican"},
    "mesopotamian": {"freq": 88, "tier": "P", "src": "gnomAD v4 Middle Eastern 87.8%"},
    "mestizo_mesoamerican": {"freq": 86, "tier": "P", "src": "gnomAD v4 Latino 85.7%"},
    "micronesia": {"freq": 76, "tier": "E", "src": "Estimated between East Asian 73% and Oceanian 78%"},
    "mongolia": {"freq": 73, "tier": "P", "src": "gnomAD v4 East Asian 73.0%"},
    "nepal": {"freq": 80, "tier": "E", "src": "Estimated between South Asian 85% and East Asian 73%"},
    "nile_valley": {"freq": 93, "tier": "E", "src": "Estimated between African 94% and Middle Eastern 88%"},
    "nilotic": {"freq": 94, "tier": "P", "src": "1000G AFR 94.3%"},
    "nordic": {"freq": 83, "tier": "P", "src": "Northern Sweden 83.0%; Danish 82.0%"},
    "north_china": {"freq": 73, "tier": "P", "src": "gnomAD v4 East Asian 73.0%"},
    "north_india": {"freq": 85, "tier": "P", "src": "gnomAD v4 South Asian 84.5%"},
    "pacific_nw": {"freq": 82, "tier": "E", "src": "Estimated Indigenous American"},
    "patagonia": {"freq": 82, "tier": "E", "src": "Estimated Indigenous American"},
    "persian": {"freq": 88, "tier": "P", "src": "gnomAD v4 Middle Eastern 87.8%"},
    "polynesia": {"freq": 78, "tier": "E", "src": "Estimated Polynesian"},
    "sahel": {"freq": 94, "tier": "P", "src": "1000G AFR 94.3%"},
    "se_asia_island": {"freq": 76, "tier": "E", "src": "Estimated between East Asian 73% and Oceanian 78%"},
    "se_asia_main": {"freq": 77, "tier": "P", "src": "Vietnamese 77.4% (n=212 alleles)"},
    "siberia": {"freq": 81, "tier": "P", "src": "Siberian 81.0% (n=54 alleles)"},
    "sichuan_sw_china": {"freq": 73, "tier": "P", "src": "gnomAD v4 East Asian 73.0%"},
    "south_china": {"freq": 73, "tier": "P", "src": "gnomAD v4 East Asian 73.0%"},
    "south_india": {"freq": 85, "tier": "P", "src": "gnomAD v4 South Asian 84.5%"},
    "southeast_us": {"freq": 88, "tier": "E", "src": "Estimated European/African admixture"},
    "southern_africa": {"freq": 94, "tier": "P", "src": "1000G AFR 94.3%"},
    "southwest_us": {"freq": 86, "tier": "E", "src": "Estimated mixed population"},
    "subarctic": {"freq": 80, "tier": "E", "src": "Estimated between Siberian 81% and Inuit 78%"},
    "sudanian": {"freq": 94, "tier": "P", "src": "1000G AFR 94.3%"},
    "tibet": {"freq": 73, "tier": "E", "src": "East Asian-related"},
    "west_africa": {"freq": 94, "tier": "P", "src": "1000G AFR 94.3%; gnomAD African 92.9%"},
    "west_india": {"freq": 85, "tier": "P", "src": "gnomAD v4 South Asian 84.5%"},
    "western_europe": {"freq": 90, "tier": "P", "src": "UK ALSPAC 90.2%; GoNL 91.5%; TWINSUK 89.8%"}
  }
}
```

---

## JSON Output: GSTP1 rs1695

```json
{
  "gene": "GSTP1",
  "rsid": "rs1695",
  "variant_name": "Ile105Val (c.313A>G)",
  "beneficial_allele": "A (Ile105)",
  "beneficial_allele_effect": "Higher glutathione S-transferase P1 conjugation activity; enhanced phase II detoxification of electrophilic compounds and xenobiotics",
  "sources": [
    "gnomAD v4 Genomes (n=74,384)",
    "1000 Genomes Phase 3 (n=2,504) and 30X (n=3,202)",
    "NCBI ALFA (n=363,828)",
    "PAGE Study (n=39,348)",
    "HGDP-CEPH (n=1,041 from 54 populations)",
    "ExAC (n=59,909)",
    "38KJPN Japanese (n=38,722)",
    "Korea4K Korean (n=3,617)",
    "Vietnamese VDB (n=306)",
    "Estonian Biobank (n=2,240)",
    "UK ALSPAC (n=1,927) / TWINSUK (n=1,854)",
    "GoNL Netherlands (n=499)",
    "Northern Sweden ACPOP (n=300)",
    "Finnish FINRISK (n=149)",
    "Spanish MGP (n=267)",
    "Qatari Genome (n=108)",
    "PharmGKB VIP Summary",
    "Sharma et al. 2014 meta-analysis (PMC4287809)"
  ],
  "tier_counts": {"D": 2, "P": 32, "E": 32},
  "populations": {
    "aboriginal_aus": {"freq": 75, "tier": "E", "src": "HGDP Oceania 75.0%"},
    "amazon": {"freq": 55, "tier": "E", "src": "HGDP America 54.6%"},
    "anatolian": {"freq": 71, "tier": "E", "src": "Weighted avg European 67% and Middle Eastern 72%"},
    "andean": {"freq": 50, "tier": "P", "src": "PAGE South American 49.8%"},
    "arabian": {"freq": 72, "tier": "P", "src": "Qatari 72.2%; HGDP Middle East 72.3%"},
    "australian_coastal": {"freq": 75, "tier": "E", "src": "HGDP Oceania 75.0%"},
    "balkan": {"freq": 67, "tier": "P", "src": "gnomAD v4 European 67.1%"},
    "bengal": {"freq": 73, "tier": "P", "src": "gnomAD v4 South Asian 73.2%"},
    "brazilian_coastal": {"freq": 60, "tier": "E", "src": "Estimated admixture: EUR 67%, AFR 52%, Indigenous ~55%"},
    "california_coast": {"freq": 60, "tier": "E", "src": "Estimated Indigenous American/mixed"},
    "canadian_prairies": {"freq": 65, "tier": "E", "src": "Estimated European/Indigenous admixture"},
    "caribbean_creole": {"freq": 60, "tier": "E", "src": "Estimated African 52%/European 67% admixture"},
    "caribbean_taino": {"freq": 60, "tier": "E", "src": "Estimated Indigenous Caribbean from PAGE data"},
    "caucasus": {"freq": 71, "tier": "E", "src": "Weighted avg European 67% and Middle Eastern 72%"},
    "central_africa": {"freq": 52, "tier": "P", "src": "1000G AFR 52.0%"},
    "central_asia": {"freq": 72, "tier": "E", "src": "HGDP Central/South Asia 76.6% adjusted"},
    "central_europe": {"freq": 67, "tier": "P", "src": "gnomAD v4 European 67.1%"},
    "eastern_europe": {"freq": 69, "tier": "P", "src": "Estonian 68.8%"},
    "eastern_woodlands": {"freq": 60, "tier": "P", "src": "PAGE Native American 60.3%"},
    "ethiopia": {"freq": 55, "tier": "E", "src": "Estimated East African; between HGDP Africa 44% and gnomAD African 56%"},
    "gaucho": {"freq": 64, "tier": "E", "src": "Estimated primarily European with Indigenous admixture"},
    "great_plains": {"freq": 60, "tier": "P", "src": "PAGE Native American 60.3%"},
    "highland_se_asia": {"freq": 78, "tier": "E", "src": "Estimated between East Asian 82% and South Asian 73%"},
    "horn_somalia": {"freq": 55, "tier": "E", "src": "Estimated East African with Middle Eastern influence"},
    "inuit": {"freq": 70, "tier": "E", "src": "Estimated from East Asian 82% with Arctic/Native American ancestry"},
    "japan": {"freq": 86, "tier": "D", "src": "38KJPN 85.5% (n=77,444 alleles)"},
    "korea": {"freq": 81, "tier": "D", "src": "Korea4K 81.2% (n=7,234 alleles)"},
    "kurdish": {"freq": 72, "tier": "P", "src": "HGDP Middle East 72.3%"},
    "maasai": {"freq": 50, "tier": "E", "src": "Estimated East African"},
    "maghreb": {"freq": 65, "tier": "E", "src": "Estimated between African 52% and Middle Eastern 72%"},
    "malagasy": {"freq": 62, "tier": "E", "src": "Estimated African 52%/SE Asian 76% admixture"},
    "maori": {"freq": 75, "tier": "E", "src": "Based on HGDP Oceania 75.0%"},
    "med_levant": {"freq": 72, "tier": "P", "src": "HGDP Middle East 72.3%; gnomAD Middle Eastern 75.2%"},
    "med_southern": {"freq": 69, "tier": "P", "src": "gnomAD European 67.1%; Spanish MGP 71.0%"},
    "melanesia": {"freq": 75, "tier": "P", "src": "HGDP Oceania 75.0%"},
    "mesoamerica": {"freq": 56, "tier": "E", "src": "Estimated Indigenous Mesoamerican from PAGE Central American 55.7%"},
    "mesopotamian": {"freq": 72, "tier": "P", "src": "HGDP Middle East 72.3%"},
    "mestizo_mesoamerican": {"freq": 53, "tier": "P", "src": "PAGE Mexican 49.4%; gnomAD Latino 58.0% blended"},
    "micronesia": {"freq": 76, "tier": "E", "src": "Estimated between East Asian 82% and Oceanian 75%"},
    "mongolia": {"freq": 80, "tier": "P", "src": "gnomAD v4 East Asian 82.0%"},
    "nepal": {"freq": 75, "tier": "E", "src": "Estimated between South Asian 73% and East Asian 82%"},
    "nile_valley": {"freq": 58, "tier": "E", "src": "Estimated between African 52% and Middle Eastern 72%"},
    "nilotic": {"freq": 50, "tier": "E", "src": "Estimated East African"},
    "nordic": {"freq": 72, "tier": "P", "src": "Northern Sweden 72.2%; Finnish FINRISK 75.5%"},
    "north_china": {"freq": 82, "tier": "P", "src": "gnomAD v4 East Asian 82.0%"},
    "north_india": {"freq": 73, "tier": "P", "src": "gnomAD v4 South Asian 73.2%; PAGE South Asian 73.7%"},
    "pacific_nw": {"freq": 60, "tier": "E", "src": "Estimated Indigenous American from PAGE Native American 60.3%"},
    "patagonia": {"freq": 50, "tier": "E", "src": "Based on PAGE South American 49.8%"},
    "persian": {"freq": 72, "tier": "P", "src": "HGDP Middle East 72.3%; gnomAD Middle Eastern 75.2%"},
    "polynesia": {"freq": 77, "tier": "P", "src": "PAGE Native Hawaiian 77.1% (n=4,534 alleles)"},
    "sahel": {"freq": 50, "tier": "E", "src": "Estimated West African/Sahelian"},
    "se_asia_island": {"freq": 78, "tier": "E", "src": "Estimated between East Asian 82% and Oceanian 75%"},
    "se_asia_main": {"freq": 76, "tier": "P", "src": "Vietnamese 76.3% (n=612 alleles)"},
    "siberia": {"freq": 65, "tier": "E", "src": "Estimated; SGDP Siberian 33% (n=30, unreliable); adjusted upward"},
    "sichuan_sw_china": {"freq": 82, "tier": "P", "src": "gnomAD v4 East Asian 82.0%"},
    "south_china": {"freq": 82, "tier": "P", "src": "gnomAD v4 East Asian 82.0%"},
    "south_india": {"freq": 73, "tier": "P", "src": "gnomAD v4 South Asian 73.2%"},
    "southeast_us": {"freq": 62, "tier": "E", "src": "Estimated European/African American admixture"},
    "southern_africa": {"freq": 50, "tier": "E", "src": "Estimated from HGDP Africa 44% and gnomAD African 56% midpoint"},
    "southwest_us": {"freq": 62, "tier": "E", "src": "Estimated mixed population"},
    "subarctic": {"freq": 65, "tier": "E", "src": "Estimated between Siberian and Arctic patterns"},
    "sudanian": {"freq": 50, "tier": "E", "src": "Estimated West African/Sudanian"},
    "tibet": {"freq": 80, "tier": "E", "src": "East Asian-related"},
    "west_africa": {"freq": 50, "tier": "P", "src": "1000G AFR 52.0%; HGDP Africa 44.2%"},
    "west_india": {"freq": 73, "tier": "P", "src": "gnomAD v4 South Asian 73.2%"},
    "western_europe": {"freq": 67, "tier": "P", "src": "gnomAD v4 European 67.1%; UK 65.1-65.5%"}
  }
}
```

---

## Key population frequency patterns across all five variants

The most striking cross-variant pattern is that **East Asian populations consistently diverge from the global mean**. For SOD2, they carry the beneficial Ala allele at only **12–13%** versus 43–52% elsewhere. For NRF2, the beneficial C allele drops to **70–74%** versus 85–94% in other groups. Conversely, East Asians show the **highest** beneficial allele frequencies for GPX1 (93–94%) and GSTP1 (81–86%), suggesting compensatory evolutionary pressures across the antioxidant gene network.

**African populations show the strongest NRF2 pathway activation capacity**, with the highest beneficial allele frequencies for NFE2L2 rs6721961 (94%) and relatively high GPX1 (71%). However, they have the lowest GSTP1 Ile allele frequencies (50–56%), meaning reduced glutathione conjugation capacity is more prevalent.

**European populations cluster near global averages** for most variants, with a notable 50:50 split for SOD2 rs4880 and among the highest CAT T allele frequencies (22–26%). **South Asian populations** closely parallel Europeans for SOD2 and NRF2 but show higher GPX1 beneficial allele frequency (76% vs 69%).

**Indigenous American populations** stand out for having the highest SOD2 Ala (beneficial) allele frequency at **54–61%**, the highest globally, while showing moderate to low GSTP1 Ile frequencies (50–60%).

## Methodology and data quality notes

**Population mapping logic:** Each of the 66 target population IDs was mapped to database reference populations using genetic ancestry proximity. Where multiple databases reported values for the same ancestry group, gnomAD v4 was prioritized for broadest ancestry categories, with national genome projects (38KJPN, Korea4K, Estonian Biobank) preferred for population-specific estimates. PAGE Study data provided critical granularity for admixed American populations.

**Key caveats for E-tier populations:** Oceanian populations (aboriginal_aus, melanesia, micronesia, maori) have very limited representation in major databases. Estimates for these groups carry the highest uncertainty. Similarly, Central Asian (central_asia), Siberian (siberia), and Arctic (inuit, subarctic) populations are poorly represented. The HGDP provided the only Oceanian reference data, primarily used for GSTP1.

**CAT rs1001179 data limitations:** This variant has significantly less population-level data compared to the other four. African and South Asian frequencies are extrapolated from global database patterns rather than direct measurement. The European frequency of ~22% and East Asian frequency of ~3% are well-established, but intermediate populations carry substantial uncertainty. The functional evidence for the T allele as beneficial (higher catalase expression via enhanced ETS-1/GR-β transcription factor binding) is supported by Forsberg et al. 2001, Saify et al. 2016, and Ferretti et al. 2022.

**Strand orientation cautions:** SOD2 rs4880, GPX1 rs1050450, and NFE2L2 rs6721961 are all on the minus strand. All frequencies in this report have been converted to the coding/protein strand allele designation (C/Ala for SOD2, C/Pro for GPX1, C for NFE2L2) to match the functional literature. Database alleles on the forward strand are: SOD2 G=Ala, GPX1 G=Pro, NFE2L2 G=C(beneficial).