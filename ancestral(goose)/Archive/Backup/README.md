# Ancestral Diet Map - Complete Implementation Guide

## Overview

A production-ready Mapbox GL JS application for exploring ancestral diet patterns across 57 geographic regions worldwide.

**Key Features:**
- 68 ancestral diet patterns with complete nutritional data
- 57 geographic regions with 100% global land coverage
- Interactive 3D globe with Mapbox GL
- Zero-dependency Python region generator
- Point-in-polygon region detection
- Published Mapbox style with tileset

## Project Structure

```
ancestral-diet-app/
├── ancestral_diets_geo.json      # 68 diet patterns (~88KB)
├── ancestral_regions.geojson     # 57 bbox regions (~35KB)
├── generate_regions_simple.py    # Region generator (Python)
├── index.html                    # Complete working demo
└── README.md                     # This file
```

## Quick Start

### Step 1: Get Mapbox Token

1. Sign up at https://www.mapbox.com/
2. Create an access token
3. Copy your token

### Step 2: Update Configuration

Edit `index.html` line 242:

```javascript
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN_HERE';
```

### Step 3: Generate Regions

```bash
python generate_regions_simple.py
```

This creates `ancestral_regions.geojson` with 57 overlapping bounding box regions.

### Step 4: Serve Files

```bash
# Python
python3 -m http.server 8000

# Node.js
npx http-server -p 8000
```

### Step 5: Open in Browser

```
http://localhost:8000/index.html
```

## File Descriptions

### ancestral_diets_geo.json

Complete diet database with 68 cultural patterns.

**Structure:**
```json
{
  "version": "2.0",
  "cultures": [
    {
      "id": "med_southern",
      "name": "Mediterranean - Southern European",
      "centroid": {"lat": 41.0, "lon": 15.0},
      "bbox": {...},
      "diet_signature": "Sun-drenched cuisine...",
      "staples": ["wheat", "barley", "legumes"],
      "proteins": ["fish", "goat", "sheep"],
      "fats": ["olive oil", "nuts"],
      "herbs_spices": ["oregano", "basil"],
      "cooking_methods": ["grilling", "roasting"],
      "typical_dishes": [...],
      "modern_substitutes": {...},
      "macros": {
        "carbs_pct": 50,
        "protein_pct": 15,
        "fat_pct": 35
      }
    }
  ]
}
```

### ancestral_regions.geojson

GeoJSON FeatureCollection with 57 rectangular bounding box regions.

**Features:**
- Overlapping boxes for 100% coverage
- Region property for continent-based coloring
- Simple geometries for fast rendering

**Example Feature:**
```json
{
  "type": "Feature",
  "id": 0,
  "properties": {
    "id": "eastern_europe",
    "name": "Eastern Europe",
    "region": "Europe"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[10.0, 41.0], [51.0, 41.0], ...]]
  }
}
```

### generate_regions_simple.py

Python script that generates `ancestral_regions.geojson`.

**Features:**
- **Zero dependencies** - pure Python stdlib
- Creates 57 rectangular regions from bounding boxes
- Intentional overlaps (2-5°) to eliminate gaps
- Maps region IDs to continent names for coloring

**Key Sections:**
```python
# Maps region IDs → continent names for map coloring
REGION_TO_CONTINENT = {
    "eastern_europe": "Europe",
    "maghreb": "Africa",
    # ... 57 total
}

# Bounding box coordinates with overlaps
REGION_BBOXES = {
    "eastern_europe": {
        "min_lat": 41.0, "max_lat": 61.0,
        "min_lon": 10.0, "max_lon": 51.0  # Overlaps to cover Germany
    },
    # ... 57 total
}
```

**Run it:**
```bash
python generate_regions_simple.py
# Outputs: ancestral_regions.geojson
```

### index.html

Complete working application with:

- **Mapbox GL integration** with published style
- **Interactive map** with hover/click handlers
- **Region selection** via dropdown menus
- **Diet information panel** showing selected region's data
- **Geolocation** for auto-detecting user's region
- **Continent-based color coding** for visual grouping

**Key Code Sections:**

```javascript
// Line 242 - Configure your token
mapboxgl.accessToken = 'YOUR_TOKEN';

// Line 247 - Published Mapbox style
style: 'mapbox://styles/jardizzil/cmirbb672001p01r72nv0cs12'

// Line 260 - Load regions from GeoJSON
map.addSource('ancestral-regions', {
  type: 'geojson',
  data: 'ancestral_regions.geojson'
});

// Line 456 - Continent-based fill colors
'fill-color': [
  'match',
  ['get', 'region'],
  'Europe', '#FF6B6B',
  'Africa', '#FFA500',
  // ... etc
]
```

## Region Coverage

### Complete List (57 Regions)

**Europe (5):**
- western_europe, eastern_europe, nordic, med_southern, caucasus

**Africa (8):**
- maghreb, sahel, west_africa, central_africa, horn_somalia, ethiopia, maasai, southern_africa

**Middle East (5):**
- anatolian, med_levant, arabian, kurdish, persian

**Central Asia (3):**
- central_asia, mongolia, siberia

**South Asia (5):**
- north_india, south_india, west_india, bengal, nepal

**East Asia (6):**
- north_china, south_china, sichuan_sw_china, japan, korea, tibet

**Southeast Asia (3):**
- se_asia_main, highland_se_asia, se_asia_island

**Oceania (6):**
- aboriginal_aus, australian_coastal, melanesia, micronesia, polynesia, maori

**Americas (16):**
- inuit, subarctic, pacific_nw, canadian_prairies, great_plains, eastern_woodlands
- california_coast, southwest_us, southeast_us, mesoamerica, caribbean_taino
- amazon, andean, brazilian_coastal, gaucho, patagonia

### Recent Coverage Fixes

**Problem Areas Resolved:**
- ✅ Germany, Austria, Czech Republic, Slovakia, Hungary (eastern_europe expanded west to 10°E)
- ✅ Sudan, South Sudan (horn_somalia expanded west to 28°E)
- ✅ Libya, Egypt (maghreb expanded east to 38°E)
- ✅ Niger, Chad (sahel expanded east to 42°E)

**Method:**
Intentional 2-5° overlaps between adjacent regions ensure no gaps. When regions overlap, the last-rendered region (higher in the feature list) takes visual precedence.

## Mapbox Configuration

### Published Resources

**Tileset ID:** `jardizzil.257chu`  
**Style URL:** `mapbox://styles/jardizzil/cmirbb672001p01r72nv0cs12`

### Access Token Setup

1. Go to https://account.mapbox.com/access-tokens/
2. Create a new token or use existing
3. Add URL restrictions (recommended):
   - `http://localhost:*/*`
   - `https://yourdomain.com/*`
4. Copy token to `index.html` line 242

## Integration Examples

### React

```tsx
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function AncestralDietMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/jardizzil/cmirbb672001p01r72nv0cs12',
      projection: 'globe',
      center: [0, 30],
      zoom: 1.5
    });
    
    map.on('load', () => {
      map.addSource('ancestral-regions', {
        type: 'geojson',
        data: '/ancestral_regions.geojson'
      });
      
      // Add your layers here
    });
    
    return () => map.remove();
  }, []);
  
  return <div ref={mapContainer} style={{width: '100%', height: '600px'}} />;
}
```

### Vue

```vue
<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mapboxgl from 'mapbox-gl';

const mapContainer = ref(null);
let map = null;

onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/jardizzil/cmirbb672001p01r72nv0cs12',
    projection: 'globe',
    center: [0, 30],
    zoom: 1.5
  });
});

onUnmounted(() => {
  map?.remove();
});
</script>

<style>
.map-container {
  width: 100%;
  height: 600px;
}
</style>
```

## Customization

### Modifying Region Bounding Boxes

Edit `generate_regions_simple.py`:

```python
REGION_BBOXES = {
    "your_new_region": {
        "min_lat": -10.0,
        "max_lat": 10.0,
        "min_lon": -10.0,
        "max_lon": 10.0
    },
    # ... rest of regions
}
```

Then regenerate:
```bash
python generate_regions_simple.py
```

### Changing Map Colors

Edit the `fill-color` property in `index.html` (around line 456):

```javascript
'fill-color': [
  'match',
  ['get', 'region'],
  'Europe', '#YOUR_COLOR_HERE',
  'Africa', '#YOUR_COLOR_HERE',
  // ...
  '#DEFAULT_COLOR'
]
```

### Adding New Diet Data

Edit `ancestral_diets_geo.json`:

```json
{
  "id": "new_region",
  "name": "New Region Name",
  "centroid": {"lat": 0.0, "lon": 0.0},
  "bbox": {...},
  "staples": [...],
  "proteins": [...],
  "macros": {...}
}
```

Then update `generate_regions_simple.py` to include the new region's bounding box.

## Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)

1. **Build** (if using a bundler):
   ```bash
   npm run build
   ```

2. **Deploy files:**
   - `index.html`
   - `ancestral_diets_geo.json`
   - `ancestral_regions.geojson`

3. **Set environment variables:**
   ```
   MAPBOX_ACCESS_TOKEN=pk.your_token_here
   ```

### Docker

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY ancestral_diets_geo.json /usr/share/nginx/html/
COPY ancestral_regions.geojson /usr/share/nginx/html/
EXPOSE 80
```

Build and run:
```bash
docker build -t ancestral-diet-map .
docker run -p 8080:80 ancestral-diet-map
```

## Performance Optimization

### Simplify Regions (if needed)

Currently using simple bbox rectangles - already optimized!

If you switch to complex polygons later:

```bash
npm install -g mapshaper
mapshaper regions.geojson -simplify 10% -o simplified.geojson
```

### Browser Caching

Add cache headers for static assets (nginx example):

```nginx
location ~* \.(json|geojson)$ {
  expires 1d;
  add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Map doesn't load | Verify Mapbox token in index.html line 242 |
| Regions not showing | Check that ancestral_regions.geojson exists |
| Coverage gaps | Run `python generate_regions_simple.py` with updated bboxes |
| Region detection fails | Verify GeoJSON has proper "region" property |
| Need hard refresh | Press Ctrl + Shift + R after regenerating files |

## Browser Compatibility

**Supported:**
- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

**Requirements:**
- WebGL support (required by Mapbox GL JS)
- JavaScript enabled

## License

MIT License

## Credits

- **Mapbox GL JS** for interactive mapping
- **Ancestral diet data** compiled from ethnographic and nutritional research
- **Region generator** uses pure Python with zero dependencies

---

**Ready to explore ancestral diet patterns worldwide!** 🌍🍽️
