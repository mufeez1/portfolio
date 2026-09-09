import { cn } from "@/lib/utils";

/** Monospace tag used for tech stacks and metadata. */
export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "border-line inline-flex items-center rounded-md border px-2 py-0.5",
        "text-subtle font-mono text-[0.6875rem] tracking-tight",
        className,
      )}
    >
      {children}
    </span>
  );
}
