'use client';

import { useState } from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { UNLOCK_PRICE } from '@/lib/unlock';

const INCLUDED_FEATURES = [
  'Full 34+ trait genetic profile',
  'Daily Guidelines & meal timing',
  'Complete Foods section with tiers',
  'Full Origins history — environment, diet & genetic legacy',
  'PDF report export',
  'Recipe scoring & bookmarks',
  'Nutrient Gap Analysis',
];

interface UnlockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlocked: () => void;
}

export function UnlockModal({ open, onOpenChange, onUnlocked }: UnlockModalProps) {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Dynamic import to avoid SSR issues with localStorage
    import('@/lib/unlock').then(({ redeemCode }) => {
      const success = redeemCode(code);
      if (success) {
        onUnlocked();
        onOpenChange(false);
        setCode('');
        setCodeError('');
      } else {
        setCodeError('Invalid code. Check your email or purchase to receive one.');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-card border-border gap-0">
        <DialogTitle className="sr-only">Unlock Full Report</DialogTitle>

        {/* Header */}
        <div className="relative p-7 border-b border-border bg-gradient-to-br from-sage/10 via-transparent to-amber/5">
          <div className="flex items-start gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-full bg-sage/15 border border-sage/20 flex items-center justify-center shrink-0 mt-0.5">
              <Lock size={18} className="text-sage" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-foreground leading-tight">Unlock your full report</h2>
              <p className="text-sm text-muted-foreground mt-0.5">One-time payment — access forever</p>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-5xl tracking-tight text-foreground">{UNLOCK_PRICE}</span>
            <span className="text-muted-foreground text-sm">one-time</span>
          </div>
        </div>

        {/* Feature list */}
        <div className="px-7 py-5 space-y-2.5 border-b border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Everything included</p>
          {INCLUDED_FEATURES.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-sage/15 flex items-center justify-center shrink-0">
                <Check size={10} className="text-sage" />
              </div>
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="px-7 py-5 space-y-3">
          {/* Stripe button — placeholder until Phase 0.3 */}
          <button
            disabled
            className="w-full py-3.5 rounded-full bg-sage text-[#13110e] font-semibold text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            title="Stripe payment is coming soon"
          >
            <Sparkles size={15} />
            Unlock with Stripe — {UNLOCK_PRICE}
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Secure payment via Stripe · Payments launching soon
          </p>

          {/* Unlock code input */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 text-center">Already have an unlock code?</p>
            <form onSubmit={handleCodeSubmit} className="flex gap-2">
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value); setCodeError(''); }}
                placeholder="Enter code…"
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-sage/40 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs rounded-lg bg-muted border border-border text-foreground hover:border-sage/40 transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </form>
            {codeError && (
              <p className="text-[11px] text-red-400 mt-1.5">{codeError}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
