'use client';

import { useState } from 'react';
import { useAppState } from '@/components/providers/app-state-provider';
import { analyzeGeneticTraits, GENE_META, DAILY_GUIDELINE_RULES, legacyKeyMap } from '@/lib/genetics';
import { generateDietArchetype, getTraitFoodCallouts, type TraitCallout } from '@/lib/diet';
import { PaywallOverlay } from '@/components/app/paywall-overlay';

// Short gene symbol labels shown as 🧬 badges on guideline rule cards
const GENE_CODE_MAP: Record<string, string> = {
  clock_chronotype:         'CLOCK',
  per1_meal_timing:         'PER1',
  caffeine_metabolism:      'CYP1A2',
  adora2a_caffeine_anxiety: 'ADORA2A',
  dao_histamine:            'DAO',
  glucose_metabolism:       'SLC2A2',
  lepr_satiety:             'LEPR',
  bdnf_fat_appetite:        'BDNF',
  lactase:                  'LCT',
  iron_metabolism:          'HFE',
  comt_methylation:         'COMT',
  abcg2_gout:               'ABCG2',
  g6pd_deficiency:          'G6PD',
  salt_sensitivity:         'ACE',
  cyp2r1_vitamin_d:         'CYP2R1',
};

// WHO/typical Western dietary reference averages
const POPULATION_AVERAGES = { carbs: 55, protein: 17, fat: 28 };

interface DailyRule {
  gene: string;
  triggerMin?: number;
  triggerMax?: number;
  period: string;
  type: 'prefer' | 'limit' | 'timing';
  note: string;
  foods: string[];
  useProbability?: boolean;
}

// ============================================================================
// Top Priorities Banner
// ============================================================================

type PriorityItem = { icon: string; title: string; detail: string };

function TopPrioritiesSection({
  priorities,
}: {
  priorities: { watchItems: PriorityItem[]; strengths: PriorityItem[] };
}) {
  const watchItems = priorities.watchItems.slice(0, 3);
  const strengthItems = priorities.strengths.slice(0, 1);

  if (watchItems.length === 0 && strengthItems.length === 0) return null;

  return (
    <section className="p-6 rounded-2xl bg-card border border-border space-y-4 card-lift">
      <div className="flex items-center gap-3">
        <h3 className="font-serif text-xl text-foreground">Your Top Priorities</h3>
        {watchItems.length > 0 && (
          <span className="text-xs bg-amber/20 text-amber px-2 py-0.5 rounded-full">
            {watchItems.length} action{watchItems.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Genetic markers in your ancestry that warrant specific dietary attention.
      </p>

      <div className="space-y-2">
        {watchItems.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 rounded-xl border border-amber/25 bg-amber/5"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber/20 border border-amber/30 flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-amber leading-none">#{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">
                  {item.icon} {item.title}
                </span>
                <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-amber/20 text-amber whitespace-nowrap">
                  ⚠ Watch
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        ))}

        {strengthItems.map((item, i) => (
          <div
            key={`s${i}`}
            className="flex gap-4 p-4 rounded-xl border border-sage/20 bg-sage/5"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center mt-0.5">
              <span className="text-xs text-sage leading-none">✓</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">
                  {item.icon} {item.title}
                </span>
                <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-sage/20 text-sage whitespace-nowrap">
                  ✓ Strength
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Macro Range Bar
// ============================================================================

type MacroColor = 'blue' | 'sage' | 'amber';

function MacroRangeBar({
  label,
  blended,
  values,
  color,
  popAvg,
}: {
  label: string;
  blended: number;
  values: number[];
  color: MacroColor;
  popAvg: number;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const hasRange = values.length > 1;

  const bandBg  = color === 'blue' ? 'bg-blue-500/25' : color === 'sage' ? 'bg-sage/25' : 'bg-amber/25';
  const dotBg   = color === 'blue' ? 'bg-blue-500'    : color === 'sage' ? 'bg-sage'    : 'bg-amber';
  const legendBg = color === 'blue' ? 'bg-blue-500/40' : color === 'sage' ? 'bg-sage/40' : 'bg-amber/40';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-serif text-foreground">{blended}%</span>
          {hasRange && (
            <span className="text-xs text-muted-foreground">
              ({min}–{max}% range)
            </span>
          )}
        </div>
      </div>

      {/* Bar */}
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="absolute inset-x-0 h-2 bg-muted/40 rounded-full" />
        {/* Ancestral range band */}
        {hasRange && (
          <div
            className={`absolute h-2 ${bandBg} rounded-sm`}
            style={{ left: `${min}%`, width: `${max - min}%` }}
          />
        )}
        {/* Population average tick */}
        <div
          className="absolute h-5 w-px bg-foreground/25"
          style={{ left: `${popAvg}%` }}
          title={`Typical diet average: ${popAvg}%`}
        />
        {/* Blended value dot */}
        <div
          className={`absolute -translate-x-1/2 w-4 h-4 rounded-full border-2 border-background shadow-sm ${dotBg}`}
          style={{ left: `${blended}%` }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <div className="flex items-center gap-3">
          {hasRange && (
            <span className="flex items-center gap-1">
              <span className={`w-3 h-1.5 rounded-sm inline-block ${legendBg}`} />
              Ancestral range
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="w-px h-3 bg-foreground/25 inline-block" />
            Avg {popAvg}%
          </span>
        </div>
        <span>100%</span>
      </div>
    </div>
  );
}

type MacroDict = { carbs_pct: number; protein_pct: number; fat_pct: number };

function MacroRangeSection({
  blended,
  archetype,
}: {
  blended: { diets: Array<{ macros: MacroDict }>; blendedMacros: MacroDict };
  archetype?: string;
}) {
  const { diets, blendedMacros } = blended;

  return (
    <section className="p-6 rounded-2xl bg-card border border-border space-y-5 card-lift">
      <div>
        <div className="flex items-baseline gap-3">
          <h3 className="font-serif text-xl text-foreground">📊 Your Macro Profile</h3>
          {archetype && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted/60 border border-border text-muted-foreground font-medium">
              {archetype}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Your blended ancestral targets.
          {diets.length > 1 && (
            <> Shaded band shows the range across your ancestral backgrounds; tick marks the typical Western diet average.</>
          )}
        </p>
      </div>
      <div className="space-y-5">
        <MacroRangeBar
          label="Carbohydrates"
          blended={blendedMacros.carbs_pct}
          values={diets.map(d => d.macros.carbs_pct)}
          color="blue"
          popAvg={POPULATION_AVERAGES.carbs}
        />
        <MacroRangeBar
          label="Protein"
          blended={blendedMacros.protein_pct}
          values={diets.map(d => d.macros.protein_pct)}
          color="sage"
          popAvg={POPULATION_AVERAGES.protein}
        />
        <MacroRangeBar
          label="Fat"
          blended={blendedMacros.fat_pct}
          values={diets.map(d => d.macros.fat_pct)}
          color="amber"
          popAvg={POPULATION_AVERAGES.fat}
        />
      </div>
    </section>
  );
}

// ============================================================================
// Genetic Highlights (trait-level callout banners)
// ============================================================================

function TraitCalloutBanner({ callout }: { callout: TraitCallout }) {
  const isWatch = callout.isWatch;
  const borderClass = isWatch
    ? 'border-amber/25 bg-amber/5'
    : 'border-sage/20 bg-sage/5';
  const badgeClass = isWatch ? 'bg-amber/20 text-amber' : 'bg-sage/20 text-sage';
  const badgeLabel = isWatch ? '⚠ Watch' : '✓ Strength';

  return (
    <div className={`flex flex-col sm:flex-row gap-3 p-4 rounded-xl border ${borderClass}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-foreground">
            {callout.icon} {callout.title}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${badgeClass}`}>
            {badgeLabel}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{callout.note}</p>
      </div>
      {callout.matchedFoods.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:justify-end sm:content-start">
          {callout.matchedFoods.map(food => (
            <span
              key={food}
              className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-foreground/70 border border-border whitespace-nowrap"
            >
              {food}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Daily Guidelines Section
// ============================================================================

function DailyGuidelinesSection({
  genetics,
  blended,
}: {
  genetics: Record<string, unknown>;
  blended: { commonFoods: string[]; allProteins: string[]; allFats: string[]; allHerbs: string[] };
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const allBlendedFoods = [
    ...blended.commonFoods,
    ...blended.allProteins,
    ...blended.allFats,
    ...blended.allHerbs,
  ].map(f => f.toLowerCase());

  const triggered: DailyRule[] = [];
  (DAILY_GUIDELINE_RULES as DailyRule[]).forEach((rule) => {
    const trait = genetics[rule.gene] as Record<string, unknown> | undefined;
    if (!trait) return;
    let value: number;
    if (rule.useProbability) {
      value = ((trait.probability as number) || 0) * 100;
      if (rule.triggerMax !== undefined && value > rule.triggerMax) return;
      if (rule.triggerMin !== undefined && value < rule.triggerMin) return;
    } else {
      value = (trait.frequency as number) || (trait.allele_frequency_percent as number) || 0;
      if (rule.triggerMin !== undefined && value < rule.triggerMin) return;
    }
    triggered.push(rule);
  });

  if (triggered.length === 0) return null;

  function getRuleMeta(geneKey: string) {
    const metaKey = (legacyKeyMap as Record<string, string>)[geneKey] || geneKey;
    return (GENE_META as Record<string, { icon: string; title: string }>)[metaKey] || {
      icon: '🧬',
      title: geneKey.replace(/_/g, ' '),
    };
  }

  function isInDiet(food: string) {
    return allBlendedFoods.some(
      bf => bf.includes(food.toLowerCase()) || food.toLowerCase().includes(bf),
    );
  }

  const allDayRules = triggered.filter(r => r.period === 'all');
  const periods: Record<string, { emoji: string; label: string; rules: DailyRule[] }> = {
    morning:   { emoji: '🌅', label: 'Morning',   rules: [] },
    afternoon: { emoji: '☀️', label: 'Afternoon', rules: [] },
    evening:   { emoji: '🌙', label: 'Evening',   rules: [] },
  };
  triggered.filter(r => r.period !== 'all').forEach(rule => {
    if (periods[rule.period]) periods[rule.period].rules.push(rule);
  });
  const activePeriods = Object.entries(periods)
    .filter(([, p]) => p.rules.length > 0)
    .map(([key, p]) => ({ key, ...p }));

  const currentKey = selectedPeriod ?? activePeriods[0]?.key ?? null;
  const currentPeriod = currentKey ? periods[currentKey] : null;

  function RuleCard({ rule }: { rule: DailyRule }) {
    const meta = getRuleMeta(rule.gene);
    const geneCode = GENE_CODE_MAP[rule.gene];
    const typeColor =
      rule.type === 'prefer' ? 'bg-sage/20 text-sage' :
      rule.type === 'limit'  ? 'bg-amber/20 text-amber' :
                               'bg-muted text-muted-foreground';
    const typeLabel =
      rule.type === 'prefer' ? 'Prefer' :
      rule.type === 'limit'  ? 'Limit' :
                               'Timing';
    const foodColor = rule.type === 'prefer' ? 'bg-sage/10 text-sage' : 'bg-amber/10 text-amber';

    return (
      <div className="p-3 rounded-xl border border-border bg-card/50 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-medium text-foreground/90">
            {meta.icon} {meta.title}
          </span>
          <div className="flex items-center gap-1.5">
            {geneCode && (
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
                🧬 {geneCode}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${typeColor}`}>
              {typeLabel}
            </span>
          </div>
        </div>
        {rule.note && (
          <p className="text-xs text-muted-foreground">{rule.note}</p>
        )}
        {rule.foods.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {rule.foods.map(f => (
              <span
                key={f}
                className={`text-xs px-2 py-0.5 rounded-full ${foodColor} ${isInDiet(f) ? 'ring-1 ring-current font-medium' : ''}`}
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="p-6 rounded-2xl bg-card border border-border space-y-4 card-lift">
      <div>
        <h3 className="font-serif text-xl text-foreground">📅 Daily Guidelines</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Personalised timing &amp; food recommendations based on your genetic profile.
          <span className="ml-1 text-sage">Highlighted foods</span> appear in your ancestral diet.
        </p>
      </div>

      {allDayRules.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              All Day
            </span>
            <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
              {allDayRules.length} rule{allDayRules.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {allDayRules.map((rule, i) => (
              <RuleCard key={i} rule={rule} />
            ))}
          </div>
        </div>
      )}

      {activePeriods.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-xl">
            {activePeriods.map(p => (
              <button
                key={p.key}
                onClick={() => setSelectedPeriod(p.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentKey === p.key
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground/80'
                }`}
              >
                <span>{p.emoji}</span>
                <span>{p.label}</span>
                <span className={`text-xs rounded-full px-1.5 py-px ${
                  currentKey === p.key
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-muted/50 text-muted-foreground/60'
                }`}>
                  {p.rules.length}
                </span>
              </button>
            ))}
          </div>

          {currentPeriod && (
            <div className="space-y-2">
              {currentPeriod.rules.map((rule, i) => (
                <RuleCard key={i} rule={rule} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ============================================================================
// Diet Food Section — plain chips, no interaction
// ============================================================================

function DietFoodSection({
  foods,
  heading,
  chipClass,
}: {
  foods: string[];
  heading: string;
  chipClass: string;
}) {
  return (
    <section className="p-6 rounded-2xl bg-card border border-border card-lift">
      <h3 className="font-serif text-xl text-foreground mb-4">{heading}</h3>
      <div className="flex flex-wrap gap-2">
        {foods.map(f => (
          <span
            key={f}
            className={`inline-flex text-xs px-2.5 py-1 rounded-full ${chipClass}`}
          >
            {f}
          </span>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// Diet Tab
// ============================================================================

export function DietTab() {
  const { blended, genetics, isUnlocked, openUnlockModal } = useAppState();
  if (!blended) return null;

  if (!isUnlocked) {
    return (
      <PaywallOverlay
        title="Daily Diet Guidelines"
        description="Your personalised daily plan — when to eat, what to prioritise, and which foods to limit based on your ancestry."
        included={[
          'Daily Guidelines (morning, afternoon, evening)',
          'Meal timing recommendations',
          'Per-ancestry dietary breakdown',
          'Protein, fat & herb food lists',
          'Genetic driver labels on each rule',
        ]}
        onOpenUnlock={openUnlockModal}
      />
    );
  }

  const priorities = genetics ? analyzeGeneticTraits(genetics) : null;
  const archetype = generateDietArchetype(blended);
  const { allProteins, allFats, allHerbs } = blended;
  const g = genetics as Record<string, unknown> | null;
  const traitCallouts = g ? getTraitFoodCallouts(blended, g) : [];

  return (
    <div className="space-y-8">
      {/* Top Priorities Banner */}
      {priorities && (
        <TopPrioritiesSection priorities={priorities} />
      )}

      {/* Macro Profile with range bar */}
      <MacroRangeSection blended={blended} archetype={archetype} />

      {/* Genetic Highlights — trait-level food callouts */}
      {traitCallouts.length > 0 && (
        <section className="space-y-3">
          <div>
            <h3 className="font-serif text-xl text-foreground">🧬 Genetic Highlights</h3>
            <p className="text-xs text-muted-foreground mt-1">
              How your genetic profile interacts with your ancestral food tradition.
            </p>
          </div>
          <div className="space-y-2">
            {traitCallouts.map(c => (
              <TraitCalloutBanner key={c.traitKey} callout={c} />
            ))}
          </div>
        </section>
      )}

      {/* Blended Food Lists */}
      {allProteins.length > 0 && (
        <DietFoodSection
          foods={allProteins}
          heading="Protein Sources"
          chipClass="bg-sage/10 text-sage"
        />
      )}
      {allFats.length > 0 && (
        <DietFoodSection
          foods={allFats}
          heading="Healthy Fats"
          chipClass="bg-amber/10 text-amber"
        />
      )}
      {allHerbs.length > 0 && (
        <DietFoodSection
          foods={allHerbs}
          heading="Herbs & Spices"
          chipClass="bg-muted text-foreground"
        />
      )}

      {/* Daily Guidelines — genetics-driven timing rules with gene badges */}
      {g && (
        <DailyGuidelinesSection
          genetics={g as Record<string, unknown>}
          blended={blended}
        />
      )}
    </div>
  );
}
