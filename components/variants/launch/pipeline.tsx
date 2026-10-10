"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

import type { Anatomy } from "@/data/projects";

const STEP_MS = 1500;

/* Five-stage anatomy as a beam: nodes on a rail, a light pulse travelling
   between them. Hover or focus a node to hold it there. */
export function Pipeline({ anatomy, delay = 0 }: { anatomy: Anatomy; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");
  const stages = anatomy.stages;
  const n = stages.length;

  const running = inView && held === null && !reduce;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(
      () => setStep((s) => (s + 1) % n),
      step === n - 1 ? STEP_MS * 1.6 : step === 0 ? STEP_MS + delay : STEP_MS
    );
    return () => clearTimeout(t);
  }, [running, step, n, delay]);

  const active = held ?? (reduce ? n - 1 : step);
  const pct = (active / (n - 1)) * 100;

  return (
    <div className="launch-pipe" ref={ref}>
      <div className="launch-pipe-head">
        <span>{anatomy.title.toLowerCase()}</span>
        <span aria-hidden>
          {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
      </div>
      <div className="launch-pipe-rail">
        <svg className="launch-pipe-svg" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id={`beam-${gid}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#ff7a3d" stopOpacity="0.15" />
              <stop offset="0.85" stopColor="#ff7a3d" stopOpacity="0.9" />
              <stop offset="1" stopColor="#ffe2c8" stopOpacity="1" />
            </linearGradient>
          </defs>
          <line x1="0" y1="1" x2="100" y2="1" stroke="rgba(255,255,255,0.12)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <line
            x1="0"
            y1="1"
            x2="100"
            y2="1"
            stroke={`url(#beam-${gid})`}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            style={{
              transformOrigin: "0 0",
              transform: `scaleX(${Math.max(pct, 0.001) / 100})`,
              transition: reduce ? "none" : "transform 1.1s cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          />
        </svg>
        {/* travelling pulse head */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateX(${pct}%)`,
            opacity: pct === 0 ? 0 : 1,
            transition: reduce
              ? "none"
              : "transform 1.1s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.3s ease",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: -40,
              top: "50%",
              width: 40,
              height: 2,
              marginTop: -1,
              background: "linear-gradient(90deg, transparent, #ffd2b0)",
              filter: "drop-shadow(0 0 6px #ff7a3d)",
              borderRadius: 2,
            }}
          />
        </div>
        <div className="launch-pipe-nodes">
          {stages.map((s, i) => (
            <button
              key={s.name}
              type="button"
              className="launch-node"
              data-state={i === active ? "active" : i < active ? "done" : "idle"}
              aria-label={`Stage ${i + 1}: ${s.name}, ${s.desc}`}
              aria-pressed={held === i}
              onPointerEnter={() => setHeld(i)}
              onPointerLeave={() => setHeld(null)}
              onFocus={() => setHeld(i)}
              onBlur={() => setHeld(null)}
              onClick={() => setHeld(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <ol className="launch-pipe-labels" aria-hidden>
        {stages.map((s, i) => (
          <li key={s.name} data-active={i === active}>
            {s.name}
          </li>
        ))}
      </ol>
      <p className="launch-pipe-caption">
        <b>{stages[active].name}</b>
        <span aria-hidden> · </span>
        {stages[active].desc}
      </p>
    </div>
  );
}
