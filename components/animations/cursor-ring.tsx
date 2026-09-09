"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** Elements that should make the ring open up. */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary';

/**
 * The ring itself. Split from its gate so this chunk is only ever fetched by
 * pointers that can actually use it — a phone never downloads or hydrates it.
 */
export default function CursorRing() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const seenRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Fast enough to feel attached, slow enough to read as a trail.
  const springX = useSpring(x, { stiffness: 750, damping: 42, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 750, damping: 42, mass: 0.35 });

  useEffect(() => {
    function onMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!seenRef.current) {
        seenRef.current = true;
        setVisible(true);
      }
    }

    // pointerover fires only when the element under the pointer changes, so the
    // DOM query runs on target changes rather than on every mouse move.
    function onOver(event: PointerEvent) {
      const target = event.target;
      setHovering(target instanceof Element && target.closest(INTERACTIVE) !== null);
    }

    function onLeave() {
      setVisible(false);
      seenRef.current = false;
    }

    // Named, so every listener added here is actually removable.
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      // pointer-events-none is load-bearing: without it this element sits over
      // the whole page and swallows every click.
      className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full border border-accent"
      style={{
        x: springX,
        y: springY,
        width: 28,
        height: 28,
        marginLeft: -14,
        marginTop: -14,
        willChange: "transform",
      }}
      animate={{
        // Over something interactive the ring opens and fades almost out, so it
        // frames the target instead of sitting on top of it. Two earlier
        // versions — a bright expanded disc, then a solid contracted dot — both
        // ended up covering the label the visitor was reading.
        opacity: visible ? (hovering ? 0.22 : 0.4) : 0,
        scale: (hovering ? 1.7 : 1) * (pressed ? 0.82 : 1),
      }}
      transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.5 }}
    />
  );
}
