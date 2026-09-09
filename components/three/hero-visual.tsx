"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { useInViewport } from "@/hooks/use-in-viewport";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Code-split and client-only, so three.js is absent from the initial payload
 * and the hero's LCP text never waits on it.
 */
const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

interface HeroVisualProps {
  /**
   * The server-rendered SVG lattice. Passed as children so it is real HTML in
   * the initial response — it paints with the document, and the WebGL canvas
   * only ever crossfades over an image that is already there.
   */
  children: React.ReactNode;
}

/**
 * Decides whether WebGL is warranted at all.
 *
 * Guards, in order: never before hydration, never on small screens or coarse
 * pointers, never off screen, never in a hidden tab, and a single static frame
 * under prefers-reduced-motion.
 */
export function HeroVisual({ children }: HeroVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(containerRef, "120px");
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const [tabVisible, setTabVisible] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Wait for an idle callback before pulling in three.js: the fallback is
  // already on screen, so the scene has no reason to compete with hydration of
  // the content people actually came for.
  useEffect(() => {
    if (typeof window.requestIdleCallback !== "function") {
      const timer = window.setTimeout(() => setIdle(true), 1200);
      return () => window.clearTimeout(timer);
    }
    const handle = window.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
    return () => window.cancelIdleCallback(handle);
  }, []);

  const useWebgl = isDesktop && inView && idle;
  const animate = !reducedMotion;

  return (
    <div ref={containerRef} className="absolute inset-0">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        animate={{ opacity: sceneReady ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>

      {useWebgl ? (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: sceneReady ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroScene
            nodeCount={64}
            animate={animate}
            frameloop={inView && tabVisible && animate ? "always" : "demand"}
            onReady={() => setSceneReady(true)}
          />
        </motion.div>
      ) : null}
    </div>
  );
}
