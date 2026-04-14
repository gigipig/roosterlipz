import Link from "next/link"

const steps = [
  {
    number: "01",
    title: "Select Your Grandparents' Ancestries",
    description:
      "Choose from 220+ nationalities across 60+ ancestral regions for each of your four grandparents. Or use DNA test mode with percentage breakdowns.",
  },
  {
    number: "02",
    title: "We Run the Mendelian Math",
    description:
      "Grandparent alleles are combined using Hardy-Weinberg equilibrium and Mendelian inheritance to predict your likely genotype across 34+ traits — from lactase persistence to omega-3 conversion.",
  },
  {
    number: "03",
    title: "Your Personalized Diet Emerges",
    description:
      "See your blended macro profile, tiered food recommendations, genetic strengths and watchpoints, ancestral recipes scored for your genetics, and a full PDF report.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-sm uppercase tracking-widest text-terracotta mb-4 block">Process</span>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground text-balance">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 md:p-10 rounded-2xl bg-card border border-border"
            >
              <div className="font-serif text-5xl text-sage/30 mb-6">{step.number}</div>
              <h3 className="font-serif text-xl text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/app"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full text-base hover:opacity-90 transition-all duration-300"
          >
            Try it free — no account needed
          </Link>
        </div>
      </div>
    </section>
  )
}
