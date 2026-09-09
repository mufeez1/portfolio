import { roles } from "@/data/experience";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Stagger, StaggerItem } from "@/components/animations/stagger";

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      title="Experience"
      lede="Roles where I owned an outcome rather than a ticket queue — with the numbers that actually moved."
    >
      <Stagger as="ol" stagger={0.1} className="relative">
        {/* The rail is decorative; the ordered list carries the real semantics. */}
        <div
          aria-hidden="true"
          className="bg-line absolute top-2 bottom-2 left-[7px] w-px sm:left-[calc(7rem+7px)]"
        />

        {roles.map((role) => (
          <StaggerItem
            as="li"
            key={`${role.company}-${role.start}`}
            className="relative pb-14 pl-8 last:pb-0 sm:pl-[calc(7rem+2rem)]"
          >
            <span
              aria-hidden="true"
              className="border-line-strong bg-canvas absolute top-1.5 left-0 grid size-[15px] place-items-center rounded-full border sm:left-28"
            >
              <span className="bg-accent size-1.5 rounded-full" />
            </span>

            <p className="text-subtle font-mono text-xs tabular-nums sm:absolute sm:top-1 sm:left-0 sm:w-24 sm:text-right">
              <time dateTime={role.start}>{role.start}</time>
              <span aria-hidden="true"> — </span>
              <span className="sr-only">to</span>
              {role.end === "Present" ? (
                "Present"
              ) : (
                <time dateTime={role.end}>{role.end}</time>
              )}
            </p>

            <h3 className="mt-2 text-lg font-semibold tracking-tight sm:mt-0">
              {role.title}
              <span className="text-faint"> · </span>
              <span className="text-accent">{role.company}</span>
            </h3>

            <p className="text-faint mt-1 font-mono text-[0.6875rem]">
              {role.location}
            </p>

            <p className="text-muted mt-3 max-w-2xl text-[0.9375rem] leading-relaxed">
              {role.summary}
            </p>

            <ul className="mt-5 max-w-2xl space-y-2.5">
              {role.achievements.map((achievement) => (
                <li
                  key={achievement}
                  className="text-muted relative pl-5 text-[0.9375rem] leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="bg-faint absolute top-[0.6em] left-0 h-px w-2.5"
                  />
                  {achievement}
                </li>
              ))}
            </ul>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {role.stack.map((tech) => (
                <li key={tech}>
                  <Badge>{tech}</Badge>
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
