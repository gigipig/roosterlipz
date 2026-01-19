#!/bin/bash
set -e

echo "Installing tippecanoe..."
cd /tmp
git clone https://github.com/felt/tippecanoe.git
cd tippecanoe
make -j
sudo make install

echo "Converting GeoJSON to vector tiles..."
cd /mnt/project

tippecanoe \
  -o ancestral_regions.mbtiles \
  --drop-densest-as-needed \
  --extend-zooms-if-still-dropping \
  --force \
  --maximum-zoom=8 \
  --minimum-zoom=0 \
  --simplification=10 \
  --buffer=5 \
  ancestral_regions.geojson

echo "Done! Created ancestral_regions.mbtiles"
echo "Upload this to Mapbox Studio or extract to serve locally"
