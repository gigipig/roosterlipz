'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAppState } from '@/components/providers/app-state-provider';
import { useUser } from '@/hooks/use-user';
import { PaywallOverlay } from '@/components/app/paywall-overlay';
import { getRecipesForUser, getScoreLevel } from '@/lib/recipes';
import {
  getTraitFoodCallouts, tieredFoodGroupsByAncestry,
  type TraitCallout, type AncestryTieredGroups,
} from '@/lib/diet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ScoredRecipe, Recipe } from '@/lib/types';

// ─── Trait Callout Card ────────────────────────────────────────────────────────

function TraitCalloutCard({ callout }: { callout: TraitCallout }) {
  const borderClass = callout.isWatch
    ? 'border-amber/25 bg-gradient-to-br from-amber/[0.06] to-transparent hover:border-amber/40'
    : 'border-sage/25 bg-gradient-to-br from-sage/[0.07] to-transparent hover:border-sage/40';
  const badgeClass = callout.isWatch
    ? 'bg-amber/15 text-amber'
    : 'bg-sage/15 text-sage';
  const badgeLabel = callout.isWatch ? 'Watch' : 'Genetic Strength';

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 ${borderClass}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-serif text-base text-foreground leading-snug">
          {callout.icon} {callout.title}
        </h4>
        <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider whitespace-nowrap ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{callout.note}</p>
      {callout.matchedFoods.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {callout.matchedFoods.map(food => (
            <span
              key={food}
              className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-foreground/80 border border-border"
            >
              {food}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Plain food chip ───────────────────────────────────────────────────────────

function FoodChip({ food }: { food: string }) {
  return (
    <span className="inline-flex text-xs px-2.5 py-1 rounded-full border border-border bg-card/50 text-foreground">
      {food}
    </span>
  );
}

// ─── Tiered food section (ancestry-based) ────────────────────────────────────

function TieredFoodSection({ groups, label }: { groups: AncestryTieredGroups; label?: string }) {
  const [regionalOpen, setRegionalOpen] = useState(false);
  const { enjoy, minimize } = groups;
  const hasRegional = minimize.length > 0;

  return (
    <div className="space-y-5">
      {label && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>}

      {/* Enjoy — 2+ ancestries */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />
          <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Enjoy</span>
          <span className="text-xs text-muted-foreground/50">({enjoy.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {enjoy.length > 0
            ? enjoy.map(({ food }) => <FoodChip key={food} food={food} />)
            : <span className="text-xs text-muted-foreground italic">None identified</span>
          }
        </div>
      </div>

      {/* Regional — 1 ancestry only (collapsible) */}
      {hasRegional && (
        <>
          <button
            onClick={() => setRegionalOpen(o => !o)}
            className="flex items-center gap-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            <span className={cn('transition-transform duration-200', regionalOpen && 'rotate-90')}>▶</span>
            <span>Regional</span>
            <span className="text-muted-foreground/40">({minimize.length})</span>
          </button>

          {regionalOpen && (
            <div className="pl-3 border-l border-border/60">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Regional</span>
                <span className="text-xs text-muted-foreground/40 ml-1">One ancestral tradition only</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {minimize.map(({ food }) => <FoodChip key={food} food={food} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Per-ancestry food card ────────────────────────────────────────────────────

function AncestryFoodCard({
  geoName,
  diet,
}: {
  geoName: string;
  diet: { common_foods: string[]; staples?: string[]; diet_signature?: string };
}) {
  const displayFoods = [...new Set([...(diet.staples ?? []), ...diet.common_foods])].slice(0, 6);

  return (
    <div className="p-5 rounded-2xl border border-border bg-card/60 min-w-[220px] max-w-sm shrink-0 sm:shrink">
      <div className="mb-3">
        <h4 className="font-serif text-base text-foreground">{geoName}</h4>
        {diet.diet_signature && (
          <p className="text-xs text-muted-foreground/70 italic leading-relaxed mt-1 line-clamp-2">
            {diet.diet_signature}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {displayFoods.map(food => (
          <span
            key={food}
            className="text-xs px-2 py-0.5 rounded-full border border-border bg-muted/40 text-foreground/80"
          >
            {food}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Recipe dialog ────────────────────────────────────────────────────────────

function RecipeDialog({
  recipe,
  score,
  open,
  onClose,
}: {
  recipe: Recipe | null;
  score: number;
  open: boolean;
  onClose: () => void;
}) {
  if (!recipe) return null;
  const level = getScoreLevel(score);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-foreground leading-snug pr-4">
            {recipe.name}
          </DialogTitle>
          {recipe.description && (
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {recipe.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="flex flex-wrap gap-2">
            {score > 0 && (
              <span className={cn(
                'text-xs px-2.5 py-1 rounded-full font-medium',
                level.cssClass === 'recipe-score-high' ? 'bg-sage/20 text-sage' :
                level.cssClass === 'recipe-score-moderate' ? 'bg-amber/20 text-amber' :
                'bg-muted text-muted-foreground'
              )}>
                {level.label}
              </span>
            )}
            {recipe.difficulty && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{recipe.difficulty}</span>
            )}
            {totalTime > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">⏱ {totalTime} min</span>
            )}
            {recipe.servings && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">👥 {recipe.servings} servings</span>
            )}
          </div>

          {recipe.culturalContext && (
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Cultural Context</p>
              <p className="text-sm text-foreground leading-relaxed">{recipe.culturalContext}</p>
            </div>
          )}

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ingredients</p>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary mt-1 shrink-0">•</span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Instructions</p>
              <ol className="space-y-2">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-medium mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {recipe.nutritionalHighlights && recipe.nutritionalHighlights.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nutritional Highlights</p>
              <div className="flex flex-wrap gap-1.5">
                {recipe.nutritionalHighlights.map((h, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-sage/10 text-sage border border-sage/20">{h}</span>
                ))}
              </div>
            </div>
          )}

          {recipe.geneticRelevance && recipe.geneticRelevance.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Genetic Relevance</p>
              <div className="space-y-1.5">
                {recipe.geneticRelevance.map((g, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      g.relevance === 'high' ? 'bg-sage' : g.relevance === 'moderate' ? 'bg-amber' : 'bg-muted-foreground'
                    )} />
                    <span className="text-foreground font-medium">{g.trait}</span>
                    {g.note && <span className="text-muted-foreground">— {g.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main tab ─────────────────────────────────────────────────────────────────

type FoodFilter = 'all' | 'ancestral' | 'proteins' | 'fats' | 'herbs';

const FILTER_TABS: { key: FoodFilter; label: string; description: string }[] = [
  { key: 'all',      label: 'All Foods',  description: 'Every food from your ancestry' },
  { key: 'ancestral',label: 'Ancestral',  description: 'Core staple foods shared across your ancestry' },
  { key: 'proteins', label: 'Proteins',   description: 'Animal and plant protein sources' },
  { key: 'fats',     label: 'Fats',       description: 'Dietary fats and oils' },
  { key: 'herbs',    label: 'Herbs',      description: 'Herbs, spices and aromatics' },
];

export function FoodsTab() {
  const { blended, genetics, isUnlocked, openUnlockModal } = useAppState();
  const { user, toggleBookmark: persistToggleBookmark } = useUser();
  const [scoredRecipes, setScoredRecipes] = useState<ScoredRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<FoodFilter>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<{ recipe: Recipe; score: number } | null>(null);

  useEffect(() => {
    if (user?.bookmarkedRecipes) {
      setBookmarks(new Set(user.bookmarkedRecipes));
    }
  }, [user]);

  const g = genetics as Record<string, unknown> | null | undefined;

  useEffect(() => {
    if (!blended) return;
    setIsLoading(true);
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 10_000)
    );
    Promise.race([getRecipesForUser(blended, g ?? undefined), timeout])
      .then(recipes => { setScoredRecipes((recipes as ScoredRecipe[]).slice(0, 24)); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blended, genetics]);

  const traitCallouts = useMemo(() => {
    if (!blended || !g) return [];
    return getTraitFoodCallouts(blended, g as Record<string, unknown>);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blended, genetics]);

  const groups = useMemo(() => {
    if (!blended) return null;
    const allFoods = [...new Set([...blended.commonFoods, ...blended.allProteins, ...blended.allFats, ...blended.allHerbs])];
    return {
      all:      tieredFoodGroupsByAncestry(allFoods, blended),
      ancestral: tieredFoodGroupsByAncestry(blended.commonFoods, blended),
      proteins:  tieredFoodGroupsByAncestry(blended.allProteins, blended),
      fats:      tieredFoodGroupsByAncestry(blended.allFats, blended),
      herbs:     tieredFoodGroupsByAncestry(blended.allHerbs, blended),
    };
  }, [blended]);

  if (!blended) return null;

  if (!isUnlocked) {
    return (
      <PaywallOverlay
        title="Foods & Recipes"
        description="Your personalised food tiers — Genetic Trait Matches, ancestral food cards, and scored recipes."
        included={[
          'Genetic Trait Matches (how your variants fit your ancestry)',
          'Per-ancestry food cards',
          'Browse Foods: Enjoy / Regional tiers by ancestry weight',
          'Scored & bookmarkable recipe cards',
          'Filter by food group or ancestry',
        ]}
        onOpenUnlock={openUnlockModal}
      />
    );
  }

  const toggleBookmark = useCallback((id: string) => {
    persistToggleBookmark(id);
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [persistToggleBookmark]);

  const activeTab = FILTER_TABS.find(t => t.key === activeFilter)!;

  return (
    <div className="space-y-8">

      {/* ── 1. Genetic Trait Matches ── */}
      {traitCallouts.length > 0 && (
        <section>
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h3 className="font-serif text-xl text-foreground">Genetic Trait Matches</h3>
              <span className="text-xs text-muted-foreground/60 bg-muted/40 rounded-full px-2.5 py-1 tabular-nums">
                {traitCallouts.length} matched
              </span>
            </div>
            <p className="text-sm text-muted-foreground/70">
              How your genetic variants interact with your ancestral food tradition.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {traitCallouts.map(callout => (
              <TraitCalloutCard key={callout.traitKey} callout={callout} />
            ))}
          </div>
        </section>
      )}

      {/* ── 2. By Ancestry ── */}
      {blended.geos.length > 0 && (
        <section>
          <div className="mb-4">
            <h3 className="font-serif text-xl text-foreground mb-1">By Ancestry</h3>
            <p className="text-sm text-muted-foreground/70">
              Core staples from each branch of your heritage.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 xl:grid-cols-4 sm:overflow-visible">
            {blended.geos.map((geo, i) => {
              const diet = blended.diets[i];
              if (!diet) return null;
              return (
                <AncestryFoodCard
                  key={geo.id}
                  geoName={geo.name}
                  diet={diet as { common_foods: string[]; staples?: string[]; diet_signature?: string }}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── 3. Browse Foods ── */}
      {groups && (
        <section>
          <div className="mb-4">
            <h3 className="font-serif text-xl text-foreground mb-1">Browse Foods</h3>
            <p className="text-sm text-muted-foreground/70">
              {activeTab.description}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 mb-6 flex-wrap">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150',
                  activeFilter === key
                    ? 'bg-foreground text-background'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card">
            <TieredFoodSection groups={groups[activeFilter]} />

            {/* Cooking methods (All view only) */}
            {activeFilter === 'all' && blended.allCooking.length > 0 && (
              <div className="mt-6 pt-5 border-t border-border/60">
                <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2.5">
                  Ancestral Cooking Methods
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {blended.allCooking.map(m => (
                    <span
                      key={m}
                      className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground border border-border"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 4. Ancestral Recipes ── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif text-xl text-foreground mb-0.5">Ancestral Recipes</h3>
            <p className="text-xs text-muted-foreground/60">
              {genetics ? 'Scored for your genetic profile' : 'Based on your ancestry'}
            </p>
          </div>
          <span className="text-xs text-muted-foreground/50 tabular-nums">
            {scoredRecipes.length} recipes
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scoredRecipes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No recipes found for your ancestral regions.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {scoredRecipes.map(({ recipe, score }) => {
              const level = getScoreLevel(score);
              const isBookmarked = bookmarks.has(recipe.id);
              return (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe({ recipe, score })}
                  className="p-5 rounded-2xl bg-card border border-border flex flex-col gap-3 text-left hover:border-foreground/20 transition-all duration-150 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                      {recipe.name}
                    </h4>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={e => { e.stopPropagation(); toggleBookmark(recipe.id); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.stopPropagation(); toggleBookmark(recipe.id); } }}
                      className={`text-lg shrink-0 transition-colors cursor-pointer leading-none ${isBookmarked ? 'text-amber' : 'text-muted-foreground hover:text-amber'}`}
                      aria-label="Bookmark recipe"
                    >
                      {isBookmarked ? '★' : '☆'}
                    </span>
                  </div>

                  {recipe.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{recipe.description}</p>
                  )}

                  <div className="flex items-center gap-2 mt-auto flex-wrap">
                    {genetics && (
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        level.cssClass === 'recipe-score-high' ? 'bg-sage/15 text-sage' :
                        level.cssClass === 'recipe-score-moderate' ? 'bg-amber/15 text-amber' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {level.label}
                      </span>
                    )}
                    {recipe.difficulty && (
                      <span className="text-xs text-muted-foreground/60">{recipe.difficulty}</span>
                    )}
                    {recipe.prepTime != null && (
                      <span className="text-xs text-muted-foreground/60">{recipe.prepTime + (recipe.cookTime ?? 0)} min</span>
                    )}
                  </div>

                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="border-t border-border/60 pt-2.5">
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.slice(0, 5).map((ing, i) => (
                          <span key={i} className="text-xs bg-muted/60 rounded-md px-1.5 py-0.5 text-foreground/70">{ing}</span>
                        ))}
                        {recipe.ingredients.length > 5 && (
                          <span className="text-xs text-muted-foreground/50">+{recipe.ingredients.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-muted-foreground/40 group-hover:text-sage/60 transition-colors">
                    View full recipe →
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Recipe detail modal */}
      <RecipeDialog
        recipe={selectedRecipe?.recipe ?? null}
        score={selectedRecipe?.score ?? 0}
        open={selectedRecipe !== null}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
}
