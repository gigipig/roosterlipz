'use client';

import React, { createContext, useContext } from 'react';
import { useData } from '@/hooks/use-data';

interface DataContextType {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({ isReady: false, isLoading: true, error: null });

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isReady, error } = useData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading ancestral data…</p>
        <p className="text-xs text-muted-foreground">Fetching genetics database (~1.4 MB)</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <p className="text-destructive font-medium mb-2">Failed to load data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ isReady, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  return useContext(DataContext);
}
