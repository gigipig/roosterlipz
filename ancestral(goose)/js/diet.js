/**
 * Diet module - diet blending and display functions
 */

/**
 * Render a food item with genetic tooltip
 * @param {string} food - Food name
 * @param {Object} mendelianGenetics - User's genetic profile (optional)
 * @returns {string} HTML for the food item
 */
function renderFoodItem(food, mendelianGenetics) {
  if (!mendelianGenetics) {
    return `<span class="food-item">${food}</span>`;
  }

  const explanations = getFoodExplanations(food, mendelianGenetics);

  if (explanations.length === 0) {
    return `<span class="food-item">${food}</span>`;
  }

  // Build tooltip content
  const tooltipLines = explanations.map(exp =>
    `${exp.icon} ${exp.title}: ${exp.phenotype}${exp.percentage ? ` (${exp.percentage})` : ''} - ${exp.shortReason}`
  ).join('&#10;');

  // Add visual indicator that this food has genetic info
  const topTrait = explanations[0];

  return `<span class="food-item has-genetic-info" data-tooltip="${tooltipLines}" title="${tooltipLines}">
    <span class="food-genetic-indicator">${topTrait.icon}</span>${food}
  </span>`;
}

/**
 * Render a list of food items with genetic tooltips
 * @param {string[]} foods - Array of food names
 * @param {Object} mendelianGenetics - User's genetic profile (optional)
 * @param {number} limit - Max number of items to show
 * @returns {string} HTML for the food list
 */
function renderFoodList(foods, mendelianGenetics, limit = 12) {
  return foods.slice(0, limit).map(f => renderFoodItem(f, mendelianGenetics)).join('');
}

/**
 * Blend diets from multiple regions
 * @param {string[]} regionIds - Array of region IDs
 * @param {number[]} weights - Array of weights for each region
 * @returns {Object|null} Blended diet data
 */
function blendDiets(regionIds, weights) {
  const normalizedWeights = weights.length === regionIds.length
    ? normalizeWeights(weights)
    : Array(regionIds.length).fill(1 / regionIds.length);

  // Merge duplicate regionIds by summing their weights so e.g. two Algerian
  // grandparents collapse to a single 50% entry rather than two 25% entries.
  const regionWeightMap = {};
  regionIds.forEach((id, i) => {
    regionWeightMap[id] = (regionWeightMap[id] || 0) + normalizedWeights[i];
  });
  const mergedIds = Object.keys(regionWeightMap);
  const mergedWeights = mergedIds.map(id => regionWeightMap[id]);

  // Build aligned arrays, dropping any id with missing data
  const entries = mergedIds
    .map((id, i) => ({ diet: getDietById(id), geo: getGeoById(id), weight: mergedWeights[i] }))
    .filter(e => e.diet !== null && e.geo !== null);

  const diets = entries.map(e => e.diet);
  const geos = entries.map(e => e.geo);
  const finalWeights = entries.map(e => e.weight);

  if (diets.length === 0) return null;

  // Calculate blended macros using merged weights
  const blendedMacros = diets.reduce((acc, diet, idx) => {
    const weight = finalWeights[idx];
    return {
      carbs_pct: acc.carbs_pct + diet.macros.carbs_pct * weight,
      protein_pct: acc.protein_pct + diet.macros.protein_pct * weight,
      fat_pct: acc.fat_pct + diet.macros.fat_pct * weight
    };
  }, { carbs_pct: 0, protein_pct: 0, fat_pct: 0 });

  // Round
  Object.keys(blendedMacros).forEach(key => {
    blendedMacros[key] = Math.round(blendedMacros[key]);
  });

  // Common foods: foods appearing in more than one distinct region.
  // Using a count of distinct regions rather than a weighted sum, so that
  // a 50/50 two-region blend doesn't incorrectly classify all foods as common.
  const foodRegionCount = {};
  diets.forEach(diet => {
    const regionFoods = new Set([...diet.staples, ...diet.common_foods]);
    regionFoods.forEach(food => {
      foodRegionCount[food] = (foodRegionCount[food] || 0) + 1;
    });
  });

  const commonFoods = diets.length > 1
    ? Object.entries(foodRegionCount)
        .filter(([_, count]) => count >= 2)
        .map(([food]) => food)
    : Object.keys(foodRegionCount);

  // Collect all proteins, fats, herbs
  const allProteins = [...new Set(diets.flatMap(d => d.proteins))];
  const allFats = [...new Set(diets.flatMap(d => d.fats))];
  const allHerbs = [...new Set(diets.flatMap(d => d.herbs_spices))];
  const allCooking = [...new Set(diets.flatMap(d => d.cooking_methods))];

  return {
    diets,
    geos,
    weights: finalWeights,
    blendedMacros,
    commonFoods,
    allProteins,
    allFats,
    allHerbs,
    allCooking
  };
}

/**
 * Show diet panel for a single region
 * @param {Object} diet - Diet data
 * @param {Object} geo - Geographic data
 */
function showDietPanel(diet, geo) {
  const content = document.getElementById('diet-content');

  content.innerHTML = `
    <h2>${geo.name}</h2>
    <div class="subtitle">${geo.culture}</div>

    <div class="diet-section">
      <p>${diet.diet_signature}</p>
    </div>

    <div class="diet-section">
      <h3>Macronutrient Profile</h3>
      <div class="macro-bar">
        <div class="macro-segment macro-carbs" style="width: ${diet.macros.carbs_pct}%">
          ${diet.macros.carbs_pct}% Carbs
        </div>
        <div class="macro-segment macro-protein" style="width: ${diet.macros.protein_pct}%">
          ${diet.macros.protein_pct}% Protein
        </div>
        <div class="macro-segment macro-fat" style="width: ${diet.macros.fat_pct}%">
          ${diet.macros.fat_pct}% Fat
        </div>
      </div>
    </div>

    <div class="diet-section">
      <h3>Staple Foods</h3>
      <div class="food-list">
        ${diet.staples.map(s => `<span class="food-item">${s}</span>`).join('')}
      </div>
    </div>

    <div class="diet-section">
      <h3>Common Foods</h3>
      <div class="food-list">
        ${diet.common_foods.slice(0, 8).map(f => `<span class="food-item">${f}</span>`).join('')}
      </div>
    </div>

    <div class="diet-section">
      <h3>Protein Sources</h3>
      <div class="food-list">
        ${diet.proteins.map(p => `<span class="food-item">${p}</span>`).join('')}
      </div>
    </div>

    <div class="diet-section">
      <h3>Primary Fats</h3>
      <div class="food-list">
        ${diet.fats.map(f => `<span class="food-item">${f}</span>`).join('')}
      </div>
    </div>

    <div class="diet-section">
      <h3>Herbs & Spices</h3>
      <div class="food-list">
        ${diet.herbs_spices.map(h => `<span class="food-item">${h}</span>`).join('')}
      </div>
    </div>

    <div class="diet-section">
      <h3>Cooking Methods</h3>
      <div class="food-list">
        ${diet.cooking_methods.map(m => `<span class="food-item">${m}</span>`).join('')}
      </div>
    </div>

    <div class="diet-section">
      <h3>Typical Dishes</h3>
      <p>${diet.typical_dishes.join(', ')}</p>
    </div>

    ${Object.keys(diet.modern_substitutes).length > 0 ? `
      <div class="diet-section">
        <h3>Modern Substitutes</h3>
        ${Object.entries(diet.modern_substitutes).map(([k, v]) =>
          `<p><strong>${k}:</strong> ${v}</p>`
        ).join('')}
      </div>
    ` : ''}

    ${renderGeneticAdaptations(diet)}
  `;
}

/**
 * Generate a two-part diet archetype label from ancestry + top genetic category.
 * e.g. "Northern European · Fat-Adaptive" or "Mediterranean · Carb-Adaptive"
 * @param {Object} blended - Blended diet object
 * @param {Object} mendelianGenetics - Mendelian genetics results
 * @returns {string|null}
 */
function generateDietArchetype(blended, mendelianGenetics) {
  if (!blended || !blended.geos || blended.geos.length === 0) return null;

  // Dominant ancestry by weight
  let topIdx = 0;
  blended.weights.forEach((w, i) => { if (w > blended.weights[topIdx]) topIdx = i; });
  const geoLabel = blended.geos[topIdx].name.split(' ').slice(0, 2).join(' ');

  // Top genetic category
  const metabolicMap = {
    carb_metabolism:    'Carb-Adaptive',
    fat_metabolism:     'Fat-Adaptive',
    vitamin_absorption: 'Nutrient-Efficient',
    food_tolerance:     'Tolerant Metaboliser'
  };

  if (typeof calculateCategoryScores === 'function' && mendelianGenetics) {
    const categories = calculateCategoryScores(mendelianGenetics);
    const top = categories.length > 0
      ? [...categories].sort((a, b) => b.score - a.score)[0]
      : null;
    if (top) {
      const metabolicLabel = metabolicMap[top.id] || top.title;
      return `${geoLabel} · ${metabolicLabel}`;
    }
  }

  return `${geoLabel} Heritage Profile`;
}

/**
 * Render profile summary card with top trait badges
 * @param {Object} mendelianGenetics - Mendelian genetics results
 * @param {string} ancestryList - Formatted ancestry string
 * @param {Object} [blended] - Optional blended diet object for archetype generation
 * @returns {string} HTML for the profile summary card
 */
function renderProfileSummary(mendelianGenetics, ancestryList, blended) {
  const legacyKeyMap = {
    lactase: 'lactase_persistence',
    amy1: 'starch_digestion',
    fads: 'pufa_metabolism',
    slc24a5: 'vitamin_d_metabolism',
    aldh2: 'alcohol_metabolism',
    crebrf: 'polynesian_energy_storage',
    cpt1a: 'arctic_fat_metabolism',
    edar: 'edar_adaptation',
    altitude: 'altitude_adaptation_epas1'
  };

  // Gather traits with their meter info and sort by value descending
  const traits = [];
  if (mendelianGenetics) {
    Object.keys(mendelianGenetics).forEach(key => {
      const trait = mendelianGenetics[key];
      let meta = trait._meta;
      if (!meta) {
        const metaKey = legacyKeyMap[key] || key;
        meta = (typeof GENE_META !== 'undefined') ? GENE_META[metaKey] : null;
      }
      if (!meta) return;
      const { value, statusLabel, statusClass } = getTraitMeterInfo(key, trait);
      traits.push({ icon: meta.icon || '🧬', title: meta.title || key, statusLabel, statusClass, value });
    });
  }

  // Pick top 4 by highest value
  traits.sort((a, b) => b.value - a.value);
  const topTraits = traits.slice(0, 4);

  const badgesHtml = topTraits.map(t =>
    `<span class="profile-stat-badge ${t.statusClass}">${t.icon} ${t.statusLabel} ${t.title}</span>`
  ).join('');

  const archetype = generateDietArchetype(blended, mendelianGenetics);

  return `
    <div class="profile-summary-card">
      <h2>Your Personalised Diet</h2>
      ${archetype ? `<div class="diet-archetype-label">${archetype}</div>` : ''}
      <div class="subtitle">${ancestryList}</div>
      ${badgesHtml ? `<div class="profile-stat-badges">${badgesHtml}</div>` : ''}
    </div>
  `;
}

/**
 * Render key genetic insights for the Overview tab.
 * Shows top 3 strengths + top 3 watch items in a 2-column card grid.
 * @param {Object} genetics - Mendelian genetics result object
 * @returns {string} HTML
 */
function renderKeyInsights(genetics) {
  if (!genetics) return '';

  const { strengths, watchItems } = analyzeGeneticTraits(genetics);
  if (strengths.length === 0 && watchItems.length === 0) return '';

  const strengthCards = strengths.slice(0, 3).map(s => `
    <div class="insight-card insight-card--strength">
      <span class="insight-card-icon">${s.icon}</span>
      <div class="insight-card-body">
        <div class="insight-card-title">${s.title}</div>
        <div class="insight-card-detail">${s.detail}</div>
      </div>
      <span class="insight-badge--strength">Strength</span>
    </div>`).join('');

  const watchCards = watchItems.slice(0, 3).map(w => `
    <div class="insight-card insight-card--watch">
      <span class="insight-card-icon">${w.icon}</span>
      <div class="insight-card-body">
        <div class="insight-card-title">${w.title}</div>
        <div class="insight-card-detail">${w.detail}</div>
      </div>
      <span class="insight-badge--watch">Watch</span>
    </div>`).join('');

  return `
    <div class="key-insights-section">
      <div class="insights-grid">
        ${strengthCards ? `<div class="insights-column">
          <div class="insights-column-label insights-column-label--strength">Genetic Strengths</div>
          ${strengthCards}
        </div>` : ''}
        ${watchCards ? `<div class="insights-column">
          <div class="insights-column-label insights-column-label--watch">Watch Items</div>
          ${watchCards}
        </div>` : ''}
      </div>
    </div>`;
}

/**
 * Render the ancestry mix as horizontal progress bars for the Overview tab.
 * @param {Object} blended - Blended diet object with geos + weights
 * @returns {string} HTML
 */
function renderAncestryBlend(blended) {
  if (!blended || !blended.geos || blended.geos.length === 0) return '';

  const SEGMENT_COLORS = [
    { bg: '#c8a96e', text: '#1a1510' },
    { bg: '#1db954', text: '#0a1a0f' },
    { bg: '#4a9eff', text: '#0a1220' },
    { bg: '#c96eb0', text: '#1a0a18' }
  ];

  const segments = blended.geos.map((geo, idx) => {
    const pct = Math.round(blended.weights[idx] * 100);
    const color = SEGMENT_COLORS[idx % SEGMENT_COLORS.length];
    return `<div class="ancestry-segment" style="width:${pct}%;background:${color.bg};" title="${geo.name} ${pct}%"></div>`;
  }).join('');

  const legend = blended.geos.map((geo, idx) => {
    const pct = Math.round(blended.weights[idx] * 100);
    const color = SEGMENT_COLORS[idx % SEGMENT_COLORS.length];
    return `
      <div class="ancestry-legend-item">
        <span class="ancestry-legend-dot" style="background:${color.bg};"></span>
        <span class="ancestry-legend-name">${geo.name}</span>
        <span class="ancestry-legend-pct">${pct}%</span>
      </div>`;
  }).join('');

  return `
    <div class="ancestry-blend-section">
      <h4>Your Ancestry Mix</h4>
      <div class="ancestry-segment-bar">${segments}</div>
      <div class="ancestry-legend">${legend}</div>
    </div>`;
}

// ============================================================================
// FOODS SECTION — REDESIGNED (Viome-inspired tiered system)
// ============================================================================

/**
 * Regex to detect "watch/limit" signals in getShortReason() output.
 * Any shortReason containing these keywords → Tier 3 (Use with Awareness).
 */
const WATCH_KEYWORDS = /\b(limit|watch|monitor|avoid|be cautious|may taste bitter)\b/i;

/**
 * Sub-classifier for the strongest watch signals within WATCH_KEYWORDS.
 * Foods with these keywords AND no positive reasons → Tier 4 (Limit).
 */
const STRONG_WATCH_KEYWORDS = /\b(limit|avoid|restrict)\b/i;

/**
 * Health concern configuration for user-selectable flags.
 * Each concern has an id, icon, label, and list of keyword substrings to match against food names.
 */
const HEALTH_CONCERN_CONFIG = [
  {
    id: 'heart_health',
    icon: '🫀',
    label: 'Heart Health',
    keywords: ['pork', 'bacon', 'lard', 'butter', 'cream', 'sausage', 'chorizo', 'salami', 'prosciutto', 'pancetta', 'liver', 'kidney', 'suet', 'ghee', 'tallow', 'fatback']
  },
  {
    id: 'blood_pressure',
    icon: '🧂',
    label: 'Blood Pressure',
    keywords: ['salt', 'cured', 'smoked', 'pickled', 'preserved', 'soy sauce', 'miso', 'anchov', 'caper', 'brine', 'kimchi', 'sauerkraut', 'jerky', 'feta', 'halloumi', 'olives']
  },
  {
    id: 'blood_sugar',
    icon: '🍬',
    label: 'Blood Sugar',
    keywords: ['white rice', 'white bread', 'pasta', 'sugar', 'honey', 'syrup', 'noodle', 'flour', 'pastry', 'baklava', 'sweet']
  },
  {
    id: 'weight',
    icon: '⚖️',
    label: 'Weight Management',
    keywords: ['fried', 'lard', 'cream', 'butter', 'fatback', 'tallow', 'ghee', 'suet']
  },
  {
    id: 'digestive',
    icon: '🫁',
    label: 'Digestive Issues',
    keywords: ['cabbage', 'broccoli', 'cauliflower', 'bean', 'lentil', 'chickpea', 'onion', 'garlic', 'leek', 'dairy', 'wheat', 'rye']
  }
];

/**
 * Score a food into Tier 1/2/3/4 based on ancestral origin + genetic match.
 * Tier 1 = ancestral staple WITH at least one positive genetic match → Signature Food
 * Tier 2 = in blended diet with neutral/positive genetics, or no genetic info
 * Tier 3 = mild watch-keyword genetic reason and no positive reasons
 * Tier 4 = strong watch-keyword (limit/avoid/restrict) and no positive reasons
 *
 * @param {string} food
 * @param {Object} mendelianGenetics
 * @param {boolean} isAncestral - true if food appears in blended.commonFoods
 * @returns {{ tier: number, positiveReasons: Array, watchReasons: Array, strongWatchReasons: Array, mildWatchReasons: Array }}
 */
function scoreFoodForUser(food, mendelianGenetics, isAncestral) {
  const explanations = mendelianGenetics
    ? getFoodExplanations(food, mendelianGenetics)
    : [];

  const positiveReasons = explanations.filter(e => !WATCH_KEYWORDS.test(e.shortReason));
  const watchReasons = explanations.filter(e => WATCH_KEYWORDS.test(e.shortReason));

  const strongWatchReasons = watchReasons.filter(e => STRONG_WATCH_KEYWORDS.test(e.shortReason));
  const mildWatchReasons   = watchReasons.filter(e => !STRONG_WATCH_KEYWORDS.test(e.shortReason));

  let tier;
  if (strongWatchReasons.length > 0 && positiveReasons.length === 0)    tier = 4;
  else if (mildWatchReasons.length > 0 && positiveReasons.length === 0) tier = 3;
  else if (isAncestral && positiveReasons.length > 0)                   tier = 1;
  else                                                                   tier = 2;

  return { tier, positiveReasons, watchReasons, strongWatchReasons, mildWatchReasons };
}

/**
 * Find which of the user's ancestral regions a food comes from.
 * @param {string} food
 * @param {Object} blended
 * @returns {string[]} Array of region names that include this food
 */
function getFoodAncestries(food, blended) {
  const norm = food.toLowerCase().trim();
  const found = [];
  blended.diets.forEach((diet, idx) => {
    const allFoodsInDiet = [
      ...(diet.staples || []),
      ...(diet.common_foods || []),
      ...(diet.proteins || []),
      ...(diet.fats || []),
      ...(diet.herbs_spices || [])
    ];
    if (allFoodsInDiet.some(f => f.toLowerCase().trim() === norm)) {
      found.push(blended.geos[idx].name);
    }
  });
  return found;
}

/**
 * Render a single food chip with always-visible colored dot and inline reason.
 * Tier 2 → green dot. Tier 3 → amber dot. No genetics → plain chip.
 * @param {string} food
 * @param {{ tier: number, positiveReasons: Array, watchReasons: Array }} score
 * @returns {string} HTML
 */
function renderFoodChip(food, score) {
  const { tier, positiveReasons, watchReasons, strongWatchReasons } = score;
  const flags = getHealthConcernFlags(food);
  const flagsHtml = flags.map(f => `<span class="health-flag">${f.icon} ${f.label}</span>`).join('');

  if (tier === 4) {
    const reason = (strongWatchReasons?.[0] || watchReasons[0])?.shortReason || '';
    return `
      <span class="food-chip food-chip--limit">
        <span class="food-dot food-dot--red"></span>
        <span class="food-chip-content">
          <span class="food-chip-name">${food}</span>
          ${reason ? `<span class="food-chip-reason">${reason}</span>` : ''}
          ${flagsHtml}
        </span>
      </span>`;
  }

  if (tier === 3 && watchReasons.length > 0) {
    const reason = watchReasons[0].shortReason;
    return `
      <span class="food-chip food-chip--watch">
        <span class="food-dot food-dot--amber"></span>
        <span class="food-chip-content">
          <span class="food-chip-name">${food}</span>
          <span class="food-chip-reason">${reason}</span>
          ${flagsHtml}
        </span>
      </span>`;
  }

  if (positiveReasons.length > 0) {
    const reason = positiveReasons[0].shortReason;
    return `
      <span class="food-chip food-chip--positive">
        <span class="food-dot food-dot--green"></span>
        <span class="food-chip-content">
          <span class="food-chip-name">${food}</span>
          <span class="food-chip-reason">${reason}</span>
          ${flagsHtml}
        </span>
      </span>`;
  }

  if (flagsHtml) {
    return `
      <span class="food-chip">
        <span class="food-chip-content">
          <span class="food-chip-name">${food}</span>
          ${flagsHtml}
        </span>
      </span>`;
  }

  return `<span class="food-chip">${food}</span>`;
}

/**
 * Render Tier 1 Signature Food cards.
 * These are ancestral staples that also have a confirmed positive genetic match.
 * @param {Object} blended
 * @param {Object} mendelianGenetics
 * @returns {string} HTML
 */
function renderSignatureFoods(blended, mendelianGenetics) {
  if (!mendelianGenetics) return '';

  const allFoods = [
    ...blended.commonFoods,
    ...blended.allProteins,
    ...blended.allFats,
    ...blended.allHerbs
  ];
  const seen = new Set();
  const signatureFoods = [];

  allFoods.forEach(food => {
    if (seen.has(food)) return;
    seen.add(food);
    const isAncestral = blended.commonFoods.includes(food);
    const score = scoreFoodForUser(food, mendelianGenetics, isAncestral);
    if (score.tier === 1) {
      const ancestries = getFoodAncestries(food, blended);
      signatureFoods.push({ food, score, ancestries });
    }
  });

  if (signatureFoods.length === 0) return '';

  // Cap at 8 cards
  const cards = signatureFoods.slice(0, 8);

  const cardHtml = cards.map(({ food, score, ancestries }) => {
    const ancestryBadges = ancestries.map(a =>
      `<span class="ancestry-badge">${a}</span>`
    ).join('');

    const traitItems = score.positiveReasons.slice(0, 3).map(r =>
      `<span class="signature-trait-item">
        <span class="signature-trait-dot"></span>
        <span>${r.icon} ${r.shortReason}</span>
      </span>`
    ).join('');

    return `
      <div class="signature-food-card">
        <div class="signature-food-top">
          <span class="signature-food-name">${food}</span>
          <span class="signature-star-badge">★ Superfood</span>
        </div>
        ${ancestryBadges ? `<div class="signature-food-ancestry">${ancestryBadges}</div>` : ''}
        ${traitItems ? `<div class="signature-food-traits">${traitItems}</div>` : ''}
      </div>`;
  }).join('');

  return `
    <div class="signature-foods-section">
      <div class="signature-foods-header">
        <div class="signature-foods-header-top">
          <h3>★ Superfoods</h3>
          <span class="signature-foods-count">${cards.length} matched</span>
        </div>
        <p class="signature-foods-subtitle">Ancestral staples confirmed by your genetic profile</p>
      </div>
      <div class="signature-foods-grid">${cardHtml}</div>
    </div>`;
}

/**
 * Render a tiered food chip list for a category.
 * Separates foods into Tier 2 (recommended) and Tier 3 (use with awareness).
 * @param {string[]} foods
 * @param {Object} mendelianGenetics
 * @param {boolean} isAncestralPool - true if these foods are from commonFoods
 * @returns {{ recommendedHtml: string, watchHtml: string }}
 */
function tieredFoodChips(foods, mendelianGenetics, isAncestralPool) {
  const recommended = [];
  const watch = [];
  const limit = [];

  foods.forEach(food => {
    const score = scoreFoodForUser(food, mendelianGenetics, isAncestralPool);
    if (score.tier === 4) {
      limit.push(renderFoodChip(food, score));
    } else if (score.tier === 3) {
      watch.push(renderFoodChip(food, score));
    } else {
      recommended.push(renderFoodChip(food, score));
    }
  });

  return {
    recommendedHtml: recommended.join(''),
    watchHtml: watch.join(''),
    limitHtml: limit.join('')
  };
}

/**
 * Render the browseable foods sections with filter tabs.
 * @param {Object} blended
 * @param {Object} mendelianGenetics
 * @returns {string} HTML
 */
function renderBrowseFoods(blended, mendelianGenetics) {
  // All common foods (ancestral pool)
  const commonChips = tieredFoodChips(blended.commonFoods, mendelianGenetics, true);
  // Category pools (not necessarily ancestral)
  const proteinChips = tieredFoodChips(blended.allProteins, mendelianGenetics, false);
  const fatChips = tieredFoodChips(blended.allFats, mendelianGenetics, false);
  const herbChips = tieredFoodChips(blended.allHerbs, mendelianGenetics, false);

  // Aggregate all for "All" view — use tieredFoodChips for extras to avoid tier-4 leak
  const extraProteins = blended.allProteins.filter(f => !blended.commonFoods.includes(f));
  const extraFats = blended.allFats.filter(f => !blended.commonFoods.includes(f));
  const extraProteinChips = tieredFoodChips(extraProteins, mendelianGenetics, false);
  const extraFatChips = tieredFoodChips(extraFats, mendelianGenetics, false);

  const allRecommended = [
    commonChips.recommendedHtml,
    extraProteinChips.recommendedHtml,
    extraFatChips.recommendedHtml
  ].join('');

  const allWatch = [
    commonChips.watchHtml,
    proteinChips.watchHtml,
    fatChips.watchHtml
  ].join('');

  const allLimit = [
    commonChips.limitHtml,
    proteinChips.limitHtml,
    fatChips.limitHtml
  ].join('');

  const cookingChips = blended.allCooking
    .map(m => `<span class="food-chip">${m}</span>`)
    .join('');

  // Tier legend
  const legend = `
    <div class="food-tier-legend">
      <span class="legend-item"><span class="food-dot food-dot--green"></span>Enjoy</span>
      <span class="legend-item"><span class="food-dot food-dot--amber"></span>Minimize</span>
      <span class="legend-item"><span class="food-dot food-dot--red"></span>Avoid</span>
      <span class="legend-item"><span class="food-dot food-dot--grey"></span>Ancestral tradition</span>
    </div>`;

  function tierSection(recommendedHtml, watchHtml, limitHtml, showCooking) {
    const cookingSection = showCooking && cookingChips ? `
      <div class="food-tier-section">
        <div class="food-tier-header">
          <span class="food-tier-label">Cooking Methods</span>
        </div>
        <div class="food-chip-list">${cookingChips}</div>
      </div>` : '';

    const avoidInner = [
      watchHtml ? `
        <div class="food-tier-section food-tier-section--watch">
          <div class="food-tier-header">
            <span class="tier-dot tier-dot--amber"></span>
            <span class="food-tier-label">Minimize</span>
          </div>
          <div class="food-chip-list">${watchHtml}</div>
        </div>` : '',
      limitHtml ? `
        <div class="food-tier-section food-tier-section--limit">
          <div class="food-tier-header">
            <span class="tier-dot tier-dot--red"></span>
            <span class="food-tier-label">Avoid</span>
          </div>
          <div class="food-chip-list">${limitHtml}</div>
        </div>` : ''
    ].join('');

    const avoidSection = avoidInner ? `
      <details class="avoid-foods-details">
        <summary class="avoid-foods-summary">
          <span class="avoid-foods-label">Minimize &amp; Avoid</span>
          <span class="avoid-foods-hint">Tap to expand</span>
        </summary>
        ${avoidInner}
      </details>` : '';

    return `
      <div class="food-tier-section food-tier-section--recommended">
        <div class="food-tier-header">
          <span class="tier-dot tier-dot--green"></span>
          <span class="food-tier-label">Enjoy</span>
        </div>
        <div class="food-chip-list">${recommendedHtml || '<span class="food-tier-empty">None identified</span>'}</div>
      </div>
      ${avoidSection}
      ${cookingSection}`;
  }

  return `
    <div class="browse-foods-section">
      ${legend}
      <div class="foods-filter-tabs">
        <button class="active" data-filter="all">All Foods</button>
        <button data-filter="proteins">Proteins</button>
        <button data-filter="fats">Fats</button>
        <button data-filter="herbs">Herbs</button>
      </div>

      <div class="food-filter-group food-filter-group--active" data-filter-group="all">
        ${tierSection(allRecommended, allWatch, allLimit, true)}
      </div>

      <div class="food-filter-group" data-filter-group="proteins">
        ${tierSection(proteinChips.recommendedHtml, proteinChips.watchHtml, proteinChips.limitHtml, false)}
      </div>

      <div class="food-filter-group" data-filter-group="fats">
        ${tierSection(fatChips.recommendedHtml, fatChips.watchHtml, fatChips.limitHtml, false)}
      </div>

      <div class="food-filter-group" data-filter-group="herbs">
        ${tierSection(herbChips.recommendedHtml, herbChips.watchHtml, herbChips.limitHtml, false)}
      </div>
    </div>`;
}

/**
 * Render per-ancestry food tradition cards.
 * Replaces the old plain-text "Unique Foods by Ancestry" paragraph list.
 * @param {Object} blended
 * @param {Object} mendelianGenetics
 * @returns {string} HTML
 */
function renderAncestralFoodCards(blended, mendelianGenetics) {
  if (!blended.diets || blended.diets.length === 0) return '';

  const cards = blended.diets.map((diet, idx) => {
    const geo = blended.geos[idx];
    const weight = Math.round(blended.weights[idx] * 100);

    // Foods from every other distinct region (for uniqueness comparison)
    const otherRegionFoods = new Set();
    blended.diets.forEach((otherDiet, otherIdx) => {
      if (otherIdx === idx) return;
      [...(otherDiet.staples || []), ...(otherDiet.common_foods || [])].forEach(f => otherRegionFoods.add(f));
    });

    // Top foods unique to this ancestry (not found in any other lineage)
    const uniqueFoods = [...new Set([
      ...(diet.staples || []),
      ...(diet.common_foods || [])
    ])].filter(f => !otherRegionFoods.has(f)).slice(0, 6);

    const foodChips = uniqueFoods.map(f => {
      const score = mendelianGenetics
        ? scoreFoodForUser(f, mendelianGenetics, true)
        : { tier: 2, positiveReasons: [], watchReasons: [] };
      return renderFoodChip(f, score);
    }).join('');

    const signature = diet.diet_signature
      ? `<p class="ancestral-card-signature">"${diet.diet_signature}"</p>`
      : '';

    return `
      <div class="ancestral-card">
        <div class="ancestral-card-header">
          <span class="ancestral-card-name">${geo.name}</span>
          <span class="ancestral-card-pct">${weight}%</span>
        </div>
        ${signature}
        <div class="ancestral-card-foods food-chip-list">
          ${foodChips || '<span class="food-tier-empty">No unique foods</span>'}
        </div>
      </div>`;
  }).join('');

  return `
    <div class="ancestral-food-traditions">
      <h3>Your Ancestral Food Traditions</h3>
      <p class="ancestral-traditions-subtitle">Signature foods unique to each of your lineages</p>
      <div class="ancestral-cards-grid">${cards}</div>
    </div>`;
}

/**
 * Render the complete Foods tab content.
 * @param {Object} blended
 * @param {Object} mendelianGenetics
 * @returns {string} HTML
 */
function renderFoodsTab(blended, mendelianGenetics) {
  return `
    ${renderSignatureFoods(blended, mendelianGenetics)}
    ${renderBrowseFoods(blended, mendelianGenetics)}
    ${renderAncestralFoodCards(blended, mendelianGenetics)}
  `;
}

// ============================================================================
// DIET TAB — MACRO PROFILE WITH CONTEXT
// ============================================================================

/**
 * Render the macronutrient profile bar with ancestral range context.
 * Shows: blended bar + per-macro range across individual diets + delta vs global average.
 * @param {Object} blended
 * @returns {string} HTML
 */
function renderMacroProfile(blended) {
  const { blendedMacros, diets } = blended;

  // Global reference averages (WHO/dietary reference ranges)
  const popAvg = { carbs: 50, protein: 15, fat: 35 };

  const macros = [
    { key: 'carbs',   label: 'Carbs',   cssClass: 'macro-carbs',   pct: blendedMacros.carbs_pct },
    { key: 'protein', label: 'Protein', cssClass: 'macro-protein', pct: blendedMacros.protein_pct },
    { key: 'fat',     label: 'Fat',     cssClass: 'macro-fat',     pct: blendedMacros.fat_pct }
  ];

  // Calculate min/max range across individual ancestral diets
  macros.forEach(m => {
    const vals = diets.map(d => d.macros[`${m.key}_pct`]).filter(v => v != null);
    m.min = vals.length > 1 ? Math.min(...vals) : m.pct;
    m.max = vals.length > 1 ? Math.max(...vals) : m.pct;
    m.delta = m.pct - popAvg[m.key];
  });

  // Narrative: describe the most notable deviation
  const carbDelta = blendedMacros.carbs_pct - popAvg.carbs;
  const fatDelta  = blendedMacros.fat_pct  - popAvg.fat;
  const parts = [];
  if (carbDelta <= -6) parts.push('lower carbohydrate');
  if (carbDelta >=  6) parts.push('higher carbohydrate');
  if (fatDelta  >=  6) parts.push('higher fat');
  if (fatDelta  <= -6) parts.push('lower fat');
  const narrative = parts.length > 0
    ? `Your ancestral blend skews ${parts.join(' and ')} compared to the global average.`
    : 'Your ancestral macro profile is close to the global average.';

  const barHtml = macros.map(m =>
    `<div class="macro-segment ${m.cssClass}" style="width:${m.pct}%">${m.pct}% ${m.label}</div>`
  ).join('');

  const contextRows = macros.map(m => {
    const deltaText = m.delta > 0 ? `+${m.delta}%` : `${m.delta}%`;
    const deltaClass = m.delta > 0 ? 'macro-delta--above' : m.delta < 0 ? 'macro-delta--below' : '';
    const rangeText = m.min !== m.max ? `range ${m.min}–${m.max}%` : '';
    return `
      <div class="macro-context-item">
        <span class="macro-context-label">${m.label}</span>
        <span class="macro-context-pct">${m.pct}%</span>
        ${rangeText ? `<span class="macro-context-range">${rangeText}</span>` : ''}
        <span class="macro-delta ${deltaClass}">${deltaText} vs avg</span>
      </div>`;
  }).join('');

  return `
    <div class="macro-profile-section diet-section">
      <h3>Macronutrient Profile</h3>
      <div class="macro-bar">${barHtml}</div>
      <div class="macro-context">${contextRows}</div>
      <p class="macro-narrative">${narrative}</p>
      <p class="macro-reference">Global average: ${popAvg.carbs}% carbs · ${popAvg.protein}% protein · ${popAvg.fat}% fat</p>
    </div>`;
}

// ============================================================================
// HEALTH CONCERNS
// ============================================================================

/** Cache for live re-render when health concern checkboxes change */
let _lastBlended = null;
let _lastMendelianGenetics = null;

/**
 * Return matching health concern flags for a food name.
 * @param {string} food
 * @returns {{ icon: string, label: string }[]}
 */
function getHealthConcernFlags(food) {
  if (typeof getUserHealthConcerns !== 'function') return [];
  const active = getUserHealthConcerns();
  if (!active || active.length === 0) return [];
  const lower = food.toLowerCase();
  const flags = [];
  for (const concern of HEALTH_CONCERN_CONFIG) {
    if (!active.includes(concern.id)) continue;
    if (concern.keywords.some(kw => lower.includes(kw))) {
      flags.push({ icon: concern.icon, label: concern.label });
    }
  }
  return flags;
}

/**
 * Show the health concerns sidebar section and restore saved checkbox state.
 */
function _showHealthConcernsUI() {
  const section = document.getElementById('health-concerns-section');
  if (!section) return;
  section.style.display = 'block';
  if (typeof getUserHealthConcerns !== 'function') return;
  const saved = getUserHealthConcerns();
  document.querySelectorAll('input[name="health-concern"]').forEach(cb => {
    cb.checked = saved.includes(cb.value);
  });
}

/**
 * Re-render the Foods tab panel in-place (called on health concern toggle).
 */
function refreshFoodsTab() {
  if (!_lastBlended) return;
  const panel = document.querySelector('[data-tab-panel="foods"]');
  if (panel) panel.innerHTML = renderFoodsTab(_lastBlended, _lastMendelianGenetics);
}

// ============================================================================

/**
 * Show blended diet with Mendelian genetics
 * @param {Object} blended - Blended diet data
 * @param {Object} mendelianGenetics - Mendelian genetics results
 */
function showBlendedDietWithMendelian(blended, mendelianGenetics) {
  _lastBlended = blended;
  _lastMendelianGenetics = mendelianGenetics;
  _showHealthConcernsUI();

  const content = document.getElementById('diet-content');

  const ancestryList = blended.geos.map((g, idx) =>
    `${g.name} (${Math.round(blended.weights[idx] * 100)}%)`
  ).join(', ');

  content.innerHTML = `
    ${renderProfileSummary(mendelianGenetics, ancestryList, blended)}

    <div class="results-tabs">
      <button class="active" data-tab="overview">Overview</button>
      <button data-tab="genetics">Genetics</button>
      <button data-tab="diet">Diet</button>
      <button data-tab="foods">Foods</button>
    </div>

    <div class="results-tab-panel active" data-tab-panel="overview">
      ${renderCategoryScores(mendelianGenetics, true)}
      ${renderKeyInsights(mendelianGenetics)}
      ${renderAncestryBlend(blended)}
    </div>

    <div class="results-tab-panel" data-tab-panel="genetics">
      ${renderGeneticHeadline(mendelianGenetics)}
      ${renderCategoryScores(mendelianGenetics, false)}
      ${renderKeyTakeaways(mendelianGenetics)}
      ${renderNutrientGapAnalysis(mendelianGenetics)}
      ${renderMendelianGenetics(mendelianGenetics)}
    </div>

    <div class="results-tab-panel" data-tab-panel="diet">
      ${renderTopPriorities(mendelianGenetics)}
      ${renderMacroProfile(blended)}
      ${renderDailyGuidelines(mendelianGenetics, blended)}
    </div>

    <div class="results-tab-panel" data-tab-panel="foods">
      ${renderFoodsTab(blended, mendelianGenetics)}
    </div>

    ${renderSourcesSection(mendelianGenetics)}
  `;

}

/**
 * Show blended diet (without Mendelian genetics)
 * @param {Object} blended - Blended diet data
 */
function showBlendedDiet(blended) {
  _lastBlended = blended;
  _lastMendelianGenetics = null;
  _showHealthConcernsUI();

  const content = document.getElementById('diet-content');

  const ancestryList = blended.geos.map((g, idx) =>
    `${g.name} (${Math.round(blended.weights[idx] * 100)}%)`
  ).join(', ');

  content.innerHTML = `
    <div class="profile-summary-card">
      <h2>Blended Ancestral Diet</h2>
      <div class="subtitle">${ancestryList}</div>
    </div>

    <div class="results-tabs">
      <button class="active" data-tab="overview">Overview</button>
      <button data-tab="diet">Diet</button>
      <button data-tab="foods">Foods</button>
    </div>

    <div class="results-tab-panel active" data-tab-panel="overview">
      <div class="diet-section">
        <p>Your dietary recommendations combine elements from multiple ancestral traditions. Focus on foods common across your lineages while incorporating unique elements from each heritage.</p>
      </div>
      ${blendGeneticAdaptations(blended.diets, blended.weights)}
    </div>

    <div class="results-tab-panel" data-tab-panel="diet">
      ${renderMacroProfile(blended)}
    </div>

    <div class="results-tab-panel" data-tab-panel="foods">
      ${renderFoodsTab(blended, null)}
    </div>
  `;

}
