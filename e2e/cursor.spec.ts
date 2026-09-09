import { test, expect } from "@playwright/test";

const RING = "[aria-hidden='true'].fixed.rounded-full.border-accent";

test.describe("cursor ring", () => {
  // The ring is fine-pointer only by design; the coarse case is asserted below.
  test.skip(({ isMobile }) => Boolean(isMobile), "requires a fine pointer");

  test("never intercepts pointer events", async ({ page }) => {
    await page.goto("/");
    await page.mouse.move(400, 300);

    // The decorative ring sits over the whole viewport. If pointer-events is
    // ever not "none", every click on the site lands on it instead.
    const pointerEvents = await page
      .locator(RING)
      .evaluate((el) => getComputedStyle(el).pointerEvents);
    expect(pointerEvents).toBe("none");

    // Prove it end to end: a link under the pointer still navigates.
    await page.getByRole("link", { name: "All articles" }).click();
    await expect(page).toHaveURL(/\/writing$/);
  });

  test("appears only after the pointer moves, and follows it", async ({ page }) => {
    await page.goto("/");

    // Parked at the origin before any movement would look like a bug.
    await expect(page.locator(RING)).toHaveCSS("opacity", "0");

    await page.mouse.move(500, 400);
    await expect(page.locator(RING)).not.toHaveCSS("opacity", "0");

    const first = await page.locator(RING).boundingBox();
    await page.mouse.move(800, 600);
    await page.waitForTimeout(400);
    const second = await page.locator(RING).boundingBox();

    expect(second!.x).toBeGreaterThan(first!.x);
    expect(second!.y).toBeGreaterThan(first!.y);
  });

  test("is not rendered under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.mouse.move(400, 300);

    await expect(page.locator(RING)).toHaveCount(0);
  });
});

test("is not rendered for coarse pointers", async ({ browser }) => {
  // A touch device reports pointer: coarse; the ring has nothing to follow.
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.locator(RING)).toHaveCount(0);
  await context.close();
});
