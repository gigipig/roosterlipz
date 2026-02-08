# Ancestral Diet Explorer — Product Roadmap

## Goal
Transform the tool into a product that sells a paid PDF report detailing personalized genetic diet recommendations.

---

## Phase 1: Landing Page Restructure
Convert the current tool-first layout into a product page flow:

1. **Hero Section** — "Unlock Your Ancestral Diet" + CTA button
2. **How It Works** — 3-step visual (Pick ancestry → Get genetics → Get diet plan)
3. **Features Section** — Cards showing what's in the report
4. **Calculator** — The existing tool (free tier)
5. **Results** — Tabbed/stepped, with free preview + upgrade CTA
6. **Pricing** — Free vs Premium PDF comparison
7. **FAQ** — Inline accordion (move from modal)
8. **Footer** — Privacy, methodology link, contact

## Phase 2: Results UX Overhaul
- Replace wall-of-text results with tabbed sections: Genetics → Diet → Foods → Recommendations
- Add "Your Genetic Profile" summary card at top of results
- Risk/benefit badges on traits (green=strength, amber=consideration, red=sensitivity)
- Food category cards grouped by type instead of flat lists
- Actionable recommendations ("Based on your FADS variant, eat wild-caught fish 3x/week")
- Accordion for verbose gene details
- Comparison table: your traits vs population averages

## Phase 3: PDF Generation
Structure:
1. Cover page — name, ancestry breakdown, date
2. Genetic Profile Summary — top traits with badges
3. Detailed Trait Analysis — one trait per section, variant probability, practical meaning
4. Personalized Diet Plan — daily macro targets, recommended foods with portions, foods to limit
5. Weekly Meal Framework — meal-type guidance (not full recipes)
6. Supplement Considerations — based on absorption genetics (B12, D, folate, iron)
7. Sources & Methodology — scientific citations
8. Disclaimer

Library: jsPDF + html2canvas (staying vanilla JS for now)

## Phase 4: Monetization
- Tiered results: free preview (summary + top traits) vs paid full report
- Stripe or Lemon Squeezy integration for payment
- Email capture before PDF delivery
- Pricing section on landing page

## Phase 5: Polish
- Testimonials / social proof section
- 23andMe/AncestryDNA import helper / guide
- Print-optimized CSS
- Accessibility improvements (ARIA labels)
- Remove dead dependencies (Mapbox, unused Design/ folder)

## Technical Debt
- Consider React/Next.js + shadcn/ui migration (prototype exists in Design/)
- Remove duplicate onboarding (wizard duplicates sidebar form)
- Consolidate disclaimers to one well-placed instance
- Clean up unused Mapbox/Leaflet/Turf dependencies
