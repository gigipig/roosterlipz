*different styles*
StyleURLCartoDB Lighthttps://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
CartoDB Darkhttps://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png
CartoDB Voyagerhttps://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png
Stamen Tonerhttps://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png
Stamen Watercolorhttps://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg
ESRI World Imageryhttps://server.arcgisonlin


  Future additions: Just add the gene to genetics.json and add one line to newGeneMeta in the UI.

  The app should now display all new genes when viewing a culture's genetic profile. Want to test it in the browser?




   Adding a New Gene - Streamlined Process
                                                                                                                                                                                                                                               Step 1: Add gene data to genetics.json (via the existing scripts/add_new_genes.js script or manually)
                                                                                                                                                                                                                                               Step 2: Add metadata to GENE_META in genetics.js (around line 15):
  my_new_gene: { icon: '🧬', ti tle: 'My New Gene', cssClass: 'my-gene' },

  Step 3: Add calculation config to GENERIC_GENE_CONFIG (around line 60):
  my_new_gene: {
    freqPath: 'allele_frequency_percent',  // path to frequency in genetic_adaptations
    inheritance: 'additive',
    thresholds: [
      { min: 50, phenotype: 'High Risk', rec: 'Recommendation for high risk' },
      { min: 25, phenotype: 'Moderate Risk', rec: 'Recommendation for moderate' },
      { min: 0, phenotype: 'Low Risk', rec: 'Recommendation for low' }
    ]
  }

  Step 4 (optional): Add CSS styling in style.css:
  .genetic-trait.my-gene {
    background: linear-gradient(135deg, #color1 0%, #color2 100%);
    color: #ffffff;
  }

  That's it - the gene will automatically:
  - Be calculated using Mendelian inheritance from grandparents
  - Display in the genetic profile with correct icon, title, and styling
  - Show phenotype, frequency, and recommendations

  The system now calculates ~20 genes for all populations (instead of just 4 for European ancestries). For genes that only appear in specific populations (like ALDH2 for East Asian, CREBRF for Polynesian), those still use custom
  calculation functions with population frequency thresholds.





CHANGES 

  1. Features to Make It More Insightful & Useable

  Immediate Value Additions
  ┌───────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │            Feature            │                                                                                          Why It Matters                                                                                          │
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Genetic trait explanations    │ Users see "Lactase Persistence: 72%" but may not understand what to do with that. Add actionable tooltips: "You likely tolerate dairy well. Consider including yogurt, kefir, and aged cheeses." │ -->
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Food sensitivity warnings     │ Highlight potential issues: "Your ancestry suggests lower alcohol metabolism (ALDH2) - you may experience flush response"                                                                        │ -->
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Meal plan generator           │ Translate recommendations into concrete weekly meal examples combining recommended proteins, staples, and cooking methods                                                                        │
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Nutrient gap analysis         │ Compare their ancestral diet profile against modern nutritional guidelines - show where traditional diets excel vs. where supplementation might help                                             │
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ ******"Why this food?" explanations │ For each recommended food, show why it appears - "Fermented dairy appears because your Nordic ancestry has 89% lactase persistence"                                                              │ -->
  └───────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  Engagement & Discovery
  ┌────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │                Feature                 │                                                      Why It Matters                                                       │
  ├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Comparison mode                        │ Let users compare two ancestry profiles side-by-side (e.g., their profile vs. a partner's, or two historical populations) │
  ├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "What if" scenarios                    │ "What if one grandparent was X instead?" - helps users explore sensitivity of results                                     │
  ├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Ancestry deep-dives                    │ Expandable sections for each ancestry showing historical context, migration patterns, and how the diet evolved            │ -->
  <!-- ├────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Genetic trait breakdown by grandparent │ Show which grandparent contributed which traits - makes inheritance tangible                                              │ -->
  └────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  Usability Improvements
  ┌───────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
  │                Feature                │                                    Why It Matters                                     │
  ├───────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Progress indicator during calculation │ The genetics calculations are complex - show users something is happening             │ -->
  ├───────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Results export (PDF/image)            │ Users want to save/share their results                                                │ -->
  ├───────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Simplified "key takeaways" summary    │ Before the detailed breakdown: "Your top 3 dietary strengths" and "3 things to watch" │ -->
  ├───────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Glossary/education section            │ Define terms like "lactase persistence", "AMY1 copy number" for lay audiences         │ -->
  └───────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
  ---
  2. Features to Make This Shippable

  Critical for Launch
  ┌──────────────────────────────────┬──────────┬────────────────────────────────────────────────────────────────────────────────────┐
  │             Feature              │ Priority │                                     Rationale                                      │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Mobile-first responsive redesign │ High     │ Current CSS has responsive elements but needs polish for thumb-friendly mobile use │ -->
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ Loading states & error handling  │ High     │ Graceful fallbacks if JSON fails to load, clear error messages                     │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ Accessibility (a11y)             │ High     │ ARIA labels, keyboard navigation, screen reader support, color contrast            │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Privacy policy & disclaimers     │ High     │ "This is educational, not medical advice" - legally necessary                      │ -->
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ SEO & meta tags                  │ Medium   │ Open Graph tags for social sharing, proper meta descriptions                       │
  ├──────────────────────────────────┼──────────┼────────────────────────────────────────────────────────────────────────────────────┤
  │ Analytics integration            │ Medium   │ Understand how users interact (what ancestries are most selected, drop-off points) │
  └──────────────────────────────────┴──────────┴────────────────────────────────────────────────────────────────────────────────────┘
  Differentiating Features
  ┌────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │          Feature           │                                               Why It Ships                                               │
  ├────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ DNA test import            │ Let users upload 23andMe/AncestryDNA raw data or paste ethnicity percentages directly - removes friction │
  ├────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Shareable results URLs     │ Generate unique links like yourapp.com/results/abc123 - viral potential                                  │ -->
  ├────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Email capture with results │ "Get your full report emailed" - builds user list for future features                                    │
  ├────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  <!-- │ Printable report           │ Clean, formatted PDF that looks professional                                                             │ -->
  └────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  Trust & Credibility
  ┌──────────────────────────────┬───────────────────────────────────────────────────────────────────────┐
  │           Feature            │                            Why It Matters                             │
  ├──────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  <!-- │ Sources & citations          │ Link genetic traits to actual studies (you have good data - cite it)  │ -->
  ├──────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  <!-- │ "How we calculate this" page │ Transparency about Hardy-Weinberg, Mendelian inheritance methodology  │ -->
  ├──────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ Expert review badge          │ If reviewed by a geneticist or nutritionist, display that prominently │
  ├──────────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ Version history / changelog  │ Shows the app is maintained and improving                             │
  └──────────────────────────────┴───────────────────────────────────────────────────────────────────────┘
  Monetization Paths (if relevant)
  ┌───────────────────┬──────────────────────────────────────────────────────────────────────────┐
  │       Model       │                              Implementation                              │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ Freemium          │ Basic results free, detailed trait breakdown / meal plans behind paywall │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ One-time purchase │ Full PDF report for $5-10                                                │
  ├───────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ Affiliate         │ Link to recommended foods on Amazon/Thrive Market with affiliate tags    │
  └───────────────────┴──────────────────────────────────────────────────────────────────────────┘