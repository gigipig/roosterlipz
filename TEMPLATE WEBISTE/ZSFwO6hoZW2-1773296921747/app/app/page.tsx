'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app/app-header';
import { AppSidebar } from '@/components/app/app-sidebar';
import { ResultsArea } from '@/components/app/results-area';
import { CalculatingOverlay } from '@/components/app/calculating-overlay';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';

export default function AppPage() {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="flex pt-[70px] min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-80 shrink-0 border-r border-border bg-sidebar fixed top-[70px] bottom-0 left-0 overflow-y-auto">
          <AppSidebar onOpenWizard={() => setWizardOpen(true)} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-80 p-6 lg:p-8">
          <ResultsArea />
        </main>
      </div>

      <CalculatingOverlay />

      {wizardOpen && (
        <OnboardingWizard onClose={() => setWizardOpen(false)} />
      )}
    </div>
  );
}
