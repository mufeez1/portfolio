import type { Metadata } from "next";
import { site } from "@/data/site";

interface PageMetaInput {
  title: string;
  description: string;
  /** Root-relative path, e.g. "/writing/idempotency". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: readonly string[];
}

/** Builds canonical-correct, OG- and Twitter-complete metadata for a page. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  tags,
}: PageMetaInput): Metadata {
  const url = `${site.url}${path}`;
  const ogImage = `${site.url}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: "en_GB",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime
        ? { publishedTime, authors: [site.name], tags: [...(tags ?? [])] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

type JsonLd = Record<string, unknown>;

export const personSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  telephone: site.phone.display,
  jobTitle: site.role,
  description: site.description,
  sameAs: [site.socials.github, site.socials.linkedin],
  knowsAbout: [
    "Distributed systems",
    "Web performance",
    "TypeScript",
    "Event-driven architecture",
    "PostgreSQL",
    "Accessibility",
  ],
});

export const websiteSchema = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: `${site.name} — ${site.role}`,
  description: site.description,
  inLanguage: "en-GB",
  publisher: { "@id": `${site.url}/#person` },
});

export const articleSchema = (input: {
  title: string;
  description: string;
  path: string;
  date: string;
}): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: input.title,
  description: input.description,
  datePublished: input.date,
  dateModified: input.date,
  inLanguage: "en-GB",
  mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}${input.path}` },
  author: { "@id": `${site.url}/#person` },
  publisher: { "@id": `${site.url}/#person` },
  image: `${site.url}/opengraph-image`,
});

export const breadcrumbSchema = (
  crumbs: readonly { name: string; path: string }[],
): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: `${site.url}${crumb.path}`,
  })),
});
