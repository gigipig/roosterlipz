/**
 * Onboarding wizard module
 * Handles the step-by-step grandparent ancestry selection wizard
 */

let currentStep = 1;
const totalSteps = 4;

const stepConfig = [
  { selectId: 'onboard-mgm', key: 'mgm' },
  { selectId: 'onboard-mgf', key: 'mgf' },
  { selectId: 'onboard-pgm', key: 'pgm' },
  { selectId: 'onboard-pgf', key: 'pgf' }
];

/**
 * Initialize the onboarding wizard
 * Called after data is loaded
 */
function initOnboarding() {
  // Check if user has saved data - skip onboarding
  if (userHasSavedData()) {
    hideOnboarding();
    return;
  }

  // Populate onboarding dropdowns
  populateOnboardingDropdowns();

  // Setup navigation handlers
  setupOnboardingNav();

  // Show first step
  showStep(1);
}

/**
 * Populate onboarding dropdowns with nationality options
 * Users see nationalities (e.g., "Polish") which map to dietary regions
 * Each option has a unique nationality ID as its value (e.g., "polish")
 */
function populateOnboardingDropdowns() {
  const grouped = getNationalitiesGrouped();

  // Build options HTML with nationalities grouped by continent
  let optionsHTML = '<option value="">Select your ancestry...</option>';

  // Sort continents alphabetically
  Object.keys(grouped).sort().forEach(continent => {
    optionsHTML += `<optgroup label="${continent}">`;
    grouped[continent].forEach(({ id, name }) => {
      // Use unique nationality ID as value, display name as text
      optionsHTML += `<option value="${id}">${name}</option>`;
    });
    optionsHTML += '</optgroup>';
  });

  // Apply to all onboarding selects
  stepConfig.forEach(step => {
    const select = document.getElementById(step.selectId);
    if (select) {
      select.innerHTML = optionsHTML;
    }
  });
}

/**
 * Setup onboarding navigation event handlers
 */
function setupOnboardingNav() {
  const backBtn = document.getElementById('onboard-back');
  const skipBtn = document.getElementById('onboard-skip');
  const nextBtn = document.getElementById('onboard-next');
  const skipAllBtn = document.getElementById('onboard-skip-all');

  backBtn.addEventListener('click', prevStep);
  skipBtn.addEventListener('click', skipStep);
  nextBtn.addEventListener('click', nextStep);
  skipAllBtn.addEventListener('click', skipOnboarding);
}

/**
 * Show a specific step
 * @param {number} step - Step number (1-4)
 */
function showStep(step) {
  currentStep = step;

  // Update progress indicators
  document.querySelectorAll('.progress-step').forEach((el, idx) => {
    el.classList.remove('active', 'completed');
    if (idx + 1 < step) {
      el.classList.add('completed');
    } else if (idx + 1 === step) {
      el.classList.add('active');
    }
  });

  // Show/hide step content
  document.querySelectorAll('.onboarding-step').forEach(el => {
    el.classList.remove('active');
  });
  const activeStep = document.querySelector(`.onboarding-step[data-step="${step}"]`);
  if (activeStep) {
    activeStep.classList.add('active');
  }

  // Update button states
  const backBtn = document.getElementById('onboard-back');
  const nextBtn = document.getElementById('onboard-next');

  backBtn.disabled = step === 1;

  if (step === totalSteps) {
    nextBtn.textContent = 'Finish';
    nextBtn.classList.add('finish');
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.classList.remove('finish');
  }
}

/**
 * Go to next step or complete onboarding
 */
function nextStep() {
  if (currentStep < totalSteps) {
    showStep(currentStep + 1);
  } else {
    completeOnboarding();
  }
}

/**
 * Go to previous step
 */
function prevStep() {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
}

/**
 * Skip current step (clear selection and move to next)
 */
function skipStep() {
  const selectId = stepConfig[currentStep - 1].selectId;
  const select = document.getElementById(selectId);
  if (select) {
    select.value = '';
  }
  nextStep();
}

/**
 * Skip onboarding entirely and go to map
 */
function skipOnboarding() {
  hideOnboarding();
}

/**
 * Complete onboarding - save selections and show main app
 */
function completeOnboarding() {
  // Gather all selections
  const selections = {
    mgm: document.getElementById('onboard-mgm').value || null,
    mgf: document.getElementById('onboard-mgf').value || null,
    pgm: document.getElementById('onboard-pgm').value || null,
    pgf: document.getElementById('onboard-pgf').value || null
  };

  // Check if at least one selection was made
  const hasSelection = Object.values(selections).some(v => v !== null);

  if (hasSelection) {
    // Save to user cache
    saveUserFamilyTree(selections);

    // Copy selections to main form
    copySelectionsToMainForm(selections);
  }

  // Hide onboarding, show main app
  hideOnboarding();
}

/**
 * Copy onboarding selections to the main form dropdowns
 * @param {Object} selections - { mgm, mgf, pgm, pgf } region IDs
 */
function copySelectionsToMainForm(selections) {
  const mapping = {
    mgm: 'mgm-region',
    mgf: 'mgf-region',
    pgm: 'pgm-region',
    pgf: 'pgf-region'
  };

  Object.entries(selections).forEach(([key, value]) => {
    if (value) {
      const mainSelect = document.getElementById(mapping[key]);
      if (mainSelect) {
        mainSelect.value = value;
      }
    }
  });
}

/**
 * Hide onboarding wizard and show main app
 */
function hideOnboarding() {
  const onboarding = document.getElementById('onboarding');
  if (onboarding) {
    onboarding.classList.add('hidden');
  }
}
