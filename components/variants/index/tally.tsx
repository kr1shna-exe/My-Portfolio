"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const fmt = (n: number, pad?: boolean) =>
  pad && n < 10 ? `0${n}` : n.toLocaleString("en-US");

/* Server renders the real figure; on first view it rolls up from zero like
   a split-flap board. Reduced motion keeps the static number. */
export function Tally({ value, pad, className }: { value: number; pad?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1100;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(Math.round(value * e), pad);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, pad]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {fmt(value, pad)}
    </span>
  );
}
