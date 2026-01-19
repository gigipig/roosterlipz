# Converting to Vector Tiles for Better Performance

## Quick Solution (Recommended)
Upload the generated .mbtiles to Mapbox Studio:
1. Run: `bash create_vector_tiles.sh` (after uploading ancestral_regions.geojson)
2. Go to https://studio.mapbox.com/tilesets/
3. Upload `ancestral_regions.mbtiles`
4. Copy the tileset URL (like `mapbox://username.tileset_id`)
5. Update index.html to use the tileset instead of GeoJSON

## Code Changes Needed

Replace this in index.html:
```javascript
map.addSource('ancestral-regions', {
  type: 'geojson',
  data: regionsGeoJSON,
  tolerance: 0.375,
  buffer: 64
});
```

With this:
```javascript
map.addSource('ancestral-regions', {
  type: 'vector',
  url: 'mapbox://YOUR_USERNAME.YOUR_TILESET_ID'
});
```

And update layer definitions to include `'source-layer': 'ancestral_regions'`

## Alternative: Simplify GeoJSON Locally
If you don't want to use Mapbox hosting, use mapshaper to simplify:
```bash
npm install -g mapshaper
mapshaper ancestral_regions.geojson -simplify 20% -o ancestral_regions_simplified.geojson
```

This reduces file size by ~80% with minimal visual quality loss.
