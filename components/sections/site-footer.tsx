"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

const EMAIL = "madamanchikrishna525@gmail.com";

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com/KrishXCodes" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jaya-krishna-09859a227",
  },
  { label: "GitHub", href: "https://github.com/kr1shna-exe/" },
];

export function SiteFooter() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Clipboard can be unavailable; the visible address still communicates.
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer className="relative z-2 border-t bg-[var(--paper)] px-5 pt-9 pb-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-6">
        <button
          type="button"
          onClick={copy}
          className="relative cursor-pointer border px-4 py-2.5 font-mono text-[0.82rem] transition-colors duration-200 hover:border-[var(--ink)] active:scale-[0.98]"
        >
          {/* Invisible copy of the longest label reserves the width so the
              morph never resizes the button. */}
          <span aria-hidden className="invisible">
            {EMAIL}
          </span>
          <motion.span
            key={copied ? "copied" : "email"}
            initial={reduce ? false : { opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0 grid place-items-center"
          >
            {copied ? "copied" : EMAIL}
          </motion.span>
        </button>
        <nav className="flex gap-6 text-sm">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 hover:text-[var(--muted)]"
            >
              {social.label}
            </a>
          ))}
        </nav>
        <p className="w-full font-mono text-xs text-[var(--muted)]">
          Set in Archivo and Spline Sans Mono. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
