'use client';

import { Lock } from 'lucide-react';
import { useAppState } from '@/components/providers/app-state-provider';
import { getAncientRootsById } from '@/hooks/use-data';
import type { AncientRootsEntry } from '@/lib/types';

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function LockedSection({ label, preview }: { label: string; preview: string }) {
  return (
    <div className="relative">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5 flex items-center gap-1.5">
        <Lock size={10} className="text-amber" />
        {label}
      </div>
      <p className="text-sm text-foreground/30 select-none blur-[3px] leading-relaxed line-clamp-2">
        {preview}
      </p>
    </div>
  );
}

function AncientRootsCard({
  geoName,
  weight,
  roots,
  isUnlocked,
  onUpgradeClick,
}: {
  geoName: string;
  weight: number;
  roots: AncientRootsEntry | undefined;
  isUnlocked: boolean;
  onUpgradeClick: () => void;
}) {
  const pct = Math.round(weight * 100);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Card header */}
      <div className="px-6 pt-5 pb-4 border-b border-border/60 flex items-start justify-between gap-4">
        <div>
          <h4 className="font-serif text-lg text-foreground">{geoName}</h4>
          {roots ? (
            <p className="text-xs text-terracotta font-medium mt-0.5">{roots.era}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">Historical data coming soon</p>
          )}
        </div>
        <span className="shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">{pct}%</span>
      </div>

      {!roots ? (
        <div className="px-6 py-5 text-sm text-muted-foreground italic">
          No archaeological record available for this region yet.
        </div>
      ) : (
        <div className="px-6 py-5 space-y-5">
          {/* FREE — Peoples */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Ancestral peoples
            </div>
            <div className="flex flex-wrap gap-2">
              {roots.peoples.map((p) => (
                <span
                  key={p}
                  className="text-xs px-2.5 py-1 rounded-full border border-terracotta/25 bg-terracotta/5 text-foreground"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Divider + paid section */}
          {isUnlocked ? (
            <>
              {/* PAID — Environment */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Environment
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{roots.environment}</p>
              </div>

              {/* PAID — Subsistence */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  What they ate
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{roots.subsistence}</p>
              </div>

              {/* PAID — Genetic Legacy */}
              <div className="p-4 rounded-xl bg-sage/5 border border-sage/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-sage mb-1.5">
                  Genetic legacy
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{roots.genetic_legacy}</p>
              </div>
            </>
          ) : (
            <>
              <div className="border-t border-dashed border-border pt-4 space-y-4">
                <LockedSection label="Environment" preview={roots.environment} />
                <LockedSection label="What they ate" preview={roots.subsistence} />
                <LockedSection label="Genetic legacy" preview={roots.genetic_legacy} />
              </div>

              <button
                onClick={onUpgradeClick}
                className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-amber/30 bg-amber/5 text-amber text-sm font-medium hover:bg-amber/10 transition-colors"
              >
                <Lock size={13} />
                Unlock full history — £9.99
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main tab
// ──────────────────────────────────────────────

export function OriginsTab() {
  const { blended, isUnlocked, openUnlockModal } = useAppState();

  if (!blended) return null;

  const { geos, weights } = blended;

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <h3 className="font-serif text-xl text-foreground mb-1">Ancestral Origins</h3>
        <p className="text-sm text-muted-foreground">
          Archaeological and historical context for the peoples your diet descends from — spanning tens of thousands of years.
        </p>
      </div>

      {/* Per-ancestry cards */}
      <div className="space-y-4">
        {geos.map((geo, i) => (
          <AncientRootsCard
            key={geo.id}
            geoName={geo.name}
            weight={weights[i]}
            roots={getAncientRootsById(geo.id)}
            isUnlocked={isUnlocked}
            onUpgradeClick={openUnlockModal}
          />
        ))}
      </div>

      {/* Free-tier footnote */}
      {!isUnlocked && (
        <p className="text-xs text-muted-foreground text-center pb-2">
          Ancestral peoples and eras are free. Unlock to see environment, diet details, and genetic legacy.
        </p>
      )}
    </div>
  );
}
