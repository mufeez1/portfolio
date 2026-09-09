import type { Transition, Variants } from "motion/react";

/**
 * One motion vocabulary for the whole site. Components pick a variant; they
 * never invent their own timing. Consistency is what makes motion read as
 * intentional rather than as an effect.
 */
export const easing = [0.16, 1, 0.3, 1] as const;

export const transitions = {
  base: { duration: 0.5, ease: easing },
  quick: { duration: 0.28, ease: easing },
  spring: { type: "spring", stiffness: 380, damping: 30, mass: 0.8 },
} satisfies Record<string, Transition>;

/** Distance is small on purpose — large travel reads as a page still loading. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

export const staggerParent = (stagger = 0.06, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transitions.base },
};

/** Shared viewport config: reveal once, slightly before the element is centred. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
