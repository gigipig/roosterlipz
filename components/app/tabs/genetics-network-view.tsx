'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as d3Zoom from 'd3-zoom';
import * as d3Selection from 'd3-selection';
import {
  GENE_META,
  GENE_CATEGORY_MAP,
  GENE_CATEGORY_INFO,
  legacyKeyMap,
  getTraitMeterInfo,
} from '@/lib/genetics';
import { X, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORY_ORDER = [
  'macro', 'vitamins', 'cardio', 'appetite',
  'population', 'detox', 'metabolic', 'other',
] as const;

const CONFIDENCE_THRESHOLD = 0.75;
const LEAF_SPACING  = 68;  // horizontal px between trait nodes (diagonal labels are compact)
const CAT_R  = 24;
const TRAIT_R_HIGH = 16;   // high / moderate status
const TRAIT_R_LOW  = 10;   // low status — visually receded
const CAT_CY = 72;         // category node y
const TRAIT_CY = 260;      // trait node y

const STATUS_COLOR: Record<'high' | 'moderate' | 'low', string> = {
  high:     'oklch(0.55 0.12 150)',
  moderate: 'oklch(0.65 0.1  80)',
  low:      'oklch(0.55 0.12 55)',
};
const STATUS_BG: Record<'high' | 'moderate' | 'low', string> = {
  high:     'bg-sage/20 text-sage',
  moderate: 'bg-amber/20 text-amber',
  low:      'bg-muted text-muted-foreground',
};
const STATUS_FRIENDLY: Record<'high' | 'moderate' | 'low', string> = {
  high:     'Well adapted',
  moderate: 'Mixed signals',
  low:      'Worth supporting',
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface TraitNode {
  id:                   string;
  name:                 string;
  icon:                 string;
  cx:                   number;  // filled in at render time
  statusClass:          'high' | 'moderate' | 'low';
  value:                number;
  recommendation:       string;
  phenotype_confidence: number;
}

interface CategoryData {
  id:     string;
  label:  string;
  icon:   string;
  traits: TraitNode[];
}

// ── Data builder ──────────────────────────────────────────────────────────────

function buildCategories(genetics: Record<string, unknown>): CategoryData[] {
  const result: CategoryData[] = [];

  for (const catId of CATEGORY_ORDER) {
    const catInfo = (GENE_CATEGORY_INFO as Record<string, { label: string; icon: string }>)[catId]
      ?? { label: catId, icon: '🧬' };

    const traits: TraitNode[] = [];

    for (const [rawKey, rawTrait] of Object.entries(genetics)) {
      const metaKey = (legacyKeyMap as Record<string, string>)[rawKey] ?? rawKey;
      const meta = (GENE_META as Record<string, { icon: string; title: string } | undefined>)[metaKey];
      if (!meta) continue;

      const thisCat = (GENE_CATEGORY_MAP as Record<string, string>)[metaKey] ?? 'other';
      if (thisCat !== catId) continue;

      const { value, statusClass } = getTraitMeterInfo(rawKey, rawTrait) as {
        value: number; statusClass: 'high' | 'moderate' | 'low';
      };
      const t = rawTrait as Record<string, unknown>;
      const rec =
        (t.dietary_recommendation as Record<string, string> | undefined)?.recommendation ??
        (t.dietary_recommendation as Record<string, string> | undefined)?.notes ?? '';
      const confidence = typeof t.phenotype_confidence === 'number' ? t.phenotype_confidence : 1;

      traits.push({
        id: metaKey, name: meta.title, icon: meta.icon,
        cx: 0,  // assigned below
        statusClass, value, recommendation: rec,
        phenotype_confidence: confidence,
      });
    }

    if (traits.length === 0) continue;

    // Sort: high → moderate → low, then alphabetical within each tier
    traits.sort((a, b) => {
      const ord: Record<string, number> = { high: 0, moderate: 1, low: 2 };
      const diff = (ord[a.statusClass] ?? 2) - (ord[b.statusClass] ?? 2);
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });

    result.push({ id: catId, label: catInfo.label, icon: catInfo.icon, traits });
  }

  return result;
}

// Vertical cubic bezier
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const my = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
}

// ── Category summary line ─────────────────────────────────────────────────────

function CategorySummary({ traits }: { traits: TraitNode[] }) {
  const counts = traits.reduce(
    (acc, t) => { acc[t.statusClass] = (acc[t.statusClass] ?? 0) + 1; return acc; },
    {} as Record<string, number>,
  );
  const parts: string[] = [];
  if (counts.high)     parts.push(`${counts.high} well adapted`);
  if (counts.moderate) parts.push(`${counts.moderate} mixed`);
  if (counts.low)      parts.push(`${counts.low} worth supporting`);
  const lowConf = traits.filter(t => t.phenotype_confidence < CONFIDENCE_THRESHOLD).length;

  return (
    <p className="text-xs text-muted-foreground">
      {parts.join(' · ')}
      {lowConf > 0 && <span className="ml-2 opacity-60">· {lowConf} proxy estimate{lowConf > 1 ? 's' : ''}</span>}
    </p>
  );
}

// ── SVG canvas (single category) ─────────────────────────────────────────────

interface CanvasProps {
  cat:          CategoryData;
  height:       number;
  isFullscreen: boolean;
  onSelect:     (node: TraitNode | null) => void;
  selectedId:   string | null;
}

function CategoryCanvas({ cat, height, isFullscreen, onSelect, selectedId }: CanvasProps) {
  const svgRef   = useRef<SVGSVGElement | null>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Compute trait positions (centered)
  const { posTraits, catCX, treeWidth } = useMemo(() => {
    const n = cat.traits.length;
    const w = n * LEAF_SPACING;
    const positioned = cat.traits.map((t, i) => ({
      ...t,
      cx: i * LEAF_SPACING + LEAF_SPACING / 2,
    }));
    return { posTraits: positioned, catCX: w / 2, treeWidth: w };
  }, [cat.traits]);

  // Auto-fit whenever category or container changes
  useEffect(() => {
    if (!svgRef.current) return;
    const svgH = svgRef.current.clientHeight || height;
    const svgW = svgRef.current.clientWidth  || 800;
    // Diagonal labels extend upper-left ~80px in tree coords — add left padding
    const LABEL_PAD = 90;
    const padV = 50;
    const contentH = TRAIT_CY + TRAIT_R_HIGH + 8; // labels go UP, not down
    const usableW  = svgW - LABEL_PAD - padV;
    const scaleW = usableW / Math.max(treeWidth, 1);
    const scaleH = (svgH - padV * 2) / Math.max(contentH, 1);
    const k = Math.min(scaleW, scaleH, 1.6);
    // Offset so tree starts with room for leftward label extension
    const x = Math.max(LABEL_PAD, LABEL_PAD + (usableW - treeWidth * k) / 2);
    const y = Math.max(padV, (svgH - contentH * k) / 2);
    setTransform({ x, y, k });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat.id, height, isFullscreen, treeWidth]);

  // D3 zoom / pan
  useEffect(() => {
    if (!svgRef.current) return;
    const zoom = d3Zoom
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 5])
      .on('zoom', e => setTransform({ x: e.transform.x, y: e.transform.y, k: e.transform.k }));
    d3Selection.select(svgRef.current).call(zoom);
    return () => { d3Selection.select(svgRef.current as SVGSVGElement).on('.zoom', null); };
  }, []);

  const showEmoji = (r: number) => transform.k * r * 0.75 >= 7;

  return (
    <svg
      ref={svgRef}
      className="w-full cursor-grab active:cursor-grabbing"
      style={{ height }}
      onClick={() => onSelect(null)}
    >
      <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>

        {/* Links: category → traits */}
        {posTraits.map(t => (
          <path
            key={`link-${t.id}`}
            d={bezier(catCX, CAT_CY, t.cx, TRAIT_CY)}
            fill="none"
            stroke="oklch(0.72 0.003 60)"
            strokeWidth={1.4}
            opacity={
              hoveredId
                ? hoveredId === t.id || hoveredId === cat.id ? 0.75 : 0.07
                : 0.35
            }
            style={{ transition: 'opacity 0.1s' }}
          />
        ))}

        {/* Category node */}
        <g
          transform={`translate(${catCX},${CAT_CY})`}
          onMouseEnter={e => { e.stopPropagation(); setHoveredId(cat.id); }}
          onMouseLeave={() => setHoveredId(null)}
          style={{ cursor: 'default' }}
        >
          <circle r={CAT_R} fill="oklch(0.88 0.003 60)" stroke="white" strokeWidth={2} />
          {showEmoji(CAT_R) && (
            <text textAnchor="middle" dominantBaseline="central"
              fontSize={14} style={{ userSelect: 'none', pointerEvents: 'none' }}>
              {cat.icon}
            </text>
          )}
          <text x={0} y={CAT_R + 8} textAnchor="middle" dominantBaseline="hanging"
            fontSize={10} fontWeight="600" fill="oklch(0.38 0.004 60)"
            style={{ userSelect: 'none', pointerEvents: 'none' }}>
            {cat.label}
          </text>
        </g>

        {/* Trait nodes */}
        {posTraits.map(node => {
          const isLow      = node.statusClass === 'low';
          const r          = isLow ? TRAIT_R_LOW : TRAIT_R_HIGH;
          const isSelected = selectedId === node.id;
          const lowConf    = node.phenotype_confidence < CONFIDENCE_THRESHOLD;
          const dimmed     = hoveredId && hoveredId !== node.id && hoveredId !== cat.id;
          const fill       = STATUS_COLOR[node.statusClass];

          // Low-status nodes recede visually; proxy estimates further dimmed
          const baseOpacity = isLow ? 0.38 : 1;
          const opacity = (dimmed ? 0.1 : baseOpacity) * (lowConf ? 0.55 : 1);

          // Label: rotated -45° around the point just below the node so each
          // trait's text fans diagonally upper-left — zero horizontal overlap.
          const labelPivotY = r + 8;
          const labelFill = isLow
            ? 'oklch(0.62 0.003 60)'          // neutral grey for de-emphasised
            : STATUS_COLOR[node.statusClass];  // status colour for high/moderate

          return (
            <g
              key={node.id}
              transform={`translate(${node.cx},${TRAIT_CY})`}
              onMouseEnter={e => { e.stopPropagation(); setHoveredId(node.id); }}
              onMouseLeave={() => setHoveredId(null)}
              onClick={e => { e.stopPropagation(); onSelect(selectedId === node.id ? null : node); }}
              style={{ cursor: 'pointer', opacity, transition: 'opacity 0.1s' }}
            >
              {/* Selection halo */}
              {isSelected && (
                <circle r={r + 6} fill="none"
                  stroke={fill} strokeWidth={2} opacity={0.5} />
              )}
              {/* Proxy-estimate dashed ring */}
              {lowConf && (
                <circle r={r + 3} fill="none"
                  stroke="oklch(0.6 0.003 60)" strokeWidth={1}
                  strokeDasharray="3 2" opacity={0.55} />
              )}
              <circle r={r} fill={fill} fillOpacity={lowConf ? 0.55 : 1}
                stroke="white" strokeWidth={isLow ? 1 : 1.5} />
              {showEmoji(r) && (
                <text textAnchor="middle" dominantBaseline="central"
                  fontSize={isLow ? 7 : 10}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  {node.icon}
                </text>
              )}
              {/* Diagonal label — rotated -45° so adjacent names don't compete */}
              <text
                x={0}
                y={labelPivotY}
                textAnchor="end"
                dominantBaseline="hanging"
                fontSize={isLow ? 8 : 9}
                fill={labelFill}
                transform={`rotate(-45, 0, ${labelPivotY})`}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface GeneticNetworkViewProps {
  genetics: Record<string, unknown>;
}

export function GeneticNetworkView({ genetics }: GeneticNetworkViewProps) {
  const categories = useMemo(() => buildCategories(genetics), [genetics]);
  const [catIndex,     setCatIndex]     = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TraitNode | null>(null);

  const n   = categories.length;
  const cat = categories[Math.min(catIndex, n - 1)];

  // Reset selected node when changing category
  const goTo = useCallback((idx: number) => {
    setCatIndex(((idx % n) + n) % n);
    setSelectedNode(null);
  }, [n]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft')  goTo(catIndex - 1);
      if (e.key === 'ArrowRight') goTo(catIndex + 1);
      if (e.key === 'Escape')     setIsFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [catIndex, goTo]);

  if (!cat) return null;

  // ── Shared nav header ──
  function NavHeader({ slim = false }: { slim?: boolean }) {
    return (
      <div className={`flex items-center gap-3 ${slim ? 'px-4 py-2.5' : 'px-4 py-3'} border-b border-border shrink-0`}>
        <button
          onClick={() => goTo(catIndex - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
          aria-label="Previous category"
        >
          <ChevronLeft size={15} />
        </button>

        <div className="flex-1 min-w-0 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base">{cat.icon}</span>
            <span className="font-serif text-base font-semibold text-foreground truncate">{cat.label}</span>
            <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5 shrink-0">
              {catIndex + 1} / {n}
            </span>
          </div>
          <CategorySummary traits={cat.traits} />
        </div>

        <button
          onClick={() => goTo(catIndex + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
          aria-label="Next category"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    );
  }

  // ── Category dots ──
  function CategoryDots() {
    return (
      <div className="flex items-center justify-center gap-1.5 py-2 shrink-0">
        {categories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => goTo(i)}
            aria-label={c.label}
            className={`transition-all rounded-full ${
              i === catIndex
                ? 'w-5 h-2 bg-foreground'
                : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
          />
        ))}
      </div>
    );
  }

  // ── Detail panel ──
  function DetailPanel({ node, onClose }: { node: TraitNode; onClose: () => void }) {
    return (
      <div
        className="border-t border-border bg-card/97 backdrop-blur-sm px-4 py-3 space-y-2.5 shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl leading-none mt-0.5">{node.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{node.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_BG[node.statusClass]}`}>
                {STATUS_FRIENDLY[node.statusClass]}
              </span>
              {node.phenotype_confidence < CONFIDENCE_THRESHOLD && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/60">
                  ~ Proxy estimate
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X size={15} />
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Ancestral expression</span>
            <span>{node.value}%</span>
          </div>
          <Progress value={node.value} className="h-1.5" />
        </div>

        {node.phenotype_confidence < CONFIDENCE_THRESHOLD && (
          <p className="text-xs text-muted-foreground/70 italic">
            Population-specific data unavailable for some ancestral regions — result uses proxy estimates from genetically similar populations.
          </p>
        )}

        {node.recommendation && (
          <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2"
            dangerouslySetInnerHTML={{
              __html: node.recommendation
                .replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>'),
            }}
          />
        )}
      </div>
    );
  }

  // ── Legend ──
  function Legend({ inline = false }: { inline?: boolean }) {
    if (inline) {
      return (
        <div className="hidden sm:flex items-center gap-4 text-[10px] text-muted-foreground">
          {([['high', 'Well adapted'], ['moderate', 'Mixed signals'], ['low', 'Worth supporting']] as const).map(([s, l]) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLOR[s] }} />
              <span>{l}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-dashed border-muted-foreground" />
            <span>Proxy estimate</span>
          </div>
        </div>
      );
    }
    return (
      <div className="absolute top-3 right-3 z-10 rounded-xl border border-border bg-card/90 backdrop-blur-sm px-3 py-2.5 space-y-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Expression</p>
        {([['high', 'Well adapted'], ['moderate', 'Mixed signals'], ['low', 'Worth supporting']] as const).map(([s, l]) => (
          <div key={s} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: STATUS_COLOR[s] }} />
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{l}</span>
          </div>
        ))}
        <div className="border-t border-border pt-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-dashed border-muted-foreground" />
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">Proxy estimate</span>
          </div>
        </div>
      </div>
    );
  }

  // ── ESC closes fullscreen ──
  useEffect(() => {
    if (!isFullscreen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isFullscreen]);

  // ── Normal (inline) view ──
  const inlineView = (
    <div className="w-full rounded-2xl border border-border bg-card/30 overflow-hidden flex flex-col">
      <NavHeader />
      <div className="relative flex-1">
        <Legend />
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card/90 backdrop-blur-sm text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <Maximize2 size={11} />
          Expand
        </button>
        <CategoryCanvas
          cat={cat}
          height={420}
          isFullscreen={false}
          selectedId={selectedNode?.id ?? null}
          onSelect={setSelectedNode}
        />
      </div>
      <CategoryDots />
      {selectedNode && <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />}
    </div>
  );

  // ── Fullscreen portal ──
  const fullscreenView = isFullscreen
    ? createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative w-full h-full max-w-6xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Fullscreen header */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-border shrink-0">
              <button
                onClick={() => goTo(catIndex - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ChevronLeft size={15} />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-serif text-lg font-semibold text-foreground">{cat.label}</span>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {catIndex + 1} / {n}
                  </span>
                </div>
                <CategorySummary traits={cat.traits} />
              </div>
              <button
                onClick={() => goTo(catIndex + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <ChevronRight size={15} />
              </button>
              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-border">
                <Legend inline />
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground transition-colors ml-2"
              >
                <Minimize2 size={13} />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden min-h-0">
              <CategoryCanvas
                cat={cat}
                height={typeof window !== 'undefined' ? window.innerHeight - 220 : 600}
                isFullscreen={true}
                selectedId={selectedNode?.id ?? null}
                onSelect={setSelectedNode}
              />
            </div>

            {/* Dots + detail */}
            <CategoryDots />
            {selectedNode && <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {inlineView}
      {fullscreenView}
    </>
  );
}
