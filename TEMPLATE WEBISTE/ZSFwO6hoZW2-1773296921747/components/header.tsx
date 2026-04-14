"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <nav className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-tight text-foreground">
            Ancestral
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              FAQ
            </a>
            <Link
              href="/articles"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Articles
            </Link>
          </div>

          <button
            onClick={() => setWizardOpen(true)}
            className="hidden md:inline-flex px-5 py-2.5 bg-primary text-primary-foreground text-sm rounded-full hover:opacity-90 transition-opacity duration-300"
          >
            Get Started
          </button>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-foreground" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border">
            <div className="flex flex-col px-6 py-6 gap-4">
              <a
                href="#how-it-works"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#faq"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
              <Link
                href="/articles"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Articles
              </Link>
              <button
                onClick={() => { setIsOpen(false); setWizardOpen(true); }}
                className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm rounded-full text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {wizardOpen && (
        <OnboardingWizard onClose={() => setWizardOpen(false)} />
      )}
    </>
  )
}
