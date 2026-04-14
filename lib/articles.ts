import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMeta {
  title: string;
  slug: string;
  gene: string;
  traitKey: string;
  summary: string;
  tags: string[];
  readingTime: number;
  publishedAt: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));

  return files
    .map(filename => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return data as ArticleMeta;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  const filepath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);

  return { ...(data as ArticleMeta), content };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}
