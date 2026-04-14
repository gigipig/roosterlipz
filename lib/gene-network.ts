import { GENE_META, legacyKeyMap, getTraitMeterInfo } from './genetics';

export interface NetworkNode {
  id: string;
  icon: string;
  title: string;
  statusClass: 'high' | 'moderate' | 'low';
  value: number;
  statusLabel: string;
  recommendation: string;
  // D3 mutable fields
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface NetworkEdge {
  source: string | NetworkNode;
  target: string | NetworkNode;
  type: 'strong' | 'related';
}

// ~50 edges grouped by metabolic pathway
export const GENE_NETWORK_EDGES: Array<{ source: string; target: string; type: 'strong' | 'related' }> = [
  // Methylation
  { source: 'mthfr_folate', target: 'folate_metabolism', type: 'strong' },
  { source: 'mthfr_folate', target: 'mtr_b12_methylation', type: 'strong' },
  { source: 'mtr_b12_methylation', target: 'mtrr_methylation', type: 'strong' },
  { source: 'mtrr_methylation', target: 'vitamin_b12_absorption', type: 'related' },
  { source: 'comt_methylation', target: 'mthfr_folate', type: 'related' },

  // Vitamin D axis
  { source: 'vitamin_d_metabolism', target: 'vitamin_d_transport', type: 'strong' },
  { source: 'vitamin_d_transport', target: 'vdr_response', type: 'strong' },
  { source: 'cyp2r1_vitamin_d', target: 'vitamin_d_metabolism', type: 'strong' },

  // Fat metabolism
  { source: 'pufa_metabolism', target: 'saturated_fat_response', type: 'related' },
  { source: 'pufa_metabolism', target: 'fads2_vegetarian', type: 'strong' },
  { source: 'saturated_fat_response', target: 'hdl_metabolism', type: 'related' },
  { source: 'arctic_fat_metabolism', target: 'pufa_metabolism', type: 'related' },
  { source: 'fat_sensitivity', target: 'saturated_fat_response', type: 'related' },

  // Carb / glucose / insulin
  { source: 'starch_digestion', target: 'glucose_metabolism', type: 'strong' },
  { source: 'glucose_metabolism', target: 'insulin_sensitivity', type: 'strong' },
  { source: 'insulin_sensitivity', target: 'obesity_risk', type: 'related' },
  { source: 'tcf7l2_diabetes', target: 'glucose_metabolism', type: 'strong' },
  { source: 'slc16a11_diabetes', target: 'glucose_metabolism', type: 'related' },

  // Iron
  { source: 'iron_metabolism', target: 'hfe_iron_overload', type: 'strong' },
  { source: 'iron_metabolism', target: 'vitamin_b12_absorption', type: 'related' },

  // Blood pressure / cardio
  { source: 'salt_sensitivity', target: 'salt_sensitive_hypertension', type: 'strong' },
  { source: 'salt_sensitive_hypertension', target: 'ace_salt_sensitivity', type: 'strong' },
  { source: 'ace_salt_sensitivity', target: 'agtr1_hypertension', type: 'related' },
  { source: 'cyp11b2_hypertension', target: 'salt_sensitive_hypertension', type: 'related' },
  { source: 'hdl_metabolism', target: 'ashkenazi_ldlr_fh', type: 'related' },

  // Uric acid
  { source: 'abcg2_gout', target: 'slc2a9_urate', type: 'strong' },

  // Appetite / satiety
  { source: 'appetite_regulation', target: 'obesity_risk', type: 'strong' },
  { source: 'lepr_satiety', target: 'appetite_regulation', type: 'strong' },
  { source: 'bdnf_fat_appetite', target: 'appetite_regulation', type: 'related' },
  { source: 'mc4r_appetite', target: 'appetite_regulation', type: 'strong' },
  { source: 'fto_obesity', target: 'obesity_risk', type: 'strong' },

  // Caffeine
  { source: 'caffeine_metabolism', target: 'adora2a_caffeine_anxiety', type: 'strong' },

  // Circadian
  { source: 'clock_chronotype', target: 'per1_meal_timing', type: 'strong' },
  { source: 'clock_chronotype', target: 'glucose_metabolism', type: 'related' },

  // Alcohol / folate
  { source: 'alcohol_metabolism', target: 'folate_metabolism', type: 'related' },

  // Histamine
  { source: 'dao_histamine', target: 'celiac_susceptibility', type: 'related' },

  // Vitamin A
  { source: 'beta_carotene_conversion', target: 'bco1_vitamin_a', type: 'strong' },

  // Detox
  { source: 'cruciferous_metabolism_gstm1', target: 'cruciferous_metabolism_gstt1', type: 'strong' },
  { source: 'cruciferous_metabolism_gstm1', target: 'antioxidant_capacity', type: 'related' },

  // Taste
  { source: 'bitter_taste_perception', target: 'tas2r38_bitter', type: 'strong' },
  { source: 'cd36_fat_taste', target: 'appetite_regulation', type: 'related' },
];

export function buildNetworkData(genetics: Record<string, unknown>): {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
} {
  const nodes: NetworkNode[] = [];
  const nodeIds = new Set<string>();

  for (const [rawKey, trait] of Object.entries(genetics)) {
    const metaKey = (legacyKeyMap as Record<string, string>)[rawKey] ?? rawKey;
    const meta = (GENE_META as Record<string, { icon: string; title: string } | undefined>)[metaKey];
    if (!meta) continue;

    const { value, statusClass, statusLabel } = getTraitMeterInfo(rawKey, trait) as {
      value: number;
      statusClass: 'high' | 'moderate' | 'low';
      statusLabel: string;
    };

    const recommendation =
      (trait as Record<string, unknown>).dietary_recommendation !== undefined
        ? (
            ((trait as Record<string, unknown>).dietary_recommendation as Record<string, string>)
              ?.recommendation ??
            ((trait as Record<string, unknown>).dietary_recommendation as Record<string, string>)
              ?.notes ??
            ''
          )
        : '';

    nodes.push({
      id: metaKey,
      icon: meta.icon,
      title: meta.title,
      statusClass,
      value,
      statusLabel,
      recommendation,
    });
    nodeIds.add(metaKey);
  }

  // Only include edges where both endpoints exist in the user's node set
  const edges: NetworkEdge[] = GENE_NETWORK_EDGES.filter(
    e => nodeIds.has(e.source) && nodeIds.has(e.target)
  ).map(e => ({ source: e.source, target: e.target, type: e.type }));

  return { nodes, edges };
}
