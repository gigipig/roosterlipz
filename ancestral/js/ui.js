/**
 * UI module - dropdown population and display updates
 */

// Selected regions (for display purposes)
let selectedRegions = [];

// Store original dropdown options for filtering
let originalDropdownOptions = null;

/**
 * Populate all ancestry dropdowns with nationality options
 * Users see nationalities (e.g., "Polish") which map to dietary regions (e.g., "eastern_europe")
 * Each option has a unique nationality ID as its value (e.g., "polish")
 */
function populateDropdowns() {
  const grouped = getNationalitiesGrouped();

  // Build options HTML with nationalities grouped by continent
  let optionsHTML = '<option value="">Select ancestry...</option>';

  // Sort continents alphabetically
  Object.keys(grouped).sort().forEach(continent => {
    optionsHTML += `<optgroup label="${continent}">`;
    grouped[continent].forEach(({ id, name }) => {
      // Use unique nationality ID as value, display name as text
      optionsHTML += `<option value="${id}">${name}</option>`;
    });
    optionsHTML += '</optgroup>';
  });

  // Store original options for filtering
  originalDropdownOptions = optionsHTML;

  // Apply to all dropdowns
  const dropdownIds = [
    'mgm-region', 'mgf-region', 'pgm-region', 'pgf-region',
    'ancestry1-region', 'ancestry2-region', 'ancestry3-region', 'ancestry4-region'
  ];

  dropdownIds.forEach(id => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      dropdown.innerHTML = optionsHTML;
    }
  });

  // Setup search functionality
  setupAncestrySearch();
}

/**
 * Setup ancestry search functionality
 */
function setupAncestrySearch() {
  const searchInput = document.getElementById('ancestry-search');
  const clearBtn = document.getElementById('search-clear-btn');

  if (!searchInput) return;

  // Show/hide clear button
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim()) {
      clearBtn.style.display = 'block';
    } else {
      clearBtn.style.display = 'none';
    }
    filterDropdowns(searchInput.value.trim());
  });

  // Clear search
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    filterDropdowns('');
  });

  // Clear on Escape key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      filterDropdowns('');
      searchInput.blur();
    }
  });
}

/**
 * Filter dropdown options based on search query
 * @param {string} query - Search query string
 */
function filterDropdowns(query) {
  const dropdownIds = [
    'mgm-region', 'mgf-region', 'pgm-region', 'pgf-region',
    'ancestry1-region', 'ancestry2-region', 'ancestry3-region', 'ancestry4-region'
  ];

  // Collect all currently selected values to preserve them
  const selectedValues = new Set();
  dropdownIds.forEach(id => {
    const dropdown = document.getElementById(id);
    if (dropdown && dropdown.value) {
      selectedValues.add(dropdown.value);
    }
  });

  // If no query, restore original options
  if (!query) {
    if (originalDropdownOptions) {
      dropdownIds.forEach(id => {
        const dropdown = document.getElementById(id);
        if (dropdown) {
          const currentValue = dropdown.value; // Preserve current selection
          dropdown.innerHTML = originalDropdownOptions;
          if (currentValue) {
            dropdown.value = currentValue;
          }
        }
      });
    }
    return;
  }

  // Get nationality data and filter
  const grouped = getNationalitiesGrouped();
  const searchLower = query.toLowerCase();

  // Build a map of all nationalities by ID for quick lookup
  const allNationalitiesMap = new Map();
  Object.values(grouped).forEach(nationalities => {
    nationalities.forEach(({ id, name, regionId }) => {
      allNationalitiesMap.set(id, { id, name, regionId });
    });
  });

  // Find which continents contain the selected values
  const selectedNationalitiesByContinent = {};
  selectedValues.forEach(selectedId => {
    // Find which continent this nationality belongs to
    for (const [continent, nationalities] of Object.entries(grouped)) {
      const found = nationalities.find(n => n.id === selectedId);
      if (found) {
        if (!selectedNationalitiesByContinent[continent]) {
          selectedNationalitiesByContinent[continent] = [];
        }
        selectedNationalitiesByContinent[continent].push(found);
        break;
      }
    }
  });

  // Build filtered options
  let filteredHTML = '<option value="">Select ancestry...</option>';

  // Sort continents alphabetically and filter
  Object.keys(grouped).sort().forEach(continent => {
    // Get matching nationalities
    const matchingNationalities = grouped[continent].filter(({ name }) => {
      return name.toLowerCase().includes(searchLower);
    });

    // Add selected nationalities that don't match search (to preserve selections)
    const selectedInContinent = selectedNationalitiesByContinent[continent] || [];
    selectedInContinent.forEach(selected => {
      // Only add if not already in matching list
      if (!matchingNationalities.find(m => m.id === selected.id)) {
        matchingNationalities.push(selected);
      }
    });

    // Sort the combined list by name
    matchingNationalities.sort((a, b) => a.name.localeCompare(b.name));

    // Only add optgroup if it has options
    if (matchingNationalities.length > 0) {
      filteredHTML += `<optgroup label="${continent}">`;
      matchingNationalities.forEach(({ id, name }) => {
        filteredHTML += `<option value="${id}">${name}</option>`;
      });
      filteredHTML += '</optgroup>';
    }
  });

  // Apply filtered options to all dropdowns, preserving selections
  dropdownIds.forEach(id => {
    const dropdown = document.getElementById(id);
    if (dropdown) {
      const currentValue = dropdown.value; // Preserve current selection
      dropdown.innerHTML = filteredHTML;
      
      // Always restore the selection if it was set
      if (currentValue) {
        dropdown.value = currentValue;
      }
    }
  });
}

/**
 * Update the selected regions display
 */
function updateSelectedRegionsDisplay() {
  const container = document.getElementById('selected-regions');
  const tagsContainer = document.getElementById('region-tags');

  if (selectedRegions.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  tagsContainer.innerHTML = '';

  selectedRegions.forEach(regionId => {
    const geo = getGeoById(regionId);
    if (geo) {
      const tag = document.createElement('span');
      tag.className = 'region-tag';
      tag.textContent = geo.name;
      tagsContainer.appendChild(tag);
    }
  });
}

/**
 * Update the percentage total display for DNA test mode
 */
function updatePercentageTotal() {
  const percents = [1, 2, 3, 4].map(i =>
    parseFloat(document.getElementById(`ancestry${i}-percent`).value) || 0
  );

  const total = percents.reduce((a, b) => a + b, 0);
  const totalEl = document.getElementById('percentage-total');
  const blendBtn = document.getElementById('dna-calculate-btn');

  totalEl.textContent = `Total: ${total}%`;

  if (total === 100) {
    totalEl.classList.remove('invalid');
    totalEl.classList.add('valid');
    blendBtn.disabled = false;
  } else {
    totalEl.classList.remove('valid');
    totalEl.classList.add('invalid');
    blendBtn.disabled = true;
  }
}
