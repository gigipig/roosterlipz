#!/usr/bin/env python3
"""
Split ancestral_diets_geo.json into two separate JSON files:
1. cultures.json - Culture metadata (id, name, location info)
2. diets.json - Diet and genetic information

Both files use 'id' as the matching key.
"""

import json

def split_ancestral_data(input_file):
    # Read the source file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Define which fields belong to culture metadata
    culture_fields = {'id', 'name', 'region', 'subregion', 'culture', 'centroid', 'bbox'}

    # Lists to hold separated data
    cultures_data = {
        'version': data.get('version'),
        'note': 'Culture metadata extracted from ancestral_diets_geo.json',
        'cultures': []
    }

    diets_data = {
        'version': data.get('version'),
        'note': data.get('note'),
        'cultures': []
    }

    # Process each culture
    for culture in data.get('cultures', []):
        # Extract culture metadata
        culture_entry = {key: culture[key] for key in culture_fields if key in culture}
        cultures_data['cultures'].append(culture_entry)

        # Extract diet/genetics data (everything not in culture_fields, but always include id)
        diet_entry = {'id': culture.get('id')}
        for key, value in culture.items():
            if key not in culture_fields:
                diet_entry[key] = value
        diets_data['cultures'].append(diet_entry)

    # Write culture metadata
    with open('cultures.json', 'w', encoding='utf-8') as f:
        json.dump(cultures_data, f, indent=2, ensure_ascii=False)
    print(f"Created cultures.json with {len(cultures_data['cultures'])} cultures")

    # Write diet/genetics data
    with open('diets.json', 'w', encoding='utf-8') as f:
        json.dump(diets_data, f, indent=2, ensure_ascii=False)
    print(f"Created diets.json with {len(diets_data['cultures'])} cultures")

if __name__ == '__main__':
    split_ancestral_data('ancestral_diets_geo.json')
    print("\nDone! Files created:")
    print("  - cultures.json (culture metadata & locations)")
    print("  - diets.json (diet and genetic data)")
    print("\nBoth files use 'id' field for matching records.")
