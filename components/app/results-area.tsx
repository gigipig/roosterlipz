'use client';

import { Lock } from 'lucide-react';
import { useAppState } from '@/components/providers/app-state-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './tabs/overview-tab';
import { GeneticsTab } from './tabs/genetics-tab';
import { DietTab } from './tabs/diet-tab';
import { FoodsTab } from './tabs/foods-tab';
import { OriginsTab } from './tabs/origins-tab';
import { UnlockModal } from './unlock-modal';
import { TabErrorBoundary } from './tab-error-boundary';
import { exportResultsAsPDF } from '@/lib/pdf-export';
import { getUser } from '@/lib/user';
import { toast } from 'sonner';
import type { ActiveTab } from '@/components/providers/app-state-provider';

export function ResultsArea() {
  const { hasResults, blended, genetics, mode, activeTab, setActiveTab, isUnlocked, unlockApp, isUnlockModalOpen, openUnlockModal, closeUnlockModal } = useAppState();

  async function handleExportPDF() {
    if (!isUnlocked) {
      openUnlockModal();
      return;
    }
    if (!blended) return;
    const user = getUser();
    const savedDiet = {
      calculatedAt: new Date().toISOString(),
      mode,
      data: { blended, mendelianGenetics: genetics ?? undefined }
    };
    try {
      await exportResultsAsPDF(savedDiet, user.username);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to export PDF.');
    }
  }


  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-6 gap-6">
        <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center">
          <span className="text-3xl">🧬</span>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-foreground mb-2">Your ancestral diet awaits</h2>
          <p className="text-muted-foreground max-w-sm text-sm">
            Select your grandparents' ancestries in the sidebar and click Calculate to unlock your personalized results.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
          <span className="px-3 py-1.5 bg-card border border-border rounded-full">34+ genetic traits</span>
          <span className="px-3 py-1.5 bg-card border border-border rounded-full">Macro profile</span>
          <span className="px-3 py-1.5 bg-card border border-border rounded-full">Ancestral recipes</span>
          <span className="px-3 py-1.5 bg-card border border-border rounded-full">PDF export</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl text-foreground">Your Results</h2>
            {!isUnlocked && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber flex items-center gap-1.5">
                <Lock size={10} />
                Free preview
              </span>
            )}
          </div>

          <button
            onClick={handleExportPDF}
            className={`flex items-center gap-2 px-4 py-2 text-sm border rounded-full transition-colors ${
              isUnlocked
                ? 'bg-card border-border hover:border-sage/40'
                : 'bg-card border-border text-muted-foreground hover:border-amber/40 cursor-pointer'
            }`}
          >
            {!isUnlocked && <Lock size={13} className="text-amber" />}
            {isUnlocked ? '↓ Save as PDF' : 'Save as PDF'}
          </button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            const tab = v as ActiveTab;
            if (!isUnlocked && (tab === 'diet' || tab === 'foods')) {
              openUnlockModal();
            } else {
              setActiveTab(tab);
            }
          }}
        >

          <TabsList className="bg-card border border-border rounded-full p-1 h-auto flex flex-wrap gap-1">
            {/* Overview — always free */}
            <TabsTrigger
              value="overview"
              className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>

            {/* Genetics — free preview (3 traits) */}
            {mode === 'family' && (
              <TabsTrigger
                value="genetics"
                className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1.5"
              >
                Genetics
                {!isUnlocked && <Lock size={11} className="text-amber opacity-70" />}
              </TabsTrigger>
            )}

            {/* Origins — free preview (peoples + era) */}
            <TabsTrigger
              value="origins"
              className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1.5"
            >
              Origins
              {!isUnlocked && <Lock size={11} className="text-amber opacity-70" />}
            </TabsTrigger>

            {/* Diet — fully locked */}
            <TabsTrigger
              value="diet"
              className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1.5"
            >
              Diet
              {!isUnlocked && <Lock size={11} className="text-amber opacity-70" />}
            </TabsTrigger>

            {/* Foods — fully locked */}
            <TabsTrigger
              value="foods"
              className="rounded-full px-4 py-1.5 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1.5"
            >
              Foods & Recipes
              {!isUnlocked && <Lock size={11} className="text-amber opacity-70" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <TabErrorBoundary tabName="Overview">
              <OverviewTab />
            </TabErrorBoundary>
          </TabsContent>

          {mode === 'family' && (
            <TabsContent value="genetics" className="mt-6">
              <TabErrorBoundary tabName="Genetics">
                <GeneticsTab />
              </TabErrorBoundary>
            </TabsContent>
          )}

          <TabsContent value="origins" className="mt-6">
            <TabErrorBoundary tabName="Origins">
              <OriginsTab />
            </TabErrorBoundary>
          </TabsContent>

          <TabsContent value="diet" className="mt-6">
            <TabErrorBoundary tabName="Diet">
              <DietTab />
            </TabErrorBoundary>
          </TabsContent>

          <TabsContent value="foods" className="mt-6">
            <TabErrorBoundary tabName="Foods & Recipes">
              <FoodsTab />
            </TabErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>

      <UnlockModal
        open={isUnlockModalOpen}
        onOpenChange={(open) => open ? openUnlockModal() : closeUnlockModal()}
        onUnlocked={unlockApp}
      />
    </>
  );
}
