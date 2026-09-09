import { education } from "@/data/experience";
import { site } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { Stagger, StaggerItem } from "@/components/animations/stagger";

const principles = [
  {
    title: "Constraints over conventions",
    body: "The best bug fix is a constraint that makes the bug unrepresentable. Multi-tenant isolation enforced by the schema survives every code path written after you leave; the same rule checked in a service guard survives until the first batch job that forgets it.",
  },
  {
    title: "The right tool for the delivery guarantee",
    body: "Kafka and RabbitMQ are not interchangeable. A replayable log and an acknowledged work queue solve different problems, and naming which one a feature needs settles most arguments about reliability before any code is written.",
  },
  {
    title: "Ground the model, don't trust it",
    body: "Most reported AI hallucinations are retrieval failures in disguise. Facts belong in an index you can correct today, not in weights you would have to retrain. Fine-tuning is for tone and format; retrieval is for anything that can change.",
  },
  {
    title: "Boring releases beat careful ones",
    body: "99.8% production stability came from Jest and Cypress suites gating every merge in CI, not from cautious deploys. When the pipeline is the gate, shipping stops being an event.",
  },
] as const;

export function About() {
  return (
    <Section
      id="about"
      index="01"
      title="How I think about building software"
      lede="Six years across enterprise Angular and NestJS platforms, most of it where a user-facing surface meets a system that has to stay correct for many organisations at once."
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal className="text-muted space-y-5 text-[1.0625rem] leading-relaxed">
          <p>
            I started in front-end work, building Angular and React applications where
            the visible problem was almost always a symptom of something structural. A
            slow dashboard is rarely a slow component; it is usually a request waterfall
            or a query nobody planned. That is what pulled me toward the backend.
          </p>
          <p>
            Since then I have spent most of my time on multi-tenant platforms — NestJS
            services over PostgreSQL and MongoDB, Kafka and RabbitMQ between them, Redis
            for caching and pub/sub — serving millions of users across organisations
            that each expect the product to feel like theirs. The two ends inform each
            other: knowing a consumer is idempotent is what lets a client retry safely,
            and knowing what the user actually waits for tells you which queue matters.
          </p>
          <p>
            More recently that work has extended into AI automation: retrieval-augmented
            assistants grounded in an organisation&rsquo;s own content, agents with a
            narrow and auditable set of tools, and n8n or Make.com orchestrating the
            steps that cross system boundaries. The engineering discipline is the same
            one as everywhere else — bound the blast radius, make the failure legible,
            and keep the facts somewhere you can correct them.
          </p>
          <p>
            I care about the team as much as the system. Design reviews, real code
            review and TDD compound faster than any individual optimisation, and they
            are what make a codebase survivable eighteen months after the person who
            wrote it has moved on.
          </p>

          <dl className="border-line !mt-10 grid gap-5 border-t pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                Education
              </dt>
              <dd className="text-text mt-2 text-[0.9375rem]">
                {education.degree}
                <span className="text-subtle block">
                  {education.institution} · {education.start}&ndash;{education.end}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                Based in
              </dt>
              <dd className="text-text mt-2 text-[0.9375rem]">
                {site.location}
                <span className="text-subtle block">
                  Comfortable across EU and US time zones
                </span>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Stagger
          as="ul"
          className="border-line bg-line grid gap-px overflow-hidden rounded-xl border"
        >
          {principles.map((principle) => (
            <StaggerItem
              as="li"
              key={principle.title}
              className="group bg-canvas hover:bg-raised p-6 transition-colors sm:p-7"
            >
              <h3 className="flex items-center gap-2.5 text-[0.9375rem] font-semibold tracking-tight">
                <span
                  aria-hidden="true"
                  className="bg-faint group-hover:bg-accent size-1 rounded-full transition-colors"
                />
                {principle.title}
              </h3>
              <p className="text-muted mt-2.5 text-[0.9375rem] leading-relaxed">
                {principle.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
