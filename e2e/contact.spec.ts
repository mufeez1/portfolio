import { test, expect } from "@playwright/test";

test.describe("contact form", () => {
  test("surfaces validation errors and moves focus to the first invalid field", async ({
    page,
  }) => {
    await page.goto("/#contact");

    await page.getByRole("button", { name: "Send message" }).click();

    const name = page.getByLabel("Name", { exact: true });
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toBeFocused();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
  });

  test("submits a valid message and confirms success", async ({ page }) => {
    await page.goto("/#contact");

    await page.getByLabel("Name", { exact: true }).fill("Ada Lovelace");
    await page.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await page
      .getByLabel("Message", { exact: true })
      .fill("I would like to talk about a backend performance problem we are hitting.");

    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByRole("status")).toContainText("Message sent");
  });

  test("rejects invalid payloads at the API boundary", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: { name: "x", email: "not-an-email", message: "short" },
    });

    expect(response.status()).toBe(400);
    const body = (await response.json()) as { fields?: Record<string, string[]> };
    expect(body.fields).toBeTruthy();
  });

  test("silently accepts and discards honeypot submissions", async ({ request }) => {
    const response = await request.post("/api/contact", {
      data: {
        name: "Spam Bot",
        email: "bot@example.com",
        message: "Buy cheap backlinks from our premium marketplace today.",
        company: "filled-in-by-a-bot",
      },
    });

    // 400 (schema rejects a non-empty honeypot) or 202 (accepted and dropped)
    // are both correct; a 200 would mean the message was delivered.
    expect([202, 400]).toContain(response.status());
  });
});
