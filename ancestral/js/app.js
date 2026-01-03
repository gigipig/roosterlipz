/**
 * App module - initialization and event handlers
 */

/**
 * Initialize the application
 */
async function init() {
  // Load all data
  await loadData();

  // Populate dropdowns
  populateDropdowns();

  // Initialize map
  initializeMap();

  // Setup event handlers
  setupEventHandlers();
}

/**
 * Setup all event handlers
 */
function setupEventHandlers() {
  // Mode switching
  document.getElementById('family-mode-btn').addEventListener('click', () => {
    document.getElementById('family-mode-btn').classList.add('active');
    document.getElementById('dna-mode-btn').classList.remove('active');
    document.getElementById('family-tree-panel').classList.add('active');
    document.getElementById('dna-test-panel').classList.remove('active');
  });

  document.getElementById('dna-mode-btn').addEventListener('click', () => {
    document.getElementById('dna-mode-btn').classList.add('active');
    document.getElementById('family-mode-btn').classList.remove('active');
    document.getElementById('dna-test-panel').classList.add('active');
    document.getElementById('family-tree-panel').classList.remove('active');
  });

  // Family Tree Mode - Calculate button
  document.getElementById('family-calculate-btn').addEventListener('click', handleFamilyCalculate);

  // Family Tree Mode - Clear button
  document.getElementById('family-clear-btn').addEventListener('click', () => {
    ['mgm-region', 'mgf-region', 'pgm-region', 'pgf-region'].forEach(id => {
      document.getElementById(id).value = '';
    });
    clearAllMapSelections();
    document.getElementById('diet-panel').classList.remove('visible');
  });

  // Close diet panel
  document.getElementById('close-diet-panel').addEventListener('click', () => {
    document.getElementById('diet-panel').classList.remove('visible');
  });

  // DNA Test Mode - percentage input handlers
  [1, 2, 3, 4].forEach(i => {
    document.getElementById(`ancestry${i}-percent`).addEventListener('input', updatePercentageTotal);
  });

  // DNA Test Mode - Calculate button
  document.getElementById('dna-calculate-btn').addEventListener('click', handleDNACalculate);

  // DNA Test Mode - Clear button
  document.getElementById('dna-clear-btn').addEventListener('click', () => {
    selectedRegions = [];
    updateSelectedRegionsDisplay();
    clearAllMapSelections();
    document.getElementById('diet-panel').classList.remove('visible');

    [1, 2, 3, 4].forEach(i => {
      document.getElementById(`ancestry${i}-region`).value = '';
      document.getElementById(`ancestry${i}-percent`).value = 0;
    });

    updatePercentageTotal();
  });
}

/**
 * Handle Family Tree calculate button click
 */
function handleFamilyCalculate() {
  const grandparentIds = ['mgm-region', 'mgf-region', 'pgm-region', 'pgf-region'];
  const selectedIds = grandparentIds.map(id => document.getElementById(id).value);

  const numSelected = selectedIds.filter(id => id !== '').length;

  if (numSelected === 0) {
    alert('Please select at least one grandparent ancestry');
    return;
  }

  const grandparentDiets = selectedIds.map(id => {
    if (!id) return null;
    return getDietById(id);
  });

  const regions = selectedIds.filter(id => id !== '');

  // Clear previous selections and highlight new ones
  clearAllMapSelections();
  regions.forEach(id => highlightRegionOnMap(id));

  // Fly to show all selected regions
  flyToRegions(regions);

  if (numSelected === 4) {
    // Use Mendelian genetics
    const mendelianGenetics = calculateMendelianGenetics(grandparentDiets);
    const weights = [0.25, 0.25, 0.25, 0.25];
    const blended = blendDiets(regions, weights);
    showBlendedDietWithMendelian(blended, mendelianGenetics);
  } else {
    // Fallback: weighted averaging
    const confirm = window.confirm(
      `You've selected ${numSelected} out of 4 grandparents.\n\n` +
      `For the most accurate genetic predictions, we recommend selecting all 4 grandparents.\n\n` +
      `Continue with ${numSelected} grandparent${numSelected > 1 ? 's' : ''}?`
    );
    if (!confirm) return;

    const weight = 1.0 / numSelected;
    const weights = new Array(numSelected).fill(weight);
    const blended = blendDiets(regions, weights);
    showBlendedDiet(blended);
  }
}

/**
 * Handle DNA Test calculate button click
 */
function handleDNACalculate() {
  const regions = [];
  const weights = [];

  [1, 2, 3, 4].forEach(i => {
    const region = document.getElementById(`ancestry${i}-region`).value;
    const percent = parseFloat(document.getElementById(`ancestry${i}-percent`).value) || 0;

    if (region && percent > 0) {
      regions.push(region);
      weights.push(percent / 100);
    }
  });

  if (regions.length === 0) {
    alert('Please select at least one ancestry and enter percentages');
    return;
  }

  const total = weights.reduce((sum, w) => sum + w, 0);
  if (Math.abs(total - 1.0) > 0.01) {
    alert('Percentages must total 100%');
    return;
  }

  // Clear previous selections and highlight new ones
  clearAllMapSelections();
  regions.forEach(id => highlightRegionOnMap(id));

  // Fly to show all selected regions
  flyToRegions(regions);

  const blended = blendDiets(regions, weights);
  showBlendedDiet(blended);
}

// Initialize on load
init();
