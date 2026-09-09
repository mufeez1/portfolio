type ClassValue = string | false | null | undefined;

/**
 * Minimal class joiner. Deliberately not clsx + tailwind-merge: this codebase
 * composes classes at the component boundary rather than overriding them at
 * call sites, so conflict resolution has nothing to resolve.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
