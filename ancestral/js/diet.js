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

  const diets = regionIds.map(id => getDietById(id)).filter(d => d !== null);
  const geos = regionIds.map(id => getGeoById(id)).filter(g => g !== null);

  if (diets.length === 0) return null;

  // Calculate blended macros
  const blendedMacros = diets.reduce((acc, diet, idx) => {
    const weight = normalizedWeights[idx];
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

  // Get common foods
  const foodCounts = {};
  diets.forEach((diet, idx) => {
    [...diet.staples, ...diet.common_foods].forEach(food => {
      foodCounts[food] = (foodCounts[food] || 0) + normalizedWeights[idx];
    });
  });

  const commonFoods = Object.entries(foodCounts)
    .filter(([_, count]) => count >= 0.5)
    .map(([food]) => food);

  // Collect all proteins, fats, herbs
  const allProteins = [...new Set(diets.flatMap(d => d.proteins))];
  const allFats = [...new Set(diets.flatMap(d => d.fats))];
  const allHerbs = [...new Set(diets.flatMap(d => d.herbs_spices))];
  const allCooking = [...new Set(diets.flatMap(d => d.cooking_methods))];

  return {
    diets,
    geos,
    weights: normalizedWeights,
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
 * Render profile summary card with top trait badges
 * @param {Object} mendelianGenetics - Mendelian genetics results
 * @param {string} ancestryList - Formatted ancestry string
 * @returns {string} HTML for the profile summary card
 */
function renderProfileSummary(mendelianGenetics, ancestryList) {
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

  return `
    <div class="profile-summary-card">
      <h2>Your Personalized Diet</h2>
      <div class="subtitle">${ancestryList}</div>
      ${badgesHtml ? `<div class="profile-stat-badges">${badgesHtml}</div>` : ''}
    </div>
  `;
}

/**
 * Show blended diet with Mendelian genetics
 * @param {Object} blended - Blended diet data
 * @param {Object} mendelianGenetics - Mendelian genetics results
 */
function showBlendedDietWithMendelian(blended, mendelianGenetics) {
  const content = document.getElementById('diet-content');

  const ancestryList = blended.geos.map((g, idx) =>
    `${g.name} (${Math.round(blended.weights[idx] * 100)}%)`
  ).join(', ');

  content.innerHTML = `
    ${renderProfileSummary(mendelianGenetics, ancestryList)}

    <div class="results-tabs">
      <button class="active" data-tab="overview">Overview</button>
      <button data-tab="genetics">Genetics</button>
      <button data-tab="diet">Diet</button>
      <button data-tab="foods">Foods</button>
    </div>

    <div class="results-tab-panel active" data-tab-panel="overview">
      <div class="diet-section">
        <p>Your dietary recommendations are based on <strong>Mendelian genetics</strong> calculated from your grandparents' populations, plus dietary traditions from your ancestral lineages.</p>
      </div>
      ${renderKeyTakeaways(mendelianGenetics)}
    </div>

    <div class="results-tab-panel" data-tab-panel="genetics">
      ${renderMendelianGenetics(mendelianGenetics)}
      ${renderNutrientGapAnalysis(mendelianGenetics)}
    </div>

    <div class="results-tab-panel" data-tab-panel="diet">
      <div class="diet-section">
        <h3>Blended Macronutrient Profile</h3>
        <div class="macro-bar">
          <div class="macro-segment macro-carbs" style="width: ${blended.blendedMacros.carbs_pct}%">
            ${blended.blendedMacros.carbs_pct}% Carbs
          </div>
          <div class="macro-segment macro-protein" style="width: ${blended.blendedMacros.protein_pct}%">
            ${blended.blendedMacros.protein_pct}% Protein
          </div>
          <div class="macro-segment macro-fat" style="width: ${blended.blendedMacros.fat_pct}%">
            ${blended.blendedMacros.fat_pct}% Fat
          </div>
        </div>
      </div>
      ${renderDailyGuidelines(mendelianGenetics, blended)}
    </div>

    <div class="results-tab-panel" data-tab-panel="foods">
      <div class="diet-section">
        <h3>Common Foods (Across Ancestries)</h3>
        <p class="food-tooltip-hint">Hover over foods with icons to see why they're recommended for your genetics</p>
        <div class="food-list">
          ${renderFoodList(blended.commonFoods, mendelianGenetics, 12)}
        </div>
      </div>

      <div class="diet-section">
        <h3>Recommended Proteins</h3>
        <div class="food-list">
          ${renderFoodList(blended.allProteins, mendelianGenetics, 10)}
        </div>
      </div>

      <div class="diet-section">
        <h3>Recommended Fats</h3>
        <div class="food-list">
          ${renderFoodList(blended.allFats, mendelianGenetics, 8)}
        </div>
      </div>

      <div class="diet-section">
        <h3>Herbs & Spices</h3>
        <div class="food-list">
          ${renderFoodList(blended.allHerbs, mendelianGenetics, 12)}
        </div>
      </div>

      <div class="diet-section">
        <h3>Cooking Methods</h3>
        <div class="food-list">
          ${blended.allCooking.map(m =>
            `<span class="food-item">${m}</span>`
          ).join('')}
        </div>
      </div>

      <div class="diet-section">
        <h3>Unique Foods by Ancestry</h3>
        ${blended.diets.map((diet, idx) => {
          const uniqueFoods = [...diet.staples, ...diet.common_foods]
            .filter(f => !blended.commonFoods.includes(f))
            .slice(0, 5);
          return `
            <p><strong>${blended.geos[idx].name}:</strong> ${uniqueFoods.join(', ')}</p>
          `;
        }).join('')}
      </div>
    </div>

    ${renderSourcesSection(mendelianGenetics)}
  `;

  // Load and render recipes asynchronously
  if (typeof initRecipeSection === 'function') {
    initRecipeSection(blended, mendelianGenetics);
  }
}

/**
 * Show blended diet (without Mendelian genetics)
 * @param {Object} blended - Blended diet data
 */
function showBlendedDiet(blended) {
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
      <div class="diet-section">
        <h3>Blended Macronutrient Profile</h3>
        <div class="macro-bar">
          <div class="macro-segment macro-carbs" style="width: ${blended.blendedMacros.carbs_pct}%">
            ${blended.blendedMacros.carbs_pct}% Carbs
          </div>
          <div class="macro-segment macro-protein" style="width: ${blended.blendedMacros.protein_pct}%">
            ${blended.blendedMacros.protein_pct}% Protein
          </div>
          <div class="macro-segment macro-fat" style="width: ${blended.blendedMacros.fat_pct}%">
            ${blended.blendedMacros.fat_pct}% Fat
          </div>
        </div>
      </div>
    </div>

    <div class="results-tab-panel" data-tab-panel="foods">
      <div class="diet-section">
        <h3>Common Foods (Across Ancestries)</h3>
        <div class="food-list">
          ${blended.commonFoods.slice(0, 12).map(f =>
            `<span class="food-item">${f}</span>`
          ).join('')}
        </div>
      </div>

      <div class="diet-section">
        <h3>Recommended Proteins</h3>
        <div class="food-list">
          ${blended.allProteins.slice(0, 10).map(p =>
            `<span class="food-item">${p}</span>`
          ).join('')}
        </div>
      </div>

      <div class="diet-section">
        <h3>Recommended Fats</h3>
        <div class="food-list">
          ${blended.allFats.slice(0, 8).map(f =>
            `<span class="food-item">${f}</span>`
          ).join('')}
        </div>
      </div>

      <div class="diet-section">
        <h3>Herbs & Spices</h3>
        <div class="food-list">
          ${blended.allHerbs.slice(0, 12).map(h =>
            `<span class="food-item">${h}</span>`
          ).join('')}
        </div>
      </div>

      <div class="diet-section">
        <h3>Cooking Methods</h3>
        <div class="food-list">
          ${blended.allCooking.map(m =>
            `<span class="food-item">${m}</span>`
          ).join('')}
        </div>
      </div>

      <div class="diet-section">
        <h3>Unique Foods by Ancestry</h3>
        ${blended.diets.map((diet, idx) => {
          const uniqueFoods = [...diet.staples, ...diet.common_foods]
            .filter(f => !blended.commonFoods.includes(f))
            .slice(0, 5);
          return `
            <p><strong>${blended.geos[idx].name}:</strong> ${uniqueFoods.join(', ')}</p>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Load and render recipes asynchronously (no genetics in DNA mode)
  if (typeof initRecipeSection === 'function') {
    initRecipeSection(blended, null);
  }
}
