"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { easing, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
  /** Needed when a section labels itself with aria-labelledby. */
  id?: string;
}

/**
 * Word-by-word rise. The full string stays in the accessibility tree via a
 * visually-hidden copy, and the split words are hidden from it — screen readers
 * get one clean sentence instead of a pile of fragments.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as = "h2",
  id,
}: TextRevealProps) {
  const Component = motion[as];
  const words = text.split(" ");

  return (
    <Component
      id={id}
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.035, delayChildren: delay } },
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "110%" },
                  visible: { y: 0, transition: { duration: 0.6, ease: easing } },
                }}
              >
                {word}
              </motion.span>
            </span>
            {/* Real text node so words keep normal word-spacing. */}
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Component>
  );
}
