import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated at build time — no binary asset to keep in sync with the design. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0e11",
        color: "#8fd0ff",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: -0.5,
        borderRadius: 7,
      }}
    >
      MK
    </div>,
    size,
  );
}
