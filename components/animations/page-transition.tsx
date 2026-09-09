import { cn } from "@/lib/utils";

/**
 * Route enter transition — CSS-only, transform-only, and deliberately so.
 *
 * The obvious implementation fades from opacity 0. On a server-rendered page
 * that is actively harmful: the content is in the HTML and paintable, but an
 * opacity-0 element does not count as painted, so the fade pushes LCP out by
 * the duration of the animation and hides readable text until JavaScript
 * hydrates. Animating only `transform` keeps the text visible and legible from
 * the first frame while still giving the page a sense of arrival.
 *
 * Being plain CSS also means this stays a Server Component and starts on first
 * paint rather than after hydration. prefers-reduced-motion is handled globally.
 */
export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("animate-page-enter", className)}>{children}</div>;
}
