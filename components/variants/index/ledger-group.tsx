"use client";

import { useState } from "react";

import { pad } from "./data";

export type LedgerRow = {
  key: string;
  number: number;
  title: string;
  summary: string;
  url: string;
  files: number;
  additions: number;
  deletions: number;
  date: string;
  addV: number;
  delV: number;
};

const COLLAPSE_OVER = 5;
const SHOW = 4;

/* One project's block in the ledger: a ruled group header, then its PRs.
   Long groups fold to the newest four behind a "show all" row. */
export function LedgerGroup({
  id,
  name,
  repo,
  url,
  description,
  rows,
}: {
  id: string;
  name: string;
  repo: string;
  url: string;
  description: string;
  rows: LedgerRow[];
}) {
  const [open, setOpen] = useState(false);
  const long = rows.length > COLLAPSE_OVER;
  const visible = long && !open ? rows.slice(0, SHOW) : rows;

  return (
    <tbody id={id} className="index-grp">
      <tr className="index-grp-head">
        <th scope="colgroup" colSpan={5}>
          <span className="index-grp-name">{name}</span>
          <span className="index-grp-meta">
            <span>{description}</span>
            <a href={url} target="_blank" rel="noreferrer" className="index-ul">
              {repo}
              <span aria-hidden> ↗</span>
            </a>
          </span>
          <span className="index-grp-count">
            {pad(rows.length)} merged
          </span>
        </th>
      </tr>
      {visible.map((r, i) => (
        <tr key={r.key} className="index-trow">
          <td className="index-t-no">{pad(i + 1)}</td>
          <td className="index-t-pr">
            <a href={r.url} target="_blank" rel="noreferrer" className="index-stretch-row">
              <span className="index-t-prnum">#{r.number}</span> {r.title}
            </a>
            <span className="index-t-sub">{r.summary}</span>
          </td>
          <td className="index-num index-t-files">
            {r.files}
            <span className="index-t-unit"> files</span>
          </td>
          <td className="index-t-diff">
            <span className="index-diff">
              <span className="index-diff-add">+{r.additions}</span>
              <span className="index-diff-del">−{r.deletions}</span>
            </span>
            <span className="index-bars" aria-hidden>
              <i className="index-bar-add" style={{ "--v": r.addV } as React.CSSProperties} />
              <i className="index-bar-del" style={{ "--v": r.delV } as React.CSSProperties} />
            </span>
          </td>
          <td className="index-num index-t-state">
            <span className="index-state-m">▲ Merged</span>
            <span className="index-t-sub">{r.date}</span>
          </td>
        </tr>
      ))}
      {long && (
        <tr className="index-grp-more">
          <td colSpan={5}>
            <button
              type="button"
              className="index-more-btn"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span>
                {open
                  ? `Show fewer ${name} PRs`
                  : `Show all ${rows.length} ${name} PRs (${rows.length - SHOW} more)`}
              </span>
              <span aria-hidden className="index-more-glyph">
                {open ? "↑" : "↓"}
              </span>
            </button>
          </td>
        </tr>
      )}
    </tbody>
  );
}
