"use client";

import { useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";

/**
 * Reads the `dark` class that the boot script and toggle own, treating the DOM
 * as the single source of truth. Anything that needs the theme as a *value*
 * (WebGL materials, aria labels) reads it from here rather than duplicating the
 * localStorage logic.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): ThemeMode =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

/** Stable across SSR and hydration; the real value lands on the next render. */
const getServerSnapshot = (): ThemeMode => "light";

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
