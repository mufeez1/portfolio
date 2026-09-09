import type { SkillGroup } from "@/types";

/**
 * Featured separately from the six-group grid rather than squeezed into it:
 * it is the newest part of the offering, and a seventh card would both bury it
 * and leave the grid ragged.
 */
export const aiAutomation = {
  title: "AI & Automation",
  caption:
    "Putting language models behind real workflows — grounded in your data, wired into the systems you already run, and observable enough to trust in production.",
  columns: [
    {
      heading: "Agents & assistants",
      skills: [
        "AI agents & tool use",
        "Customer-facing chatbots",
        "Multi-step agent workflows",
        "Function / tool calling",
        "Human-in-the-loop review",
      ],
    },
    {
      heading: "Retrieval & models",
      skills: [
        "RAG pipelines",
        "Embeddings & vector search",
        "LLM fine-tuning",
        "Prompt engineering & evals",
        "Chunking & re-ranking",
      ],
    },
    {
      heading: "Orchestration",
      skills: [
        "n8n",
        "Make.com",
        "Webhook & event triggers",
        "API & CRM integrations",
        "Scheduled & queued jobs",
      ],
    },
  ],
} as const;

export const skillGroups: readonly SkillGroup[] = [
  {
    title: "Frontend",
    caption: "Enterprise Angular at scale, and React where it fits better.",
    skills: [
      "Angular (v10+)",
      "React",
      "TypeScript",
      "JavaScript (ES6+)",
      "NgRx / NgXs / RxJS",
      "Nx micro-frontends",
      "SSR & SSG",
      "SCSS · Responsive · WCAG",
    ],
  },
  {
    title: "Backend",
    caption: "NestJS services with explicit boundaries and honest contracts.",
    skills: [
      "Node.js",
      "NestJS",
      "Express.js",
      "REST & GraphQL",
      "WebSockets (Socket.IO)",
      "TypeORM",
      "Webhooks (Stripe, GitHub)",
      "Multi-tenant APIs",
    ],
  },
  {
    title: "Databases",
    caption: "Relational and document stores, chosen per access pattern.",
    skills: [
      "PostgreSQL",
      "MongoDB",
      "Redis (cache & pub/sub)",
      "SQL Server",
      "Firebase Firestore & Realtime DB",
      "Vector stores",
      "Query tuning & indexing",
    ],
  },
  {
    title: "Cloud & DevOps",
    caption: "Containerised services and pipelines that are boring on purpose.",
    skills: [
      "AWS (EC2, S3)",
      "Azure",
      "Firebase",
      "Docker",
      "Kubernetes",
      "GitLab CI / GitHub Actions",
      "Git & GitFlow",
    ],
  },
  {
    title: "Architecture",
    caption: "Multi-tenancy, event-driven services and clean boundaries.",
    skills: [
      "Multi-tenant architecture",
      "Event-driven microservices",
      "Clean architecture",
      "Nx monorepos",
      "Domain modelling",
      "Caching strategy",
      "Incremental migration",
    ],
  },
  {
    title: "Messaging & Real-time",
    caption: "Delivery guarantees stated out loud, then enforced in code.",
    skills: [
      "Apache Kafka",
      "RabbitMQ",
      "Redis pub/sub",
      "WebSockets",
      "Background job queues",
      "Async order processing",
      "Dead-letter handling",
    ],
  },
] as const;

export const qualityPractices = [
  "Jest",
  "Cypress",
  "Selenium",
  "React Testing Library",
  "TDD",
  "ESLint",
  "Prettier",
  "Agile (Scrum / Kanban)",
] as const;
