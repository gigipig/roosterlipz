/**
 * Data module - handles loading and lookup of culture/diet data
 */

// Global data stores
let geoData = null;
let dietData = null;
let regionsGeoJSON = null;

/**
 * Load all data files
 * @returns {Promise<void>}
 */
async function loadData() {
  [geoData, dietData, regionsGeoJSON] = await Promise.all([
    fetch('./cultures.json').then(r => r.json()),
    fetch('./diets.json').then(r => r.json()),
    fetch('./regions.geojson?v=' + Date.now()).then(r => r.json())
  ]);
}

/**
 * Get geographic data for a culture by ID
 * @param {string} id - Culture ID
 * @returns {Object|undefined} Geographic data object
 */
function getGeoById(id) {
  return geoData.cultures.find(c => c.id === id);
}

/**
 * Get diet data for a culture by ID
 * @param {string} id - Culture ID
 * @returns {Object|undefined} Diet data object
 */
function getDietById(id) {
  return dietData.cultures.find(c => c.id === id);
}

/**
 * Country/region groupings for UI organization
 */
const REGION_GROUPS = {
  'United States': ['eastern_woodlands', 'southeast_us', 'great_plains', 'southwest_us', 'pacific_nw', 'california_coast'],
  'Canada': ['subarctic', 'pacific_nw', 'canadian_prairies', 'eastern_woodlands'],
  'China': ['north_china', 'south_china', 'sichuan_sw_china', 'tibet'],
  'India': ['north_india', 'south_india', 'west_india', 'bengal', 'nepal'],
  'Russia': ['eastern_europe', 'siberia'],
  'Brazil': ['amazon', 'brazilian_coastal', 'gaucho'],
  'Australia': ['aboriginal_aus', 'australian_coastal']
};

/**
 * Group cultures by their geographic location
 * @returns {Object} Object with grouped and standalone cultures
 */
function groupCulturesByLocation() {
  const grouped = {};
  const standalone = [];

  geoData.cultures.forEach(culture => {
    let foundGroup = false;

    for (const [groupName, cultureIds] of Object.entries(REGION_GROUPS)) {
      if (cultureIds.includes(culture.id)) {
        if (!grouped[groupName]) {
          grouped[groupName] = [];
        }
        grouped[groupName].push(culture);
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      standalone.push(culture);
    }
  });

  // Sort within groups
  for (const groupName in grouped) {
    grouped[groupName].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Sort standalone
  standalone.sort((a, b) => a.name.localeCompare(b.name));

  return { grouped, standalone };
}

/**
 * Normalize an array of weights to sum to 1
 * @param {number[]} weights - Array of weights
 * @returns {number[]} Normalized weights
 */
function normalizeWeights(weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  return sum > 0 ? weights.map(w => w / sum) : weights;
}
