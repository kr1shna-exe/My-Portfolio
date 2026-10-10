import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { moreWork } from "@/data/site";

import { GitHubIcon } from "./icons";
import { Reveal } from "./reveal";
import { SpotlightGrid } from "./spotlight";

/* Trading Platform has no screenshot: a drawn candlestick chart instead. */
function CandlePlaceholder() {
  const candles = [
    [40, 62, 46, 58],
    [52, 70, 56, 66],
    [48, 66, 64, 52],
    [44, 58, 50, 54],
    [50, 74, 54, 70],
    [62, 82, 66, 78],
    [58, 80, 76, 62],
    [54, 70, 60, 66],
    [60, 88, 64, 84],
    [70, 94, 80, 90],
    [72, 92, 88, 76],
    [74, 98, 78, 94],
  ];
  return (
    <div className="launch-placeholder" aria-hidden>
      <span className="launch-placeholder-label">BTC/USD · 1h · preview</span>
      <svg viewBox="0 0 240 100" preserveAspectRatio="none">
        {[20, 45, 70].map((y) => (
          <line key={y} x1="0" x2="240" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
        ))}
        {candles.map(([lo, hi, open, close], i) => {
          const x = 10 + i * 19.5;
          const up = close >= open;
          const c = up ? "#3fb950" : "#f85149";
          const top = 100 - Math.max(open, close);
          const h = Math.max(2, Math.abs(close - open));
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={100 - hi} y2={100 - lo} stroke={c} strokeWidth="1" opacity="0.8" />
              <rect x={x - 4} y={top} width="8" height={h} rx="1" fill={c} opacity={up ? 0.85 : 0.7} />
            </g>
          );
        })}
        <polyline
          fill="none"
          stroke="#ff7a3d"
          strokeWidth="1.2"
          opacity="0.8"
          points={candles.map(([, , o, c], i) => `${10 + i * 19.5},${100 - (o + c) / 2}`).join(" ")}
        />
      </svg>
    </div>
  );
}

function host(url?: string) {
  return url ? url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";
}

export function MoreWork() {
  return (
    <section id="more" className="launch-section" aria-labelledby="launch-more-h">
      <div className="launch-wrap">
        <Reveal className="launch-head">
          <span className="launch-eyebrow">03 · More work</span>
          <h2 id="launch-more-h" className="launch-h2">
            Four more, same standard.
          </h2>
        </Reveal>

        <SpotlightGrid as="ul" className="launch-more">
          {moreWork.map((p, i) => {
            const isTwisense = p.slug === "twisense";
            const hasShot = !p.image.startsWith("/placeholders");
            return (
              <Reveal
                as="li"
                key={p.slug}
                delay={i * 0.06}
                className="launch-card launch-spot launch-mini"
              >
                <div className="launch-mini-media">
                  {hasShot ? (
                    <Image
                      src={p.image}
                      alt={`${p.title} landing page`}
                      fill
                      sizes="(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 290px"
                    />
                  ) : (
                    <CandlePlaceholder />
                  )}
                </div>
                <div className="launch-mini-body">
                  <h3 className="launch-mini-title">
                    {p.title}
                    {p.liveUrl ? (
                      <span className="launch-chip is-live">Live</span>
                    ) : (
                      <span className="launch-chip">Source</span>
                    )}
                  </h3>
                  <p className="launch-mini-tag">{p.tagline}</p>
                  <div className="launch-mini-links">
                    {p.liveUrl ? (
                      <a
                        className="launch-linkpill"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${p.title} live site, ${host(p.liveUrl)}`}
                      >
                        Visit
                        <ArrowUpRight size={13} aria-hidden />
                      </a>
                    ) : null}
                    {p.repo ? (
                      <a
                        className="launch-linkpill"
                        href={p.repo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${p.title} source on GitHub`}
                      >
                        <GitHubIcon size={13} />
                        Code
                      </a>
                    ) : null}
                    {!isTwisense ? (
                      <Link
                        className="launch-linkpill"
                        href={`/projects/${p.slug}`}
                        aria-label={`${p.title} case study`}
                      >
                        Details
                      </Link>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </SpotlightGrid>
      </div>
    </section>
  );
}
