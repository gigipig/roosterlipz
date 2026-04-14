import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { ArticleCard } from '@/components/articles/article-card';
import { ArticleHeader } from '@/components/articles/article-header';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Deep Dive Articles — Ancestral Diet Explorer',
  description: 'Explore the science behind your genetic traits and ancestral diet.',
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <>
      <ArticleHeader />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="mx-auto max-w-4xl px-6">

          {/* Page header */}
          <div className="mb-12">
            <p className="text-sm text-muted-foreground mb-3 tracking-wide uppercase">Deep Dive</p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
              The Science Behind<br />Your Ancestry
            </h1>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              Peer into the genetics and evolutionary history that shaped how your
              ancestors ate — and what that means for you today.
            </p>
          </div>

          {/* Article grid */}
          {articles.length === 0 ? (
            <p className="text-muted-foreground">No articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {articles.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-border">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
