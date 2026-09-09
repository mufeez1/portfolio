import { test, expect } from "@playwright/test";
import { resolveSiteUrl } from "@/data/site";

/**
 * Pure unit tests — no browser. This function broke a production build once by
 * letting an empty NEXT_PUBLIC_SITE_URL through to `new URL("")`, so its
 * fall-through behaviour is worth pinning down.
 */
test.describe("resolveSiteUrl", () => {
  test("prefers an explicit site URL and normalises it", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://muffeez.dev" })).toBe(
      "https://muffeez.dev",
    );
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://muffeez.dev/" })).toBe(
      "https://muffeez.dev",
    );
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "  https://muffeez.dev/x  " })).toBe(
      "https://muffeez.dev",
    );
  });

  test("treats an empty or blank value as unset", () => {
    // The exact regression: "" is not nullish, so `??` let it through.
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "",
        VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
      }),
    ).toBe("https://portfolio.vercel.app");

    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "   " })).toBe(
      "http://localhost:3000",
    );
  });

  test("prefers the server-only SITE_URL over the public variant", () => {
    expect(
      resolveSiteUrl({
        SITE_URL: "https://muffeez.dev",
        NEXT_PUBLIC_SITE_URL: "https://old.example.com",
      }),
    ).toBe("https://muffeez.dev");

    // Still honoured on its own, so an existing deploy does not break.
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://muffeez.dev" })).toBe(
      "https://muffeez.dev",
    );

    // A blank SITE_URL must not shadow a real public one.
    expect(
      resolveSiteUrl({ SITE_URL: "", NEXT_PUBLIC_SITE_URL: "https://muffeez.dev" }),
    ).toBe("https://muffeez.dev");
  });

  test("adds a scheme to bare Vercel hostnames", () => {
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app" }),
    ).toBe("https://portfolio.vercel.app");
    expect(resolveSiteUrl({ VERCEL_URL: "portfolio-abc123.vercel.app" })).toBe(
      "https://portfolio-abc123.vercel.app",
    );
  });

  test("falls through a malformed value instead of throwing", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "http://",
        VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
      }),
    ).toBe("https://portfolio.vercel.app");
  });

  test("always returns something new URL() accepts", () => {
    for (const env of [
      {},
      { NEXT_PUBLIC_SITE_URL: "" },
      { NEXT_PUBLIC_SITE_URL: "not a url" },
      { NEXT_PUBLIC_SITE_URL: "http://" },
    ]) {
      expect(() => new URL(resolveSiteUrl(env))).not.toThrow();
    }
  });
});
