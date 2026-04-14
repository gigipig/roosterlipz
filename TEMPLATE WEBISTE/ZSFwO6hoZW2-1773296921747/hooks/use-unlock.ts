'use client';

import { useState, useEffect, useCallback } from 'react';
import { isUnlocked as checkUnlocked, setUnlocked, redeemCode } from '@/lib/unlock';

export function useUnlock() {
  const [unlocked, setUnlockedState] = useState(false);

  useEffect(() => {
    setUnlockedState(checkUnlocked());
  }, []);

  const unlock = useCallback(() => {
    setUnlocked(true);
    setUnlockedState(true);
  }, []);

  const tryCode = useCallback((code: string): boolean => {
    const success = redeemCode(code);
    if (success) setUnlockedState(true);
    return success;
  }, []);

  return { isUnlocked: unlocked, unlock, tryCode };
}
