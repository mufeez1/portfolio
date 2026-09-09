import type { NavItem } from "@/types";

/**
 * Single source of truth for identity, canonical URL and social links.
 * Set NEXT_PUBLIC_SITE_URL in the deploy environment; the fallback keeps
 * local builds and preview deploys coherent.
 */
const url =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

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
