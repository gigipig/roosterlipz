import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is this actually based on real genetics?",
    answer:
      "Yes. We use published population allele frequencies and Hardy-Weinberg equilibrium to compute Mendelian inheritance predictions across 34+ genes. Traits like lactase persistence (LCT), starch digestion (AMY1 copy number), and omega-3 conversion (FADS1/2) have strong population-genetics evidence. All predictions are probabilistic — not diagnostic.",
  },
  {
    question: "How is this different from 23andMe or AncestryDNA?",
    answer:
      "Those services sequence your actual DNA. We estimate probabilities from your known ancestry without any biological sample. Think of it as a well-informed prior based on where your family is from, rather than a confirmed genotype. It's less precise but free, instant, and private.",
  },
  {
    question: "What's the difference between Family Tree mode and DNA Test mode?",
    answer:
      "Family Tree mode takes 4 grandparent ancestries and runs full Mendelian inheritance calculations — showing trait probabilities inherited through two generations. DNA Test mode takes percentage breakdowns (like from 23andMe reports) and produces a simpler weighted blend without the genetics layer.",
  },
  {
    question: "Is my data private? Do you store anything?",
    answer:
      "Completely private. All data is stored in your browser's localStorage only — nothing is sent to any server. There is no account, no login, and no tracking. Clearing your browser data resets the app.",
  },
  {
    question: "Why do some foods show as 'Minimize' or 'Avoid'?",
    answer:
      "Foods are tiered based on a combination of genetic compatibility and ancestral tradition. A food flagged for 'Minimize' means your predicted genetic profile suggests a higher sensitivity or reduced benefit (e.g., high lactase frequency paired with dairy in a low-lactase ancestry). It's guidance, not a prohibition.",
  },
  {
    question: "Can I use this for medical decisions?",
    answer:
      "No — and we strongly advise against it. This tool is for education and exploration only. Predictions are population-level statistics, not individual diagnoses. Always consult a qualified healthcare professional before making significant dietary changes, especially if you have health conditions.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-sm uppercase tracking-widest text-terracotta mb-4 block">Questions</span>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground text-balance">
            Frequently asked
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 last:border-b"
            >
              <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
