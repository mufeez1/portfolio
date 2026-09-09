import type { Role } from "@/types";

/** Sourced from the résumé in public/resume.pdf — keep the two in step. */
export const roles: readonly Role[] = [
  {
    company: "Classera",
    title: "Senior Software Engineer (MEAN)",
    start: "2023",
    end: "Present",
    location: "Remote",
    summary:
      "Architect enterprise-scale MEAN applications for multi-tenant education and commerce platforms serving millions of users, and build the AI automation layer on top of them.",
    achievements: [
      "Architected and maintained enterprise-scale Angular (v10+), Node.js and NestJS applications with NgRx for global state and RxJS for reactive data flows, supporting millions of users across multi-tenant environments.",
      "Delivered real-time dashboards and notification systems on WebSockets, Firebase Realtime Database and Redis pub/sub for low-latency event broadcasting and session caching.",
      "Built multi-tenant e-commerce and school administration platforms on PostgreSQL and TypeORM, ensuring secure data isolation and per-organisation customisation.",
      "Implemented event-driven microservices with Apache Kafka for high-throughput streaming and RabbitMQ for reliable asynchronous queuing, improving decoupling and scalability.",
      "Integrated AI assistants and agent workflows — retrieval-augmented generation over tenant content, LLM-backed chatbots, and n8n / Make.com automations wired into existing services.",
      "Integrated third-party services via webhooks (Stripe, GitHub) and REST/GraphQL APIs for near real-time backend processing and instant UI updates.",
      "Reached 99.8% production stability through TDD with Jest and Cypress, and shortened release cycles with automated GitLab CI/CD pipelines.",
    ],
    stack: [
      "Angular",
      "NestJS",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Kafka",
      "RabbitMQ",
      "Redis",
      "RAG / LLM",
    ],
  },
  {
    company: "Emblem Technologies",
    title: "Software Engineer",
    start: "2022",
    end: "2023",
    location: "Lahore, Pakistan",
    summary:
      "Full-stack MEAN engineer on real-time products, a high-traffic e-commerce platform and the analytics surfaces on top of them.",
    achievements: [
      "Developed real-time MEAN applications with Angular, Node.js, WebSockets and Firebase, using Redis for session caching and pub/sub messaging.",
      "Built reusable, scalable Angular components and modules with TypeScript, RxJS and NgRx, cutting development time roughly 30% and keeping design consistent across products.",
      "Contributed to a high-traffic e-commerce platform on Angular, NestJS, MongoDB and PostgreSQL with TypeORM, improving query performance and scalability.",
      "Integrated RabbitMQ for asynchronous order processing and background jobs, decoupling core services and improving reliability under load.",
      "Designed data-driven analytics dashboards with Angular and D3.js over REST APIs and Kafka-streamed events, delivering real-time insight to stakeholders.",
      "Enforced quality through ESLint, Prettier, Jest unit tests and active code review across Agile sprints.",
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
  },
  {
    company: "Bester Capital Media",
    title: "Frontend Developer (Angular / React)",
    start: "2020",
    end: "2022",
    location: "Lahore, Pakistan",
    summary:
      "Built and maintained responsive marketing and product web applications across two frameworks, chosen per project.",
    achievements: [
      "Developed and maintained responsive applications in both Angular and React, picking the framework to fit the project rather than the habit.",
      "Improved site performance by optimising image loading and adding caching, reducing initial load time by 15%.",
      "Shipped front-end features that measurably improved engagement and conversion on key landing pages.",
      "Worked directly with UX/UI designers and backend engineers to turn wireframes into functional, accessible pages.",
      "Supported senior developers on application design with a focus on scalable component architecture.",
    ],
    stack: ["Angular", "React", "TypeScript", "SCSS", "REST APIs"],
  },
] as const;

export const education = {
  degree: "BS Software Engineering",
  institution: "University of Gujrat",
  start: "2017",
  end: "2021",
} as const;
