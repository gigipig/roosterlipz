"use client"

import Link from 'next/link';

export function ArticleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-tight text-foreground">
          Ancestral
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/articles"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            All articles
          </Link>
          <Link
            href="/app"
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-full hover:opacity-90 transition-opacity duration-200"
          >
            Open app →
          </Link>
        </div>
      </nav>
    </header>
  );
}
