/**
 * App module - initialization and event handlers
 */

/**
 * Toast Notification System
 * Usage: showToast('Message here', 'success') - types: success, error, warning, info
 */
const ToastSystem = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    document.body.appendChild(this.container);
  },

  show(message, type = 'info', duration = 3500) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.remove('toast-visible');
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  }
};

// Convenience function
function showToast(message, type = 'info', duration = 3500) {
  return ToastSystem.show(message, type, duration);
}

/**
 * Show loading overlay with optional custom message
 * @param {string} subtitle - Optional subtitle text
 */
function showLoading(subtitle = 'Analyzing Mendelian inheritance...') {
  const overlay = document.getElementById('loading-overlay');
  const subtitleEl = document.getElementById('loading-subtitle');
  subtitleEl.textContent = subtitle;
  overlay.classList.add('visible');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  overlay.classList.remove('visible');
}

/**
 * Update loading subtitle text
 * @param {string} text - New subtitle text
 */
function updateLoadingText(text) {
  const subtitleEl = document.getElementById('loading-subtitle');
  subtitleEl.textContent = text;
}

/**
 * Show methodology modal
 */
function showMethodologyModal() {
  const modal = document.getElementById('methodology-modal');
  modal.classList.add('visible');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

/**
 * Hide methodology modal
 */
function hideMethodologyModal() {
  const modal = document.getElementById('methodology-modal');
  modal.classList.remove('visible');
  document.body.style.overflow = ''; // Restore scroll
}

/**
 * Show any modal by ID
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Hide any modal by ID
 */
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

/**
 * Hide all visible modals
 */
function hideAllModals() {
  document.querySelectorAll('.modal-overlay.visible').forEach(modal => {
    modal.classList.remove('visible');
  });
  document.body.style.overflow = '';
}

/**
 * Setup modal close handlers (click overlay, press Escape)
 */
function initModalHandlers() {
  // Close modal when clicking the overlay (outside modal-container)
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideAllModals();
    }
  });
}

/**
 * Toggle header dropdown menu
 */
function toggleHeaderDropdown() {
  const btn = document.getElementById('header-menu-btn');
  const dropdown = document.getElementById('header-dropdown');

  btn.classList.toggle('active');
  dropdown.classList.toggle('visible');

  if (dropdown.classList.contains('visible')) {
    // Close dropdown when clicking outside
    setTimeout(() => {
      document.addEventListener('click', closeDropdownOnClickOutside);
    }, 10);
  } else {
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

/**
 * Close dropdown when clicking outside
 */
function closeDropdownOnClickOutside(event) {
  const menu = document.querySelector('.header-menu');
  if (!menu.contains(event.target)) {
    const btn = document.getElementById('header-menu-btn');
    const dropdown = document.getElementById('header-dropdown');
    btn.classList.remove('active');
    dropdown.classList.remove('visible');
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

/**
 * Initialize header menu
 */
function initHeaderMenu() {
  const menuBtn = document.getElementById('header-menu-btn');
  const dropdown = document.getElementById('header-dropdown');

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleHeaderDropdown();
    });
  }

  if (dropdown) {
    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const modalType = item.dataset.modal;
        // Close dropdown
        document.getElementById('header-menu-btn').classList.remove('active');
        dropdown.classList.remove('visible');
        document.removeEventListener('click', closeDropdownOnClickOutside);

        // Open the appropriate modal
        if (modalType === 'methodology') {
          showMethodologyModal();
        } else {
          showModal(`${modalType}-modal`);
        }
      });
    });
  }
}

/**
 * Export results as an image
 */
async function exportResultsAsImage() {
  const btn = document.getElementById('export-results-btn');
  const content = document.getElementById('diet-content');

  if (!content || !window.html2canvas) {
    showToast('Export not available. Please try again.', 'error');
    return;
  }

  // Update button state
  btn.classList.add('exporting');
  const originalText = btn.querySelector('.export-text').textContent;
  btn.querySelector('.export-text').textContent = 'Saving...';

  try {
    // Create canvas from content
    const canvas = await html2canvas(content, {
      backgroundColor: '#000000',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `ancestral-diet-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      // Reset button
      btn.classList.remove('exporting');
      btn.querySelector('.export-text').textContent = originalText;
      showToast('Image saved to downloads!', 'success');
    }, 'image/png');
  } catch (error) {
    console.error('Export failed:', error);
    showToast('Failed to export results. Please try again.', 'error');
    btn.classList.remove('exporting');
    btn.querySelector('.export-text').textContent = originalText;
  }
}

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

  // Setup header menu dropdown
  initHeaderMenu();

  // Setup modal close handlers
  initModalHandlers();

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

  // Export results button
  document.getElementById('export-results-btn').addEventListener('click', exportResultsAsImage);

  // Methodology modal buttons
  document.getElementById('methodology-btn').addEventListener('click', showMethodologyModal);
  document.getElementById('methodology-footer-btn').addEventListener('click', showMethodologyModal);
  document.getElementById('methodology-close').addEventListener('click', hideMethodologyModal);

  // Close modal on overlay click
  document.getElementById('methodology-modal').addEventListener('click', (e) => {
    if (e.target.id === 'methodology-modal') {
      hideMethodologyModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideMethodologyModal();
    }
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
    showToast('Please select at least one grandparent ancestry', 'warning');
    return;
  }

  // For partial selection, confirm first before showing loading
  if (numSelected !== 4) {
    const confirm = window.confirm(
      `You've selected ${numSelected} out of 4 grandparents.\n\n` +
      `For the most accurate genetic predictions, we recommend selecting all 4 grandparents.\n\n` +
      `Continue with ${numSelected} grandparent${numSelected > 1 ? 's' : ''}?`
    );
    if (!confirm) return;
  }

  // Show loading overlay
  showLoading(numSelected === 4 ? 'Calculating Mendelian inheritance...' : 'Blending dietary traditions...');

  // Use setTimeout to allow the loading overlay to render
  setTimeout(() => {
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

    // Update loading text
    updateLoadingText('Analyzing genetic traits...');

    setTimeout(() => {
      if (numSelected === 4) {
        // Use Mendelian genetics
        const mendelianGenetics = calculateMendelianGenetics(grandparentDiets);

        updateLoadingText('Building personalized recommendations...');

        setTimeout(() => {
          const weights = [0.25, 0.25, 0.25, 0.25];
          const blended = blendDiets(regionIds, weights);

          // Show results area and hide loading
          showResults();
          showBlendedDietWithMendelian(blended, mendelianGenetics);
          hideLoading();

          // Save calculated diet and update profile
          saveUserDiet({ type: 'mendelian', blended, mendelianGenetics });
          updateProfileUI();
        }, 200);
      } else {
        // Fallback: weighted averaging
        const weight = 1.0 / numSelected;
        const weights = new Array(numSelected).fill(weight);
        const blended = blendDiets(regionIds, weights);

        // Show results area and hide loading
        showResults();
        showBlendedDiet(blended);
        hideLoading();

        // Save calculated diet and update profile
        saveUserDiet({ type: 'blended', blended });
        updateProfileUI();
      }
    }, 300);
  }, 100);
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
    showToast('Please select at least one ancestry and enter percentages', 'warning');
    return;
  }

  const total = weights.reduce((sum, w) => sum + w, 0);
  if (Math.abs(total - 1.0) > 0.01) {
    showToast('Percentages must total 100%', 'warning');
    return;
  }

  // Show loading overlay
  showLoading('Blending dietary traditions...');

  // Use setTimeout to allow the loading overlay to render
  setTimeout(() => {
    // Save user's DNA test selections (using nationality IDs for proper restoration)
    saveUserDNATest(dnaSelections);

    updateLoadingText('Building personalized recommendations...');

    setTimeout(() => {
      const blended = blendDiets(regionIds, weights);

      // Show results area and hide loading
      showResults();
      showBlendedDiet(blended);
      hideLoading();

      // Save calculated diet and update profile
      saveUserDiet({ type: 'dna', blended });
      updateProfileUI();
    }, 300);
  }, 100);
}

// Initialize on load
init();
