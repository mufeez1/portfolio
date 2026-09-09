import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import type { SectionId } from "@/types";

interface SectionProps {
  id: Exclude<SectionId, "hero">;
  /** Two-digit index shown beside the title, e.g. "01". */
  index: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * The single layout rhythm every section inherits: consistent vertical space,
 * a hairline rule, an index and a title. One heading level per section keeps
 * the document outline correct without any per-section thought.
 */
export function Section({ id, index, title, lede, children, className }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("border-line scroll-mt-24 border-t py-20 sm:py-28", className)}
    >
      <div className="mb-12 sm:mb-16">
        <div className="flex items-baseline gap-4">
          <span
            aria-hidden="true"
            className="text-faint font-mono text-xs tabular-nums"
          >
            {index}
          </span>
          <TextReveal
            as="h2"
            id={headingId}
            text={title}
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          />
        </div>
        {lede ? (
          <Reveal delay={0.12}>
            <p className="text-muted mt-4 max-w-2xl text-base leading-relaxed text-balance sm:text-lg">
              {lede}
            </p>
          </Reveal>
        ) : null}
      </div>
      {children}
    </section>
  );
}
