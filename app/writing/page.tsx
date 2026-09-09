import Link from "next/link";
import type { Metadata } from "next";
import { getArticleMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { pageMetadata, breadcrumbSchema } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { PageTransition } from "@/components/animations/page-transition";

export const metadata: Metadata = pageMetadata({
  title: "Writing",
  description:
    "Essays on distributed systems, web performance and the architectural decisions that are hard to reverse.",
  path: "/writing",
});

export default async function WritingIndexPage() {
  const articles = await getArticleMeta();

  return (
    <PageTransition>
      <Container className="py-28 sm:py-36">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbSchema([
                { name: "Home", path: "/" },
                { name: "Writing", path: "/writing" },
              ]),
            ),
          }}
        />

        <Link
          href="/"
          className="text-subtle hover:text-text font-mono text-[0.6875rem] transition-colors"
        >
          ← Back
        </Link>

        <h1 className="mt-8 text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.03em]">
          Writing
        </h1>
        <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed">
          Notes on distributed systems, web performance and the decisions that were hard
          to make and harder to reverse.
        </p>

        <ul className="border-line mt-16 border-t">
          {articles.map((article) => (
            <li key={article.slug} className="border-line border-b">
              <Link
                href={`/writing/${article.slug}`}
                className="group grid gap-2 py-8 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8"
              >
                <p className="text-faint font-mono text-[0.6875rem] tabular-nums">
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                </p>
                <div>
                  <h2 className="group-hover:text-accent text-lg font-semibold tracking-tight transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-muted mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">
                    {article.description}
                  </p>
                  <p className="text-faint mt-3 font-mono text-[0.6875rem]">
                    {article.readingTime} min read
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </PageTransition>
  );
}
