/**
 * Recipes module - loading, scoring, rendering, modal, and bookmarking
 */

// Cache for loaded recipes
let recipesCache = null;

/**
 * Load recipes data (lazy - called on first Foods tab view)
 * @returns {Promise<Object[]>} Array of recipe objects
 */
async function loadRecipes() {
  if (recipesCache) return recipesCache;

  try {
    const response = await fetch('./recipes.json');
    if (!response.ok) throw new Error('Failed to load recipes');
    const data = await response.json();
    recipesCache = data.recipes || [];
    return recipesCache;
  } catch (e) {
    console.warn('Could not load recipes:', e);
    recipesCache = [];
    return [];
  }
}

/**
 * Get all region IDs from a blended diet result
 * @param {Object} blended - Blended diet data
 * @returns {string[]} Array of region IDs
 */
function getRegionIdsFromBlended(blended) {
  if (!blended || !blended.diets) return [];
  return blended.diets.map(d => d.id).filter(Boolean);
}

/**
 * Nearby region mapping for fallback when no recipes match
 */
const NEARBY_REGIONS = {
  'central_europe': ['eastern_europe', 'western_europe', 'nordic'],
  'balkan': ['eastern_europe', 'med_southern', 'caucasus', 'anatolian'],
  'caucasus': ['anatolian', 'persian', 'eastern_europe'],
  'anatolian': ['med_levant', 'caucasus', 'balkan', 'med_southern'],
  'persian': ['med_levant', 'central_asia', 'arabian'],
  'arabian': ['med_levant', 'persian', 'nile_valley'],
  'mesopotamian': ['med_levant', 'persian', 'kurdish'],
  'kurdish': ['med_levant', 'anatolian', 'mesopotamian'],
  'bengal': ['north_india', 'south_india', 'se_asia_main'],
  'west_india': ['north_india', 'south_india'],
  'nepal': ['north_india', 'tibet'],
  'tibet': ['north_china', 'nepal', 'central_asia'],
  'north_china': ['south_china', 'korea', 'japan'],
  'south_china': ['north_china', 'se_asia_main', 'se_asia_island'],
  'korea': ['japan', 'north_china'],
  'se_asia_island': ['se_asia_main', 'south_china'],
  'highland_se_asia': ['se_asia_main', 'south_china'],
  'ethiopia': ['horn_somalia', 'nile_valley', 'west_africa'],
  'horn_somalia': ['ethiopia', 'arabian', 'maasai'],
  'nile_valley': ['maghreb', 'ethiopia', 'med_levant'],
  'maghreb': ['med_southern', 'nile_valley', 'west_africa'],
  'central_africa': ['west_africa', 'southern_africa'],
  'southern_africa': ['central_africa', 'west_africa'],
  'sahel': ['west_africa', 'maghreb'],
  'nilotic': ['maasai', 'ethiopia', 'central_africa'],
  'maasai': ['nilotic', 'ethiopia'],
  'andean': ['mesoamerica', 'mestizo_mesoamerican'],
  'caribbean_creole': ['west_africa', 'mesoamerica', 'mestizo_mesoamerican'],
  'caribbean_taino': ['mesoamerica', 'caribbean_creole'],
  'amazon': ['andean', 'mesoamerica'],
  'brazilian_coastal': ['andean', 'west_africa', 'med_southern'],
  'gaucho': ['andean', 'med_southern'],
  'patagonia': ['gaucho', 'andean'],
  'inuit': ['nordic', 'subarctic'],
  'pacific_nw': ['subarctic', 'japan'],
  'great_plains': ['eastern_woodlands', 'southwest_us'],
  'eastern_woodlands': ['great_plains', 'western_europe'],
  'southwest_us': ['mesoamerica', 'great_plains'],
  'subarctic': ['inuit', 'nordic'],
  'polynesia': ['se_asia_island', 'melanesia'],
  'melanesia': ['se_asia_island', 'polynesia'],
  'micronesia': ['se_asia_island', 'polynesia'],
  'aboriginal_aus': ['melanesia', 'se_asia_island'],
  'maori': ['polynesia'],
  'mongolia': ['central_asia', 'north_china'],
  'siberia': ['mongolia', 'central_asia', 'inuit'],
  'central_asia': ['persian', 'mongolia', 'north_china'],
  'canadian_prairies': ['great_plains', 'western_europe'],
  'california_coast': ['southwest_us', 'mesoamerica'],
  'southeast_us': ['eastern_woodlands', 'west_africa'],
  'mestizo_mesoamerican': ['mesoamerica', 'med_southern'],
  'malagasy': ['se_asia_island', 'southern_africa'],
  'sudanian': ['sahel', 'west_africa'],
  'australian_coastal': ['aboriginal_aus', 'se_asia_island'],
  'sichuan_sw_china': ['south_china', 'north_china', 'se_asia_main']
};

/**
 * Get recipes for a user's ancestry profile
 * @param {Object} blended - Blended diet data
 * @param {Object} mendelianGenetics - Mendelian genetics results (optional)
 * @returns {Promise<Object[]>} Scored and sorted recipes
 */
async function getRecipesForUser(blended, mendelianGenetics) {
  const recipes = await loadRecipes();
  if (!recipes.length) return [];

  const userRegionIds = getRegionIdsFromBlended(blended);
  if (!userRegionIds.length) return [];

  // Find direct matches
  let matched = recipes.filter(recipe =>
    recipe.regionIds.some(rid => userRegionIds.includes(rid))
  );

  // Fallback: nearby regions if no direct matches
  if (matched.length === 0) {
    const nearbyIds = new Set();
    userRegionIds.forEach(rid => {
      const nearby = NEARBY_REGIONS[rid] || [];
      nearby.forEach(n => nearbyIds.add(n));
    });

    matched = recipes.filter(recipe =>
      recipe.regionIds.some(rid => nearbyIds.has(rid))
    );
  }

  // Score and sort
  const scored = matched.map(recipe => {
    const score = mendelianGenetics
      ? calculateRecipeGeneticScore(recipe, mendelianGenetics)
      : 50; // Default score without genetics
    return { recipe, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/**
 * Calculate genetic compatibility score for a recipe
 * @param {Object} recipe - Recipe object
 * @param {Object} mendelianGenetics - Mendelian genetics results
 * @returns {number} Score from 0-100
 */
function calculateRecipeGeneticScore(recipe, mendelianGenetics) {
  if (!recipe.geneticRelevance || !recipe.geneticRelevance.length) return 50;

  const relevanceWeights = { high: 3, moderate: 2, low: 1 };
  let totalWeight = 0;
  let weightedScore = 0;

  recipe.geneticRelevance.forEach(gr => {
    const weight = relevanceWeights[gr.relevance] || 1;
    totalWeight += weight;

    // Find the trait in the user's genetics
    const trait = mendelianGenetics[gr.trait];
    if (!trait) {
      weightedScore += weight * 50; // Neutral if trait not found
      return;
    }

    // Get the trait meter info for scoring
    const meterInfo = getTraitMeterInfo(gr.trait, trait);
    if (meterInfo) {
      weightedScore += weight * meterInfo.value;
    } else {
      weightedScore += weight * 50;
    }
  });

  if (totalWeight === 0) return 50;
  return Math.round(weightedScore / totalWeight);
}

/**
 * Get the genetic match level string and CSS class
 * @param {number} score - Score 0-100
 * @returns {Object} { label, cssClass }
 */
function getScoreLevel(score) {
  if (score >= 65) return { label: 'Great Match', cssClass: 'recipe-score-high' };
  if (score >= 40) return { label: 'Good Match', cssClass: 'recipe-score-moderate' };
  return { label: 'Try It', cssClass: 'recipe-score-low' };
}

/**
 * Render the recipe section for the Foods tab
 * @param {Object[]} scoredRecipes - Array of { recipe, score }
 * @param {Object} mendelianGenetics - Mendelian genetics results (optional)
 * @returns {string} HTML string
 */
function renderRecipeSection(scoredRecipes, mendelianGenetics) {
  if (!scoredRecipes || !scoredRecipes.length) return '';

  const hasGenetics = !!mendelianGenetics;

  const cardsHtml = scoredRecipes.map(({ recipe, score }) =>
    renderRecipeCard(recipe, score, hasGenetics)
  ).join('');

  return `
    <div class="recipe-section">
      <div class="recipe-section-header">
        <h3>Ancestral Recipes</h3>
        <p class="recipe-section-subtitle">${hasGenetics ? 'Matched to your genetic profile' : 'Based on your ancestral regions'}</p>
      </div>
      <div class="recipe-card-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}

/**
 * Render a single recipe card
 * @param {Object} recipe - Recipe object
 * @param {number} score - Genetic compatibility score
 * @param {boolean} hasGenetics - Whether user has genetic data
 * @returns {string} HTML string
 */
function renderRecipeCard(recipe, score, hasGenetics) {
  const scoreLevel = getScoreLevel(score);
  const isBookmarked = getUserBookmarkedRecipes().includes(recipe.id);
  const difficultyIcon = { easy: '1', medium: '2', hard: '3' }[recipe.difficulty] || '?';
  const totalTime = recipe.prepTime + recipe.cookTime;

  // Get top genetic badges (max 2)
  const badges = (recipe.geneticRelevance || [])
    .filter(gr => gr.relevance === 'high')
    .slice(0, 2)
    .map(gr => {
      const meta = (typeof GENE_META !== 'undefined') ? GENE_META[gr.trait] : null;
      const icon = meta ? meta.icon : '🧬';
      const title = meta ? meta.title : gr.trait;
      return `<span class="recipe-genetic-badge badge-${gr.relevance}">${icon} ${title}</span>`;
    })
    .join('');

  return `
    <div class="recipe-card" data-recipe-id="${recipe.id}" onclick="openRecipeModal('${recipe.id}')">
      <div class="recipe-card-header">
        <h4 class="recipe-card-title">${recipe.name}</h4>
        <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="event.stopPropagation(); toggleBookmark('${recipe.id}')" title="${isBookmarked ? 'Remove bookmark' : 'Bookmark recipe'}">
          ${isBookmarked ? '★' : '☆'}
        </button>
      </div>
      <div class="recipe-card-meta">
        <span class="recipe-meta-item" title="Total time">⏱ ${totalTime}m</span>
        <span class="recipe-meta-item" title="Difficulty: ${recipe.difficulty}">◆${'◆'.repeat(parseInt(difficultyIcon) - 1)} ${recipe.difficulty}</span>
        <span class="recipe-meta-item" title="Servings">👤 ${recipe.servings}</span>
      </div>
      ${hasGenetics ? `
        <div class="recipe-card-score ${scoreLevel.cssClass}">
          <span class="score-value">${score}</span>
          <span class="score-label">${scoreLevel.label}</span>
        </div>
      ` : ''}
      ${badges ? `<div class="recipe-card-badges">${badges}</div>` : ''}
      <div class="recipe-card-action">View Recipe →</div>
    </div>
  `;
}

/**
 * Open the recipe detail modal
 * @param {string} recipeId - Recipe ID
 */
function openRecipeModal(recipeId) {
  const recipes = recipesCache || [];
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;

  // Get user genetics if available
  const savedDiet = getUserSavedDiet();
  const mendelianGenetics = savedDiet && savedDiet.data ? savedDiet.data.mendelianGenetics : null;
  const hasGenetics = !!mendelianGenetics;
  const score = mendelianGenetics ? calculateRecipeGeneticScore(recipe, mendelianGenetics) : null;
  const scoreLevel = score !== null ? getScoreLevel(score) : null;
  const isBookmarked = getUserBookmarkedRecipes().includes(recipe.id);
  const totalTime = recipe.prepTime + recipe.cookTime;

  // Build genetic relevance section
  let geneticHtml = '';
  if (hasGenetics && recipe.geneticRelevance && recipe.geneticRelevance.length) {
    const traitItems = recipe.geneticRelevance.map(gr => {
      const meta = (typeof GENE_META !== 'undefined') ? GENE_META[gr.trait] : null;
      const icon = meta ? meta.icon : '🧬';
      const title = meta ? meta.title : gr.trait;
      return `
        <div class="recipe-trait-item">
          <span class="recipe-genetic-badge badge-${gr.relevance}">${icon} ${title}</span>
          <span class="recipe-trait-relevance relevance-${gr.relevance}">${gr.relevance}</span>
          <p class="recipe-trait-note">${gr.note}</p>
        </div>
      `;
    }).join('');

    geneticHtml = `
      <div class="recipe-modal-section">
        <h4>Why This Recipe Suits You</h4>
        <div class="recipe-traits-list">${traitItems}</div>
      </div>
    `;
  }

  // Build ingredients list
  const ingredientsHtml = recipe.ingredients.map(ing => {
    // Check if any ingredient word has genetic relevance
    const foodItem = hasGenetics ? renderFoodItem(ing, mendelianGenetics) : `<span>${ing}</span>`;
    return `<li>${foodItem}</li>`;
  }).join('');

  // Build instructions
  const instructionsHtml = recipe.instructions.map((step, i) =>
    `<li><span class="step-num">${i + 1}</span>${step}</li>`
  ).join('');

  // Nutritional highlights
  const nutritionHtml = recipe.nutritionalHighlights.map(h =>
    `<span class="nutrition-highlight">${h}</span>`
  ).join('');

  const body = document.getElementById('recipe-modal-body');
  body.innerHTML = `
    <div class="recipe-modal-header">
      <div class="recipe-modal-title-row">
        <h2>${recipe.name}</h2>
        <button class="bookmark-btn bookmark-btn-large ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark('${recipe.id}'); openRecipeModal('${recipe.id}');" title="${isBookmarked ? 'Remove bookmark' : 'Bookmark recipe'}">
          ${isBookmarked ? '★' : '☆'}
        </button>
      </div>
      <div class="recipe-modal-meta">
        <span>⏱ Prep: ${recipe.prepTime}m</span>
        <span>🍳 Cook: ${recipe.cookTime}m</span>
        <span>⏲ Total: ${totalTime}m</span>
        <span>◆ ${recipe.difficulty}</span>
        <span>👤 ${recipe.servings} servings</span>
      </div>
      ${score !== null ? `
        <div class="recipe-modal-score ${scoreLevel.cssClass}">
          Genetic Match: <strong>${score}/100</strong> — ${scoreLevel.label}
        </div>
      ` : ''}
    </div>

    ${geneticHtml}

    <div class="recipe-modal-section">
      <h4>Ingredients</h4>
      <ul class="recipe-ingredients-list">${ingredientsHtml}</ul>
    </div>

    <div class="recipe-modal-section">
      <h4>Instructions</h4>
      <ol class="recipe-instructions-list">${instructionsHtml}</ol>
    </div>

    <div class="recipe-modal-section">
      <h4>Nutritional Highlights</h4>
      <div class="recipe-nutrition-badges">${nutritionHtml}</div>
    </div>

    <div class="recipe-modal-section">
      <h4>Cultural Context</h4>
      <p class="recipe-cultural-context">${recipe.culturalContext}</p>
    </div>
  `;

  showModal('recipe-modal');
}

/**
 * Toggle bookmark for a recipe
 * @param {string} recipeId - Recipe ID to toggle
 */
function toggleBookmark(recipeId) {
  const bookmarks = getUserBookmarkedRecipes();
  const idx = bookmarks.indexOf(recipeId);

  if (idx >= 0) {
    removeRecipeBookmark(recipeId);
    showToast('Bookmark removed', 'info');
  } else {
    saveRecipeBookmark(recipeId);
    showToast('Recipe bookmarked!', 'success');
  }

  // Re-render bookmark buttons on cards
  document.querySelectorAll(`.recipe-card[data-recipe-id="${recipeId}"] .bookmark-btn`).forEach(btn => {
    const isNowBookmarked = getUserBookmarkedRecipes().includes(recipeId);
    btn.classList.toggle('bookmarked', isNowBookmarked);
    btn.innerHTML = isNowBookmarked ? '★' : '☆';
  });
}

/**
 * Initialize recipe section in the Foods tab after results render
 * Called from diet.js after building the foods tab
 * @param {Object} blended - Blended diet data
 * @param {Object} mendelianGenetics - Mendelian genetics results (optional)
 */
async function initRecipeSection(blended, mendelianGenetics) {
  const scoredRecipes = await getRecipesForUser(blended, mendelianGenetics);
  if (!scoredRecipes.length) return;

  const html = renderRecipeSection(scoredRecipes, mendelianGenetics);
  const foodsPanel = document.querySelector('.results-tab-panel[data-tab-panel="foods"]');
  if (foodsPanel) {
    // Append recipe section at the end of the foods panel
    const recipeDiv = document.createElement('div');
    recipeDiv.innerHTML = html;
    foodsPanel.appendChild(recipeDiv);
  }
}
