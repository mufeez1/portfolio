import { test, expect } from "@playwright/test";

test.describe("responsive behaviour", () => {
  test("no horizontal overflow at any common width", async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
    }
  });

  test("mobile menu opens, navigates and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const link = page.getByRole("link", { name: "Experience" });
    await expect(link).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("mobile hero is text-first and never mounts WebGL", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });

    // The decorative lattice is deliberately absent on phones: it would take
    // the first screen from the name and value proposition.
    await expect(page.getByTestId("hero-lattice")).toBeHidden();
    await expect(page.locator("canvas")).toHaveCount(0);

    // What must be above the fold instead.
    const heading = page.getByRole("heading", { level: 1 });
    const box = await heading.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y, "h1 should start within the first screen").toBeLessThan(844);

    await expect(page.getByRole("link", { name: "View selected work" })).toBeVisible();
  });

  test("renders the hero visual at a real size on desktop", async ({ page }) => {
    // Regression guard: a wrapper with auto height once collapsed this to 0px,
    // which looks identical to "hidden" in every assertion except a measured one.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const visual = page.getByTestId("hero-lattice");
    const box = await visual.boundingBox();
    expect(box, "hero visual should be laid out").not.toBeNull();
    expect(box!.width).toBeGreaterThan(200);
    expect(box!.height).toBeGreaterThan(200);
  });

  test("respects prefers-reduced-motion by not animating the diagram", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#architecture");

    // Traffic tokens are the one continuously-running animation on the page.
    await expect(page.locator("animateMotion")).toHaveCount(0);
  });
});
