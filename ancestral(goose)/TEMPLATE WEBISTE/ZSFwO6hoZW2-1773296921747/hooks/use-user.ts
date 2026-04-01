'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getUser,
  saveUser,
  saveUserFamilyTree,
  saveUserDNATest,
  saveUserDiet,
  clearUserData,
  toggleBookmarkedRecipe,
  saveHealthConcerns,
  setUserAncestryMode
} from '@/lib/user';
import type { User, SavedDiet, DNATestEntry } from '@/lib/types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Only run in browser
    setUser(getUser());
  }, []);

  const updateUser = useCallback((updater: (u: User) => User) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = updater({ ...prev });
      saveUser(updated);
      return updated;
    });
  }, []);

  const setMode = useCallback((mode: 'family' | 'dna') => {
    setUserAncestryMode(mode);
    setUser(prev => prev ? { ...prev, ancestry: { ...prev.ancestry, mode } } : prev);
  }, []);

  const saveFamilyTree = useCallback((selections: { mgm: string | null; mgf: string | null; pgm: string | null; pgf: string | null }) => {
    saveUserFamilyTree(selections);
    setUser(getUser());
  }, []);

  const saveDNATest = useCallback((selections: DNATestEntry[]) => {
    saveUserDNATest(selections);
    setUser(getUser());
  }, []);

  const saveDiet = useCallback((data: SavedDiet['data'], mode: 'family' | 'dna') => {
    saveUserDiet(data, mode);
    setUser(getUser());
  }, []);

  const clearAll = useCallback(() => {
    const fresh = clearUserData();
    setUser(fresh);
  }, []);

  const toggleBookmark = useCallback((recipeId: string) => {
    const isNowBookmarked = toggleBookmarkedRecipe(recipeId);
    setUser(getUser());
    return isNowBookmarked;
  }, []);

  const updateHealthConcerns = useCallback((concerns: string[]) => {
    saveHealthConcerns(concerns);
    setUser(getUser());
  }, []);

  return {
    user,
    setMode,
    saveFamilyTree,
    saveDNATest,
    saveDiet,
    clearAll,
    toggleBookmark,
    updateHealthConcerns,
    updateUser
  };
}
