import { site } from "@/data/site";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "./contact-form";

const links = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Phone", value: site.phone.display, href: site.phone.href },
  { label: "GitHub", value: "@mufeez1", href: site.socials.github, external: true },
  {
    label: "LinkedIn",
    value: "in/muffeez-khalid",
    href: site.socials.linkedin,
    external: true,
  },
] as const;

export function Contact() {
  return (
    <Section
      id="contact"
      index="07"
      title="Get in touch"
      lede="Open to senior and staff engineering roles, and to AI automation work — agents, RAG assistants and workflow builds. Always happy to talk through a gnarly performance or distributed-systems problem."
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-20">
        <Reveal>
          <ul className="space-y-6">
            {links.map((link) => (
              <li key={link.label}>
                <p className="text-faint font-mono text-[0.6875rem] tracking-wide uppercase">
                  {link.label}
                </p>
                <a
                  href={link.href}
                  {...("external" in link && link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-text decoration-line-strong hover:decoration-accent mt-1.5 inline-block text-[0.9375rem] underline underline-offset-4 transition-colors"
                >
                  {link.value}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-subtle mt-10 text-sm leading-relaxed">
            Based {site.location}. Comfortable across European and US-East time zones.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
