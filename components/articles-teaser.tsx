import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { ArticleCard } from '@/components/articles/article-card';

export function ArticlesTeaser() {
  const articles = getAllArticles().slice(0, 2);

  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2 tracking-wide uppercase">Deep Dive</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              The Science Behind<br />Your Ancestry
            </h2>
          </div>
          <Link
            href="/articles"
            className="shrink-0 hidden sm:inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            View all articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {articles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <Link
          href="/articles"
          className="sm:hidden inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          View all articles →
        </Link>
      </div>
    </section>
  );
}
