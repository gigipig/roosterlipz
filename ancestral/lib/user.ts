/**
 * User module - localStorage-based user profile management
 * TypeScript port of js/user.js (pure data functions only — no DOM)
 */

import type { User, UserAncestry, SavedDiet, DNATestEntry } from './types';

const USER_STORAGE_KEY = 'ancestralDietUser';

const adjectives = [
  'swift', 'bright', 'calm', 'bold', 'wild', 'free', 'wise', 'pure',
  'vast', 'keen', 'quiet', 'deep', 'warm', 'cool', 'strong', 'gentle',
  'lucky', 'brave', 'noble', 'true', 'clear', 'fierce', 'kind', 'sage',
  'lunar', 'solar', 'misty', 'crisp', 'vivid', 'serene', 'bliss', 'stony',
  'amber', 'jade', 'ivory', 'azure', 'golden', 'silver', 'copper', 'iron'
];

const nouns = [
  'mountain', 'river', 'forest', 'ocean', 'valley', 'meadow', 'stone', 'wind',
  'flame', 'wave', 'cloud', 'star', 'moon', 'sun', 'tree', 'leaf',
  'fox', 'wolf', 'bear', 'hawk', 'eagle', 'owl', 'deer', 'whale',
  'tiger', 'lion', 'dragon', 'phoenix', 'raven', 'sparrow', 'rune', 'sage',
  'peak', 'crest', 'ridge', 'shore', 'creek', 'brook', 'path', 'trail'
];

function generateRandomUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${adjective}-${noun}-${number}`;
}

function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function createDefaultUser(): User {
  return {
    id: generateUserId(),
    username: generateRandomUsername(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ancestry: {
      mode: 'family',
      familyTree: {
        maternalGrandmother: null,
        maternalGrandfather: null,
        paternalGrandmother: null,
        paternalGrandfather: null
      },
      dnaTest: [
        { regionId: null, percent: 0 },
        { regionId: null, percent: 0 },
        { regionId: null, percent: 0 },
        { regionId: null, percent: 0 }
      ]
    },
    savedDiet: null,
    bookmarkedRecipes: [],
    healthConcerns: []
  };
}

// ============================================================================
// SSR-safe localStorage helpers
// ============================================================================

function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

export function getUser(): User {
  if (!canUseStorage()) return createDefaultUser();
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as User;
  } catch (e) {
    console.warn('Failed to load user from localStorage:', e);
  }
  const newUser = createDefaultUser();
  saveUser(newUser);
  return newUser;
}

export function saveUser(user: User): void {
  if (!canUseStorage()) return;
  try {
    user.updatedAt = new Date().toISOString();
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save user to localStorage:', e);
  }
}

export function setUserAncestryMode(mode: 'family' | 'dna'): void {
  const user = getUser();
  user.ancestry.mode = mode;
  saveUser(user);
}

export function saveUserFamilyTree(selections: { mgm: string | null; mgf: string | null; pgm: string | null; pgf: string | null }): void {
  const user = getUser();
  user.ancestry.familyTree = {
    maternalGrandmother: selections.mgm || null,
    maternalGrandfather: selections.mgf || null,
    paternalGrandmother: selections.pgm || null,
    paternalGrandfather: selections.pgf || null
  };
  saveUser(user);
}

export function saveUserDNATest(selections: DNATestEntry[]): void {
  const user = getUser();
  user.ancestry.dnaTest = selections.map(s => ({
    regionId: s.regionId || null,
    percent: s.percent || 0
  }));
  saveUser(user);
}

export function saveUserDiet(dietData: SavedDiet['data'], mode: 'family' | 'dna'): void {
  const user = getUser();
  user.savedDiet = {
    calculatedAt: new Date().toISOString(),
    mode,
    data: dietData
  };
  saveUser(user);
}

export function getUserAncestry(): UserAncestry {
  return getUser().ancestry;
}

export function getUserSavedDiet(): SavedDiet | null {
  return getUser().savedDiet;
}

export function clearUserDiet(): void {
  const user = getUser();
  user.savedDiet = null;
  saveUser(user);
}

export function clearUserData(): User {
  const newUser = createDefaultUser();
  saveUser(newUser);
  return newUser;
}

export function userHasSavedData(): boolean {
  const user = getUser();
  const ft = user.ancestry.familyTree;
  const hasFamilyData = !!(ft.maternalGrandmother || ft.maternalGrandfather ||
                           ft.paternalGrandmother || ft.paternalGrandfather);
  const hasDNAData = user.ancestry.dnaTest.some(s => s.regionId && s.percent > 0);
  return hasFamilyData || hasDNAData;
}

export function toggleBookmarkedRecipe(recipeId: string): boolean {
  const user = getUser();
  const idx = user.bookmarkedRecipes.indexOf(recipeId);
  if (idx === -1) {
    user.bookmarkedRecipes.push(recipeId);
  } else {
    user.bookmarkedRecipes.splice(idx, 1);
  }
  saveUser(user);
  return idx === -1; // true = now bookmarked
}

export function getUserBookmarkedRecipes(): string[] {
  return getUser().bookmarkedRecipes;
}

export function saveHealthConcerns(concerns: string[]): void {
  const user = getUser();
  user.healthConcerns = concerns;
  saveUser(user);
}

export function getUserHealthConcerns(): string[] {
  return getUser().healthConcerns;
}
