"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Whether an element is on screen. Used to pause the 3D render loop when the
 * canvas scrolls out of view rather than burning GPU on an invisible scene.
 */
export function useInViewport(
  ref: RefObject<Element | null>,
  rootMargin = "200px",
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
