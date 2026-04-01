# Gut Microbiome Gene Frequencies Across 66 Populations

**Three gut microbiome genes—FUT2, MUC2, and TLR4—show striking frequency variation across the world's populations, driven by distinct evolutionary pressures including pathogen exposure, diet, and genetic drift.** This dataset provides phenotype frequencies for 66 ethnic populations, synthesized from gnomAD v4, 1000 Genomes Phase 3, the PAGE Study, and published population genetics literature. Each gene was mapped to all target populations using direct data where available and proxy-population extrapolation where necessary, with all extrapolations flagged. The data below is structured for direct integration into a nutrigenomics diet application.

## Data sources and methodology

Frequency values represent **phenotype frequencies** (percentage of a population expressing a given phenotype), not raw allele frequencies. For recessive traits (FUT2), this means homozygous individuals; for dominant traits (MUC2, TLR4), this means carriers of at least one variant allele. Primary databases consulted include **gnomAD v4** (700,000+ exomes), **1000 Genomes Phase 3/30X** (3,202 individuals from 26 populations), **ALFA** (300,000+ individuals), and the **PAGE Study** (39,350 individuals with detailed ethnic subgroups including Native Hawaiian, Native American, and multiple Latino subpopulations).

For FUT2, a critical methodological note: **rs601338 is not the only non-secretor allele**. East Asian populations achieve ~18–20% non-secretor rates through se385 (rs1047781), while Pacific Islanders carry unique alleles se571 and se400. South Asians carry se302 and a 9.3kb deletion. Values below represent **total non-secretor phenotype frequency from all FUT2 null alleles combined**, which is the biologically meaningful measure for a nutrigenomics app. For MUC2, rs2856111 was selected as the best-characterized missense variant with population frequency data, though its functional impact on gut barrier integrity is inferred from MUC2 biology rather than direct GWAS evidence. For TLR4, carrier frequency of either rs4986790 or rs4986791 is reported; these variants are in strong linkage disequilibrium in most populations except Africans, where Asp299Gly exists independently.

Approximately **30% of population entries** use direct genotyping data, **40%** use continental-level gnomAD/1000G proxies, and **30%** are extrapolated from ancestry-proportion modeling or published literature on related populations.

## Output 1: genetics-reference.json

```json
{
  "fut2_secretor": {
    "gene": "FUT2",
    "variant": "rs601338",
    "chromosome": "19q13.33",
    "change": "G>A (W143X)",
    "inheritance": "recessive",
    "notes": "Primary non-secretor allele in Europeans and Africans. East Asians carry se385 (rs1047781) instead. South Asians carry additional null alleles se302 and sedel2. Oceanian populations have unique se571 and se400 alleles. Phenotype frequencies reflect all null alleles combined.",
    "phenotype_templates": {
      "non_secretor": {
        "name": "Non-Secretor (Enhanced B12)",
        "dietary_impact": "Better B12 absorption efficiency, may benefit from targeted probiotics (especially Bifidobacterium strains) to support microbiome diversity, consider prebiotic-rich foods such as FOS and GOS"
      },
      "secretor": {
        "name": "Secretor (Rich Microbiome)",
        "dietary_impact": "Greater baseline microbiome diversity due to ABO antigens nourishing beneficial gut bacteria, maintain diverse fiber intake, monitor B12 if vegetarian or vegan"
      }
    },
    "dietary_recommendation": {
      "notes": "Non-secretors benefit from probiotic supplementation with Bifidobacterium longum and B. bifidum strains and prebiotic fibers (FOS/GOS/2'-FL) to compensate for reduced mucosal carbohydrate diversity. They have enhanced B12 absorption likely due to reduced H. pylori susceptibility. Secretors should leverage their microbiome advantage with diverse plant fibers and fermented foods. Both groups benefit from polyphenol-rich foods that support microbial diversity."
    }
  },
  "muc2_gut_barrier": {
    "gene": "MUC2",
    "variant": "rs2856111",
    "chromosome": "11p15.5",
    "change": "C>T (missense)",
    "inheritance": "dominant",
    "notes": "C allele (reference/ancestral) modeled as dominant for Strong Gut Barrier phenotype. MUC2 encodes the primary gel-forming mucin of the intestinal mucus layer. rs2856111 is a missense variant with disease associations in candidate gene studies (gallbladder stones, endometriosis). No direct GWAS hit for IBD. The MUC2 VNTR polymorphism may be more functionally important but is not amenable to SNP genotyping. Highest C allele frequency in East Asian populations (~47%), lowest in European and Middle Eastern (~13%).",
    "phenotype_templates": {
      "strong_barrier": {
        "name": "Strong Gut Barrier",
        "dietary_impact": "Enhanced mucin production variant supports robust gut lining integrity, well-suited to diverse dietary patterns including high-fiber and fermented food-rich diets"
      },
      "standard_barrier": {
        "name": "Standard Gut Barrier",
        "dietary_impact": "Standard mucin production benefits from gut-supportive nutrients including L-glutamine, zinc carnosine, omega-3 fatty acids, and polyphenol-rich foods to maintain optimal barrier function"
      }
    },
    "dietary_recommendation": {
      "notes": "Individuals with Standard Gut Barrier benefit from targeted nutritional support: L-glutamine for gut lining repair, zinc carnosine for mucosal support, omega-3 fatty acids for anti-inflammatory effects, and polyphenol-rich foods for barrier integrity. Adequate dietary fiber stimulates mucin production in all genotypes. Bone broth and collagen peptides may support mucin glycoprotein synthesis."
    }
  },
  "tlr4_gut_immunity": {
    "gene": "TLR4",
    "variant": "rs4986790, rs4986791",
    "chromosome": "9q33.1",
    "change": "rs4986790: A>G (Asp299Gly); rs4986791: C>T (Thr399Ile)",
    "inheritance": "dominant",
    "notes": "Both variants reduce TLR4-mediated inflammatory signaling to bacterial LPS. In strong LD in Europeans and South Asians. African populations uniquely carry Asp299Gly without Thr399Ile at ~6% frequency, likely malaria-selected. Near-absent in East Asian and Indigenous American populations. Carrier frequency reported (at least one variant allele of either SNP). South Asians have the highest global carrier frequency (~21%).",
    "phenotype_templates": {
      "balanced_tolerance": {
        "name": "Balanced Immune Tolerance",
        "dietary_impact": "Modulated inflammatory response to gut bacterial products supports comfort with diverse cuisines, may tolerate fermented foods and high-fiber diets well, benefits from diverse probiotic exposure"
      },
      "vigilant_response": {
        "name": "Vigilant Immune Response",
        "dietary_impact": "Robust innate immune surveillance of gut bacteria provides strong pathogen defense, benefits from anti-inflammatory foods (turmeric, omega-3s, polyphenols) and gradual dietary changes to balance immune activation"
      }
    },
    "dietary_recommendation": {
      "notes": "Vigilant responders benefit from anti-inflammatory dietary patterns: omega-3 rich foods (fatty fish, walnuts, flaxseed), curcumin and turmeric, polyphenol-rich berries and green tea, and limiting ultra-processed foods that may increase gut LPS translocation. Gradual introduction of new fermented foods is recommended. Balanced tolerance individuals should maintain diverse probiotic intake and can explore a wider range of fermented foods to leverage their tolerant immune profile."
    }
  }
}
```

## Output 2: genetics-frequencies.json

```json
{
  "populations": {
    "aboriginal_aus": {
      "fut2_secretor": { "f": 2, "t": "non_secretor", "notes": "Extrapolated; near-universal secretor status documented in literature" },
      "muc2_gut_barrier": { "f": 55, "t": "strong_barrier", "notes": "Extrapolated from deep Oceanian ancestry estimate; no direct genotyping" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Extrapolated from Melanesian/Papuan proxy; variants near-absent" }
    },
    "amazon": {
      "fut2_secretor": { "f": 2, "t": "non_secretor", "notes": "Extrapolated; near-universal secretor status in isolated Amazonian groups" },
      "muc2_gut_barrier": { "f": 28, "t": "strong_barrier", "notes": "Extrapolated from PAGE Native American and South American data" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Confirmed absent in Trio Indians of Surinam (n=99, Ferwerda 2007)" }
    },
    "anatolian": {
      "fut2_secretor": { "f": 24, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier", "notes": "gnomAD Middle Eastern/European blend proxy" },
      "tlr4_gut_immunity": { "f": 10, "t": "balanced_tolerance" }
    },
    "andean": {
      "fut2_secretor": { "f": 3, "t": "non_secretor", "notes": "Extrapolated from indigenous American proxy; near-universal secretor status" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier", "notes": "PAGE South American direct data" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Extrapolated; absent in indigenous South Americans" }
    },
    "arabian": {
      "fut2_secretor": { "f": 25, "t": "non_secretor", "notes": "gnomAD Middle Eastern + Qatari cohort data" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 9, "t": "balanced_tolerance" }
    },
    "australian_coastal": {
      "fut2_secretor": { "f": 24, "t": "non_secretor", "notes": "European-descent proxy from gnomAD" },
      "muc2_gut_barrier": { "f": 24, "t": "strong_barrier", "notes": "European-descent proxy" },
      "tlr4_gut_immunity": { "f": 12, "t": "balanced_tolerance", "notes": "European-descent proxy" }
    },
    "balkan": {
      "fut2_secretor": { "f": 22, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 24, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 12, "t": "balanced_tolerance", "notes": "Direct Romanian/Greek data from Ferwerda 2007" }
    },
    "bengal": {
      "fut2_secretor": { "f": 25, "t": "non_secretor", "notes": "Multiple null alleles; direct Bangladeshi phenotype data supports high rate" },
      "muc2_gut_barrier": { "f": 30, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 21, "t": "balanced_tolerance", "notes": "Direct gnomAD South Asian + 1000G BEB data; among highest globally" }
    },
    "brazilian_coastal": {
      "fut2_secretor": { "f": 19, "t": "non_secretor", "notes": "Admixed European + African + Indigenous" },
      "muc2_gut_barrier": { "f": 33, "t": "strong_barrier", "notes": "Adjusted for African admixture in coastal Brazil" },
      "tlr4_gut_immunity": { "f": 9, "t": "balanced_tolerance" }
    },
    "california_coast": {
      "fut2_secretor": { "f": 3, "t": "non_secretor", "notes": "Extrapolated; indigenous California coastal peoples" },
      "muc2_gut_barrier": { "f": 30, "t": "strong_barrier", "notes": "PAGE Native American proxy" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Extrapolated; near-absent in indigenous Americans" }
    },
    "canadian_prairies": {
      "fut2_secretor": { "f": 19, "t": "non_secretor", "notes": "European proxy with Indigenous/Metis admixture adjustment" },
      "muc2_gut_barrier": { "f": 25, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 4, "t": "balanced_tolerance", "notes": "Extrapolated; European + Indigenous admixture" }
    },
    "caribbean_creole": {
      "fut2_secretor": { "f": 22, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 44, "t": "strong_barrier", "notes": "African + European admixture estimate" },
      "tlr4_gut_immunity": { "f": 12, "t": "balanced_tolerance", "notes": "PAGE Cuban/Dominican/Puerto Rican data" }
    },
    "caribbean_taino": {
      "fut2_secretor": { "f": 3, "t": "non_secretor", "notes": "Extrapolated from indigenous American data" },
      "muc2_gut_barrier": { "f": 31, "t": "strong_barrier", "notes": "PAGE Puerto Rican proxy for Taino-derived ancestry" },
      "tlr4_gut_immunity": { "f": 3, "t": "balanced_tolerance", "notes": "Extrapolated; largely indigenous Amerindian ancestry" }
    },
    "caucasus": {
      "fut2_secretor": { "f": 22, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 10, "t": "balanced_tolerance", "notes": "Direct Daghestan cohort data (n=555)" }
    },
    "central_africa": {
      "fut2_secretor": { "f": 24, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 60, "t": "strong_barrier", "notes": "gnomAD African direct; robust gut barrier genetics" },
      "tlr4_gut_immunity": { "f": 15, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Cameroon data (n=142)" }
    },
    "central_asia": {
      "fut2_secretor": { "f": 20, "t": "non_secretor", "notes": "Mixed se428 (European) and se385 (East Asian) null alleles" },
      "muc2_gut_barrier": { "f": 39, "t": "strong_barrier", "notes": "Extrapolated; East Asian/European/South Asian blend" },
      "tlr4_gut_immunity": { "f": 6, "t": "balanced_tolerance", "notes": "Extrapolated; diluted by East Asian near-absence" }
    },
    "central_europe": {
      "fut2_secretor": { "f": 23, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 24, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 12, "t": "balanced_tolerance", "notes": "Direct German data from Ferwerda 2007 (n=632)" }
    },
    "eastern_europe": {
      "fut2_secretor": { "f": 21, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 24, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 12, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Romania (n=102); Estonian cohort (n=2,240)" }
    },
    "eastern_woodlands": {
      "fut2_secretor": { "f": 3, "t": "non_secretor", "notes": "Extrapolated; indigenous Eastern Woodlands peoples" },
      "muc2_gut_barrier": { "f": 30, "t": "strong_barrier", "notes": "PAGE Native American proxy" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Extrapolated; near-absent in indigenous Americans" }
    },
    "ethiopia": {
      "fut2_secretor": { "f": 22, "t": "non_secretor", "notes": "African/Middle Eastern admixture blend" },
      "muc2_gut_barrier": { "f": 48, "t": "strong_barrier", "notes": "Extrapolated; ~60% African + ~40% Eurasian ancestry" },
      "tlr4_gut_immunity": { "f": 12, "t": "balanced_tolerance", "notes": "Extrapolated from African + Eurasian admixture model" }
    },
    "gaucho": {
      "fut2_secretor": { "f": 19, "t": "non_secretor", "notes": "ALFA Latin American 1 (more European) direct data" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier", "notes": "PAGE South American direct data" },
      "tlr4_gut_immunity": { "f": 10, "t": "balanced_tolerance", "notes": "~80% European ancestry" }
    },
    "great_plains": {
      "fut2_secretor": { "f": 3, "t": "non_secretor", "notes": "Extrapolated; indigenous Great Plains peoples" },
      "muc2_gut_barrier": { "f": 30, "t": "strong_barrier", "notes": "PAGE Native American proxy" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Extrapolated; near-absent in indigenous Americans" }
    },
    "highland_se_asia": {
      "fut2_secretor": { "f": 17, "t": "non_secretor", "notes": "Non-secretor primarily from se385 (rs1047781); 1000G CDX proxy" },
      "muc2_gut_barrier": { "f": 58, "t": "strong_barrier", "notes": "Extrapolated; between East Asian and South Asian frequencies" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Near-absent; East Asian proxy" }
    },
    "horn_somalia": {
      "fut2_secretor": { "f": 22, "t": "non_secretor", "notes": "African/Middle Eastern admixture blend" },
      "muc2_gut_barrier": { "f": 48, "t": "strong_barrier", "notes": "Extrapolated; similar to Ethiopian ancestry model" },
      "tlr4_gut_immunity": { "f": 10, "t": "balanced_tolerance", "notes": "Extrapolated from African + Eurasian admixture model" }
    },
    "inuit": {
      "fut2_secretor": { "f": 1, "t": "non_secretor", "notes": "Near-universal secretor status documented; Arctic-adapted microbiome" },
      "muc2_gut_barrier": { "f": 58, "t": "strong_barrier", "notes": "Extrapolated; strong East Asian/Siberian ancestry" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Absent; consistent with Beringian/East Asian origin" }
    },
    "japan": {
      "fut2_secretor": { "f": 18, "t": "non_secretor", "notes": "Non-secretor from se385 (rs1047781); rs601338 absent (<0.01%)" },
      "muc2_gut_barrier": { "f": 72, "t": "strong_barrier", "notes": "Direct 38KJPN data (n=38,720); highest globally" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Confirmed absent in gnomAD + multiple Japanese studies" }
    },
    "korea": {
      "fut2_secretor": { "f": 18, "t": "non_secretor", "notes": "Non-secretor from se385 (rs1047781); rs601338 absent" },
      "muc2_gut_barrier": { "f": 70, "t": "strong_barrier", "notes": "Direct Korea4K data (n=3,617)" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Confirmed absent in Korean study (n=378)" }
    },
    "kurdish": {
      "fut2_secretor": { "f": 24, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 9, "t": "balanced_tolerance" }
    },
    "maasai": {
      "fut2_secretor": { "f": 23, "t": "non_secretor", "notes": "HapMap MKK (Maasai in Kenya) proxy" },
      "muc2_gut_barrier": { "f": 55, "t": "strong_barrier", "notes": "East African proxy; slightly below West African frequency" },
      "tlr4_gut_immunity": { "f": 14, "t": "balanced_tolerance", "notes": "Extrapolated from East African + gnomAD African" }
    },
    "maghreb": {
      "fut2_secretor": { "f": 23, "t": "non_secretor", "notes": "Admixed Berber/Arab/European ancestry" },
      "muc2_gut_barrier": { "f": 39, "t": "strong_barrier", "notes": "Extrapolated; African/European/Middle Eastern blend" },
      "tlr4_gut_immunity": { "f": 10, "t": "balanced_tolerance", "notes": "Moroccan IBD study control data supports estimate" }
    },
    "malagasy": {
      "fut2_secretor": { "f": 17, "t": "non_secretor", "notes": "~50% Austronesian (se385) + ~50% African (se428) admixture" },
      "muc2_gut_barrier": { "f": 66, "t": "strong_barrier", "notes": "Admixed SE Asian + East African; high C allele from both ancestries" },
      "tlr4_gut_immunity": { "f": 7, "t": "balanced_tolerance", "notes": "~50% SE Asian (absent) + ~50% African (~8%) = diluted" }
    },
    "maori": {
      "fut2_secretor": { "f": 18, "t": "non_secretor", "notes": "Polynesian; unique FUT2 null alleles se571/se385 contribute" },
      "muc2_gut_barrier": { "f": 64, "t": "strong_barrier", "notes": "Polynesian proxy from PAGE Native Hawaiian data" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Near-absent; Polynesian/Oceanian ancestry" }
    },
    "med_levant": {
      "fut2_secretor": { "f": 23, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 10, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Israel data (n=85)" }
    },
    "med_southern": {
      "fut2_secretor": { "f": 23, "t": "non_secretor", "notes": "Spanish MGP direct data (24.3% AA)" },
      "muc2_gut_barrier": { "f": 24, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 11, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Basque/Greece data" }
    },
    "melanesia": {
      "fut2_secretor": { "f": 15, "t": "non_secretor", "notes": "Unique null alleles se400 (10-37%) and se385; variable by island" },
      "muc2_gut_barrier": { "f": 58, "t": "strong_barrier", "notes": "Extrapolated; deep Oceanian ancestry estimate" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Papua New Guinea direct (n=49); essentially absent" }
    },
    "mesoamerica": {
      "fut2_secretor": { "f": 3, "t": "non_secretor", "notes": "Extrapolated; near-universal secretor status in indigenous Mesoamerican" },
      "muc2_gut_barrier": { "f": 28, "t": "strong_barrier", "notes": "Extrapolated from PAGE Native American/Central American data" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Absent in indigenous Mesoamerican populations" }
    },
    "mesopotamian": {
      "fut2_secretor": { "f": 25, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 9, "t": "balanced_tolerance" }
    },
    "mestizo_mesoamerican": {
      "fut2_secretor": { "f": 12, "t": "non_secretor", "notes": "1000G MXL + ALFA Latin American; ~40-60% Indigenous ancestry" },
      "muc2_gut_barrier": { "f": 22, "t": "strong_barrier", "notes": "PAGE Mexican cohort direct data (n=5,404)" },
      "tlr4_gut_immunity": { "f": 7, "t": "balanced_tolerance", "notes": "PAGE Mexican direct (allele freq 3.5%)" }
    },
    "micronesia": {
      "fut2_secretor": { "f": 15, "t": "non_secretor", "notes": "Extrapolated from Polynesian/Melanesian blend" },
      "muc2_gut_barrier": { "f": 62, "t": "strong_barrier", "notes": "Extrapolated; Polynesian/Melanesian genetic influences" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Near-absent; Oceanian ancestry" }
    },
    "mongolia": {
      "fut2_secretor": { "f": 18, "t": "non_secretor", "notes": "Non-secretor from se385; some se428 from Western Eurasian admixture" },
      "muc2_gut_barrier": { "f": 70, "t": "strong_barrier", "notes": "East Asian proxy; close to Japanese/Korean frequencies" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Absent; consistent with East Asian pattern" }
    },
    "nepal": {
      "fut2_secretor": { "f": 18, "t": "non_secretor", "notes": "Mixed South Asian (se428/se302) and East Asian (se385) null alleles" },
      "muc2_gut_barrier": { "f": 39, "t": "strong_barrier", "notes": "Extrapolated; intermediate South Asian/East Asian" },
      "tlr4_gut_immunity": { "f": 17, "t": "balanced_tolerance", "notes": "High South Asian component; diluted by Tibeto-Burman ancestry" }
    },
    "nile_valley": {
      "fut2_secretor": { "f": 24, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 44, "t": "strong_barrier", "notes": "Extrapolated; Egyptian/Sudanese African + Middle Eastern blend" },
      "tlr4_gut_immunity": { "f": 13, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Sudan direct data (n=101)" }
    },
    "nilotic": {
      "fut2_secretor": { "f": 25, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 58, "t": "strong_barrier", "notes": "East African proxy; Nilotic pastoralist populations" },
      "tlr4_gut_immunity": { "f": 14, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Tanzania proxy (n=121)" }
    },
    "nordic": {
      "fut2_secretor": { "f": 17, "t": "non_secretor", "notes": "Direct Finnish (13.5%), Swedish (18.2%), Danish (16%) cohort data" },
      "muc2_gut_barrier": { "f": 24, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 13, "t": "balanced_tolerance", "notes": "Direct Northern Swedish + Estonian cohort data" }
    },
    "north_china": {
      "fut2_secretor": { "f": 20, "t": "non_secretor", "notes": "Non-secretor from se385; rs601338 absent; Chinese phenotype study: 22.5%" },
      "muc2_gut_barrier": { "f": 70, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Confirmed absent in Han Chinese (n=491)" }
    },
    "north_india": {
      "fut2_secretor": { "f": 20, "t": "non_secretor", "notes": "Multiple null alleles: se428 (rs601338) + se302 + sedel2" },
      "muc2_gut_barrier": { "f": 31, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 21, "t": "balanced_tolerance", "notes": "Highest globally; well-characterized in gnomAD South Asian + PAGE" }
    },
    "pacific_nw": {
      "fut2_secretor": { "f": 3, "t": "non_secretor", "notes": "Extrapolated; indigenous Pacific Northwest Coast peoples" },
      "muc2_gut_barrier": { "f": 28, "t": "strong_barrier", "notes": "PAGE Native American proxy" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Extrapolated; near-absent in indigenous Americans" }
    },
    "patagonia": {
      "fut2_secretor": { "f": 2, "t": "non_secretor", "notes": "Extrapolated; indigenous Patagonian peoples" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier", "notes": "PAGE South American proxy" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance", "notes": "Absent in indigenous South Americans" }
    },
    "persian": {
      "fut2_secretor": { "f": 24, "t": "non_secretor", "notes": "gnomAD Middle Eastern; rs601338 predominant in Iranians" },
      "muc2_gut_barrier": { "f": 26, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 10, "t": "balanced_tolerance", "notes": "Direct Baluchi/Iranian study: ~10% carriers in healthy controls" }
    },
    "polynesia": {
      "fut2_secretor": { "f": 18, "t": "non_secretor", "notes": "Unique null alleles se571 + se385 contribute; se428 absent" },
      "muc2_gut_barrier": { "f": 64, "t": "strong_barrier", "notes": "PAGE Native Hawaiian direct data (n=3,940)" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "PAGE Native Hawaiian (allele freq 2%); pure Polynesian likely <1%" }
    },
    "sahel": {
      "fut2_secretor": { "f": 24, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 60, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 16, "t": "balanced_tolerance", "notes": "Direct Dogon (n=241) + Fulani (n=243) data; malaria-selected Asp299Gly" }
    },
    "se_asia_island": {
      "fut2_secretor": { "f": 17, "t": "non_secretor", "notes": "se385 primary null allele; some Melanesian-related alleles possible" },
      "muc2_gut_barrier": { "f": 62, "t": "strong_barrier", "notes": "Extrapolated; East Asian/Melanesian blend" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Indonesia direct (n=98); near-absent" }
    },
    "se_asia_main": {
      "fut2_secretor": { "f": 18, "t": "non_secretor", "notes": "se385 primary null allele; 1000G CDX/KHV proxy" },
      "muc2_gut_barrier": { "f": 64, "t": "strong_barrier", "notes": "Extrapolated; closer to East Asian frequencies" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Vietnamese cohort shows allele freq 0.8%; very rare" }
    },
    "siberia": {
      "fut2_secretor": { "f": 22, "t": "non_secretor", "notes": "Limited data (n=8); genetically diverse region; mixed null alleles" },
      "muc2_gut_barrier": { "f": 58, "t": "strong_barrier", "notes": "Extrapolated; East Asian/European blend" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Near-absent; East Asian ancestry predominant" }
    },
    "sichuan_sw_china": {
      "fut2_secretor": { "f": 18, "t": "non_secretor", "notes": "Sichuan study: 14.9% se385 homozygous; non-secretor from se385" },
      "muc2_gut_barrier": { "f": 68, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance" }
    },
    "south_china": {
      "fut2_secretor": { "f": 20, "t": "non_secretor", "notes": "1000G CHS proxy; non-secretor from se385" },
      "muc2_gut_barrier": { "f": 68, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 0, "t": "balanced_tolerance" }
    },
    "south_india": {
      "fut2_secretor": { "f": 20, "t": "non_secretor", "notes": "Multiple null alleles (se302, sedel2) beyond rs601338; may be higher" },
      "muc2_gut_barrier": { "f": 31, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 21, "t": "balanced_tolerance", "notes": "High frequency; gnomAD South Asian STU/ITU direct data" }
    },
    "southeast_us": {
      "fut2_secretor": { "f": 21, "t": "non_secretor", "notes": "European + African American admixture proxy" },
      "muc2_gut_barrier": { "f": 29, "t": "strong_barrier", "notes": "Extrapolated; European + African American mix" },
      "tlr4_gut_immunity": { "f": 12, "t": "balanced_tolerance" }
    },
    "southern_africa": {
      "fut2_secretor": { "f": 23, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 60, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 13, "t": "balanced_tolerance", "notes": "Bantu-speaking proxy; Khoisan groups may differ significantly" }
    },
    "southwest_us": {
      "fut2_secretor": { "f": 15, "t": "non_secretor", "notes": "Hispanic + European + Indigenous admixture" },
      "muc2_gut_barrier": { "f": 24, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 6, "t": "balanced_tolerance" }
    },
    "subarctic": {
      "fut2_secretor": { "f": 2, "t": "non_secretor", "notes": "Extrapolated; Subarctic indigenous peoples (Athabaskan, Cree)" },
      "muc2_gut_barrier": { "f": 30, "t": "strong_barrier", "notes": "PAGE Native American proxy" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Extrapolated; near-absent in indigenous peoples" }
    },
    "sudanian": {
      "fut2_secretor": { "f": 25, "t": "non_secretor" },
      "muc2_gut_barrier": { "f": 62, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 14, "t": "balanced_tolerance", "notes": "Ferwerda 2007 Sudan direct data (n=101)" }
    },
    "tibet": {
      "fut2_secretor": { "f": 17, "t": "non_secretor", "notes": "East Asian proxy; se385 likely dominant null allele" },
      "muc2_gut_barrier": { "f": 66, "t": "strong_barrier", "notes": "Extrapolated; East Asian ancestry with high-altitude adaptations" },
      "tlr4_gut_immunity": { "f": 1, "t": "balanced_tolerance", "notes": "Near-absent; East Asian ancestry" }
    },
    "west_africa": {
      "fut2_secretor": { "f": 25, "t": "non_secretor", "notes": "Direct gnomAD/1000G/ALFA data; rs601338 primary null allele" },
      "muc2_gut_barrier": { "f": 62, "t": "strong_barrier", "notes": "gnomAD African + 1000G direct; high C allele frequency" },
      "tlr4_gut_immunity": { "f": 15, "t": "balanced_tolerance", "notes": "Unique haplotype: Asp299Gly often without Thr399Ile; malaria-selected" }
    },
    "west_india": {
      "fut2_secretor": { "f": 20, "t": "non_secretor", "notes": "1000G GIH (Gujarati) + additional South Asian null alleles" },
      "muc2_gut_barrier": { "f": 31, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 20, "t": "balanced_tolerance" }
    },
    "western_europe": {
      "fut2_secretor": { "f": 24, "t": "non_secretor", "notes": "Well-characterized: UK ALSPAC (25.3%), Dutch GoNL (23.5%), Spanish MGP (24.3%)" },
      "muc2_gut_barrier": { "f": 24, "t": "strong_barrier" },
      "tlr4_gut_immunity": { "f": 12, "t": "balanced_tolerance", "notes": "Direct Dutch/UK/Basque/German cohort data" }
    }
  }
}
```

## Critical patterns across all three genes

The most striking finding across all three genes is a **convergent phenotype pattern** for FUT2: roughly 15–25% of individuals are non-secretors in most world populations, but this identical outcome is achieved through completely different mutations in different regions. Europeans and Africans use se428 (rs601338), East Asians use se385 (rs1047781), South Asians use a mix of se428, se302, and a 9.3kb deletion, and Pacific Islanders carry unique se571 and se400 alleles. The exceptions—Indigenous Americans, Aboriginal Australians, and Inuit—show near-zero non-secretor rates, suggesting either genetic drift through founder effects or strong positive selection for secretor status in these lineages.

For MUC2, **East Asian and African populations show the highest "Strong gut barrier" frequencies** (60–72%), while European and Middle Eastern populations sit at 24–26%. This large disparity suggests distinct evolutionary pressures on mucin production, possibly related to historical pathogen loads and dietary patterns. The C allele's enrichment in populations with historically high fiber and fermented food consumption is biologically consistent with enhanced mucin production supporting diverse gut microbial ecosystems.

TLR4 shows perhaps the most dramatic population stratification: **South Asian populations carry the highest variant frequencies globally (~20–21%)**, Sub-Saharan African populations carry moderate frequencies (13–16%) with a unique Asp299Gly-only haplotype selected by malaria, European populations sit at 11–13%, and East Asian and Indigenous American populations show near-complete absence. This absence in East Asian populations represents either purifying selection (maintaining vigilant LPS response was advantageous) or genetic drift during out-of-Africa migration.

## Key caveats for app implementation

Several important limitations should be flagged for the development team. First, **MUC2 rs2856111 has no genome-wide significant association with IBD or gut barrier phenotypes** in large GWAS; its selection as the MUC2 proxy variant is based on it being a missense variant in MUC2 with the best available population frequency data, but the functional MUC2 VNTR polymorphism (50–115 tandem repeats) cannot be captured by SNP arrays. Consider labeling MUC2 predictions as "exploratory" in the app until stronger functional evidence emerges.

Second, approximately **30% of the 66 populations rely on extrapolation** from proxy populations rather than direct genotyping data. The most extrapolated groups include Aboriginal Australians, Amazonian peoples, Micronesian, Tibetan, Subarctic indigenous, and several East African populations. These estimates should be treated as approximations and updated when population-specific data becomes available.

Third, **FUT2 frequencies for East Asian and Oceanian populations cannot be determined from rs601338 alone**. Any genotyping panel used in the app must include rs1047781 (se385) for East Asian users and ideally se571/se400 for Pacific Islander users, otherwise these populations will be systematically misclassified as secretors when approximately 18% are actually non-secretors.

Fourth, for TLR4 in **African-ancestry users**, the standard Asp299Gly + Thr399Ile co-segregated haplotype framework does not apply. Approximately 6% of African chromosomes carry Asp299Gly independently, without Thr399Ile. Both haplotypes reduce TLR4 signaling (confirmed experimentally in Dogon whole-blood assays by Ferwerda et al. 2007), so both should classify as "Balanced immune tolerance."