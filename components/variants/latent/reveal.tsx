"use client";

import { useEffect } from "react";

/* One observer for every [data-reveal] element in the variant: they rise in
   once, the first time they enter the viewport. Skipped for reduced motion. */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.querySelector<HTMLElement>('[data-variant="latent"]');
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "1";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.dataset.in = "1";
      else io.observe(el);
    }
    // Safety net for jumps (anchor links, restored scroll): anything already
    // above the bottom of the viewport is revealed, whether or not IO saw it.
    let raf = 0;
    const sweep = () => {
      raf = 0;
      for (const el of els) {
        if (!el.dataset.in && el.getBoundingClientRect().top < window.innerHeight) {
          el.dataset.in = "1";
          io.unobserve(el);
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    root.dataset.reveal = "on";
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
