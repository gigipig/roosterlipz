#!/usr/bin/env python3
"""
Genetic Adaptation Integration Script
Integrates diet-related genetic data into ancestral_diets_geo.json with inheritance logic
"""

import json
import math
from typing import Dict, List, Tuple, Optional

# ============================================================================
# STEP 1: Gene-to-Phenotype Mapping with Inheritance Rules
# ============================================================================

GENE_DEFINITIONS = {
    "lactase_persistence": {
        "genes": ["LCT", "LCT_ME", "LCT_G13907"],
        "variants": {
            "rs4988235": "European LP variant (C/T-13910)",
            "rs41380347": "Middle Eastern LP variant (C/G-13915)",
            "rs145946881": "East African LP variant (G/C-14010)",
            "rs41525747": "Ethiopian LP variant (C/G-13907)"
        },
        "inheritance": "dominant",
        "phenotypes": {
            "present": {
                "name": "Lactase Persistent",
                "description": "Can digest lactose throughout life",
                "dietary_impact": "Full dairy tolerance including fresh milk"
            },
            "absent": {
                "name": "Lactase Non-Persistent",
                "description": "Reduced lactase production after weaning",
                "dietary_impact": "Best with fermented dairy (yogurt, cheese) or lactose-free alternatives"
            }
        }
    },
    "starch_digestion": {
        "genes": ["AMY1"],
        "inheritance": "additive",
        "phenotypes": {
            "high": {
                "name": "High Starch Tolerance",
                "threshold": 8,
                "description": "Enhanced amylase production",
                "dietary_impact": "Excellent tolerance for high-starch foods (grains, tubers, legumes)"
            },
            "moderate": {
                "name": "Moderate Starch Tolerance",
                "threshold": 6,
                "description": "Average amylase production",
                "dietary_impact": "Good tolerance for moderate starch intake"
            },
            "low": {
                "name": "Low Starch Tolerance",
                "threshold": 0,
                "description": "Lower amylase production",
                "dietary_impact": "Better adapted to protein/fat-focused diet with moderate starch"
            }
        }
    },
    "pufa_metabolism": {
        "genes": ["FADS1", "FADS2"],
        "variants": {
            "rs174537": "FADS1 efficiency variant",
            "rs7115739": "Inuit-specific FADS adaptation"
        },
        "inheritance": "additive",
        "phenotypes": {
            "efficient": {
                "name": "Efficient PUFA Converter",
                "description": "Enhanced omega-3/omega-6 conversion",
                "dietary_impact": "Efficient conversion of plant ALA to EPA/DHA; plant-based omega-3 sources adequate"
            },
            "moderate": {
                "name": "Moderate PUFA Metabolism",
                "description": "Average omega-3/omega-6 conversion",
                "dietary_impact": "Benefits from both plant and marine omega-3 sources"
            },
            "inefficient": {
                "name": "Reduced PUFA Conversion",
                "description": "Lower omega-3/omega-6 conversion efficiency",
                "dietary_impact": "Benefits from direct marine omega-3 sources (fish, seafood)"
            }
        }
    },
    "arctic_fat_metabolism": {
        "genes": ["CPT1A"],
        "variants": {
            "rs80356779": "Arctic P479L variant"
        },
        "inheritance": "additive",
        "phenotypes": {
            "present": {
                "name": "Arctic Fat Adaptation",
                "description": "Enhanced fatty acid oxidation for high-fat diet",
                "dietary_impact": "Optimized for very high-fat diet (60-80%); efficient ketone metabolism"
            },
            "absent": {
                "name": "Standard Fat Metabolism",
                "description": "Typical fatty acid metabolism",
                "dietary_impact": "Standard fat metabolism suited to mixed macronutrient ratios"
            }
        }
    },
    "alcohol_metabolism": {
        "genes": ["ADH1B", "ALDH2"],
        "variants": {
            "rs1229984": "ADH1B fast metabolism (ADH1B*2)",
            "rs2066702": "African-specific fast metabolism (ADH1B*3)",
            "rs671": "ALDH2 deficiency (Asian flush)"
        },
        "inheritance": "complex",
        "phenotypes": {
            "fast_protective": {
                "name": "Fast Alcohol Metabolism",
                "description": "Rapid ethanol clearance",
                "dietary_impact": "Protection against alcohol dependency; suitable for fermented foods"
            },
            "aldh2_deficient": {
                "name": "ALDH2 Deficiency (Asian Flush)",
                "description": "Acetaldehyde accumulation causes flushing",
                "dietary_impact": "Alcohol intolerance; avoid or minimize alcohol and fermented products"
            },
            "standard": {
                "name": "Standard Alcohol Metabolism",
                "description": "Typical ethanol metabolism",
                "dietary_impact": "Normal alcohol tolerance; moderate consumption appropriate"
            }
        }
    },
    "polynesian_energy": {
        "genes": ["CREBRF"],
        "variants": {
            "rs373863828": "Polynesian thrifty gene"
        },
        "inheritance": "additive",
        "phenotypes": {
            "present": {
                "name": "Enhanced Energy Storage",
                "description": "Thrifty metabolism for energy conservation",
                "dietary_impact": "May benefit from lower-carb, nutrient-dense foods to manage weight"
            },
            "absent": {
                "name": "Standard Energy Metabolism",
                "description": "Typical metabolic efficiency",
                "dietary_impact": "Standard macronutrient balance appropriate"
            }
        }
    },
    "bitter_taste": {
        "genes": ["TAS2R38"],
        "variants": {
            "rs713598": "PAV (taster) vs AVI (non-taster) haplotype"
        },
        "inheritance": "dominant",
        "phenotypes": {
            "taster": {
                "name": "Bitter Taste Sensitivity",
                "description": "Enhanced bitter taste perception",
                "dietary_impact": "May avoid bitter vegetables; benefits from sweet/umami preparation"
            },
            "non_taster": {
                "name": "Reduced Bitter Sensitivity",
                "description": "Reduced bitter taste perception",
                "dietary_impact": "Good tolerance for bitter vegetables, fermented foods"
            }
        }
    },
    "skin_pigmentation": {
        "genes": ["SLC24A5"],
        "variants": {
            "rs1426654": "Light skin allele (derived)"
        },
        "inheritance": "additive",
        "phenotypes": {
            "light": {
                "name": "Enhanced Vitamin D Synthesis",
                "description": "Light skin pigmentation for high-latitude adaptation",
                "dietary_impact": "Efficient vitamin D synthesis; lower dietary requirement in adequate sun"
            },
            "dark": {
                "name": "UV-Protected Pigmentation",
                "description": "Dark skin protects folate at low latitudes",
                "dietary_impact": "Higher dietary vitamin D needs; emphasize fatty fish, fortified foods"
            }
        }
    }
}

# ============================================================================
# STEP 2: Hardy-Weinberg Calculations for Genotype Inference
# ============================================================================

def hardy_weinberg_genotypes(derived_freq: float) -> Dict[str, float]:
    """
    Convert allele frequency to genotype probabilities using Hardy-Weinberg equilibrium
    
    Args:
        derived_freq: Frequency of derived allele (0-1 scale)
    
    Returns:
        Dictionary with probabilities for homozygous derived, heterozygous, homozygous ancestral
    """
    p = derived_freq  # Derived allele frequency
    q = 1 - p         # Ancestral allele frequency
    
    return {
        "homozygous_derived": p * p,    # p²
        "heterozygous": 2 * p * q,       # 2pq
        "homozygous_ancestral": q * q    # q²
    }

def infer_phenotype_dominant(derived_freq: float) -> Tuple[str, float]:
    """
    Infer phenotype for dominant inheritance (at least one derived allele needed)
    
    Returns:
        Tuple of (phenotype: 'present' or 'absent', probability)
    """
    genotypes = hardy_weinberg_genotypes(derived_freq)
    
    # Dominant: present if at least one derived allele
    prob_present = genotypes["homozygous_derived"] + genotypes["heterozygous"]
    
    if prob_present >= 0.5:
        return ("present", prob_present)
    else:
        return ("absent", 1 - prob_present)

def infer_phenotype_additive_copy_number(avg_copies: float) -> Tuple[str, float]:
    """
    Infer phenotype for AMY1 copy number (additive)
    
    Returns:
        Tuple of (phenotype level, confidence)
    """
    if avg_copies >= 8:
        return ("high", 1.0)
    elif avg_copies >= 6:
        return ("moderate", 1.0)
    else:
        return ("low", 1.0)

def infer_phenotype_additive_frequency(derived_freq: float, high_threshold: float = 0.7) -> Tuple[str, float]:
    """
    Infer phenotype for additive allelic effects (like FADS1)
    
    Returns:
        Tuple of (phenotype level, probability)
    """
    genotypes = hardy_weinberg_genotypes(derived_freq)
    
    # Score: 2 for homozygous derived, 1 for heterozygous, 0 for homozygous ancestral
    expected_score = 2 * genotypes["homozygous_derived"] + 1 * genotypes["heterozygous"]
    
    if expected_score >= 1.4:  # ~70% or higher
        return ("efficient", genotypes["homozygous_derived"] + genotypes["heterozygous"])
    elif expected_score >= 0.8:
        return ("moderate", genotypes["heterozygous"])
    else:
        return ("inefficient", genotypes["homozygous_ancestral"])

def infer_alcohol_phenotype(adh1b_freq: float, aldh2_freq: Optional[float] = None) -> Tuple[str, float]:
    """
    Infer alcohol metabolism phenotype (complex inheritance)
    """
    if aldh2_freq is not None and aldh2_freq > 0.05:
        # ALDH2 deficiency present
        genotypes = hardy_weinberg_genotypes(aldh2_freq)
        prob_deficient = genotypes["homozygous_derived"] + genotypes["heterozygous"]
        if prob_deficient > 0.3:
            return ("aldh2_deficient", prob_deficient)
    
    # Fast ADH1B metabolism
    if adh1b_freq > 0.5:
        genotypes = hardy_weinberg_genotypes(adh1b_freq)
        prob_fast = genotypes["homozygous_derived"] + genotypes["heterozygous"]
        return ("fast_protective", prob_fast)
    
    return ("standard", 1.0 - adh1b_freq)

# ============================================================================
# STEP 3: Parse Genetic Data from Markdown
# ============================================================================

def parse_genetic_data_from_md(md_path: str) -> Dict[str, Dict]:
    """
    Parse the DIET-RELATED_GENETIC_ADAPTATIONS.md file to extract genetic data
    
    Returns:
        Dictionary mapping population_id -> genetic_adaptations
    """
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract JSON structure from markdown
    import re
    json_match = re.search(r'```json\s*(\{.*?\})\s*```', content, re.DOTALL)
    
    if json_match:
        genetic_data = json.loads(json_match.group(1))
        return genetic_data
    else:
        print("Warning: Could not find JSON data in markdown file")
        return {}

# ============================================================================
# STEP 4: Integration Logic with Dietary Recommendations
# ============================================================================

def process_lactase_persistence(lct_data: Dict) -> Dict:
    """Process LCT genetic data into structured format with phenotype"""
    derived_freq = lct_data.get("derived_allele_frequency", 0) / 100.0
    variant = lct_data.get("variant", "rs4988235")
    
    phenotype, probability = infer_phenotype_dominant(derived_freq)
    
    return {
        "gene": "LCT",
        "variant": variant,
        "allele_frequency_percent": lct_data.get("derived_allele_frequency", 0),
        "inheritance": "dominant",
        "inferred_phenotype": phenotype,
        "phenotype_probability": round(probability, 3),
        "phenotype_details": GENE_DEFINITIONS["lactase_persistence"]["phenotypes"][phenotype],
        "dietary_recommendation": _get_dairy_recommendation(phenotype, probability)
    }

def process_amy1(amy1_data: Dict) -> Dict:
    """Process AMY1 copy number data"""
    avg_copies = amy1_data.get("average_copy_number", 6)
    
    phenotype, confidence = infer_phenotype_additive_copy_number(avg_copies)
    
    return {
        "gene": "AMY1",
        "average_copy_number": avg_copies,
        "inheritance": "additive",
        "inferred_phenotype": phenotype,
        "phenotype_confidence": confidence,
        "phenotype_details": GENE_DEFINITIONS["starch_digestion"]["phenotypes"][phenotype],
        "dietary_recommendation": _get_starch_recommendation(phenotype, avg_copies)
    }

def process_fads(fads_data: Dict) -> Dict:
    """Process FADS1/FADS2 data"""
    derived_freq = fads_data.get("derived_allele_frequency", 50) / 100.0
    variant = fads_data.get("variant", "rs174537")
    
    phenotype, probability = infer_phenotype_additive_frequency(derived_freq)
    
    return {
        "gene": "FADS1",
        "variant": variant,
        "allele_frequency_percent": fads_data.get("derived_allele_frequency", 50),
        "inheritance": "additive",
        "inferred_phenotype": phenotype,
        "phenotype_probability": round(probability, 3),
        "phenotype_details": GENE_DEFINITIONS["pufa_metabolism"]["phenotypes"][phenotype],
        "dietary_recommendation": _get_omega3_recommendation(phenotype)
    }

def process_cpt1a(cpt1a_data: Dict) -> Dict:
    """Process CPT1A Arctic variant"""
    derived_freq = cpt1a_data.get("derived_allele_frequency", 0) / 100.0
    
    phenotype = "present" if derived_freq > 0.3 else "absent"
    
    return {
        "gene": "CPT1A",
        "variant": "rs80356779",
        "allele_frequency_percent": cpt1a_data.get("derived_allele_frequency", 0),
        "inheritance": "additive",
        "inferred_phenotype": phenotype,
        "phenotype_details": GENE_DEFINITIONS["arctic_fat_metabolism"]["phenotypes"][phenotype],
        "dietary_recommendation": _get_arctic_fat_recommendation(phenotype)
    }

def process_alcohol_genes(adh1b_data: Optional[Dict], aldh2_data: Optional[Dict]) -> Dict:
    """Process ADH1B and ALDH2 for alcohol metabolism"""
    adh1b_freq = 0.0
    aldh2_freq = None
    
    if adh1b_data:
        adh1b_freq = adh1b_data.get("derived_allele_frequency", 0) / 100.0
    
    if aldh2_data:
        aldh2_freq = aldh2_data.get("derived_allele_frequency", 0) / 100.0
    
    phenotype, probability = infer_alcohol_phenotype(adh1b_freq, aldh2_freq)
    
    result = {
        "genes": ["ADH1B"],
        "inheritance": "complex",
        "inferred_phenotype": phenotype,
        "phenotype_probability": round(probability, 3),
        "phenotype_details": GENE_DEFINITIONS["alcohol_metabolism"]["phenotypes"][phenotype],
        "dietary_recommendation": _get_alcohol_recommendation(phenotype)
    }
    
    if adh1b_data:
        result["ADH1B"] = {
            "variant": adh1b_data.get("variant", "rs1229984"),
            "allele_frequency_percent": adh1b_data.get("derived_allele_frequency", 0)
        }
    
    if aldh2_data:
        result["genes"].append("ALDH2")
        result["ALDH2"] = {
            "variant": aldh2_data.get("variant", "rs671"),
            "allele_frequency_percent": aldh2_data.get("derived_allele_frequency", 0)
        }
    
    return result

def process_crebrf(crebrf_data: Dict) -> Dict:
    """Process CREBRF Polynesian thrifty gene"""
    derived_freq = crebrf_data.get("derived_allele_frequency", 0) / 100.0
    
    phenotype = "present" if derived_freq > 0.05 else "absent"
    
    return {
        "gene": "CREBRF",
        "variant": "rs373863828",
        "allele_frequency_percent": crebrf_data.get("derived_allele_frequency", 0),
        "inheritance": "additive",
        "inferred_phenotype": phenotype,
        "phenotype_details": GENE_DEFINITIONS["polynesian_energy"]["phenotypes"][phenotype],
        "dietary_recommendation": _get_crebrf_recommendation(phenotype)
    }

def process_slc24a5(slc_data: Dict) -> Dict:
    """Process SLC24A5 skin pigmentation variant"""
    derived_freq = slc_data.get("derived_allele_frequency", 50) / 100.0
    
    phenotype = "light" if derived_freq > 0.7 else "dark"
    
    return {
        "gene": "SLC24A5",
        "variant": "rs1426654",
        "allele_frequency_percent": slc_data.get("derived_allele_frequency", 50),
        "inheritance": "additive",
        "inferred_phenotype": phenotype,
        "phenotype_details": GENE_DEFINITIONS["skin_pigmentation"]["phenotypes"][phenotype],
        "dietary_recommendation": _get_vitamin_d_recommendation(phenotype)
    }

# ============================================================================
# STEP 5: Dietary Recommendations Based on Genotypes
# ============================================================================

def _get_dairy_recommendation(phenotype: str, probability: float) -> Dict:
    """Generate dairy recommendations based on lactase persistence"""
    if phenotype == "present":
        return {
            "dairy_tolerance": "high",
            "recommended_dairy": ["fresh milk", "yogurt", "cheese", "kefir", "all dairy products"],
            "notes": "Full dairy tolerance; all forms of dairy well-tolerated"
        }
    else:
        return {
            "dairy_tolerance": "low",
            "recommended_dairy": ["fermented dairy (yogurt, kefir, aged cheese)", "lactose-free milk", "small portions of dairy"],
            "avoid": ["large amounts of fresh milk", "ice cream", "cream"],
            "notes": "Better tolerance with fermented dairy; lactose-free alternatives preferred"
        }

def _get_starch_recommendation(phenotype: str, avg_copies: float) -> Dict:
    """Generate starch intake recommendations"""
    if phenotype == "high":
        return {
            "starch_tolerance": "high",
            "recommended_carbs": ["whole grains", "tubers", "legumes", "rice", "potatoes", "bread"],
            "carb_percentage": "45-60%",
            "notes": f"Excellent starch digestion (AMY1 copies: {avg_copies}); high-carb diet well-suited"
        }
    elif phenotype == "moderate":
        return {
            "starch_tolerance": "moderate",
            "recommended_carbs": ["whole grains", "tubers", "vegetables", "moderate grain intake"],
            "carb_percentage": "35-45%",
            "notes": f"Good starch tolerance (AMY1 copies: {avg_copies}); balanced macros optimal"
        }
    else:
        return {
            "starch_tolerance": "low",
            "recommended_carbs": ["non-starchy vegetables", "moderate tubers", "limited grains"],
            "carb_percentage": "25-35%",
            "notes": f"Lower amylase production (AMY1 copies: {avg_copies}); higher protein/fat diet may be better"
        }

def _get_omega3_recommendation(phenotype: str) -> Dict:
    """Generate omega-3 source recommendations"""
    if phenotype == "efficient":
        return {
            "omega3_conversion": "efficient",
            "recommended_sources": ["flaxseed", "chia seeds", "walnuts", "hemp seeds", "algae oil", "fish (optional)"],
            "notes": "Efficient ALA→EPA/DHA conversion; plant-based omega-3 sources adequate"
        }
    elif phenotype == "moderate":
        return {
            "omega3_conversion": "moderate",
            "recommended_sources": ["fatty fish", "flaxseed", "chia seeds", "fish oil", "algae oil"],
            "notes": "Moderate conversion efficiency; mix of plant and marine sources optimal"
        }
    else:
        return {
            "omega3_conversion": "reduced",
            "recommended_sources": ["fatty fish (salmon, mackerel, sardines)", "fish oil", "algae oil (DHA/EPA direct)"],
            "notes": "Lower conversion efficiency; direct EPA/DHA from marine sources preferred"
        }

def _get_arctic_fat_recommendation(phenotype: str) -> Dict:
    """Generate fat metabolism recommendations"""
    if phenotype == "present":
        return {
            "fat_metabolism": "arctic_adapted",
            "recommended_fats": ["marine fats", "animal fats", "high-fat content"],
            "fat_percentage": "50-70%",
            "notes": "Arctic CPT1A variant; optimized for very high-fat, low-carb diet"
        }
    else:
        return {
            "fat_metabolism": "standard",
            "recommended_fats": ["mixed fat sources", "olive oil", "nuts", "fish", "moderate animal fats"],
            "fat_percentage": "25-35%",
            "notes": "Standard fat metabolism; balanced macronutrient intake appropriate"
        }

def _get_alcohol_recommendation(phenotype: str) -> Dict:
    """Generate alcohol/fermentation recommendations"""
    if phenotype == "aldh2_deficient":
        return {
            "alcohol_tolerance": "very_low",
            "recommendation": "Avoid alcohol and minimize fermented products",
            "notes": "ALDH2 deficiency causes acetaldehyde buildup; increased cancer risk with alcohol"
        }
    elif phenotype == "fast_protective":
        return {
            "alcohol_tolerance": "moderate_to_high",
            "recommendation": "Can tolerate fermented foods and moderate alcohol",
            "notes": "Fast alcohol metabolism provides some protection; fermented foods well-tolerated"
        }
    else:
        return {
            "alcohol_tolerance": "moderate",
            "recommendation": "Standard alcohol tolerance; moderation advised",
            "notes": "Normal alcohol metabolism; no specific restrictions"
        }

def _get_crebrf_recommendation(phenotype: str) -> Dict:
    """Generate recommendations for CREBRF thrifty gene"""
    if phenotype == "present":
        return {
            "metabolic_type": "thrifty",
            "recommendation": "Lower-carb, nutrient-dense foods; monitor portion sizes",
            "notes": "Enhanced energy storage; may benefit from reduced refined carbs"
        }
    else:
        return {
            "metabolic_type": "standard",
            "recommendation": "Standard macronutrient balance appropriate",
            "notes": "Typical metabolic efficiency"
        }

def _get_vitamin_d_recommendation(phenotype: str) -> Dict:
    """Generate vitamin D recommendations based on skin pigmentation"""
    if phenotype == "light":
        return {
            "skin_type": "light_pigmentation",
            "vitamin_d_needs": "lower",
            "recommendation": "Efficient vitamin D synthesis with moderate sun exposure",
            "notes": "Light skin maximizes vitamin D production; dietary needs lower in adequate sun"
        }
    else:
        return {
            "skin_type": "dark_pigmentation",
            "vitamin_d_needs": "higher",
            "recommendation": "Emphasize vitamin D-rich foods: fatty fish, egg yolks, fortified foods",
            "notes": "Dark skin reduces vitamin D synthesis; higher dietary intake important"
        }

# ============================================================================
# MAIN INTEGRATION FUNCTION
# ============================================================================

def integrate_genetic_data(json_path: str, md_path: str, output_path: str):
    """
    Main function to integrate genetic data into ancestral_diets_geo.json
    """
    print("Loading JSON data...")
    with open(json_path, 'r', encoding='utf-8') as f:
        diet_data = json.load(f)
    
    print("Parsing genetic data from markdown...")
    genetic_data = parse_genetic_data_from_md(md_path)
    
    print(f"Processing {len(diet_data['cultures'])} cultures...")
    
    integrated_count = 0
    
    for culture in diet_data['cultures']:
        culture_id = culture['id']
        
        if culture_id in genetic_data:
            print(f"  Processing {culture_id}...")
            
            gen_adaptations = genetic_data[culture_id].get("genetic_adaptations", {})
            
            # Initialize genetic_adaptations structure
            culture["genetic_adaptations"] = {}
            
            # Process LCT (Lactase Persistence)
            if "LCT" in gen_adaptations:
                culture["genetic_adaptations"]["lactase_persistence"] = process_lactase_persistence(
                    gen_adaptations["LCT"]
                )
            elif "LCT_ME" in gen_adaptations:
                culture["genetic_adaptations"]["lactase_persistence"] = process_lactase_persistence(
                    gen_adaptations["LCT_ME"]
                )
            elif "LCT_G13907" in gen_adaptations:
                culture["genetic_adaptations"]["lactase_persistence"] = process_lactase_persistence(
                    gen_adaptations["LCT_G13907"]
                )
            
            # Process AMY1 (Starch Digestion)
            if "AMY1" in gen_adaptations:
                culture["genetic_adaptations"]["starch_digestion"] = process_amy1(
                    gen_adaptations["AMY1"]
                )
            
            # Process FADS1 (PUFA Metabolism)
            if "FADS1" in gen_adaptations:
                culture["genetic_adaptations"]["pufa_metabolism"] = process_fads(
                    gen_adaptations["FADS1"]
                )
            
            # Process CPT1A (Arctic Fat Metabolism)
            if "CPT1A" in gen_adaptations:
                culture["genetic_adaptations"]["arctic_fat_metabolism"] = process_cpt1a(
                    gen_adaptations["CPT1A"]
                )
            
            # Process Alcohol Metabolism (ADH1B, ALDH2)
            adh1b = gen_adaptations.get("ADH1B")
            aldh2 = gen_adaptations.get("ALDH2")
            if adh1b or aldh2:
                culture["genetic_adaptations"]["alcohol_metabolism"] = process_alcohol_genes(
                    adh1b, aldh2
                )
            
            # Process CREBRF (Polynesian Thrifty Gene)
            if "CREBRF" in gen_adaptations:
                culture["genetic_adaptations"]["polynesian_energy_storage"] = process_crebrf(
                    gen_adaptations["CREBRF"]
                )
            
            # Process SLC24A5 (Skin Pigmentation / Vitamin D)
            if "SLC24A5" in gen_adaptations:
                culture["genetic_adaptations"]["vitamin_d_metabolism"] = process_slc24a5(
                    gen_adaptations["SLC24A5"]
                )
            
            integrated_count += 1
        else:
            print(f"  Warning: No genetic data found for {culture_id}")
    
    print(f"\nSuccessfully integrated genetic data for {integrated_count} cultures")
    
    # Write output
    print(f"Writing to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(diet_data, f, indent=2, ensure_ascii=False)
    
    print("✓ Integration complete!")
    
    # Generate summary report
    generate_summary_report(diet_data, output_path.replace('.json', '_summary.txt'))

def generate_summary_report(data: Dict, output_path: str):
    """Generate a human-readable summary of genetic integrations"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("GENETIC ADAPTATION INTEGRATION SUMMARY\n")
        f.write("=" * 80 + "\n\n")
        
        for culture in data['cultures']:
            if "genetic_adaptations" not in culture or not culture["genetic_adaptations"]:
                continue
            
            f.write(f"\n{culture['name']} ({culture['id']})\n")
            f.write("-" * 60 + "\n")
            
            gen = culture["genetic_adaptations"]
            
            # Lactase Persistence
            if "lactase_persistence" in gen:
                lp = gen["lactase_persistence"]
                f.write(f"\n  Lactase Persistence:\n")
                f.write(f"    Phenotype: {lp['phenotype_details']['name']}\n")
                f.write(f"    Probability: {lp['phenotype_probability']:.1%}\n")
                f.write(f"    Recommendation: {lp['dietary_recommendation']['notes']}\n")
            
            # Starch Digestion
            if "starch_digestion" in gen:
                sd = gen["starch_digestion"]
                f.write(f"\n  Starch Digestion:\n")
                f.write(f"    Phenotype: {sd['phenotype_details']['name']}\n")
                f.write(f"    AMY1 Copies: {sd['average_copy_number']}\n")
                f.write(f"    Recommendation: {sd['dietary_recommendation']['notes']}\n")
            
            # PUFA Metabolism
            if "pufa_metabolism" in gen:
                pufa = gen["pufa_metabolism"]
                f.write(f"\n  Omega-3 Metabolism:\n")
                f.write(f"    Phenotype: {pufa['phenotype_details']['name']}\n")
                f.write(f"    Recommendation: {pufa['dietary_recommendation']['notes']}\n")
            
            # Alcohol Metabolism
            if "alcohol_metabolism" in gen:
                alc = gen["alcohol_metabolism"]
                f.write(f"\n  Alcohol Metabolism:\n")
                f.write(f"    Phenotype: {alc['phenotype_details']['name']}\n")
                f.write(f"    Recommendation: {alc['dietary_recommendation']['recommendation']}\n")
            
            f.write("\n")
    
    print(f"✓ Summary report written to {output_path}")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    import sys
    
    # File paths
    json_input = "ancestral_diets_geo.json"
    md_input = "DIET-RELATED_GENETIC_ADAPTATIONS.md"
    json_output = "ancestral_diets_geo_with_genetics.json"
    
    print("\n" + "=" * 80)
    print("GENETIC ADAPTATION INTEGRATION TOOL")
    print("=" * 80 + "\n")
    
    integrate_genetic_data(json_input, md_input, json_output)
    
    print("\n" + "=" * 80)
    print("INTEGRATION COMPLETE")
    print("=" * 80 + "\n")
