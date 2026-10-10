"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";

import { site } from "@/data/site";

import { LatentField } from "./latent-field";

export function LatentFooter() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<LatentField | null>(null);
  const state = useRef({ progress: 0, leaving: false, reduce: false });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  const apply = () => {
    const f = fieldRef.current;
    const s = state.current;
    if (!f || s.reduce) return;
    f.follow(s.leaving ? 0 : Math.min(1, s.progress * 1.25));
  };

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    state.current.progress = v;
    apply();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = ref.current;
    if (!canvas || !section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    state.current.reduce = reduce;
    const family =
      getComputedStyle(canvas).getPropertyValue("--font-bricolage").trim() || "system-ui";
    const field = new LatentField(canvas, {
      text: "KRISHNA",
      fontFamily: family,
      palette: [
        { color: "#f5f3ec", share: 0.62, size: small ? 1.3 : 1.6, alpha: 0.9 },
        { color: "#8f8c85", share: 0.26, size: small ? 1.4 : 1.8 },
        { color: "#4a4844", share: 0.12, size: small ? 1.6 : 2 },
      ],
      density: small ? 9 : 6,
      min: 1400,
      max: small ? 2000 : 5200,
      centerY: () => 0.5,
      maxW: 0.94,
      maxH: 0.82,
      brush: small ? 60 : 100,
    });
    fieldRef.current = field;
    let disposed = false;

    (async () => {
      try {
        await document.fonts.load(`800 120px ${family}`);
      } catch {
        /* ignore */
      }
      if (disposed) return;
      field.layout();
      if (reduce) {
        field.still(1);
      } else {
        field.still(0);
        field.tau = 0;
        apply();
      }
    })();

    const io = new IntersectionObserver(([e]) => field.setVisible(e.isIntersecting));
    io.observe(canvas);
    const onVis = () => field.setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const leave = () => {
      state.current.leaving = true;
      apply();
    };
    const enter = () => {
      state.current.leaving = false;
      apply();
    };
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    const move = (e: PointerEvent) => {
      if (reduce) return;
      const r = canvas.getBoundingClientRect();
      field.pointer(e.clientX - r.left, e.clientY - r.top);
    };
    canvas.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerleave", () => field.pointerLeave());

    let lastW = canvas.clientWidth;
    let t = 0;
    const ro = new ResizeObserver(() => {
      if (Math.abs(canvas.clientWidth - lastW) < 2) return;
      lastW = canvas.clientWidth;
      clearTimeout(t);
      t = window.setTimeout(() => {
        field.layout();
        field.still(field.tau);
      }, 150);
    });
    ro.observe(canvas);

    return () => {
      disposed = true;
      field.destroy();
      io.disconnect();
      ro.disconnect();
      clearTimeout(t);
      document.removeEventListener("visibilitychange", onVis);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      canvas.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <footer ref={ref} id="contact" className="latent-foot" aria-labelledby="latent-foot-h" data-nav-section>
      <div className="latent-wrap latent-foot-grid">
        <div>
          <p className="latent-eyebrow latent-mono">Contact</p>
          <h2 id="latent-foot-h" className="latent-h2 latent-foot-h">
            Get in touch.
          </h2>
        </div>
        <div className="latent-foot-side">
          <a className="latent-foot-mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <ul className="latent-foot-socials" aria-label="Elsewhere">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="latent-link-pill">
                  {s.label} <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="latent-foot-canvas-wrap">
        <canvas ref={canvasRef} className="latent-foot-canvas" role="img" aria-label="The name KRISHNA, drawn in particles" />
      </div>
      <div className="latent-wrap latent-foot-bottom latent-mono">
        <span>
          Krishna · {site.role} at {site.company.name}
        </span>
        <span>Updated {site.updated}</span>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  );
}
