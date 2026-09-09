import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, projects } from "@/data/projects";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PageTransition } from "@/components/animations/page-transition";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };

  return pageMetadata({
    title: `${project.name} — case study`,
    description: `${project.tagline}. ${project.problem}`.slice(0, 180),
    path: `/work/${project.slug}`,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <PageTransition>
      <Container className="py-28 sm:py-36">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbSchema([
                { name: "Home", path: "/" },
                { name: "Work", path: "/#work" },
                { name: project.name, path: `/work/${project.slug}` },
              ]),
            ),
          }}
        />

        <Link
          href="/#work"
          className="text-subtle hover:text-text font-mono text-[0.6875rem] transition-colors"
        >
          ← Selected work
        </Link>

        <article className="mt-8">
          <header>
            <p className="text-faint font-mono text-[0.6875rem]">
              <span className="tabular-nums">{project.year}</span>
              <span aria-hidden="true"> · </span>
              {project.role}
            </p>
            <h1 className="mt-4 max-w-3xl text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.03em]">
              {project.name}
            </h1>
            <p className="text-accent mt-5 max-w-2xl text-lg leading-relaxed">
              {project.tagline}
            </p>

            <dl className="border-line mt-12 grid gap-8 border-y py-8 sm:grid-cols-3">
              {project.impact.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-subtle text-sm">{metric.label}</dt>
                  <dd className="mt-1.5 font-mono text-2xl tracking-tight tabular-nums">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-20">
            <div className="max-w-[36rem]">
              <section aria-labelledby="problem-heading">
                <h2
                  id="problem-heading"
                  className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase"
                >
                  The problem
                </h2>
                <p className="text-muted mt-4 text-[1.0625rem] leading-[1.75]">
                  {project.problem}
                </p>
              </section>

              <section aria-labelledby="solution-heading" className="mt-14">
                <h2
                  id="solution-heading"
                  className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase"
                >
                  The approach
                </h2>
                <p className="text-muted mt-4 text-[1.0625rem] leading-[1.75]">
                  {project.solution}
                </p>
              </section>

              <section aria-labelledby="architecture-heading" className="mt-14">
                <h2
                  id="architecture-heading"
                  className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase"
                >
                  Architecture
                </h2>
                <ol className="mt-5 space-y-4">
                  {project.architecture.map((step, index) => (
                    <li
                      key={step}
                      className="text-muted relative pl-9 text-[1.0625rem] leading-[1.75]"
                    >
                      <span
                        aria-hidden="true"
                        className="border-line text-faint absolute top-[0.35em] left-0 grid size-5 place-items-center rounded-full border font-mono text-[0.625rem] tabular-nums"
                      >
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>

              {project.caseStudy.map((chapter) => (
                <section key={chapter.heading} className="mt-14">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {chapter.heading}
                  </h2>
                  <p className="text-muted mt-4 text-[1.0625rem] leading-[1.75]">
                    {chapter.body}
                  </p>
                </section>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                Stack
              </h2>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <li key={tech}>
                    <Badge>{tech}</Badge>
                  </li>
                ))}
              </ul>

              {project.links.repo || project.links.demo ? (
                <div className="mt-8 flex flex-col gap-2.5">
                  {project.links.demo ? (
                    <ButtonLink
                      href={project.links.demo}
                      external
                      size="sm"
                      variant="secondary"
                    >
                      Live demo ↗
                    </ButtonLink>
                  ) : null}
                  {project.links.repo ? (
                    <ButtonLink
                      href={project.links.repo}
                      external
                      size="sm"
                      variant="secondary"
                    >
                      Source ↗
                    </ButtonLink>
                  ) : null}
                </div>
              ) : null}
            </aside>
          </div>
        </article>
      </Container>
    </PageTransition>
  );
}
