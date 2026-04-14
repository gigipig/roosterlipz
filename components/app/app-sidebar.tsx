'use client';

import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useAppState } from '@/components/providers/app-state-provider';
import { blendDiets, HEALTH_CONCERN_CONFIG } from '@/lib/diet';
import { getDietById } from '@/lib/data';
import { calculateMendelianGenetics } from '@/lib/genetics';
import { getNationalitiesGrouped, getRegionIdFromNationality } from '@/lib/data';
import {
  getUserAncestry, getUserSavedDiet, getUserHealthConcerns, getUser,
  saveUserFamilyTree, saveUserDNATest, saveUserDiet, saveHealthConcerns
} from '@/lib/user';
import type { GeneticTrait } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';

const GRANDPARENT_LABELS = [
  { key: 'mgm' as const, label: "Maternal Grandmother" },
  { key: 'mgf' as const, label: "Maternal Grandfather" },
  { key: 'pgm' as const, label: "Paternal Grandmother" },
  { key: 'pgf' as const, label: "Paternal Grandfather" },
];

function NationalitySelect({
  value,
  onChange,
  placeholder,
}: {
  value: string | null;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [search, setSearch] = useState('');
  const grouped = useMemo(() => getNationalitiesGrouped(), []);

  const filtered = useMemo(() => {
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, { id: string; name: string; regionId: string }[]> = {};
    for (const [continent, items] of Object.entries(grouped)) {
      const matches = items.filter(n => n.name.toLowerCase().includes(q));
      if (matches.length) result[continent] = matches;
    }
    return result;
  }, [grouped, search]);

  return (
    <Select value={value || ''} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-card border-border text-sm h-9">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        <div className="p-2 border-b border-border">
          <Input
            placeholder="Search nationalities…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-7 text-xs"
            onKeyDown={e => e.stopPropagation()}
          />
        </div>
        {Object.entries(filtered).map(([continent, items]) => (
          <div key={continent}>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest bg-muted/30">
              {continent}
            </div>
            {items.map(n => (
              <SelectItem key={n.id} value={n.id} className="text-sm pl-4">
                {n.name}
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AppSidebar({ onClose, onOpenWizard }: { onClose?: () => void; onOpenWizard?: () => void }) {
  const {
    mode, setMode,
    familyTree, setFamilyTree,
    dnaTest, setDNATest,
    setResults, setIsCalculating, setActiveTab,
    healthConcerns, setHealthConcerns,
  } = useAppState();

  const [username, setUsername] = useState<string>('');

  // Restore persisted selections and saved results on mount
  useEffect(() => {
    const user = getUser();
    setUsername(user.username);

    const ancestry = getUserAncestry();
    setMode(ancestry.mode);

    const ft = ancestry.familyTree;
    setFamilyTree({
      mgm: ft.maternalGrandmother,
      mgf: ft.maternalGrandfather,
      pgm: ft.paternalGrandmother,
      pgf: ft.paternalGrandfather,
    });

    setDNATest(
      ancestry.dnaTest.map(e => ({ regionId: e.regionId, percent: e.percent }))
    );

    const savedConcerns = getUserHealthConcerns();
    setHealthConcerns(savedConcerns);

    const savedDiet = getUserSavedDiet();
    if (savedDiet) {
      setResults(
        savedDiet.data.blended,
        (savedDiet.data.mendelianGenetics as Record<string, GeneticTrait> | undefined) ?? null
      );
      setActiveTab('overview');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dnaTotal = dnaTest.reduce((s, e) => s + (e.percent || 0), 0);
  const isTotalValid = dnaTotal >= 99 && dnaTotal <= 100;

  const familyComplete = Object.values(familyTree).every(v => v !== null);
  const dnaComplete = dnaTest.some(e => e.regionId && e.percent > 0) && isTotalValid;

  const canCalculate = mode === 'family' ? familyComplete : dnaComplete;

  async function handleCalculate() {
    setIsCalculating(true);
    try {
      if (mode === 'family') {
        const regionIds = [familyTree.mgm!, familyTree.mgf!, familyTree.pgm!, familyTree.pgf!]
          .map(n => getRegionIdFromNationality(n) || n)
          .filter(Boolean);

        const blended = blendDiets(regionIds, [0.25, 0.25, 0.25, 0.25]);
        if (!blended) throw new Error('No diet data found for selected ancestries.');

        const gpDiets = regionIds.map(id => getDietById(id)).filter(Boolean);
        const genetics = gpDiets.length === 4
          ? calculateMendelianGenetics(gpDiets as unknown[])
          : null;

        setResults(blended, genetics as Record<string, GeneticTrait> | null);

        // Persist ancestry + results
        saveUserFamilyTree({ mgm: familyTree.mgm, mgf: familyTree.mgf, pgm: familyTree.pgm, pgf: familyTree.pgf });
        saveUserDiet({ blended, mendelianGenetics: (genetics as Record<string, GeneticTrait> | undefined) ?? undefined }, 'family');

        setActiveTab('overview');
        toast.success('Results calculated!');
        onClose?.();
      } else {
        const validEntries = dnaTest.filter(e => e.regionId && e.percent > 0);
        const regionIds = validEntries.map(e => getRegionIdFromNationality(e.regionId!) || e.regionId!);
        const weights = validEntries.map(e => e.percent / 100);

        const blended = blendDiets(regionIds, weights);
        if (!blended) throw new Error('No diet data found for selected ancestries.');

        setResults(blended, null);

        // Persist ancestry + results
        saveUserDNATest(dnaTest.map(e => ({ regionId: e.regionId, percent: e.percent })));
        saveUserDiet({ blended }, 'dna');

        setActiveTab('overview');
        toast.success('Results calculated!');
        onClose?.();
      }
    } catch (err) {
      toast.error((err as Error).message || 'Calculation failed.');
      setIsCalculating(false);
    }
  }

  function toggleHealthConcern(id: string) {
    const next = healthConcerns.includes(id)
      ? healthConcerns.filter(c => c !== id)
      : [...healthConcerns, id];
    setHealthConcerns(next);
    saveHealthConcerns(next);
  }

  return (
    <div className="h-full flex flex-col bg-sidebar overflow-y-auto">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-serif text-lg text-foreground mb-0.5">Your Ancestry</h2>
            {username && (
              <p className="text-xs font-mono text-primary/70 mb-1">{username}</p>
            )}
            <p className="text-xs text-muted-foreground">Select your grandparents&apos; backgrounds to calculate your personalized diet</p>
          </div>
          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200 mt-0.5"
              title="Edit ancestry with guided wizard"
            >
              <Pencil size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex rounded-full bg-muted p-1 gap-1">
          <button
            onClick={() => setMode('family')}
            className={cn(
              'flex-1 py-1.5 rounded-full text-sm transition-all',
              mode === 'family'
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Family Tree
          </button>
          <button
            onClick={() => setMode('dna')}
            className={cn(
              'flex-1 py-1.5 rounded-full text-sm transition-all',
              mode === 'dna'
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            DNA Test
          </button>
        </div>
      </div>

      {/* Family Tree Panel */}
      {mode === 'family' && (
        <div className="p-4 flex flex-col gap-4 border-b border-sidebar-border">
          <p className="text-xs text-muted-foreground">
            Select all 4 grandparents for full Mendelian genetics analysis.
          </p>
          {GRANDPARENT_LABELS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">{label}</Label>
              <NationalitySelect
                value={familyTree[key]}
                onChange={(v) => setFamilyTree({ ...familyTree, [key]: v })}
                placeholder={`Select ${label.split(' ')[1].toLowerCase()}'s origin…`}
              />
            </div>
          ))}
        </div>
      )}

      {/* DNA Test Panel */}
      {mode === 'dna' && (
        <div className="p-4 flex flex-col gap-4 border-b border-sidebar-border">
          <p className="text-xs text-muted-foreground">
            Enter your ancestry percentages. Total must equal 100%.
          </p>
          {dnaTest.map((entry, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Ancestry {idx + 1}</Label>
              <NationalitySelect
                value={entry.regionId}
                onChange={(v) => {
                  const updated = [...dnaTest];
                  updated[idx] = { ...entry, regionId: v };
                  setDNATest(updated);
                }}
                placeholder="Select origin…"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={entry.percent || ''}
                  onChange={(e) => {
                    const updated = [...dnaTest];
                    updated[idx] = { ...entry, percent: Number(e.target.value) };
                    setDNATest(updated);
                  }}
                  placeholder="0"
                  className="h-8 text-sm w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}
          <div className={cn(
            'text-xs font-medium mt-1',
            isTotalValid ? 'text-sage' : dnaTotal > 100 ? 'text-destructive' : 'text-muted-foreground'
          )}>
            Total: {dnaTotal}% {isTotalValid ? '✓' : dnaTotal > 100 ? '(over 100%)' : ''}
          </div>
        </div>
      )}

      {/* Health Concerns */}
      <div className="p-4 border-b border-sidebar-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Health Concerns</h3>
        <div className="flex flex-col gap-2.5">
          {HEALTH_CONCERN_CONFIG.map(concern => (
            <label
              key={concern.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <Checkbox
                checked={healthConcerns.includes(concern.id)}
                onCheckedChange={() => toggleHealthConcern(concern.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {concern.icon} {concern.label}
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2.5">Flags matching foods in the Foods tab</p>
      </div>

      {/* Calculate Button */}
      <div className="p-4">
        <button
          onClick={handleCalculate}
          disabled={!canCalculate}
          className={cn(
            'w-full py-3 rounded-full text-sm font-medium transition-all',
            canCalculate
              ? 'bg-primary text-primary-foreground hover:opacity-90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {mode === 'family' && !familyComplete
            ? `Select all 4 grandparents (${Object.values(familyTree).filter(Boolean).length}/4)`
            : mode === 'dna' && !dnaComplete
            ? `Percentages must total 100%`
            : 'Calculate My Diet'}
        </button>
      </div>
    </div>
  );
}
