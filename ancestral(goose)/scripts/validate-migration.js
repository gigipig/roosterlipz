/**
 * Validation Script: Compare merged genetics data with original
 *
 * Run with: node scripts/validate-migration.js
 */

const fs = require('fs');
const path = require('path');

const ORIGINAL_FILE = path.join(__dirname, '..', 'genetics.json.backup');
const REF_FILE = path.join(__dirname, '..', 'genetics-reference.json');
const FREQ_FILE = path.join(__dirname, '..', 'genetics-frequencies.json');

// Key expansion map (same as in data.js)
const FREQ_KEY_EXPANSION = {
  'f': 'allele_frequency_percent',
  'p': 'phenotype_probability',
  'cn': 'average_copy_number',
  'nf': 'null_frequency_percent',
  't': 'inferred_phenotype',
  'pc': 'phenotype_confidence',
  'af1': 'african_allele_gc14010',
  'me': 'middle_eastern_allele_tg13915',
  'af2': 'african_allele_cg13907'
};

// Critical properties that must match exactly (used in calculations)
const CRITICAL_PROPERTIES = [
  'allele_frequency_percent',
  'phenotype_probability',
  'average_copy_number',
  'null_frequency_percent',
  'inferred_phenotype',
  'african_allele_gc14010',
  'middle_eastern_allele_tg13915',
  'african_allele_cg13907'
];

function buildTraitObject(ref, freq) {
  if (!ref) return null;

  const trait = {};

  // Copy static properties from reference
  if (ref.gene) trait.gene = ref.gene;
  if (ref.genes) trait.genes = ref.genes;
  if (ref.variant) trait.variant = ref.variant;
  if (ref.inheritance) trait.inheritance = ref.inheritance;
  if (ref.risk_allele) trait.risk_allele = ref.risk_allele;

  // Expand compressed frequency keys
  for (const [compressedKey, value] of Object.entries(freq)) {
    if (value === undefined || value === null) continue;

    const expandedKey = FREQ_KEY_EXPANSION[compressedKey];
    if (expandedKey) {
      trait[expandedKey] = value;
    }
  }

  // Handle nested structures
  if (freq.ADH1B) {
    trait.ADH1B = {
      allele_frequency_percent: freq.ADH1B.f,
      variant: freq.ADH1B.v || ref.ADH1B?.variant
    };
  }
  if (freq.ALDH2) {
    trait.ALDH2 = {
      allele_frequency_percent: freq.ALDH2.f,
      variant: freq.ALDH2.v || ref.ALDH2?.variant
    };
  }
  if (freq.snps) {
    trait.snps = {};
    for (const [snpId, snpData] of Object.entries(freq.snps)) {
      trait.snps[snpId] = {
        allele_frequency_percent: snpData.f,
        risk_allele: snpData.r
      };
    }
  }

  return trait;
}

function mergeGeneticsData(reference, frequencies) {
  const cultures = [];

  for (const [populationId, popFreqs] of Object.entries(frequencies.populations)) {
    const genetic_adaptations = {};

    for (const [traitKey, freqData] of Object.entries(popFreqs)) {
      const refTrait = reference.traits[traitKey];
      const mergedTrait = buildTraitObject(refTrait, freqData);
      if (mergedTrait) {
        genetic_adaptations[traitKey] = mergedTrait;
      }
    }

    cultures.push({ id: populationId, genetic_adaptations });
  }

  return { version: reference.version, cultures };
}

function validateMigration() {
  console.log('Loading files...');

  const original = JSON.parse(fs.readFileSync(ORIGINAL_FILE, 'utf8'));
  const reference = JSON.parse(fs.readFileSync(REF_FILE, 'utf8'));
  const frequencies = JSON.parse(fs.readFileSync(FREQ_FILE, 'utf8'));

  console.log('Merging new data...');
  const merged = mergeGeneticsData(reference, frequencies);

  console.log(`\nValidating ${original.cultures.length} populations...`);

  let totalErrors = 0;
  let totalChecks = 0;
  const errorsByPopulation = {};

  for (const origCulture of original.cultures) {
    const mergedCulture = merged.cultures.find(c => c.id === origCulture.id);

    if (!mergedCulture) {
      console.log(`ERROR: Missing population: ${origCulture.id}`);
      totalErrors++;
      continue;
    }

    const popErrors = [];

    for (const [traitKey, origTrait] of Object.entries(origCulture.genetic_adaptations)) {
      const mergedTrait = mergedCulture.genetic_adaptations[traitKey];

      if (!mergedTrait) {
        popErrors.push(`Missing trait: ${traitKey}`);
        totalErrors++;
        continue;
      }

      // Check critical properties
      for (const prop of CRITICAL_PROPERTIES) {
        totalChecks++;

        const origVal = origTrait[prop];
        const mergedVal = mergedTrait[prop];

        // Both null/undefined is OK
        if (origVal === undefined && mergedVal === undefined) continue;
        if (origVal === null && mergedVal === null) continue;
        if (origVal === null && mergedVal === undefined) continue;
        if (origVal === undefined && mergedVal === null) continue;

        // Compare values
        if (origVal !== mergedVal) {
          // Allow small floating point differences
          if (typeof origVal === 'number' && typeof mergedVal === 'number') {
            if (Math.abs(origVal - mergedVal) < 0.001) continue;
          }

          popErrors.push(`${traitKey}.${prop}: expected ${origVal}, got ${mergedVal}`);
          totalErrors++;
        }
      }

      // Check nested ADH1B
      if (origTrait.ADH1B && mergedTrait.ADH1B) {
        totalChecks++;
        if (origTrait.ADH1B.allele_frequency_percent !== mergedTrait.ADH1B.allele_frequency_percent) {
          popErrors.push(`${traitKey}.ADH1B.allele_frequency_percent mismatch`);
          totalErrors++;
        }
      }

      // Check nested ALDH2
      if (origTrait.ALDH2 && mergedTrait.ALDH2) {
        totalChecks++;
        if (origTrait.ALDH2.allele_frequency_percent !== mergedTrait.ALDH2.allele_frequency_percent) {
          popErrors.push(`${traitKey}.ALDH2.allele_frequency_percent mismatch`);
          totalErrors++;
        }
      }

      // Check nested SNPs
      if (origTrait.snps && mergedTrait.snps) {
        for (const snpId of Object.keys(origTrait.snps)) {
          totalChecks++;
          const origSnp = origTrait.snps[snpId];
          const mergedSnp = mergedTrait.snps[snpId];

          if (!mergedSnp) {
            popErrors.push(`${traitKey}.snps.${snpId} missing`);
            totalErrors++;
          } else if (origSnp.allele_frequency_percent !== mergedSnp.allele_frequency_percent) {
            popErrors.push(`${traitKey}.snps.${snpId}.allele_frequency_percent mismatch`);
            totalErrors++;
          }
        }
      }
    }

    if (popErrors.length > 0) {
      errorsByPopulation[origCulture.id] = popErrors;
    }
  }

  // Report results
  console.log('\n=== Validation Results ===');
  console.log(`Total checks: ${totalChecks}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Populations with errors: ${Object.keys(errorsByPopulation).length}`);

  if (totalErrors > 0) {
    console.log('\n=== Errors by Population ===');
    for (const [popId, errors] of Object.entries(errorsByPopulation)) {
      console.log(`\n${popId} (${errors.length} errors):`);
      errors.slice(0, 5).forEach(e => console.log(`  - ${e}`));
      if (errors.length > 5) {
        console.log(`  ... and ${errors.length - 5} more`);
      }
    }
  } else {
    console.log('\n SUCCESS: All critical properties match!');
  }

  // Size comparison
  const origSize = fs.statSync(ORIGINAL_FILE).size;
  const refSize = fs.statSync(REF_FILE).size;
  const freqSize = fs.statSync(FREQ_FILE).size;
  const totalNewSize = refSize + freqSize;

  console.log('\n=== Size Comparison ===');
  console.log(`Original: ${(origSize / 1024).toFixed(1)} KB`);
  console.log(`New total: ${(totalNewSize / 1024).toFixed(1)} KB`);
  console.log(`Reduction: ${((origSize - totalNewSize) / origSize * 100).toFixed(1)}%`);

  return totalErrors === 0;
}

// Run validation
const success = validateMigration();
process.exit(success ? 0 : 1);
