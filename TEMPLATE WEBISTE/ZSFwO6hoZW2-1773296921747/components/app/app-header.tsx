'use client';

import { useState } from 'react';
import { Menu, Info } from 'lucide-react';
import Link from 'next/link';
import { useAppState } from '@/components/providers/app-state-provider';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AppSidebar } from './app-sidebar';

export function AppHeader() {
  const { setSidebarCollapsed } = useAppState();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[70px] bg-background/90 backdrop-blur-sm border-b border-border flex items-center px-4 gap-4">
      {/* Mobile sidebar trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden p-2 text-muted-foreground hover:text-foreground" aria-label="Open sidebar">
            <Menu size={20} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80 bg-sidebar">
          <SheetTitle className="sr-only">Your Ancestry Settings</SheetTitle>
          <AppSidebar onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <Link href="/" className="font-serif text-xl tracking-tight text-foreground">
        Ancestral
      </Link>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Link
          href="/articles"
          className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Articles
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border rounded-full px-3 py-1">
          <Info size={12} className="text-sage" />
          <span>Educational use only — not medical advice</span>
        </div>
      </div>
    </header>
  );
}
