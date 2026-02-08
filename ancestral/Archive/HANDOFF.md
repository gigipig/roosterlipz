# Ancestral Diet Explorer - Development Handoff

## Session Summary (January 2026)

### Completed Features

#### 1. "Why This Food?" Explanations
- **Files**: `js/genetics.js`, `js/diet.js`, `style.css`
- Foods with genetic connections show an icon + green border
- Hover reveals tooltip explaining the genetic link
- `FOOD_GENETICS_MAP` contains ~150 food-to-gene mappings
- `getFoodExplanations()` function returns genetic context for any food

#### 2. Progress Indicator During Calculation
- **Files**: `index.html`, `js/app.js`, `style.css`
- Loading overlay with spinner animation
- Text updates as calculation progresses
- Functions: `showLoading()`, `hideLoading()`, `updateLoadingText()`

#### 3. Glossary/Education Section
- **Files**: `js/genetics.js`, `style.css`
- `GENE_GLOSSARY` constant with plain-English definitions for ~15 genetic terms
- Info icons (ℹ️) next to each genetic trait in results
- Hover shows definition, gene name, inheritance pattern

#### 4. Results Export (Image)
- **Files**: `index.html`, `js/app.js`, `style.css`
- Uses html2canvas library (CDN)
- "Save Results" button exports PNG with date-stamped filename
- Function: `exportResultsAsImage()`

#### 5. Privacy/Disclaimers
- **Files**: `index.html`, `style.css`
- Disclaimer banner at top of results
- Footer disclaimer text
- Clear "educational, not medical advice" messaging

#### 6. Methodology Modal ("How We Calculate")
- **Files**: `index.html`, `js/app.js`, `style.css`
- Modal explaining Hardy-Weinberg equilibrium and Mendelian inheritance
- Plain-English explanations with visual steps
- Accessible via "How We Calculate" button or footer link
- Functions: `showMethodologyModal()`, `hideMethodologyModal()`

---

### Remaining Priority Items (marked ***** in things.md)

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Comparison mode** | Side-by-side ancestry profile comparison | Medium-High |
| **Loading states & error handling** | Graceful fallbacks if JSON fails | Medium |
| **Accessibility (a11y)** | ARIA labels, keyboard nav, color contrast | Medium |
| **Sources & citations** | Link traits to actual studies | Medium (depends on doc format) |

### User Plans to Implement Later
- Key takeaways summary ("Top 3 strengths, 3 things to watch")
- Meal plan generator

---

### Architecture Overview

```
index.html          - Main HTML structure, modals
style.css           - All styling
js/
  app.js            - Event handlers, init, loading/modal functions
  genetics.js       - Gene calculations, FOOD_GENETICS_MAP, GENE_GLOSSARY, rendering
  diet.js           - Diet blending, food rendering with genetic tooltips
  data.js           - Data loading
  ui.js             - UI utilities
  user.js           - User profile/localStorage
  onboarding.js     - First-time user wizard
```

### Key Data Structures

**FOOD_GENETICS_MAP** (genetics.js:13-266)
```javascript
{
  "dairy": ["lactase_persistence"],
  "salmon": ["pufa_metabolism", "vitamin_d_metabolism"],
  // ~150 entries
}
```

**GENE_GLOSSARY** (genetics.js:415-511)
```javascript
{
  lactase_persistence: {
    term: 'Lactase Persistence',
    definition: '...',
    gene: 'LCT gene',
    inheritance: 'Dominant - one copy...'
  },
  // ~15 entries
}
```

**GENE_META** (genetics.js:553+)
- Icons, titles, CSS classes for each gene
- Used for display in genetic trait cards

---

### Next Session: Sources & Citations

User mentioned having research docs scattered in folders. To implement:

1. **Gather docs**: User will provide location of research documents
2. **Structure citations**: Could be:
   - Inline citations per trait (add `sources` array to GENE_GLOSSARY)
   - Dedicated "Sources" section at bottom of results
   - Separate citations page
3. **Implementation**: Add citation data, render with links to studies

Questions to ask user:
- What format are the research docs? (PDFs, URLs, markdown, BibTeX?)
- Prefer inline citations or separate section?
- Should citations link to original papers?

---

### Technical Notes

- **Underscore handling**: `normalizeFood()` converts `fermented_fish` to `fermented fish` for matching
- **html2canvas**: Loaded via CDN, used for export feature
- **Modal pattern**: Uses `.visible` class toggle, closes on overlay click or Escape key
- **Loading states**: Use `setTimeout` to allow UI to render before heavy calculations

---

### Testing Checklist

- [ ] Select 4 grandparents → loading spinner → results with genetic tooltips
- [ ] Hover foods with green border → see genetic explanation
- [ ] Hover ℹ️ icons on traits → see glossary definition
- [ ] Click "Save Results" → downloads PNG
- [ ] Click "How We Calculate" → modal opens
- [ ] Press Escape or click overlay → modal closes
- [ ] Disclaimer banner visible at top of results
