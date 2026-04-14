import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getAllSlugs, getArticleBySlug } from '@/lib/articles';
import { ArticleHeader } from '@/components/articles/article-header';
import { Footer } from '@/components/footer';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Ancestral Diet Explorer`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <ArticleHeader />
      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="mx-auto max-w-2xl px-6">

          {/* Back link */}
          <Link
            href="/articles"
            className="inline-block mb-10 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← All articles
          </Link>

          {/* Article header */}
          <div className="mb-10">
            <span className="inline-block mb-4 px-3 py-1 text-xs font-mono rounded-full bg-muted text-muted-foreground">
              {article.gene}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {article.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pb-8 border-b border-border">
              <span>{article.readingTime} min read</span>
              <span>·</span>
              <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>·</span>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Article body */}
          <div className="prose prose-neutral max-w-none
            prose-headings:font-serif prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-sage prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-blockquote:border-l-2 prose-blockquote:border-sage prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
            prose-ul:text-foreground/80 prose-li:mb-1
            prose-hr:border-border
          ">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">See your personal result</p>
              <p className="text-xs text-muted-foreground">Your {article.gene} prediction is calculated from your ancestry in the app.</p>
            </div>
            <Link
              href="/app"
              className="shrink-0 px-5 py-2.5 bg-primary text-primary-foreground text-sm rounded-full hover:opacity-90 transition-opacity"
            >
              Open the app →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
