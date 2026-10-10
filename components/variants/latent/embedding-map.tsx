"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";

import {
  CLUSTER_ORDER,
  CLUSTERS,
  DUST,
  NEIGHBOURS,
  POINT_BY_ID,
  POINTS,
  clusterOf,
  type ClusterId,
  type MapPoint,
} from "./map-data";
import { PointDetail } from "./point-detail";

const H = 68; // plane height in units (width is 100)

export function EmbeddingMap() {
  const [selected, setSelected] = useState("code-boss");
  const [hover, setHover] = useState<string | null>(null);
  const [focusCluster, setFocusCluster] = useState<ClusterId | null>(null);
  const reduce = useReducedMotion();
  const btns = useRef<Record<string, HTMLButtonElement | null>>({});

  const sel = POINT_BY_ID[selected];
  const active = hover ?? selected;
  const nn = NEIGHBOURS[active];
  const lit = new Set([active, ...nn.map((n) => n.id)]);
  const selNn = NEIGHBOURS[selected];

  const dimmed = (p: MapPoint) =>
    focusCluster ? !clusterOf(p).includes(focusCluster) : false;

  const pick = (id: string) => {
    setSelected(id);
    btns.current[id]?.focus({ preventScroll: true });
  };

  // Arrow keys hop to the nearest point in that direction.
  const onKey = (e: KeyboardEvent) => {
    const dirs: Record<string, [number, number]> = {
      ArrowRight: [1, 0],
      ArrowLeft: [-1, 0],
      ArrowDown: [0, 1],
      ArrowUp: [0, -1],
    };
    const d = dirs[e.key];
    if (!d) return;
    e.preventDefault();
    const from = POINT_BY_ID[selected];
    let best: MapPoint | null = null;
    let bestScore = Infinity;
    for (const p of POINTS) {
      if (p.id === from.id) continue;
      const dx = p.x - from.x;
      const dy = p.y - from.y;
      const along = dx * d[0] + dy * d[1];
      if (along <= 0.5) continue;
      const across = Math.abs(dx * d[1] - dy * d[0]);
      const score = along + across * 2.2;
      if (score < bestScore) {
        bestScore = score;
        best = p;
      }
    }
    if (best) pick(best.id);
  };


  return (
    <section id="work" className="latent-map-sec" aria-labelledby="latent-map-h" data-nav-section>
      <div className="latent-wrap">
        <header className="latent-sec-head latent-sec-head-row" data-reveal>
          <div>
          <p className="latent-eyebrow latent-mono">Work</p>
          <h2 id="latent-map-h" className="latent-h2">
            Everything I&apos;ve built, in one map.
          </h2>
          </div>
          <div className="latent-map-side">
          <p className="latent-lede">
            Seven products, three roles and six open-source projects, grouped by what they have in
            common. Select any point to see what sits closest to it.
          </p>
          <div className="latent-legend" role="group" aria-label="Highlight a cluster">
            {CLUSTER_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={focusCluster === id}
                className="latent-legend-chip"
                onClick={() => setFocusCluster((c) => (c === id ? null : id))}
              >
                {CLUSTERS[id].label}
              </button>
            ))}
          </div>
          </div>
        </header>

        <div className="latent-map-grid">
          <div className="latent-map-col">
            <div
              className="latent-map"
              onKeyDown={onKey}
              role="group"
              aria-label="Map of projects, roles and open-source projects. Use arrow keys to move between points."
            >
              <svg viewBox={`0 0 100 ${H}`} aria-hidden className="latent-map-svg">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => (
                  <line key={`x${x}`} x1={x} x2={x} y1={0} y2={H} className="latent-grid-line" />
                ))}
                {[10, 20, 30, 40, 50, 60].map((y) => (
                  <line key={`y${y}`} x1={0} x2={100} y1={y} y2={y} className="latent-grid-line" />
                ))}
                <line x1={50} x2={50} y1={0} y2={H} className="latent-axis-line" />
                <line x1={0} x2={100} y1={34} y2={34} className="latent-axis-line" />
                {CLUSTER_ORDER.map((id) => {
                  const c = CLUSTERS[id];
                  return (
                    <g
                      key={id}
                      className="latent-cluster"
                      data-dim={focusCluster && focusCluster !== id ? "1" : "0"}
                    >
                      <ellipse cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} className="latent-cluster-fill" />
                      <ellipse cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} className="latent-cluster-ring" />
                    </g>
                  );
                })}
                {DUST.map((d, i) => (
                  <circle
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={d.r * 0.55}
                    className="latent-dust"
                    data-dim={focusCluster && focusCluster !== d.c ? "1" : "0"}
                  />
                ))}
                {/* nearest-neighbour edges for the selection (solid) */}
                {selNn.map((n) => {
                  const q = POINT_BY_ID[n.id];
                  return (
                    <line
                      key={`s-${selected}-${n.id}`}
                      x1={sel.x}
                      y1={sel.y}
                      x2={q.x}
                      y2={q.y}
                      pathLength={1}
                      className="latent-edge"
                      style={{ strokeWidth: 0.15 + n.sim * 0.45 }}
                    />
                  );
                })}
                {/* and for whatever is hovered (dashed) */}
                {hover &&
                  hover !== selected &&
                  NEIGHBOURS[hover].map((n) => {
                    const p = POINT_BY_ID[hover];
                    const q = POINT_BY_ID[n.id];
                    return (
                      <line
                        key={`h-${hover}-${n.id}`}
                        x1={p.x}
                        y1={p.y}
                        x2={q.x}
                        y2={q.y}
                        className="latent-edge-hover"
                      />
                    );
                  })}
              </svg>

              {CLUSTER_ORDER.map((id) => {
                const c = CLUSTERS[id];
                return (
                  <span
                    key={id}
                    aria-hidden
                    className="latent-cluster-label latent-mono"
                    style={{ left: `${c.x}%`, top: `${((c.y - c.ry - 2.4) / H) * 100}%` }}
                  >
                    {c.label}
                  </span>
                );
              })}

              {POINTS.map((p) => {
                const isSel = p.id === selected;
                const labelLeft = p.x > 74;
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      btns.current[p.id] = el;
                    }}
                    type="button"
                    className={`latent-pt latent-pt-${p.kind}`}
                    data-lit={lit.has(p.id) ? "1" : "0"}
                    data-dim={dimmed(p) ? "1" : "0"}
                    data-left={labelLeft ? "1" : "0"}
                    aria-pressed={isSel}
                    tabIndex={isSel ? 0 : -1}
                    style={{
                      left: `${p.x}%`,
                      top: `${(p.y / H) * 100}%`,
                      ["--s" as string]: p.kind === "oss" ? `${9 + p.repo.prs.length * 1.5}px` : undefined,
                    }}
                    onClick={() => setSelected(p.id)}
                    onPointerEnter={() => setHover(p.id)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setSelected(p.id)}
                  >
                    <i aria-hidden />
                    <span>
                      {p.label}
                      {p.kind === "oss" && <small className="latent-pt-count">{p.repo.prs.length}</small>}
                    </span>
                  </button>
                );
              })}

            </div>
            <p className="latent-footnote latent-mono">
              Bigger open-source points mean more merged pull requests. Arrow keys move between
              points.
            </p>
          </div>

          <aside className="latent-card" aria-live="polite" aria-label="Selected point">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <PointDetail point={sel} onPick={pick} />
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>

        {/* Mobile: the same space, flattened into a list grouped by cluster. */}
        <div className="latent-map-list">
          {CLUSTER_ORDER.map((id) => {
            const items = POINTS.filter((p) => p.kind !== "role" && p.cluster === id);
            return (
              <div key={id} className="latent-list-group">
                <h3 className="latent-list-h">{CLUSTERS[id].label}</h3>
                {items.map((p) => (
                  <ListItem key={p.id} point={p} />
                ))}
              </div>
            );
          })}
          <div className="latent-list-group">
            <h3 className="latent-list-h">Roles</h3>
            {POINTS.filter((p) => p.kind === "role").map((p) => (
              <ListItem key={p.id} point={p} />
            ))}
          </div>
          <p className="latent-footnote latent-mono">
            Grouped by the kind of problem each one solves.
          </p>
        </div>
      </div>
    </section>
  );
}

function ListItem({ point }: { point: MapPoint }) {
  return (
    <details className="latent-li" name="latent-map-list">
      <summary>
        <span className="latent-li-title">{point.label}</span>
        <span className="latent-li-sub">
          {point.kind === "project"
            ? point.project.tagline
            : point.kind === "role"
              ? `${point.role.role} · ${point.role.start} – ${point.role.end}`
              : `${point.repo.prs.length} merged ${point.repo.prs.length === 1 ? "PR" : "PRs"} · ${point.repo.description}`}
        </span>
        <span className="latent-li-plus" aria-hidden>+</span>
      </summary>
      <PointDetail point={point} compact />
    </details>
  );
}
