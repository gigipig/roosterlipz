export function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <a
            href="/"
            className="font-serif text-2xl tracking-tight text-foreground"
          >
            Ancestral
          </a>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors duration-300"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="hover:text-foreground transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#faq"
              className="hover:text-foreground transition-colors duration-300"
            >
              FAQ
            </a>
            <a
              href="/app"
              className="hover:text-foreground transition-colors duration-300"
            >
              Get Started
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2026 Ancestral. Educational use only.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          Not medical advice. Our genetic predictions are probabilistic
          estimates based on population-level statistics. Please consult a
          healthcare professional before making significant dietary changes.
        </p>

        {/* Large decorative letter */}
        <div className="mt-16 text-center">
          <span className="font-serif text-[12rem] md:text-[16rem] leading-none text-border/50 select-none">
            A
          </span>
        </div>
      </div>
    </footer>
  );
}
