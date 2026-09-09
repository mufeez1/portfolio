import { test, expect } from "@playwright/test";

test.describe("SEO surfaces", () => {
  test("home page exposes canonical, OG, Twitter and JSON-LD", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /https?:\/\/.+/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const types = jsonLd.flatMap((raw) => {
      const parsed: unknown = JSON.parse(raw);
      return (Array.isArray(parsed) ? parsed : [parsed]).map(
        (entry) => (entry as { "@type": string })["@type"],
      );
    });

    expect(types).toContain("Person");
    expect(types).toContain("WebSite");
  });

  test("article page emits TechArticle and breadcrumb schema", async ({ page }) => {
    await page.goto("/writing/idempotency-is-a-design-constraint");

    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const types = jsonLd.flatMap((raw) => {
      const parsed: unknown = JSON.parse(raw);
      return (Array.isArray(parsed) ? parsed : [parsed]).map(
        (entry) => (entry as { "@type": string })["@type"],
      );
    });

    expect(types).toContain("TechArticle");
    expect(types).toContain("BreadcrumbList");
  });

  test("sitemap and robots are served and consistent", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();

    const xml = await sitemap.text();
    expect(xml).toContain("/writing/idempotency-is-a-design-constraint");
    expect(xml).toContain("/work/multi-tenant-platform");

    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap:");
  });

  test("sets security headers", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
