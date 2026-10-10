"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { experience, site } from "@/data/site";

/* Months are indexed from Jan 2024 = 0. The axis runs Jul 2024 to Dec 2026. */
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
function monthIndex(label: string) {
  const [m, y] = label.trim().split(/\s+/);
  const mi = MONTHS.indexOf(m.slice(0, 3).toLowerCase());
  return (Number(y) - 2024) * 12 + mi;
}
const NOW = monthIndex(site.updated) + 0.33; // early October
const D0 = 6; // Jul 2024
const D1 = 36; // Jan 2027
const pct = (m: number) => ((m - D0) / (D1 - D0)) * 100;

const TICKS = [
  { m: 6, label: "Jul ’24" },
  { m: 12, label: "2025" },
  { m: 18, label: "Jul ’25" },
  { m: 24, label: "2026" },
  { m: 30, label: "Jul ’26" },
];

const COLORS = ["var(--tr-amber)", "var(--tr-peri)", "var(--tr-rose)"];

const roles = experience.map((r, i) => {
  const present = /present/i.test(r.end);
  const s = monthIndex(r.start);
  const e = present ? NOW : monthIndex(r.end) + 1;
  const months = Math.max(1, Math.round(e - s));
  return { ...r, s, e, present, months, color: COLORS[i % COLORS.length] };
});

function dur(m: number) {
  return m >= 12 ? `${Math.floor(m / 12)}y ${m % 12}mo` : `${m} mo`;
}

export function Timeline() {
  const reduce = useReducedMotion();
  return (
    <div className="trace-tl">
      <motion.div
        className="trace-tl-chart"
        initial={reduce ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        role="img" aria-label={`Timeline of ${roles.length} roles from ${roles[roles.length - 1].start} to now`}>
        <div className="trace-tl-axis" aria-hidden>
          <span className="trace-tl-lblcol">roles · {roles.length} spans</span>
          <span className="trace-tl-scale">
            {TICKS.map((t) => (
              <span
                key={t.m}
                style={{ left: `${pct(t.m)}%` }}
                className={`trace-num ${t.label.startsWith("Jul") ? "is-minor" : ""}`}
              >
                {t.label}
              </span>
            ))}
            <span className="trace-tl-nowlbl trace-num" style={{ left: `${pct(NOW)}%` }}>
              now
            </span>
          </span>
        </div>
        {roles.map((r, i) => (
          <div key={r.company} className="trace-tl-row">
            <span className="trace-tl-lblcol">
              <b>{r.company}</b>
              <small>{r.role}</small>
            </span>
            <span className="trace-tl-track">
              {TICKS.map((t) => (
                <i key={t.m} className="trace-tl-gl" style={{ left: `${pct(t.m)}%` }} />
              ))}
              <i className="trace-tl-now" style={{ left: `${pct(NOW)}%` }} />
              <span
                className="trace-bar-wrap trace-tl-span"
                style={{ left: `${pct(r.s)}%`, width: `${pct(r.e) - pct(r.s)}%` }}
              >
                <motion.span
                  className={`trace-bar ${r.present ? "is-live" : ""}`}
                  style={{ background: r.color, transformOrigin: "left center" }}
                  variants={{
                    hidden: { scaleX: 0 },
                    show: {
                      scaleX: 1,
                      transition: {
                        duration: reduce ? 0 : 0.9,
                        delay: reduce ? 0 : 0.15 + (roles.length - i) * 0.12,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }}
                />
                <span className="trace-tl-dur trace-num">{dur(r.months)}</span>
                <span className="trace-tip" aria-hidden>
                  <b>{r.role}</b>
                  <span>{r.company} · {r.location}</span>
                  <span className="trace-num">
                    {r.start} → {r.end} · {dur(r.months)}
                  </span>
                </span>
              </span>
            </span>
          </div>
        ))}
      </motion.div>

      <ol className="trace-tl-list">
        {roles.map((r) => (
          <li key={r.company} className="trace-tl-item">
            <div className="trace-tl-item-head">
              <span className="trace-sq" style={{ background: r.color }} aria-hidden />
              <span className="trace-tl-dates trace-num">
                {r.start} → {r.end}
              </span>
              {r.present && (
                <span className="trace-pill trace-pill-sm">
                  <i className="trace-dot trace-dot-amber trace-pulse" aria-hidden /> running
                </span>
              )}
            </div>
            <h3 className="trace-tl-role">{r.role}</h3>
            <p className="trace-tl-co">
              {r.link ? (
                <a href={r.link} target="_blank" rel="noreferrer" className="trace-link">
                  {r.company} <ArrowUpRight size={13} aria-hidden />
                </a>
              ) : (
                <span>{r.company}</span>
              )}
              <span className="trace-dimlabel"> · {r.location}</span>
            </p>
            <p className="trace-tl-sum">{r.summary}</p>
            {r.highlights.length > 0 && (
              <ul className="trace-tl-events">
                {r.highlights.map((h) => (
                  <li key={h}>
                    <span className="trace-tl-ev" aria-hidden>
                      event
                    </span>
                    {h.trim()}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
