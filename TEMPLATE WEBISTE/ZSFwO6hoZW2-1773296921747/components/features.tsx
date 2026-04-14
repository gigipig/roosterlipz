import { Dna, Utensils, BarChart3, BookOpen, Lock, ChefHat } from "lucide-react"

const features = [
  {
    icon: Dna,
    title: "34+ Genetic Traits",
    description: "Mendelian inheritance calculations across lactase, AMY1 starch digestion, FADS omega-3 metabolism, vitamin D, caffeine, alcohol, and 28+ more traits.",
  },
  {
    icon: Utensils,
    title: "Personalized Food Tiers",
    description: "Foods ranked as Signature, Enjoy, Minimize, or Avoid — based on both genetic compatibility and ancestral tradition.",
  },
  {
    icon: BarChart3,
    title: "Macro Profile",
    description: "Your blended carbohydrate, protein, and fat ratios — weighted by ancestry percentage — to match what your population ate for millennia.",
  },
  {
    icon: BookOpen,
    title: "Research-Backed",
    description: "Population genetics data from published literature. Every trait links to the gene, variant, and scientific rationale behind the prediction.",
  },
  {
    icon: Lock,
    title: "Fully Private",
    description: "All data stays on your device. No account required, no data sent to servers. Your ancestry is yours alone.",
  },
  {
    icon: ChefHat,
    title: "Ancestral Recipes",
    description: "Hundreds of authentic recipes matched to your ancestry — scored for genetic compatibility and bookmarkable for later.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-sm uppercase tracking-widest text-terracotta mb-4 block">Features</span>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground text-balance">
            Science meets tradition
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-sage/30 transition-colors duration-500"
            >
              <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center mb-6 group-hover:bg-sage/20 transition-colors duration-500">
                <feature.icon size={24} className="text-sage" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
