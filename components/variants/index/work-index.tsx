"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { HIDE_DETAILS, isLive, pad, showcase } from "./data";
import { TradingPlate } from "./trading-plate";

/* Measure, per row, the width-axis value at which the title exactly fills
   its cell: hover drives the title from condensed (62) to that value, so
   long names reach the edge and short ones open to the full 125. */
function useFitTitles(listRef: React.RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const fit = () => {
      list.querySelectorAll<HTMLElement>("[data-fit]").forEach((t) => {
        const cell = t.parentElement;
        const row = t.closest<HTMLElement>("[data-row]");
        if (!cell || !row) return;
        const avail = cell.clientWidth;
        t.style.transition = "none";
        t.style.setProperty("--s", "1");
        t.style.setProperty("--w", "62");
        const a = t.offsetWidth;
        t.style.setProperty("--w", "125");
        const b = t.offsetWidth;
        const s = a > avail ? avail / a : 1;
        const w = b * s <= avail ? 125 : 62 + (63 * (avail / s - a)) / Math.max(1, b - a);
        t.style.removeProperty("--w");
        t.style.setProperty("--s", s.toFixed(4));
        void t.offsetWidth;
        t.style.transition = "";
        row.style.setProperty("--fit", Math.max(62, Math.min(125, w - 1)).toFixed(1));
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(list);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [listRef]);
}

/* Touch screens have no hover, so a row "opens" when it reaches the middle
   of the viewport instead. */
function useSeenRows(listRef: React.RefObject<HTMLOListElement | null>) {
  useEffect(() => {
    const list = listRef.current;
    if (!list || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.target.classList.toggle("is-seen", e.isIntersecting)),
      { rootMargin: "-38% 0px -38% 0px" }
    );
    list.querySelectorAll("[data-row]").forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [listRef]);
}

export function WorkIndex() {
  const listRef = useRef<HTMLOListElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const motion = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0, on: false, primed: false });

  useFitTitles(listRef);
  useSeenRows(listRef);

  useEffect(() => {
    const m = motion.current;
    return () => cancelAnimationFrame(m.raf);
  }, []);

  const loop = () => {
    const m = motion.current;
    const el = floatRef.current;
    if (!el) return;
    m.x += (m.tx - m.x) * 0.16;
    m.y += (m.ty - m.y) * 0.16;
    const tilt = Math.max(-7, Math.min(7, (m.tx - m.x) * 0.035));
    el.style.transform = `translate3d(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    if (m.on || Math.abs(m.tx - m.x) > 0.5) m.raf = requestAnimationFrame(loop);
  };

  const track = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    const m = motion.current;
    const el = floatRef.current;
    const w = el?.offsetWidth ?? 400;
    const h = el?.offsetHeight ?? 250;
    const flip = e.clientX > window.innerWidth * 0.55;
    m.tx = flip ? e.clientX - w - 36 : e.clientX + 36;
    // Sit above the pointer (over the rows already dimmed), or below it
    // when there is no room under the masthead.
    const above = e.clientY - h - 28;
    m.ty = above > 64 ? above : Math.min(window.innerHeight - h - 16, e.clientY + 28);
    if (!m.primed) {
      m.x = m.tx;
      m.y = m.ty;
      m.primed = true;
    }
  };

  const enter = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const m = motion.current;
    track(e);
    if (!m.on) {
      m.on = true;
      cancelAnimationFrame(m.raf);
      m.raf = requestAnimationFrame(loop);
    }
  };

  const leave = () => {
    motion.current.on = false;
    motion.current.primed = false;
    setActive(null);
  };

  /* Ink floods in from the edge the pointer crossed. */
  const rowEnter = (e: React.PointerEvent<HTMLLIElement>, slug: string) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.dataset.from = e.clientY < r.top + r.height / 2 ? "top" : "bottom";
    if (e.pointerType !== "touch") setActive(slug);
  };

  return (
    <div className="index-work" onPointerEnter={enter} onPointerMove={track} onPointerLeave={leave}>
      <div className="index-work-legend" aria-hidden>
        <span>No.</span>
        <span>Title</span>
        <span>Brief · Stack · Status</span>
      </div>
      <ol ref={listRef} className="index-rows">
        {showcase.map((p, i) => {
          const hide = HIDE_DETAILS.has(p.slug);
          const href = p.featured ? `#sheet-${p.slug}` : `/projects/${p.slug}`;
          const live = isLive(p);
          return (
            <li
              key={p.slug}
              data-row
              className={cn("index-row", active === p.slug && "is-active")}
              onPointerEnter={(e) => rowEnter(e, p.slug)}
              onPointerLeave={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.dataset.from = e.clientY < r.top + r.height / 2 ? "top" : "bottom";
              }}
            >
              <span className="index-row-no">{pad(i + 1)}</span>
              <div className="index-row-title">
                <span data-fit className="index-row-name">
                  {p.title}
                </span>
                {p.featured ? (
                  <a href={href} className="index-stretch">
                    <span className="index-sr">{p.title}: open the feature sheet</span>
                  </a>
                ) : (
                  <Link href={href} className="index-stretch">
                    <span className="index-sr">{p.title}: case study</span>
                  </Link>
                )}
              </div>
              <div className="index-row-meta">
                <p className="index-row-tag">{p.tagline}</p>
                {!hide && <p className="index-row-tech">{p.tech.join(" · ")}</p>}
                <p className="index-row-status">
                  {live ? (
                    <>
                      <i className="index-live-dot" aria-hidden /> Live
                    </>
                  ) : (
                    p.status
                  )}
                  {p.featured && <span className="index-row-feat">Feature {pad(i + 1)}</span>}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="index-row-link">
                      site<span aria-hidden> ↗</span>
                      <span className="index-sr"> for {p.title}</span>
                    </a>
                  )}
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" className="index-row-link">
                      repo<span aria-hidden> ↗</span>
                      <span className="index-sr"> for {p.title}</span>
                    </a>
                  )}
                </p>
              </div>
              <div className="index-row-thumb" aria-hidden>
                {p.slug === "exness" ? (
                  <TradingPlate compact />
                ) : (
                  <Image src={p.image} alt="" fill sizes="132px" className="index-cover" />
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div ref={floatRef} className={cn("index-float", active && "is-on")} aria-hidden>
        {showcase.map((p) => (
          <div key={p.slug} className={cn("index-float-img", active === p.slug && "is-on")}>
            {p.slug === "exness" ? (
              <TradingPlate />
            ) : (
              <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 30vw, 1px" className="index-cover" />
            )}
          </div>
        ))}
        <span className="index-float-cap">
          {showcase.find((p) => p.slug === active)?.title ?? ""}
        </span>
      </div>
    </div>
  );
}
