import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticle, getArticles } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { mdxComponents } from "@/components/ui/mdx-components";
import { Badge } from "@/components/ui/badge";
import { PageTransition } from "@/components/animations/page-transition";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Every article is known at build time, so every article page is static HTML. */
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Not found" };

  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/writing/${article.slug}`,
    type: "article",
    publishedTime: article.date,
    tags: article.tags,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const path = `/writing/${article.slug}`;

  return (
    <PageTransition>
      <Container className="py-28 sm:py-36">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              articleSchema({
                title: article.title,
                description: article.description,
                path,
                date: article.date,
              }),
              breadcrumbSchema([
                { name: "Home", path: "/" },
                { name: "Writing", path: "/writing" },
                { name: article.title, path },
              ]),
            ]),
          }}
        />

        <Link
          href="/writing"
          className="text-subtle hover:text-text font-mono text-[0.6875rem] transition-colors"
        >
          ← Writing
        </Link>

        <article className="mt-8">
          <header className="max-w-[36rem]">
            <p className="text-faint font-mono text-[0.6875rem]">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span aria-hidden="true"> · </span>
              {article.readingTime} min read
            </p>
            <h1 className="mt-4 text-[clamp(1.875rem,4.5vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em]">
              {article.title}
            </h1>
            <p className="text-muted mt-5 text-lg leading-relaxed">
              {article.description}
            </p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <Badge>{tag}</Badge>
                </li>
              ))}
            </ul>
          </header>

          <hr className="border-line my-12" />

          <Prose>
            <MDXRemote source={article.content} components={mdxComponents} />
          </Prose>
        </article>
      </Container>
    </PageTransition>
  );
}
