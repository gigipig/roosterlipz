'use client';

import { Lock } from 'lucide-react';
import { useAppState } from '@/components/providers/app-state-provider';
import { analyzeGeneticTraits, calculateCategoryScores } from '@/lib/genetics';
import { generateDietArchetype } from '@/lib/diet';
import { UNLOCK_PRICE } from '@/lib/unlock';
import { Progress } from '@/components/ui/progress'; // still used by category scores
import type { CategoryScore } from '@/lib/types';

export function OverviewTab() {
  const { blended, genetics, isUnlocked, openUnlockModal } = useAppState();
  if (!blended) return null;

  const analysis = genetics ? analyzeGeneticTraits(genetics) : null;
  const categoryScores = genetics ? calculateCategoryScores(genetics) : null;
  const archetype = generateDietArchetype(blended);
  const { blendedMacros, geos, weights } = blended;

  return (
    <div className="space-y-8">
      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-amber/10 border border-amber/20 text-sm text-muted-foreground">
        <strong className="text-foreground">Educational use only.</strong> These predictions are probabilistic estimates based on population-level genetics — not a medical diagnosis. Consult a healthcare professional before significant dietary changes.
      </div>

      {/* Ancestry Mix — single segmented bar */}
      <section className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-serif text-xl text-foreground mb-4">Your Ancestry Mix</h3>
        {/* Segmented bar */}
        <div className="flex w-full h-4 rounded-full overflow-hidden gap-0.5 mb-4">
          {geos.map((geo, i) => {
            const pct = Math.round(weights[i] * 100);
            const colors = [
              'bg-amber',
              'bg-sage',
              'bg-blue-500',
              'bg-purple-400',
            ];
            return (
              <div
                key={geo.id}
                className={`h-full ${colors[i % colors.length]}`}
                style={{ width: `${pct}%` }}
                title={`${geo.name} ${pct}%`}
              />
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {geos.map((geo, i) => {
            const pct = Math.round(weights[i] * 100);
            const dotColors = [
              'bg-amber',
              'bg-sage',
              'bg-blue-500',
              'bg-purple-400',
            ];
            return (
              <div key={geo.id} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColors[i % dotColors.length]}`} />
                <span className="text-sm text-foreground">{geo.name}</span>
                <span className="text-xs text-muted-foreground font-medium">{pct}%</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Macro Profile */}
      <section className="p-6 rounded-2xl bg-card border border-border">
        <div className="flex items-baseline gap-3 mb-4">
          <h3 className="font-serif text-xl text-foreground">Blended Macro Profile</h3>
          {archetype && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted/60 border border-border text-muted-foreground font-medium">
              {archetype}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Carbs', value: blendedMacros.carbs_pct, color: 'bg-blue-500' },
            { label: 'Protein', value: blendedMacros.protein_pct, color: 'bg-sage' },
            { label: 'Fat', value: blendedMacros.fat_pct, color: 'bg-amber' },
          ].map(m => (
            <div key={m.label} className="text-center p-4 rounded-xl bg-muted/30">
              <div className="text-3xl font-serif text-foreground mb-1">{m.value}%</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">{m.label}</div>
            </div>
          ))}
        </div>
        {/* Stacked bar */}
        <div className="h-3 rounded-full overflow-hidden flex">
          <div className="bg-blue-500 h-full" style={{ width: `${blendedMacros.carbs_pct}%` }} />
          <div className="bg-sage h-full" style={{ width: `${blendedMacros.protein_pct}%` }} />
          <div className="bg-amber h-full" style={{ width: `${blendedMacros.fat_pct}%` }} />
        </div>
      </section>

      {/* Category Scores */}
      {categoryScores && categoryScores.length > 0 && (
        <section className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-serif text-xl text-foreground mb-4">Metabolic Categories</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {(categoryScores.filter((cat): cat is CategoryScore => cat !== null)).map(cat => (
              <div key={cat.id} className="p-4 rounded-xl bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{cat.icon} {cat.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    cat.statusClass === 'high' ? 'bg-sage/20 text-sage' :
                    cat.statusClass === 'moderate' ? 'bg-amber/20 text-amber' :
                    'bg-destructive/20 text-destructive'
                  }`}>{cat.statusLabel}</span>
                </div>
                <Progress value={cat.score} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Insights */}
      {analysis && (analysis.strengths.length > 0 || analysis.watchItems.length > 0) && (
        <section className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-serif text-xl text-foreground mb-4">Key Genetic Insights</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {analysis.strengths.length > 0 && (() => {
              const limit = isUnlocked ? 5 : 2;
              const visible = analysis.strengths.slice(0, limit);
              const hidden = analysis.strengths.length - visible.length;
              return (
                <div>
                  <h4 className="text-sm font-medium text-sage mb-3 uppercase tracking-wider">Strengths</h4>
                  <div className="space-y-3">
                    {visible.map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-lg">{s.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-foreground">{s.title}</div>
                          <div className="text-xs text-muted-foreground">{s.detail}</div>
                        </div>
                      </div>
                    ))}
                    {hidden > 0 && (
                      <button
                        onClick={openUnlockModal}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
                      >
                        <Lock size={11} />
                        <span>and {hidden} more</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
            {analysis.watchItems.length > 0 && (() => {
              const limit = isUnlocked ? 5 : 2;
              const visible = analysis.watchItems.slice(0, limit);
              const hidden = analysis.watchItems.length - visible.length;
              return (
                <div>
                  <h4 className="text-sm font-medium text-amber mb-3 uppercase tracking-wider">Watch</h4>
                  <div className="space-y-3">
                    {visible.map((w, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-lg">{w.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-foreground">{w.title}</div>
                          <div className="text-xs text-muted-foreground">{w.detail}</div>
                        </div>
                      </div>
                    ))}
                    {hidden > 0 && (
                      <button
                        onClick={openUnlockModal}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
                      >
                        <Lock size={11} />
                        <span>and {hidden} more</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Upgrade teaser — only shown when locked */}
      {!isUnlocked && (
        <section className="p-6 rounded-2xl border border-sage/20 bg-gradient-to-br from-sage/5 to-transparent">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-sage/15 border border-sage/20 flex items-center justify-center shrink-0 mt-0.5">
              <Lock size={16} className="text-sage" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-lg text-foreground mb-1">See your full report</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock 34+ trait genetics, daily meal guidelines, your full foods section, and PDF export — all for a one-time payment.
              </p>
              <button
                onClick={openUnlockModal}
                className="px-6 py-2.5 rounded-full bg-sage text-[#13110e] font-semibold text-sm hover:bg-sage/90 transition-colors"
              >
                Unlock Full Report — {UNLOCK_PRICE}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
