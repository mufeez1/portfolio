"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

const CursorRing = dynamic(() => import("./cursor-ring"), { ssr: false });

/**
 * Gate for the trailing cursor ring.
 *
 * The native cursor is deliberately left visible. Hiding it is the fashionable
 * choice and a bad one: the replacement always lags a frame, and any error in
 * this component would leave a visitor with no pointer at all. The ring is
 * additive — if it never renders, nothing is lost.
 *
 * It renders only for fine pointers (never touch) and never under
 * prefers-reduced-motion, and it waits for an idle callback first: a decorative
 * follower has no business competing with hydration of the actual content.
 * Keeping this gate tiny and code-splitting the ring means a phone, which can
 * never show it, pays nothing for it.
 */
export function Cursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useReducedMotion();
  const [idle, setIdle] = useState(false);

  const enabled = finePointer && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    if (typeof window.requestIdleCallback !== "function") {
      const timer = window.setTimeout(() => setIdle(true), 800);
      return () => window.clearTimeout(timer);
    }
    const handle = window.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
    return () => window.cancelIdleCallback(handle);
  }, [enabled]);

  if (!enabled || !idle) return null;
  return <CursorRing />;
}
