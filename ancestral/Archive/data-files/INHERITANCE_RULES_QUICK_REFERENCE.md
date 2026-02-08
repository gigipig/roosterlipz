# Genetic Inheritance Rules - Quick Reference Guide

## Understanding Genotype-to-Phenotype Translation

This guide explains how population allele frequencies translate into individual dietary recommendations.

---

## 1. Dominant Inheritance (Lactase Persistence - LCT)

### Rule
**At least ONE derived allele** needed for phenotype expression.

### Mathematical Model
```
Given derived allele frequency (p) = 65%

Hardy-Weinberg Genotypes:
- TT (persistent): p² = 0.65² = 42.25%
- TC (persistent): 2pq = 2 × 0.65 × 0.35 = 45.50%
- CC (non-persistent): q² = 0.35² = 12.25%

Phenotype Probability:
- Lactase Persistent = TT + TC = 87.75%
- Lactase Non-Persistent = CC = 12.25%
```

### Real-World Examples

| Population | Allele Freq | Genotype Inference | Phenotype | Dietary Advice |
|------------|-------------|-------------------|-----------|----------------|
| **Western Europe** | 72% | 92% persistent | Persistent | ✓ All dairy including fresh milk |
| **Arabian** | 70% | 91% persistent | Persistent | ✓ Camel/goat milk, yogurt, all dairy |
| **North India** | 26% | 43% persistent | Non-Persistent | ⚠️ Fermented dairy preferred |
| **Han Chinese** | 3% | 6% persistent | Non-Persistent | ⚠️ Lactose-free or fermented only |
| **Aboriginal** | 2% | 4% persistent | Non-Persistent | ⚠️ Traditional diet has no dairy |

### Decision Logic
```python
if phenotype_probability >= 0.5:
    recommendation = "Full dairy tolerance"
else:
    recommendation = "Fermented dairy or lactose-free alternatives"
```

---

## 2. Additive Inheritance - Copy Number (AMY1)

### Rule
**More copies = better starch digestion**. Each additional copy increases amylase enzyme production.

### Threshold Model
```
High Starch Tolerance:     ≥8 copies  → 45-60% carbs optimal
Moderate Starch Tolerance:  6-7 copies → 35-45% carbs optimal  
Low Starch Tolerance:      <6 copies  → 25-35% carbs optimal
```

### Real-World Examples

| Population | AMY1 Copies | Phenotype | Traditional Diet | Recommendation |
|------------|-------------|-----------|------------------|----------------|
| **Andean** | 10 | High | Potato-based | ✓ Excellent for high-starch diet |
| **Japanese** | 10 | High | Rice-based | ✓ Rice, noodles, grains optimal |
| **Han Chinese** | 9 | High | Rice-based | ✓ High-carb diet well-suited |
| **North India** | 10 | High | Wheat roti/naan | ✓ Grain-based diet ideal |
| **Western Europe** | 6.5 | Moderate | Mixed agriculture | → Balanced macros best |
| **Aboriginal** | 5 | Low | Hunter-gatherer | ⚠️ Higher protein/fat preferred |
| **Inuit** | 5 | Low | Marine mammals | ⚠️ Very low carb optimal |
| **Subarctic** | 4 | Low | Hunting/fishing | ⚠️ Minimal starch traditional |

### Copy Number Distribution
```
Global Average: ~6.5 copies
Range: 2-20+ copies (extreme variation)

High AMY1 Populations:
- Agricultural societies (10,000+ years farming)
- Grain/tuber-based cultures

Low AMY1 Populations:
- Hunter-gatherers
- Arctic/marine-based diets
- Historically low-starch environments
```

---

## 3. Additive Inheritance - Allelic (FADS1/2)

### Rule
**Each derived allele increases enzyme efficiency** for converting plant omega-3 (ALA) to EPA/DHA.

### Scoring System
```
Genotype Score:
- AA (ancestral/ancestral): 0 points
- AG (ancestral/derived):   1 point
- GG (derived/derived):     2 points

Expected Score = 2p² + 2pq
where p = derived allele frequency
```

### Efficiency Categories
```
Efficient (score ≥1.4):   Can thrive on plant omega-3
Moderate (score 0.8-1.4): Benefits from mixed sources  
Reduced (score <0.8):     Needs marine omega-3
```

### Real-World Examples

| Population | FADS1 Freq | Expected Score | Phenotype | Recommendation |
|------------|------------|----------------|-----------|----------------|
| **Central African** | 92% | 1.85 | Efficient | ✓ Plant ALA → EPA/DHA works well |
| **East African** | 90% | 1.80 | Efficient | ✓ Efficient plant-based conversion |
| **Andean** | 82% | 1.64 | Efficient | ✓ Quinoa, plant oils adequate |
| **Aboriginal** | 75% | 1.50 | Efficient | ✓ Plant sources + optional fish |
| **North India** | 65% | 1.30 | Moderate | → Mix plant & marine sources |
| **Maori** | 65% | 1.30 | Moderate | → Traditional fish + plant oils |
| **Mediterranean** | 50% | 1.00 | Moderate | → Olive oil + fish (traditional) |
| **Western Europe** | 54% | 1.08 | Moderate | → Mixed sources optimal |

### Special Case: Inuit FADS Adaptation
```
Population: Inuit
FADS1 Variant: rs7115739 (unique Arctic adaptation)
Frequency: 98%
Phenotype: REDUCED conversion (opposite direction!)

Explanation: Under extreme selection to REDUCE 
conversion because diet already provides 
abundant EPA/DHA from seals/whales.

Recommendation: Direct marine omega-3 essential
```

---

## 4. Complex Inheritance (Alcohol Metabolism)

### Rule
**Multiple genes with epistatic effects**. ALDH2 deficiency overrides ADH1B status.

### Decision Tree
```
┌─ ALDH2 deficiency (rs671) present?
│  ├─ YES (>5% frequency) → "Asian Flush" phenotype
│  │    └─ Recommendation: Avoid alcohol entirely
│  │       Risk: Acetaldehyde buildup, cancer risk
│  │
│  └─ NO or absent
│      └─ Check ADH1B (rs1229984)
│          ├─ HIGH (>50% freq) → "Fast Metabolism" 
│          │    └─ Recommendation: Protective effect,
│          │       fermented foods OK
│          │
│          └─ LOW (<50% freq) → "Standard Metabolism"
│               └─ Recommendation: Normal tolerance,
│                  moderation advised
```

### Real-World Examples

| Population | ALDH2* | ADH1B* | Phenotype | Alcohol Advice |
|------------|--------|--------|-----------|----------------|
| **Japanese** | 20% | 82% | ALDH2 Deficient | ❌ Avoid alcohol (40% het. flush) |
| **Han Chinese** | 16% | 80% | ALDH2 Deficient | ❌ Asian flush common |
| **Korean** | 17% | N/A | ALDH2 Deficient | ❌ High intolerance rate |
| **Aboriginal** | 0% | 80% | Fast ADH1B | ✓ Can tolerate fermented foods |
| **Western Europe** | 0% | 5% | Standard | → Normal tolerance |
| **Mediterranean** | 0% | 10% | Standard-Fast | → Wine culture sustainable |
| **East African** | 0% | 18% (ADH1B*3) | Fast (African variant) | ✓ Fermented beverages OK |

*Derived allele frequency (%)

### Important Note on East Asian Populations
```
ALDH2 rs671 "A" allele causes deficiency:
- Homozygous (AA): Complete deficiency, severe flush
- Heterozygous (AG): Partial deficiency, moderate flush
- ~40% of East Asians affected

Even ADH1B*2 (fast) cannot compensate for ALDH2 deficiency.
Result: Alcohol intolerance despite fast initial metabolism.
```

---

## 5. Additive Special Cases

### CREBRF (Polynesian Thrifty Gene)

**Population-Specific Adaptation**
```
Affected: Polynesian, Micronesian populations
Variant: rs373863828
Function: Enhanced energy storage for ocean voyaging

Frequency Examples:
- Samoan:      26%
- Hawaiian:    18%
- Maori:       20%
- Micronesian: 12%

Phenotype if >5% frequency: "Thrifty Metabolism"
Recommendation: Lower-carb, nutrient-dense foods
```

### CPT1A (Arctic Fat Metabolism)

**Arctic-Specific Adaptation**
```
Affected: Inuit, Siberian, Subarctic populations
Variant: rs80356779 (P479L)
Function: Enhanced ketone metabolism for high-fat diet

Frequency Examples:
- Inuit:      76%
- Siberian:   70%
- Subarctic:  76%

Phenotype if >30% frequency: "Arctic Fat Adapted"
Recommendation: Very high fat (50-70%), very low carb
Note: This variant would be harmful in high-carb diet
```

---

## 6. Practical Application Examples

### Example 1: Western European User
```
Genetic Profile:
✓ LCT:    72% → 92% lactase persistent
✓ AMY1:   6.5 copies → moderate starch
✓ FADS1:  54% → moderate omega-3 conversion
✓ ADH1B:  5% → standard alcohol metabolism

Dietary Recommendations:
→ All dairy including milk, cheese, yogurt
→ Balanced carbs (35-45%), bread/pasta OK
→ Mix omega-3 sources: fish + plant oils
→ Wine/beer in moderation acceptable
```

### Example 2: Japanese User
```
Genetic Profile:
✓ LCT:    3% → 6% lactase persistent (NON-PERSISTENT)
✓ AMY1:   10 copies → high starch tolerance
✓ FADS1:  70% → efficient omega-3 conversion
✓ ALDH2:  20% → 36% ALDH2 deficient (ASIAN FLUSH)

Dietary Recommendations:
→ Fermented dairy only (miso, natto analogous)
→ High-carb diet optimal (45-60%): rice, noodles
→ Plant omega-3 adequate, fish excellent
→ AVOID alcohol → consider flush risk
```

### Example 3: Inuit User
```
Genetic Profile:
✓ LCT:    3% → NON-PERSISTENT (no traditional dairy)
✓ AMY1:   5 copies → LOW starch tolerance
✓ FADS1:  98% (rs7115739) → REDUCED conversion*
✓ CPT1A:  76% → Arctic fat metabolism PRESENT

*Special Inuit variant reduces conversion (opposite effect)

Dietary Recommendations:
→ No dairy (consistent with traditional diet)
→ Very low carb (25-30%): minimal starch
→ MUST have marine omega-3: seals, fish, whale
→ Very high fat (60-70%): marine mammal fat
→ Traditional diet perfectly matched to genetics
```

### Example 4: Andean User
```
Genetic Profile:
✓ LCT:    5% → NON-PERSISTENT
✓ AMY1:   10 copies → HIGHEST globally (strong selection)
✓ FADS1:  82% → efficient omega-3 conversion

Dietary Recommendations:
→ Fermented dairy if used (llama milk uncommon)
→ VERY high starch optimal: potatoes, quinoa, tubers
→ Plant omega-3 sources work excellently
→ Traditional Andean diet perfectly suited
```

---

## Summary: Inheritance Type Comparison

| Inheritance | Example Gene | Key Feature | Recommendation Logic |
|-------------|--------------|-------------|---------------------|
| **Dominant** | LCT | 1 allele = phenotype | Binary (yes/no) based on probability |
| **Additive Copy Number** | AMY1 | More copies = more enzyme | Threshold-based (high/mod/low) |
| **Additive Allelic** | FADS1 | Each allele adds effect | Score-based efficiency level |
| **Complex** | ADH1B + ALDH2 | Multiple genes interact | Decision tree with precedence |

---

## Key Principles

1. **Population frequency ≠ Individual certainty**
   - 70% derived allele → ~91% probability of phenotype
   - Not "70% will have trait"

2. **Hardy-Weinberg assumptions**
   - Random mating
   - Large population
   - No selection (frozen at historical frequency)

3. **Actionable recommendations**
   - Not probabilistic ("might tolerate")
   - Definitive ("recommend fermented dairy")
   - Based on most likely genotype

4. **Cultural validation**
   - Genetic predictions match traditional diets
   - Lactase non-persistent → no traditional dairy
   - High AMY1 → grain-based cultures

---

**Use this guide to understand how genetic data translates into dietary advice in the integrated database.**
