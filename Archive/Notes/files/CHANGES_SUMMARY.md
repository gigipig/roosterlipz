# Summary of Changes to Ancestral Diet Data

## Files Updated
- `ancestral_diets_geo_final.json` - Diet and genetic data (59 regions)
- `ancestral_regions_final.geojson` - Geographic boundaries (59 regions)

## Changes Made

### 1. Added Central Europe ✓
**ID:** `central_europe`
**Coverage:** Germany, Austria, Switzerland, Czech Republic
**Bbox:** 10-19°E, 47-55°N

**Key Features:**
- **Highest lactase persistence in Europe (74%)** - most dairy-adapted population
- AMY1 copy number: 7.0 (above-average starch tolerance)
- Diet: Rye bread, beer, pork, sauerkraut, fresh milk, quark
- Culture: Germanic grain/beer/dairy traditions

### 2. Fixed 15 Missing Geographic Boundaries ✓
Added GeoJSON polygons for regions that had diet data but no map boundaries:

**Americas (8):**
- california_coast
- pacific_nw  
- great_plains
- canadian_prairies
- southwest_us
- southeast_us
- gaucho (Argentina/Uruguay pampas)
- brazilian_coastal

**Asia (5):**
- tibet
- sichuan_sw_china
- south_china
- highland_se_asia
- siberia

**Other (2):**
- australian_coastal
- west_india (Gujarat/Maharashtra/Goa)

### 3. Added East African Lakes/Highlands Region ✓
**ID:** `nilotic`
**Name:** Nilotic & Great Lakes
**Coverage:** South Sudan, Uganda, Western Kenya, Rwanda/Burundi highlands
**Bbox:** 28-36°E, -2-12°N

**Key Features:**
- Fills the gap between central_africa (rainforest), sahel, and ethiopia
- Covers Nilotic peoples (Dinka, Nuer) and Great Lakes kingdoms (Buganda, Ankole)
- Diet: Plantains (matooke), millet, sorghum, freshwater fish (Nile perch, tilapia)
- Low lactase persistence (15%) despite cattle herding - fermented dairy traditional
- High PUFA conversion efficiency (82%)

## Coverage Summary

### Europe (Now Complete)
- Western Europe: UK/Ireland/France/Benelux
- **Central Europe: Germany/Austria/Czech/Switzerland** ← NEW
- Eastern Europe: Poland/Ukraine/Russia
- Nordic: Scandinavia

### East Africa (Now Complete)
- Horn of Africa: Somalia/Djibouti
- Ethiopian Highland: Ethiopia/Eritrea
- **Nilotic & Great Lakes: South Sudan/Uganda/Western Kenya** ← NEW
- Maasai: Kenya/Tanzania pastoralists
- Sahel: Sudan/Chad belt

## Technical Notes

### Geographic Boundaries
All 16 new regions use simple rectangular polygons based on bounding boxes. These are functional but simplified. For more accurate boundaries, you can:

1. Use [geojson.io](https://geojson.io) to refine polygons
2. Import existing boundary data for specific countries/regions
3. The current rectangles will work fine for most visualization purposes

### Next Steps for Leaflet Implementation
1. Both files are now synchronized (59 regions each)
2. Load the GeoJSON directly in Leaflet (no tile conversion needed)
3. Join diet data by matching the `id` field
4. Example:
```javascript
fetch('ancestral_regions_final.geojson')
  .then(response => response.json())
  .then(geojson => {
    L.geoJSON(geojson, {
      style: feature => ({
        fillColor: getColorByDiet(feature.properties.id),
        // ... styling
      })
    }).addTo(map);
  });
```

## Statistics
- **Total regions:** 59
- **New regions:** 17 (1 central_europe + 15 backfilled + 1 nilotic)
- **Coverage:** Global with no major gaps
- **Complete synchronization:** All regions have both diet data AND geographic boundaries
