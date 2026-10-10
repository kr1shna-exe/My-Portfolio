"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const STICKERS: { t: string; tone: string; x: number; y: number; r: number; big?: boolean }[] = [
  { t: "agents that review PRs", tone: "cobalt", x: 4, y: 4, r: -6 },
  { t: "research papers", tone: "paper", x: 48, y: 16, r: 7 },
  { t: "memory that remembers how you think", tone: "pink", x: 8, y: 28, r: 4 },
  { t: "Figma → shipping code", tone: "sun", x: 4, y: 46, r: 3 },
  { t: "films", tone: "ink", x: 58, y: 42, r: -8, big: true },
  { t: "100% open source", tone: "lilac", x: 4, y: 64, r: -4 },
  { t: "anime", tone: "pink", x: 52, y: 62, r: -3, big: true },
  { t: "read the code before the pitch", tone: "mint", x: 22, y: 82, r: 2 },
];

export function Stickers() {
  const board = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  return (
    <div className="latent-stickers" ref={board}>
      <p className="latent-mono latent-stickers-hint" aria-hidden>
        ↖ drag the stickers
      </p>
      <ul aria-label="Things I care about">
        {STICKERS.map((s) => (
          <motion.li
            key={s.t}
            className={`latent-stk latent-stk-${s.tone}${s.big ? " latent-stk-big" : ""}`}
            style={{ left: `${s.x}%`, top: `${s.y}%`, rotate: s.r }}
            drag
            dragConstraints={board}
            dragElastic={0.18}
            dragMomentum={!reduce}
            whileHover={reduce ? undefined : { scale: 1.06, rotate: s.r * -0.5 }}
            whileDrag={{ scale: 1.12, rotate: 0, zIndex: 5 }}
          >
            {s.t}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
