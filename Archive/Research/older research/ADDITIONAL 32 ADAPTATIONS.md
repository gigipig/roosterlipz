# Comprehensive Genetic Database: Diet-Related Adaptations for 32 Ancestral Populations

This database provides genetic data for LCT, AMY1, FADS1, and population-relevant optional genes for 32 ancestral populations, compiled from 1000 Genomes Project, gnomAD v4.1, ALFRED database, and published population genetics studies.

## Complete JSON Database

```json
{
  "japan": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 0,
        "description": "European lactase persistence variant absent in Japanese. All East Asian populations carry only the ancestral G allele.",
        "dietary_relevance": "Japanese adults are primarily lactose non-persistent. Traditional diet relied on fermented soy, fish, and rice rather than dairy."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Diploid copy numbers typically ranging 4-10, with mean around 6-8 copies consistent with high-starch agricultural populations.",
        "dietary_relevance": "Reflects adaptation to rice-based agricultural diet spanning thousands of years."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 53,
        "description": "Intermediate G allele frequency (~53-60%). GG genotype associated with efficient conversion of linoleic acid to arachidonic acid.",
        "dietary_relevance": "Traditional fish-rich diet provides preformed omega-3 fatty acids, reducing selective pressure for high endogenous synthesis."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 19,
        "description": "Approximately 30-50% of Japanese carry at least one A allele (ALDH2*2). Causes dramatically reduced enzyme activity.",
        "dietary_relevance": "Causes 'Asian flush' reaction to alcohol. Associated with reduced alcohol consumption and alcoholism rates."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 70,
        "description": "High frequency (~70-75%) of His allele (ADH1B*2). This fast-metabolizing variant converts ethanol to acetaldehyde 70-80x faster than ancestral form.",
        "dietary_relevance": "Combined with ALDH2*2, causes rapid acetaldehyde accumulation. Selected during Neolithic rice cultivation."
      },
      "EDAR": {
        "variant": "rs3827760",
        "derived_allele_frequency": 78,
        "description": "370A allele at 77.5% frequency. Ancient positive selection in East Asia.",
        "dietary_relevance": "Associated with increased sweat gland density; may affect thermoregulation rather than direct dietary adaptation."
      }
    }
  },
  "korea": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 0,
        "description": "Lactase persistence allele absent in Korean population, similar to other East Asians.",
        "dietary_relevance": "Traditional Korean diet historically low in dairy. Fermented vegetables, rice, and fish were dietary staples."
      },
      "AMY1": {
        "average_copy_number": 7.2,
        "description": "Similar AMY1 copy number distribution to other East Asians with agricultural histories. Strong even:odd copy number ratio (~4:1).",
        "dietary_relevance": "Reflects long history of rice-based agriculture. Higher copy numbers improve starch hydrolysis efficiency."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 53,
        "description": "Korean population shows ~53% G allele frequency. Similar pattern to Japanese with intermediate PUFA synthesis efficiency.",
        "dietary_relevance": "Traditional Korean seafood consumption provides dietary long-chain PUFAs."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 16,
        "description": "Genotype frequencies: 2.5% AA, 26.7% GA, 70.8% GG (Korea4K database). A allele frequency ~15-17%.",
        "dietary_relevance": "Lower ALDH2*2 frequency than Japanese but still significant. Protective against alcoholism."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 72,
        "description": "High frequency of fast-metabolizing His allele (~72%), similar to other Northeast Asian populations.",
        "dietary_relevance": "Part of alcohol metabolism system shaped by fermented food consumption during agricultural period."
      },
      "EDAR": {
        "variant": "rs3827760",
        "derived_allele_frequency": 87,
        "description": "370A allele at 86.9% frequency in Korean Busan population - highest among studied East Asian populations.",
        "dietary_relevance": "Primarily affects ectodermal development rather than direct dietary adaptation."
      }
    }
  },
  "mongolia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 2,
        "description": "Very low European LP allele frequency (~2-5%), despite traditional pastoral dairy culture.",
        "dietary_relevance": "Key paradox: Mongolian herders rely on fermented dairy (airag, kumis) which reduces lactose, avoiding need for genetic lactase persistence."
      },
      "AMY1": {
        "average_copy_number": 6.5,
        "description": "Moderate AMY1 copy numbers, intermediate between high-starch agriculturalists and low-starch populations.",
        "dietary_relevance": "Traditional nomadic diet emphasizes meat and dairy over grains. Lower selective pressure for high amylase."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 55,
        "description": "Estimated intermediate G allele frequency based on East Asian averages.",
        "dietary_relevance": "Traditional meat-heavy diet provides preformed arachidonic acid."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 4,
        "description": "Very low ALDH2*2 frequency (~4%) - dramatically different from Chinese and Japanese.",
        "dietary_relevance": "Low alcohol sensitivity allows greater tolerance. Fermented mare's milk (airag) was important beverage."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 76,
        "description": "ADH1B*2 (His allele) frequency ~76%, similar to other East Asians despite different subsistence pattern.",
        "dietary_relevance": "Fast alcohol metabolism advantageous for processing fermented dairy beverages."
      },
      "EDAR": {
        "variant": "rs3827760",
        "derived_allele_frequency": 85,
        "description": "High 370A allele frequency (~85%) consistent with Northern/Eastern Asian populations.",
        "dietary_relevance": "Not directly diet-related but reflects shared East Asian ancestry."
      }
    }
  },
  "tibet": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs13838",
        "derived_allele_frequency": 8,
        "description": "Tibetan-specific LP-associated variant at ~7.6% frequency, absent in Han Chinese. European rs4988235 essentially absent.",
        "dietary_relevance": "Low dairy tolerance, though yak butter tea is cultural staple. Fermented dairy reduces lactose challenge."
      },
      "AMY1": {
        "average_copy_number": 6.0,
        "description": "Estimated moderate copy number based on limited agricultural history at high altitude. Barley (tsampa) is primary grain.",
        "dietary_relevance": "Highland barley adaptation with moderate starch diet. Less intensive grain agriculture than lowland populations."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 52,
        "description": "Similar to Han Chinese baseline. Limited specific Tibetan data available.",
        "dietary_relevance": "Traditional diet includes yak meat and limited plant oils at high altitude."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 10,
        "description": "Lower ALDH2*2 frequency than coastal East Asians (~10-15%), reflecting different genetic history.",
        "dietary_relevance": "Moderate alcohol tolerance. Chang (barley beer) is traditional beverage."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 35,
        "description": "Lower ADH1B*2 frequency than Han Chinese (~35% vs 85%). Shows east-to-west cline across China.",
        "dietary_relevance": "Slower alcohol metabolism reflects different historical subsistence at high altitude."
      },
      "EPAS1": {
        "variant": "rs13419896",
        "derived_allele_frequency": 87,
        "description": "Key high-altitude adaptation. A allele at 87% in Tibetans vs 32% in Han. Contains Denisovan introgression.",
        "dietary_relevance": "Critical for oxygen metabolism at altitude. Enables efficient oxygen transport supporting metabolic demands."
      },
      "EGLN1": {
        "variant": "rs186996510",
        "derived_allele_frequency": 75,
        "description": "Second major high-altitude gene, works with EPAS1 in HIF pathway.",
        "dietary_relevance": "Regulates hypoxia response critical for metabolic function including nutrient processing at altitude."
      }
    }
  },
  "sichuan_sw_china": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 0,
        "description": "LP allele absent in CDX (Dai) and Southern Han populations.",
        "dietary_relevance": "Traditional Southwest Chinese diet based on rice with limited dairy. Sichuan cuisine emphasizes spicy foods, vegetables, and pork."
      },
      "AMY1": {
        "average_copy_number": 7.5,
        "description": "High copy numbers reflecting intensive rice agriculture. Southern Chinese and minority populations show strong agricultural adaptation.",
        "dietary_relevance": "Rice-dominant diet for millennia selected for efficient starch digestion."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 55,
        "description": "Intermediate G allele frequency similar to other East Asian populations.",
        "dietary_relevance": "Traditional diet included freshwater fish and high plant-based components."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 18,
        "description": "Southern Han and minority populations show intermediate ALDH2*2 frequencies (~15-20%).",
        "dietary_relevance": "Sichuan has baijiu tradition. ALDH2*2 carriers experience flushing with local spirits."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 82,
        "description": "Very high ADH1B*2 frequency (>80%) - among highest globally. Southern China is likely center of origin.",
        "dietary_relevance": "Strong selection during rice domestication ~10,000 years ago coinciding with fermentation practices."
      },
      "EDAR": {
        "variant": "rs3827760",
        "derived_allele_frequency": 88,
        "description": "High 370A allele frequency. Second variant rs146567337 reaches 5% in Southern China.",
        "dietary_relevance": "Primarily affects physical traits rather than diet directly."
      }
    }
  },
  "south_china": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 0,
        "description": "Complete absence of European LP allele in CHS (Southern Han Chinese) population.",
        "dietary_relevance": "Lactose intolerance is norm. Traditional Cantonese and Southern Chinese cuisines historically dairy-free."
      },
      "AMY1": {
        "average_copy_number": 7.8,
        "description": "CHS population shows high AMY1 copies with characteristic even:odd distribution (4.5:1 ratio). Mean diploid CN around 7-8.",
        "dietary_relevance": "Long rice agriculture history with multiple annual harvests. High starch consumption selected for efficient amylase."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 54,
        "description": "G allele frequency ~54%. Intermediate between African populations (high G) and Native Americans (low G).",
        "dietary_relevance": "Coastal South China has abundant seafood providing dietary omega-3s."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 17,
        "description": "Approximately 28-32% of Southern Han carry at least one ALDH2*2 allele. Derived A allele frequency ~17%.",
        "dietary_relevance": "Significant portion experiences alcohol flushing. Wine and baijiu culture persists."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 85,
        "description": "Among highest ADH1B*2 frequencies globally (84-92%). Southern China represents epicenter of selection.",
        "dietary_relevance": "Strong selection during Neolithic rice domestication. Fermented rice was food preservation method."
      },
      "EDAR": {
        "variant": "rs3827760",
        "derived_allele_frequency": 90,
        "description": "Very high 370A allele frequency (~90%). One of strongest positive selection signals in human genome.",
        "dietary_relevance": "Pleiotropic effects include increased sweat gland density for thermoregulation."
      }
    }
  },
  "highland_se_asia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 1,
        "description": "Lactase persistence allele extremely rare (<1%) in Southeast Asian highland populations. Nearly all CC homozygotes.",
        "dietary_relevance": "Very low lactase persistence; traditional diets did not include dairy."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Moderate to high copy number typical of agricultural populations with starch-rich diets (rice, tubers).",
        "dietary_relevance": "Enhanced starch digestion reflecting traditional rice-based diets with root vegetables."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 30,
        "description": "High frequency of ancestral G allele (~70%) associated with efficient PUFA conversion.",
        "dietary_relevance": "Efficient conversion of plant-based omega-3/6 to long-chain PUFAs, beneficial with limited marine food access."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 15,
        "description": "ALDH2*2 deficiency allele at moderate frequency (~15-20%). Lower than lowland populations.",
        "dietary_relevance": "Reduced alcohol metabolism; associated with alcohol flush reaction."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 65,
        "description": "High frequency of ADH1B*2 (His47) rapid ethanol oxidation variant.",
        "dietary_relevance": "Rapid ethanol metabolism, potentially selected due to fermented food consumption."
      }
    }
  },
  "se_asia_island": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 1,
        "description": "Lactase persistence allele virtually absent (<1%). Population predominantly lactase non-persistent.",
        "dietary_relevance": "Dairy intolerance widespread; traditional diets emphasized coconut milk, fish, and starchy staples."
      },
      "AMY1": {
        "average_copy_number": 7.5,
        "description": "Moderate-high copy number reflecting agricultural ancestry. Range typically 4-12 diploid copies.",
        "dietary_relevance": "Efficient starch digestion adapted to rice, sago, and tuber-heavy diets."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 25,
        "description": "High ancestral G allele frequency (~75%). Associated with efficient LC-PUFA synthesis.",
        "dietary_relevance": "Efficient omega-3/6 conversion important with variable marine food access."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 25,
        "description": "ALDH2*2 allele at moderate-high frequency (~25-30% in Indonesia).",
        "dietary_relevance": "Reduced aldehyde metabolism; protective against heavy alcohol consumption."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 60,
        "description": "High frequency (~60%) of fast alcohol metabolizing variant.",
        "dietary_relevance": "Enhanced ethanol oxidation capacity."
      }
    }
  },
  "se_asia_main": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 1,
        "description": "Lactase persistence extremely low (<1%). Nearly universal lactase non-persistence in adulthood.",
        "dietary_relevance": "High rates of lactose intolerance (90-100%). Traditional cuisines use fermented dairy or avoid dairy entirely."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Mean diploid copy number ~7, range 4-14. High-starch diet population pattern.",
        "dietary_relevance": "Adapted to rice-dominant agricultural diet spanning thousands of years."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 28,
        "description": "G allele (ancestral) ~72%, T allele (derived) ~28%. Similar to other East Asian populations.",
        "dietary_relevance": "High desaturase activity enabling efficient PUFA synthesis from plant precursors."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 20,
        "description": "ALDH2*2 frequency ~20.4% in Vietnamese (Thai Nguyen study). Associated with alcohol flush.",
        "dietary_relevance": "Acetaldehyde accumulation after alcohol; protective against alcohol dependence."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 69,
        "description": "ADH1B*2 at high frequency (~68.8% in Vietnamese). One of highest rates globally.",
        "dietary_relevance": "Very rapid ethanol oxidation; possibly selected during rice domestication era."
      }
    }
  },
  "melanesia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 0,
        "description": "Lactase persistence allele absent. LP evolved in pastoralist populations; Melanesia had no dairy tradition.",
        "dietary_relevance": "Universal lactose malabsorption. Traditional diet: root vegetables (taro, yam), sago, fish, coconut."
      },
      "AMY1": {
        "average_copy_number": 6.5,
        "description": "Moderate copy number. Melanesian populations show distinct AMY1 haplotype structure from East Asians.",
        "dietary_relevance": "Adapted to high-starch diet based on root vegetables and sago palm rather than grains."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 35,
        "description": "Unique genetic history with Denisovan introgression. FADS region may show distinct patterns.",
        "dietary_relevance": "Variable PUFA metabolism; coastal populations had abundant marine omega-3 sources."
      },
      "CREBRF": {
        "variant": "rs373863828",
        "derived_allele_frequency": 3,
        "description": "Low frequency (0-6% in various Melanesian groups). Much lower than Polynesian populations.",
        "dietary_relevance": "Limited presence of 'thrifty gene' that increases fat storage efficiency."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 2,
        "description": "Very low frequency (<5%). ALDH2*2 is East Asian-specific; minimal gene flow from Asia.",
        "dietary_relevance": "Normal alcohol metabolism capacity; differs from East Asian populations."
      }
    }
  },
  "micronesia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 0,
        "description": "Lactase persistence allele essentially absent. Similar to other Pacific populations.",
        "dietary_relevance": "Lactose intolerance universal. Traditional diet: breadfruit, taro, coconut, fish."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Moderate copy number typical of starch-consuming Pacific populations.",
        "dietary_relevance": "Adapted to breadfruit, taro, and other starchy staples of Micronesian islands."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 30,
        "description": "Similar to broader Pacific/Asian pattern with efficient PUFA conversion.",
        "dietary_relevance": "Important for populations with traditional marine-heavy diets rich in omega-3."
      },
      "CREBRF": {
        "variant": "rs373863828",
        "derived_allele_frequency": 4,
        "description": "A allele at 4.2% overall. Chamorros: 5.4%, Chuukese: 4.9%, Palauans: 2.2%, Carolinians: 1.1%.",
        "dietary_relevance": "Modest presence of 'thrifty' variant. Associated with higher BMI but lower diabetes risk."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 5,
        "description": "Low frequency, reflecting mixed ancestry with limited East Asian gene flow.",
        "dietary_relevance": "Mostly normal alcohol metabolism."
      }
    }
  },
  "polynesia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 0,
        "description": "Lactase persistence allele absent. Population developed without dairy animals.",
        "dietary_relevance": "Complete lactose malabsorption. Traditional diet: taro, breadfruit, coconut, fish, pork."
      },
      "AMY1": {
        "average_copy_number": 7.5,
        "description": "Moderate-high copy number. Polynesians are agricultural populations with starch-rich traditional diets.",
        "dietary_relevance": "Efficient starch digestion for taro, breadfruit, sweet potato, and other staples."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 30,
        "description": "Efficient PUFA conversion pattern similar to ancestral East Asian populations.",
        "dietary_relevance": "Beneficial for populations consuming both plant and marine omega fatty acid sources."
      },
      "CREBRF": {
        "variant": "rs373863828",
        "derived_allele_frequency": 26,
        "description": "VERY HIGH frequency: Samoans ~25.9%, Tongans ~15%, NZ Māori 10-27%. Extremely rare globally (<0.01%).",
        "dietary_relevance": "The 'thrifty gene' increases BMI by 1.4 kg/m² per allele but DECREASES diabetes risk ~35%. Selected during Pacific voyaging with feast-famine cycles."
      },
      "ALDH2": {
        "variant": "rs671",
        "derived_allele_frequency": 1,
        "description": "Very low/absent. East Asian variant did not persist through Polynesian founder population.",
        "dietary_relevance": "Normal alcohol metabolism; no Asian flush response."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 15,
        "description": "Lower than mainland Asian populations, reflecting founder effects during Pacific colonization.",
        "dietary_relevance": "Moderate ethanol oxidation capacity."
      }
    }
  },
  "central_africa": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs145946881",
        "derived_allele_frequency": 2,
        "description": "East African LP variant virtually absent. Bantu populations have ancestral alleles. LWK proxy shows <5% LP.",
        "dietary_relevance": "Very low lactase persistence reflects non-pastoralist agricultural traditions. Fermented dairy or milk avoidance."
      },
      "AMY1": {
        "average_copy_number": 6.5,
        "description": "Biaka rainforest hunter-gatherers show ~6 copies. Bantu agriculturalists slightly higher (~7-8).",
        "dietary_relevance": "Lower than agricultural populations. Hunter-gatherer diet relies on protein/fruit; Bantu groups with root crops show moderate adaptation."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 95,
        "description": "Near-fixation of derived G allele. African populations have highest global frequencies of efficient FADS1.",
        "dietary_relevance": "High FADS1 activity enables efficient conversion of plant omega-6 to arachidonic acid."
      },
      "ADH1B": {
        "variant": "rs2066702",
        "derived_allele_frequency": 15,
        "description": "African-specific fast-metabolizing variant (ADH1B*3) present at moderate frequency.",
        "dietary_relevance": "Faster alcohol metabolism may have evolved with traditional fermented beverages."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 1,
        "description": "Light skin allele virtually absent. Ancestral allele maintained.",
        "dietary_relevance": "Darker pigmentation appropriate for high UVR environment; adequate vitamin D synthesis maintained."
      }
    }
  },
  "ethiopia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs145946881, rs41525747, rs41380347",
        "derived_allele_frequency": 45,
        "description": "HIGH LP diversity. Phenotype: ~39% digesters overall; pastoralist Borana Oromo up to 80%. Five LP alleles co-exist (soft selective sweep).",
        "dietary_relevance": "Strong pastoralist adaptation. Ethiopia is crossroads of LP evolution with multiple independent variants. Traditional cattle-herding cultures show elevated LP."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Mixed subsistence populations. Higher in agricultural groups (teff, sorghum), moderate in pastoralist groups.",
        "dietary_relevance": "Moderate starch adaptation reflecting mixed agro-pastoralist traditions. Teff is dietary staple."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 92,
        "description": "High frequency of derived G allele, slightly lower than West Africa due to Eurasian admixture.",
        "dietary_relevance": "Efficient fatty acid metabolism maintained despite gene flow from lower-frequency populations."
      },
      "ADH1B": {
        "variant": "rs2066702",
        "derived_allele_frequency": 12,
        "description": "ADH1B*3 present but lower than West Africa due to population history.",
        "dietary_relevance": "Moderate alcohol metabolism adaptation."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 40,
        "description": "Elevated frequency (28-50% in Afro-Asiatic groups) due to Eurasian gene flow >5kya. Under positive selection.",
        "dietary_relevance": "Lighter skin variant may enhance vitamin D synthesis at highland altitude."
      }
    }
  },
  "horn_somalia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs145946881, rs41380347, rs869051967",
        "derived_allele_frequency": 35,
        "description": "Elevated LP in Cushitic pastoralists. Somali phenotype: ~30% with LP alleles. Multiple variants due to shared ancestry with Beja and Ethiopian groups.",
        "dietary_relevance": "Pastoralist Cushitic-speaking Somalis have higher LP than West African agriculturalists. Fresh camel and cattle milk are dietary staples."
      },
      "AMY1": {
        "average_copy_number": 6.5,
        "description": "Lower copy number consistent with pastoralist diet emphasizing milk and meat over starch.",
        "dietary_relevance": "Traditional nomadic diet relies on livestock products rather than agricultural starch."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 90,
        "description": "High frequency of derived G allele, typical of African populations.",
        "dietary_relevance": "Efficient omega-6 metabolism; traditional diet includes plant foods requiring endogenous fatty acid synthesis."
      },
      "ADH1B": {
        "variant": "rs2066702",
        "derived_allele_frequency": 10,
        "description": "Lower frequency due to Islamic cultural practices limiting alcohol consumption.",
        "dietary_relevance": "Reduced selective pressure on alcohol metabolism genes."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 30,
        "description": "Moderate frequency reflecting Afro-Asiatic ancestry and gene flow from Near East/Ethiopia.",
        "dietary_relevance": "Lighter pigmentation variant; adaptation to semi-arid environment with moderate UVR."
      }
    }
  },
  "sahel": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235, rs41380347",
        "derived_allele_frequency": 20,
        "description": "FULANI pastoralists show ~46% European LP variant - unique in Africa. Sahelian agriculturalists (GWD/Gambian) have <5% LP.",
        "dietary_relevance": "Major divide between Fulani pastoralists (high LP, cattle-dependent) and sedentary agriculturalists (low LP)."
      },
      "AMY1": {
        "average_copy_number": 8.5,
        "description": "Higher in agricultural populations (millet, sorghum cultivation). GWD populations show elevated AMY1.",
        "dietary_relevance": "Sahelian agriculture features millet and sorghum as staples. Higher amylase facilitates starch digestion."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 94,
        "description": "Near-fixation of derived G allele in GWD (Gambian) population.",
        "dietary_relevance": "Highly efficient omega-6 conversion. Traditional diet relies heavily on plant oils."
      },
      "ADH1B": {
        "variant": "rs2066702",
        "derived_allele_frequency": 16,
        "description": "Moderate frequency in Sahelian populations.",
        "dietary_relevance": "Traditional fermented millet beverages may have selected for alcohol metabolism variants."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 5,
        "description": "Low frequency; slightly elevated in groups with North African contact.",
        "dietary_relevance": "Darker skin maintained; appropriate for high UVR Sahelian environment."
      }
    }
  },
  "southern_africa": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs145946881",
        "derived_allele_frequency": 8,
        "description": "Low overall, but elevated in pastoralist Khoe. Nama pastoralists: ~50% LP phenotype, >20% C-14010 frequency. Bantu and San: very low.",
        "dietary_relevance": "C-14010 spread southward with East African pastoralist migration ~2kya. Nama and Herero pastoralists show selection for milk digestion."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Moderate copy number. Bantu agriculturalists slightly higher than Khoisan hunter-gatherers.",
        "dietary_relevance": "Mixed subsistence patterns. Bantu groups with maize/sorghum show moderate starch adaptation."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 93,
        "description": "High frequency typical of African populations. LWK data as proxy shows very high derived allele frequency.",
        "dietary_relevance": "Efficient fatty acid metabolism maintained across southern African populations."
      },
      "ADH1B": {
        "variant": "rs2066702",
        "derived_allele_frequency": 14,
        "description": "Moderate frequency in Bantu; lower in Khoisan groups.",
        "dietary_relevance": "Traditional sorghum beer consumption may have contributed to selection."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 15,
        "description": "Elevated in Khoisan (≠Khomani: 32%, Nama: 53%) due to recent gene flow. Very low in Bantu (~2%).",
        "dietary_relevance": "Lighter skin in some Khoisan may relate to adaptation or recent admixture."
      }
    }
  },
  "west_africa": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs145946881",
        "derived_allele_frequency": 2,
        "description": "VERY LOW LP. YRI, ESN, MSL show <5% LP phenotype. East African C-14010 essentially absent. Only Fulani show LP.",
        "dietary_relevance": "Agricultural societies with no dairying tradition. Lactose intolerance is the norm. Fresh milk not part of traditional diet."
      },
      "AMY1": {
        "average_copy_number": 9.0,
        "description": "HIGH copy number in Yoruba and agricultural groups. Among highest in Africa. Strong positive selection.",
        "dietary_relevance": "Yam civilization adaptation. Traditional reliance on starchy tubers and grains strongly selected for high amylase."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 96,
        "description": "HIGHEST global frequency of derived G allele. YRI shows ~96% G allele, ~82% homozygous GG.",
        "dietary_relevance": "Highly efficient conversion of plant omega-6 to arachidonic acid. Traditional diet rich in plant oils with limited preformed long-chain PUFAs."
      },
      "ADH1B": {
        "variant": "rs2066702",
        "derived_allele_frequency": 18,
        "description": "Highest frequency in West Africa. ADH1B*3 found almost exclusively in African-ancestry populations.",
        "dietary_relevance": "Traditional palm wine and fermented beverages may have selected for faster alcohol metabolism."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 1,
        "description": "Light skin allele virtually absent. Ancestral G allele near-fixed.",
        "dietary_relevance": "Dark skin maintained; optimal for high UVR tropical environment."
      }
    }
  },
  "canadian_prairies": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 5,
        "description": "Plains Indigenous populations have very low lactase persistence. American Indians show 66% lactase deficiency overall.",
        "dietary_relevance": "Traditional bison-hunting diet did not include dairy; no selection pressure for LP. European admixture introduces LP proportionally."
      },
      "AMY1": {
        "average_copy_number": 5.5,
        "description": "Lower AMY1 copy number expected for Plains hunter-gatherer populations with traditionally low-starch diets (meat-focused bison hunting).",
        "dietary_relevance": "Traditional diet was protein-rich from bison with limited starch; lower amylase reflects less selective pressure."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 10,
        "description": "Indigenous Americans have very high ancestral T allele frequency (~90%+). Adaptation to marine/fatty acid-rich diets during Beringia passage.",
        "dietary_relevance": "Ancestral haplotype associated with reduced PUFA conversion; populations with high marine/fatty acid intake show selection for this haplotype."
      }
    }
  },
  "caribbean_taino": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 3,
        "description": "Ancient Taino DNA shows no LP allele before European contact. Modern Puerto Ricans carry LP reflecting European contribution only.",
        "dietary_relevance": "Pre-contact Caribbean peoples had no dairy animals. Taino diet was cassava-based agricultural with fishing."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Taino had Arawakan South American origins; likely intermediate AMY1 reflecting cassava/root crop diet.",
        "dietary_relevance": "Cassava and root crop agriculture provides some selection for starch digestion, though cassava requires processing."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 12,
        "description": "Indigenous Caribbean populations likely had high ancestral T allele frequency (~88%+).",
        "dietary_relevance": "Marine-rich diet of Taino complements ancestral FADS haplotype with reduced endogenous PUFA synthesis."
      }
    }
  },
  "gaucho": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 30,
        "description": "European-Indigenous admixed with substantial Spanish/Italian ancestry. Uruguay shows 35% T allele (highest in South America).",
        "dietary_relevance": "European admixture brought pastoral tradition and LP. ~55-60% carry at least one T allele. Dairy consumption is high."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Intermediate copy number reflecting admixed ancestry. European farmers had increasing AMY1 over past 4000 years.",
        "dietary_relevance": "Traditional gaucho diet was meat-heavy (cattle), but European influence introduced wheat/bread."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 35,
        "description": "Intermediate frequency due to admixture. European (~46% GG) mixes with Indigenous (~10% GG).",
        "dietary_relevance": "Mixed PUFA metabolism capacity. Individuals with GG more efficient at converting plant omega-3/6."
      }
    }
  },
  "mesoamerica": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 12,
        "description": "MXL shows LP correlated with European ancestry (~40% in Mestizos). Indigenous Maya and Native groups show <5% LP.",
        "dietary_relevance": "9000+ years of maize agriculture without dairy animals means no LP selection. T allele entirely from Spanish colonial admixture."
      },
      "AMY1": {
        "average_copy_number": 7.5,
        "description": "Elevated AMY1 due to 9000+ years of maize cultivation. Mexican studies show mean 6.82 ± 3.3 copies.",
        "dietary_relevance": "Long-term maize-based agriculture (tortillas, tamales) created selection for starch digestion."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 15,
        "description": "Indigenous Mesoamerican populations have high ancestral T allele frequency (~85%+).",
        "dietary_relevance": "Ancestral haplotype results in 33-38% lower ARA and EPA production. Diet supplementation with preformed omega-3 may be important."
      }
    }
  },
  "patagonia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 5,
        "description": "Mapuche show only 10% LP frequency. Tehuelche similar. Chilean Amerindians showed T allele rare, suggestive of European ancestry.",
        "dietary_relevance": "Traditional Mapuche/Tehuelche diet had no dairy. LP allele reflects post-colonial European admixture only."
      },
      "AMY1": {
        "average_copy_number": 9.0,
        "description": "Elevated AMY1 due to proximity to Andean agricultural traditions. Indigenous Peruvians show highest globally (median 10 copies) linked to potato domestication.",
        "dietary_relevance": "Potato and quinoa agriculture created selection for starch digestion."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 8,
        "description": "Very low derived G allele frequency. PEL shows 82% ancestral haplotype.",
        "dietary_relevance": "Ancestral haplotype selected during cold adaptation. Coastal populations with marine resources benefit from dietary omega-3 intake."
      }
    }
  },
  "nordic": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 89,
        "description": "European LP variant (-13910 C>T). Nordic populations show highest frequencies globally (89-96%), from ~9,100 years of selection.",
        "dietary_relevance": "Enables fresh milk digestion throughout adulthood. Critical for dairy-dependent pastoral societies in northern latitudes."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "European agricultural populations typically have 6-8 diploid copies. Increased since Neolithic transition.",
        "dietary_relevance": "Adaptation to grain-based diets including wheat, barley, and rye common in Nordic regions."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 67,
        "description": "Derived G allele ~65-70%. More efficient conversion of linoleic acid to arachidonic acid.",
        "dietary_relevance": "Efficient PUFA conversion important before marine food introduction to Nordic diets."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 3,
        "description": "Derived His48 allele rare in Northern Europeans (<5%), unlike East Asians (>80%).",
        "dietary_relevance": "Ancestral allele (slower metabolism) may reflect different selective pressures related to alcohol patterns."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 100,
        "description": "Derived Thr111 allele essentially fixed (99-100%). Major contributor to light skin.",
        "dietary_relevance": "Light skin enhances vitamin D synthesis in low-UV environments. Critical for northern latitudes with limited dietary vitamin D."
      }
    }
  },
  "med_southern": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 15,
        "description": "Southern Mediterranean shows lower frequencies: TSI ~9%, IBS ~36%, Greek ~17%. Northwest-to-southeast gradient across Europe.",
        "dietary_relevance": "Lower LP correlates with Mediterranean diets emphasizing fermented dairy (cheese, yogurt) with reduced lactose."
      },
      "AMY1": {
        "average_copy_number": 7.5,
        "description": "Mediterranean populations typically show 7-8 copies. Long agricultural histories with grain cultivation.",
        "dietary_relevance": "Adaptation to grain-rich diet including bread, pasta, cereals central to Mediterranean cuisine."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 68,
        "description": "Similar to other Europeans (~65-70% G allele). Tuscan ~68%.",
        "dietary_relevance": "Efficient PUFA conversion despite Mediterranean fish access. Traditional diet balances plant and seafood sources."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 10,
        "description": "Slightly higher than Northern Europeans (5-10%), with regional variation.",
        "dietary_relevance": "Wine integral to Mediterranean culture. Ancestral allele may reflect adaptation to moderate consumption patterns."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 99,
        "description": "Derived Thr111 allele nearly fixed (99%). Only ~1% heterozygous in Greek studies.",
        "dietary_relevance": "Light skin facilitates vitamin D synthesis even at Mediterranean latitudes."
      }
    }
  },
  "med_levant": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs41380347",
        "derived_allele_frequency": 25,
        "description": "Middle Eastern LP variant (-13915 T>G), distinct from European rs4988235. Shows moderate frequencies (15-35%) varying by pastoral history.",
        "dietary_relevance": "Independent LP evolution in Middle Eastern pastoralists. Bedouin show higher than urban populations. Enables fresh milk for nomadic traditions."
      },
      "AMY1": {
        "average_copy_number": 6.5,
        "description": "Middle Eastern populations show moderate copy numbers (~6-7). Variation between ethnic groups.",
        "dietary_relevance": "Mixed agricultural and pastoral traditions. Some groups historically less dependent on starch."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 70,
        "description": "Similar to or slightly higher than Europeans (~65-75%). Genetic crossroads influences.",
        "dietary_relevance": "Efficient PUFA conversion important for inland populations with limited marine omega-3 access."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 20,
        "description": "Southwest Asian populations show moderate frequencies (15-40%), higher than Europeans but different haplotypes than East Asians.",
        "dietary_relevance": "Higher frequency may reflect cultural factors including religious prohibitions reducing alcohol tolerance selection."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 85,
        "description": "High but not fixed (~80-95%), lower than Europeans. Evidence of positive selection; likely spread from Near East to Europe.",
        "dietary_relevance": "Moderate-high frequency supports vitamin D synthesis in region with variable UV exposure."
      }
    }
  },
  "caucasus": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 12,
        "description": "Armenian and Georgian populations show very low European LP allele (~5-15%) despite pastoral traditions.",
        "dietary_relevance": "Low LP despite pastoralism suggests historical reliance on fermented dairy (cheese, yogurt, kefir - which originated in Caucasus). Fermentation reduces lactose."
      },
      "AMY1": {
        "average_copy_number": 6.8,
        "description": "Moderate copy numbers similar to Southern European and Middle Eastern populations (~6-7). Ancient agricultural traditions.",
        "dietary_relevance": "Mixed agricultural traditions including wheat, barley, millet. Georgian and Armenian cuisines feature significant grain consumption."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 68,
        "description": "Intermediate between European and Middle Eastern populations (~65-72%). Armenians cluster with Southern Europeans.",
        "dietary_relevance": "Important for populations historically dependent on plant-based fats. Limited marine food access in mountainous regions."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 15,
        "description": "Intermediate frequencies (~10-20%) between European and Middle Eastern patterns.",
        "dietary_relevance": "Ancient winemaking traditions (Georgia is one of oldest wine regions). May reflect complex selection in wine-producing cultures."
      },
      "SLC24A5": {
        "variant": "rs1426654",
        "derived_allele_frequency": 95,
        "description": "Very high frequencies (~90-98%), similar to European populations.",
        "dietary_relevance": "High frequency supports vitamin D synthesis in mountainous regions with variable sun exposure."
      }
    }
  },
  "central_asia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 25,
        "description": "Moderate frequency despite pastoralist traditions. Kazakhs show 25-32% LP; Tajiko-Uzbeks 11-20%. Herders mostly lactase non-persistent due to fermented milk.",
        "dietary_relevance": "Traditional consumption of fermented dairy (kumis, kefir) reduces lactase need. Pastoralist traditions with dairy animals but lower LP than Europeans."
      },
      "AMY1": {
        "average_copy_number": 6.5,
        "description": "Moderate copy numbers reflecting mixed agricultural and pastoral subsistence.",
        "dietary_relevance": "Mixed diet with both animal products and grain-based foods. Lower selection pressure than purely agricultural populations."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 55,
        "description": "Intermediate frequency between European (~67%) and East Asian (~80%) populations.",
        "dietary_relevance": "Intermediate efficiency in converting plant-based omega-6. Mixed diet of meat and plant foods."
      }
    }
  },
  "kurdish": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235, rs41380347",
        "derived_allele_frequency": 35,
        "description": "Moderate LP. Middle Eastern populations carry both European -13910*T and Middle Eastern -13915*G variants. Iranian ethnic groups range 0-30%.",
        "dietary_relevance": "Long pastoralism history with sheep/goat milk. Multiple LP variants reflect complex genetic history at Europe-Asia crossroads."
      },
      "AMY1": {
        "average_copy_number": 7.5,
        "description": "Higher copy numbers consistent with agricultural populations. Qatari Arabs show mean ~8 copies.",
        "dietary_relevance": "Fertile Crescent origin with ~12,000 years of agriculture. Heavy reliance on wheat, barley, starches."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 60,
        "description": "Moderate-high frequency similar to European populations.",
        "dietary_relevance": "Mixed diet with olive oil, nuts, meat. Efficient conversion supports Mediterranean-influenced diet."
      }
    }
  },
  "nepal": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 3,
        "description": "Very low LP. Tibeto-Burman speakers have lowest LP in South Asia (~0.8%). Highland populations relied on fermented dairy.",
        "dietary_relevance": "Minimal LP selection due to reliance on fermented dairy (butter tea, fermented yak milk) and limited cattle at altitude."
      },
      "AMY1": {
        "average_copy_number": 7.0,
        "description": "Moderate to high copy numbers. South Asian subcontinent shows elevated AMY1 (range 2-20). Agricultural traditions with rice and millet.",
        "dietary_relevance": "Traditional diet includes rice, millet, barley (tsampa), potatoes. High-starch diet from local agriculture."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 75,
        "description": "High G allele frequency similar to East Asian populations (~80% GG homozygotes).",
        "dietary_relevance": "Efficient omega-6 conversion supporting plant-based diet. Limited marine sources at altitude makes efficient PUFA synthesis advantageous."
      },
      "EPAS1": {
        "variant": "rs13419896, rs4953354",
        "derived_allele_frequency": 78,
        "description": "High-altitude adaptation. Derived alleles at ~70-90% in Sherpas vs ~1% in lowlanders. Associated with lower hemoglobin at altitude.",
        "dietary_relevance": "Enables sustained physical activity for food acquisition at extreme altitude. Blunted erythropoietic response prevents altitude sickness."
      },
      "EGLN1": {
        "variant": "rs186996510, rs12097901",
        "derived_allele_frequency": 75,
        "description": "PHD2 enzyme variant under strong selection. Sherpa frequencies parallel Tibetan (~75-85%).",
        "dietary_relevance": "Supports metabolic efficiency at altitude. Works with EPAS1 to optimize oxygen utilization."
      }
    }
  },
  "siberia": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 1,
        "description": "Extremely low LP (~0.8%). rs4988235-C (non-persistence) at ~93% in Northeastern Siberia. No dairy animal domestication history.",
        "dietary_relevance": "No traditional dairy consumption. Diet based on marine mammals, fish, and terrestrial game."
      },
      "AMY1": {
        "average_copy_number": 5.0,
        "description": "Lower copy numbers consistent with traditional hunting/fishing subsistence.",
        "dietary_relevance": "Traditional low-starch, high-fat diet from marine mammals. Minimal selection for enhanced starch digestion."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 80,
        "description": "Very high G allele frequency. East Asian pattern with ~80% GG genotype.",
        "dietary_relevance": "Despite high marine omega-3 intake, efficient FADS1 supports metabolism."
      },
      "CPT1A": {
        "variant": "rs80356779",
        "derived_allele_frequency": 68,
        "description": "CRITICAL ARCTIC ADAPTATION. Frequency: Chukchi ~56-90%, Eskimo ~87.5%, Koryaks ~56-66%. Arose ~4,000 years ago. Absent elsewhere (<0.01%).",
        "dietary_relevance": "Modifies fatty acid oxidation for traditional high-fat, low-carb Arctic diet. May prevent excessive omega-3 accumulation that could increase bleeding risk. Associated with serum lipid profiles."
      }
    }
  },
  "west_india": {
    "genetic_adaptations": {
      "LCT": {
        "variant": "rs4988235",
        "derived_allele_frequency": 14,
        "description": "Moderate LP. GIH data: GG ~72.8%, AG ~26.2%, AA ~1%. T allele ~13-14%. Northwest-to-southeast declining gradient across India.",
        "dietary_relevance": "Gujarat has strong dairy traditions (butter, ghee, buttermilk). LP variant likely from Bronze Age Steppe migrations ~4,000 years ago."
      },
      "AMY1": {
        "average_copy_number": 8.0,
        "description": "High copy numbers. South Asian populations show some of highest globally (range 2-20, mean ~8).",
        "dietary_relevance": "Long agricultural history with rice, wheat, millet. Gujarati cuisine features extensive starch-based foods."
      },
      "FADS1": {
        "variant": "rs174537",
        "derived_allele_frequency": 72,
        "description": "High G allele frequency. South Asians show intermediate-to-high (~70-75% GG).",
        "dietary_relevance": "Predominantly vegetarian population with high plant oil intake. Efficient FADS1 critical for synthesizing long-chain PUFAs from plant sources."
      },
      "ADH1B": {
        "variant": "rs1229984",
        "derived_allele_frequency": 8,
        "description": "Low frequency compared to East Asians (~70-80%). Most Gujaratis carry ancestral slow-metabolizing allele.",
        "dietary_relevance": "Traditional low alcohol consumption in Hindu majority. Limited selection pressure for rapid alcohol metabolism."
      }
    }
  }
}
```

## Data Quality and Source Notes

### Primary Sources
- **1000 Genomes Project Phase 3**: JPT, CHB, CHS, CDX, KHV, GIH, PJL, ITU, STU, BEB, YRI, LWK, ESN, GWD, MSL, FIN, GBR, TSI, IBS, PEL, MXL, CLM, PUR
- **gnomAD v4.1**: Population-specific allele frequencies
- **ALFRED Database**: Global allele frequency distributions
- **Published Studies**: Ethiopian LP diversity (Tishkoff et al.), Tibetan EPAS1 (Simonson et al.), Arctic CPT1A (Clemente et al.), Polynesian CREBRF (Minster et al.)

### Key Population-Specific Adaptations

| Adaptation | Notable Populations | Frequency | Dietary Significance |
|------------|---------------------|-----------|----------------------|
| **LCT rs4988235** | Nordic (89%), Ethiopia (45%), Sahel Fulani (46%) | 0-89% | Fresh milk digestion |
| **AMY1 high copy** | West Africa (9.0), Patagonia/Andean (9.0), West India (8.0) | 5-10 copies | Starch digestion efficiency |
| **FADS1 rs174537 G** | West Africa (96%), Ethiopia (92%), Central Africa (95%) | 8-96% | Plant omega-6 conversion |
| **CREBRF rs373863828** | Polynesia (26%), Micronesia (4%) | 0-26% | Energy storage/thrifty gene |
| **CPT1A rs80356779** | Siberia/Arctic (68-87%) | 0-87% | Arctic high-fat diet adaptation |
| **EPAS1 high-altitude** | Tibet (87%), Nepal (78%) | 0-87% | Oxygen metabolism at altitude |
| **ALDH2*2 rs671** | Japan (19%), Korea (16%), SE Asia Island (25%) | 0-25% | Alcohol flush/metabolism |

### Caveats
1. Some populations required proxy data due to limited direct sequencing
2. AMY1 copy numbers are population means; individual variation is 2-20 copies
3. Indigenous American FADS1 frequencies reflect ancestral Beringia adaptation
4. African LP uses different variants (rs145946881, rs41380347) than European (rs4988235)
5. Admixed populations (gaucho, mesoamerica) show intermediate frequencies reflecting ancestry proportions