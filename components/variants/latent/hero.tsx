"use client";

import { useEffect, useRef } from "react";

import { contributionStats, contributionsByRepo } from "@/data/open-source";
import { site } from "@/data/site";

import { LatentField } from "./latent-field";

const STEPS = 50;

export function LatentHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const sigmaRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLDivElement>(null);
  const localValRef = useRef<HTMLSpanElement>(null);
  const fieldRef = useRef<LatentField | null>(null);

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

    const writeStep = (step: number, sigma: number) => {
      if (stepRef.current) stepRef.current.textContent = String(step).padStart(2, "0");
      if (sigmaRef.current) sigmaRef.current.textContent = sigma.toFixed(3);
      barRef.current?.style.setProperty("--step", String(step));
    };

    const field = new LatentField(canvas, {
      text: "KRISHNA",
      fontFamily: family,
      fontWeight: 800,
      palette: [
        { color: "#f5f3ec", share: 0.8, size: small ? 1.5 : 1.7, alpha: 0.95 },
        { color: "#ffd65c", share: 0.11, size: small ? 1.8 : 2.2 },
        { color: "#ff9fc0", share: 0.09, size: small ? 1.8 : 2.2 },
      ],
      density: small ? 7 : 5.6,
      min: small ? 1800 : 2600,
      max: small ? 2600 : 8000,
      centerY: (w, h) => (w < 768 ? 0.3 : h < 760 ? 0.35 : 0.375),
      maxW: small ? 0.9 : 0.9,
      maxH: small ? 0.2 : 0.36,
      duration: 2800,
      steps: STEPS,
      brush: small ? 70 : 115,
      onStep: writeStep,
      onLocal: (x, y, sigma, on) => {
        const el = localRef.current;
        if (!el) return;
        el.style.transform = `translate3d(${x + 18}px, ${y + 14}px, 0)`;
        el.dataset.on = on ? "1" : "0";
        if (localValRef.current) localValRef.current.textContent = sigma.toFixed(2);
      },
    });
    fieldRef.current = field;

    const start = async () => {
      try {
        await document.fonts.load(`800 120px ${family}`);
      } catch {
        /* fall back to whatever is loaded */
      }
      if (disposed) return;
      field.layout();
      if (reduce) {
        field.still(1);
        writeStep(STEPS, 0);
      } else {
        field.resample();
      }
      section.dataset.ready = "1";
    };
    start();

    const io = new IntersectionObserver(
      ([entry]) => field.setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
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
        if (reduce) field.still(1);
        else field.still(field.tau);
      }, 120);
    });
    ro.observe(canvas);

    const local = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      field.pointer(clientX - r.left, clientY - r.top);
    };
    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      local(e.clientX, e.clientY);
    };
    const onTouch = (e: TouchEvent) => {
      if (reduce || !e.touches[0]) return;
      local(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onLeave = () => field.pointerLeave();
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerdown", onMove, { passive: true });
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
      section.removeEventListener("pointerdown", onMove);
      section.removeEventListener("touchmove", onTouch);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="latent-hero"
      aria-labelledby="latent-h1"
      data-nav-section
    >
      <div className="latent-hero-glow" aria-hidden>
        <i className="latent-glow-sun" />
        <i className="latent-glow-pink" />
      </div>
      <div className="latent-hero-grid" aria-hidden />
      <canvas
        ref={canvasRef}
        className="latent-hero-canvas"
        role="img"
        aria-label="The name KRISHNA, drawn by thousands of particles denoising out of Gaussian noise"
      />
      <div ref={localRef} className="latent-local" aria-hidden data-on="0">
        σ<sub>local</sub> <span ref={localValRef}>0.00</span>
      </div>

      <div className="latent-hero-copy">
        <div className="latent-hero-left">
          <a
            className="latent-sticker latent-sticker-sun"
            href={site.company.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="latent-dot" aria-hidden /> {site.role} @ {site.company.name}
          </a>
          <h1 id="latent-h1" className="latent-hero-h1">
            <span className="latent-sr">Krishna. </span>
            {site.headline}
          </h1>
        </div>
        <div className="latent-hero-right">
          <p className="latent-hero-sub">{site.subline}</p>
          <dl className="latent-stats">
            {site.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="latent-ctas">
            <a href="#map" className="latent-btn latent-btn-paper">
              Explore the map <span aria-hidden>↘</span>
            </a>
            <a href={`mailto:${site.email}`} className="latent-btn latent-btn-ghost">
              Email me
            </a>
          </div>
          <p className="latent-hero-proof latent-mono">
            + {contributionStats.merged} PRs merged upstream into{" "}
            <a href="#upstream">
              {contributionsByRepo
                .slice(0, 3)
                .map((r) => r.name)
                .join(", ")}{" "}
              and {contributionsByRepo.length - 3} more
            </a>
          </p>
        </div>
      </div>

      <div className="latent-hero-hud latent-mono">
        <div className="latent-hud-left">
          <div className="latent-readout">
            <span>
              step <b ref={stepRef}>00</b>/{STEPS}
            </span>
            <span>
              σ <b ref={sigmaRef}>1.000</b>
            </span>
          </div>
          <div ref={barRef} className="latent-ticks" aria-hidden style={{ ["--step" as string]: 0 }}>
            {Array.from({ length: STEPS }, (_, i) => (
              <i key={i} style={{ ["--i" as string]: i }} />
            ))}
          </div>
        </div>
        <div className="latent-hud-right">
          <button
            type="button"
            className="latent-resample"
            onClick={() => fieldRef.current?.resample()}
          >
            resample <span aria-hidden>↻</span>
          </button>
          <span className="latent-hint">move or drag over the name to add noise</span>
        </div>
      </div>

      <div className="latent-hero-axis latent-mono" aria-hidden>
        <span>x₀ ~ p(krishna)</span>
        <span>DDPM · cosine schedule · T = {STEPS}</span>
      </div>
    </section>
  );
}
