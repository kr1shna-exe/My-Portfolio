"use client";

import { useEffect, useRef, useState } from "react";

import { LIVE_COUNT, RUN_ID, SECTIONS } from "./meta";
import { PaletteButton } from "./palette";

function pad(n: number, w = 2) {
  return String(n).padStart(w, "0");
}

/** Elapsed time since the page opened, written straight to the DOM. */
function RunClock() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const t0 = performance.now();
    let id = 0;
    const paint = () => {
      const ms = performance.now() - t0;
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      const d = Math.floor((ms % 1000) / 100);
      if (ref.current) ref.current.textContent = `${pad(m)}:${pad(s)}.${d}`;
    };
    const start = () => {
      window.clearInterval(id);
      if (!document.hidden) id = window.setInterval(paint, 100);
    };
    start();
    document.addEventListener("visibilitychange", start);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);
  return (
    <span className="trace-clock trace-num" aria-hidden>
      <span className="trace-dimlabel">T+</span>
      <span ref={ref}>00:00.0</span>
    </span>
  );
}

export function Topbar() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const first = SECTIONS.find((s) => seen.get(s.id));
        setActive(first ? first.id : null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="trace-top">
      <div className="trace-top-in">
        <a href="#top" className="trace-brand" aria-label="Krishna, back to top">
          <span className="trace-brand-mark" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <b>krishna</b>
          <span className="trace-brand-sep" aria-hidden>
            /
          </span>
          <span className="trace-brand-run">
            run <span className="trace-num">{RUN_ID}</span>
          </span>
        </a>

        <nav aria-label="Sections" className="trace-top-nav">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              className="trace-top-link"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="trace-top-right">
          <span className="trace-live">
            <i aria-hidden />
            <span>
              <span className="trace-num">{LIVE_COUNT}</span> products live
            </span>
          </span>
          <RunClock />
          <PaletteButton className="trace-top-k" label="Open command palette">
            <span className="trace-top-k-label">commands</span>
          </PaletteButton>
        </div>
      </div>
    </header>
  );
}
