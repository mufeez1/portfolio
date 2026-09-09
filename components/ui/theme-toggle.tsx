"use client";

import { useThemeMode } from "@/hooks/use-theme-mode";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "theme";

/**
 * The DOM class is the source of truth (set pre-paint by ThemeScript), so this
 * component only writes: no local state to fall out of sync, no flash, and no
 * hydration mismatch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeMode();
  const next = theme === "dark" ? "light" : "dark";

  function toggle() {
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (private mode, embedded contexts). The toggle
      // still works for this session; only persistence is lost.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full",
        "text-muted hover:bg-raised hover:text-text transition-colors",
        className,
      )}
    >
      {/* Both icons ship; CSS picks one, so there is nothing to hydrate. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="size-[18px] dark:hidden"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden size-[18px] dark:block"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}
