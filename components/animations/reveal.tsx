"use client";

import { motion } from "motion/react";
import { revealVariants, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}

/** Scroll-triggered reveal. Fires once — re-animating on scroll-up is noise. */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
