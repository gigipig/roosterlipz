'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Info, ChevronDown, Lock, List, GitFork } from 'lucide-react';
import { useAppState } from '@/components/providers/app-state-provider';
import { UNLOCK_PRICE } from '@/lib/unlock';
import {
  GENE_META, GENE_GLOSSARY, GENE_SOURCES,
  GENE_CATEGORY_MAP, GENE_CATEGORY_INFO,
  legacyKeyMap, getTraitMeterInfo,
} from '@/lib/genetics';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { GeneticTrait } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

const GeneticNetworkView = dynamic(
  () => import('./genetics-network-view').then(m => ({ default: m.GeneticNetworkView })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[580px] rounded-2xl border border-border bg-card/30 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading network…</p>
      </div>
    ),
  }
);

const CATEGORY_ORDER = ['macro', 'vitamins', 'cardio', 'appetite', 'population', 'detox', 'metabolic', 'other'] as const;

// ─── Item 3: Culturally-grounded trait status descriptions ────────────────
const TRAIT_ANCESTRY_FRAMING: Record<string, { high: string; moderate: string; low: string }> = {
  lactase_persistence: {
    high: "A Northern European dairy tradition runs deep in your ancestry — your LCT gene keeps lactase active into adulthood when most of the world's populations lose it.",
    moderate: "Mixed lactase persistence signals — your ancestry straddles pastoral and non-pastoral populations. Fermented dairy is typically better tolerated than fresh milk.",
    low: "Your ancestry predates widespread dairy farming — fermented dairy (yoghurt, kefir, aged cheese) is far better tolerated than fresh milk as fermentation degrades lactose.",
  },
  starch_digestion: {
    high: "High AMY1 copy number from grain-farming ancestry — your salivary amylase production is strong, meaning complex starches break down rapidly and fuel you efficiently.",
    moderate: "Moderate AMY1 expression — whole grains and root vegetables are handled well, though refined starches may cause sharper glucose responses.",
    low: "Lower AMY1 copy number suggests your ancestors relied less on grain staples — refined starch and high-glycaemic foods may spike blood sugar more than for grain-adapted populations.",
  },
  pufa_metabolism: {
    high: "Your FADS gene variants efficiently convert plant-based omega-3s (ALA) to the active forms EPA and DHA — fatty fish and flaxseed from your ancestry work with, not against, your metabolism.",
    moderate: "Moderate omega-3 conversion efficiency — pre-formed EPA and DHA from oily fish complement your body's own conversion capacity.",
    low: "Your ancestry relied on pre-formed EPA/DHA from marine sources rather than converting plant-based ALA — regular fatty fish consumption is especially important for you.",
  },
  vitamin_d_metabolism: {
    high: "Your ancestry adapted to environments with variable sunlight — CYP2R1 efficiency means you activate vitamin D readily from both sun and dietary sources.",
    moderate: "Moderate vitamin D metabolism — seasonal dietary sources like oily fish and egg yolks are valuable complements to sunlight exposure.",
    low: "Populations from high-UV environments often carry reduced vitamin D activation efficiency — dietary sources and supplementation deserve extra attention year-round.",
  },
  saturated_fat_response: {
    high: "APOE and lipid gene variants from your ancestry handle dietary saturated fat efficiently — traditional animal fats from your heritage are metabolised well.",
    moderate: "Mixed lipid metabolism signals — the balance of saturated, mono-, and polyunsaturated fats matters more than any single source.",
    low: "Your ancestry may carry lipid-sensitive variants — Mediterranean-style fat profiles (olive oil, fatty fish, nuts) align better with your metabolic heritage.",
  },
  glucose_metabolism: {
    high: "Efficient insulin signalling in your ancestry — traditional complex carbohydrate staples from your heritage are well-matched to your glucose metabolism.",
    moderate: "Moderate glucose handling — pairing carbohydrates with fibre, protein, or fat (as traditional diets naturally did) helps moderate glycaemic response.",
    low: "Your ancestry may carry variants linked to insulin sensitivity — lower-glycaemic eating patterns consistent with ancestral hunter-gatherer or pastoral diets are worth prioritising.",
  },
  salt_sensitivity: {
    high: "ACE and sodium-handling variants from inland or continental ancestry — your kidneys regulate sodium efficiently across a wide dietary range.",
    moderate: "Moderate sodium regulation — traditional seasoning patterns from your ancestry are appropriate; processed food sodium levels exceed ancestral norms for everyone.",
    low: "Coastal or salt-scarce ancestral environments shaped sodium-conserving variants — blood pressure and fluid balance respond more acutely to sodium intake in your genetic background.",
  },
  alcohol_metabolism: {
    high: "ALDH2 and ADH variants from your ancestry break down alcohol and its metabolite acetaldehyde efficiently — reflecting populations with long histories of fermented beverages.",
    moderate: "Mixed alcohol processing — fermented traditional beverages in moderation align with how ancestral populations used them.",
    low: "Reduced ALDH2 activity is more common in East Asian and some other ancestral populations — acetaldehyde accumulation makes alcohol feel unpleasant and increases sensitivity.",
  },
  bitter_taste_perception: {
    high: "Strong TAS2R38 sensitivity from your ancestry — bitter compounds in vegetables, herbs, and fermented foods were reliable signals of bioactive plant compounds.",
    moderate: "Moderate bitter perception — the full range of ancestral vegetables, including bitter greens, fits comfortably within your taste threshold.",
    low: "Lower bitter sensitivity in your ancestry may reflect adaptation to bitter-rich foraging environments where habituation was advantageous.",
  },
  antioxidant_capacity: {
    high: "NQO1 and related detoxification genes from your ancestry run efficiently — polyphenol-rich foods from your heritage are well utilised.",
    moderate: "Moderate antioxidant enzyme activity — colourful vegetables, herbs, and spices as used in your ancestral cuisines provide complementary support.",
    low: "Lower baseline antioxidant enzyme expression — anthocyanin-rich, polyphenol-dense foods from ancestral cuisines compensate particularly effectively.",
  },
  mthfr_folate: {
    high: "Efficient MTHFR methylation from your ancestry — folate from legumes, leafy greens, and traditional grain preparations is readily activated.",
    moderate: "Moderate MTHFR activity — a broad range of folate-rich ancestral foods (legumes, dark greens) ensures adequate methyl group availability.",
    low: "MTHFR C677T variants are more common in certain ancestral populations — methylfolate from dark leafy greens and legumes is especially important in your dietary heritage.",
  },
  hfe_iron_overload: {
    high: "HFE variants associated with iron retention are common in Northern European ancestry — iron absorption is efficient, so high-iron staples contribute meaningfully.",
    moderate: "Mixed iron regulation — traditional dietary patterns combining haem and non-haem iron sources are appropriate.",
    low: "Lower HFE risk variants from your ancestry — plant-based and haem iron sources from traditional diets are both well tolerated.",
  },
  caffeine_metabolism: {
    high: "Fast CYP1A2 activity in your ancestry — caffeine is cleared quickly, consistent with cultures that developed around tea and coffee traditions.",
    moderate: "Moderate caffeine metabolism — traditional tea and coffee consumption patterns suit your processing speed.",
    low: "Slow CYP1A2 clearance — caffeine stays active longer, which amplifies both benefits and side effects; ancestral herbal alternatives may be better tolerated.",
  },
  histamine_intolerance: {
    high: "Strong DAO enzyme activity from your ancestry — aged, fermented, and cured foods that feature prominently in traditional diets are well tolerated.",
    moderate: "Moderate histamine clearance — fermented and aged foods in the quantities found in traditional diets are generally tolerated.",
    low: "DAO gene variants linked to histamine sensitivity appear in your ancestry — fresh over aged, and fermented foods in moderation, align better with your tolerance.",
  },
  iron_metabolism: {
    high: "Efficient iron transport and storage from your ancestry — traditional red meat and organ meat consumption fits your metabolic profile.",
    moderate: "Moderate iron metabolism — combining haem and plant iron sources as traditional cuisines do optimises absorption.",
    low: "Iron regulation variants from your ancestry — plant-based iron with vitamin C co-ingestion, as in traditional cuisine pairings, boosts uptake effectively.",
  },
  comt_methylation: {
    high: "Fast COMT enzyme activity — catecholamines and oestrogen metabolites are cleared efficiently, and your ancestry's fermented and polyphenol-rich foods support this.",
    moderate: "Balanced COMT activity — the mix of stimulating and calming foods in traditional diets suits your methylation profile.",
    low: "Slow COMT clearance ('warrior' variant) — magnesium-rich foods from ancestral diets support enzymatic function; excess catechol-rich foods may amplify stress response.",
  },
  abcg2_gout: {
    high: "ABCG2 uric acid transport is efficient in your ancestry — purine-rich traditional foods are handled well.",
    moderate: "Moderate uric acid excretion — traditional moderation of high-purine organ meats is appropriate.",
    low: "ABCG2 variants reducing uric acid excretion are seen in some ancestral populations — high-purine foods and fructose from ancestral diets warrant moderation.",
  },
  clock_chronotype: {
    high: "Morning-aligned clock gene expression from your ancestry — early feeding windows consistent with agricultural dawn-to-dusk traditions suit your circadian biology.",
    moderate: "Flexible chronotype — traditional meal timing patterns from your heritage provide a reasonable framework.",
    low: "Evening-shifted clock variants — late meal timing that disrupts ancestral light-dark patterns has a larger metabolic impact on your biology.",
  },
  lepr_satiety: {
    high: "Efficient leptin signalling from your ancestry — satiety cues from ancestral whole-food meals register reliably.",
    moderate: "Moderate leptin sensitivity — protein and fibre density in traditional meals provide strong satiety support.",
    low: "Leptin receptor variants affecting satiety signalling — the high-fibre, protein-rich structure of ancestral diets compensates by providing mechanical satiety.",
  },
  bdnf_fat_appetite: {
    high: "BDNF val/val genotype — appetite regulation and food reward signalling are well modulated in your ancestry.",
    moderate: "Moderate BDNF signalling — traditional meal structure with distinct eating occasions suits your appetite regulation.",
    low: "BDNF variants linked to increased fat appetite — ancestral diets naturally high in satiating fats (nuts, oily fish, animal fats) help moderate overconsumption.",
  },
  dao_histamine: {
    high: "Strong DAO activity across your ancestry — the full range of fermented, aged, and cured traditional foods is well tolerated.",
    moderate: "Moderate DAO function — traditional quantities of fermented foods are appropriate; very high-histamine loads may occasionally cause sensitivity.",
    low: "DAO insufficiency variants — fresh preparations over heavily aged or fermented foods better match your histamine clearance capacity.",
  },
  polynesian_energy_storage: {
    high: "CREBRF 'thrifty' variant — present in Polynesian and Pacific ancestry — evolved for efficient energy storage during ocean voyaging and famine periods.",
    moderate: "Partial expression of energy-efficient variants — calorie-dense traditional foods are well utilised but require awareness in food-abundant environments.",
    low: "Lower expression of thrifty metabolism variants from your ancestry.",
  },
  arctic_fat_metabolism: {
    high: "CPT1A arctic variant — evolved in Inuit and circumpolar ancestry for efficient beta-oxidation of marine mammal fats as primary fuel.",
    moderate: "Partial arctic fat metabolism traits — high-fat marine foods are well utilised but not the exclusive metabolic pathway.",
    low: "Ancestry without the arctic CPT1A variant — conventional fat metabolism applies.",
  },
  altitude_adaptation_epas1: {
    high: "EPAS1 variant conferring high-altitude oxygen efficiency — present in Tibetan and Andean ancestry, this adaptation optimises haemoglobin regulation under low-oxygen conditions.",
    moderate: "Partial altitude adaptation signals from your ancestry.",
    low: "Standard EPAS1 expression — no significant altitude-adapted oxygen metabolism in your background.",
  },
  edar_adaptation: {
    high: "EDAR variant from East Asian and some Indigenous American ancestry — influences sweat gland density, hair shaft thickness, and metabolic adaptations to varied climates.",
    moderate: "Mixed EDAR expression from your ancestry.",
    low: "Standard EDAR expression without the derived East Asian variant.",
  },
  per1_meal_timing: {
    high: "PER1 chronotype variants favour earlier meal timing — morning-heavy eating consistent with ancestral light-aligned traditions is metabolically optimal for you.",
    moderate: "Moderate PER1 chronotype expression — traditional structured meal timing is a sound framework.",
    low: "Evening-shifted PER1 variants — late evening meals have a larger circadian metabolic cost for your biology.",
  },
  adora2a_caffeine_anxiety: {
    high: "ADORA2A variants associated with low caffeine-anxiety sensitivity — your ancestry adapted well to the adenosine-blocking effects of caffeine.",
    moderate: "Moderate caffeine-anxiety sensitivity — standard tea and coffee traditions suit your receptor profile.",
    low: "ADORA2A variants linked to heightened caffeine anxiety — lower doses and herbal alternatives from ancestral traditions are better matched to your receptor sensitivity.",
  },
  g6pd_deficiency: {
    high: "G6PD enzyme activity is typical in your ancestry — oxidative stress from fava beans and certain medications is handled normally.",
    moderate: "Partial G6PD expression — moderate consumption of traditional legumes is appropriate.",
    low: "G6PD deficiency variants are more prevalent in malaria-endemic ancestral regions — fava beans and certain compounds warrant caution.",
  },
};

// ─── Item 7: Global average comparators ───────────────────────────────────
const TRAIT_GLOBAL_AVERAGES: Record<string, number> = {
  lactase_persistence:        35,
  starch_digestion:           45,
  pufa_metabolism:            40,
  vitamin_d_metabolism:       50,
  saturated_fat_response:     48,
  glucose_metabolism:         48,
  salt_sensitivity:           40,
  alcohol_metabolism:         55,
  bitter_taste_perception:    50,
  antioxidant_capacity:       45,
  mthfr_folate:               40,
  hfe_iron_overload:          12,
  caffeine_metabolism:        50,
  histamine_intolerance:      20,
  iron_metabolism:            55,
  comt_methylation:           50,
  abcg2_gout:                 20,
  clock_chronotype:           45,
  lepr_satiety:               50,
  bdnf_fat_appetite:          50,
  dao_histamine:              75,
  polynesian_energy_storage:  15,
  arctic_fat_metabolism:       5,
};

interface TraitCardProps {
  traitKey: string;
  trait: GeneticTrait;
}

function TraitCard({ traitKey, trait }: TraitCardProps) {
  const metaKey = (legacyKeyMap as Record<string, string>)[traitKey] || traitKey;
  const meta = (GENE_META as Record<string, { icon: string; title: string; cssClass: string }>)[metaKey] ||
    (trait as Record<string, unknown>)._meta as { icon: string; title: string; cssClass: string } | undefined ||
    { icon: '🧬', title: traitKey.replace(/_/g, ' '), cssClass: 'generic' };

  const { value, statusClass } = getTraitMeterInfo(traitKey, trait);

  // Item 4 — mount-triggered meter fill animation
  // Double-rAF ensures the browser paints the 0 state before animating
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let raf1: number, raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setDisplayValue(value));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [value]);

  const friendlyLabel =
    statusClass === 'high' ? 'Well adapted' :
    statusClass === 'moderate' ? 'Mixed signals' :
    'Worth supporting';

  const headline =
    statusClass === 'high'
      ? `Your ancestry shows strong ${meta.title.toLowerCase()}.`
      : statusClass === 'moderate'
      ? `Your ancestry shows mixed signals for ${meta.title.toLowerCase()}.`
      : `Your ancestry shows limited ${meta.title.toLowerCase()}.`;

  const recommendation = (trait.dietary_recommendation as Record<string, string> | undefined)?.recommendation ||
    (trait.dietary_recommendation as Record<string, string> | undefined)?.notes || '';

  // Use GENE_GLOSSARY if available, else fall back to trait's own data
  const glossaryEntry = (GENE_GLOSSARY as Record<string, { term: string; definition: string; gene: string; inheritance: string } | undefined>)[metaKey];
  const sourcesEntry = (GENE_SOURCES as Record<string, { snp?: string; gene?: string; studies?: string[]; databases?: string[] } | undefined>)[metaKey];

  const infoTerm = glossaryEntry?.term ?? meta.title;
  const infoDefinition = glossaryEntry?.definition ?? (trait.explanation as string | undefined) ?? '';
  const infoGene = glossaryEntry?.gene ?? metaKey.split('_').map((w: string) => w.toUpperCase()).join(' ') + ' gene';
  const infoInheritance = glossaryEntry?.inheritance ?? (trait.inheritance as string | undefined) ?? '';

  // Item 3 — culturally-grounded status text
  const framing = TRAIT_ANCESTRY_FRAMING[metaKey];
  const statusText = framing?.[statusClass as 'high' | 'moderate' | 'low']
    ?? (statusClass === 'high'
      ? 'Well expressed across your ancestral populations.'
      : statusClass === 'moderate'
      ? 'Variable expression — individual response may differ.'
      : 'Less common in your ancestral gene pool — your diet can compensate.');

  // Item 7 — global average
  const globalAvg = TRAIT_GLOBAL_AVERAGES[metaKey];

  return (
    // Item 5 — card-lift hover effect
    <div className="p-4 rounded-xl bg-card border border-border space-y-3 card-lift">
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-tight mt-0.5">{meta.icon}</span>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{meta.title}</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                statusClass === 'high' ? 'bg-sage/20 text-sage' :
                statusClass === 'moderate' ? 'bg-amber/20 text-amber' :
                'bg-muted text-muted-foreground'
              }`}>
                {friendlyLabel}
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Learn more about ${meta.title}`}
                  >
                    <Info size={14} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 space-y-3 text-xs" side="top" align="end">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{infoTerm}</p>
                    <p className="text-muted-foreground mt-1 leading-relaxed">{infoDefinition}</p>
                  </div>
                  <div className="border-t border-border pt-2 space-y-1">
                    <div className="flex gap-1">
                      <span className="text-muted-foreground shrink-0">Gene:</span>
                      <span className="text-foreground">{infoGene}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-muted-foreground shrink-0">Inheritance:</span>
                      <span className="text-foreground">{infoInheritance}</span>
                    </div>
                  </div>
                  {sourcesEntry && (
                    <div className="border-t border-border pt-2 space-y-1.5">
                      {(sourcesEntry.snp || sourcesEntry.gene) && (
                        <div className="flex gap-1">
                          <span className="text-muted-foreground shrink-0">{sourcesEntry.snp ? 'SNP:' : 'Gene:'}</span>
                          <span className="text-foreground font-mono">{sourcesEntry.snp || sourcesEntry.gene}</span>
                        </div>
                      )}
                      {sourcesEntry.studies?.slice(0, 2).map((s, i) => (
                        <p key={i} className="text-muted-foreground leading-snug">{s}</p>
                      ))}
                      {sourcesEntry.databases && sourcesEntry.databases.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {sourcesEntry.databases.map(db => (
                            <span key={db} className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{db}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">{headline}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {/* Item 7 — percentage + global avg comparator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Ancestral expression</span>
          <span className="flex items-center gap-1">
            <span className={
              statusClass === 'high' ? 'text-sage' :
              statusClass === 'moderate' ? 'text-amber' :
              ''
            }>{value}%</span>
            {globalAvg !== undefined && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-[10px] text-muted-foreground/60">vs. ~{globalAvg}% global avg</span>
              </>
            )}
          </span>
        </div>
        {/* Item 4 — animated fill via displayValue */}
        <Progress value={displayValue} className="h-1.5" />
        {/* Item 3 — ancestral framing text */}
        <p className="text-xs text-muted-foreground leading-snug">{statusText}</p>
      </div>

      {recommendation && (
        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2"
          dangerouslySetInnerHTML={{ __html: recommendation.replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>') }}
        />
      )}
    </div>
  );
}

// ─── Item 9: Locked trait card — shows header + blurred meter ─────────────
function LockedTraitCard({ traitKey, trait }: { traitKey: string; trait: GeneticTrait }) {
  const metaKey = (legacyKeyMap as Record<string, string>)[traitKey] || traitKey;
  const meta = (GENE_META as Record<string, { icon: string; title: string }>)[metaKey]
    ?? { icon: '🧬', title: traitKey.replace(/_/g, ' ') };
  const { value, statusClass } = getTraitMeterInfo(traitKey, trait);
  const friendlyLabel = statusClass === 'high' ? 'Well adapted'
    : statusClass === 'moderate' ? 'Mixed signals' : 'Worth supporting';

  return (
    <div className="p-4 rounded-xl bg-card border border-border space-y-3 relative overflow-hidden card-lift">
      {/* Header — fully visible */}
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-tight mt-0.5">{meta.icon}</span>
        <div className="flex-1 min-w-0 space-y-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{meta.title}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              statusClass === 'high' ? 'bg-sage/20 text-sage'
              : statusClass === 'moderate' ? 'bg-amber/20 text-amber'
              : 'bg-muted text-muted-foreground'
            }`}>{friendlyLabel}</span>
          </div>
        </div>
      </div>
      {/* Content — blurred */}
      <div className="blur-[4px] pointer-events-none select-none opacity-60 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Ancestral expression</span>
          <span>{value}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full">
          <div className="h-full rounded-full bg-sage/50" style={{ width: `${value}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">Your result is available with full access.</p>
      </div>
      {/* Lock indicator */}
      <div className="absolute bottom-2 right-3">
        <span className="text-xs text-muted-foreground/40">🔒</span>
      </div>
    </div>
  );
}

interface CategorySectionProps {
  catId: string;
  items: Array<{ key: string; trait: GeneticTrait }>;
  defaultOpen?: boolean;
}

function CategorySection({ catId, items, defaultOpen = false }: CategorySectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const info = (GENE_CATEGORY_INFO as Record<string, { label: string; icon: string }>)[catId] ||
    { label: 'Other Traits', icon: '🧬' };

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-5 py-3.5 bg-muted/20 hover:bg-muted/30 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-base">{info.icon}</span>
        <span className="flex-1 text-sm font-semibold text-foreground">{info.label}</span>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{items.length}</span>
        <ChevronDown
          size={15}
          className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="p-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {items.map(({ key, trait }) => (
            <TraitCard key={key} traitKey={key} trait={trait} />
          ))}
        </div>
      )}
    </div>
  );
}

const FREE_TRAIT_COUNT = 3;
const LOCKED_TEASE_COUNT = 9;

export function GeneticsTab() {
  const { genetics, mode, isUnlocked, openUnlockModal } = useAppState();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'list' | 'network'>('list');

  if (mode === 'dna') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <span className="text-4xl">🧬</span>
        <h3 className="font-serif text-xl text-foreground">Genetics requires Family Tree mode</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Switch to Family Tree mode and select 4 grandparents to unlock full Mendelian inheritance analysis.
        </p>
      </div>
    );
  }

  if (!genetics || Object.keys(genetics).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <span className="text-4xl">🧬</span>
        <p className="text-sm text-muted-foreground">No genetics data — please calculate first.</p>
      </div>
    );
  }

  const traitCount = Object.keys(genetics).length;

  // Flatten all traits in category order
  const allTraits: Array<{ key: string; trait: GeneticTrait }> = [];
  CATEGORY_ORDER.forEach(catId => {
    Object.entries(genetics).forEach(([key, trait]) => {
      const metaKey = (legacyKeyMap as Record<string, string>)[key] || key;
      const tCatId = (GENE_CATEGORY_MAP as Record<string, string>)[metaKey] || 'other';
      if (tCatId === catId) {
        allTraits.push({ key, trait: trait as GeneticTrait });
      }
    });
  });

  const freeTraits = allTraits.slice(0, FREE_TRAIT_COUNT);
  // Item 9 — locked traits for selective tease
  const lockedTraits = allTraits.slice(FREE_TRAIT_COUNT);
  const teasedTraits = lockedTraits.slice(0, LOCKED_TEASE_COUNT);
  const remainingCount = Math.max(0, lockedTraits.length - LOCKED_TEASE_COUNT);

  // For the full view, group by category
  const groups: Record<string, Array<{ key: string; trait: GeneticTrait }>> = {};
  CATEGORY_ORDER.forEach(c => { groups[c] = []; });
  Object.entries(genetics).forEach(([key, trait]) => {
    const metaKey = (legacyKeyMap as Record<string, string>)[key] || key;
    const catId = (GENE_CATEGORY_MAP as Record<string, string>)[metaKey] || 'other';
    groups[catId].push({ key, trait: trait as GeneticTrait });
  });

  // Sort each group: High → Moderate → Low
  const STATUS_ORDER: Record<string, number> = { high: 0, moderate: 1, low: 2 };
  CATEGORY_ORDER.forEach(c => {
    groups[c].sort((a, b) => {
      const aStatus = getTraitMeterInfo(a.key, a.trait).statusClass;
      const bStatus = getTraitMeterInfo(b.key, b.trait).statusClass;
      return (STATUS_ORDER[aStatus] ?? 2) - (STATUS_ORDER[bStatus] ?? 2);
    });
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-foreground">Genetic Trait Analysis</h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">{traitCount} traits analyzed</span>
      </div>

      {/* Badge legend */}
      <div className="rounded-xl border border-border bg-card/50 px-4 py-3">
        <p className="text-xs text-muted-foreground mb-2.5 font-medium uppercase tracking-wide">How to read the tags</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-sage/20 text-sage whitespace-nowrap">Well adapted</span>
            <span className="text-xs text-muted-foreground">Strong or favourable expression in your ancestral populations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber/20 text-amber whitespace-nowrap">Mixed signals</span>
            <span className="text-xs text-muted-foreground">Intermediate expression — individual response may vary</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">Worth supporting</span>
            <span className="text-xs text-muted-foreground">Less active in your ancestry — dietary adjustments can compensate</span>
          </div>
        </div>
      </div>

      {isUnlocked ? (
        /* Full view — list or network */
        <>
          {/* View toggle — desktop only */}
          {!isMobile && (
            <div className="flex items-center justify-end">
              <div className="inline-flex items-center rounded-full border border-border bg-muted/30 p-0.5 gap-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List size={13} />
                  List
                </button>
                <button
                  onClick={() => setViewMode('network')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'network'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <GitFork size={13} />
                  Tree
                </button>
              </div>
            </div>
          )}

          {/* Network view */}
          {viewMode === 'network' && !isMobile && genetics && (
            <GeneticNetworkView genetics={genetics as Record<string, unknown>} />
          )}

          {/* List view — all categories */}
          {(viewMode === 'list' || isMobile) && (() => {
            let firstRendered = false;
            return CATEGORY_ORDER.map(catId => {
              const items = groups[catId];
              if (!items || items.length === 0) return null;
              const isFirst = !firstRendered;
              firstRendered = true;
              return <CategorySection key={catId} catId={catId} items={items} defaultOpen={isFirst} />;
            });
          })()}
        </>
      ) : (
        /* Free preview — 3 traits + selective tease of locked traits */
        <>
          {/* Preview header */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Free preview</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber/10 border border-amber/20 text-amber">
              {FREE_TRAIT_COUNT} of {traitCount} traits
            </span>
          </div>

          {/* 3 free trait cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {freeTraits.map(({ key, trait }) => (
              <TraitCard key={key} traitKey={key} trait={trait} />
            ))}
          </div>

          {/* Item 9 — Selective tease: real headers + blurred meters */}
          {teasedTraits.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground px-1 uppercase tracking-wider font-medium">
                More in your profile
              </p>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {teasedTraits.map(({ key, trait }) => (
                  <LockedTraitCard key={key} traitKey={key} trait={trait} />
                ))}
              </div>
              {remainingCount > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  and {remainingCount} more trait{remainingCount !== 1 ? 's' : ''} in your full report
                </p>
              )}
            </div>
          )}

          {/* Single unlock CTA */}
          <div className="rounded-2xl border border-sage/20 bg-sage/5 p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center">
              <Lock size={20} className="text-sage" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Unlock your full genetic profile
              </p>
              <p className="text-xs text-muted-foreground">
                See complete analysis, dietary guidance, and comparisons for all {traitCount} traits
              </p>
            </div>
            <button
              onClick={openUnlockModal}
              className="px-6 py-2.5 rounded-full bg-sage text-[#13110e] font-semibold text-sm hover:bg-sage/90 transition-colors"
            >
              Unlock Full Report — {UNLOCK_PRICE}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
