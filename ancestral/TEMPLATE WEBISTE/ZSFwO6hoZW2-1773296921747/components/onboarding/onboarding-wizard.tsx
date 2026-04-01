'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ArrowRight, Search, Check } from 'lucide-react';
import { getNationalitiesGrouped } from '@/lib/data';
import { saveUserFamilyTree, saveUserDNATest } from '@/lib/user';

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'family' | 'dna';

interface FamilyTree {
  mgm: string | null;
  mgf: string | null;
  pgm: string | null;
  pgf: string | null;
}

interface DnaEntry {
  regionId: string | null;
  percent: number;
}

type NationalityItem = { id: string; name: string; regionId: string };
type GroupedNationalities = Record<string, NationalityItem[]>;

// ─── Combobox ─────────────────────────────────────────────────────────────────

function NationalityCombobox({
  value,
  onChange,
  placeholder,
}: {
  value: string | null;
  onChange: (id: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const grouped = useMemo<GroupedNationalities>(() => getNationalitiesGrouped() as GroupedNationalities, []);

  const label = useMemo(() => {
    if (!value) return null;
    for (const items of Object.values(grouped)) {
      const found = items.find(n => n.id === value);
      if (found) return found.name;
    }
    return value;
  }, [value, grouped]);

  const filtered = useMemo<GroupedNationalities>(() => {
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result: GroupedNationalities = {};
    for (const [continent, items] of Object.entries(grouped)) {
      const matches = items.filter(n => n.name.toLowerCase().includes(q));
      if (matches.length) result[continent] = matches;
    }
    return result;
  }, [grouped, search]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleOutside);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`
          w-full flex items-center justify-between gap-3
          px-4 py-3.5 rounded-2xl border text-left
          transition-all duration-200
          ${value
            ? 'border-sage/40 bg-sage/5 text-foreground shadow-[0_0_0_1px_oklch(0.68_0.19_145/0.12)]'
            : 'border-border bg-card/50 text-muted-foreground hover:border-border/70 hover:bg-card/70'
          }
        `}
      >
        <span className={`text-sm truncate ${value ? 'text-foreground font-medium' : 'text-muted-foreground/50'}`}>
          {label ?? placeholder}
        </span>
        {value
          ? <div className="w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
              <Check size={11} className="text-sage" />
            </div>
          : <Search size={13} className="text-muted-foreground/30 shrink-0" />
        }
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-2xl shadow-black/60 overflow-hidden">
          <div className="p-2.5 border-b border-border">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
              <input
                ref={inputRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
                placeholder="Search 220+ nationalities…"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-muted/40 border border-border/60 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-sage/30 transition-colors"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {Object.entries(filtered).map(([continent, items]) => (
              <div key={continent}>
                <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.14em] bg-muted/10 sticky top-0 backdrop-blur-sm">
                  {continent}
                </div>
                {items.map(n => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => { onChange(n.id); setOpen(false); setSearch(''); }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors
                      flex items-center justify-between gap-2
                      ${n.id === value ? 'text-sage bg-sage/5' : 'text-foreground hover:bg-muted/30'}
                    `}
                  >
                    {n.name}
                    {n.id === value && <Check size={12} className="text-sage shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
            {Object.keys(filtered).length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground/40">
                No matches for &ldquo;{search}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 1: Mode selection ────────────────────────────────────────────────────

function Step1({ mode, onSelect }: { mode: Mode; onSelect: (m: Mode) => void }) {
  return (
    <div className="py-10 md:py-16">
      <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.18em] mb-5">
        Step 1 of 3
      </p>
      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground leading-[1.08] mb-4">
        How do you know<br />your ancestry?
      </h1>
      <p className="text-sm text-muted-foreground/70 mb-10 max-w-sm leading-relaxed">
        Choose the method that best fits your situation. Either way, all processing stays on your device.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Family Tree */}
        <button
          type="button"
          onClick={() => onSelect('family')}
          className={`
            relative text-left p-7 rounded-3xl border transition-all duration-300
            ${mode === 'family'
              ? 'border-sage/50 bg-sage/[0.06] shadow-[0_0_0_1px_oklch(0.68_0.19_145/0.18),0_12px_40px_oklch(0.68_0.19_145/0.07)]'
              : 'border-border bg-card hover:border-border/70 hover:bg-card/80'
            }
          `}
        >
          {/* Selection ring */}
          <div className="absolute top-5 right-5">
            <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
              mode === 'family' ? 'border-sage bg-sage' : 'border-muted-foreground/25'
            }`}>
              {mode === 'family' && <Check size={10} strokeWidth={3} className="text-[#13110e]" />}
            </div>
          </div>

          <div className="text-3xl mb-5 select-none">🌳</div>
          <h3 className="font-serif text-xl text-foreground mb-2">Family Tree</h3>
          <p className="text-xs text-muted-foreground/70 leading-relaxed mb-5">
            Select your 4 grandparents&apos; nationalities for the full Mendelian inheritance analysis — the most accurate method.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage flex-shrink-0" />
            <span className="text-[11px] text-muted-foreground/50">Full 34+ trait genetic profile</span>
          </div>
        </button>

        {/* DNA Test */}
        <button
          type="button"
          onClick={() => onSelect('dna')}
          className={`
            relative text-left p-7 rounded-3xl border transition-all duration-300
            ${mode === 'dna'
              ? 'border-sage/50 bg-sage/[0.06] shadow-[0_0_0_1px_oklch(0.68_0.19_145/0.18),0_12px_40px_oklch(0.68_0.19_145/0.07)]'
              : 'border-border bg-card hover:border-border/70 hover:bg-card/80'
            }
          `}
        >
          <div className="absolute top-5 right-5">
            <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
              mode === 'dna' ? 'border-sage bg-sage' : 'border-muted-foreground/25'
            }`}>
              {mode === 'dna' && <Check size={10} strokeWidth={3} className="text-[#13110e]" />}
            </div>
          </div>

          <div className="text-3xl mb-5 select-none">🧬</div>
          <h3 className="font-serif text-xl text-foreground mb-2">DNA Test</h3>
          <p className="text-xs text-muted-foreground/70 leading-relaxed mb-5">
            Enter your ancestry percentages from 23andMe, AncestryDNA, MyHeritage, or any similar service.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
            <span className="text-[11px] text-muted-foreground/50">Blended ancestral diet profile</span>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground/40 text-center mt-8">
        Tap a card to select and continue automatically
      </p>
    </div>
  );
}

// ─── Step 2: Ancestry input ────────────────────────────────────────────────────

const GRANDPARENT_SLOTS = [
  { key: 'mgm' as const, label: 'Maternal Grandmother', short: 'Grandmother', side: 'maternal' },
  { key: 'mgf' as const, label: 'Maternal Grandfather', short: 'Grandfather', side: 'maternal' },
  { key: 'pgm' as const, label: 'Paternal Grandmother', short: 'Grandmother', side: 'paternal' },
  { key: 'pgf' as const, label: 'Paternal Grandfather', short: 'Grandfather', side: 'paternal' },
];

function Step2Family({
  familyTree,
  setFamilyTree,
  onNext,
}: {
  familyTree: FamilyTree;
  setFamilyTree: (ft: FamilyTree) => void;
  onNext: () => void;
}) {
  const filledCount = Object.values(familyTree).filter(Boolean).length;
  const allFilled = filledCount === 4;

  return (
    <div className="py-10 md:py-16">
      <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.18em] mb-5">
        Step 2 of 3
      </p>
      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground leading-[1.08] mb-4">
        Where are your<br />grandparents from?
      </h1>
      <p className="text-sm text-muted-foreground/70 mb-2 max-w-sm leading-relaxed">
        Each grandparent contributes 25% of your genetic ancestry. Select all four for the full Mendelian analysis.
      </p>

      {/* Progress pill */}
      <div className="flex items-center gap-2 mb-10">
        <div className="flex gap-1">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1 w-6 rounded-full transition-all duration-300 ${
                i < filledCount ? 'bg-sage' : 'bg-border'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground/50 tabular-nums">{filledCount} of 4 selected</span>
      </div>

      {/* Two-column family tree layout */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {/* Maternal side */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.14em]">Maternal</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          {GRANDPARENT_SLOTS.filter(s => s.side === 'maternal').map(slot => (
            <div key={slot.key}>
              <p className="text-xs text-muted-foreground/60 mb-1.5 pl-1">{slot.short}</p>
              <NationalityCombobox
                value={familyTree[slot.key]}
                onChange={v => setFamilyTree({ ...familyTree, [slot.key]: v })}
                placeholder={`Select ${slot.short.toLowerCase()}'s origin…`}
              />
            </div>
          ))}
        </div>

        {/* Paternal side */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-[0.14em]">Paternal</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          {GRANDPARENT_SLOTS.filter(s => s.side === 'paternal').map(slot => (
            <div key={slot.key}>
              <p className="text-xs text-muted-foreground/60 mb-1.5 pl-1">{slot.short}</p>
              <NationalityCombobox
                value={familyTree[slot.key]}
                onChange={v => setFamilyTree({ ...familyTree, [slot.key]: v })}
                placeholder={`Select ${slot.short.toLowerCase()}'s origin…`}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!allFilled}
        className={`
          w-full flex items-center justify-center gap-2.5
          py-4 rounded-2xl text-sm font-semibold transition-all duration-300
          ${allFilled
            ? 'bg-sage text-[#13110e] hover:bg-sage/90 shadow-[0_4px_24px_oklch(0.68_0.19_145/0.25)]'
            : 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
          }
        `}
      >
        {allFilled ? 'Continue' : `Select all 4 grandparents (${filledCount}/4)`}
        {allFilled && <ArrowRight size={16} />}
      </button>
    </div>
  );
}

function Step2DNA({
  dnaEntries,
  setDnaEntries,
  dnaTotal,
  onNext,
}: {
  dnaEntries: DnaEntry[];
  setDnaEntries: (entries: DnaEntry[]) => void;
  dnaTotal: number;
  onNext: () => void;
}) {
  const isValid = dnaEntries.some(e => e.regionId && e.percent > 0) && dnaTotal >= 99 && dnaTotal <= 100;
  const isOver = dnaTotal > 100;

  return (
    <div className="py-10 md:py-16">
      <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.18em] mb-5">
        Step 2 of 3
      </p>
      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground leading-[1.08] mb-4">
        What&apos;s your<br />ancestry breakdown?
      </h1>
      <p className="text-sm text-muted-foreground/70 mb-10 max-w-sm leading-relaxed">
        Enter your results from 23andMe, AncestryDNA, or similar. Percentages must total 100%.
      </p>

      <div className="space-y-3 mb-8">
        {dnaEntries.map((entry, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card/50"
          >
            <span className="text-xs text-muted-foreground/40 w-5 text-center tabular-nums">{idx + 1}</span>
            <div className="flex-1 min-w-0">
              <NationalityCombobox
                value={entry.regionId}
                onChange={v => {
                  const updated = [...dnaEntries];
                  updated[idx] = { ...entry, regionId: v };
                  setDnaEntries(updated);
                }}
                placeholder="Select origin…"
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="number"
                min={0}
                max={100}
                value={entry.percent || ''}
                onChange={e => {
                  const updated = [...dnaEntries];
                  updated[idx] = { ...entry, percent: Number(e.target.value) };
                  setDnaEntries(updated);
                }}
                placeholder="0"
                className="w-16 px-2.5 py-2 text-sm text-center rounded-xl bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-sage/30 transition-colors tabular-nums"
              />
              <span className="text-xs text-muted-foreground/40">%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Total indicator */}
      <div className={`
        flex items-center justify-between px-4 py-3 rounded-xl mb-8
        ${isOver ? 'bg-destructive/10 border border-destructive/20' : isValid ? 'bg-sage/5 border border-sage/20' : 'bg-muted/30 border border-border'}
      `}>
        <span className="text-xs text-muted-foreground">Total</span>
        <span className={`text-sm font-semibold tabular-nums ${isOver ? 'text-destructive' : isValid ? 'text-sage' : 'text-foreground'}`}>
          {dnaTotal}% {isValid ? '✓' : isOver ? '— over 100%' : '— must reach 100%'}
        </span>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className={`
          w-full flex items-center justify-center gap-2.5
          py-4 rounded-2xl text-sm font-semibold transition-all duration-300
          ${isValid
            ? 'bg-sage text-[#13110e] hover:bg-sage/90 shadow-[0_4px_24px_oklch(0.68_0.19_145/0.25)]'
            : 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
          }
        `}
      >
        Continue
        {isValid && <ArrowRight size={16} />}
      </button>
    </div>
  );
}

// ─── Step 3: Confirm + optional email ─────────────────────────────────────────

function Step3({
  mode,
  familyTree,
  dnaEntries,
  email,
  setEmail,
  onFinish,
}: {
  mode: Mode;
  familyTree: FamilyTree;
  dnaEntries: DnaEntry[];
  email: string;
  setEmail: (e: string) => void;
  onFinish: () => void;
}) {
  const grouped = useMemo<GroupedNationalities>(() => getNationalitiesGrouped() as GroupedNationalities, []);

  function getLabel(id: string | null) {
    if (!id) return '—';
    for (const items of Object.values(grouped)) {
      const found = items.find(n => n.id === id);
      if (found) return found.name;
    }
    return id;
  }

  const summaryItems: { label: string; value: string }[] =
    mode === 'family'
      ? [
          { label: 'Maternal Grandmother', value: getLabel(familyTree.mgm) },
          { label: 'Maternal Grandfather', value: getLabel(familyTree.mgf) },
          { label: 'Paternal Grandmother', value: getLabel(familyTree.pgm) },
          { label: 'Paternal Grandfather', value: getLabel(familyTree.pgf) },
        ]
      : dnaEntries
          .filter(e => e.regionId && e.percent > 0)
          .map(e => ({ label: `${e.percent}%`, value: getLabel(e.regionId) }));

  return (
    <div className="py-10 md:py-16">
      <p className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.18em] mb-5">
        Step 3 of 3
      </p>
      <h1 className="font-serif italic text-4xl md:text-5xl text-foreground leading-[1.08] mb-4">
        Your profile<br />is set.
      </h1>
      <p className="text-sm text-muted-foreground/70 mb-10 max-w-sm leading-relaxed">
        We&apos;re ready to calculate your blended ancestral diet
        {mode === 'family' ? ' and full genetic profile' : ''}.
      </p>

      {/* Summary card */}
      <div className="p-5 rounded-2xl border border-border bg-card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">{mode === 'family' ? '🌳' : '🧬'}</span>
          <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-[0.12em]">
            {mode === 'family' ? 'Family Tree Mode' : 'DNA Test Mode'}
          </span>
        </div>
        <div className="space-y-2">
          {summaryItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground/50 shrink-0">{item.label}</span>
              <span className="text-sm text-foreground text-right">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional email */}
      <div className="mb-8">
        <label className="block text-xs text-muted-foreground/60 mb-2">
          Email — optional
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3.5 rounded-2xl border border-border bg-card/60 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-sage/40 transition-colors"
        />
        <p className="text-[11px] text-muted-foreground/40 mt-1.5 pl-1">
          We&apos;ll send you a link to revisit your results. No account required.
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onFinish}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-sage text-[#13110e] text-sm font-semibold hover:bg-sage/90 transition-all duration-300 shadow-[0_4px_24px_oklch(0.68_0.19_145/0.25)] mb-4"
      >
        Calculate My Ancestral Diet
        <ArrowRight size={16} />
      </button>

      <p className="text-center text-xs text-muted-foreground/40">
        100% private — everything runs on your device
      </p>
    </div>
  );
}

// ─── Main wizard ───────────────────────────────────────────────────────────────

export interface OnboardingWizardProps {
  onClose: () => void;
}

export function OnboardingWizard({ onClose }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [animKey, setAnimKey] = useState(0);

  const [mode, setMode] = useState<Mode>('family');
  const [familyTree, setFamilyTree] = useState<FamilyTree>({
    mgm: null, mgf: null, pgm: null, pgf: null,
  });
  const [dnaEntries, setDnaEntries] = useState<DnaEntry[]>([
    { regionId: null, percent: 0 },
    { regionId: null, percent: 0 },
    { regionId: null, percent: 0 },
    { regionId: null, percent: 0 },
  ]);
  const [email, setEmail] = useState('');

  const dnaTotal = dnaEntries.reduce((s, e) => s + (e.percent || 0), 0);

  function go(nextStep: 1 | 2 | 3, direction: 'fwd' | 'back') {
    setDir(direction);
    setAnimKey(k => k + 1);
    setStep(nextStep);
  }

  function handleModeSelect(m: Mode) {
    setMode(m);
    go(2, 'fwd');
  }

  function handleFinish() {
    if (mode === 'family') {
      saveUserFamilyTree({
        mgm: familyTree.mgm,
        mgf: familyTree.mgf,
        pgm: familyTree.pgm,
        pgf: familyTree.pgf,
      });
    } else {
      saveUserDNATest(dnaEntries.map(e => ({ regionId: e.regionId, percent: e.percent })));
    }
    router.push('/app');
  }

  // Keyboard: Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const animStyle: React.CSSProperties = {
    animation: `${dir === 'fwd' ? 'wizardSlideInRight' : 'wizardSlideInLeft'} 0.38s cubic-bezier(0.4, 0, 0.2, 1) both`,
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-background"
      style={{ animation: 'wizardOverlayIn 0.25s ease both' }}
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 20% 80%, oklch(0.68 0.19 145 / 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 20%, oklch(0.72 0.1 75 / 0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3 shrink-0 border-b border-border/30">
        {/* Back / Close */}
        <button
          onClick={() => step > 1 ? go((step - 1) as 1 | 2 | 3, 'back') : onClose()}
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all duration-200"
          aria-label={step > 1 ? 'Back' : 'Close'}
        >
          {step > 1 ? <ChevronLeft size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Progress bars */}
        <div className="flex items-center gap-1.5">
          {([1, 2, 3] as const).map(s => (
            <div
              key={s}
              className="h-[3px] rounded-full transition-all duration-500 ease-out"
              style={{
                width: s === step ? 32 : s < step ? 24 : 16,
                background: s <= step
                  ? 'oklch(0.68 0.19 145)'
                  : 'oklch(0.27 0.012 60)',
                opacity: s < step ? 0.45 : 1,
              }}
            />
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all duration-200"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* ─── Step content ─────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-y-auto">
        <div
          key={animKey}
          style={animStyle}
          className="max-w-lg mx-auto px-5 md:px-6"
        >
          {step === 1 && (
            <Step1 mode={mode} onSelect={handleModeSelect} />
          )}
          {step === 2 && mode === 'family' && (
            <Step2Family
              familyTree={familyTree}
              setFamilyTree={setFamilyTree}
              onNext={() => go(3, 'fwd')}
            />
          )}
          {step === 2 && mode === 'dna' && (
            <Step2DNA
              dnaEntries={dnaEntries}
              setDnaEntries={setDnaEntries}
              dnaTotal={dnaTotal}
              onNext={() => go(3, 'fwd')}
            />
          )}
          {step === 3 && (
            <Step3
              mode={mode}
              familyTree={familyTree}
              dnaEntries={dnaEntries}
              email={email}
              setEmail={setEmail}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>

      {/* ─── Footer brand mark ────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-center py-4 shrink-0">
        <p className="text-[10px] text-muted-foreground/25 tracking-[0.12em] uppercase">
          Ancestral Diet Explorer
        </p>
      </div>
    </div>
  );
}
