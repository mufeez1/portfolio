import type { NavItem } from "@/types";

/**
 * Resolves the canonical origin from the environment.
 *
 * Every value here is untrusted input, and the failure mode is severe: an
 * invalid origin makes `new URL()` throw during `generateMetadata`, which fails
 * the whole build rather than degrading. So each candidate is trimmed, rejected
 * if empty, given a scheme if it lacks one, and parsed before it is accepted —
 * an env var set to "" must fall through to the next candidate, not become the
 * origin. `.origin` also normalises away any path or trailing slash.
 */
export function resolveSiteUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const candidates = [
    // SITE_URL is preferred: `site.url` is only ever read on the server
    // (metadata, sitemap, robots, OG image), so there is no reason to inline it
    // into the browser bundle. NEXT_PUBLIC_SITE_URL still works for anyone who
    // already set it that way.
    env.SITE_URL,
    env.NEXT_PUBLIC_SITE_URL,
    env.VERCEL_PROJECT_PRODUCTION_URL,
    env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;

    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withScheme).origin;
    } catch {
      // Malformed value: try the next candidate rather than failing the build.
    }
  }

  return "http://localhost:3000";
}

const url = resolveSiteUrl();

export const site = {
  url,
  name: "Muffeez Khalid",
  firstName: "Muffeez",
  role: "Senior Software Engineer",
  headline: "Senior Software Engineer building enterprise platforms and AI automation",
  description:
    "Senior Software Engineer with 6+ years building enterprise-scale MEAN platforms — Angular, NestJS, PostgreSQL, Kafka, RabbitMQ — and AI automation: agents, RAG systems, chatbots and n8n / Make.com workflows.",
  location: "Lahore, PK · Remote",
  email: "muffeezkhalid@gmail.com",
  phone: { display: "+92 314 4160433", href: "tel:+923144160433" },
  resume: "/resume.pdf",
  socials: {
    github: "https://github.com/mufeez1",
    linkedin: "https://www.linkedin.com/in/muffeez-khalid",
  },
} as const;

export const navItems: readonly NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "architecture", label: "Systems" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
] as const;
