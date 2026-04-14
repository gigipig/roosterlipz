'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Lock, X } from 'lucide-react';
import { useAppState } from '@/components/providers/app-state-provider';
import { getAncientRootsById } from '@/hooks/use-data';
import type { AncientRootsEntry } from '@/lib/types';

// ─── Region → [lng, lat] coordinates ─────────────────────────────────────
const REGION_COORDINATES: Record<string, [number, number]> = {
  aboriginal_aus:    [133, -27],
  amazon:            [-60, -5],
  anatolian:         [35, 39],
  andean:            [-70, -13],
  arabian:           [45, 23],
  inuit:             [-70, 70],
  australian_coastal:[150, -33],
  bengal:            [88, 23],
  brazilian_coastal: [-43, -23],
  california_coast:  [-120, 37],
  canadian_prairies: [-105, 52],
  caribbean_taino:   [-70, 18],
  caucasus:          [45, 42],
  central_africa:    [22, 2],
  central_asia:      [65, 45],
  maasai:            [36, -3],
  eastern_europe:    [25, 52],
  eastern_woodlands: [-80, 43],
  ethiopia:          [38, 8],
  gaucho:            [-57, -32],
  great_plains:      [-100, 42],
  highland_se_asia:  [99, 19],
  horn_somalia:      [45, 7],
  se_asia_island:    [115, 0],
  japan:             [138, 36],
  korea:             [128, 37],
  kurdish:           [43, 37],
  se_asia_main:      [102, 14],
  med_levant:        [36, 33],
  med_southern:      [12, 37],
  melanesia:         [160, -8],
  mesoamerica:       [-90, 17],
  micronesia:        [158, 8],
  mongolia:          [105, 47],
  maori:             [172, -41],
  nepal:             [84, 28],
  nordic:            [15, 62],
  maghreb:           [3, 34],
  north_china:       [116, 40],
  north_india:       [77, 28],
  pacific_nw:        [-123, 48],
  patagonia:         [-68, -45],
  persian:           [54, 32],
  polynesia:         [-150, -15],
  sahel:             [0, 14],
  siberia:           [90, 62],
  sichuan_sw_china:  [104, 30],
  south_china:       [114, 23],
  south_india:       [78, 12],
  southeast_us:      [-85, 33],
  southern_africa:   [25, -28],
  southwest_us:      [-110, 34],
  subarctic:         [-80, 60],
  tibet:             [90, 32],
  west_africa:       [-3, 11],
  western_europe:    [8, 48],
  west_india:        [73, 22],
  central_europe:    [15, 50],
  nilotic:           [32, 7],
  sudanian:          [16, 13],
  balkan:            [21, 43],
};

// ─── World map (SSR-disabled) ─────────────────────────────────────────────
interface MapProps {
  geos: Array<{ id: string; name: string }>;
  weights: number[];
  onSelectGeo: (id: string) => void;
}

function AncestryWorldMapInner({ geos, weights, onSelectGeo }: MapProps) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ComposableMap, Geographies, Geography, Marker } = require('react-simple-maps');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const worldData = require('world-atlas/countries-110m.json');

  return (
    <div className="w-full rounded-2xl border border-border bg-card overflow-hidden">
      <ComposableMap
        projectionConfig={{ scale: 147 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={worldData}>
          {({ geographies }: { geographies: unknown[] }) =>
            geographies.map((geo: unknown) => (
              <Geography
                key={(geo as { rsmKey: string }).rsmKey}
                geography={geo}
                fill="oklch(0.93 0.003 60)"
                stroke="oklch(0.85 0.003 60)"
                strokeWidth={0.4}
                style={{
                  default: { outline: 'none' },
                  hover:   { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {geos.map((geo, i) => {
          const coords = REGION_COORDINATES[geo.id];
          if (!coords) return null;
          const weight = weights[i] ?? 0.25;
          const baseR = 5 + weight * 18;

          return (
            <Marker
              key={geo.id}
              coordinates={coords}
              onClick={() => onSelectGeo(geo.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring */}
              <circle
                r={baseR + 6}
                fill="none"
                stroke="var(--terracotta)"
                strokeWidth={1.5}
                opacity={0.25}
                className="ancestry-pulse"
              />
              {/* Filled dot */}
              <circle r={baseR} fill="var(--terracotta)" opacity={0.85} />
              {/* Label */}
              <text
                textAnchor="middle"
                y={baseR + 14}
                style={{
                  fontSize: 8,
                  fill: 'oklch(0.45 0.01 60)',
                  fontFamily: 'inherit',
                  pointerEvents: 'none',
                }}
              >
                {geo.name}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}

const AncestryWorldMap = dynamic(
  () => Promise.resolve(AncestryWorldMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-48 rounded-2xl border border-border bg-card/50 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Loading map…</p>
      </div>
    ),
  }
);

// ─── Sub-components ───────────────────────────────────────────────────────

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
    <div className="bg-card overflow-hidden">
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

          {isUnlocked ? (
            <>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Environment
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{roots.environment}</p>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  What they ate
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{roots.subsistence}</p>
              </div>

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

// ─── Popup modal ──────────────────────────────────────────────────────────

function AncestryPopup({
  geo,
  weight,
  isUnlocked,
  onClose,
  onUpgradeClick,
}: {
  geo: { id: string; name: string };
  weight: number;
  isUnlocked: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
}) {
  const roots = getAncientRootsById(geo.id);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 origins-backdrop-in"
      style={{ backgroundColor: 'oklch(0 0 0 / 0.35)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-sm rounded-2xl border border-border shadow-2xl overflow-hidden origins-modal-in"
        style={{ backgroundColor: 'var(--card)', maxHeight: '80vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-7 h-7 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <X size={13} />
        </button>

        <AncientRootsCard
          geoName={geo.name}
          weight={weight}
          roots={roots}
          isUnlocked={isUnlocked}
          onUpgradeClick={onUpgradeClick}
        />
      </div>
    </div>
  );
}

// ─── Main tab ─────────────────────────────────────────────────────────────

export function OriginsTab() {
  const { blended, isUnlocked, openUnlockModal } = useAppState();
  const [selectedGeoId, setSelectedGeoId] = useState<string | null>(null);

  const closePopup = useCallback(() => setSelectedGeoId(null), []);

  // Close on Escape key
  useEffect(() => {
    if (!selectedGeoId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePopup(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedGeoId, closePopup]);

  if (!blended) return null;

  const { geos, weights } = blended;

  const selectedIdx = selectedGeoId ? geos.findIndex((g) => g.id === selectedGeoId) : -1;
  const selectedGeo = selectedIdx >= 0 ? geos[selectedIdx] : null;
  const selectedWeight = selectedIdx >= 0 ? (weights[selectedIdx] ?? 0.25) : 0.25;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h3 className="font-serif text-xl text-foreground mb-1">Ancestral Origins</h3>
        <p className="text-sm text-muted-foreground">
          Archaeological and historical context for the peoples your diet descends from — spanning tens of thousands of years.
          <span className="ml-1 text-terracotta/80">Tap a pin to explore.</span>
        </p>
      </div>

      {/* Interactive map */}
      <AncestryWorldMap
        geos={geos}
        weights={weights}
        onSelectGeo={setSelectedGeoId}
      />

      {/* Free-tier footnote */}
      {!isUnlocked && (
        <p className="text-xs text-muted-foreground text-center pb-2">
          Ancestral peoples and eras are free. Unlock to see environment, diet details, and genetic legacy.
        </p>
      )}

      {/* Popup — rendered when a pin is tapped */}
      {selectedGeo && (
        <AncestryPopup
          key={selectedGeo.id}
          geo={selectedGeo}
          weight={selectedWeight}
          isUnlocked={isUnlocked}
          onClose={closePopup}
          onUpgradeClick={() => { closePopup(); openUnlockModal(); }}
        />
      )}
    </div>
  );
}
