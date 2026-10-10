"use client";

import { ArrowUpRight, ChevronDown, X } from "lucide-react";
import { useState } from "react";

import {
  contributionStats,
  contributions,
  contributionsByRepo,
  repoInfo,
} from "@/data/open-source";

/* One span color per upstream project, in contribution order. */
const PALETTE = [
  "var(--tr-peri)",
  "var(--tr-mint)",
  "var(--tr-rose)",
  "var(--tr-lilac)",
  "var(--tr-sky)",
  "var(--tr-lime)",
];
const COLOR: Record<string, string> = Object.fromEntries(
  contributionsByRepo.map((r, i) => [r.repo, PALETTE[i % PALETTE.length]])
);

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${MON[m - 1]} ${String(d).padStart(2, "0")}`;
};

/** Every calendar day from the first merge to the last, ISO. */
const DAYS = (() => {
  const out: string[] = [];
  const d = new Date(`${contributionStats.since}T00:00:00Z`);
  const end = new Date(`${contributionStats.latest}T00:00:00Z`);
  while (d <= end) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
})();

const sorted = [...contributions].sort(
  (a, b) => b.date.localeCompare(a.date) || b.number - a.number
);
const maxPrs = Math.max(...contributionsByRepo.map((r) => r.prs.length));
const COLLAPSED = 8;
const fmt = (n: number) => n.toLocaleString("en-US");

function DiffBlocks({ add, del }: { add: number; del: number }) {
  const total = add + del || 1;
  const g = Math.round((add / total) * 5);
  return (
    <span className="trace-diffblocks" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < g ? "is-add" : "is-del"} />
      ))}
    </span>
  );
}

export function Outbound() {
  const [repo, setRepo] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const list = repo ? sorted.filter((c) => c.repo === repo) : sorted;
  const collapsible = list.length > COLLAPSED;
  const shown = collapsible && !expanded ? list.slice(0, COLLAPSED) : list;
  const active = repo ? repoInfo(repo) : null;

  const pick = (r: string) => {
    setRepo((cur) => (cur === r ? null : r));
    setExpanded(false);
  };

  return (
    <div className="trace-ob">
      <dl className="trace-ob-stats">
        <div>
          <dt>merged PRs</dt>
          <dd className="trace-num trace-ob-hero">{contributionStats.merged}</dd>
        </div>
        <div>
          <dt>projects</dt>
          <dd className="trace-num">{contributionStats.repos}</dd>
        </div>
        <div>
          <dt>lines</dt>
          <dd className="trace-num">
            <span className="trace-add">+{fmt(contributionStats.linesAdded)}</span>
            <span className="trace-del trace-ob-del">−{fmt(contributionStats.linesRemoved)}</span>
          </dd>
        </div>
        <div>
          <dt>files changed</dt>
          <dd className="trace-num">{contributionStats.files}</dd>
        </div>
        <div>
          <dt>
            window · {short(contributionStats.since)} → {short(contributionStats.latest)}
          </dt>
          <dd className="trace-num">
            {DAYS.length}
            <span className="trace-ob-unit"> days</span>
          </dd>
        </div>
      </dl>

      <div className="trace-ob-repos" role="group" aria-label="Filter pull requests by project">
        {contributionsByRepo.map((r) => {
          const add = r.prs.reduce((s, c) => s + c.additions, 0);
          const del = r.prs.reduce((s, c) => s + c.deletions, 0);
          const on = repo === r.repo;
          return (
            <button
              key={r.repo}
              type="button"
              className={`trace-ob-repo ${repo && !on ? "is-dim" : ""}`}
              aria-pressed={on}
              onClick={() => pick(r.repo)}
              style={{ "--c": COLOR[r.repo] } as React.CSSProperties}
            >
              <span className="trace-ob-repo-top">
                <span className="trace-ob-repo-name">
                  <i className="trace-sq" aria-hidden />
                  {r.name}
                </span>
                <span className="trace-ob-repo-count trace-num">
                  {r.prs.length}
                  <small> PR{r.prs.length > 1 ? "s" : ""}</small>
                </span>
              </span>
              <span className="trace-ob-repo-slug">{r.repo}</span>
              <span className="trace-ob-repo-desc">{r.description}</span>
              <span className="trace-ob-repo-bar" aria-hidden>
                <i style={{ width: `${(r.prs.length / maxPrs) * 100}%` }} />
              </span>
              <span className="trace-ob-repo-diff trace-num">
                <span className="trace-add">+{fmt(add)}</span>
                <span className="trace-del">−{fmt(del)}</span>
              </span>
            </button>
          );
        })}
      </div>

      <figure
        className="trace-ob-wf"
        style={{ "--days": DAYS.length } as React.CSSProperties}
        aria-label={`Merged pull requests per project, ${short(contributionStats.since)} to ${short(contributionStats.latest)}`}>
        <div className="trace-ob-wf-head" aria-hidden>
          <span className="trace-ob-wf-lbl">calls / day</span>
          <span className="trace-ob-wf-days">
            {DAYS.map((d) => (
              <span key={d} className="trace-num">
                {short(d).split(" ")[1]}
              </span>
            ))}
          </span>
        </div>
        {contributionsByRepo.map((r) => (
          <div
            key={r.repo}
            className={`trace-ob-wf-row ${repo && repo !== r.repo ? "is-dim" : ""}`}
            style={{ "--c": COLOR[r.repo] } as React.CSSProperties}
          >
            <span className="trace-ob-wf-lbl">{r.name}</span>
            <span className="trace-ob-wf-days">
              {DAYS.map((d) => {
                const prs = r.prs.filter((c) => c.date === d);
                return (
                  <span key={d} className="trace-ob-wf-cell">
                    {prs.map((c) => (
                      <a
                        key={c.number}
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        className="trace-ob-mark"
                        aria-label={`${r.name} #${c.number}: ${c.title}, merged ${c.date}`}
                      >
                        <span className="trace-tip" aria-hidden>
                          <b>
                            {r.name} #{c.number}
                          </b>
                          <span>{c.title}</span>
                          <span className="trace-num">
                            {c.date} · +{c.additions} −{c.deletions} · {c.files} files
                          </span>
                        </span>
                      </a>
                    ))}
                  </span>
                );
              })}
            </span>
          </div>
        ))}
        <figcaption className="trace-fall-note">
          One mark per merged PR, on the day it landed. Hover for the title; click to open it.
        </figcaption>
      </figure>

      <div className="trace-ob-console">
        <div className="trace-ob-bar">
          <span className="trace-ob-cmd" aria-hidden>
            <span className="trace-dimlabel">$</span> gh search prs --author kr1shna-exe --merged
            {active && <span className="trace-ob-cmd-repo"> --repo {active.repo}</span>}
          </span>
          <span className="trace-ob-bar-right">
            {active ? (
              <>
                <a href={active.url} target="_blank" rel="noreferrer" className="trace-link">
                  {active.name} on GitHub <ArrowUpRight size={13} aria-hidden />
                </a>
                <button type="button" className="trace-ob-clear" onClick={() => setRepo(null)}>
                  <X size={12} aria-hidden /> all projects
                </button>
              </>
            ) : (
              <span className="trace-dimlabel trace-num">{list.length} merged · newest first</span>
            )}
          </span>
        </div>

        <ol className="trace-pr-list" aria-live="polite">
          {shown.map((c) => {
            const info = repoInfo(c.repo);
            return (
              <li
                key={c.url}
                className="trace-pr is-merged"
                style={{ "--c": COLOR[c.repo] } as React.CSSProperties}
              >
                <span className="trace-pr-graph" aria-hidden>
                  <i />
                </span>
                <div className="trace-pr-line">
                  <span className="trace-pr-date trace-num">{short(c.date)}</span>
                  <span className="trace-pr-repo">
                    <i className="trace-sq" aria-hidden />
                    <span className="trace-pr-reponame">{info.name}</span>
                  </span>
                  <span className="trace-pr-main">
                    <a href={c.url} target="_blank" rel="noreferrer" className="trace-pr-title">
                      <span className="trace-pr-num trace-num">#{c.number}</span> {c.title}
                      <ArrowUpRight size={12} aria-hidden className="trace-pr-arrow" />
                    </a>
                    <span className="trace-pr-summary">{c.summary}</span>
                  </span>
                  <span className="trace-pr-files trace-num">
                    {c.files} file{c.files > 1 ? "s" : ""}
                  </span>
                  <span className="trace-pr-diff trace-num">
                    <span className="trace-add">+{c.additions}</span>
                    <span className="trace-del">−{c.deletions}</span>
                    <DiffBlocks add={c.additions} del={c.deletions} />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {collapsible && (
          <button
            type="button"
            className="trace-ob-more"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            <ChevronDown size={14} aria-hidden className={expanded ? "is-up" : ""} />
            {expanded ? "show fewer" : `show all ${list.length} calls`}
            {!expanded && <span className="trace-dimlabel trace-num"> +{list.length - COLLAPSED} more</span>}
          </button>
        )}

        <div className="trace-ob-foot trace-num" aria-hidden>
          <span>
            {list.length} calls · {list.length} merged
          </span>
          <span>exit 0</span>
        </div>
      </div>
    </div>
  );
}
