'use client';

import { useAppState } from '@/components/providers/app-state-provider';

export function CalculatingOverlay() {
  const { isCalculating } = useAppState();
  if (!isCalculating) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-foreground font-medium">Calculating your ancestral diet…</p>
      <p className="text-sm text-muted-foreground">Running Mendelian inheritance analysis</p>
    </div>
  );
}
