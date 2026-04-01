'use client';

import { useState } from 'react';
import { Info, ChevronDown, Lock } from 'lucide-react';
import { useAppState } from '@/components/providers/app-state-provider';
import { UNLOCK_PRICE } from '@/lib/unlock';
import { PaywallOverlay } from '@/components/app/paywall-overlay';
import {
  GENE_META, GENE_GLOSSARY, GENE_SOURCES,
  GENE_CATEGORY_MAP, GENE_CATEGORY_INFO,
  legacyKeyMap, getTraitMeterInfo,
} from '@/lib/genetics';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { GeneticTrait } from '@/lib/types';

const CATEGORY_ORDER = ['macro', 'vitamins', 'cardio', 'appetite', 'population', 'detox', 'metabolic', 'other'] as const;

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

  return (
    <div className="p-4 rounded-xl bg-card border border-border space-y-3">
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
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Ancestral expression</span>
          <span className={
            statusClass === 'high' ? 'text-sage' :
            statusClass === 'moderate' ? 'text-amber' :
            ''
          }>{value}%</span>
        </div>
        <Progress value={value} className="h-1.5" />
        <p className="text-xs text-muted-foreground leading-snug">
          {statusClass === 'high'
            ? 'Well expressed across your ancestral populations.'
            : statusClass === 'moderate'
            ? 'Variable expression — individual response may differ.'
            : 'Less common in your ancestral gene pool — your diet can compensate.'}
        </p>
      </div>

      {recommendation && (
        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2"
          dangerouslySetInnerHTML={{ __html: recommendation.replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>') }}
        />
      )}
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

export function GeneticsTab() {
  const { genetics, mode, isUnlocked, openUnlockModal } = useAppState();

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
  const lockedTraitCount = Math.max(0, traitCount - FREE_TRAIT_COUNT);

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
    <div className="space-y-4">
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
        /* Full view — all categories */
        (() => {
          let firstRendered = false;
          return CATEGORY_ORDER.map(catId => {
            const items = groups[catId];
            if (!items || items.length === 0) return null;
            const isFirst = !firstRendered;
            firstRendered = true;
            return <CategorySection key={catId} catId={catId} items={items} defaultOpen={isFirst} />;
          });
        })()
      ) : (
        /* Free preview — 3 traits + locked section */
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

          {/* Locked section */}
          <div className="rounded-2xl border border-border overflow-hidden">
            {/* Blurred ghost cards */}
            <div className="relative">
              <div className="p-4 grid sm:grid-cols-2 xl:grid-cols-3 gap-3 blur-sm pointer-events-none select-none opacity-50" aria-hidden>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-4 rounded-xl bg-card border border-border h-28 flex flex-col gap-2">
                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-muted" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-2.5 bg-muted/70 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full mt-auto" />
                  </div>
                ))}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card/80 backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center">
                  <Lock size={20} className="text-sage" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {lockedTraitCount} more traits locked
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Unlock to see your full genetic profile
                  </p>
                </div>
                <button
                  onClick={openUnlockModal}
                  className="px-6 py-2.5 rounded-full bg-sage text-[#13110e] font-semibold text-sm hover:bg-sage/90 transition-colors"
                >
                  Unlock Full Report — {UNLOCK_PRICE}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
