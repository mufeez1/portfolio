import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero and key sections without client-side rendering", async ({
    page,
  }) => {
    // Content must exist in the HTML response itself, not after hydration.
    const response = await page.goto("/");
    const html = (await response?.text()) ?? "";

    expect(html).toContain("Senior Software Engineer");
    expect(html).toContain("Selected work");
    expect(html).toContain("Experience");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Muffeez Khalid",
    );
  });

  test("has exactly one h1 and a correct heading order", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    const levels = await page
      .locator("h1, h2, h3")
      .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));

    // No level may be skipped on the way down.
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1);
    }
  });

  test("skip link is the first focusable element and targets main", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#main");
    await expect(page.locator("main#main")).toBeVisible();
  });

  test("theme toggle switches and persists the theme", async ({ page }) => {
    await page.goto("/");

    const initial = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );

    await page.getByRole("button", { name: /switch to (light|dark) theme/i }).click();

    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.classList.contains("dark")),
      )
      .toBe(!initial);

    await page.reload();
    expect(
      await page.evaluate(() => document.documentElement.classList.contains("dark")),
    ).toBe(!initial);
  });

  test("architecture diagram nodes are keyboard operable and describe themselves", async ({
    page,
  }) => {
    await page.goto("/#architecture");

    const kafka = page.getByRole("button", { name: /Kafka/i });
    await kafka.focus();
    await expect(kafka).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(kafka).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/Durable, replayable event log/i)).toBeVisible();
  });
});
