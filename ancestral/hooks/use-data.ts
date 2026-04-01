'use client';

import { useState, useEffect } from 'react';
import { loadData, getGeoById, getDietById, getGeneticsById, getAncientRootsById } from '@/lib/data';

interface DataState {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
}

// Singleton promise so loadData() only fires once across components
let dataLoadPromise: Promise<void> | null = null;
let dataReady = false;

export function useData(): DataState {
  const [state, setState] = useState<DataState>({
    isLoading: !dataReady,
    isReady: dataReady,
    error: null
  });

  useEffect(() => {
    if (dataReady) {
      setState({ isLoading: false, isReady: true, error: null });
      return;
    }

    if (!dataLoadPromise) {
      dataLoadPromise = loadData();
    }

    dataLoadPromise
      .then(() => {
        dataReady = true;
        setState({ isLoading: false, isReady: true, error: null });
      })
      .catch((err: Error) => {
        setState({ isLoading: false, isReady: false, error: err.message });
      });
  }, []);

  return state;
}

// Expose data accessors for convenience
export { getGeoById, getDietById, getGeneticsById, getAncientRootsById };
