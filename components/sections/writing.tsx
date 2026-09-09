import Link from "next/link";
import { getArticleMeta } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";

/** Server Component: articles are read from disk at build time. */
export async function Writing() {
  const articles = await getArticleMeta();

  return (
    <Section
      id="writing"
      index="06"
      title="Writing"
      lede="Notes on the decisions that were hard to make and harder to reverse."
    >
      <ul className="border-line border-t">
        {articles.map((article, index) => (
          <Reveal as="li" key={article.slug} delay={index * 0.04}>
            <article className="group border-line relative border-b">
              <Link
                href={`/writing/${article.slug}`}
                className="grid gap-2 py-7 transition-opacity sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-8"
              >
                <p className="text-faint font-mono text-[0.6875rem] tabular-nums">
                  <time dateTime={article.date}>{formatDate(article.date)}</time>
                </p>
                <div>
                  <h3 className="group-hover:text-accent text-lg font-semibold tracking-tight transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted mt-2 max-w-2xl text-[0.9375rem] leading-relaxed">
                    {article.description}
                  </p>
                  <p className="text-faint mt-3 font-mono text-[0.6875rem]">
                    {article.readingTime} min read
                    <span aria-hidden="true"> · </span>
                    {article.tags.join(", ")}
                  </p>
                </div>
              </Link>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-8">
        <Link
          href="/writing"
          className="text-text decoration-line-strong hover:decoration-accent inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 transition-colors"
        >
          All articles
          <span aria-hidden="true">→</span>
        </Link>
      </Reveal>
    </Section>
  );
}
