# Ancestral Diet Map - Quick Reference Card

## 🚀 Instant Setup (30 seconds)

```bash
# 1. Get Mapbox token from https://www.mapbox.com/
# 2. Edit index.html line 242 with your token
# 3. Generate regions:
python generate_regions_simple.py
# 4. Run local server:
python3 -m http.server 8000
# 5. Open: http://localhost:8000/index.html
```

## 📦 Core Files

| File | Purpose | Size |
|------|---------|------|
| `ancestral_diets_geo.json` | Diet database (68 cultures) | ~88KB |
| `ancestral_regions.geojson` | Region polygons (57 bbox regions) | ~35KB |
| `index.html` | Working demo with Mapbox GL | HTML+JS |
| `generate_regions_simple.py` | Region generator (zero dependencies) | ~7KB |

## 🎨 Map Setup

```javascript
mapboxgl.accessToken = 'YOUR_TOKEN';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/jardizzil/cmirbb672001p01r72nv0cs12',
  projection: 'globe',
  center: [0, 30],
  zoom: 1.5
});
```

**Mapbox Tileset ID:** `jardizzil.257chu`  
**Published Style:** `mapbox://styles/jardizzil/cmirbb672001p01r72nv0cs12`

## 🌍 Regions by Continent

- **Europe:** 5 regions
- **Africa:** 8 regions
- **Middle East:** 5 regions
- **Central Asia:** 3 regions
- **South Asia:** 5 regions
- **East Asia:** 6 regions
- **Southeast Asia:** 3 regions
- **Oceania:** 6 regions
- **Americas:** 16 regions

**Total: 57 regions, 68 diet patterns**

## 🛠 Troubleshooting

| Issue | Solution |
|-------|----------|
| Map not loading | Check Mapbox token in index.html |
| Regions missing | Run `python generate_regions_simple.py` |
| Coverage gaps | Update bboxes in generate_regions_simple.py |
| Need hard refresh | Press Ctrl + Shift + R |

## 📝 Recent Coverage Fixes

```python
# Germany, Austria, Czech Republic
"eastern_europe": {"min_lon": 10.0, "max_lon": 51.0}

# Sudan, South Sudan
"horn_somalia": {"min_lon": 28.0, "max_lat": 19.0}

# Libya, Egypt
"maghreb": {"max_lon": 38.0}

# Niger, Chad
"sahel": {"max_lon": 42.0}
```

---

**Quick reference for the Ancestral Diet Map project!** 🗺️✨
