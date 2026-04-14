'use client';

import { Lock, Check } from 'lucide-react';
import { UNLOCK_PRICE } from '@/lib/unlock';

interface PaywallOverlayProps {
  title: string;
  description: string;
  included: string[];
  onOpenUnlock: () => void;
}

export function PaywallOverlay({ title, description, included, onOpenUnlock }: PaywallOverlayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-5">
      {/* Lock icon */}
      <div className="w-14 h-14 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center">
        <Lock size={22} className="text-sage" />
      </div>

      {/* Heading */}
      <div className="space-y-1.5">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      </div>

      {/* Feature list card */}
      <div className="p-5 rounded-2xl bg-card border border-border w-full max-w-sm text-left space-y-2">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Unlock to access
        </p>
        {included.map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-sage/15 flex items-center justify-center shrink-0">
              <Check size={10} className="text-sage" />
            </div>
            <span className="text-sm text-foreground">{item}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onOpenUnlock}
        className="px-8 py-3 rounded-full bg-sage text-[#13110e] font-semibold text-sm hover:bg-sage/90 transition-colors"
      >
        Unlock Full Report — {UNLOCK_PRICE}
      </button>
      <p className="text-[11px] text-muted-foreground -mt-2">One-time payment · Access forever</p>
    </div>
  );
}
