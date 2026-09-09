"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query as an external store. useSyncExternalStore is the right primitive
 * here: it gives a stable server snapshot for SSR and hydration, then re-renders
 * with the real value — no effect, no cascading render, no mismatch.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // The server cannot know the viewport; false means "assume the cheaper path".
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
