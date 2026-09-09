export type SectionId =
  | "hero"
  | "about"
  | "experience"
  | "skills"
  | "work"
  | "architecture"
  | "writing"
  | "contact";

export interface NavItem {
  readonly id: Exclude<SectionId, "hero">;
  readonly label: string;
}

export interface Role {
  readonly company: string;
  readonly title: string;
  readonly start: string;
  readonly end: string | "Present";
  readonly location: string;
  readonly summary: string;
  readonly achievements: readonly string[];
  readonly stack: readonly string[];
}

export interface SkillGroup {
  readonly title: string;
  readonly caption: string;
  readonly skills: readonly string[];
}

export interface ProjectMetric {
  readonly value: string;
  readonly label: string;
}

export interface Project {
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly year: string;
  readonly role: string;
  readonly problem: string;
  readonly solution: string;
  readonly architecture: readonly string[];
  readonly impact: readonly ProjectMetric[];
  readonly stack: readonly string[];
  readonly links: {
    readonly repo?: string;
    readonly demo?: string;
  };
  /** Longer-form case study, rendered on /work/[slug]. */
  readonly caseStudy: readonly { readonly heading: string; readonly body: string }[];
}

export type ArchNodeKind =
  "client" | "edge" | "service" | "datastore" | "cache" | "queue" | "external";

export interface ArchNode {
  readonly id: string;
  readonly label: string;
  readonly kind: ArchNodeKind;
  readonly detail: string;
  /** Coordinates within the diagram's 1000 x 560 viewBox. */
  readonly x: number;
  readonly y: number;
}

export interface ArchEdge {
  readonly from: string;
  readonly to: string;
  readonly label: string;
  /** Async edges render dashed and animate a token along the path. */
  readonly async?: boolean;
}

export interface ArticleMeta {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly readingTime: number;
  readonly tags: readonly string[];
}

export interface Article extends ArticleMeta {
  readonly content: string;
}
