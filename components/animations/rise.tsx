import { cn } from "@/lib/utils";

interface RiseProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in milliseconds. */
  delay?: number;
  as?: "div" | "p" | "li" | "ul";
}

/**
 * Entrance animation for content that is already in the viewport at load.
 *
 * Distinct from Reveal on purpose. Reveal fades from opacity 0 when an element
 * scrolls into view, which is correct below the fold and wrong above it: the
 * hero is the LCP candidate, and an opacity-0 element does not count as
 * painted. This animates transform only, runs as pure CSS from first paint
 * (no hydration, no JavaScript), and leaves text legible throughout.
 */
export function Rise({ children, className, delay = 0, as: Tag = "div" }: RiseProps) {
  return (
    <Tag
      className={cn("animate-rise", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
