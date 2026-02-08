# Nutrigenomics variant database: Verification and expansion for multi-ethnic populations

Your existing 17-gene panel requires significant frequency corrections and the addition of **47 high-priority variants** to adequately serve diverse populations. Most critically, the app needs population-specific lactase persistence alleles for Africans (the European rs4988235 is irrelevant for this population), CREBRF for Pacific Islanders (the largest-effect obesity variant known), and CPT1A for Arctic populations (near-fixation with profound metabolic implications). Several commonly cited frequencies in current literature are outdated—particularly APOE ε4 in African populations (now measured at **22%** in gnomAD v4.1 versus older estimates of 12-15%) and AMY1 copy numbers, which 2024 pangenome research has substantially revised.

---

## Part 1: Verification of existing genes reveals critical discrepancies

### Lactase persistence requires population-specific testing

The LCT rs4988235 variant is **European-specific** and will produce false negatives in African users. The T allele (lactase persistence) shows a north-south European gradient from **72% in Britain** to just **8.9% in Tuscany**, while gnomAD reports **0.06% in East Asians** and effectively 0% in South Asians. Critically, African pastoralist populations carry entirely different lactase persistence alleles that this SNP cannot detect: G/C-14010 (rs145946881) reaches **46% in Afro-Asiatic Tanzanians**, T/G-13915 (rs41380347) dominates Middle Eastern populations, and C/G-13907 (rs41525747) is found at **21% in Beja populations**. Testing only rs4988235 will incorrectly classify lactose-tolerant African and Middle Eastern individuals as intolerant.

### Starch digestion genetics have been substantially revised

The 2024 Nature pangenome study fundamentally changed AMY1 copy number understanding. Agricultural populations average **6.7-7.0 diploid copies** versus **4.5-5.5** in traditional hunter-gatherer, pastoral, and fishing populations. The study found duplication-containing haplotypes increased 7-fold over the past 12,000 years with a selection coefficient of 0.022—comparable to lactase persistence. Current app recommendations should account for the gene-diet interaction: high starch intake combined with high AMY1 copies may paradoxically **increase obesity risk**, while low-copy individuals may benefit from reduced starch consumption.

### FADS variants show extreme population stratification

The FADS1 rs174537 G allele (high omega-3/6 conversion efficiency) approaches **81%** in African populations but is **nearly absent in Native Americans**—one of the most extreme population frequency differences for any diet-relevant variant. This has profound implications: African ancestry individuals efficiently convert plant-based ALA to DHA/EPA but also produce more pro-inflammatory arachidonic acid from omega-6 fats, suggesting they may benefit more from omega-6 restriction than omega-3 supplementation. Native Americans, by contrast, show very low endogenous conversion capacity and may require preformed long-chain PUFAs.

### Commonly cited frequencies requiring correction

| Gene/Variant | Common Citation | Current Data (gnomAD v4.1) | Clinical Impact |
|--------------|-----------------|---------------------------|-----------------|
| APOE ε4 (African) | 12-15% | **22%** | Underestimates carrier frequency |
| BCMO1 rs12934922 (global) | 42% | **24% European, 4% African** | Original study overestimated |
| FTO rs9939609 A allele | "Higher in Europeans" | **48% African, 41% European** | Africans have highest frequency |
| HFE rs1800562 (Celtic) | ~6% | **Up to 14% carrier frequency** in Ireland | May underestimate screening need |
| TCF7L2 rs7903146 T allele | Similar across populations | **3% East Asian vs 30% European** | 10-fold population difference |

### Genes with validated frequencies and strong evidence

**ALDH2 rs671** frequencies were confirmed at **25-35%** in East Asian populations (Han Chinese 30-35%, Japanese 25-30%, Korean 29%), with the variant remaining essentially absent outside East Asia. However, rare reduced-function ALDH2 variants have been identified in other populations, suggesting complete dismissal in non-East Asians may occasionally miss clinically relevant variants.

**CYP1A2 rs762551** (caffeine metabolism) verified at **67-71% A allele** in Europeans and Asians, with one critical caveat: the "fast/slow metabolizer" phenotype is **induction-dependent**. Baseline enzyme activity is similar across genotypes; differences manifest only with regular caffeine consumption or smoking. Recommendations should include lifestyle modifiers, not just genotype.

**MTHFR rs1801133** shows the expected Hispanic/Latino predominance (**47% T allele, ~20% TT homozygotes**) versus only **9% T allele in Africans**. The folate supplementation threshold of TT genotype for methylfolate recommendation is well-supported.

---

## Part 2: Critical missing population-specific variants

### East Asian populations need alcohol and carbohydrate metabolism genes

Beyond ALDH2, the **ADH1B rs1229984** variant is essential. The His48 variant reaches **50.5% in Taiwan** and causes 70-80-fold faster ethanol metabolism to acetaldehyde, working synergistically with ALDH2 to cause alcohol flushing. This ADH1B-ALDH2 combination creates a spectrum of alcohol response that neither gene alone captures. Additional variants rs8187929 (ALDH1A1), rs2031920 (CYP2E1), and rs3813867 show selection signatures in agricultural Han populations versus nomadic East Asians, likely reflecting adaptation to fermented grain consumption over ~10,000 years.

For diabetes risk, KCNQ1 rs2237892 shows higher frequency and stronger association in East Asians (OR 1.32-1.45) compared to Europeans, while TCF7L2 rs7903146 paradoxically shows the lowest T allele frequency (**~3%**) despite significant diabetes risk. Korean-specific AMY1-related SNPs (rs6696797, rs4244372, rs10881197) show diabetes association specifically with high carbohydrate intake (>65% of calories).

### African populations require distinct variant panels

The app must include African-specific lactase persistence alleles: **G/C-14010 (rs145946881)** at 39% in Nilo-Saharan Tanzanians, **T/G-13915 (rs41380347)** in Middle Eastern-influenced populations, and **C/G-13907 (rs41525747)** at 21% in Beja populations. Testing only the European variant will misclassify most lactose-tolerant Africans.

**G6PD deficiency** affects **20-25% of African males** and has critical dietary implications. The G6PD A- variant requires strict avoidance of fava beans (favism), limitation of oxidative foods, and awareness that HbA1c readings will be artificially low (affecting diabetes monitoring). Drug interactions (primaquine, dapsone) compound the dietary considerations.

The FADS gene cluster shows evidence of ancient positive selection in African populations (~85,000 years ago), with near-fixation of high-efficiency converter alleles. This means African ancestry individuals may produce **more arachidonic acid** (pro-inflammatory) from dietary linoleic acid than other populations—suggesting greater benefit from omega-6 restriction and careful omega-3/omega-6 balance management.

For hypertension/salt sensitivity, **CYP11B2 rs1799998** (T allele 74% in African Americans versus 58% in Latinos) and **AGTR1 rs5186** (T allele 79% in African Americans) show population-specific associations with hypertension that support more aggressive sodium restriction recommendations.

### Pacific Islander variants have the largest known effect sizes

**CREBRF rs373863828** is the most important missing variant for Polynesian populations. This "thrifty gene" reaches **25.9%** in Samoans (45% carry at least one copy) but is virtually absent (<0.1%) in Europeans and Africans. Each copy increases BMI by **1.36-1.48 kg/m²**—the largest known common variant effect on BMI—yet paradoxically **protects against type 2 diabetes** (OR 0.59-0.65). This creates a unique phenotype: obesity without proportionate diabetes risk. Dietary recommendations should focus on preventing the weight gain rather than treating metabolic disease that may not develop.

Gout affects Pacific Islanders at dramatically elevated rates. **ABCG2 rs2231142** reaches **31.1% in Samoans** and **45.8% in Filipinos** versus only 9.4% in Europeans. **SLC2A9 rs734553** is essentially fixed (**98-100%**) in Pacific Islander populations versus 75.5% in Europeans. Purine restriction, alcohol limitation, and hydration recommendations should be standard for this population regardless of current gout status.

### Indigenous American populations have unique metabolic variants

**ABCA1 rs9282541 (R230C)** is exclusive to Native American populations, reaching **10% in Mexican Mestizos** and found in 29 of 36 studied Native American groups. It causes 27% reduction in cholesterol efflux and lower HDL-C, with a critical gene-diet interaction: carriers on higher carbohydrate/lower fat diets show unfavorable metabolic patterns, while lower carbohydrate/higher fat diets produce better outcomes—the opposite of typical recommendations.

**SLC16A11** contains a diabetes risk haplotype reaching **~50% in Mexican Natives** versus essentially absent in Europeans. The OR of 1.29 for type 2 diabetes is genome-wide significant, with the effect stronger in younger, leaner individuals. This haplotype introgressed from Neanderthals and alters hepatic lipid metabolism.

The myth of Native American "firewater" genetic susceptibility should be explicitly addressed: **ALDH2*2 (the Asian flushing variant) is completely absent in Native Americans**. The ADH1B*3 variant found at ~4% in some tribes is actually protective against alcohol dependence.

### Inuit/Arctic populations carry near-fixed adaptive variants

**CPT1A rs80356779 (P479L)** reaches **76.2% in Greenlandic Inuit** and **95.5% in Nunavik Inuit**—one of the strongest selection signatures in any human population. This variant is adapted for the traditional high-fat marine diet and profoundly affects omega-3 fatty acid metabolism. The variant reduces DHA levels and decreases height by 2.1 cm per copy. Critically, the traditional diet appears metabolically optimal for carriers; transition to Western diet disrupts this equilibrium.

**TBC1D4 p.Arg684Ter** at 17% allele frequency causes **10-fold increased type 2 diabetes risk** in homozygotes (4% of Greenlandic Inuit). This explains ~10-15% of all diabetes in Greenland. The variant causes severe muscle insulin resistance but preserves exercise-stimulated glucose uptake, making physical activity recommendations particularly important. HbA1c may miss 32% of affected individuals; oral glucose tolerance testing is more reliable.

### South Asian populations show vegetarian adaptation signatures

**FADS2 rs66698963** (22-bp insertion/deletion) shows the strongest evidence for vegetarian dietary adaptation. The insertion allele reaches **68-70% in South Asians** versus only **18% in Europeans**—representing positive selection for efficient plant-to-animal fatty acid conversion. However, this creates a double-edged sword: carriers produce both beneficial EPA/DHA and pro-inflammatory arachidonic acid more efficiently. Traditional diets with balanced fatty acids (mustard oil, ghee) may be more compatible than Western diets high in omega-6 vegetable oils.

**FUT2 rs602662** shows a significant gene-diet interaction: GG genotype combined with vegetarian diet produces the lowest vitamin B12 levels. South Asian vegetarians with this genotype should prioritize B12 supplementation. TCF7L2 rs7903146 shows effect sizes comparable to Europeans (OR 1.3-1.8), supporting similar glycemic management recommendations. The "thin-fat" phenotype (visceral adiposity despite normal BMI) means lower BMI thresholds should trigger metabolic intervention—WHO recommends BMI ≥23 for overweight classification in Asians.

### Middle Eastern and Ashkenazi Jewish populations have elevated founder variants

**G6PD Mediterranean (rs5030868)** reaches **65% in Saudi Qatif oasis** and **26.4% in Bahrain blood donors**. This Class II severe deficiency (<10% enzyme activity) requires strict fava bean avoidance and awareness that HbA1c is unreliable for diabetes monitoring.

Middle Eastern populations have their own lactase persistence variant (**T/G-13915**) reaching 60-80% in pastoralist populations, distinct from both European and African variants.

Ashkenazi Jewish populations carry elevated frequencies of:
- **GBA1 N370S** (Gaucher disease): carrier frequency **1:10-18** (versus 1:57,000-75,000 general population)
- **LDLR G197del** (familial hypercholesterolemia): **1:67-69** (highest globally)
- **NOD2** inflammatory bowel disease variants: **47% of Crohn's disease patients**
- **MTP G865X** (abetalipoproteinemia): carrier frequency 1:131, requiring high-dose fat-soluble vitamin supplementation

---

## Part 3: High-priority genes to add by functional category

### Vitamin D metabolism requires a multi-gene panel

No single vitamin D SNP adequately captures individual variation. A comprehensive panel should include:

**CYP2R1 rs10741657** affects liver 25-hydroxylation; AG/GG genotypes are **3.7× more likely to be vitamin D insufficient** even with adequate sun exposure. The A allele reaches 60-65% in Africans versus 20-25% in East Asians—population-specific recommendations are essential.

**GC (vitamin D binding protein) rs4588** affects transport. The A allele causes lower total 25(OH)D but similar free vitamin D, meaning standard testing may overdiagnose deficiency in carriers. Consider free/bioavailable vitamin D testing for carriers.

**VDR rs2228570 (FokI)** and **rs731236 (TaqI)** modify tissue response. CC genotype at rs731236 may require **>2000 IU/day** for target levels.

### B12 metabolism affects vegetarians disproportionately

**FUT2 rs601338** determines secretor status; GG (secretor) individuals have lower plasma B12 and may need higher dietary intake despite the counterintuitive finding that AA (non-secretors) show higher total B12 on standard tests. The effect is on haptocorrin-bound (inactive) B12.

**TCN2 rs1801198** (P259R) affects the bioactive transcobalamin-bound B12 fraction. GG genotype carriers have significantly lower holotranscobalamin and higher homocysteine, especially dangerous when combined with high folate intake—a common scenario in supplement users.

### Methylation capacity requires multi-gene assessment

Beyond MTHFR, the methylation pathway requires:

**MTR (A2756G)**: Affects B12-dependent homocysteine remethylation; 1.7% homozygous in Caucasians. Recommend methylcobalamin form.

**MTRR rs1801394 (A66G)**: GG genotype shows **4-fold lower plasma B12/folate** and **5× increased neural tube defect risk** when combined with high methylmalonic acid. Affects even heterozygotes.

**COMT rs4680 (Val158Met)**: Met/Met shows up to 4-fold decreased enzyme function, affecting catecholamine and estrogen metabolism. Cruciferous vegetable intake supports estrogen clearance in low-activity carriers.

### Satiety and eating behavior genes enable personalized approaches

**LEPR rs1137101 (Q223R)**: GG genotype shows **1.82× higher T2DM risk** in meta-analysis and increased total energy intake. Structured eating patterns and portion control are more important for carriers.

**BDNF rs6265 (Val66Met)**: Met allele reaches **44.5% in Asians** versus 19.1% globally. Met carriers show increased hyperphagia specifically on **fat-rich diets**—not low-fat or high-sucrose diets. This creates a highly actionable recommendation: Met/Met carriers should strictly limit dietary fat, a more specific intervention than general caloric restriction.

**CD36 rs1761667**: AA genotype (25% of Europeans) causes **higher fat detection thresholds**, leading to unconscious fat overconsumption. Mindful eating practices and texture modifications to enhance satiety may help.

### Circadian genes support chrononutrition recommendations

**CLOCK rs1801260** (3111T>C): C allele associated with evening chronotype and increased waist-to-hip ratio. Carriers should avoid late eating and front-load calories to earlier in the day.

**PER1 rs2735611**: Associated with 11.6% decrease in long-term weight gain. Consistent meal timing (within 1-hour daily window) is particularly beneficial.

Evidence strongly supports chrononutrition principles across genotypes: skipping breakfast increases obesity risk, late dinner (within 2 hours of sleep) impairs glucose tolerance, and time-restricted feeding prevents metabolic disorders even without caloric reduction.

### Histamine intolerance and caffeine sensitivity

**AOC1 (DAO enzyme)** variants rs10156191, rs1049742, rs2052129 cause histamine intolerance in **79% of symptomatic individuals**. TT homozygotes at rs2052129 show lowest DAO activity. Dietary intervention (avoiding aged cheeses, fermented foods, cured meats, wine) and DAO supplementation can be transformative.

**ADORA2A rs5751876** provides caffeine sensitivity beyond CYP1A2 metabolism. TT genotype shows increased anxiety after just 100-150mg caffeine (one cup of coffee). CC genotype is associated with caffeine-induced insomnia. This creates nuanced recommendations: TT carriers should limit total caffeine for anxiety management, while CC carriers should specifically avoid late-day consumption.

---

## Implementation priorities and novel insights

The research reveals several insights not widely appreciated in nutrigenomics:

**Multi-ethnic testing requires population-specific variant panels.** A single lactase persistence SNP, single vitamin D pathway SNP, or single diabetes risk SNP will systematically fail for non-European populations. The app should implement ancestry-aware testing that includes the appropriate variants for each population.

**Gene-diet interactions often matter more than genotype alone.** APOA2 rs5082 only affects BMI when saturated fat intake exceeds 22g/day. TRPM6 magnesium transporter variants only increase diabetes risk 4.9-fold when magnesium intake is below 250mg/day. AMY1 copy number may increase obesity risk with high starch intake. These conditional relationships enable more precise recommendations than genotype-only approaches.

**Some population-specific variants have paradoxical effects.** CREBRF rs373863828 causes obesity but protects against diabetes. APOE ε4 increases Alzheimer's risk in African Americans but not Yoruba Nigerians. CPT1A P479L appears deleterious by standard criteria but was strongly selected in Arctic populations. Recommendations must account for these population-specific effect modifications.

**The methylation pathway should be assessed as a system.** MTHFR is commonly tested in isolation, but MTR, MTRR, COMT, and BHMT variants can compensate or compound effects. A systems approach would identify individuals with multiple variants affecting the same pathway who need more aggressive intervention.

The highest-priority additions for immediate implementation are: CREBRF (Pacific Islanders), CPT1A and TBC1D4 (Arctic populations), African lactase persistence alleles, ADH1B (East Asians), G6PD (Africans and Middle Easterners), SLC16A11 and ABCA1 R230C (Indigenous Americans), FADS2 insertion/deletion and FUT2 (South Asians), and the vitamin D multi-gene panel (all populations). These variants have large effect sizes, high population frequencies, and actionable dietary interventions that distinguish them from the thousands of statistically significant but clinically marginal variants in the literature.