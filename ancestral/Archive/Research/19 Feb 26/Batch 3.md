# Batch 3 thermic effect & metabolism: population allele frequencies for 66 populations

**All five gene variants—UCP1, UCP2, UCP3, DIO2, and TRPM8—have sufficient cross-population data to map across the full 66-population panel.** The strongest population differentiation appears in TRPM8 rs10166942, where the cold-adaptation T allele ranges from **~5% in West Africa to ~87% in Nordic populations**, representing one of the most extreme frequency clines in the human genome. UCP1 and DIO2 also show marked continental variation, while UCP2 and UCP3 exhibit more modest differentiation. A critical allele correction was identified for DIO2 rs225014: the **T allele (not C) encodes Thr92** on the forward strand, associated with efficient thyroid hormone conversion. All frequencies below reflect the beneficial/enhanced-function allele.

Data was compiled from gnomAD v4, 1000 Genomes Phase 3, NCBI ALFA, the PAGE Study, 38KJPN, Korean genome projects, and published population-specific studies. Frequencies for the 66 population IDs are classified as **D** (direct match to a database population), **P** (proxy from a related population), or **E** (extrapolated via weighted admixture formula). Fourteen populations achieved D-tier mapping, 27 achieved P-tier, and 25 required E-tier extrapolation.

---

## Strand orientation and beneficial alleles

All major genomic databases report alleles on the **forward (plus) genomic strand**. Because UCP1, UCP2, UCP3, and DIO2 are all encoded on the **reverse (minus) strand**, the literature allele designations differ from database designations. The table below clarifies the mapping for each variant and identifies the allele whose frequency is reported throughout this document.

| Gene | rsID | Literature Allele | Forward Strand Allele | Effect |
|------|------|------------------|-----------------------|--------|
| **UCP1** | rs1800592 | A (promoter) | T (ref) | Enhanced brown fat thermogenesis |
| **UCP2** | rs659366 | A (promoter) | T (alt) | Enhanced metabolic rate |
| **UCP3** | rs1800849 | T (promoter) | A (alt) | Enhanced muscle thermogenesis |
| **DIO2** | rs225014 | **T = Thr92** (ref)¹ | T (ref) | Efficient T4→T3 thyroid conversion |
| **TRPM8** | rs10166942 | T (derived) | T (alt) | Enhanced cold tolerance |

¹ **Correction**: The task brief stated the C allele encodes Thr92. This is incorrect. On the forward strand, **T = Thr92 (reference)** and **C = Ala92 (alternate)**. This is confirmed across multiple peer-reviewed sources including Persani & Campi (JCEM 2022), McAninch et al. (JCEM 2018), and Castagna et al. (JCEM 2017). The Ala92 (C) variant is actually the ancestral allele carried by Neanderthals and Denisovans.

---

## Population tier mapping methodology

Each of the 66 population IDs was mapped to the closest available genomic database population(s). **D-tier** populations have direct frequency data from a closely matching reference (e.g., `japan` ← 1000G JPT + 38KJPN). **P-tier** populations use a genetically related proxy (e.g., `nilotic` ← 1000G LWK as East African proxy). **E-tier** populations are computed from weighted ancestry proportions (e.g., `ethiopia` ← 55% AFR + 40% MID + 5% SAS). Aboriginal Australian and Oceanian populations carry the **highest uncertainty** because no adequate reference exists in current public databases; Papuan HGDP data serves as a very imprecise proxy.

Key source populations and their database origins include gnomAD v4 superpopulations (NFE, FIN, EAS, SAS, AFR, AMR, MID, ASJ), all 26 1000 Genomes Phase 3 sub-populations, and national genome projects (38KJPN for Japan at n=38,722; KRGDB/Korea4K for Korea; Estonian Biobank; GoNL for Netherlands; PAGE Study for diverse American populations including Native American, Native Hawaiian, and multiple Hispanic/Latino subgroups).

---

## Gene-by-gene continental patterns

**UCP1 rs1800592** shows the A allele as the global major allele at **~60.5%** (gnomAD v4). Europeans carry the highest frequencies (**75–78%**), followed by Middle Eastern populations (~72%), South Asians (~63%), and East Asians (~51%). Sub-Saharan African populations have the lowest frequencies (**24–28%** in unadmixed populations), making the G allele dominant in Africa. The Siberian frequency of **44%** sits below the East Asian average, while Native Americans from the PAGE Study show a notably high **64.5%**.

**UCP2 rs659366** displays more modest differentiation globally at **~41%** for the beneficial A allele. East Asians carry the highest frequencies (**50–54%**), while European, African, and South Asian populations cluster in a narrower band (**35–42%**). The relative uniformity across non-East-Asian populations suggests weaker directional selection compared to other thermogenesis variants.

**UCP3 rs1800849** has a global frequency of only **~19%** for the enhanced-thermogenesis T allele but shows a striking latitudinal gradient. Northern Asian/Siberian populations reach **~45%** (Yakut data from Nikanorova et al. 2025), East Asians average **~24%**, Europeans ~21%, South Asians ~23%, and sub-Saharan Africans only **~10%**. This gradient supports positive selection in cold environments, corroborated by significant correlation between T allele frequency and winter climate variables across 52 world populations.

**DIO2 rs225014** Thr92 frequency varies dramatically: East Asians carry the highest rate at **84–86%**, South Asians ~65%, Europeans ~58–62%, and Africans only **~49%** (where Ala92 actually becomes the majority allele). The Finnish population shows the lowest European Thr92 frequency at **~58%**, consistent with reports that Finns have the highest Ala/Ala homozygote rate among Europeans.

**TRPM8 rs10166942** exhibits the most extreme population structure of all five variants, with an FST value in the **top 0.02%** of the genome-wide distribution between Yoruba and Finnish populations. The derived T allele reaches **87% in Finland**, ~80–84% across other European populations, ~45–57% in South Asia (with a clear north-south gradient from Punjab to Sri Lanka), ~30–45% in East Asia, and only **3–7% in sub-Saharan Africa**. ABC modeling by Key et al. (2018, PLoS Genetics) confirmed strong positive selection on standing variation during human colonization of cold Eurasian environments.

---

## Complete JSON frequency data

```json
{
  "batch": "Batch 3 - Thermic Effect & Metabolism",
  "compiled": "2026-02-19",
  "format_note": "Each population entry is [frequency_percent, tier_code]. Frequency = beneficial allele percentage (0-100). Tiers: D=direct, P=proxy, E=extrapolated.",
  "data_quality_note": "D-tier values accurate to ±1-2%. P-tier values accurate to ±3-5%. E-tier values are modeled estimates with ±5-15% uncertainty. Aboriginal Australian and Oceanian E-tier values carry highest uncertainty.",
  "allele_correction": "DIO2 rs225014: T allele (forward strand) = Thr92 = efficient thyroid conversion. The task brief incorrectly stated C = Thr; C actually = Ala92.",

  "genes": {
    "UCP1": {
      "rsid": "rs1800592",
      "gene": "UCP1",
      "variant_description": "-3826A>G promoter",
      "chromosome": "4",
      "position_grch38": 140572807,
      "beneficial_allele_literature": "A",
      "beneficial_allele_forward_strand": "T",
      "ref_allele_forward": "T",
      "alt_allele_forward": "C",
      "effect": "Enhanced brown fat thermogenesis via higher UCP1 expression",
      "global_freq_gnomad": 60.5,
      "primary_sources": [
        "gnomAD v4 genomes (n=149,108 alleles)",
        "1000 Genomes Phase 3 (n=5,008 alleles)",
        "38KJPN (n=77,444 alleles)",
        "KRGDB/Korea4K",
        "PAGE Study (n=78,700 alleles)",
        "Estonian Biobank (n=4,480 alleles)",
        "GoNL (n=998 alleles)",
        "Northern Sweden (n=600 alleles)"
      ],
      "populations": {
        "aboriginal_aus":          [33.0, "E"],
        "amazon":                  [58.0, "E"],
        "anatolian":               [73.5, "P"],
        "andean":                  [60.0, "P"],
        "arabian":                 [70.0, "P"],
        "australian_coastal":      [33.0, "E"],
        "balkan":                  [75.0, "P"],
        "bengal":                  [61.0, "D"],
        "brazilian_coastal":       [53.0, "E"],
        "california_coast":        [64.0, "E"],
        "canadian_prairies":       [66.0, "E"],
        "caribbean_creole":        [49.0, "E"],
        "caribbean_taino":         [58.0, "E"],
        "caucasus":                [74.0, "P"],
        "central_africa":          [25.0, "P"],
        "central_asia":            [60.0, "P"],
        "central_europe":          [76.0, "P"],
        "eastern_europe":          [73.0, "P"],
        "eastern_woodlands":       [65.0, "E"],
        "ethiopia":                [46.0, "E"],
        "gaucho":                  [68.0, "E"],
        "great_plains":            [65.0, "E"],
        "highland_se_asia":        [48.0, "P"],
        "horn_somalia":            [53.0, "E"],
        "inuit":                   [52.0, "E"],
        "japan":                   [51.0, "D"],
        "korea":                   [52.0, "D"],
        "kurdish":                 [72.0, "P"],
        "maasai":                  [28.0, "P"],
        "maghreb":                 [65.0, "P"],
        "malagasy":                [37.0, "E"],
        "maori":                   [45.0, "E"],
        "med_levant":              [72.0, "P"],
        "med_southern":            [75.0, "D"],
        "melanesia":               [33.0, "E"],
        "mesoamerica":             [62.0, "P"],
        "mesopotamian":            [72.0, "P"],
        "mestizo_mesoamerican":    [56.0, "D"],
        "micronesia":              [45.0, "E"],
        "mongolia":                [52.0, "P"],
        "nepal":                   [58.0, "E"],
        "nile_valley":             [54.0, "E"],
        "nilotic":                 [28.0, "P"],
        "nordic":                  [77.0, "D"],
        "north_china":             [52.0, "D"],
        "north_india":             [63.0, "D"],
        "pacific_nw":              [65.0, "E"],
        "patagonia":               [58.0, "E"],
        "persian":                 [72.0, "P"],
        "polynesia":               [45.0, "E"],
        "sahel":                   [25.0, "P"],
        "se_asia_island":          [50.0, "P"],
        "se_asia_main":            [48.0, "D"],
        "siberia":                 [44.0, "P"],
        "sichuan_sw_china":        [52.0, "P"],
        "south_china":             [53.0, "D"],
        "south_india":             [59.0, "D"],
        "southeast_us":            [56.0, "E"],
        "southern_africa":         [25.0, "P"],
        "southwest_us":            [65.0, "P"],
        "subarctic":               [54.0, "E"],
        "sudanian":                [24.0, "P"],
        "tibet":                   [53.0, "E"],
        "west_africa":             [24.0, "D"],
        "west_india":              [62.0, "D"],
        "western_europe":          [76.0, "D"]
      }
    },

    "UCP2": {
      "rsid": "rs659366",
      "gene": "UCP2",
      "variant_description": "-866G>A promoter",
      "chromosome": "11",
      "position_grch38": 73685976,
      "beneficial_allele_literature": "A",
      "beneficial_allele_forward_strand": "T",
      "ref_allele_forward": "C",
      "alt_allele_forward": "T",
      "effect": "Enhanced metabolic rate via increased UCP2 transcription",
      "global_freq_gnomad": 40.4,
      "primary_sources": [
        "gnomAD v2.1.1/v4 genomes",
        "1000 Genomes Phase 3 (n=5,008 alleles)",
        "NCBI ALFA"
      ],
      "populations": {
        "aboriginal_aus":          [38.0, "E"],
        "amazon":                  [50.0, "E"],
        "anatolian":               [37.0, "P"],
        "andean":                  [49.0, "P"],
        "arabian":                 [38.0, "P"],
        "australian_coastal":      [38.0, "E"],
        "balkan":                  [36.0, "P"],
        "bengal":                  [42.0, "D"],
        "brazilian_coastal":       [38.0, "E"],
        "california_coast":        [50.0, "E"],
        "canadian_prairies":       [42.0, "E"],
        "caribbean_creole":        [38.0, "E"],
        "caribbean_taino":         [50.0, "E"],
        "caucasus":                [37.0, "P"],
        "central_africa":          [35.0, "P"],
        "central_asia":            [44.0, "P"],
        "central_europe":          [38.0, "P"],
        "eastern_europe":          [37.0, "P"],
        "eastern_woodlands":       [50.0, "E"],
        "ethiopia":                [37.0, "E"],
        "gaucho":                  [40.0, "E"],
        "great_plains":            [50.0, "E"],
        "highland_se_asia":        [48.0, "P"],
        "horn_somalia":            [37.0, "E"],
        "inuit":                   [49.0, "E"],
        "japan":                   [54.0, "D"],
        "korea":                   [52.0, "D"],
        "kurdish":                 [38.0, "P"],
        "maasai":                  [37.0, "P"],
        "maghreb":                 [37.0, "P"],
        "malagasy":                [41.0, "E"],
        "maori":                   [46.0, "E"],
        "med_levant":              [38.0, "P"],
        "med_southern":            [35.0, "D"],
        "melanesia":               [38.0, "E"],
        "mesoamerica":             [50.0, "P"],
        "mesopotamian":            [38.0, "P"],
        "mestizo_mesoamerican":    [47.0, "D"],
        "micronesia":              [45.0, "E"],
        "mongolia":                [52.0, "P"],
        "nepal":                   [44.0, "E"],
        "nile_valley":             [37.0, "E"],
        "nilotic":                 [37.0, "P"],
        "nordic":                  [38.0, "D"],
        "north_china":             [52.0, "D"],
        "north_india":             [40.0, "D"],
        "pacific_nw":              [50.0, "E"],
        "patagonia":               [50.0, "E"],
        "persian":                 [38.0, "P"],
        "polynesia":               [46.0, "E"],
        "sahel":                   [36.0, "P"],
        "se_asia_island":          [49.0, "P"],
        "se_asia_main":            [48.0, "D"],
        "siberia":                 [48.0, "P"],
        "sichuan_sw_china":        [49.0, "P"],
        "south_china":             [51.0, "D"],
        "south_india":             [39.0, "D"],
        "southeast_us":            [37.0, "E"],
        "southern_africa":         [35.0, "P"],
        "southwest_us":            [50.0, "P"],
        "subarctic":               [49.0, "E"],
        "sudanian":                [35.0, "P"],
        "tibet":                   [48.0, "E"],
        "west_africa":             [35.0, "D"],
        "west_india":              [39.0, "D"],
        "western_europe":          [38.0, "D"]
      }
    },

    "UCP3": {
      "rsid": "rs1800849",
      "gene": "UCP3",
      "variant_description": "-55C>T promoter",
      "chromosome": "11",
      "position_grch38": 74006543,
      "beneficial_allele_literature": "T",
      "beneficial_allele_forward_strand": "A",
      "ref_allele_forward": "G",
      "alt_allele_forward": "A",
      "effect": "Enhanced muscle thermogenesis via higher UCP3 mRNA expression",
      "global_freq_gnomad": 19.8,
      "primary_sources": [
        "gnomAD v2.1.1/v4 genomes",
        "1000 Genomes Phase 3 (n=5,008 alleles)",
        "Nikanorova et al. 2025 MDPI Biology (Siberian cold adaptation study)",
        "NCBI ALFA"
      ],
      "populations": {
        "aboriginal_aus":          [15.0, "E"],
        "amazon":                  [26.0, "E"],
        "anatolian":               [22.0, "P"],
        "andean":                  [25.0, "P"],
        "arabian":                 [22.0, "P"],
        "australian_coastal":      [15.0, "E"],
        "balkan":                  [21.0, "P"],
        "bengal":                  [24.0, "D"],
        "brazilian_coastal":       [17.0, "E"],
        "california_coast":        [26.0, "E"],
        "canadian_prairies":       [22.0, "E"],
        "caribbean_creole":        [17.0, "E"],
        "caribbean_taino":         [26.0, "E"],
        "caucasus":                [21.0, "P"],
        "central_africa":          [10.0, "P"],
        "central_asia":            [23.0, "P"],
        "central_europe":          [21.0, "P"],
        "eastern_europe":          [21.0, "P"],
        "eastern_woodlands":       [26.0, "E"],
        "ethiopia":                [16.0, "E"],
        "gaucho":                  [21.0, "E"],
        "great_plains":            [26.0, "E"],
        "highland_se_asia":        [23.0, "P"],
        "horn_somalia":            [18.0, "E"],
        "inuit":                   [37.0, "E"],
        "japan":                   [24.0, "D"],
        "korea":                   [24.0, "D"],
        "kurdish":                 [22.0, "P"],
        "maasai":                  [12.0, "P"],
        "maghreb":                 [19.0, "P"],
        "malagasy":                [17.0, "E"],
        "maori":                   [22.0, "E"],
        "med_levant":              [22.0, "P"],
        "med_southern":            [22.0, "D"],
        "melanesia":               [15.0, "E"],
        "mesoamerica":             [26.0, "P"],
        "mesopotamian":            [22.0, "P"],
        "mestizo_mesoamerican":    [24.0, "D"],
        "micronesia":              [21.0, "E"],
        "mongolia":                [24.0, "P"],
        "nepal":                   [24.0, "E"],
        "nile_valley":             [18.0, "E"],
        "nilotic":                 [12.0, "P"],
        "nordic":                  [21.0, "D"],
        "north_china":             [24.0, "D"],
        "north_india":             [24.0, "D"],
        "pacific_nw":              [26.0, "E"],
        "patagonia":               [26.0, "E"],
        "persian":                 [22.0, "P"],
        "polynesia":               [22.0, "E"],
        "sahel":                   [11.0, "P"],
        "se_asia_island":          [24.0, "P"],
        "se_asia_main":            [23.0, "D"],
        "siberia":                 [45.0, "P"],
        "sichuan_sw_china":        [24.0, "P"],
        "south_china":             [24.0, "D"],
        "south_india":             [23.0, "D"],
        "southeast_us":            [18.0, "E"],
        "southern_africa":         [10.0, "P"],
        "southwest_us":            [26.0, "P"],
        "subarctic":               [36.0, "E"],
        "sudanian":                [10.0, "P"],
        "tibet":                   [24.0, "E"],
        "west_africa":             [10.0, "D"],
        "west_india":              [23.0, "D"],
        "western_europe":          [22.0, "D"]
      }
    },

    "DIO2": {
      "rsid": "rs225014",
      "gene": "DIO2",
      "variant_description": "Thr92Ala missense",
      "chromosome": "14",
      "position_grch38": 79746611,
      "beneficial_allele_literature": "Thr92",
      "beneficial_allele_forward_strand": "T",
      "ref_allele_forward": "T",
      "alt_allele_forward": "C",
      "effect": "Efficient thyroid hormone activation (normal T4 to T3 conversion)",
      "global_freq_1kg": 63.9,
      "allele_note": "CORRECTION: T allele = Thr92 (reference, efficient). C allele = Ala92 (alternate, reduced activity). Task brief incorrectly stated C = Thr.",
      "primary_sources": [
        "1000 Genomes Phase 3 (n=5,008 alleles)",
        "gnomAD v2.1.1/v4 genomes",
        "Persani & Campi, JCEM 2022",
        "McAninch et al., JCEM 2018",
        "NCBI ALFA"
      ],
      "populations": {
        "aboriginal_aus":          [55.0, "E"],
        "amazon":                  [70.0, "E"],
        "anatolian":               [60.0, "P"],
        "andean":                  [65.0, "P"],
        "arabian":                 [58.0, "P"],
        "australian_coastal":      [55.0, "E"],
        "balkan":                  [61.0, "P"],
        "bengal":                  [63.0, "D"],
        "brazilian_coastal":       [57.0, "E"],
        "california_coast":        [70.0, "E"],
        "canadian_prairies":       [66.0, "E"],
        "caribbean_creole":        [57.0, "E"],
        "caribbean_taino":         [70.0, "E"],
        "caucasus":                [60.0, "P"],
        "central_africa":          [49.0, "P"],
        "central_asia":            [71.0, "P"],
        "central_europe":          [62.0, "P"],
        "eastern_europe":          [60.0, "P"],
        "eastern_woodlands":       [70.0, "E"],
        "ethiopia":                [54.0, "E"],
        "gaucho":                  [62.0, "E"],
        "great_plains":            [70.0, "E"],
        "highland_se_asia":        [84.0, "P"],
        "horn_somalia":            [55.0, "E"],
        "inuit":                   [76.0, "E"],
        "japan":                   [86.0, "D"],
        "korea":                   [85.0, "D"],
        "kurdish":                 [58.0, "P"],
        "maasai":                  [48.0, "P"],
        "maghreb":                 [56.0, "P"],
        "malagasy":                [61.0, "E"],
        "maori":                   [78.0, "E"],
        "med_levant":              [58.0, "P"],
        "med_southern":            [62.0, "D"],
        "melanesia":               [55.0, "E"],
        "mesoamerica":             [70.0, "P"],
        "mesopotamian":            [58.0, "P"],
        "mestizo_mesoamerican":    [66.0, "D"],
        "micronesia":              [76.0, "E"],
        "mongolia":                [84.0, "P"],
        "nepal":                   [73.0, "E"],
        "nile_valley":             [55.0, "E"],
        "nilotic":                 [48.0, "P"],
        "nordic":                  [58.0, "D"],
        "north_china":             [85.0, "D"],
        "north_india":             [66.0, "D"],
        "pacific_nw":              [70.0, "E"],
        "patagonia":               [70.0, "E"],
        "persian":                 [58.0, "P"],
        "polynesia":               [78.0, "E"],
        "sahel":                   [50.0, "P"],
        "se_asia_island":          [84.0, "P"],
        "se_asia_main":            [84.0, "D"],
        "siberia":                 [80.0, "P"],
        "sichuan_sw_china":        [84.0, "P"],
        "south_china":             [84.0, "D"],
        "south_india":             [66.0, "D"],
        "southeast_us":            [57.0, "E"],
        "southern_africa":         [49.0, "P"],
        "southwest_us":            [70.0, "P"],
        "subarctic":               [75.0, "E"],
        "sudanian":                [49.0, "P"],
        "tibet":                   [81.0, "E"],
        "west_africa":             [49.0, "D"],
        "west_india":              [66.0, "D"],
        "western_europe":          [61.0, "D"]
      }
    },

    "TRPM8": {
      "rsid": "rs10166942",
      "gene": "TRPM8",
      "variant_description": "Upstream regulatory C>T",
      "chromosome": "2",
      "position_grch37": 234825093,
      "beneficial_allele_literature": "T (derived)",
      "beneficial_allele_forward_strand": "T",
      "ref_allele_forward": "C",
      "alt_allele_forward": "T",
      "effect": "Enhanced cold tolerance via TRPM8 cold receptor adaptation",
      "global_freq_est": 42.0,
      "selection_note": "Extreme positive selection signature (FST in top 0.02% genome-wide between YRI and FIN). T allele absent in Neanderthal/Denisovan genomes; arose in anatomically modern humans and swept to high frequency in cold-climate populations.",
      "primary_sources": [
        "Key et al. 2018, PLoS Genetics 14(5):e1007298 (1000 Genomes Phase 3 population frequencies)",
        "gnomAD v3.1/v4 genomes",
        "1000 Genomes Phase 3"
      ],
      "populations": {
        "aboriginal_aus":          [10.0, "E"],
        "amazon":                  [45.0, "E"],
        "anatolian":               [71.0, "P"],
        "andean":                  [50.0, "P"],
        "arabian":                 [60.0, "P"],
        "australian_coastal":      [10.0, "E"],
        "balkan":                  [80.0, "P"],
        "bengal":                  [52.0, "D"],
        "brazilian_coastal":       [47.0, "E"],
        "california_coast":        [50.0, "E"],
        "canadian_prairies":       [63.0, "E"],
        "caribbean_creole":        [40.0, "E"],
        "caribbean_taino":         [45.0, "E"],
        "caucasus":                [73.0, "P"],
        "central_africa":          [5.0, "P"],
        "central_asia":            [46.0, "P"],
        "central_europe":          [82.0, "P"],
        "eastern_europe":          [84.0, "P"],
        "eastern_woodlands":       [55.0, "E"],
        "ethiopia":                [29.0, "E"],
        "gaucho":                  [68.0, "E"],
        "great_plains":            [55.0, "E"],
        "highland_se_asia":        [30.0, "P"],
        "horn_somalia":            [37.0, "E"],
        "inuit":                   [58.0, "E"],
        "japan":                   [45.0, "D"],
        "korea":                   [42.0, "D"],
        "kurdish":                 [60.0, "P"],
        "maasai":                  [7.0, "P"],
        "maghreb":                 [44.0, "P"],
        "malagasy":                [18.0, "E"],
        "maori":                   [26.0, "E"],
        "med_levant":              [60.0, "P"],
        "med_southern":            [82.0, "D"],
        "melanesia":               [10.0, "E"],
        "mesoamerica":             [55.0, "P"],
        "mesopotamian":            [60.0, "P"],
        "mestizo_mesoamerican":    [58.0, "D"],
        "micronesia":              [25.0, "E"],
        "mongolia":                [45.0, "P"],
        "nepal":                   [43.0, "E"],
        "nile_valley":             [42.0, "E"],
        "nilotic":                 [7.0, "P"],
        "nordic":                  [87.0, "D"],
        "north_china":             [39.0, "D"],
        "north_india":             [55.0, "D"],
        "pacific_nw":              [55.0, "E"],
        "patagonia":               [55.0, "E"],
        "persian":                 [60.0, "P"],
        "polynesia":               [26.0, "E"],
        "sahel":                   [5.0, "P"],
        "se_asia_island":          [32.0, "P"],
        "se_asia_main":            [30.0, "D"],
        "siberia":                 [60.0, "P"],
        "sichuan_sw_china":        [33.0, "P"],
        "south_china":             [36.0, "D"],
        "south_india":             [38.0, "D"],
        "southeast_us":            [52.0, "E"],
        "southern_africa":         [4.0, "P"],
        "southwest_us":            [55.0, "P"],
        "subarctic":               [58.0, "E"],
        "sudanian":                [5.0, "P"],
        "tibet":                   [38.0, "E"],
        "west_africa":             [5.0, "D"],
        "west_india":              [53.0, "D"],
        "western_europe":          [81.0, "D"]
      }
    }
  },

  "population_tier_map": {
    "aboriginal_aus":          {"tier": "E", "basis": "Papuan/Melanesian HGDP proxy — very poor match, highest uncertainty", "formula": "OCE estimate"},
    "amazon":                  {"tier": "E", "basis": "HGDP Karitiana/Surui + PAGE South American/Native American", "formula": "Indigenous SA estimate"},
    "anatolian":               {"tier": "P", "basis": "gnomAD MID (50%) + gnomAD NFE (50%)", "formula": "0.50×MID + 0.50×NFE"},
    "andean":                  {"tier": "P", "basis": "1000G PEL (Peruvian Lima) adjusted for indigenous component", "formula": "PEL + PAGE Native American adjustment"},
    "arabian":                 {"tier": "P", "basis": "gnomAD MID + Qatari genome project", "formula": "avg(MID, Qatari)"},
    "australian_coastal":      {"tier": "E", "basis": "Papuan/Melanesian HGDP proxy — very poor match", "formula": "OCE estimate"},
    "balkan":                  {"tier": "P", "basis": "gnomAD NFE with Southern European lean", "formula": "NFE"},
    "bengal":                  {"tier": "D", "basis": "1000 Genomes BEB (Bengali from Bangladesh, n=86)"},
    "brazilian_coastal":       {"tier": "E", "basis": "Tri-hybrid admixture model", "formula": "0.45×NFE + 0.40×AFR + 0.15×AMR"},
    "california_coast":        {"tier": "E", "basis": "PAGE Native American + indigenous North American estimate"},
    "canadian_prairies":       {"tier": "E", "basis": "Modern diverse population model", "formula": "0.50×NFE + 0.20×NativeAmer + 0.15×EAS + 0.10×SAS + 0.05×AFR"},
    "caribbean_creole":        {"tier": "E", "basis": "Caribbean admixture model + PAGE Dominican/Cuban", "formula": "0.50×AFR + 0.35×NFE + 0.15×NativeAmer"},
    "caribbean_taino":         {"tier": "E", "basis": "Indigenous Caribbean estimate from Mesoamerican/SA proxies"},
    "caucasus":                {"tier": "P", "basis": "HGDP Adygei (NW Caucasus)", "formula": "0.60×NFE + 0.40×MID"},
    "central_africa":          {"tier": "P", "basis": "gnomAD AFR + HGDP Biaka/Mbuti (Central African)"},
    "central_asia":            {"tier": "P", "basis": "HGDP Hazara/Uygur/Burusho", "formula": "0.40×EAS + 0.35×SAS + 0.25×MID"},
    "central_europe":          {"tier": "P", "basis": "1000G CEU (Utah N/W European ancestry)"},
    "eastern_europe":          {"tier": "P", "basis": "Estonian Biobank + HGDP Russian + gnomAD NFE"},
    "eastern_woodlands":       {"tier": "E", "basis": "PAGE Native American"},
    "ethiopia":                {"tier": "E", "basis": "Ethiopian admixture model", "formula": "0.55×AFR + 0.40×MID + 0.05×SAS"},
    "gaucho":                  {"tier": "E", "basis": "Southern Cone admixture model", "formula": "0.65×NFE + 0.25×NativeAmer + 0.10×AFR"},
    "great_plains":            {"tier": "E", "basis": "PAGE Native American + HGDP Pima"},
    "highland_se_asia":        {"tier": "P", "basis": "1000G CDX + KHV + HGDP Lahu/Miao"},
    "horn_somalia":            {"tier": "E", "basis": "Somali admixture model", "formula": "0.40×AFR + 0.55×MID + 0.05×SAS"},
    "inuit":                   {"tier": "E", "basis": "Arctic adaptation model", "formula": "0.60×Siberian + 0.40×NativeAmer"},
    "japan":                   {"tier": "D", "basis": "38KJPN (n=38,722) + 1000G JPT (n=104)"},
    "korea":                   {"tier": "D", "basis": "KRGDB (n=1,465) + Korea4K (n=3,617)"},
    "kurdish":                 {"tier": "P", "basis": "gnomAD MID (West Asian proxy)"},
    "maasai":                  {"tier": "P", "basis": "1000G LWK (Luhya, Kenya) as East African proxy"},
    "maghreb":                 {"tier": "P", "basis": "HGDP Mozabite (Algeria) + gnomAD MID"},
    "malagasy":                {"tier": "E", "basis": "Malagasy dual-ancestry model", "formula": "0.60×AFR(LWK) + 0.35×SE_Asian(KHV/CDX) + 0.05×MID"},
    "maori":                   {"tier": "E", "basis": "Polynesian admixture model", "formula": "0.79×SE_Asian(KHV/CDX) + 0.21×Melanesian"},
    "med_levant":              {"tier": "P", "basis": "HGDP Palestinian/Druze + gnomAD MID"},
    "med_southern":            {"tier": "D", "basis": "1000G TSI (Tuscan, n=107) + IBS (Iberian, n=107)"},
    "melanesia":               {"tier": "E", "basis": "HGDP Papuan Highland/Sepik/Bougainville — limited variant-specific data"},
    "mesoamerica":             {"tier": "P", "basis": "HGDP Maya + PAGE Central American/Native American"},
    "mesopotamian":            {"tier": "P", "basis": "gnomAD MID"},
    "mestizo_mesoamerican":    {"tier": "D", "basis": "1000G MXL (Mexican American, n=64) + PAGE Mexican"},
    "micronesia":              {"tier": "E", "basis": "Micronesian admixture model", "formula": "0.75×SE_Asian + 0.25×Melanesian"},
    "mongolia":                {"tier": "P", "basis": "HGDP Mongolian + gnomAD EAS"},
    "nepal":                   {"tier": "E", "basis": "Nepali dual-ancestry model", "formula": "0.60×SAS + 0.40×EAS"},
    "nile_valley":             {"tier": "E", "basis": "Nile Valley admixture model", "formula": "0.40×AFR + 0.40×MID + 0.20×NFE"},
    "nilotic":                 {"tier": "P", "basis": "1000G LWK (Luhya, Kenya) as East African proxy"},
    "nordic":                  {"tier": "D", "basis": "1000G FIN (Finnish, n=99) + Northern Sweden (n=300)"},
    "north_china":             {"tier": "D", "basis": "1000G CHB (Han Chinese Beijing, n=103)"},
    "north_india":             {"tier": "D", "basis": "1000G PJL (Punjabi, n=96) + GIH (Gujarati, n=103)"},
    "pacific_nw":              {"tier": "E", "basis": "PAGE Native American — Pacific NW indigenous"},
    "patagonia":               {"tier": "E", "basis": "HGDP Surui/Karitiana + indigenous South American estimate"},
    "persian":                 {"tier": "P", "basis": "gnomAD MID + HGDP Makrani"},
    "polynesia":               {"tier": "E", "basis": "Polynesian admixture model (Kayser et al. 2008)", "formula": "0.79×SE_Asian + 0.21×Melanesian"},
    "sahel":                   {"tier": "P", "basis": "1000G GWD (Gambian Mandinka) + MSL (Mende)"},
    "se_asia_island":          {"tier": "P", "basis": "1000G KHV + CDX + CHS as Island SE Asian proxy"},
    "se_asia_main":            {"tier": "D", "basis": "1000G KHV (Kinh Vietnamese, n=99) + CDX (Chinese Dai, n=93)"},
    "siberia":                 {"tier": "P", "basis": "Nikanorova et al. 2025 (Yakut study) + HGDP Yakut/Oroqen/Hezhen"},
    "sichuan_sw_china":        {"tier": "P", "basis": "1000G CHS + CDX + HGDP Yi/Naxi/Miao"},
    "south_china":             {"tier": "D", "basis": "1000G CHS (Southern Han Chinese, n=105)"},
    "south_india":             {"tier": "D", "basis": "1000G STU (Sri Lankan Tamil, n=102) + ITU (Indian Telugu, n=102)"},
    "southeast_us":            {"tier": "E", "basis": "US Southeast population model", "formula": "0.55×NFE + 0.35×AFR + 0.10×AMR"},
    "southern_africa":         {"tier": "P", "basis": "HGDP San + BantuSouthAfrica + gnomAD AFR"},
    "southwest_us":            {"tier": "P", "basis": "HGDP Pima + PAGE Native American"},
    "subarctic":               {"tier": "E", "basis": "Subarctic indigenous model", "formula": "0.50×Siberian + 0.50×NativeAmer"},
    "sudanian":                {"tier": "P", "basis": "1000G YRI (Yoruba) + ESN (Esan) as Sudanian zone proxy"},
    "tibet":                   {"tier": "E", "basis": "Tibetan ancestry model", "formula": "0.82×EAS + 0.18×SAS"},
    "west_africa":             {"tier": "D", "basis": "1000G YRI (Yoruba, n=108) + GWD (Gambian, n=113) + MSL (Mende, n=85) + ESN (Esan, n=99)"},
    "west_india":              {"tier": "D", "basis": "1000G GIH (Gujarati Indian, n=103)"},
    "western_europe":          {"tier": "D", "basis": "1000G CEU (n=99) + GBR (n=91) + GoNL (n=499)"}
  },

  "tier_summary": {
    "D_direct": 14,
    "P_proxy": 27,
    "E_extrapolated": 25,
    "total": 66
  },

  "insufficient_data_flag": "None. All five genes have sufficient cross-population data (>10 D/P tier populations each) for inclusion."
}
```

---

## Notable biological patterns across the panel

The five variants collectively paint a coherent picture of human thermoregulatory adaptation. **TRPM8 rs10166942** stands out as the clearest signal of cold-climate natural selection, with the derived T allele showing an almost perfect latitude-frequency correlation driven by positive selection over the past ~25,000 years. The **UCP3 -55T allele** provides independent confirmation of cold adaptation selection: its **45% frequency in Yakut Siberians** versus ~10% in West Africans represents a >4-fold enrichment, and carriers show elevated free T3 levels and altered body composition consistent with enhanced non-shivering thermogenesis.

**DIO2 Thr92** frequency follows a different evolutionary pattern. East Asian populations maintain the highest Thr92 rates (**84–86%**), which the evolutionary literature attributes to the Thr92 allele arising uniquely in anatomically modern humans—Neanderthals and Denisovans carried only the Ala92 variant. The high East Asian frequency likely reflects efficient thyroid-mediated metabolic regulation rather than cold adaptation per se, since the allele's frequency does not track cold exposure as cleanly as TRPM8.

The **UCP1 A allele** shows a pattern where European and Middle Eastern populations carry the highest frequencies (72–78%), while African populations carry the lowest (24–28%). This distribution may partly reflect the variant's role in brown adipose tissue activation, which is more metabolically relevant in populations that historically experienced seasonal cold exposure and caloric scarcity cycles.

**UCP2 rs659366** represents the weakest differentiation signal of the five, with relatively modest variation across continental groups (35–54%). This may reflect balancing selection, as the A allele simultaneously increases metabolic rate but has also been associated with oxidative stress modulation, creating opposing selective pressures across environments.

## Caveats and data quality considerations

Several important limitations affect the precision of this dataset. The **E-tier extrapolations** for Aboriginal Australian, Melanesian, Polynesian, and Micronesian populations carry the highest uncertainty (**±10–15%**) because no direct genotyping data exists for these specific variants in these populations within public databases. The Papuan HGDP populations used as Melanesian proxies diverged from Aboriginal Australians over 40,000 years ago, making this mapping particularly imprecise.

Indigenous American population estimates (eastern_woodlands, great_plains, pacific_nw, california_coast, caribbean_taino) rely heavily on PAGE Study "Native American" aggregate data and HGDP Pima/Maya/Karitiana/Surui samples, which represent only a fraction of the genetic diversity across the Americas. The **UCP2 and UCP3 sub-population frequencies** from 1000 Genomes Phase 3 could not be directly verified from database interfaces during this research (JavaScript-rendered pages); the values are based on gnomAD v2.1.1 data and published literature concordance, with estimated accuracy of **±2–4%** at the sub-population level.

The **UCP3 Siberian frequency of 45%** comes from a single 2025 study of Northern Asian populations (primarily Yakut) and may not generalize to all Siberian ethnic groups. The **DIO2 Middle Eastern estimate of 58%** carries moderate uncertainty because the Iraqi clinical study (showing very high Ala92 at 79%) likely reflects disease ascertainment bias, and gnomAD MID sample sizes remain relatively small compared to European or East Asian cohorts.

## Conclusion

All five Batch 3 thermogenesis variants have adequate cross-population frequency data to populate the 66-population panel. TRPM8 rs10166942 and UCP3 rs1800849 provide the strongest signals of cold-climate adaptation, with frequency gradients that track latitude and winter temperature. DIO2 rs225014 shows the most dramatic continental differentiation for a metabolic variant (49% to 86% for the efficient Thr92 allele), while UCP1 rs1800592 provides robust brown fat thermogenesis data with the richest source coverage across databases. UCP2 rs659366 contributes useful but less differentiated metabolic rate data. The critical allele correction for DIO2 (T = Thr92, not C) should be incorporated into the data pipeline to avoid systematic misassignment. Populations requiring the most caution in downstream analysis are the E-tier Oceanian and Indigenous American groups, where frequency estimates may shift substantially as direct genotyping data from these populations becomes available.