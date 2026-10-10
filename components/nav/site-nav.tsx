"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const LEFT_LINKS = [
  { label: "work", href: "#work", spy: "work" },
  { label: "record", href: "#record", spy: "record" },
];

const RIGHT_LINKS = [
  { label: "experience", href: "#experience", spy: "experience" },
  { label: "about", href: "#about", spy: "about" },
  { label: "contact", href: "mailto:madamanchikrishna525@gmail.com" },
];

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

const RAIL_ITEMS = [
  { label: "work", href: "#work", spy: "work" },
  { label: "record", href: "#record", spy: "record" },
  { label: "experience", href: "#experience", spy: "experience" },
  { label: "about", href: "#about", spy: "about" },
];

// Sections observed for the active indicator; more-work counts as work.
const SPY_IDS = ["work", "more-work", "record", "experience", "about"];
const SPY_ALIAS: Record<string, string> = { "more-work": "work" };

function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={cn("nav-item link-underline", active && "is-active")}
    >
      {label}
    </a>
  );
}

/* Masthead nav: links flank the centered wordmark like section labels
   around a newspaper nameplate. Once scrolled, desktop hands over to a
   margin-index rail on the right edge (always clickable, with an ink
   tick marking the current section) while mobile compresses the bar
   instead. Back at the top, the full masthead returns. */
export function SiteNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 520);
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(SPY_ALIAS[entry.target.id] ?? entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SPY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out)] motion-reduce:transition-none",
          scrolled && "sm:-translate-y-[110%]"
        )}
      >
        <div
          className={cn(
            "masthead grid grid-cols-[auto_1fr] items-baseline gap-4 px-5 text-sm transition-[padding,background-color] duration-300 sm:grid-cols-[1fr_auto_1fr] sm:px-6",
            scrolled
              ? "bg-[var(--paper)] py-2.5 sm:py-3"
              : "bg-gradient-to-b from-[var(--paper)] from-30% to-transparent py-4"
          )}
        >
          <nav className="hidden items-baseline gap-7 sm:flex">
            {LEFT_LINKS.map((item) => (
              <NavLink
                key={item.label}
                {...item}
                active={!!item.spy && active === item.spy}
              />
            ))}
          </nav>
          <Link
            href="#top"
            aria-label="Krishna, back to top"
            className="font-mono text-[0.8rem] font-semibold tracking-tight transition-colors duration-200 hover:text-[var(--muted)]"
          >
            K
            <span
              aria-hidden
              className={cn(
                "inline-block overflow-hidden align-bottom transition-[max-width,opacity] duration-500 ease-[var(--ease-out-strong)]",
                scrolled ? "max-w-[8ch] opacity-100" : "max-w-0 opacity-0"
              )}
            >
              rishna
            </span>
            .
          </Link>
          <nav className="hidden items-baseline justify-end gap-7 sm:flex">
            {RIGHT_LINKS.map((item) => (
              <NavLink
                key={item.label}
                {...item}
                active={!!item.spy && active === item.spy}
              />
            ))}
          </nav>
          <nav className="flex items-baseline justify-end gap-3 text-xs sm:hidden">
            {ALL_LINKS.map((item) => (
              <NavLink
                key={item.label}
                {...item}
                active={!!item.spy && active === item.spy}
              />
            ))}
          </nav>
        </div>
        <div
          aria-hidden
          className={cn(
            "transition-opacity duration-300",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="h-[2px] bg-[var(--ink)]" />
          <div className="mt-[3px] h-px bg-[var(--line)]" />
        </div>
      </header>

      <aside
        aria-label="Section index"
        className={cn(
          "fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 text-right transition-[opacity,transform] duration-350 ease-[var(--ease-out)] motion-reduce:transition-none sm:block",
          scrolled
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-3 opacity-0"
        )}
      >
        <a
          href="#top"
          className="mb-4 block font-mono text-[0.7rem] font-semibold transition-colors duration-200 hover:text-[var(--muted)]"
        >
          K.
        </a>
        {RAIL_ITEMS.map((item) => {
          const isActive = active === item.spy;
          return (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center justify-end gap-2.5 py-1.5 font-mono text-[0.7rem] transition-colors duration-200",
                isActive
                  ? "text-[var(--ink)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              )}
            >
              <span>{item.label}</span>
              <span
                aria-hidden
                className={cn(
                  "h-px transition-[width,background-color] duration-300 ease-[var(--ease-out)]",
                  isActive
                    ? "w-7 bg-[var(--ink)]"
                    : "w-3.5 bg-[color:var(--line)]"
                )}
              />
            </a>
          );
        })}
      </aside>
    </>
  );
}
