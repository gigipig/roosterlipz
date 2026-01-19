#!/bin/bash
set -e

echo "Installing mapshaper..."
npm install -g mapshaper

echo "Simplifying GeoJSON..."
cd /mnt/project

# Create simplified version (20% of original detail)
mapshaper ancestral_regions.geojson \
  -simplify 20% keep-shapes \
  -o ancestral_regions_simplified.geojson

# Create even lighter version for faster loading (10%)
mapshaper ancestral_regions.geojson \
  -simplify 10% keep-shapes \
  -o ancestral_regions_light.geojson

echo "Created:"
ls -lh ancestral_regions*.geojson
echo ""
echo "Use ancestral_regions_simplified.geojson in your app for ~80% size reduction"
echo "Use ancestral_regions_light.geojson for ~90% reduction (less detail)"
