/**
 * Verifies the design tokens in app/globals.css meet WCAG 2.2 AA contrast.
 * Parses the real CSS so the check can never drift from the shipped values.
 *
 * Usage: node scripts/check-contrast.mjs
 */
import { readFileSync } from "node:fs";

/* ---- oklch -> sRGB -------------------------------------------------- */

const clamp01 = (n) => Math.min(1, Math.max(0, n));

function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return [
    clamp01(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function luminance([r, g, b]) {
  const lin = [r, g, b].map((c) => {
    const s = toSrgb(c);
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

const contrast = (fg, bg) => {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
};

/* ---- token extraction ----------------------------------------------- */

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function tokensFor(selector) {
  const block = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  if (!block) throw new Error(`Could not find ${selector} block`);

  const tokens = {};
  for (const [, name, l, c, h] of block[1].matchAll(
    /--([\w-]+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/g,
  )) {
    tokens[name] = oklchToRgb(Number(l) / 100, Number(c), Number(h));
  }
  return tokens;
}

/* ---- the contract --------------------------------------------------- */

// Every one of these renders small text, so all need the 4.5:1 threshold.
const FOREGROUNDS = ["text", "text-muted", "text-subtle", "text-faint", "accent"];
const MIN_RATIO = 4.5;

let failures = 0;

for (const [mode, selector] of [
  ["light", ":root"],
  ["dark", "\\.dark"],
]) {
  const tokens = tokensFor(selector);
  console.log(`\n${mode}`);

  for (const bgName of ["canvas", "raised"]) {
    for (const fgName of FOREGROUNDS) {
      const ratio = contrast(tokens[fgName], tokens[bgName]);
      const pass = ratio >= MIN_RATIO;
      if (!pass) failures += 1;
      console.log(
        `  ${pass ? "PASS" : "FAIL"}  ${fgName.padEnd(11)} on ${bgName.padEnd(7)} ${ratio.toFixed(2)}:1`,
      );
    }
  }
}

if (failures > 0) {
  console.error(`\n${failures} token pair(s) below ${MIN_RATIO}:1`);
  process.exit(1);
}
console.log(`\nAll token pairs meet ${MIN_RATIO}:1.`);
