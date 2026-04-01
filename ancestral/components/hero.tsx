"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export function Hero() {
  const [wizardOpen, setWizardOpen] = useState(false)

  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage/10 text-sage mb-8">
            <span className="w-2 h-2 rounded-full bg-sage" />
            <span className="text-sm">Population Genetics + Ancestral Nutrition</span>
          </div>

          {/* Main heading */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-foreground leading-[1.1] text-balance mb-8">
            Unlock Your
            <br />
            <span className="italic">Ancestral Diet</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
            Select your grandparents' ancestries and discover the diet your genes were built for — powered by Mendelian inheritance and real population genetics data.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setWizardOpen(true)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base hover:opacity-90 transition-all duration-300"
            >
              Discover Your Diet
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              See how it works
            </a>
          </div>

          {/* Trust stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground border border-border rounded-2xl px-8 py-4 bg-card/50">
            <div className="flex items-center gap-2">
              <span className="text-sage font-semibold text-base">34+</span>
              <span>genetic traits analyzed</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-sage font-semibold text-base">60+</span>
              <span>ancestral regions</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-sage font-semibold text-base">220+</span>
              <span>nationalities</span>
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-sage font-semibold text-base">100%</span>
              <span>private — no account needed</span>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-border" />
        </div>
      </section>

      {/* Wizard overlay */}
      {wizardOpen && (
        <OnboardingWizard onClose={() => setWizardOpen(false)} />
      )}
    </>
  )
}
