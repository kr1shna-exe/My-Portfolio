import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { moreWork } from "@/data/site";

import { PROJECT_COLOR, host } from "./meta";

/* Twisense's stored description and stack are copied from another project,
   so only its title, tagline and image are shown. */
const HIDE_STACK = new Set(["twisense"]);

// Deterministic candles for the Trading Platform placeholder (no screenshot).
const CANDLES = [
  [52, 60, 44, 58], [58, 66, 55, 63], [63, 64, 50, 53], [53, 57, 46, 55], [55, 70, 54, 68],
  [68, 74, 62, 64], [64, 66, 56, 59], [59, 72, 58, 71], [71, 80, 69, 77], [77, 78, 66, 69],
  [69, 75, 64, 73], [73, 86, 72, 84], [84, 88, 75, 78], [78, 82, 70, 80], [80, 92, 79, 90],
  [90, 93, 81, 83], [83, 89, 80, 87], [87, 97, 85, 95],
];

function TradingPlaceholder() {
  const w = 320;
  const h = 200;
  const cw = w / CANDLES.length;
  const y = (v: number) => h - ((v - 40) / 60) * (h - 30) - 10;
  return (
    <div className="trace-more-ph" aria-hidden>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} className="trace-ph-grid" />
        ))}
        {CANDLES.map(([o, hi, lo, c], i) => {
          const up = c >= o;
          const x = i * cw + cw / 2;
          return (
            <g key={i} className={up ? "trace-ph-up" : "trace-ph-down"}>
              <line x1={x} x2={x} y1={y(hi)} y2={y(lo)} />
              <rect x={x - cw * 0.3} width={cw * 0.6} y={y(Math.max(o, c))} height={Math.max(2, Math.abs(y(o) - y(c)))} rx="1" />
            </g>
          );
        })}
      </svg>
      <span className="trace-ph-label">no screenshot · source only</span>
    </div>
  );
}

export function MoreWork() {
  return (
    <ul className="trace-more">
      {moreWork.map((p, i) => {
        const live = Boolean(p.liveUrl);
        const isPlaceholder = !p.image.endsWith(".png");
        return (
          <li key={p.slug} className="trace-more-card">
            <div className="trace-more-top">
              <span className="trace-more-id trace-num">child.{String(i + 1).padStart(2, "0")}</span>
              <span className={`trace-more-status ${live ? "is-live" : ""}`}>
                <i className="trace-dot" aria-hidden />
                {live ? "live" : "repo"}
              </span>
            </div>
            <div className="trace-more-shot">
              {isPlaceholder ? (
                <TradingPlaceholder />
              ) : (
                <Image
                  src={p.image}
                  alt={`${p.title} landing page`}
                  fill
                  sizes="(min-width: 1280px) 330px, (min-width: 700px) 45vw, 100vw"
                />
              )}
            </div>
            <div className="trace-more-body">
              <h3 className="trace-more-title">
                <i className="trace-sq" style={{ background: PROJECT_COLOR[p.slug] }} aria-hidden />
                {p.title}
              </h3>
              <p className="trace-more-tag">{p.tagline}</p>
              {!HIDE_STACK.has(p.slug) && (
                <p className="trace-more-stack">{p.tech.join(" · ")}</p>
              )}
            </div>
            <div className="trace-more-links">
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noreferrer" className="trace-link">
                  {host(p.liveUrl)} <ArrowUpRight size={13} aria-hidden />
                </a>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="trace-link trace-link-dim">
                  source <ArrowUpRight size={13} aria-hidden />
                  <span className="trace-sr"> for {p.title}</span>
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
