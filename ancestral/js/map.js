/**
 * Map module - handles Leaflet map initialization and interactions
 */

// Map state
let map = null;
let geojsonLayer = null;
let hoverTooltip = null;
let lastHighlightedLayer = null;
let currentRegionId = null;
let selectedMapLayers = new Map();
let selectedRegions = [];

// Throttling state
let lastRegionCheck = 0;
const REGION_CHECK_THROTTLE = 25;

// Area cache for performance
const layerAreaCache = new WeakMap();

/**
 * Initialize the Leaflet map
 */
function initializeMap() {
  map = L.map('map', {
    center: [30, 0],
    zoom: 2,
    minZoom: 3,
    maxZoom: 10
  });

  // Add base map - Alidade Smooth Dark
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '© Stadia Maps, © OpenStreetMap',
    maxZoom: 19
  }).addTo(map);

  // Load and add GeoJSON regions
  geojsonLayer = L.geoJSON(regionsGeoJSON, {
    style: styleFeature,
    onEachFeature: onEachFeature
  }).addTo(map);

  // Setup map-level hover detection
  setupMapHover();
}

/**
 * Default styling for regions (invisible)
 */
function styleFeature(feature) {
  return {
    fillColor: '#000000',
    weight: 0,
    opacity: 0,
    color: 'transparent',
    fillOpacity: 0
  };
}

/**
 * Style for selected regions (persistent highlight)
 */
function selectedStyle() {
  return {
    weight: 3,
    opacity: 0.9,
    color: '#e74c3c',
    fillOpacity: 0.25,
    fillColor: '#e74c3c'
  };
}

/**
 * Highlight a region on the map by ID
 * @param {string} regionId - Region ID to highlight
 */
function highlightRegionOnMap(regionId) {
  geojsonLayer.eachLayer(function(layer) {
    if (layer.feature && layer.feature.properties.id === regionId) {
      layer.setStyle(selectedStyle());
      selectedMapLayers.set(regionId, layer);
    }
  });
}

/**
 * Remove highlight from a region
 * @param {string} regionId - Region ID to unhighlight
 */
function unhighlightRegionOnMap(regionId) {
  const layer = selectedMapLayers.get(regionId);
  if (layer) {
    geojsonLayer.resetStyle(layer);
    selectedMapLayers.delete(regionId);
  }
}

/**
 * Clear all selected region highlights
 */
function clearAllMapSelections() {
  selectedMapLayers.forEach((layer, regionId) => {
    geojsonLayer.resetStyle(layer);
  });
  selectedMapLayers.clear();
}

/**
 * Fly to show all selected regions
 * @param {string[]} regionIds - Array of region IDs
 */
function flyToRegions(regionIds) {
  if (regionIds.length === 0) return;

  if (regionIds.length === 1) {
    const geo = getGeoById(regionIds[0]);
    if (geo) {
      map.flyTo([geo.centroid.lat, geo.centroid.lon], 4, {
        animate: true,
        duration: 1.5
      });
    }
  } else {
    const bounds = L.latLngBounds();
    regionIds.forEach(id => {
      const geo = getGeoById(id);
      if (geo && geo.bbox) {
        bounds.extend([geo.bbox.min_lat, geo.bbox.min_lon]);
        bounds.extend([geo.bbox.max_lat, geo.bbox.max_lon]);
      } else if (geo && geo.centroid) {
        bounds.extend([geo.centroid.lat, geo.centroid.lon]);
      }
    });
    if (bounds.isValid()) {
      map.flyToBounds(bounds, {
        padding: [50, 50],
        animate: true,
        duration: 1.5
      });
    }
  }
}

/**
 * Setup feature event handlers
 */
function onEachFeature(feature, layer) {
  layer.on({
    click: clickFeature
  });
}

/**
 * Setup map-level hover detection
 */
function setupMapHover() {
  map.on('mousemove', function(e) {
    const latlng = e.latlng;

    // Always update tooltip position immediately
    if (hoverTooltip) {
      hoverTooltip.setLatLng(latlng);
    }

    // Determine if we need immediate check
    let needsImmediateCheck = false;

    if (lastHighlightedLayer && currentRegionId) {
      const currentBounds = lastHighlightedLayer.getBounds();
      if (!currentBounds.contains(latlng)) {
        needsImmediateCheck = true;
      } else {
        if (!isPointInLayer(latlng, lastHighlightedLayer)) {
          needsImmediateCheck = true;
        }
      }
    } else {
      needsImmediateCheck = true;
    }

    // Throttle unless we need immediate check
    const now = Date.now();
    if (!needsImmediateCheck && now - lastRegionCheck < REGION_CHECK_THROTTLE) {
      return;
    }
    lastRegionCheck = now;

    checkRegionAtPoint(latlng);
  });

  map.on('mouseout', clearHover);
}

/**
 * Check which region is at a given point
 */
function checkRegionAtPoint(latlng) {
  const overlappingLayers = [];
  geojsonLayer.eachLayer(function(l) {
    if (l.feature && l.getBounds) {
      const bounds = l.getBounds();
      if (bounds.contains(latlng)) {
        if (isPointInLayer(latlng, l)) {
          overlappingLayers.push({
            layer: l,
            area: calculateLayerArea(l),
            props: l.feature.properties
          });
        }
      }
    }
  });

  if (overlappingLayers.length === 0) {
    clearHover();
    return;
  }

  // Sort by area and get smallest (most specific region)
  overlappingLayers.sort((a, b) => a.area - b.area);
  const targetRegion = overlappingLayers[0];

  if (currentRegionId !== targetRegion.props.id) {
    // Reset previous highlight (only if not a selected region)
    if (lastHighlightedLayer && !selectedMapLayers.has(currentRegionId)) {
      geojsonLayer.resetStyle(lastHighlightedLayer);
    }

    // Highlight new region (only if not already selected)
    if (!selectedMapLayers.has(targetRegion.props.id)) {
      targetRegion.layer.setStyle({
        weight: 2,
        opacity: 0.7,
        color: '#3498db',
        fillOpacity: 0.1
      });
    }
    lastHighlightedLayer = targetRegion.layer;
    currentRegionId = targetRegion.props.id;

    updateTooltip(latlng, targetRegion.props.name, targetRegion.props.id);
  }
}

/**
 * Update or create hover tooltip
 */
function updateTooltip(latlng, name, regionId) {
  // Get diet data for food summary
  const diet = getDietById(regionId);
  let foodSummary = '';

  if (diet) {
    const foods = [...diet.staples.slice(0, 3), ...diet.proteins.slice(0, 2)];
    foodSummary = `<div style="font-size: 11px; color: #aaa; margin-top: 4px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${foods.join(', ')}</div>`;
  }

  const content = `<strong>${name}</strong>${foodSummary}<span style="font-size: 10px; color: #666; display: block; margin-top: 4px;">Click to view full diet</span>`;

  if (hoverTooltip) {
    hoverTooltip.setContent(content);
    hoverTooltip.setLatLng(latlng);
  } else {
    hoverTooltip = L.tooltip({
      permanent: true,
      direction: 'top',
      offset: [0, -10],
      className: 'region-tooltip'
    })
    .setLatLng(latlng)
    .setContent(content)
    .addTo(map);
  }
}

/**
 * Clear hover state
 */
function clearHover() {
  if (lastHighlightedLayer && !selectedMapLayers.has(currentRegionId)) {
    geojsonLayer.resetStyle(lastHighlightedLayer);
  }
  lastHighlightedLayer = null;
  if (hoverTooltip) {
    map.removeLayer(hoverTooltip);
    hoverTooltip = null;
  }
  currentRegionId = null;
}

/**
 * Handle click on a feature
 */
function clickFeature(e) {
  const clickLatLng = e.latlng;
  const clickedLayers = [];

  geojsonLayer.eachLayer(function(layer) {
    if (layer.feature && layer.getBounds) {
      const bounds = layer.getBounds();
      if (bounds.contains(clickLatLng)) {
        if (isPointInLayer(clickLatLng, layer)) {
          const area = calculateLayerArea(layer);
          clickedLayers.push({
            layer: layer,
            area: area,
            id: layer.feature.properties.id
          });
        }
      }
    }
  });

  if (clickedLayers.length > 0) {
    clickedLayers.sort((a, b) => a.area - b.area);
    const smallestRegion = clickedLayers[0];
    selectRegion(smallestRegion.id);
  }
}

/**
 * Check if point is inside a polygon layer
 */
function isPointInLayer(latlng, layer) {
  if (layer.getLayers) {
    const subLayers = layer.getLayers();
    for (const subLayer of subLayers) {
      if (isPointInLayer(latlng, subLayer)) {
        return true;
      }
    }
    return false;
  }

  if (layer.getLatLngs) {
    const latLngs = layer.getLatLngs();
    return checkPointInLatLngs(latlng, latLngs);
  }

  return false;
}

/**
 * Recursively check point against LatLngs structure
 */
function checkPointInLatLngs(point, latLngs) {
  if (!latLngs || latLngs.length === 0) return false;

  if (latLngs[0] && latLngs[0].lat !== undefined) {
    return isPointInRing(point, latLngs);
  }

  if (Array.isArray(latLngs[0])) {
    for (const ring of latLngs) {
      if (Array.isArray(ring) && ring.length > 0) {
        if (ring[0] && ring[0].lat !== undefined) {
          if (isPointInRing(point, ring)) {
            return true;
          }
        } else if (Array.isArray(ring[0])) {
          if (checkPointInLatLngs(point, ring)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * Ray casting point-in-polygon algorithm
 */
function isPointInRing(point, ring) {
  if (!ring || ring.length < 3) return false;

  let inside = false;
  const x = point.lng, y = point.lat;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i].lng, yi = ring[i].lat;
    const xj = ring[j].lng, yj = ring[j].lat;

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Calculate approximate area of a layer's bounding box
 */
function calculateLayerArea(layer) {
  if (layerAreaCache.has(layer)) {
    return layerAreaCache.get(layer);
  }

  let area = Infinity;
  if (layer.getBounds) {
    const bounds = layer.getBounds();
    const width = bounds.getEast() - bounds.getWest();
    const height = bounds.getNorth() - bounds.getSouth();
    area = width * height;
  }

  layerAreaCache.set(layer, area);
  return area;
}

/**
 * Select a region (single selection mode)
 * @param {string} regionId - Region ID to select
 */
function selectRegion(regionId) {
  const geo = getGeoById(regionId);
  const diet = getDietById(regionId);
  if (!geo || !diet) return;

  // If clicking the same region, deselect it
  if (selectedRegions.includes(regionId) && selectedRegions.length === 1) {
    selectedRegions = [];
    clearAllMapSelections();
    updateSelectedRegionsDisplay();
    document.getElementById('diet-panel').classList.remove('visible');
    return;
  }

  // Single selection - clear previous and select new
  selectedRegions = [regionId];
  clearAllMapSelections();
  highlightRegionOnMap(regionId);
  updateSelectedRegionsDisplay();

  // Show diet panel
  showDietPanel(diet, geo);

  // Fly to region
  map.flyTo([geo.centroid.lat, geo.centroid.lon], 4, {
    animate: true,
    duration: 1.5
  });
}
