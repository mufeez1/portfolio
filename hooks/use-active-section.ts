"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view for the nav indicator.
 *
 * Uses a single IntersectionObserver with a top-biased root margin so the
 * "active" section is the one under the header, which is what a reader
 * perceives as current — not whatever happens to be centred.
 */
export function useActiveSection(ids: readonly string[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(undefined);

  useEffect(() => {
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }

        // Preserve document order so ties resolve predictably.
        const current = ids.find((id) => visible.has(id));
        setActive(current);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
