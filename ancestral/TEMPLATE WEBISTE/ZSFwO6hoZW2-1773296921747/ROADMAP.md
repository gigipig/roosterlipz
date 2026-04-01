# Ancestral Diet Explorer — Next.js Port Roadmap

**Working directory:** `C:\Users\samsa\Documents\ancestral\TEMPLATE WEBISTE\ZSFwO6hoZW2-1773296921747\`
**Source (vanilla JS):** `C:\Users\samsa\Documents\ancestral\`
**Run:** `npm run dev` → http://localhost:3000
**Build:** `npm run build` ✓ (passes clean as of last session)

---

## What Is Built (Completed)

### Infrastructure
- [x] Dependencies installed (`npm install` + `jspdf@^2.5.2`)
- [x] `app/globals.css` — ancestral palette: `#13110e` bg, `#1db954` green, `#c8a96e` amber, force-dark
- [x] `app/layout.tsx` — title "Ancestral Diet Explorer", `<html className="dark">`, font: **Plus Jakarta Sans** (wider, more legible than Inter)
- [x] `public/` — 5 JSON data files copied (cultures, diets, genetics-reference, genetics-frequencies, recipes)

### Data & Logic Layer (`lib/` + `hooks/`)
- [x] `lib/types.ts` — TypeScript interfaces (User, BlendedDiet, GeneticTrait, Recipe, etc.)
- [x] `lib/data.ts` — `loadData()`, `getDietById()`, `getGeoById()`, `getGeneticsById()`, full `NATIONALITY_TO_REGION` (220+ nationalities), `getNationalitiesGrouped()`, `getRegionIdFromNationality()`
- [x] `lib/user.ts` — localStorage CRUD, SSR-safe (`typeof window` guards)
- [x] `lib/diet.ts` — `blendDiets()` pure calculation, `generateDietArchetype()`, `scoreFoodForUser()`, `tieredFoodGroups()`, `getSignatureFoods()`
- [x] `lib/genetics.ts` — entire genetics.js (4173 lines) with `// @ts-nocheck`, exports: `calculateMendelianGenetics`, `analyzeGeneticTraits`, `getTraitMeterInfo`, `calculateCategoryScores`, `GENE_META`, `legacyKeyMap`, `getFoodExplanations`, `blendGeneticAdaptations`
- [x] `lib/recipes.ts` — `loadRecipes()`, `getRecipesForUser()`, `calculateRecipeGeneticScore()`, `getScoreLevel()`
- [x] `lib/pdf-export.ts` — `exportResultsAsPDF()` with dynamic jsPDF import
- [x] `lib/unlock.ts` — `isUnlocked()`, `setUnlocked()`, `redeemCode()` — localStorage unlock state
- [x] `hooks/use-data.ts` — singleton data load hook, loading/error states
- [x] `hooks/use-user.ts` — React hook wrapping lib/user.ts
- [x] `hooks/use-unlock.ts` — React hook for unlock state

### Landing Page (`/`)
- [x] `components/header.tsx` — "Ancestral" brand, nav links, "Get Started" → opens onboarding wizard
- [x] `components/hero.tsx` — "Unlock Your Ancestral Diet", trust stats bar, "Discover Your Diet" → opens onboarding wizard
- [x] `components/how-it-works.tsx` — 3-step cards
- [x] `components/features.tsx` — 6 feature cards (genetics, food tiers, macros, research, privacy, recipes)
- [x] `components/faq.tsx` — 6 Q&A in shadcn Accordion
- [x] `components/footer.tsx` — "A" watermark, disclaimer, educational notice
- [x] `app/page.tsx` — composes: Header → Hero → HowItWorks → Features → FAQ → Footer

### Onboarding Wizard (`components/onboarding/`)
- [x] `components/onboarding/onboarding-wizard.tsx` — full 3-step wizard
  - Step 1: Mode selection (Family Tree / DNA) as large tactile choice cards with auto-advance
  - Step 2: Ancestry input — 2-column maternal/paternal layout (family) or 4-row percentage input (DNA) with custom searchable combobox
  - Step 3: Confirmation summary + optional email capture + "Calculate My Ancestral Diet" CTA
  - CSS slide animations between steps (`wizardSlideInRight` / `wizardSlideInLeft`)
  - Atmospheric radial gradient background, Cormorant italic headings
  - Escape key to close, body scroll lock, progress bars in header
  - Saves to localStorage on finish, routes to `/app`
- [x] ✏ pencil icon in sidebar header reopens wizard from within `/app`

### App Interface (`/app`)
- [x] `components/providers/data-provider.tsx` — loading screen during 1.4MB data fetch, error state
- [x] `components/providers/app-state-provider.tsx` — central state: mode, familyTree, dnaTest, blended, genetics, activeTab, isCalculating, sidebarCollapsed, **isUnlocked**, unlockApp(), tryUnlockCode()
- [x] `app/app/layout.tsx` — DataProvider + AppStateProvider + Toaster
- [x] `app/app/page.tsx` — fixed header + desktop sidebar (w-80) + main content + wizard mount
- [x] `components/app/app-header.tsx` — hamburger (mobile Sheet), logo → `/`, disclaimer badge
- [x] `components/app/app-sidebar.tsx` — mode toggle, searchable NationalitySelect, FamilyTreePanel (4 grandparents), DNATestPanel (4 × region + %), percentage validation, Calculate button, ✏ wizard trigger
- [x] `components/app/calculating-overlay.tsx` — fullscreen spinner
- [x] `components/app/results-area.tsx` — "Free preview" badge, PDF lock, locked tab intercept, `UnlockModal` mount, tab shell
- [x] `components/app/unlock-modal.tsx` — £9.99 pricing dialog, 6-feature list, disabled Stripe CTA placeholder, unlock code input
- [x] `components/app/paywall-overlay.tsx` — reusable in-tab lock screen with feature checklist + CTA

### Results Tabs
- [x] `components/app/tabs/overview-tab.tsx` — disclaimer, ancestry mix bar, macro profile, category scores, key insights, upgrade teaser (when locked)
- [x] `components/app/tabs/genetics-tab.tsx` — **free preview: 3 traits shown**, blurred ghost cards for remainder with lock overlay + CTA; full 34+ trait profile when unlocked; badge legend; category sections; gene glossary popovers
- [x] `components/app/tabs/diet-tab.tsx` — **PaywallOverlay when locked**; daily guidelines (All Day + Morning/Afternoon/Evening), dietary priorities, per-ancestry breakdown
- [x] `components/app/tabs/foods-tab.tsx` — **PaywallOverlay when locked**; full redesign (Phase 1):
  - **Signature Foods** — prominent feature cards with genetic one-liner + ancestry badges + expandable reasons
  - **By Ancestry** — per-ancestry food cards with `diet_signature` text + colored-dot food chips
  - **Browse Foods** — filter tabs (All / Ancestral / Proteins / Fats / Herbs) + tiered sections
  - **Colored dots** on every chip (green/amber/grey — always visible, no hover required)
  - **Click-to-expand chips** — tap any chip to show inline genetic reasons panel (mobile-friendly)
  - **Ancestral Recipes** — scored cards + bookmarks + recipe detail dialog

### Diet Tab — Phase 2 ✅ DONE
- [x] **Top Priorities banner** — numbered action cards (#1/#2/#3) from `analyzeGeneticTraits()` watch items; amber accent; strength items in sage below
- [x] **Macro Range Bar** — `MacroRangeSection` + `MacroRangeBar`; blended value as dot, ancestral min–max as shaded band, WHO average as tick; all three macros
- [x] **Gene code badges** — `GENE_CODE_MAP` (15 genes: CLOCK, PER1, CYP1A2, ADORA2A, DAO, SLC2A2, LEPR, BDNF, LCT, HFE, COMT, ABCG2, G6PD, ACE, CYP2R1); `🧬 GENE` badge on each RuleCard header
- [x] **`period:'all'` dedup** — already correct in prior implementation; confirmed no change needed

---

## Paywall System

| Free | Paid (£9.99 one-time) |
|---|---|
| Overview tab + ancestry breakdown | Full 34+ trait genetic profile |
| Top 3 genetic traits (preview) | Daily Guidelines + meal timing |
| Blended macro profile | Full Foods section |
| Upgrade teaser card in Overview | PDF report export |
| | Recipe scoring + bookmarks |
| | Nutrient Gap Analysis |

- Unlock state: `localStorage.getItem('ancestral_unlocked') === 'true'`
- Demo unlock code: `ANCESTRAL2026` (for testing — remove before production)
- Stripe CTA: visible but disabled — ready for Phase 0.3 wiring
- `lib/unlock.ts`: `isUnlocked()`, `setUnlocked()`, `redeemCode()`
- `AppStateProvider` hydrates `isUnlocked` from localStorage on mount

---

## Known Issues _(found in 2026-03-22 codebase scan)_

### Bugs (things that are broken)

| Issue | File | Line | Detail |
|---|---|---|---|
| Bookmarks not persisted | `foods-tab.tsx` | ~562 | `setBookmarks` is local state only — `user.bookmarkedRecipes` in localStorage is never written to. Resets on every reload. |
| Tab unlock click handling | `results-area.tsx` | ~103, 133, 143 | Diet & Foods tabs use `e.preventDefault()` + `onClick` inconsistently vs `onValueChange` — unlock flow fires unreliably. |
| `onOpenUnlock` dead prop | `results-area.tsx` | ~157, 162, 166 | Passed to GeneticsTab, DietTab, FoodsTab but none use it — they render `PaywallOverlay` directly. Remove the prop. |

### Structural / Maintenance

| Issue | File(s) | Detail |
|---|---|---|
| Price hardcoded in 4 places | `unlock-modal.tsx`, `overview-tab.tsx`, `genetics-tab.tsx`, `paywall-overlay.tsx` | `£9.99` hardcoded each time. Extract a single `UNLOCK_PRICE` constant to `lib/unlock.ts`. |
| Health concern logic in 3 places | `diet.ts`, `diet-tab.tsx`, `foods-tab.tsx` | `scoreFoodForUser()`, `isInDiet()`, and `getSignatureFoods()` all independently check health concern keywords. Consolidate. |
| `ruleKeyMap` duplicates `legacyKeyMap` | `diet-tab.tsx` | Local `ruleKeyMap` defined at top of file overlaps with `legacyKeyMap` from `genetics.ts`. One source of truth needed. |
| Recipe loading has no timeout | `foods-tab.tsx` | ~707 If `getRecipesForUser()` hangs, the loading spinner never resolves. |
| `GENE_SOURCES` / `GENE_GLOSSARY` barely used | `genetics-tab.tsx` | Imported but only touched as deep fallbacks; consider removing imports or surfacing the data visibly. |

### Missing Wiring (features built but not connected)

| Issue | Detail |
|---|---|
| `generateDietArchetype()` never called | Exported from `lib/diet.ts`, included in Phase 4 scope, but not called anywhere in the UI. Should surface as a subtitle or label under results. |
| Error boundaries absent | No error boundary wraps any tab — one crash takes down the whole app. Tracked in Phase 4. |

---

## Next Steps

### Phase 1.5 — Data Enrichment ✅ COMPLETE _(2026-03-29)_

#### 1a — Region Granularity
- ~~Split `balkan` into sub-regions~~ **Deferred** — `balkan` is intentionally one Ottoman-era culinary tradition; splitting would be large data work for marginal gain. Better lever is richer food data within existing regions.

#### 1b — Expand Food Genetics Map ✅
- Added ~90 new entries to `FOOD_GENETICS_MAP` in both `js/genetics.js` and `lib/genetics.ts`
- Mediterranean herbs & aromatics: `garlic`, `oregano`, `basil`, `rosemary`, `thyme`, `parsley`, `dill`, `mint`, `cumin`, `paprika`, `saffron`, `turmeric`, `ginger`, `cinnamon`, `fennel`, `cardamom` + more
- Mediterranean & Balkan proteins: `pork` (was missing), `halloumi`, `mozzarella`, `tzatziki`, `octopus`, `squid`, `calamari`, `sea bass`, `sea bream`, `prawn`, `prosciutto`
- Mediterranean produce: `ajvar`, `tahini`, `zucchini`, `aubergine`, `grape leaves`, `pomegranate`, `lemon`, `artichoke`, `pine nuts`, `pistachios`, `honey`, `phyllo`, `burek`, `polenta`
- Northern/Eastern European: `beetroot`, `horseradish`, `turnip`, `radish`, `watercress`, `mustard`, `lingonberry`, `cloudberry`, `bilberry`
- Nordic & Arctic: `reindeer`, `smoked salmon`, `lutefisk`
- South & East Asian: `tofu`, `edamame`, `matcha`, `paneer`, `dal`, `gochujang`, `wakame`
- African & Caribbean: `peanuts`, `groundnuts`, `fufu`, `ugali`, `injera`, `berbere`, `suya`

#### 1c — Signature Foods improvement
- ~~Deferred~~ — still pending; `getSignatureFoods()` still derives from tier system. Consider adding explicit `signature_foods` field to `diets.json` entries as a future improvement.

#### 1d — Ancestral Recipes Expansion ✅
- Added 12 Greek/Balkan recipes to `public/recipes.json` (45 → 57 total)
- New recipes: Moussaka, Spanakopita, Souvlaki with Tzatziki, Fasolada, Avgolemono, Grilled Octopus, Tavče Gravče, Shopska Salata, Sarma, Ćevapi with Ajvar, Pastitsio, Horiatiki
- Each recipe has full `ingredients`, `instructions`, `geneticRelevance` (2–3 traits), `nutritionalHighlights`, and `culturalContext`

#### 1e — Diet Tab: Genetic Notes on Protein/Fat/Herb Chips ✅
- `DietFoodSection` component added to `diet-tab.tsx` — section-level `selectedFood` state, expansion panel renders below chip cloud (matching Foods tab pattern)
- `DietChip` shows coloured dot: green (positive notes), amber (watch notes), grey (none)
- `DietExpansionPanel` shows up to 3 positive + 2 watch reasons with icons
- Bug fix: initial implementation rendered panel inside flex container (pushing chips sideways) — fixed to match Foods tab pattern

---

### Phase 0.3 — Server + Stripe _(required for live payments)_
- Lightweight Express.js server
- `POST /api/checkout` → Stripe one-off payment session (~£9.99)
- Stripe webhook → server generates signed JWT unlock token
- Server emails token to user; user pastes into UnlockModal code field
- `POST /api/contact` → replace Formspree dependency
- All genetic calculation stays client-side (privacy claim preserved)
- Remove demo code `ANCESTRAL2026` once live

### Phase 2 — Diet Tab Improvements ✅ COMPLETE
_(See session log 2026-03-21 and "What Is Built" above)_

### Phase 3 — PDF Report Polish
- Apply Signature Foods tier to PDF "Recommended Foods" page
- "Your Top 3 Priorities" as prominent boxed section on page 1
- Macro range bar in PDF
- Ensure trait meters render correctly in html2canvas capture

### Phase 4 — Bug Fixes, Polish & Technical Debt

**Bug fixes (from 2026-03-22 scan — fix before adding new features):**
- Fix bookmark persistence: wire `foods-tab.tsx` bookmark state through `useUser` → `user.bookmarkedRecipes` in localStorage
- Extract `UNLOCK_PRICE = '£9.99'` constant to `lib/unlock.ts`; replace all 4 hardcoded occurrences
- Clean up dead `onOpenUnlock` prop from `results-area.tsx` and all tab components
- Fix tab unlock click handling inconsistency in `results-area.tsx` (standardise on `onValueChange`)
- Add recipe loading timeout in `foods-tab.tsx`

**Structural:**
- Consolidate health concern keyword logic into a single utility (currently split across `diet.ts`, `diet-tab.tsx`, `foods-tab.tsx`)
- Remove local `ruleKeyMap` in `diet-tab.tsx`; use `legacyKeyMap` from `genetics.ts` directly

**Missing wiring:**
- Archetype label: surface `generateDietArchetype(blended)` as a subtitle under results (function exists in `lib/diet.ts`, never called)
- Error boundaries around each tab

**General polish:**
- Loading skeleton (replace spinner in `data-provider.tsx`)
- DNA Test mode mixed ancestry defaults (`MIXED_ANCESTRY_DEFAULTS` from `lib/data.ts`)
- Accessibility audit: ARIA labels on tabs, trait meters, collapsible sections
- Print CSS `@media print` as lightweight PDF alternative

---

## Architecture Notes

- **genetics.ts is `// @ts-nocheck`** — never add types to it; 4173 lines verbatim from source. Only touch exports at the bottom.
- **calculateMendelianGenetics()** takes exactly **4 diet objects** (each with `genetic_adaptations`). Pass `getDietById(regionId)` results.
- **legacyKeyMap** maps raw calc keys (`lactase`, `amy1`, `fads`) → `GENE_META` keys (`lactase_persistence`, `starch_digestion`, `pufa_metabolism`)
- **AppStateProvider** is the single source of truth for `blended`, `genetics`, and `isUnlocked`. Don't put results in component-local state.
- **SSR safety:** all `localStorage` access must be inside `useEffect` or guarded by `typeof window !== 'undefined'`. `lib/user.ts` and `lib/unlock.ts` are already guarded.
- **jsPDF** must only be imported dynamically (`await import('jspdf')`) — never at module top level.
- **Data loads once** via the `dataLoadPromise` singleton in `hooks/use-data.ts`. Don't call `loadData()` directly from components.
- **Tailwind color tokens:** `text-sage` = green (#1db954), `text-amber`/`bg-amber` = amber (#c8a96e). Both `text-terracotta` and `text-amber` map to the same value.
- **Onboarding wizard** saves to localStorage then routes to `/app`; sidebar's `useEffect` restores on mount — no need to pass state through router.

## File Map

```
app/
  page.tsx                          ← landing page
  layout.tsx                        ← dark mode, metadata, fonts
  globals.css                       ← ancestral palette + wizard keyframes
  app/
    layout.tsx                      ← DataProvider + AppStateProvider
    page.tsx                        ← app shell + wizard mount

lib/
  types.ts                          ← TypeScript interfaces
  data.ts                           ← data loading + NATIONALITY_TO_REGION
  user.ts                           ← localStorage user CRUD
  diet.ts                           ← blendDiets() + food scoring
  genetics.ts                       ← full genetics.js (@ts-nocheck)
  recipes.ts                        ← recipe scoring/loading
  pdf-export.ts                     ← jsPDF export (dynamic import)
  unlock.ts                         ← paywall unlock state (localStorage)
  utils.ts                          ← (pre-existing)

hooks/
  use-data.ts                       ← singleton data load hook
  use-user.ts                       ← React hook for user state
  use-unlock.ts                     ← React hook for unlock state

components/
  header.tsx                        ← landing nav + wizard trigger
  hero.tsx                          ← landing hero + wizard trigger
  features.tsx                      ← 6 feature cards
  footer.tsx                        ← "A" watermark
  how-it-works.tsx                  ← 3-step section
  faq.tsx                           ← 6-item FAQ accordion
  onboarding/
    onboarding-wizard.tsx           ← 3-step guided intake wizard
  providers/
    data-provider.tsx               ← loading screen + data context
    app-state-provider.tsx          ← central app state
  app/
    app-header.tsx                  ← fixed 70px header + mobile Sheet
    app-sidebar.tsx                 ← ancestry selects + calculate + wizard trigger
    calculating-overlay.tsx         ← fullscreen spinner
    results-area.tsx                ← tab shell + PDF button + UnlockModal
    unlock-modal.tsx                ← £9.99 pricing dialog
    paywall-overlay.tsx             ← reusable in-tab lock screen
    tabs/
      overview-tab.tsx              ← ancestry mix, macros, categories, insights
      genetics-tab.tsx              ← 3 free traits + locked remainder
      diet-tab.tsx                  ← daily guidelines (locked)
      foods-tab.tsx                 ← signature foods + ancestry cards + browse

public/
  cultures.json
  diets.json
  genetics-reference.json
  genetics-frequencies.json
  recipes.json
```

---

## Session Log

### Session — 2026-03-19
- **Font swap:** `Inter` → `Plus Jakarta Sans` (400/500/600/700).
- **Genetics badge legend:** Added colour-coded key panel to `GeneticsTab`.

### Session — 2026-03-21
- **Phase 0.1 — Paywall UI:** `lib/unlock.ts`, `hooks/use-unlock.ts`, `UnlockModal`, `PaywallOverlay`; `isUnlocked` added to `AppStateProvider`; Genetics tab shows 3 free traits + blurred lock; Diet + Foods fully locked; PDF button locked; Overview shows upgrade teaser.
- **Phase 0.2 — Onboarding Wizard:** Full 3-step wizard with CSS slide animations, custom searchable combobox (220+ nationalities), maternal/paternal layout, DNA percentage input; replaces direct `/app` link from Hero + Header; ✏ wizard re-entry from sidebar.
- **Phase 1 — Foods Section Redesign:** Signature Foods feature cards; per-ancestry food cards with `diet_signature`; always-visible colored genetic dots; click-to-expand chip panels (mobile-friendly); "Ancestral" filter tab added; filter tab description swaps dynamically; recipe section minor polish.

### Session — 2026-03-29
- **Planning — Phase 1.5 Data Enrichment:** Identified root cause of sparse Signature Foods (Macedonian/Greek/Italian all resolve to single `balkan` region). Decided against region split (Ottoman synthesis is intentionally unified). Planned 1b–1e instead.
- **Phase 1.5 — FOOD_GENETICS_MAP expansion:** ~90 new food entries across 7 cuisine groups added to both `js/genetics.js` and `lib/genetics.ts`. Covers Mediterranean herbs, Balkan proteins (incl. pork which was missing), Nordic, South/East Asian, African/Caribbean.
- **Phase 1.5 — Recipes expansion:** 12 new Greek/Balkan recipes added to `public/recipes.json` (45 → 57). Moussaka, Spanakopita, Souvlaki, Fasolada, Avgolemono, Grilled Octopus, Tavče Gravče, Shopska Salata, Sarma, Ćevapi, Pastitsio, Horiatiki.
- **Phase 1.5 — Diet tab genetic chip notes:** `DietFoodSection` + `DietChip` + `DietExpansionPanel` components added to `diet-tab.tsx`. Coloured dots + click-to-expand panel below chip cloud for Protein Sources, Healthy Fats, and Herbs & Spices. Fixed layout bug where panel was inside flex container.

### Session — 2026-03-22
- **Codebase scan:** Full review of all lib/, hooks/, and components/app/ files. Found 3 bugs, 5 structural issues, 2 missing wiring gaps. Logged in "Known Issues" section above. Phase 2 marked complete in roadmap. Phase 4 expanded with prioritised bug fix list.

### Session — 2026-03-21 (Phase 2)
- **Phase 2 — Diet Tab Improvements:** `diet-tab.tsx` rewritten with three enhancements:
  - **Top Priorities banner** — numbered action cards (#1 #2 #3) from `analyzeGeneticTraits()` watch items with amber accent treatment; strength items shown below in sage; replaces the old mixed grid.
  - **Macro Range Bar** — new `MacroRangeSection` + `MacroRangeBar` components; shows blended value as colored dot, ancestral min–max as shaded band, WHO population average as tick mark, across all three macros (Carbs/Protein/Fat).
  - **Gene code badges** — `GENE_CODE_MAP` lookup table (15 genes: CLOCK, PER1, CYP1A2, ADORA2A, DAO, SLC2A2, LEPR, BDNF, LCT, HFE, COMT, ABCG2, G6PD, ACE, CYP2R1); each `RuleCard` header now shows a `🧬 GENE` monospace badge.
  - **`period:'all'` dedup confirmed** — already correct in prior implementation; no change needed.
