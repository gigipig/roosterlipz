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

  // Setup event handlers
  setupEventHandlers();

  // Setup user profile handlers
  setupProfileEventHandlers();

  // Ensure user has a username (for existing users)
  ensureUsername();

  // Display username and update profile UI
  displayUsername();
  updateProfileUI();

  // Initialize onboarding (will skip if user has saved data)
  initOnboarding();

  // Restore user selections from cache
  if (userHasSavedData()) {
    restoreUserSelections();
  }
}

/**
 * Setup all event handlers
 */
function setupEventHandlers() {
  // Sidebar toggle (mobile)
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('visible');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
  });

  // Sidebar collapse (desktop)
  const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
  sidebarCollapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    // Update button icon
    sidebarCollapseBtn.innerHTML = sidebar.classList.contains('collapsed') ? '&#9654;' : '&#9664;';
  });

  // Collapsible sections
  document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement;
      section.classList.toggle('open');
    });
  });

  // Mode switching
  document.getElementById('family-mode-btn').addEventListener('click', () => {
    document.getElementById('family-mode-btn').classList.add('active');
    document.getElementById('dna-mode-btn').classList.remove('active');
    document.getElementById('family-tree-panel').classList.add('active');
    document.getElementById('dna-test-panel').classList.remove('active');
    setUserAncestryMode('family');
  });

  document.getElementById('dna-mode-btn').addEventListener('click', () => {
    document.getElementById('dna-mode-btn').classList.add('active');
    document.getElementById('family-mode-btn').classList.remove('active');
    document.getElementById('dna-test-panel').classList.add('active');
    document.getElementById('family-tree-panel').classList.remove('active');
    setUserAncestryMode('dna');
  });

  // Family Tree Mode - Calculate button
  document.getElementById('family-calculate-btn').addEventListener('click', handleFamilyCalculate);

  // Family Tree Mode - Clear button
  document.getElementById('family-clear-btn').addEventListener('click', () => {
    ['mgm-region', 'mgf-region', 'pgm-region', 'pgf-region'].forEach(id => {
      document.getElementById(id).value = '';
    });
    hideResults();
    saveUserFamilyTree({ mgm: null, mgf: null, pgm: null, pgf: null });
    clearUserDiet();
  });

  // DNA Test Mode - percentage input handlers
  [1, 2, 3, 4].forEach(i => {
    document.getElementById(`ancestry${i}-percent`).addEventListener('input', updatePercentageTotal);
  });

  // DNA Test Mode - Calculate button
  document.getElementById('dna-calculate-btn').addEventListener('click', handleDNACalculate);

  // DNA Test Mode - Clear button
  document.getElementById('dna-clear-btn').addEventListener('click', () => {
    hideResults();

    [1, 2, 3, 4].forEach(i => {
      document.getElementById(`ancestry${i}-region`).value = '';
      document.getElementById(`ancestry${i}-percent`).value = 0;
    });

    updatePercentageTotal();
    saveUserDNATest([
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 }
    ]);
    clearUserDiet();
  });
}

/**
 * Show results in the content area
 */
function showResults() {
  document.getElementById('results-placeholder').style.display = 'none';
  document.getElementById('results-content').style.display = 'block';
}

/**
 * Hide results and show placeholder
 */
function hideResults() {
  document.getElementById('results-placeholder').style.display = 'flex';
  document.getElementById('results-content').style.display = 'none';
}

/**
 * Handle Family Tree calculate button click
 */
function handleFamilyCalculate() {
  const grandparentIds = ['mgm-region', 'mgf-region', 'pgm-region', 'pgf-region'];
  // These are nationality IDs (e.g., 'polish') from the dropdowns
  const selectedNationalityIds = grandparentIds.map(id => document.getElementById(id).value);

  const numSelected = selectedNationalityIds.filter(id => id !== '').length;

  if (numSelected === 0) {
    alert('Please select at least one grandparent ancestry');
    return;
  }

  // Convert nationality IDs to region IDs for diet lookup
  const grandparentDiets = selectedNationalityIds.map(id => {
    if (!id) return null;
    const regionId = getRegionIdFromNationality(id);
    return regionId ? getDietById(regionId) : null;
  });

  // Get region IDs for diet blending
  const regionIds = selectedNationalityIds
    .filter(id => id !== '')
    .map(id => getRegionIdFromNationality(id))
    .filter(id => id !== null);

  // Save user's family tree selections (using nationality IDs for proper restoration)
  saveUserFamilyTree({
    mgm: selectedNationalityIds[0] || null,
    mgf: selectedNationalityIds[1] || null,
    pgm: selectedNationalityIds[2] || null,
    pgf: selectedNationalityIds[3] || null
  });

  // Show results area
  showResults();

  if (numSelected === 4) {
    // Use Mendelian genetics
    const mendelianGenetics = calculateMendelianGenetics(grandparentDiets);
    const weights = [0.25, 0.25, 0.25, 0.25];
    const blended = blendDiets(regionIds, weights);
    showBlendedDietWithMendelian(blended, mendelianGenetics);

    // Save calculated diet and update profile
    saveUserDiet({ type: 'mendelian', blended, mendelianGenetics });
    updateProfileUI();
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
    const blended = blendDiets(regionIds, weights);
    showBlendedDiet(blended);

    // Save calculated diet and update profile
    saveUserDiet({ type: 'blended', blended });
    updateProfileUI();
  }
}

/**
 * Handle DNA Test calculate button click
 */
function handleDNACalculate() {
  const regionIds = [];
  const weights = [];
  const dnaSelections = [];

  [1, 2, 3, 4].forEach(i => {
    // These are nationality IDs (e.g., 'polish') from the dropdowns
    const nationalityId = document.getElementById(`ancestry${i}-region`).value;
    const percent = parseFloat(document.getElementById(`ancestry${i}-percent`).value) || 0;

    // Save nationality ID for proper restoration
    dnaSelections.push({ regionId: nationalityId || null, percent });

    if (nationalityId && percent > 0) {
      // Convert to region ID for diet calculations
      const regionId = getRegionIdFromNationality(nationalityId);
      if (regionId) {
        regionIds.push(regionId);
        weights.push(percent / 100);
      }
    }
  });

  if (regionIds.length === 0) {
    alert('Please select at least one ancestry and enter percentages');
    return;
  }

  const total = weights.reduce((sum, w) => sum + w, 0);
  if (Math.abs(total - 1.0) > 0.01) {
    alert('Percentages must total 100%');
    return;
  }

  // Save user's DNA test selections (using nationality IDs for proper restoration)
  saveUserDNATest(dnaSelections);

  // Show results area
  showResults();

  const blended = blendDiets(regionIds, weights);
  showBlendedDiet(blended);

  // Save calculated diet and update profile
  saveUserDiet({ type: 'dna', blended });
  updateProfileUI();
}

// Initialize on load
init();
