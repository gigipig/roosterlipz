import type React from 'react';
import { DataProvider } from '@/components/providers/data-provider';
import { AppStateProvider } from '@/components/providers/app-state-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Ancestral Diet Explorer — App',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AppStateProvider>
        {children}
        <Toaster />
      </AppStateProvider>
    </DataProvider>
  );
}
