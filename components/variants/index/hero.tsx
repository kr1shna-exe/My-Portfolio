"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { contributionStats } from "@/data/open-source";

import { featured, liveCount, pad, repoCount, site } from "./data";

const NAME = "KRISHNA".split("");
const MIN = 62;
const MAX = 125;
const REST = 98;
const SWING = 44;

/* The name is locked edge to edge (justify-between) and its letters trade
   width with each other: the letter nearest the pointer widens, the rest
   give back the same amount, so the word keeps filling the measure. With no
   pointer (touch, or the mouse elsewhere) a slow wave walks through it.
   Scrolling compresses every letter toward the narrowest cut. One rAF loop
   writes a CSS variable per letter; it sleeps when the hero is offscreen or
   the tab is hidden, and never starts under reduced motion. */
function useBreathingName(
  wrapRef: React.RefObject<HTMLSpanElement | null>,
  letterRefs: React.RefObject<(HTMLSpanElement | null)[]>
) {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const n = spans.length;
    const cur = spans.map(() => REST);
    let left = 0;
    let width = 1;
    let pointer: number | null = null;
    let visible = true;
    let raf = 0;
    let running = false;

    const measure = () => {
      const r = wrap.getBoundingClientRect();
      left = r.left;
      width = r.width || 1;
    };
    measure();

    const tick = (now: number) => {
      const vh = window.innerHeight || 1;
      const sp = Math.min(1, Math.max(0, window.scrollY / (vh * 0.7)));
      const base = REST - (REST - MIN) * sp;
      const idle = pointer === null;
      const x = idle ? width * (0.5 + 0.48 * Math.sin(now / 2600)) : pointer!;
      const reach = width * 0.2;
      const f: number[] = [];
      let mean = 0;
      for (let i = 0; i < n; i++) {
        const c = ((i + 0.5) / n) * width;
        const d = Math.abs(x - c) / reach;
        const v = d >= 1 ? 0 : (1 - d) * (1 - d);
        f.push(v);
        mean += v / n;
      }
      const amp = SWING * (idle ? 0.55 : 1) * (1 - sp * 0.6);
      for (let i = 0; i < n; i++) {
        const target = Math.min(MAX, Math.max(MIN, base + amp * (f[i] - mean)));
        cur[i] += (target - cur[i]) * 0.12;
        spans[i].style.setProperty("--w", cur[i].toFixed(2));
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer = e.clientX - left;
    };
    const onLeave = () => {
      pointer = null;
    };
    const onVis = () => (document.hidden ? stop() : start());
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [wrapRef, letterRefs]);
}

export function IndexHero() {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  useBreathingName(wrapRef, letterRefs);

  const [lead, rest] = site.headline.split(" real work");

  return (
    <section id="top" className="index-hero" aria-labelledby="index-h1">
      <div className="index-dateline">
        <span>{site.role}</span>
        <span className="index-hide-sm">Edition of {site.updated}</span>
        <span className="index-hide-sm">Remote</span>
        <span>
          <i className="index-live-dot" aria-hidden /> {liveCount} live · {repoCount} repos
        </span>
        <span className="index-hide-md">Everything open source</span>
      </div>

      <h1 id="index-h1" className="index-name" aria-label={site.name}>
        <span ref={wrapRef} className="index-name-row" aria-hidden>
          {NAME.map((l, i) => (
            <span key={i} className="index-name-clip">
              <span
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className="index-name-letter"
                style={{ "--i": i } as React.CSSProperties}
              >
                {l}
              </span>
            </span>
          ))}
        </span>
      </h1>

      <div className="index-hero-rule" aria-hidden />

      <div className="index-hero-grid">
        <div className="index-deck-col">
          <p className="index-deck">
            {lead}
            <mark>real work</mark>
            {rest}
          </p>
          <p className="index-subline">{site.subline}</p>
        </div>

        <div className="index-meta-col">
        <dl className="index-meta">
          <div>
            <dt>Now</dt>
            <dd>
              <a href={site.company.href} target="_blank" rel="noreferrer" className="index-ul">
                {site.company.name} <span aria-hidden>↗</span>
              </a>
            </dd>
          </div>
          <div>
            <dt>Live</dt>
            <dd>
              <i className="index-live-dot" aria-hidden /> {liveCount} products
            </dd>
          </div>
          <div>
            <dt>Repos</dt>
            <dd>{repoCount}</dd>
          </div>
          <div>
            <dt>Upstream</dt>
            <dd>
              <a href="#record" className="index-ul">
                {contributionStats.merged} PRs merged <span aria-hidden>↓</span>
              </a>
            </dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{site.updated}</dd>
          </div>
        </dl>
          <div className="index-hero-ctas">
            <a href="#work" className="index-btn index-btn-ink">
              The index <span aria-hidden>↓</span>
            </a>
            <a href={`mailto:${site.email}`} className="index-btn">
              Write to me <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="index-inside" aria-label="Inside: featured work">
        <span className="index-inside-label">Inside</span>
        {featured.map((p, i) => (
          <a key={p.slug} href={`#sheet-${p.slug}`} className="index-inside-item">
            <span className="index-inside-thumb">
              <Image src={p.image} alt="" fill sizes="96px" className="index-cover" />
            </span>
            <span className="index-inside-text">
              <span className="index-inside-no">A3 · Feature {pad(i + 1)}</span>
              <span className="index-inside-title">{p.title}</span>
            </span>
            <span aria-hidden className="index-inside-arrow">↓</span>
          </a>
        ))}
      </nav>
    </section>
  );
}
