import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  { path: "/", name: "home" },
  { path: "/writing", name: "writing index" },
  { path: "/writing/constraints-over-conventions", name: "article" },
  { path: "/work/multi-tenant-platform", name: "case study" },
  { path: "/does-not-exist", name: "404" },
];

for (const route of routes) {
  test(`${route.name} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(route.path);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target).slice(0, 3),
      })),
    ).toEqual([]);
  });
}

test("architecture diagram stays accessible with a node selected", async ({ page }) => {
  await page.goto("/#architecture");
  await page.getByRole("button", { name: /Domain Services/ }).click();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(
    results.violations.flatMap((v) =>
      v.nodes.map((n) => ({ id: v.id, html: n.html.slice(0, 160) })),
    ),
  ).toEqual([]);
});

test("passes in dark mode too", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations.map((violation) => violation.id)).toEqual([]);
});
