"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { navItems, site } from "@/data/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Container } from "@/components/ui/container";

const sectionIds = navItems.map((item) => item.id);

export function Nav() {
  const active = useActiveSection(sectionIds);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  // Close on Escape and restore focus to the trigger — the minimum a disclosure
  // owes a keyboard user.
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || menuOpen
          ? "border-line bg-overlay border-b backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <Container>
        <nav
          aria-label="Primary"
          className="flex h-16 items-center justify-between gap-6"
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-sm text-sm font-semibold tracking-tight"
          >
            <span
              aria-hidden="true"
              className="border-line-strong group-hover:border-accent group-hover:text-accent grid size-7 place-items-center rounded-md border font-mono text-[0.7rem] transition-colors"
            >
              MK
            </span>
            <span className="sr-only">{site.name} — home</span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative inline-flex h-8 items-center rounded-full px-3 text-[0.8125rem] transition-colors",
                      isActive ? "text-text" : "text-subtle hover:text-text",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="bg-raised absolute inset-0 rounded-full"
                        transition={transitions.spring}
                      />
                    ) : null}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              className="text-muted hover:bg-raised hover:text-text inline-flex size-9 items-center justify-center rounded-full transition-colors md:hidden"
            >
              <span className="sr-only">Menu</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="size-[18px]"
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id={menuId}
            ref={panelRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.quick}
            className="overflow-hidden md:hidden"
          >
            <Container className="pb-6">
              <ul className="border-line flex flex-col border-t pt-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active === item.id ? "true" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-2 py-3 text-base transition-colors",
                        active === item.id ? "text-text" : "text-muted",
                      )}
                    >
                      {item.label}
                      <span aria-hidden="true" className="text-faint font-mono text-xs">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
