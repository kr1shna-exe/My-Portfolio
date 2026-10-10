"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { anatomies } from "@/data/projects";
import { featured, type ShowcaseProject } from "@/data/site";

// Track geometry in vw: intro + 3 panels + outro. Distance travelled = TOTAL - 100.
const INTRO = 56;
const PANEL = 100;
const OUTRO = 44;
const TOTAL = INTRO + PANEL * featured.length + OUTRO;
const TRAVEL = TOTAL - 100;

// The track moves, then rests on each panel while its layers light up, so the
// "forward pass" happens while the panel is still. Weights are scroll lengths.
const MOVE = 1;
const REST = 1.5;
const segs: { kind: "move" | "rest"; w: number; to: number; panel?: number }[] = [];
featured.forEach((_, i) => {
  segs.push({ kind: "move", w: MOVE, to: INTRO + PANEL * i });
  segs.push({ kind: "rest", w: REST, to: INTRO + PANEL * i, panel: i });
});
segs.push({ kind: "move", w: MOVE * 0.55, to: TRAVEL });
const UNITS = segs.reduce((a, s) => a + s.w, 0);
const X_IN: number[] = [0];
const X_OUT: string[] = ["0vw"];
const REST_AT: [number, number][] = [];
{
  let acc = 0;
  for (const s of segs) {
    const start = acc / UNITS;
    acc += s.w;
    const end = acc / UNITS;
    X_IN.push(end);
    X_OUT.push(`-${s.to}vw`);
    if (s.kind === "rest") REST_AT.push([start, end]);
  }
}
/** Section height: one screen to pin, plus ~62vh of scroll per weight unit. */
const SECTION_VH = 100 + UNITS * 62;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const LAYERS = [3, 4, 5, 4, 2];
const STACKED = "(max-width: 899px), (prefers-reduced-motion: reduce)";
const COL_X = (i: number) => 100 + i * 200;
const NODE_Y = (n: number, j: number) => 85 + (j - (n - 1) / 2) * 34;

export function ForwardPass() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, X_IN, X_OUT, { ease: easeInOut });
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="forward-pass"
      className="latent-fp"
      aria-labelledby="latent-fp-h"
      style={{ ["--fp-h" as string]: `${SECTION_VH}vh` }}
      data-nav-section
    >
      <div className="latent-fp-sticky">
        <motion.div className="latent-fp-track" style={{ x }}>
          <div className="latent-fp-intro" style={{ ["--w" as string]: `${INTRO}vw` }}>
            <p className="latent-eyebrow latent-mono">
              <span>02</span> featured work
            </p>
            <h2 id="latent-fp-h" className="latent-h2 latent-h2-xl">
              A forward pass through <em>three</em> builds.
            </h2>
            <p className="latent-lede">
              Each one is five layers, from input to output. Keep scrolling and watch the
              activations move through.
            </p>
            <p className="latent-fp-hint latent-mono" aria-hidden>
              scroll <span>→ → →</span>
            </p>
          </div>
          {featured.map((p, i) => (
            <Panel key={p.slug} project={p} index={i} progress={scrollYProgress} />
          ))}
          <div className="latent-fp-outro" style={{ ["--w" as string]: `${OUTRO}vw` }}>
            <p className="latent-mono latent-fp-out-k">output</p>
            <p className="latent-fp-out">shipped.</p>
            <a href="#more" className="latent-btn latent-btn-sun">
              More samples <span aria-hidden>↓</span>
            </a>
          </div>
        </motion.div>
        <div className="latent-fp-progress" aria-hidden>
          <motion.i style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}

function Panel({
  project,
  index,
  progress,
}: {
  project: ShowcaseProject;
  index: number;
  progress: MotionValue<number>;
}) {
  const ref = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const anatomy = anatomies[project.slug];
  // Desktop: activation runs while the track rests on this panel.
  const [r0, r1] = REST_AT[index];
  const pd = useTransform(progress, [r0 - (r1 - r0) * 0.15, r0 + (r1 - r0) * 0.8], [0, 1]);
  // Mobile / stacked: progress of this panel through the viewport.
  const { scrollYProgress: local } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.75"],
  });
  const pm = useTransform(local, (v) => Math.min(1, Math.max(0, v * 1.15)));

  const write = (v: number) => {
    if (!readout.current) return;
    const layer = Math.min(5, Math.floor(v * 5.5));
    readout.current.textContent =
      layer === 0 ? "layer 0/5 · waiting for input" : `layer ${layer}/5 · ${layer === 5 ? "output ready" : "activating"}`;
  };
  useMotionValueEvent(pd, "change", (v) => {
    if (!window.matchMedia(STACKED).matches) write(v);
  });
  useMotionValueEvent(pm, "change", (v) => {
    if (window.matchMedia(STACKED).matches) write(v);
  });
  return (
    <motion.article
      ref={ref}
      className="latent-fp-panel"
      aria-labelledby={`latent-fp-${project.slug}`}
      style={{ ["--pd" as string]: pd, ["--pm" as string]: pm, ["--w" as string]: `${PANEL}vw` }}
    >
      <div className="latent-fp-top">
        <div className="latent-fp-copy">
          <p className="latent-mono latent-fp-k">
            <span>02.{index + 1}</span> {anatomy.title.toLowerCase()}
          </p>
          <h3 id={`latent-fp-${project.slug}`} className="latent-fp-title">
            {project.title}
          </h3>
          <p className="latent-fp-tag">{project.tagline}</p>
          <ul className="latent-chips latent-chips-dark" aria-label="Stack">
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="latent-fp-links">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="latent-btn latent-btn-paper latent-btn-sm">
                Live ↗
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer" className="latent-btn latent-btn-ghost latent-btn-sm">
                Code ↗
              </a>
            )}
            <Link href={`/projects/${project.slug}`} className="latent-btn latent-btn-ghost latent-btn-sm">
              Case study →
            </Link>
          </div>
        </div>
        <div className="latent-fp-shot">
          <Image
            src={project.image}
            alt={`${project.title} landing page`}
            width={1512}
            height={945}
            sizes="(max-width: 899px) 92vw, 38vw"
          />
        </div>
      </div>

      <div className="latent-net">
        <svg viewBox="0 0 1000 170" preserveAspectRatio="xMidYMid meet" className="latent-net-svg" aria-hidden>
          {LAYERS.slice(0, -1).map((n, i) => {
            const m = LAYERS[i + 1];
            return (
              <g key={`e${i}`} className="latent-net-edges" style={{ ["--i" as string]: i + 1 }}>
                {Array.from({ length: n }, (_, a) =>
                  Array.from({ length: m }, (_, b) => (
                    <line
                      key={`${a}-${b}`}
                      x1={COL_X(i)}
                      y1={NODE_Y(n, a)}
                      x2={COL_X(i + 1)}
                      y2={NODE_Y(m, b)}
                    />
                  ))
                )}
                {Array.from({ length: Math.min(n, m) }, (_, a) => (
                  <line
                    key={`p${a}`}
                    className="latent-net-pulse"
                    pathLength={1}
                    x1={COL_X(i)}
                    y1={NODE_Y(n, a)}
                    x2={COL_X(i + 1)}
                    y2={NODE_Y(m, (a * 2 + i) % m)}
                    style={{ animationDelay: `${-a * 0.37}s` }}
                  />
                ))}
              </g>
            );
          })}
          {LAYERS.map((n, i) => (
            <g key={`l${i}`} className="latent-net-layer" style={{ ["--i" as string]: i }}>
              {Array.from({ length: n }, (_, j) => (
                <g key={j}>
                  <circle className="latent-net-halo" cx={COL_X(i)} cy={NODE_Y(n, j)} r={17} />
                  <circle className="latent-net-node" cx={COL_X(i)} cy={NODE_Y(n, j)} r={8} />
                </g>
              ))}
            </g>
          ))}
        </svg>
        <ol className="latent-stages">
          {anatomy.stages.map((s, i) => (
            <li key={s.name} style={{ ["--i" as string]: i }}>
              <span className="latent-mono latent-stage-n">L{i + 1}</span>
              <b>{s.name}</b>
              <span className="latent-stage-d">{s.desc}</span>
            </li>
          ))}
        </ol>
        <p className="latent-mono latent-fp-readout" aria-hidden>
          <span ref={readout}>layer 0/5 · waiting for input</span>
        </p>
      </div>
    </motion.article>
  );
}
