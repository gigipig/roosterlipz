'use client';

import React, { createContext, useContext, useState, useCallback, startTransition, useEffect } from 'react';
import { isUnlocked as checkUnlocked, setUnlocked, redeemCode } from '@/lib/unlock';
import type { BlendedDiet, GeneticTrait } from '@/lib/types';

export type AppMode = 'family' | 'dna';
export type ActiveTab = 'overview' | 'genetics' | 'diet' | 'foods' | 'origins';

export interface FamilyTreeSelections {
  mgm: string | null;
  mgf: string | null;
  pgm: string | null;
  pgf: string | null;
}

export interface DNATestEntry {
  regionId: string | null;
  percent: number;
}

interface AppState {
  mode: AppMode;
  familyTree: FamilyTreeSelections;
  dnaTest: DNATestEntry[];
  blended: BlendedDiet | null;
  genetics: Record<string, GeneticTrait> | null;
  activeTab: ActiveTab;
  isCalculating: boolean;
  sidebarCollapsed: boolean;
  hasResults: boolean;
  healthConcerns: string[];
  isUnlocked: boolean;
  isUnlockModalOpen: boolean;
}

interface AppStateContextType extends AppState {
  setMode: (mode: AppMode) => void;
  setFamilyTree: (ft: FamilyTreeSelections) => void;
  setDNATest: (dna: DNATestEntry[]) => void;
  setResults: (blended: BlendedDiet | null, genetics: Record<string, GeneticTrait> | null) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setIsCalculating: (v: boolean) => void;
  setSidebarCollapsed: (v: boolean) => void;
  setHealthConcerns: (concerns: string[]) => void;
  unlockApp: () => void;
  tryUnlockCode: (code: string) => boolean;
  openUnlockModal: () => void;
  closeUnlockModal: () => void;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    mode: 'family',
    familyTree: { mgm: null, mgf: null, pgm: null, pgf: null },
    dnaTest: [
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 },
    ],
    blended: null,
    genetics: null,
    activeTab: 'overview',
    isCalculating: false,
    sidebarCollapsed: false,
    hasResults: false,
    healthConcerns: [],
    isUnlocked: false,
    isUnlockModalOpen: false,
  });

  // Hydrate unlock state from localStorage after mount
  useEffect(() => {
    if (checkUnlocked()) {
      setState(s => ({ ...s, isUnlocked: true }));
    }
  }, []);

  const setMode = useCallback((mode: AppMode) =>
    setState(s => ({ ...s, mode })), []);

  const setFamilyTree = useCallback((familyTree: FamilyTreeSelections) =>
    setState(s => ({ ...s, familyTree })), []);

  const setDNATest = useCallback((dnaTest: DNATestEntry[]) =>
    setState(s => ({ ...s, dnaTest })), []);

  const setResults = useCallback((blended: BlendedDiet | null, genetics: Record<string, GeneticTrait> | null) => {
    startTransition(() => {
      setState(s => ({ ...s, blended, genetics, hasResults: !!blended, isCalculating: false }));
    });
  }, []);

  const setActiveTab = useCallback((activeTab: ActiveTab) =>
    setState(s => ({ ...s, activeTab })), []);

  const setIsCalculating = useCallback((isCalculating: boolean) =>
    setState(s => ({ ...s, isCalculating })), []);

  const setSidebarCollapsed = useCallback((sidebarCollapsed: boolean) =>
    setState(s => ({ ...s, sidebarCollapsed })), []);

  const setHealthConcerns = useCallback((healthConcerns: string[]) =>
    setState(s => ({ ...s, healthConcerns })), []);

  const unlockApp = useCallback(() => {
    setUnlocked(true);
    setState(s => ({ ...s, isUnlocked: true }));
  }, []);

  const tryUnlockCode = useCallback((code: string): boolean => {
    const success = redeemCode(code);
    if (success) setState(s => ({ ...s, isUnlocked: true }));
    return success;
  }, []);

  const openUnlockModal = useCallback(() =>
    setState(s => ({ ...s, isUnlockModalOpen: true })), []);

  const closeUnlockModal = useCallback(() =>
    setState(s => ({ ...s, isUnlockModalOpen: false })), []);

  return (
    <AppStateContext.Provider value={{
      ...state,
      setMode,
      setFamilyTree,
      setDNATest,
      setResults,
      setActiveTab,
      setIsCalculating,
      setSidebarCollapsed,
      setHealthConcerns,
      unlockApp,
      tryUnlockCode,
      openUnlockModal,
      closeUnlockModal,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
