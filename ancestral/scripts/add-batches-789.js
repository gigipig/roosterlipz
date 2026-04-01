/**
 * Migration script: Add Batches 7, 8, 9 to genetics JSON files
 *
 * Batch 7: Nutrient Absorption — slc23a1_vitamin_c, tcn2_b12_transport, slc30a8_zinc, atp7a_copper
 * Batch 8: Cholesterol & Lipids — pcsk9_ldl, apoa1_hdl, ldlr_cholesterol, lpl_triglycerides
 * Batch 9: Taste & Appetite    — trpv1_spice, crhr1_stress_eating, pomc_satiety, npy_appetite
 *
 * NOTE: The 'tier' field (D/P/E) present in research files is stripped — the program
 * does not read it. Only f (frequency), t (template), and notes (where relevant) are kept.
 */

const fs = require('fs');
const path = require('path');

const refPath  = path.join(__dirname, '../genetics-reference.json');
const freqPath = path.join(__dirname, '../genetics-frequencies.json');

// Helper: extract a JSON block after a section heading in markdown
function extractJsonBlock(md, heading) {
  const hi = md.indexOf(heading);
  if (hi === -1) throw new Error(`Heading not found: ${heading}`);
  const start = md.indexOf('```json', hi) + 7;
  const end   = md.indexOf('\n```', start);
  return JSON.parse(md.substring(start, end).trim());
}

// Strip 'tier' from every population entry; keep f, t, and notes (if present)
function cleanEntry(entry) {
  const out = { f: entry.f, t: entry.t };
  if (entry.notes) out.notes = entry.notes;
  // Handle APOE-style dual frequency (not in these batches, but future-safe)
  if (entry.f_e2 !== undefined) { out.f_e2 = entry.f_e2; delete out.f; }
  if (entry.f_e4 !== undefined) out.f_e4 = entry.f_e4;
  return out;
}

console.log('Reading files...');
const ref  = JSON.parse(fs.readFileSync(refPath,  'utf8'));
const freq = JSON.parse(fs.readFileSync(freqPath, 'utf8'));

const batchDir = path.join(__dirname, '../Archive/Research/19 Feb 26');

// ─────────────────────────────────────────────
// BATCH 7: Nutrient Absorption
// ─────────────────────────────────────────────
console.log('Processing Batch 7: Nutrient Absorption...');
const b7md   = fs.readFileSync(path.join(batchDir, 'Batch 7.md'), 'utf8');
const b7ref  = extractJsonBlock(b7md, 'Output 1: Reference entry');
const b7freq = extractJsonBlock(b7md, 'Output 2: Frequency data');

// ─────────────────────────────────────────────
// BATCH 8: Cholesterol & Lipids
// ─────────────────────────────────────────────
console.log('Processing Batch 8: Cholesterol & Lipids...');
const b8md   = fs.readFileSync(path.join(batchDir, 'Batch 8.md'), 'utf8');
const b8ref  = extractJsonBlock(b8md, 'Output 1: genetics-reference.json');
const b8freq = extractJsonBlock(b8md, 'Output 2: genetics-frequencies.json');

// ─────────────────────────────────────────────
// BATCH 9: Taste & Appetite
// ─────────────────────────────────────────────
console.log('Processing Batch 9: Taste & Appetite...');
const b9md   = fs.readFileSync(path.join(batchDir, 'Batch 9.md'), 'utf8');
const b9ref  = extractJsonBlock(b9md, 'Output 1: genetics-reference.json');
const b9freq = extractJsonBlock(b9md, 'Output 2: genetics-frequencies.json');

// ─────────────────────────────────────────────
// Add reference entries
// ─────────────────────────────────────────────
console.log('Adding new trait definitions to reference file...');
const newRefTraits = { ...b7ref, ...b8ref, ...b9ref };
const addedTraitKeys = Object.keys(newRefTraits);

// Check for duplicates
for (const key of addedTraitKeys) {
  if (ref.traits[key]) {
    console.warn(`  WARNING: Trait '${key}' already exists in reference — skipping`);
    delete newRefTraits[key];
  }
}

Object.assign(ref.traits, newRefTraits);
console.log(`  Total traits now: ${Object.keys(ref.traits).length}`);

// ─────────────────────────────────────────────
// Add population frequency entries
// ─────────────────────────────────────────────
console.log('Adding population frequency data...');

// Merge all batch freq data into one lookup: { popId: { traitKey: {f,t,notes?} } }
const allBatchFreq = {};
for (const [popId, traits] of Object.entries(b7freq)) {
  allBatchFreq[popId] = allBatchFreq[popId] || {};
  for (const [traitKey, entry] of Object.entries(traits)) {
    allBatchFreq[popId][traitKey] = cleanEntry(entry);
  }
}
for (const [popId, traits] of Object.entries(b8freq)) {
  allBatchFreq[popId] = allBatchFreq[popId] || {};
  for (const [traitKey, entry] of Object.entries(traits)) {
    allBatchFreq[popId][traitKey] = cleanEntry(entry);
  }
}
for (const [popId, traits] of Object.entries(b9freq)) {
  allBatchFreq[popId] = allBatchFreq[popId] || {};
  for (const [traitKey, entry] of Object.entries(traits)) {
    allBatchFreq[popId][traitKey] = cleanEntry(entry);
  }
}

let updatedPops = 0;
let missingPops = [];

for (const [popId, popData] of Object.entries(freq.populations)) {
  if (allBatchFreq[popId]) {
    Object.assign(popData, allBatchFreq[popId]);
    updatedPops++;
  } else {
    missingPops.push(popId);
  }
}

if (missingPops.length > 0) {
  console.warn(`  WARNING: ${missingPops.length} populations in genetics-frequencies.json had no batch data: ${missingPops.join(', ')}`);
}

// Check for populations in batch data not in main file
const mainPops = new Set(Object.keys(freq.populations));
for (const popId of Object.keys(allBatchFreq)) {
  if (!mainPops.has(popId)) {
    console.warn(`  WARNING: Population '${popId}' in batch data not found in genetics-frequencies.json`);
  }
}

console.log(`  Updated ${updatedPops} populations`);

// ─────────────────────────────────────────────
// Write output files
// ─────────────────────────────────────────────
console.log('Writing genetics-reference.json...');
fs.writeFileSync(refPath, JSON.stringify(ref, null, 2), 'utf8');

console.log('Writing genetics-frequencies.json...');
fs.writeFileSync(freqPath, JSON.stringify(freq, null, 2), 'utf8');

// ─────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────
const samplePop = freq.populations.japan;
console.log('\nDone! Summary:');
console.log(`  genetics-reference.json: ${Object.keys(ref.traits).length} total traits`);
console.log(`  genetics-frequencies.json: ${Object.keys(freq.populations).length} populations updated`);
console.log(`  New traits added: ${Object.keys(newRefTraits).length}`);
console.log(`  New traits per population: ${Object.keys(allBatchFreq[Object.keys(allBatchFreq)[0]]).length}`);
console.log(`  Traits per population (japan): ${Object.keys(samplePop).length}`);
console.log('\n  Batch 7 (Nutrient Absorption):', Object.keys(b7ref).join(', '));
console.log('  Batch 8 (Cholesterol & Lipids):', Object.keys(b8ref).join(', '));
console.log('  Batch 9 (Taste & Appetite):    ', Object.keys(b9ref).join(', '));
