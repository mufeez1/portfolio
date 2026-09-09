# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] — 2026-09-09

### Changed

- The canonical origin is now read from `SITE_URL` in preference to
  `NEXT_PUBLIC_SITE_URL`. `site.url` is only ever read on the server — metadata,
  sitemap, robots and the OG image — so the value has no reason to be inlined
  into the browser bundle, and Vercel warns about the public prefix. The
  `NEXT_PUBLIC_` name is still honoured so existing deploys keep working.

## [1.0.1] — 2026-09-09

### Fixed

- Production builds no longer fail when `NEXT_PUBLIC_SITE_URL` is set but empty.
  The previous resolver used `??`, which only falls through on `null` and
  `undefined`, so an empty string reached `new URL("")` and threw
  `ERR_INVALID_URL` while collecting page data. `resolveSiteUrl()` now trims
  each candidate, skips blank ones, adds a scheme to bare hostnames, and parses
  before accepting — falling back through `NEXT_PUBLIC_SITE_URL`,
  `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL` and finally localhost. It is
  covered by unit tests in `e2e/site-url.spec.ts`, including a case asserting
  the result is always something `new URL()` accepts.

## [1.0.0] — 2026-09-09

Initial release.

### Added

**Pages and content**

- Home page with hero, about, experience, skills, selected work, systems,
  writing and contact sections.
- Case study pages at `/work/[slug]` for the multi-tenant platform, the AI
  automation layer and the commerce & analytics work.
- MDX-backed articles at `/writing` and `/writing/[slug]`, with frontmatter as
  the single source of truth for titles, dates, tags and reading time.
- Content in `data/` sourced from the résumé in `public/resume.pdf`.
- Featured AI & Automation band covering agents, chatbots, RAG, embeddings,
  LLM fine-tuning, n8n and Make.com.

**Interaction and motion**

- Shared animation vocabulary in `components/animations/`: scroll reveals,
  stagger, word-by-word text reveal, magnetic hover, parallax and a CSS-only
  route enter transition.
- Interactive system architecture diagram — an SVG edge layer with HTML
  buttons as nodes, so focus, labelling and keyboard operation are native.
- WebGL hero lattice built on React Three Fiber, code-split and gated on
  viewport width, pointer type, an idle main thread and tab visibility, with a
  server-rendered SVG fallback generated from the same geometry function.
- Trailing cursor ring for fine pointers, code-split and mounted on an idle
  callback.
- Dark and light themes with a pre-paint script, so there is no flash of the
  wrong theme.

**Platform**

- Contact API route with shared Zod validation, a honeypot field, per-IP rate
  limiting and pluggable delivery via `CONTACT_WEBHOOK_URL`.
- SEO: Next.js Metadata API, canonical URLs, Open Graph and Twitter cards,
  generated OG image and favicon, `sitemap.xml`, `robots.txt`, and Person,
  WebSite, TechArticle and BreadcrumbList JSON-LD.
- Security headers including a Content Security Policy, HSTS, frame and
  content-type protections.

**Quality**

- 65 Playwright tests across desktop and mobile projects covering
  accessibility (axe, WCAG 2.2 AA, on five routes plus dark mode and the
  diagram's selected state), SEO surfaces, security headers, the contact
  endpoint, responsive behaviour and the cursor ring.
- `scripts/check-contrast.mjs` parses the oklch design tokens out of the real
  stylesheet and asserts every text colour clears 4.5:1 against both surfaces.
- `npm run verify` chains typecheck, lint, the contrast check and the E2E suite.

### Performance

Lighthouse against a production build:

|         | Performance       | Accessibility | Best practices | SEO |
| ------- | ----------------- | ------------- | -------------- | --- |
| Desktop | 100               | 100           | 96             | 100 |
| Mobile  | 92–96 (median 95) | 100           | 96             | 100 |

CLS 0 and TBT ≤ 30ms on both. Every route is statically prerendered except the
contact API.

### Notes

- Best practices is capped at 96 by a deliberate trade-off: Next streams the
  RSC payload through inline scripts, so `script-src` needs `'unsafe-inline'`.
  The alternative is a per-request nonce from middleware, which would force
  every page out of static generation.
- The AI automation project's impact figures in `data/projects.ts` are
  structural rather than measured and are marked with a `TODO`.
