import { site } from "@/data/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Rise } from "@/components/animations/rise";
import { Magnetic } from "@/components/animations/magnetic";
import { Parallax } from "@/components/animations/parallax";
import { HeroVisual } from "@/components/three/hero-visual";
import { LatticeSvg } from "@/components/three/lattice-svg";

const facts = [
  { value: "6+", label: "years building enterprise MEAN platforms" },
  { value: "99.8%", label: "production stability across releases" },
  { value: "Millions", label: "users served on multi-tenant deployments" },
] as const;

/**
 * Server Component. The h1 is plain server-rendered text with no animation on
 * the LCP element itself — the visual enhancement lives beside it, never in
 * front of it.
 */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative isolate">
      <div
        aria-hidden="true"
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
      />

      <Container className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-8">
          <div>
            <Rise>
              <p className="text-subtle flex items-center gap-2.5 font-mono text-xs tracking-wide">
                <span
                  aria-hidden="true"
                  className="bg-accent relative flex size-1.5 rounded-full"
                >
                  <span className="bg-accent absolute inset-0 animate-ping rounded-full opacity-60" />
                </span>
                Available for senior engineering roles
              </p>
            </Rise>

            <h1
              id="hero-heading"
              className="mt-6 text-[clamp(2.25rem,6vw,4rem)] leading-[1.04] font-semibold tracking-[-0.03em]"
            >
              {site.name}
              <span className="text-muted block">{site.role}</span>
            </h1>

            <Rise delay={80}>
              <p className="text-muted mt-7 max-w-xl text-lg leading-relaxed">
                I build enterprise-scale platforms in Angular, NestJS and PostgreSQL —
                multi-tenant, event-driven, and correct under retry — and the AI
                automation layer that increasingly sits on top of them: agents, RAG
                assistants and n8n workflows wired into systems that already run.
              </p>
            </Rise>

            <Rise delay={160}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <ButtonLink href="#work">View selected work</ButtonLink>
                </Magnetic>
                <ButtonLink href="#contact" variant="secondary">
                  Get in touch
                </ButtonLink>
                <ButtonLink
                  href={site.resume}
                  variant="ghost"
                  size="sm"
                  download
                  className="gap-1.5"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                  >
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" />
                  </svg>
                  Résumé (PDF)
                </ButtonLink>
              </div>
            </Rise>

            <ul className="border-line mt-14 grid gap-6 border-t pt-8 sm:grid-cols-3">
              {facts.map((fact, index) => (
                <Rise as="li" key={fact.label} delay={260 + index * 70}>
                  <p className="text-text font-mono text-xl tracking-tight tabular-nums">
                    {fact.value}
                  </p>
                  <p className="text-subtle mt-1.5 text-sm leading-snug">
                    {fact.label}
                  </p>
                </Rise>
              ))}
            </ul>
          </div>

          {/* Decorative: the lattice is a metaphor for the systems described
              above, so it carries no information a reader needs — which is why
              it only appears once the layout is wide enough to place it
              beside the text. On narrower screens it would either take the
              first screen from the name and value proposition, or sit below
              them as an orphan graphic. */}
          <Parallax
            distance={28}
            className="text-accent mx-auto hidden w-full lg:block"
          >
            <div className="relative aspect-square w-full">
              <HeroVisual>
                <LatticeSvg count={40} />
              </HeroVisual>
            </div>
          </Parallax>
        </div>
      </Container>
    </section>
  );
}
