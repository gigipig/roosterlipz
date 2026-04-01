# Genetic Diet App: Competitor Workflow Analysis + Dev Instructions

---

## PART 1: Competitor Workflow Deep-Dive

### 1. Genomelink

**Core Model:** DNA upload → trait dashboard → paid reports

**Workflow:**

1. User downloads raw DNA file from 23andMe / AncestryDNA / MyHeritage
2. Uploads to Genomelink (takes ~1 min to process)
3. Lands on a **trait dashboard** organized into 5 categories: Physical Traits, Personality, Intelligence, Food & Nutrition, Fitness
4. 100 traits unlocked free; 352+ on paid "Unlimited" plan
5. Deeper **reports** (Nutrition Advice, Fitness, Skincare, etc.) are separate paid products
6. Nutrition Report specifically: analyzes 6 vitamins (A, B9, B12, C, D, E) → gives recommended intake levels → links to specific foods that match those needs
7. Combines genetic results with a **personal questionnaire score** for nutrition
8. Weekly new trait delivered to inbox (engagement loop)

**UI Philosophy:** Trait cards with a science reliability score shown per study. Transparency-first. Dashboard-based browsing rather than linear wizard.

**What's relevant to your app:**

- The "science reliability score" per insight is a trust-building pattern worth borrowing
- Combining questionnaire + genetics for nutrition scoring (your app uses ancestry blending, similar intent)
- Their food recommendation logic: identify nutrient gap from genetics → surface foods that fill that gap (mirrors your food tier concept)

---

### 2. Gene Food (mygenefood.com)

**Core Model:** DNA upload or test kit → scored into 1 of 20 diet types → meal plan

**Workflow:**

1. User uploads 23andMe/Ancestry raw data OR orders Gene Food test kit
2. Proprietary algorithm scores across: fat metabolism, carbohydrate tolerance, histamine clearance, MTHFR status, cholesterol absorption, ApoE status, lactose/wheat sensitivity
3. Each gene is weighted by a "Science Grade" (evidence quality rating)
4. Output: assigned to **one of 20 named diet types** (e.g., Okinawa-style, Mediterranean, low-fat, etc.)
5. Results include: Diet Type + 2-week meal plan + shopping list + micronutrient reports
6. Premium add-ons: Keto Score, methylation, sleep chronotype, APOE, uric acid, cannabis metabolism
7. Results available in ~5-15 minutes

**UI Philosophy:** Clean, outcome-first. The "Diet Type" is the hero result — a named, memorable identity. Everything else (meal plan, food lists, health reports) flows from it. Not overwhelming.

**What's most relevant to your app:**

- **Named diet type as hero output** — instead of raw scores, give users a memorable label/identity. This is the single most compelling UX pattern here.
- Polygenic scoring (multiple genes weighted by evidence strength) rather than single-gene logic — your Mendelian pipeline should present results similarly: blended, not binary
- The "20 diet types" model maps well to your ancestry blending: the blended ancestry profile could map to a named dietary archetype

---

### 3. Viome

**Core Model:** Physical test kit (stool/saliva/blood) → lab analysis → health scores + food tiers + supplements

**Workflow:**

1. User orders kit, collects samples at home, mails back
2. Lab uses **metatranscriptomics (RNA analysis)** — not DNA; captures what gut microbes are _actively doing_, not just what genes exist
3. AI algorithms cross-reference against Viome's database + user questionnaire
4. Results (2-3 weeks) delivered via smartphone app:
   - 50+ health scores (Gut Health, Inflammatory Activity, Metabolic Fitness, Biological Age, etc.)
   - Food list for 370+ foods categorized as: **Superfoods / Enjoy / Minimize / Avoid**
   - Each food recommendation includes a _reason_ (e.g., "boosts TMA production in your microbiome")
   - Custom supplement stack generated from results
5. Subscription model: monthly supplement delivery + annual retest

**UI Philosophy:** Score-first dashboard. Big, legible health scores as entry point. Food tiers are the actionable output. Explanations are accessible (not clinical). Very polished mobile UI.

**What's most relevant to your app:**

- **4-tier food system (Superfood/Enjoy/Minimize/Avoid)** — this is Viome's core output format and a proven UX pattern. If you replace your 4-tier with Top 5-10 foods, consider still keeping _some_ avoid/limit signal, as that's high-value information
- "Reason per food recommendation" pattern — clicking a food shows _why_ it's recommended. This is worth implementing even in simplified form
- Health scores as entry point before food details — macro-to-micro presentation order

---

### 4. Nutrition Heritage Report (Athletigen)

**Core Model:** DNA upload → ancestral diet mapping → nutrient optimization

This is the closest conceptual match to your app. Athletigen specifically maps ancestry to ancestral food patterns and optimizes from there. Limited public detail on exact workflow, but:

- Input: raw DNA from standard providers
- Focuses on what foods _your DNA ancestry_ means for digestion and nutrient absorption
- Outputs: heritage-based food guidance + nutrient reports
- Positioned as "understand what your ancestral DNA means for the foods your relatives digest optimally"

**What's relevant:** Validation that your concept (ancestry → diet) is a recognized product category with a real audience.

---

### Cross-App Pattern Summary

| Pattern                 | Genomelink            | Gene Food         | Viome               | Your App                        |
| ----------------------- | --------------------- | ----------------- | ------------------- | ------------------------------- |
| Input method            | DNA upload            | DNA upload / kit  | Physical kit        | Grandparent nationality / DNA % |
| Hero output             | Trait dashboard       | Named diet type   | Health scores       | Blended ancestry profile        |
| Food output             | Nutrient-linked foods | Meal plan         | 4-tier food list    | 4-tier (→ Top 10?)              |
| Genetics depth          | SNP traits            | Polygenic scoring | RNA expression      | Mendelian + category scores     |
| Why this matters        | Implicit              | Implicit          | Implicit            | Missing (proposed addition)     |
| Questionnaire layer     | Yes                   | No                | Yes                 | No                              |
| Subscription/engagement | Weekly traits         | No                | Monthly supplements | No (bookmarks only)             |

---

## PART 2: Instructions for Separate Claude Instance

**Context:** This is a genetic ancestry-based diet app. Users input grandparent nationalities (Family Mode) or ancestral percentages (DNA Mode). The app blends dietary data from `cultures.json` and `diets.json`, runs Mendelian genetics calculations, and outputs diet recommendations + food lists. The full workflow blueprint is in the attached document.

The developer has made these decisions:

- ✅ Keep the Mendelian genetics pipeline (defining feature, not to be simplified)
- ✅ Remove recipes section entirely
- ✅ Replace 4-tier food browse with Top 5-10 highlighted foods (possibly keep an avoid/limit list alongside)
- ✅ Add a "why this matters" explanation to the onboarding/entry flow
- ⏸ No follow-up health concern prompt at this stage
- ⏸ localStorage stays for now; backend migration later

---

### Task A: "Why This Matters" — Onboarding Hook

**Goal:** Write copy and design guidance for a brief explanation shown to users before or during mode selection (Family Mode vs DNA Mode).

**Requirements:**

- Must answer: Why does ancestry affect what I should eat?
- Should be 2-4 sentences max, non-clinical language
- Should create motivation to complete the grandparent input (which requires effort)
- Should NOT overstate scientific certainty — ancestry-based diet is an informed approach, not medical advice
- Consider whether this is: a static intro panel, a tooltip, an animated onboarding screen, or a collapsible "learn more" section
- Provide 2-3 copy variants at different tones (warm/personal, scientific-lite, curiosity-driven)

---

### Task B: Genetics Pipeline — Presentation Redesign

**Goal:** The Mendelian genetics calculation is complex but the _presentation_ of results may be intimidating. Suggest how to surface genetics results accessibly without dumbing them down.

**Current outputs from the pipeline:**

- Category scores (from `calculateCategoryScores()`)
- Key Takeaways
- Trait meters
- Nutrient gaps (from `analyzeGeneticTraits()`)

**Requirements:**

- Propose a presentation hierarchy: what does the user see first, second, third?
- Recommend whether trait meters should be visible by default or behind a "show detail" toggle
- Suggest language patterns for explaining a trait result (e.g., "Your ancestry suggests a higher tendency toward X — here's what that means for your diet")
- Inspired by Gene Food's pattern: lead with a memorable summary label or insight, then depth
- The genetics section should feel like a _feature_, not a warning label

---

### Task C: Food Output Redesign

**Goal:** Replace the 4-tier food browse with a more focused Top Foods display.

**Current structure:** Recommended / Watch / Limit / (4th tier) — browsable list

**Proposed change:** Show Top 5-10 foods prominently. Developer is open to keeping a small "Foods to Limit" list alongside.

**Requirements:**

- Propose the visual layout for Top Foods (cards? ranked list? grid?)
- Each food entry should ideally show: food name, why it's recommended (one line), and which ancestry/nutrient it maps to
- Suggest whether "Foods to Limit" should appear on the same screen or be a separate toggle/tab
- Consider mobile-first layout
- Reference Viome's food tier UX as inspiration (Superfoods prominently displayed, Avoid as secondary list)
- Output should feel actionable and motivating, not clinical

---

### General Design Principles to Follow Across All Tasks

- **Lead with identity, not data.** Users connect with "your ancestry suggests a Mediterranean-leaning diet" more than "your blended score is 0.73."
- **Macro before micro.** Show the big insight first, detail on request.
- **Avoid list** has high perceived value — don't remove it entirely even if you simplify the food tiers.
- **Tone:** Warm, curious, evidence-informed. Not clinical. Not woo-woo.
- The app's unique angle is **ancestry as the input** — every screen should remind users why their heritage matters here.
