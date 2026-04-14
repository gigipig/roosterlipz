# Genetic Adaptation Integration - Complete Documentation

## Overview

This document explains the seamless integration of diet-related genetic adaptations into the `ancestral_diets_geo.json` file. The integration follows correct inheritance rules and provides actionable dietary recommendations based on population-level genetic data.

## Integration Methodology

### 1. Data Sources

**Input Files:**
- `ancestral_diets_geo.json` - Original dietary database (57 cultures)
- `DIET-RELATED_GENETIC_ADAPTATIONS.md` - Genetic allele frequencies from research

**Output Files:**
- `ancestral_diets_geo_with_genetics.json` - Enhanced database with genetic data
- `ancestral_diets_geo_with_genetics_summary.txt` - Human-readable summary

### 2. Genetic Traits Integrated

| Trait | Gene(s) | Inheritance | Dietary Impact |
|-------|---------|-------------|----------------|
| **Lactase Persistence** | LCT | Dominant | Dairy tolerance |
| **Starch Digestion** | AMY1 | Additive (copy number) | Carbohydrate metabolism |
| **Omega-3 Metabolism** | FADS1/FADS2 | Additive | PUFA conversion efficiency |
| **Arctic Fat Metabolism** | CPT1A | Additive | High-fat diet adaptation |
| **Alcohol Metabolism** | ADH1B, ALDH2 | Complex | Fermented food tolerance |
| **Energy Storage** | CREBRF | Additive | Polynesian thrifty gene |
| **Vitamin D Synthesis** | SLC24A5 | Additive | Skin pigmentation effect |

### 3. Hardy-Weinberg Genotype Inference

For each population, allele frequencies are converted to probable genotypes using Hardy-Weinberg equilibrium:

```
Given derived allele frequency p:
- Homozygous derived (p²)
- Heterozygous (2pq)
- Homozygous ancestral (q²)

where q = 1 - p
```

### 4. Inheritance Rule Application

#### Dominant Inheritance (e.g., LCT)
- **Phenotype present**: At least one derived allele (p² + 2pq)
- **Example**: 65% derived allele frequency → 87.75% lactase persistent

#### Additive Inheritance - Copy Number (AMY1)
- **High tolerance**: ≥8 copies
- **Moderate tolerance**: 6-7 copies
- **Low tolerance**: <6 copies

#### Additive Inheritance - Allelic (FADS1)
- **Efficient converter**: Expected score ≥1.4 (~70%+ derived allele)
- **Moderate converter**: Expected score 0.8-1.4
- **Inefficient converter**: Expected score <0.8

#### Complex Inheritance (ADH1B/ALDH2)
- Considers multiple genes with epistatic effects
- ALDH2 deficiency takes precedence over ADH1B status

## JSON Structure

### Complete Entry Example

```json
{
  "id": "aboriginal_aus",
  "name": "Aboriginal Australian",
  "genetic_adaptations": {
    "lactase_persistence": {
      "gene": "LCT",
      "variant": "rs4988235",
      "allele_frequency_percent": 2,
      "inheritance": "dominant",
      "inferred_phenotype": "absent",
      "phenotype_probability": 0.96,
      "phenotype_details": {
        "name": "Lactase Non-Persistent",
        "description": "Reduced lactase production after weaning",
        "dietary_impact": "Best with fermented dairy (yogurt, cheese) or lactose-free alternatives"
      },
      "dietary_recommendation": {
        "dairy_tolerance": "low",
        "recommended_dairy": [
          "fermented dairy (yogurt, kefir, aged cheese)",
          "lactose-free milk",
          "small portions of dairy"
        ],
        "avoid": [
          "large amounts of fresh milk",
          "ice cream",
          "cream"
        ],
        "notes": "Better tolerance with fermented dairy; lactose-free alternatives preferred"
      }
    },
    "starch_digestion": {
      "gene": "AMY1",
      "average_copy_number": 5,
      "inheritance": "additive",
      "inferred_phenotype": "low",
      "phenotype_confidence": 1.0,
      "phenotype_details": {
        "name": "Low Starch Tolerance",
        "threshold": 0,
        "description": "Lower amylase production",
        "dietary_impact": "Better adapted to protein/fat-focused diet with moderate starch"
      },
      "dietary_recommendation": {
        "starch_tolerance": "low",
        "recommended_carbs": [
          "non-starchy vegetables",
          "moderate tubers",
          "limited grains"
        ],
        "carb_percentage": "25-35%",
        "notes": "Lower amylase production (AMY1 copies: 5); higher protein/fat diet may be better"
      }
    },
    "pufa_metabolism": { ... },
    "alcohol_metabolism": { ... },
    "vitamin_d_metabolism": { ... }
  }
}
```

## Application Usage Guide

### A. Personalized Diet Recommendations

```javascript
// Example: Generate diet for user with 75% Aboriginal Australian ancestry

const culture = getCultureById("aboriginal_aus");
const genetics = culture.genetic_adaptations;

// Dairy recommendations
if (genetics.lactase_persistence.inferred_phenotype === "absent") {
  recommendations.dairy = genetics.lactase_persistence.dietary_recommendation.recommended_dairy;
}

// Carb recommendations
const starch = genetics.starch_digestion;
recommendations.carb_percentage = starch.dietary_recommendation.carb_percentage;
recommendations.carb_sources = starch.dietary_recommendation.recommended_carbs;

// Omega-3 recommendations
const omega3 = genetics.pufa_metabolism;
recommendations.omega3_sources = omega3.dietary_recommendation.recommended_sources;
```

### B. UI Display

```javascript
// Example: Display genetic insights to user

function displayGeneticInsights(culture) {
  const gen = culture.genetic_adaptations;
  
  return {
    lactose: {
      status: gen.lactase_persistence.phenotype_details.name,
      probability: `${(gen.lactase_persistence.phenotype_probability * 100).toFixed(0)}%`,
      advice: gen.lactase_persistence.dietary_recommendation.notes
    },
    starch: {
      status: gen.starch_digestion.phenotype_details.name,
      copies: gen.starch_digestion.average_copy_number,
      advice: gen.starch_digestion.dietary_recommendation.notes
    },
    omega3: {
      conversion: gen.pufa_metabolism.phenotype_details.name,
      sources: gen.pufa_metabolism.dietary_recommendation.recommended_sources
    }
  };
}
```

### C. Mixed Ancestry Calculation

```javascript
// Example: Blend recommendations for mixed ancestry

function blendGeneticRecommendations(ancestries) {
  // ancestries = [
  //   { culture_id: "aboriginal_aus", percentage: 60 },
  //   { culture_id: "western_europe", percentage: 40 }
  // ]
  
  const blended = {
    lactase_probability: 0,
    avg_amy1_copies: 0,
    fads_efficiency: 0
  };
  
  ancestries.forEach(ancestry => {
    const culture = getCultureById(ancestry.culture_id);
    const weight = ancestry.percentage / 100;
    const gen = culture.genetic_adaptations;
    
    // Weight each genetic trait
    blended.lactase_probability += 
      gen.lactase_persistence.phenotype_probability * weight;
    
    blended.avg_amy1_copies += 
      gen.starch_digestion.average_copy_number * weight;
    
    blended.fads_efficiency += 
      gen.pufa_metabolism.allele_frequency_percent * weight;
  });
  
  return generateRecommendations(blended);
}
```

## Integration Statistics

### Coverage
- **Total cultures**: 57
- **Cultures with genetic data**: 25 (43.9%)
- **Missing data**: 32 cultures (primarily due to limited research data)

### Genetic Traits by Culture Count
- **Lactase Persistence**: 25 cultures
- **Starch Digestion (AMY1)**: 25 cultures
- **PUFA Metabolism (FADS1)**: 24 cultures
- **Alcohol Metabolism**: 15 cultures
- **Vitamin D (SLC24A5)**: 14 cultures
- **Arctic Fat (CPT1A)**: 3 cultures (Inuit, Siberian, Subarctic)
- **CREBRF Thrifty Gene**: 4 cultures (Polynesian populations)

## Key Features

### ✅ Non-Blended Recommendations
Each genetic trait provides **specific, actionable advice** based on inferred genotype:
- Not "may or may not tolerate dairy" 
- Instead: "96% probability of lactase non-persistence → recommend fermented dairy"

### ✅ Scientific Accuracy
- Allele frequencies from peer-reviewed databases (1000 Genomes, gnomAD)
- Hardy-Weinberg calculations for genotype inference
- Correct inheritance models (dominant, additive, complex)

### ✅ Practical Application
- Clear phenotype descriptions
- Specific food recommendations
- Integration with existing diet data

### ✅ Extensible Structure
- Easy to add new genetic traits
- Clear inheritance logic
- Modular recommendation system

## Example Use Cases

### 1. Ancestry-Based Meal Planning
User inputs ancestry → App retrieves genetic profile → Generates meal plan optimized for genetic adaptations

### 2. Educational Platform
Display genetic adaptations alongside traditional diets to explain evolutionary nutrition

### 3. Nutrition Coaching
Coaches use genetic insights to tailor carb/fat ratios, dairy choices, omega-3 sources

### 4. Research & Analysis
Academic tool for studying diet-gene interactions across populations

## Data Quality Notes

### High Confidence Populations
- European, East Asian, African, South Asian populations with extensive genomic data
- Direct sequencing from 1000 Genomes Project

### Moderate Confidence
- Indigenous populations with proxy estimates from related groups
- Admixed populations with partial data

### Missing Data
32 cultures lack genetic data due to:
- Limited population genomics research
- Small population sizes
- Historical reasons

**Recommendation**: Use available cultures for genetic-informed recommendations, fall back to traditional diet data for others.

## Scientific References

### Primary Databases
1. **1000 Genomes Project Phase 3** (2,504 individuals, 26 populations)
2. **gnomAD v4.1** (76,156 genomes across ancestry groups)
3. **ALFRED** (Allele Frequency Database)

### Key Studies
1. **Lactase Persistence**: Tishkoff et al. 2007 Nature Genetics
2. **AMY1 Copy Number**: Perry et al. 2007 Nature Genetics
3. **FADS Selection**: Fumagalli et al. 2015 Science
4. **CPT1A Arctic**: Clemente et al. 2014 Am J Hum Genet
5. **ALDH2/ADH1B**: Multiple GWAS studies
6. **CREBRF**: Minster et al. 2016 Nature Genetics

## Future Enhancements

### Potential Additions
1. **More genes**: APOA2 (fat satiety), FTO (obesity risk), MCM6 (lactase regulation)
2. **Nutrient metabolism**: Vitamin A (BCO1), Vitamin E (CYP4F2), Folate (MTHFR)
3. **Taste receptors**: Additional TAS2R variants, TAS1R sweet receptors
4. **Gut microbiome**: Integration with microbiome-diet interactions
5. **Direct genotyping**: Support for user-uploaded genetic data (23andMe, etc.)

### Technical Improvements
1. Confidence intervals for allele frequency estimates
2. Population substructure handling
3. Linkage disequilibrium considerations
4. Machine learning for recommendation optimization

## Conclusion

This integration provides a **scientifically rigorous, immediately actionable** genetic layer to the ancestral diet database. By following correct inheritance rules and using Hardy-Weinberg calculations, it bridges population genetics and practical nutrition guidance.

The structure supports both **individual ancestry profiles** and **mixed ancestry scenarios**, making it suitable for diverse applications from personal meal planning to academic research.

---

**Integration completed**: December 2025  
**Script**: `integrate_genetics.py`  
**Output**: `ancestral_diets_geo_with_genetics.json`
