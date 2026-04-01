# Ancestral Diet Explorer — Product Roadmap

## Current State (as of Mar 2026)

The core app is functional end-to-end:

- Landing page with hero, how-it-works, features, FAQ, footer ✓
- Family Tree (Mendelian) and DNA percentage modes ✓
- 60+ ancestral regions, 34+ genetic traits ✓
- Tabbed results: Overview → Genetics → Diet → Foods ✓
- Genetic profile summary card + trait meters ✓
- Key Takeaways, Nutrient Gap Analysis ✓
- Daily Guidelines (morning/afternoon/evening cards) ✓
- Food chips with genetic tooltips (hover) ✓
- Recipe section ✓
- PDF/image export (jsPDF) ✓
- Sources & citations section ✓
- 100% local — no server, no tracking ✓
- Settings modal with Contact Us form ✓ (Formspree endpoint: set `FORMSPREE_ENDPOINT` in `js/app.js`)

---

---

## Phase 0 — Monetisation Foundation ✅ COMPLETE (Next.js port)

### 0.1 Paywall UI ✅ DONE
- Genetics tab: 3 traits free + blurred ghost cards + lock overlay for remainder
- Diet + Foods tabs: fully locked behind `PaywallOverlay` component
- PDF export button locked; opens `UnlockModal`
- Overview tab: fully free + upgrade teaser card at bottom
- `lib/unlock.ts` + `hooks/use-unlock.ts` + `AppStateProvider.isUnlocked`
- `UnlockModal`: £9.99 one-time, feature list, disabled Stripe CTA (placeholder), unlock code input
- Demo code: `ANCESTRAL2026` (remove before production)

### 0.2 Onboarding Wizard ✅ DONE
- `components/onboarding/onboarding-wizard.tsx` — full-screen 3-step overlay
- Step 1: Mode cards (Family Tree / DNA) with auto-advance on selection
- Step 2: Searchable combobox (220+ nationalities), 2-column maternal/paternal layout (family) or percentage rows (DNA)
- Step 3: Confirmation summary + optional email + "Calculate My Ancestral Diet" CTA
- CSS slide animations, atmospheric background, Cormorant italic headings
- Triggered from Hero + Header "Get Started"; re-enterable via ✏ in sidebar
- Saves to localStorage → routes to `/app` → sidebar auto-restores

### 0.3 Server + Stripe _(next — required for live payments)_
- Lightweight Express.js server
- `POST /api/checkout` → Stripe one-off payment session (~£9.99)
- Stripe webhook → server generates signed JWT unlock token
- Server emails token to user; user pastes into UnlockModal code field
- `POST /api/contact` → receives form submissions (remove Formspree dependency)
- All genetic calculation stays client-side (privacy claim preserved)
- Remove demo code `ANCESTRAL2026` once live

---

## Phase 1 — Foods Section Redesign ✅ COMPLETE (Next.js port)

### 1.1 Signature Foods Tier ✅ DONE
- `SignatureFoodCard` component: prominent feature cards with sage gradient border, food name in Cormorant serif, "Signature" badge, ancestry source pills, primary genetic reason always visible, expandable "+N more reasons" toggle

### 1.2 Always-visible Genetic Dots ✅ DONE
- Every food chip has a 1.5px colored dot (green/amber/grey) — no hover required
- Green = positive genetic match, Amber = watch/limit, Grey = neutral
- `getDotClass(score)` helper used across chip and ancestry card components

### 1.3 Click-to-expand Chips ✅ DONE
- `FoodChip` is now a button; clicking toggles `FoodExpansionPanel` below the chip cloud
- Panel shows icon + reason text (sage/amber/red per type), works on mobile
- Replaces hover-only `<Tooltip>` dependency entirely

### 1.4 Per-Ancestry Food Cards ✅ DONE
- New "By Ancestry" section using `blended.diets[i]` + `blended.geos[i]`
- `AncestryFoodCard`: ancestry name, `diet_signature` italic text, 6 staple/common foods with colored dots
- Horizontal scroll on mobile, 2–4 column grid on desktop

### 1.5 Filter Tabs ✅ DONE
- Tabs: All | Ancestral | Proteins | Fats | Herbs
- "Ancestral" = `blended.commonFoods` only (core ancestral staples)
- Active tab description swaps dynamically in Browse Foods subtitle

---

## Phase 2 — Diet Tab Improvements

### 2.1 "Your Top Priorities" Banner

Insert 2–3 high-contrast action cards at the top of the Diet tab, directly tied to the user's strongest genetic signals. Each card:

- Icon + trait name
- Plain-English consequence ("You likely produce less amylase — complex carbs are harder to break down")
- Single clear action ("Build meals around proteins and fats rather than grains")

These are derived from the existing `analyzeGeneticTraits()` watch items — the logic exists, it just needs a prominent UI home.

### 2.2 Macro Bar with Context

Replace the raw `X% Carbs / Y% Protein / Z% Fat` bar with:

- A **range band** showing the ancestral variation (e.g. "35–55% carbs" across the blended regions)
- A **population average** reference marker
- A short label explaining the shift: _"Lower than average — your Nordic/Arctic ancestry adapted to high-fat diets"_

Data available from individual diet objects before blending.

### 2.3 Genetic Driver Labels on Guideline Cards

Each "Prefer" and "Limit" chip on the morning/afternoon/evening cards should show which trait drives it:

- Small inline badge: `🧬 AMY1` or `🥛 Lactase`
- Tapping the badge expands the trait's meter detail inline (reuse `toggleTraitDetails` pattern)
- Makes the science feel connected to the output rather than decorative

### 2.4 Daily Guidelines — Reduce Repetition

Rules assigned to `period: 'all'` currently repeat in all three columns, creating visual noise. Options:

- Show "all-day" rules in a dedicated "All Day" strip above the three cards
- Or deduplicate by only showing each rule in its most relevant period

---

## Phase 3 — PDF Report Polish

The export exists but the output quality could match the in-app redesign above.

- Apply Signature Foods tier to the PDF "Recommended Foods" page
- Add "Your Top 3 Priorities" as a prominent boxed section on page 1 of the report
- Include macro range bar (not just a number)
- Ensure genetic trait meters render correctly in html2canvas capture

---

## Phase 4 — Genetic Data Completion & Batch Integration

_(In progress — user currently researching final batch)_

- Complete remaining genetic trait data and integrate into `genetics-frequencies.json`
- Run `scripts/validate-migration.js` after each batch
- Ensure all new traits have corresponding `GENE_META` entries and `DAILY_GUIDELINE_RULES` entries where appropriate
- Audit `getFoodExplanations()` to cover new traits

---

## Phase 5 — Polish & Technical Debt

- **Disclaimer consolidation**: currently appears in banner, footer, and modals — reduce to one well-placed instance + methodology modal
- **Accessibility**: ARIA labels on tabs, trait meters, and collapsible sections; keyboard navigation for the Foods filter tabs
- **Print CSS**: style the results content for `@media print` as a lightweight alternative to PDF export
- **Mobile layout audit**: Daily Guidelines 3-column grid collapses to 1 column on mobile — verify Foods card layout does the same gracefully
- **Remove unused code**: `blendGeneticAdaptations()` in `genetics.js` (legacy DNA mode path, superseded by Mendelian) — verify and remove if safe
- **`package.json` cleanup**: remove Express/Mapbox legacy entries that no longer apply to the static app

---

## Out of Scope (Removed)

- **Mapbox / Leaflet / Turf** — fully removed, no longer relevant
- **Design/ folder** — deleted

---

## Active Next.js Port

The Next.js app at `TEMPLATE WEBISTE/ZSFwO6hoZW2-1773296921747/` is the primary development target. See `ROADMAP.md` in that directory for its own detailed status and next steps.

_Note: Stripe + email capture previously marked out of scope. Now in scope as Phase 0.3 — the app needs a revenue layer and a minimal server is the correct path._
