import type { ArchEdge, ArchNode } from "@/types";

/**
 * The shape of the multi-tenant platform described in the work section, with
 * the AI layer that now sits alongside it. A real reference architecture
 * rather than a decorative graph. Coordinates are in the 1000 x 620 viewBox.
 */
export const archNodes: readonly ArchNode[] = [
  {
    id: "clients",
    label: "Angular Clients",
    kind: "client",
    detail:
      "Angular (v10+) applications with NgRx for global state and RxJS for reactive data flows. Each tenant gets its own configuration and branding from the same build.",
    x: 95,
    y: 310,
  },
  {
    id: "gateway",
    label: "API Gateway",
    kind: "edge",
    detail:
      "Single NestJS ingress: TLS, rate limiting, request IDs and schema validation. The tenant is resolved here from the authenticated session — never from anything the caller can set.",
    x: 300,
    y: 310,
  },
  {
    id: "auth",
    label: "Auth & Tenancy",
    kind: "service",
    detail:
      "Issues short-lived tokens and resolves tenant membership. Sessions live in Redis so revocation takes effect immediately rather than at token expiry.",
    x: 530,
    y: 70,
  },
  {
    id: "services",
    label: "Domain Services",
    kind: "service",
    detail:
      "NestJS services owning the transactional domain — commerce, administration, scheduling. Relational data sits in PostgreSQL via TypeORM; document-shaped data sits in MongoDB. Every state change emits a domain event.",
    x: 530,
    y: 230,
  },
  {
    id: "realtime",
    label: "Realtime Gateway",
    kind: "service",
    detail:
      "WebSocket and Firebase Realtime Database fan-out for dashboards and notifications. It subscribes to the same domain events the services already publish, so there is no second source of truth for what happened.",
    x: 530,
    y: 390,
  },
  {
    id: "ai",
    label: "AI Agent · RAG",
    kind: "service",
    detail:
      "Retrieval-augmented assistants and agents. Answers are generated from retrieved, tenant-scoped passages with citations; actions run through a small, explicit tool surface rather than open-ended execution.",
    x: 530,
    y: 550,
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    kind: "datastore",
    detail:
      "System of record, accessed through TypeORM. Tenant isolation is enforced by the schema rather than by application guards, so no code path can bypass it. Migrations are expand-and-contract.",
    x: 790,
    y: 70,
  },
  {
    id: "redis",
    label: "Redis",
    kind: "cache",
    detail:
      "Read-through cache, session store and pub/sub bus. Every cached key has an explicit owner and invalidation trigger — no TTL-only caching of data that can go visibly stale.",
    x: 790,
    y: 210,
  },
  {
    id: "kafka",
    label: "Apache Kafka",
    kind: "queue",
    detail:
      "Durable, replayable event log for high-throughput streams and analytics. At-least-once delivery paired with idempotent consumers, which makes replay and backfill routine rather than risky.",
    x: 790,
    y: 350,
  },
  {
    id: "rabbit",
    label: "RabbitMQ",
    kind: "queue",
    detail:
      "Work queues for asynchronous jobs — order processing, notifications, exports. Chosen over Kafka wherever a single unit of work needs per-message acknowledgement and dead-lettering.",
    x: 790,
    y: 470,
  },
  {
    id: "vector",
    label: "Vector Store",
    kind: "datastore",
    detail:
      "Per-tenant embeddings of organisation content. Retrieval is scoped to the tenant by construction, so the isolation rule that governs the relational data governs the AI layer too.",
    x: 790,
    y: 580,
  },
] as const;

export const archEdges: readonly ArchEdge[] = [
  { from: "clients", to: "gateway", label: "HTTPS" },
  { from: "gateway", to: "auth", label: "verify" },
  { from: "gateway", to: "services", label: "REST / GraphQL" },
  { from: "gateway", to: "realtime", label: "WebSocket" },
  { from: "gateway", to: "ai", label: "assistant" },
  { from: "auth", to: "redis", label: "sessions" },
  { from: "services", to: "postgres", label: "TypeORM" },
  { from: "services", to: "redis", label: "read-through" },
  { from: "services", to: "kafka", label: "events", async: true },
  { from: "services", to: "rabbit", label: "jobs", async: true },
  { from: "realtime", to: "redis", label: "pub/sub", async: true },
  { from: "ai", to: "vector", label: "retrieval" },
] as const;
