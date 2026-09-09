"use client";

import { MotionConfig } from "motion/react";
import { transitions } from "@/lib/motion";

/**
 * reducedMotion="user" makes every transform/layout animation in the tree
 * respect prefers-reduced-motion automatically, so individual components never
 * have to remember to check.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={transitions.base}>
      {children}
    </MotionConfig>
  );
}
