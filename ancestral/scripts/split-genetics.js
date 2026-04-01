/**
 * Migration Script: Split genetics.json into reference + frequencies
 *
 * This script splits the large genetics.json file into two smaller files:
 * 1. genetics-reference.json - Static gene metadata (same for all populations)
 * 2. genetics-frequencies.json - Population-specific frequency data only
 *
 * Run with: node scripts/split-genetics.js
 */

const fs = require('fs');
const path = require('path');

// File paths
const INPUT_FILE = path.join(__dirname, '..', 'genetics.json');
const REF_OUTPUT = path.join(__dirname, '..', 'genetics-reference.json');
const FREQ_OUTPUT = path.join(__dirname, '..', 'genetics-frequencies.json');
const BACKUP_FILE = path.join(__dirname, '..', 'genetics.json.backup');

// Key compression map for frequencies (saves space)
const KEY_COMPRESSION = {
  'allele_frequency_percent': 'f',
  'phenotype_probability': 'p',
  'average_copy_number': 'cn',
  'null_frequency_percent': 'nf',
  'inferred_phenotype': 't',
  'phenotype_confidence': 'pc',
  'african_allele_gc14010': 'af1',
  'middle_eastern_allele_tg13915': 'me',
  'african_allele_cg13907': 'af2'
};

// Static properties to extract for reference (same across all populations)
const STATIC_PROPERTIES = [
  'gene', 'genes', 'variant', 'inheritance', 'risk_allele'
];

// Population-specific properties to extract for frequencies
const FREQUENCY_PROPERTIES = [
  'allele_frequency_percent',
  'phenotype_probability',
  'average_copy_number',
  'null_frequency_percent',
  'inferred_phenotype',
  'phenotype_confidence',
  'african_allele_gc14010',
  'middle_eastern_allele_tg13915',
  'african_allele_cg13907'
];

/**
 * Extract static reference data from a trait
 */
function extractReference(traitData) {
  const ref = {};

  // Copy static properties
  for (const prop of STATIC_PROPERTIES) {
    if (traitData[prop] !== undefined) {
      ref[prop] = traitData[prop];
    }
  }

  // Extract phenotype_details structure (template)
  if (traitData.phenotype_details) {
    ref.phenotype_details = {
      name: traitData.phenotype_details.name,
      dietary_impact: traitData.phenotype_details.dietary_impact
    };
    // Note: description often contains population-specific text, handled separately
  }

  // Extract dietary_recommendation structure (template)
  if (traitData.dietary_recommendation) {
    ref.dietary_recommendation = {};
    const rec = traitData.dietary_recommendation;

    // Copy array properties (food lists)
    for (const key of Object.keys(rec)) {
      if (Array.isArray(rec[key])) {
        ref.dietary_recommendation[key] = rec[key];
      } else if (key !== 'notes' && key !== 'recommendation') {
        // Copy non-text properties
        ref.dietary_recommendation[key] = rec[key];
      }
    }
  }

  return ref;
}

/**
 * Extract population-specific frequency data from a trait
 */
function extractFrequencies(traitData, traitKey) {
  const freq = {};

  // Extract frequency properties with compressed keys
  for (const prop of FREQUENCY_PROPERTIES) {
    const value = traitData[prop];
    if (value !== undefined && value !== null) {
      const compressedKey = KEY_COMPRESSION[prop] || prop;
      freq[compressedKey] = value;
    }
  }

  // Handle nested structures

  // ADH1B for alcohol_metabolism
  if (traitData.ADH1B && traitData.ADH1B.allele_frequency_percent !== undefined) {
    freq.ADH1B = { f: traitData.ADH1B.allele_frequency_percent };
    if (traitData.ADH1B.variant) freq.ADH1B.v = traitData.ADH1B.variant;
  }

  // ALDH2 for alcohol_metabolism
  if (traitData.ALDH2 && traitData.ALDH2.allele_frequency_percent !== undefined) {
    freq.ALDH2 = { f: traitData.ALDH2.allele_frequency_percent };
    if (traitData.ALDH2.variant) freq.ALDH2.v = traitData.ALDH2.variant;
  }

  // SNPs structure (for cholesterol_metabolism, etc.)
  if (traitData.snps) {
    freq.snps = {};
    for (const [snpId, snpData] of Object.entries(traitData.snps)) {
      freq.snps[snpId] = {};
      if (snpData.allele_frequency_percent !== undefined) {
        freq.snps[snpId].f = snpData.allele_frequency_percent;
      }
      if (snpData.risk_allele) {
        freq.snps[snpId].r = snpData.risk_allele;
      }
    }
  }

  // Include custom description if it contains population-specific content
  if (traitData.phenotype_details?.description) {
    const desc = traitData.phenotype_details.description;
    // Check if description contains population-specific info (not just template text)
    if (desc.length > 50 && !desc.startsWith('Standard ') && !desc.includes('unknown in this population')) {
      freq.desc = desc;
    }
  }

  // Include custom notes if they contain population-specific content
  if (traitData.dietary_recommendation?.notes) {
    const notes = traitData.dietary_recommendation.notes;
    if (notes.length > 50 && !notes.startsWith('Insufficient population') && !notes.startsWith('Standard ')) {
      freq.notes = notes;
    }
  }

  return freq;
}

/**
 * Build reference with phenotype templates from all populations
 */
function buildReferenceWithTemplates(allCultures) {
  const reference = {
    version: '6.0-split',
    traits: {}
  };

  // Use first culture to get trait keys
  const firstCulture = allCultures[0];

  for (const [traitKey, traitData] of Object.entries(firstCulture.genetic_adaptations)) {
    reference.traits[traitKey] = extractReference(traitData);
  }

  // Collect all unique phenotype templates across populations
  for (const culture of allCultures) {
    for (const [traitKey, traitData] of Object.entries(culture.genetic_adaptations)) {
      if (!reference.traits[traitKey]) {
        reference.traits[traitKey] = extractReference(traitData);
      }

      // Build phenotype templates from observed values
      const phenotype = traitData.inferred_phenotype;
      if (phenotype && traitData.phenotype_details) {
        if (!reference.traits[traitKey].phenotype_templates) {
          reference.traits[traitKey].phenotype_templates = {};
        }

        if (!reference.traits[traitKey].phenotype_templates[phenotype]) {
          reference.traits[traitKey].phenotype_templates[phenotype] = {
            name: traitData.phenotype_details.name,
            dietary_impact: traitData.phenotype_details.dietary_impact
          };
        }
      }
    }
  }

  return reference;
}

/**
 * Main migration function
 */
function splitGenetics() {
  console.log('Reading genetics.json...');
  const input = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  console.log(`Found ${input.cultures.length} populations`);

  // Build reference with templates from all populations
  console.log('Building reference file...');
  const reference = buildReferenceWithTemplates(input.cultures);
  console.log(`Extracted ${Object.keys(reference.traits).length} trait definitions`);

  // Extract frequencies for each population
  console.log('Extracting population frequencies...');
  const frequencies = {
    version: '6.0-split',
    populations: {}
  };

  for (const culture of input.cultures) {
    const popFreqs = {};

    for (const [traitKey, traitData] of Object.entries(culture.genetic_adaptations)) {
      const freqData = extractFrequencies(traitData, traitKey);
      // Only include if there's actual data
      if (Object.keys(freqData).length > 0) {
        popFreqs[traitKey] = freqData;
      }
    }

    frequencies.populations[culture.id] = popFreqs;
  }

  // Create backup of original
  console.log('Creating backup...');
  fs.copyFileSync(INPUT_FILE, BACKUP_FILE);

  // Write output files
  console.log('Writing genetics-reference.json...');
  fs.writeFileSync(REF_OUTPUT, JSON.stringify(reference, null, 2));

  console.log('Writing genetics-frequencies.json...');
  fs.writeFileSync(FREQ_OUTPUT, JSON.stringify(frequencies, null, 2));

  // Report sizes
  const originalSize = fs.statSync(INPUT_FILE).size;
  const refSize = fs.statSync(REF_OUTPUT).size;
  const freqSize = fs.statSync(FREQ_OUTPUT).size;
  const totalNewSize = refSize + freqSize;
  const reduction = ((originalSize - totalNewSize) / originalSize * 100).toFixed(1);

  console.log('\n=== Results ===');
  console.log(`Original: ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`Reference: ${(refSize / 1024).toFixed(1)} KB`);
  console.log(`Frequencies: ${(freqSize / 1024).toFixed(1)} KB`);
  console.log(`Total new: ${(totalNewSize / 1024).toFixed(1)} KB`);
  console.log(`Reduction: ${reduction}%`);
  console.log(`\nBackup saved to: ${BACKUP_FILE}`);
}

// Run the migration
splitGenetics();
