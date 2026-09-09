import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time rather than shipped as a binary, so the card always
 * matches the site copy. Deliberately typographic: no images to optimise, no
 * fonts to fetch beyond the system stack.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0d0e11",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#8fd0ff",
          }}
        />
        <div style={{ color: "#8a93a3", fontSize: 24, letterSpacing: 1 }}>
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#f5f7fa",
            fontSize: 82,
            fontWeight: 600,
            letterSpacing: -2.5,
            lineHeight: 1.05,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            color: "#8fd0ff",
            fontSize: 42,
            letterSpacing: -1,
            marginTop: 12,
          }}
        >
          {site.role}
        </div>
        <div
          style={{
            color: "#8a93a3",
            fontSize: 28,
            lineHeight: 1.45,
            marginTop: 28,
            maxWidth: 880,
          }}
        >
          Distributed backends and high-performance web platforms — TypeScript, Go,
          Postgres, Kafka, AWS.
        </div>
      </div>
    </div>,
    size,
  );
}
