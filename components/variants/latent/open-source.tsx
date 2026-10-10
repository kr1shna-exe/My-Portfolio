"use client";

import { useState } from "react";

import {
  contributionStats as stats,
  contributionsByRepo,
  type Contribution,
} from "@/data/open-source";

/* Upstream pull requests. Leads with the numbers, then the six projects as
   cards, and every PR grouped by project. No dates on purpose. */

const TONES = ["#0a0a0a", "#3d3c39", "#64625d", "#8b8881", "#b1aea5", "#d6d3ca"];
const toneOf = (repo: string) =>
  TONES[Math.max(0, contributionsByRepo.findIndex((r) => r.repo === repo)) % TONES.length];
export const repoSlug = (name: string) => `oss-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const n = (v: number) => v.toLocaleString("en-US");
const COLLAPSE_AT = 4;

export function OpenSource() {
  const names = contributionsByRepo.map((r) => r.name);
  const nameList = `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return (
    <section id="upstream" className="latent-os" aria-labelledby="latent-os-h" data-nav-section>
      <div className="latent-wrap">
        <header className="latent-os-head" data-reveal>
          <div>
            <p className="latent-eyebrow latent-mono">Open source</p>
            <h2 id="latent-os-h" className="latent-h2">
              {stats.merged} pull requests merged into {stats.repos} open-source projects.
            </h2>
          </div>
          <div className="latent-os-side">
            <p className="latent-lede">
              {nameList}. Every one is merged and linked below, so you can read the code
              review as well as the code.
            </p>
          </div>
        </header>

        <dl className="latent-os-stats" data-reveal>
          <div className="latent-os-stat-hero">
            <dt>PRs merged</dt>
            <dd>{stats.merged}</dd>
          </div>
          <div>
            <dt>projects</dt>
            <dd>{stats.repos}</dd>
          </div>
          <div>
            <dt>lines added</dt>
            <dd className="latent-add">+{n(stats.linesAdded)}</dd>
          </div>
          <div>
            <dt>lines removed</dt>
            <dd className="latent-del">−{n(stats.linesRemoved)}</dd>
          </div>
          <div>
            <dt>files changed</dt>
            <dd>{stats.files}</dd>
          </div>
        </dl>

        <ul className="latent-osp-grid" aria-label="Projects">
          {contributionsByRepo.map((r, i) => (
            <li key={r.repo} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
              <ProjectCard repo={r} />
            </li>
          ))}
        </ul>

        <div className="latent-ledger">
          <p className="latent-mono latent-ledger-k">All pull requests</p>
          {contributionsByRepo.map((r) => (
            <RepoGroup key={r.repo} repo={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

type Repo = (typeof contributionsByRepo)[number];

function ProjectCard({ repo }: { repo: Repo }) {
  const add = repo.prs.reduce((a, c) => a + c.additions, 0);
  const del = repo.prs.reduce((a, c) => a + c.deletions, 0);
  return (
    <a
      href={`#${repoSlug(repo.name)}`}
      className="latent-osp"
      aria-label={`${repo.name}: ${repo.prs.length} merged pull requests. Jump to the list.`}
    >
      <span className="latent-osp-top latent-mono">
        <span>{repo.repo}</span>
      </span>
      <span className="latent-osp-name">{repo.name}</span>
      <span className="latent-osp-desc">{repo.description}</span>
      <span className="latent-osp-foot">
        <span className="latent-osp-count">
          {repo.prs.length}
          <small>{repo.prs.length === 1 ? "PR" : "PRs"}</small>
        </span>
        <span className="latent-osp-dots" aria-hidden>
          {repo.prs.map((c) => (
            <i key={c.number} />
          ))}
        </span>
        <span className="latent-mono latent-osp-diff">
          <em className="latent-add">+{n(add)}</em> <em className="latent-del">−{n(del)}</em>
        </span>
      </span>
    </a>
  );
}

function RepoGroup({ repo }: { repo: Repo }) {
  const [open, setOpen] = useState(false);
  const long = repo.prs.length > COLLAPSE_AT;
  const shown = long && !open ? repo.prs.slice(0, 3) : repo.prs;
  const listId = `${repoSlug(repo.name)}-list`;
  return (
    <section id={repoSlug(repo.name)} className="latent-ledger-group" aria-label={`${repo.name} pull requests`}>
      <header className="latent-ledger-head">
        <span className="latent-ledger-dot" style={{ background: toneOf(repo.repo) }} aria-hidden />
        <h3>{repo.name}</h3>
        <span className="latent-tag latent-tag-outline">{repo.prs.length} merged</span>
        <a className="latent-ledger-repo latent-mono" href={repo.url} target="_blank" rel="noreferrer">
          {repo.repo} ↗
        </a>
      </header>
      <ol id={listId} className="latent-ledger-list">
        {shown.map((c) => (
          <PrRow key={c.number} c={c} />
        ))}
      </ol>
      {long && (
        <button
          type="button"
          className="latent-ledger-more"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Show fewer ↑" : `Show all ${repo.prs.length} ↓`}
        </button>
      )}
    </section>
  );
}

function PrRow({ c }: { c: Contribution }) {
  const total = c.additions + c.deletions || 1;
  const greens = Math.round((c.additions / total) * 10);
  return (
    <li className="latent-row">
      <div className="latent-row-main">
        <a href={c.url} target="_blank" rel="noreferrer" className="latent-row-title">
          {c.title}
          <span className="latent-mono latent-row-num"> #{c.number} ↗</span>
        </a>
        <p>{c.summary}</p>
      </div>
      <span className="latent-row-diff latent-mono">
        <span>
          <em className="latent-add">+{n(c.additions)}</em> <em className="latent-del">−{n(c.deletions)}</em>
        </span>
        <span className="latent-diffbar" aria-hidden>
          {Array.from({ length: 10 }, (_, k) => (
            <i key={k} data-g={k < greens ? "1" : "0"} />
          ))}
        </span>
        <span className="latent-row-files">
          {c.files} {c.files === 1 ? "file" : "files"}
        </span>
      </span>
    </li>
  );
}
