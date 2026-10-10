"use client";

import { useEffect, useRef } from "react";

import { contributionStats } from "@/data/open-source";
import { site } from "@/data/site";

import { LatentField } from "./latent-field";

/* Full-screen hero. The name forms out of particle noise once on load; moving
   the pointer over it scatters nearby particles a little and they settle back.
   No labels, no cursor change. */
export function LatentHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let disposed = false;

    const family =
      getComputedStyle(canvas).getPropertyValue("--font-bricolage").trim() ||
      "system-ui, sans-serif";

    const field = new LatentField(canvas, {
      text: "KRISHNA",
      fontFamily: family,
      fontWeight: 800,
      palette: [
        { color: "#f5f3ec", share: 0.8, size: small ? 1.5 : 1.7, alpha: 0.96 },
        { color: "#b9b6ad", share: 0.12, size: small ? 1.6 : 1.9 },
        { color: "#6f6d67", share: 0.08, size: small ? 1.6 : 2 },
      ],
      density: small ? 7 : 5.6,
      min: small ? 1800 : 2600,
      max: small ? 2600 : 8000,
      centerY: (w, h) => (w < 768 ? 0.27 : h < 760 ? 0.32 : 0.35),
      maxW: 0.9,
      maxH: small ? 0.2 : 0.36,
      duration: 2800,
      brush: small ? 60 : 95,
    });

    const start = async () => {
      try {
        await document.fonts.load(`800 120px ${family}`);
      } catch {
        /* fall back to whatever is loaded */
      }
      if (disposed) return;
      field.layout();
      if (reduce) field.still(1);
      else field.resample();
    };
    start();

    const io = new IntersectionObserver(([entry]) => field.setVisible(entry.isIntersecting));
    io.observe(section);
    const onVis = () => field.setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);

    let resizeTimer = 0;
    let lastW = canvas.clientWidth;
    const ro = new ResizeObserver(() => {
      // Ignore height-only changes (mobile URL bar) to avoid re-sampling.
      if (Math.abs(canvas.clientWidth - lastW) < 2 && canvas.width > 0) return;
      lastW = canvas.clientWidth;
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        field.layout();
        field.still(reduce ? 1 : field.tau);
      }, 120);
    });
    ro.observe(canvas);

    const local = (x: number, y: number) => {
      const r = canvas.getBoundingClientRect();
      field.pointer(x - r.left, y - r.top);
    };
    const onMove = (e: PointerEvent) => {
      if (!reduce) local(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      if (!reduce && e.touches[0]) local(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => field.pointerLeave();
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("touchmove", onTouch, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("touchend", onLeave);

    return () => {
      disposed = true;
      field.destroy();
      io.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVis);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("touchmove", onTouch);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("touchend", onLeave);
    };
  }, []);

  const stats = [
    site.stats[0],
    site.stats[1],
    { value: String(contributionStats.merged), label: "PRs merged upstream" },
  ];

  return (
    <section ref={sectionRef} className="latent-hero" aria-labelledby="latent-h1" data-nav-section>
      <div className="latent-hero-grid" aria-hidden />
      <canvas
        ref={canvasRef}
        className="latent-hero-canvas"
        role="img"
        aria-label="The name KRISHNA, drawn in particles"
      />

      <div className="latent-hero-copy">
        <div className="latent-hero-left">
          <a className="latent-pill" href={site.company.href} target="_blank" rel="noreferrer">
            <span className="latent-pill-dot" aria-hidden />
            {site.role} at {site.company.name}
          </a>
          <h1 id="latent-h1" className="latent-hero-h1">
            <span className="latent-sr">Krishna. </span>
            {site.headline}
          </h1>
        </div>
        <div className="latent-hero-right">
          <p className="latent-hero-sub">{site.subline}</p>
          <dl className="latent-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="latent-ctas">
            <a href="#work" className="latent-btn latent-btn-solid">
              See the work <span aria-hidden>↓</span>
            </a>
            <a href={`mailto:${site.email}`} className="latent-btn latent-btn-ghost">
              Email me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
