"use client";

import { motion } from "motion/react";
import { staggerChild, staggerParent, viewportOnce } from "@/lib/motion";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol";
}

export function Stagger({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  as = "div",
}: StaggerProps) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Component>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}

export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const Component = motion[as];

  return (
    <Component className={className} variants={staggerChild}>
      {children}
    </Component>
  );
}
