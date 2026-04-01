# Ancestral Diet Explorer

Vanilla JS web app (no build step). Users select grandparent ancestries → app calculates Mendelian genetic predictions + blended ancestral diet. Served as static files or via `node server.js`.

## Architecture

All scripts loaded via `<script>` tags in `index.html`. All functions/data are global. CDN dependency: jsPDF (for PDF export).

### JS Modules (load order matters — `index.html` loads them in dependency order)

| File | Purpose | Key exports (global) |
|---|---|---|
| `js/data.js` | Loads JSON data, nationality→region mapping | `loadData()`, `getGeoById(id)`, `getDietById(id)`, `getGeneticsById(id)`, `getRegionIdFromNationality(id)`, `NATIONALITY_TO_REGION`, `MIXED_ANCESTRY_DEFAULTS` |
| `js/user.js` | localStorage user profile (CRUD) | `getUser()`, `saveUser()`, `getUserSavedDiet()`, `saveUserDiet()`, `getUserAncestry()` |
| `js/diet.js` | Diet blending + results rendering | `blendDiets(regionIds, weights)`, `showBlendedDiet(blended)`, `showBlendedDietWithMendelian(blended, genetics)` |
| `js/genetics.js` | Mendelian inheritance calc, trait rendering (~53k tokens, very large) | `calculateMendelianGenetics(diets)`, `analyzeGeneticTraits(genetics)`, `getTraitMeterInfo(key, trait)`, `renderMendelianGenetics(genetics)`, `GENE_META` |
| `js/ui.js` | Dropdown population, display updates | `populateDropdowns()`, `updatePercentageTotal()`, `restoreUserSelections()` |
| `js/app.js` | Init, event handlers, modals, PDF export | `init()`, `exportResultsAsImage()`, `showLoading()`, `hideLoading()` |
| `js/onboarding.js` | Landing page / first-run flow | `initOnboarding()` |
| `js/recipes.js` | Recipe loading, scoring, bookmarking | `loadRecipes()`, `initRecipeSection()` |

### Data Files (JSON, fetched at runtime)

| File | Content |
|---|---|
| `cultures.json` | Geographic/cultural metadata per region (`{ cultures: [{ id, name, culture, ... }] }`) |
| `diets.json` | Diet data per region (`{ cultures: [{ id, macros, staples, common_foods, proteins, fats, herbs_spices, cooking_methods, diet_signature, ... }] }`) |
| `genetics-reference.json` | Static gene metadata (gene names, variants, inheritance, phenotype templates) |
| `genetics-frequencies.json` | Population-specific allele frequencies (~1.3MB, compressed keys) |
| `recipes.json` | Recipe database (`{ recipes: [...] }`) |

**Genetics Data Architecture (v6.0-split):**
- Split from single 4.9MB file to two files totaling ~1.4MB (72% reduction)
- `genetics-reference.json`: Static data same across all populations
- `genetics-frequencies.json`: Population-specific frequencies with compressed keys (`f`=allele_frequency_percent, `p`=phenotype_probability, `cn`=average_copy_number, etc.)
- Merged at load time in `data.js` via `mergeGeneticsData()` for backward compatibility
- Migration script: `scripts/split-genetics.js`

### Key Data Shapes

**User object** (localStorage):
```js
{ id, username, createdAt, updatedAt,
  ancestry: { mode: 'family'|'dna', familyTree: { mgm, mgf, pgm, pgf }, dnaTest: [{regionId, percent}×4] },
  savedDiet: { calculatedAt, mode, data: { blended, mendelianGenetics? } },
  bookmarkedRecipes: [] }
```

**blended** (from `blendDiets()`):
```js
{ diets: [diet,...], geos: [geo,...], weights: [0.25,...],
  blendedMacros: { carbs_pct, protein_pct, fat_pct },
  commonFoods: [...], allProteins: [...], allFats: [...], allHerbs: [...], allCooking: [...] }
```

**geo object**: `{ id, name, culture, ... }`
**diet object**: `{ id, macros: {carbs_pct, protein_pct, fat_pct}, staples, common_foods, proteins, fats, herbs_spices, cooking_methods, diet_signature, genetic_adaptations }`

**GENE_META** (in genetics.js ~line 1189): `{ [traitKey]: { icon, title, cssClass } }` — ~60 entries covering all gene traits.

**legacyKeyMap** (in genetics.js ~line 3318): Maps core calc keys (`lactase`, `amy1`, `fads`, etc.) to GENE_META keys (`lactase_persistence`, `starch_digestion`, etc.).

**getTraitMeterInfo(key, trait)** → `{ value: 0-100, statusLabel: string, statusClass: 'high'|'moderate'|'low' }`

**analyzeGeneticTraits(genetics)** → `{ strengths: [{icon, title, detail}], watchItems: [{icon, title, detail}] }` (max 5 each)

### Two Calculation Modes

1. **Family/Mendelian** (4 grandparents selected): `calculateMendelianGenetics()` → full trait predictions. Displayed via `showBlendedDietWithMendelian()`.
2. **DNA/Blended** (weighted %): Simple weighted average. Displayed via `showBlendedDiet()`. No genetics pages.

## Conventions

- No build step, no bundler, no framework — vanilla JS + global functions
- Styles in `style.css` (single file)
- Dark theme: `#000` background, `#1db954` primary accent (Spotify green)
- CDN deps in `<head>`: jsPDF
- `package.json` exists but is legacy (Express/Mapbox from earlier iteration) — not used for the current static app
