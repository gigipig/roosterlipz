import Link from 'next/link';
import type { ArticleMeta } from '@/lib/articles';

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block bg-card border border-border rounded-2xl p-6 hover:border-foreground/20 transition-colors duration-200"
    >
      {/* Gene badge */}
      <span className="inline-block mb-3 px-2.5 py-1 text-xs font-mono rounded-full bg-muted text-muted-foreground">
        {article.gene}
      </span>

      <h2 className="font-serif text-xl text-foreground mb-2 group-hover:text-sage transition-colors duration-200 leading-snug">
        {article.title}
      </h2>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
        {article.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {article.tags.slice(0, 4).map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{article.readingTime} min read</span>
        <span className="group-hover:text-foreground transition-colors duration-200">Read article →</span>
      </div>
    </Link>
  );
}
