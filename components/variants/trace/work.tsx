"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, GitBranch } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { anatomies } from "@/data/projects";
import { featured, moreWork } from "@/data/site";

import { PROJECT_COLOR, host } from "./meta";

type Lane = { label: string; s: number; e: number };
type Stage = { s: number; e: number; lanes?: Lane[] };

/* Span placement is illustrative: it encodes order, overlap and fan-out from
   each product's architecture, not measured latency. */
const fan = (label: string, n: number, s: number, e: number): Lane[] =>
  Array.from({ length: n }, (_, j) => ({
    label: `${label} ${j + 1}`,
    s: s + j * 1.5,
    e: e - ((n - 1 - j) * 3 + (j % 2) * 4),
  }));

const LAYOUT: Record<string, Stage[]> = {
  "code-boss": [
    { s: 0, e: 9 },
    { s: 9, e: 27 },
    { s: 22, e: 46 },
    { s: 46, e: 86, lanes: fan("reviewer", 3, 46, 86) },
    { s: 86, e: 100 },
  ],
  memora: [
    { s: 0, e: 8 },
    { s: 8, e: 24 },
    { s: 24, e: 47 },
    {
      s: 47,
      e: 80,
      lanes: [
        { label: "episodic", s: 47, e: 72 },
        { label: "semantic", s: 48, e: 80 },
        { label: "procedural", s: 49, e: 68 },
      ],
    },
    { s: 80, e: 100 },
  ],
  vision2react: [
    { s: 0, e: 8 },
    { s: 8, e: 29 },
    { s: 29, e: 77, lanes: fan("frame worker", 4, 29, 77) },
    { s: 77, e: 92 },
    { s: 92, e: 100 },
  ],
};

const TICKS = [0, 25, 50, 75, 100];

export function Work() {
  const [sel, setSel] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  const p = featured[sel];
  const anatomy = anatomies[p.slug];
  const layout = LAYOUT[p.slug];
  const color = PROJECT_COLOR[p.slug];

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = featured.length;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setSel(next);
    setHover(null);
    tabs.current[next]?.focus();
  };

  return (
    <div className="trace-work">
      <aside className="trace-tree" aria-label="Trace tree">
        <div className="trace-tree-head">
          <span>trace tree</span>
          <span className="trace-num">{featured.length} roots</span>
        </div>
        <div role="tablist" aria-label="Featured projects" aria-orientation="vertical" className="trace-tree-list">
          {featured.map((f, i) => {
            const selected = i === sel;
            return (
              <div key={f.slug} className="trace-tree-node">
                <button
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`trace-tab-${f.slug}`}
                  aria-selected={selected}
                  aria-controls="trace-work-panel"
                  tabIndex={selected ? 0 : -1}
                  className="trace-tree-tab"
                  onClick={() => {
                    setSel(i);
                    setHover(null);
                  }}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <i className="trace-sq" style={{ background: PROJECT_COLOR[f.slug] }} aria-hidden />
                  <span className="trace-tree-title">{f.title}</span>
                  <small className="trace-num">{anatomies[f.slug].stages.length} spans</small>
                </button>
                {selected && (
                  <ul className="trace-tree-kids" aria-hidden>
                    {anatomies[f.slug].stages.map((s, k) => (
                      <li
                        key={s.name}
                        className={hover === k ? "is-hot" : ""}
                        onMouseEnter={() => setHover(k)}
                        onMouseLeave={() => setHover(null)}
                      >
                        <span className="trace-tree-elbow" />
                        <span className="trace-tree-kid">{s.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <a href="#more" className="trace-tree-more">
          <GitBranch size={13} aria-hidden />
          <span>
            +<span className="trace-num">{moreWork.length}</span> more runs
          </span>
          <ArrowRight size={13} aria-hidden />
        </a>
      </aside>

      <div
        role="tabpanel"
        id="trace-work-panel"
        aria-labelledby={`trace-tab-${p.slug}`}
        className="trace-panel"
        tabIndex={0}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.slug}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="trace-panel-in"
          >
            <div className="trace-panel-head">
              <div className="trace-panel-title">
                <span className="trace-pill">
                  <i className="trace-dot trace-dot-amber trace-pulse" aria-hidden /> live
                </span>
                <h3 className="trace-h3">{p.title}</h3>
                <p className="trace-tagline">{p.tagline}</p>
              </div>
              <div className="trace-panel-links">
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noreferrer" className="trace-link">
                    visit <ArrowUpRight size={13} aria-hidden />
                    <span className="trace-sr"> {p.title} (opens in a new tab)</span>
                  </a>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="trace-link">
                    source <ArrowUpRight size={13} aria-hidden />
                    <span className="trace-sr"> for {p.title} (opens in a new tab)</span>
                  </a>
                )}
                <a href={`/projects/${p.slug}`} className="trace-link">
                  case study <ArrowRight size={13} aria-hidden />
                </a>
              </div>
            </div>

            <figure className="trace-fall" aria-label={`${anatomy.title}: ${anatomy.stages.length} stages`}>
              <div className="trace-fall-head" aria-hidden>
                <span className="trace-fall-colname">
                  {anatomy.title.toLowerCase()}
                </span>
                <span className="trace-fall-axis">
                  {TICKS.map((t) => (
                    <span key={t} style={{ left: `${t}%` }} className="trace-num">
                      {t === 100 ? "end" : t === 0 ? "t0" : `${t}%`}
                    </span>
                  ))}
                </span>
              </div>
              <motion.ol
                className="trace-fall-rows"
                initial={reduce ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
              >
                {anatomy.stages.map((s, k) => {
                  const L = layout[k];
                  return (
                    <li
                      key={s.name}
                      className={`trace-fall-row ${hover === k ? "is-hot" : ""} ${hover !== null && hover !== k ? "is-dim" : ""}`}
                      onMouseEnter={() => setHover(k)}
                      onMouseLeave={() => setHover(null)}
                    >
                      <div className="trace-fall-main">
                        <span className="trace-fall-lbl">
                          <span className="trace-fall-idx trace-num">{String(k + 1).padStart(2, "0")}</span>
                          <span>
                            <b>{s.name}</b>
                            <small>{s.desc}</small>
                          </span>
                        </span>
                        <span className="trace-fall-track">
                          <Grid />
                          <SpanBar
                            reduce={!!reduce}
                            delay={k * 0.12}
                            s={L.s}
                            e={L.e}
                            color={color}
                            tip={
                              <>
                                <b>{s.name}</b>
                                <span>{s.desc}</span>
                                <span className="trace-num">
                                  stage {k + 1} of {anatomy.stages.length}
                                  {L.lanes ? ` · fans out ×${L.lanes.length}` : ""}
                                </span>
                              </>
                            }
                          />
                        </span>
                      </div>
                      {L.lanes?.map((lane, j) => (
                        <div className="trace-fall-lane" key={lane.label} aria-hidden>
                          <span className="trace-fall-lbl trace-fall-lanelbl">
                            <span className="trace-fall-elbow" />
                            {lane.label}
                          </span>
                          <span className="trace-fall-track trace-fall-track-thin">
                            <Grid />
                            <SpanBar
                              reduce={!!reduce}
                              delay={k * 0.12 + 0.08 + j * 0.06}
                              s={lane.s}
                              e={lane.e}
                              color={color}
                              thin
                              tip={
                                <>
                                  <b>{lane.label}</b>
                                  <span>child of {s.name.toLowerCase()}</span>
                                </>
                              }
                            />
                          </span>
                        </div>
                      ))}
                    </li>
                  );
                })}
              </motion.ol>
              <figcaption className="trace-fall-note">
                Span placement shows order, overlap and fan-out, not measured latency.
              </figcaption>
            </figure>

            <div className="trace-panel-foot">
              <div className="trace-shot">
                <div className="trace-shot-bar" aria-hidden>
                  <span className="trace-shot-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="trace-shot-url">{p.liveUrl ? host(p.liveUrl) : p.title}</span>
                </div>
                <div className="trace-shot-img">
                  <Image
                    src={p.image}
                    alt={`${p.title} landing page`}
                    fill
                    sizes="(min-width: 1280px) 560px, (min-width: 900px) 45vw, 100vw"
                    priority={sel === 0}
                  />
                </div>
              </div>
              <dl className="trace-attrs" aria-label="Span attributes">
                <div className="trace-attrs-head" aria-hidden>
                  attributes
                </div>
                <Attr k="service.name">{p.slug}</Attr>
                <Attr k="status">
                  <span className="trace-attr-live">
                    <i className="trace-dot trace-dot-amber" aria-hidden /> live
                  </span>
                </Attr>
                <Attr k="stack">
                  <span className="trace-tags">
                    {p.tech.map((t) => (
                      <span key={t} className="trace-tag">
                        {t}
                      </span>
                    ))}
                  </span>
                </Attr>
                {p.liveUrl && (
                  <Attr k="http.url">
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="trace-attr-link">
                      {host(p.liveUrl)}
                    </a>
                  </Attr>
                )}
                {p.repo && (
                  <Attr k="vcs.repo">
                    <a href={p.repo} target="_blank" rel="noreferrer" className="trace-attr-link">
                      {p.repo.replace("https://github.com/", "")}
                    </a>
                  </Attr>
                )}
                <Attr k="span.count">
                  <span className="trace-num">{anatomy.stages.length}</span>
                </Attr>
              </dl>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Attr({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="trace-attr">
      <dt>{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Grid() {
  return (
    <span className="trace-grid" aria-hidden>
      {TICKS.slice(1, -1).map((t) => (
        <i key={t} style={{ left: `${t}%` }} />
      ))}
    </span>
  );
}

function SpanBar({
  s,
  e,
  color,
  delay,
  reduce,
  thin,
  tip,
}: {
  s: number;
  e: number;
  color: string;
  delay: number;
  reduce: boolean;
  thin?: boolean;
  tip: React.ReactNode;
}) {
  return (
    <span className={`trace-bar-wrap ${thin ? "is-thin" : ""}`} style={{ left: `${s}%`, width: `${e - s}%` }}>
      <motion.span
        className="trace-bar"
        style={{ background: color, transformOrigin: "left center" }}
        variants={{
          hidden: { scaleX: 0, opacity: 0.4 },
          show: {
            scaleX: 1,
            opacity: 1,
            transition: { duration: reduce ? 0 : 0.7, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      />
      <span className="trace-tip" aria-hidden>
        {tip}
      </span>
    </span>
  );
}
