import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Article, ArticleMeta } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "writing");
const WORDS_PER_MINUTE = 220;

interface Frontmatter {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  tags?: unknown;
}

function assertString(value: unknown, field: string, slug: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Article "${slug}" is missing required frontmatter: ${field}`);
  }
  return value;
}

async function parseArticle(fileName: string): Promise<Article> {
  const slug = fileName.replace(/\.mdx$/, "");
  const raw = await readFile(path.join(CONTENT_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  return {
    slug,
    title: assertString(fm.title, "title", slug),
    description: assertString(fm.description, "description", slug),
    date: assertString(fm.date, "date", slug),
    tags: Array.isArray(fm.tags)
      ? fm.tags.filter((t): t is string => typeof t === "string")
      : [],
    readingTime: Math.max(
      1,
      Math.round(content.split(/\s+/).length / WORDS_PER_MINUTE),
    ),
    content,
  };
}

/** All articles, newest first. Runs at build time only. */
export async function getArticles(): Promise<readonly Article[]> {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".mdx"));
  const articles = await Promise.all(files.map(parseArticle));
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticleMeta(): Promise<readonly ArticleMeta[]> {
  return getArticles();
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}
