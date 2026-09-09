import type { Project } from "@/types";

/**
 * Grounded in the roles in data/experience.ts.
 *
 * TODO(muffeez): the impact figures marked below are the ones from the résumé
 * (millions of users, 99.8% stability, ~30% development time). The AI project's
 * figures are structural rather than measured — replace them with real numbers
 * (tickets deflected, hours saved per week, resolution rate) before publishing.
 */
export const projects: readonly Project[] = [
  {
    slug: "multi-tenant-platform",
    name: "Multi-Tenant Education & Commerce Platform",
    tagline: "One codebase, many organisations, millions of users",
    year: "2023 — present",
    role: "Senior Software Engineer · Classera",
    problem:
      "A single platform had to serve many independent organisations — schools, districts and storefronts — each expecting its own data, branding and rules. Tenancy handled in application code is one forgotten WHERE clause away from a data leak, and a shared request path means one busy tenant degrades everyone else.",
    solution:
      "Multi-tenancy pushed into the schema rather than defended in the service layer, with PostgreSQL and TypeORM enforcing isolation, and an event-driven backbone that keeps slow work off the request path. Kafka carries high-throughput streams, RabbitMQ carries work that must not be lost, and Redis handles caching and pub/sub fan-out.",
    architecture: [
      "Angular (v10+) front ends with NgRx for global state and RxJS for reactive data flows, served across tenant-specific configurations.",
      "NestJS services behind a single ingress; every request resolves its tenant at the boundary, and nothing downstream reads tenant identity from user input.",
      "PostgreSQL with TypeORM as the system of record — isolation is a schema property, so no code path can bypass it.",
      "Apache Kafka for high-throughput event streaming between services; RabbitMQ for asynchronous work that needs delivery guarantees.",
      "Redis for read-through caching and pub/sub, backing real-time dashboards and notifications alongside WebSockets and Firebase Realtime Database.",
    ],
    impact: [
      { value: "Millions", label: "users across tenant organisations" },
      { value: "99.8%", label: "production stability" },
      { value: "Per-tenant", label: "data isolation and customisation" },
    ],
    stack: [
      "Angular",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "TypeORM",
      "Kafka",
      "RabbitMQ",
      "Redis",
    ],
    links: {},
    caseStudy: [
      {
        heading: "Tenancy belongs in the schema",
        body: "The tempting version enforces tenancy in a service-layer guard. That works until a batch job, a support script or a new endpoint writes to the same table without going through it. Making the database enforce isolation means the failure mode is a rejected query rather than a silent cross-tenant read — and it stays true for every code path written after I leave.",
      },
      {
        heading: "Kafka and RabbitMQ do different jobs",
        body: "They are frequently treated as interchangeable. Kafka is a durable, replayable log: right for analytics streams and anything you may need to reprocess. RabbitMQ is a broker with per-message acknowledgement and dead-lettering: right for a single unit of work that must happen once and must not be lost. Using each for what it is good at removed a whole class of arguments about delivery semantics.",
      },
      {
        heading: "Real-time without a second architecture",
        body: "Dashboards and notifications ride on Redis pub/sub and WebSockets rather than a separate real-time stack. Services publish the same domain events they already emit; the socket layer is a subscriber like any other. That keeps one source of truth for what happened, instead of a live path and a persisted path that drift apart.",
      },
      {
        heading: "Stability came from tests, not heroics",
        body: "99.8% production stability is a consequence of Jest unit coverage and Cypress end-to-end suites running in GitLab CI on every merge, not of careful deploys. When the pipeline is the gate, releases get boring — which is the point.",
      },
    ],
  },
  {
    slug: "ai-automation-layer",
    name: "AI Automation & Agent Layer",
    tagline: "Assistants, RAG and n8n workflows wired into production systems",
    year: "2024 — present",
    role: "Design and implementation",
    problem:
      "A general-purpose chatbot bolted onto a product is a demo. It does not know your data, cannot take action, and confidently invents answers the moment a question falls outside its training. The useful version has to be grounded in the organisation's own content and able to actually do something at the end of the conversation.",
    solution:
      "Retrieval-augmented generation over tenant-scoped content, agents with a narrow set of real tools rather than open-ended autonomy, and n8n / Make.com orchestrating the steps that touch external systems. Every answer cites what it retrieved, and every action a model can take is one a human could audit afterwards.",
    architecture: [
      "Content is chunked, embedded and stored per tenant, so retrieval can never cross an organisation boundary — the same isolation rule as the rest of the platform.",
      "A retrieval step with re-ranking runs before generation; the model answers from retrieved passages and says so, rather than from parametric memory.",
      "Agents expose a small, explicit tool surface (lookup, create ticket, schedule, notify) instead of arbitrary execution, so the blast radius of a bad decision is bounded.",
      "n8n and Make.com orchestrate cross-system workflows — webhooks and events in, CRM and messaging actions out — keeping integration glue out of the application services.",
      "Fine-tuning is reserved for tone and format consistency; facts stay in retrieval, where they can be corrected without retraining.",
    ],
    impact: [
      { value: "RAG", label: "answers grounded in tenant content, with citations" },
      { value: "n8n + Make", label: "workflow orchestration across systems" },
      { value: "24/7", label: "always-on assistant coverage" },
    ],
    stack: [
      "LLM APIs",
      "RAG",
      "Vector search",
      "Fine-tuning",
      "n8n",
      "Make.com",
      "NestJS",
      "TypeScript",
    ],
    links: {},
    caseStudy: [
      {
        heading: "Retrieval first, fine-tuning last",
        body: "Fine-tuning is the answer people reach for and rarely the one they need. It teaches a model how to sound, not what is true, and every fact baked into weights is a fact you cannot correct without retraining. Facts belong in a retrieval index where a content update fixes the answer immediately. I fine-tune for format and tone, and retrieve for everything that can change.",
      },
      {
        heading: "The retrieval quality is the product",
        body: "Most 'the AI is hallucinating' reports are retrieval failures wearing a costume — the model answered honestly from passages that did not contain the answer. Chunk boundaries, embedding choice and re-ranking move accuracy far more than prompt wording does. Measuring retrieval separately from generation is what makes the system debuggable at all.",
      },
      {
        heading: "Give agents a small door, not a big one",
        body: "An agent with open-ended execution is impressive in a demo and unbounded in production. A narrow, explicit tool surface means every action is one you can enumerate, permission and audit. It also makes failure legible: when something goes wrong you can see which tool was called with what, instead of reconstructing intent from a transcript.",
      },
      {
        heading: "Where n8n and Make.com earn their place",
        body: "Integration glue rots faster than application code — the CRM changes a field, a webhook payload gains a key. Keeping that layer in n8n or Make.com rather than in service code means it can be changed by whoever owns the process, and a broken integration is a failed workflow run rather than a failed deploy. The rule I apply: application services own decisions, automation platforms own plumbing.",
      },
    ],
  },
  {
    slug: "commerce-and-analytics",
    name: "High-Traffic Commerce & Analytics",
    tagline: "Async order processing and real-time dashboards over streamed events",
    year: "2022 — 2023",
    role: "Software Engineer · Emblem Technologies",
    problem:
      "Order processing sat on the request path, so traffic spikes turned into timeouts at exactly the moment orders mattered most. Meanwhile every product team was rebuilding the same Angular components slightly differently, and stakeholders were asking for insight the reporting layer could not deliver live.",
    solution:
      "Order work moved behind RabbitMQ so the checkout request returns as soon as the order is durable. A shared, typed Angular component library replaced the per-team reimplementations. Analytics dashboards were built on Kafka-streamed events, so what stakeholders saw reflected the system rather than last night's batch.",
    architecture: [
      "RabbitMQ queues absorb order processing and background jobs; the API acknowledges once the work is durably enqueued rather than once it is complete.",
      "NestJS services over MongoDB and PostgreSQL with TypeORM, each store chosen for its access pattern rather than by default.",
      "A shared Angular component library built on TypeScript, RxJS and NgRx, consumed across products.",
      "Angular and D3.js dashboards over REST APIs and Kafka-streamed events for live business insight.",
      "Redis for session caching and pub/sub behind the real-time surfaces.",
    ],
    impact: [
      { value: "−30%", label: "development time via shared component modules" },
      { value: "Real-time", label: "analytics over Kafka-streamed events" },
      { value: "Decoupled", label: "order processing under peak load" },
    ],
    stack: [
      "Angular",
      "NestJS",
      "MongoDB",
      "PostgreSQL",
      "RabbitMQ",
      "Kafka",
      "Redis",
      "D3.js",
    ],
    links: {},
    caseStudy: [
      {
        heading: "The queue was the fix, not a bigger box",
        body: "Under load the instinct is to scale the thing that is slow. But the checkout request did not need the order to be fully processed — it needed the order to be safely recorded. Once that distinction was explicit, the fix was a queue rather than more instances, and the platform stopped degrading in the way that cost money.",
      },
      {
        heading: "A component library only works if adoption is cheap",
        body: "The 30% saving did not come from writing good components; it came from making them the path of least resistance. Typed props, sensible defaults and drop-in parity with what teams already had meant migrating was faster than not migrating. A library nobody adopts is a second implementation, not a shared one.",
      },
      {
        heading: "Dashboards over events, not over the production database",
        body: "Reporting queries against the transactional database is how analytics work becomes an availability incident. Consuming Kafka events into a purpose-shaped read model kept the dashboards live without letting a stakeholder's date range take the store down.",
      },
    ],
  },
] as const;

export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);
