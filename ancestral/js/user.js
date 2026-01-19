/**
 * User module - handles user profile storage and retrieval
 * Uses localStorage for persistence
 */

const USER_STORAGE_KEY = 'ancestralDietUser';

/**
 * Word lists for username generation
 */
const adjectives = [
  'swift', 'bright', 'calm', 'bold', 'wild', 'free', 'wise', 'pure',
  'vast', 'keen', 'quiet', 'deep', 'warm', 'cool', 'strong', 'gentle',
  'lucky', 'brave', 'noble', 'true', 'clear', 'fierce', 'kind', 'sage',
  'lunar', 'solar', 'misty', 'crisp', 'vivid', 'serene', 'bliss', 'stony',
  'amber', 'jade', 'ivory', 'azure', 'golden', 'silver', 'copper', 'iron'
];

const nouns = [
  'mountain', 'river', 'forest', 'ocean', 'valley', 'meadow', 'stone', 'wind',
  'flame', 'wave', 'cloud', 'star', 'moon', 'sun', 'tree', 'leaf',
  'fox', 'wolf', 'bear', 'hawk', 'eagle', 'owl', 'deer', 'whale',
  'tiger', 'lion', 'dragon', 'phoenix', 'raven', 'sparrow', 'rune', 'sage',
  'peak', 'crest', 'ridge', 'shore', 'creek', 'brook', 'path', 'trail'
];

/**
 * Generate a random username in format: adjective-noun-number
 * @returns {string} Random username like "bliss-rune-3343"
 */
function generateRandomUsername() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(1000 + Math.random() * 9000); // 1000-9999

  return `${adjective}-${noun}-${number}`;
}

/**
 * Default user structure
 */
function createDefaultUser() {
  return {
    id: generateUserId(),
    username: generateRandomUsername(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // Ancestry selections
    ancestry: {
      mode: 'family', // 'family' or 'dna'

      // Family Tree mode selections
      familyTree: {
        maternalGrandmother: null,
        maternalGrandfather: null,
        paternalGrandmother: null,
        paternalGrandfather: null
      },

      // DNA Test mode selections
      dnaTest: [
        { regionId: null, percent: 0 },
        { regionId: null, percent: 0 },
        { regionId: null, percent: 0 },
        { regionId: null, percent: 0 }
      ]
    },

    // Saved diet results
    savedDiet: null
  };
}

/**
 * Generate a unique user ID
 */
function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get the current user from localStorage
 * Creates a new user if none exists
 * @returns {Object} User object
 */
function getUser() {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load user from localStorage:', e);
  }

  // Create new user if none exists
  const newUser = createDefaultUser();
  saveUser(newUser);
  return newUser;
}

/**
 * Save user to localStorage
 * @param {Object} user - User object to save
 */
function saveUser(user) {
  try {
    user.updatedAt = new Date().toISOString();
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save user to localStorage:', e);
  }
}

/**
 * Update user's ancestry mode
 * @param {string} mode - 'family' or 'dna'
 */
function setUserAncestryMode(mode) {
  const user = getUser();
  user.ancestry.mode = mode;
  saveUser(user);
}

/**
 * Save family tree selections
 * @param {Object} selections - { mgm, mgf, pgm, pgf } region IDs
 */
function saveUserFamilyTree(selections) {
  const user = getUser();
  user.ancestry.familyTree = {
    maternalGrandmother: selections.mgm || null,
    maternalGrandfather: selections.mgf || null,
    paternalGrandmother: selections.pgm || null,
    paternalGrandfather: selections.pgf || null
  };
  saveUser(user);
}

/**
 * Save DNA test selections
 * @param {Array} selections - Array of { regionId, percent } objects
 */
function saveUserDNATest(selections) {
  const user = getUser();
  user.ancestry.dnaTest = selections.map(s => ({
    regionId: s.regionId || null,
    percent: s.percent || 0
  }));
  saveUser(user);
}

/**
 * Save calculated diet results
 * @param {Object} dietData - The diet calculation results
 */
function saveUserDiet(dietData) {
  const user = getUser();
  user.savedDiet = {
    calculatedAt: new Date().toISOString(),
    mode: user.ancestry.mode,
    data: dietData
  };
  saveUser(user);
}

/**
 * Get user's saved ancestry selections
 * @returns {Object} Ancestry data
 */
function getUserAncestry() {
  const user = getUser();
  return user.ancestry;
}

/**
 * Get user's saved diet
 * @returns {Object|null} Saved diet or null
 */
function getUserSavedDiet() {
  const user = getUser();
  return user.savedDiet;
}

/**
 * Clear user's saved diet
 */
function clearUserDiet() {
  const user = getUser();
  user.savedDiet = null;
  saveUser(user);
}

/**
 * Clear all user data (reset to default)
 */
function clearUserData() {
  const newUser = createDefaultUser();
  saveUser(newUser);
  return newUser;
}

/**
 * Check if user has any saved ancestry data
 * @returns {boolean}
 */
function userHasSavedData() {
  const user = getUser();

  // Check family tree
  const ft = user.ancestry.familyTree;
  const hasFamilyData = ft.maternalGrandmother || ft.maternalGrandfather ||
                        ft.paternalGrandmother || ft.paternalGrandfather;

  // Check DNA test
  const hasDNAData = user.ancestry.dnaTest.some(s => s.regionId && s.percent > 0);

  return hasFamilyData || hasDNAData;
}

/**
 * Restore user selections to the UI
 * Call this after dropdowns are populated
 */
function restoreUserSelections() {
  const user = getUser();

  // Restore mode
  if (user.ancestry.mode === 'dna') {
    document.getElementById('dna-mode-btn').click();
  }

  // Restore family tree selections
  const ft = user.ancestry.familyTree;
  if (ft.maternalGrandmother) {
    document.getElementById('mgm-region').value = ft.maternalGrandmother;
  }
  if (ft.maternalGrandfather) {
    document.getElementById('mgf-region').value = ft.maternalGrandfather;
  }
  if (ft.paternalGrandmother) {
    document.getElementById('pgm-region').value = ft.paternalGrandmother;
  }
  if (ft.paternalGrandfather) {
    document.getElementById('pgf-region').value = ft.paternalGrandfather;
  }

  // Restore DNA test selections
  user.ancestry.dnaTest.forEach((selection, idx) => {
    const i = idx + 1;
    if (selection.regionId) {
      document.getElementById(`ancestry${i}-region`).value = selection.regionId;
    }
    if (selection.percent) {
      document.getElementById(`ancestry${i}-percent`).value = selection.percent;
    }
  });

  // Update percentage total display if in DNA mode
  if (user.ancestry.mode === 'dna') {
    updatePercentageTotal();
  }
}

/**
 * Update the user profile section UI
 * Shows saved diet info and enables/disables buttons
 */
function updateProfileUI() {
  const user = getUser();
  const summaryEl = document.getElementById('profile-summary');
  const viewBtn = document.getElementById('view-saved-diet-btn');
  const clearBtn = document.getElementById('clear-profile-btn');

  if (!summaryEl) return;

  if (user.savedDiet && user.savedDiet.data) {
    // Format the saved date
    const savedDate = new Date(user.savedDiet.calculatedAt);
    const dateStr = savedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Get ancestry names for display
    const ancestryNames = getAncestryNamesFromSavedDiet(user.savedDiet);

    summaryEl.innerHTML = `
      <div class="profile-info">
        <div class="profile-stat">
          <span class="stat-label">Mode:</span>
          <span class="stat-value">${user.savedDiet.mode === 'family' ? 'Family Tree' : 'DNA Test'}</span>
        </div>
        <div class="profile-stat">
          <span class="stat-label">Saved:</span>
          <span class="stat-value">${dateStr}</span>
        </div>
        <div class="profile-ancestry">
          <span class="stat-label">Ancestry:</span>
          <span class="stat-value ancestry-list">${ancestryNames}</span>
        </div>
      </div>
    `;

    viewBtn.style.display = 'block';
    clearBtn.style.display = 'block';
  } else {
    summaryEl.innerHTML = `
      <p class="no-saved-data">No saved diet yet. Calculate your diet to save results.</p>
    `;
    viewBtn.style.display = 'none';
    clearBtn.style.display = 'none';
  }
}

/**
 * Get ancestry names from saved diet data
 * @param {Object} savedDiet - The saved diet object
 * @returns {string} Comma-separated ancestry names
 */
function getAncestryNamesFromSavedDiet(savedDiet) {
  if (!savedDiet || !savedDiet.data) return 'Unknown';

  const blended = savedDiet.data.blended;
  if (blended && blended.geos) {
    return blended.geos.map(g => g.name).join(', ');
  }

  return 'Unknown';
}

/**
 * Display the saved diet in the diet panel
 * Restores the previously calculated diet from localStorage
 */
function displaySavedDiet() {
  const savedDiet = getUserSavedDiet();
  if (!savedDiet || !savedDiet.data) {
    alert('No saved diet found. Please calculate your diet first.');
    return;
  }

  const dietData = savedDiet.data;

  // Show results and display the diet based on type
  if (typeof showResults === 'function') {
    showResults();
  }
  
  // Display the diet based on type
  if (dietData.type === 'mendelian' && dietData.mendelianGenetics) {
    showBlendedDietWithMendelian(dietData.blended, dietData.mendelianGenetics);
  } else if (dietData.blended) {
    showBlendedDiet(dietData.blended);
  }
}

/**
 * Display the username in the UI
 */
function displayUsername() {
  const user = getUser();
  const usernameEl = document.getElementById('user-username');
  if (usernameEl && user.username) {
    usernameEl.textContent = user.username;
  }
}

/**
 * Ensure user has a username (for existing users without one)
 */
function ensureUsername() {
  const user = getUser();
  if (!user.username) {
    user.username = generateRandomUsername();
    saveUser(user);
  }
}

/**
 * Setup user profile event handlers
 */
function setupProfileEventHandlers() {
  const viewBtn = document.getElementById('view-saved-diet-btn');
  const clearBtn = document.getElementById('clear-profile-btn');

  if (viewBtn) {
    viewBtn.addEventListener('click', displaySavedDiet);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your profile? This will delete your saved ancestry selections and diet results.')) {
        clearUserData();
        updateProfileUI();

        // Clear UI selections
        ['mgm-region', 'mgf-region', 'pgm-region', 'pgf-region'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });

        [1, 2, 3, 4].forEach(i => {
          const regionEl = document.getElementById(`ancestry${i}-region`);
          const percentEl = document.getElementById(`ancestry${i}-percent`);
          if (regionEl) regionEl.value = '';
          if (percentEl) percentEl.value = 0;
        });

        // Update percentage total if needed
        if (typeof updatePercentageTotal === 'function') {
          updatePercentageTotal();
        }

        // Hide results
        if (typeof hideResults === 'function') {
          hideResults();
        }
      }
    });
  }
}
