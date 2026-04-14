const UNLOCK_KEY = 'ancestral_unlocked';
// Demo unlock code — replace with server-validated JWT token in Phase 0.3
const DEMO_CODES = ['ANCESTRAL2026'];

export const UNLOCK_PRICE = '£9.99';

export function isUnlocked(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(UNLOCK_KEY) === 'true';
}

export function setUnlocked(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    localStorage.setItem(UNLOCK_KEY, 'true');
  } else {
    localStorage.removeItem(UNLOCK_KEY);
  }
}

export function redeemCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  if (DEMO_CODES.includes(normalized)) {
    setUnlocked(true);
    return true;
  }
  return false;
}
