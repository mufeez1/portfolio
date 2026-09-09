import { aiAutomation, qualityPractices, skillGroups } from "@/data/skills";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/animations/reveal";
import { Stagger, StaggerItem } from "@/components/animations/stagger";

export function Skills() {
  return (
    <Section
      id="skills"
      index="03"
      title="Technical range"
      lede="Six years of depth in enterprise MEAN platforms, plus the AI automation layer that increasingly sits on top of them."
    >
      {/* AI work gets its own band rather than a seventh card: it is the newest
          part of the offering and deserves to be read, not scanned past. */}
      <Reveal className="border-accent/25 bg-accent-soft/50 mb-5 overflow-hidden rounded-2xl border">
        <div className="border-line border-b p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="bg-accent size-1.5 rounded-full" />
            <h3 className="text-lg font-semibold tracking-tight">
              {aiAutomation.title}
            </h3>
          </div>
          <p className="text-muted mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
            {aiAutomation.caption}
          </p>
        </div>

        <div className="bg-line grid gap-px sm:grid-cols-3">
          {aiAutomation.columns.map((column) => (
            <div key={column.heading} className="bg-canvas p-6 sm:p-7">
              <h4 className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                {column.heading}
              </h4>
              <ul className="mt-4 space-y-1.5">
                {column.skills.map((skill) => (
                  <li
                    key={skill}
                    className="text-muted font-mono text-[0.75rem] leading-relaxed"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Stagger
        as="ul"
        stagger={0.05}
        className="border-line bg-line grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillGroups.map((group) => (
          <StaggerItem
            as="li"
            key={group.title}
            className="bg-canvas hover:bg-raised p-6 transition-colors sm:p-7"
          >
            <h3 className="text-[0.9375rem] font-semibold tracking-tight">
              {group.title}
            </h3>
            <p className="text-subtle mt-2 text-sm leading-relaxed">{group.caption}</p>
            <ul className="mt-5 space-y-1.5">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="text-muted font-mono text-[0.75rem] leading-relaxed"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
          Testing & quality
        </span>
        <ul className="flex flex-wrap gap-1.5">
          {qualityPractices.map((practice) => (
            <li key={practice}>
              <Badge>{practice}</Badge>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
