import Link from "next/link";
import { projects } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/animations/reveal";

export function Projects() {
  return (
    <Section
      id="work"
      index="04"
      title="Selected work"
      lede="Three problems worth the space to explain properly: what was broken, what I changed, and what it was worth."
    >
      <ul className="space-y-5">
        {projects.map((project, index) => (
          <Reveal as="li" key={project.slug} delay={index * 0.05}>
            <article className="group border-line bg-canvas hover:border-line-strong hover:bg-raised relative overflow-hidden rounded-2xl border transition-colors duration-300">
              <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-12">
                <div>
                  <div className="text-faint flex items-center gap-3 font-mono text-[0.6875rem]">
                    <span className="tabular-nums">{project.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.role}</span>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                    {/* Stretched link: the whole card is the target, but only one
                        link exists in the accessibility tree. */}
                    <Link
                      href={`/work/${project.slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <p className="text-accent mt-1.5 text-[0.9375rem]">
                    {project.tagline}
                  </p>

                  <dl className="mt-6 space-y-4 text-[0.9375rem] leading-relaxed">
                    <div>
                      <dt className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                        Problem
                      </dt>
                      <dd className="text-muted mt-1.5">{project.problem}</dd>
                    </div>
                    <div>
                      <dt className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                        Solution
                      </dt>
                      <dd className="text-muted mt-1.5">{project.solution}</dd>
                    </div>
                  </dl>

                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <li key={tech}>
                        <Badge>{tech}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:border-line lg:border-l lg:pl-10">
                  <p className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                    Impact
                  </p>
                  <dl className="mt-4 space-y-5">
                    {project.impact.map((metric) => (
                      <div key={metric.label}>
                        <dt className="sr-only">{metric.label}</dt>
                        <dd>
                          <span className="block font-mono text-2xl tracking-tight tabular-nums">
                            {metric.value}
                          </span>
                          <span className="text-subtle mt-1 block text-sm">
                            {metric.label}
                          </span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <p className="text-text mt-8 inline-flex items-center gap-1.5 text-sm font-medium">
                    Read the case study
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
