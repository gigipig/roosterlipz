/**
 * UI module - dropdown population and display updates
 */

/**
 * Populate all ancestry dropdowns with grouped options
 */
function populateDropdowns() {
  const { grouped, standalone } = groupCulturesByLocation();

  // Build options HTML
  let optionsHTML = '<option value="">Select ancestry...</option>';

  // Add grouped options
  Object.keys(grouped).sort().forEach(groupName => {
    optionsHTML += `<optgroup label="${groupName}">`;
    grouped[groupName].forEach(culture => {
      optionsHTML += `<option value="${culture.id}">${culture.name}</option>`;
    });
    optionsHTML += '</optgroup>';
  });

  // Add standalone options
  if (standalone.length > 0) {
    optionsHTML += '<optgroup label="Other Regions">';
    standalone.forEach(culture => {
      optionsHTML += `<option value="${culture.id}">${culture.name}</option>`;
    });
    optionsHTML += '</optgroup>';
  }

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
