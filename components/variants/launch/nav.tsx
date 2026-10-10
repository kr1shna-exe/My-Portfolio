"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#open-source", label: "Open source" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header>
      <nav className="launch-nav" data-scrolled={scrolled} aria-label="Primary">
        <a href="#main" className="launch-brand" aria-label="Krishna, back to top">
          <span className="launch-mark" aria-hidden>
            K
          </span>
          <span>Krishna</span>
        </a>
        <ul className="launch-navlinks">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="launch-btn launch-btn-accent">
          Get in touch
          <ArrowRight size={14} className="launch-nudge" aria-hidden />
        </a>
      </nav>
    </header>
  );
}
