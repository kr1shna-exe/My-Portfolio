"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, FileDiff, GitMerge } from "lucide-react";
import { useState } from "react";

import {
  contributionStats,
  contributions,
  contributionsByRepo,
  repoInfo,
} from "@/data/open-source";

import { GitHubIcon } from "./icons";
import { Reveal } from "./reveal";
import { SpotlightGrid } from "./spotlight";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COLLAPSED = 8;

function parse(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}
function fmtDay(iso: string) {
  const { m, d } = parse(iso);
  return `${MONTHS[m - 1]} ${d}`;
}
function daysBetween(a: string, b: string) {
  const ms = Date.UTC(...toUTC(b)) - Date.UTC(...toUTC(a));
  return Math.round(ms / 86400000) + 1;
}
function toUTC(iso: string): [number, number, number] {
  const { y, m, d } = parse(iso);
  return [y, m - 1, d];
}

function hue(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

function Avatar({ repo, name, size }: { repo: string; name: string; size?: "sm" }) {
  return (
    <span
      className={size === "sm" ? "launch-avatar is-sm" : "launch-avatar"}
      aria-hidden
      style={{ ["--h" as string]: hue(repo) }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function DiffBar({ add, del }: { add: number; del: number }) {
  const total = add + del;
  const greens = total ? Math.round((add / total) * 5) : 0;
  const reds = total
    ? Math.min(5 - greens, Math.max(del > 0 ? 1 : 0, Math.round((del / total) * 5)))
    : 0;
  return (
    <span className="launch-diff" aria-label={`${add} additions, ${del} deletions`}>
      <span className="add">+{add.toLocaleString("en-US")}</span>
      <span className="del">−{del.toLocaleString("en-US")}</span>
      <span className="launch-diff-bar" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className={i < greens ? "add" : i < greens + reds ? "del" : ""} />
        ))}
      </span>
    </span>
  );
}

export function OpenSource() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const s = contributionStats;
  const span = daysBetween(s.since, s.latest);
  const maxPrs = Math.max(...contributionsByRepo.map((r) => r.prs.length));

  const list = filter ? contributions.filter((c) => c.repo === filter) : contributions;
  const visible = expanded || list.length <= COLLAPSED + 2 ? list : list.slice(0, COLLAPSED);
  const hidden = list.length - visible.length;
  const activeName = filter ? repoInfo(filter).name : null;

  const pick = (repo: string | null) => {
    setFilter((f) => (f === repo ? null : repo));
    setExpanded(false);
  };

  return (
    <section id="open-source" className="launch-section" aria-labelledby="launch-os-h">
      <div className="launch-os-glow" aria-hidden />
      <div className="launch-wrap">
        <Reveal className="launch-head">
          <span className="launch-eyebrow">02 · Open source · changelog</span>
          <h2 id="launch-os-h" className="launch-h2">
            {s.merged} PRs merged upstream in {span} days.
          </h2>
          <p className="launch-lede">
            Fixes I landed in {s.repos} AI and developer-tool projects other people run. Every one
            is merged and every title links to the pull request.
          </p>
        </Reveal>

        <Reveal>
          <dl className="launch-card launch-os-strip">
            <div className="launch-os-stat">
              <dt>PRs merged</dt>
              <dd>{s.merged}</dd>
            </div>
            <div className="launch-os-stat">
              <dt>Projects</dt>
              <dd>{s.repos}</dd>
            </div>
            <div className="launch-os-stat">
              <dt>Lines changed</dt>
              <dd className="launch-os-lines">
                <span className="add">+{s.linesAdded.toLocaleString("en-US")}</span>
                <span className="del">−{s.linesRemoved.toLocaleString("en-US")}</span>
              </dd>
            </div>
            <div className="launch-os-stat">
              <dt>Files touched</dt>
              <dd>{s.files}</dd>
            </div>
          </dl>
        </Reveal>

        <p className="launch-os-window launch-mono">
          <span className="launch-livedot" aria-hidden />
          {fmtDay(s.since)} to {fmtDay(s.latest)}, {parse(s.latest).y} · all merged
        </p>

        <SpotlightGrid as="ul" className="launch-os-repos">
          {contributionsByRepo.map((r, i) => {
            const on = filter === r.repo;
            return (
              <Reveal as="li" key={r.repo} delay={i * 0.04} className="launch-card launch-spot launch-repo">
                <button
                  type="button"
                  className="launch-repo-btn"
                  aria-pressed={on}
                  onClick={() => pick(r.repo)}
                  aria-label={`${r.name}: ${r.prs.length} merged PRs. ${on ? "Show all projects" : "Show only this project"}`}
                >
                  <span className="launch-repo-top">
                    <Avatar repo={r.repo} name={r.name} size="sm" />
                    <span className="launch-repo-name">{r.name}</span>
                    <span className="launch-repo-count">
                      {r.prs.length}
                      <small>{r.prs.length === 1 ? " PR" : " PRs"}</small>
                    </span>
                  </span>
                  <span className="launch-repo-desc">{r.description}</span>
                  <span className="launch-repo-meter" aria-hidden>
                    <i style={{ transform: `scaleX(${r.prs.length / maxPrs})` }} />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </SpotlightGrid>

        <div className="launch-os-bar">
          <span className="launch-mono" aria-live="polite">
            {activeName
              ? `${list.length} merged in ${activeName}`
              : `All ${list.length} merged PRs, newest first`}
          </span>
          {filter ? (
            <button type="button" className="launch-linkpill" onClick={() => pick(null)}>
              Show all projects
            </button>
          ) : null}
        </div>

        <ol className="launch-log">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((c) => {
              const info = repoInfo(c.repo);
              return (
                <motion.li
                  key={`${c.repo}#${c.number}`}
                  layout={reduce ? false : "position"}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: reduce ? 0.01 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="launch-log-item"
                >
                  <div className="launch-log-date">
                    <b>{fmtDay(c.date)}</b>
                    <span>{parse(c.date).y}</span>
                  </div>
                  <div className="launch-log-rail" aria-hidden data-state={c.state}>
                    <span className="launch-log-dot" />
                  </div>
                  <article className="launch-card launch-log-entry">
                    <Avatar repo={c.repo} name={info.name} />
                    <div className="launch-log-repo">
                      <a href={info.url} target="_blank" rel="noreferrer">
                        {c.repo}
                      </a>
                    </div>
                    <h3 className="launch-log-title">
                      <a href={c.url} target="_blank" rel="noreferrer">
                        {c.title} <span className="launch-num">#{c.number}</span>
                      </a>
                    </h3>
                    <p className="launch-log-summary">{c.summary}</p>
                    <div className="launch-log-side">
                      <span className="launch-badge is-merged">
                        <GitMerge size={12} aria-hidden /> Merged
                      </span>
                      <span className="launch-log-meta">
                        <span className="launch-files">
                          <FileDiff size={12} aria-hidden />
                          {c.files} {c.files === 1 ? "file" : "files"}
                        </span>
                        <DiffBar add={c.additions} del={c.deletions} />
                      </span>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>

        <div className="launch-os-foot">
          {hidden > 0 || expanded ? (
            <button
              type="button"
              className="launch-btn launch-btn-ghost launch-os-more"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? "Show fewer" : `Show all ${list.length} PRs`}
              <ChevronDown
                size={15}
                aria-hidden
                style={{ transform: expanded ? "rotate(180deg)" : undefined, transition: "transform .3s" }}
              />
            </button>
          ) : (
            <span />
          )}
          <a
            className="launch-linkpill"
            href="https://github.com/kr1shna-exe"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon size={13} />
            Everything on GitHub
            <ArrowUpRight size={13} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
