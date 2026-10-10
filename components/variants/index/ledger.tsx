import { contributionsByRepo, contributionStats } from "@/data/open-source";

import { InView } from "./in-view";
import { LedgerGroup, type LedgerRow } from "./ledger-group";
import { Tally } from "./tally";

export const slugOf = (repo: string) => `oss-${repo.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

/* Set like a newspaper's markets page: a tally board of big figures, a
   listings board of the six projects (sized by how many PRs landed in
   each), then the full ledger grouped by project. Every row is one merged
   pull request to someone else's repo. */
export function Ledger() {
  const s = contributionStats;
  const largest = Math.max(...contributionsByRepo.flatMap((g) => g.prs.map((p) => p.additions)));
  const maxLines = Math.max(
    1,
    ...contributionsByRepo.flatMap((g) => g.prs.map((p) => Math.max(p.additions, p.deletions)))
  );
  const maxPrs = Math.max(...contributionsByRepo.map((g) => g.prs.length));

  return (
    <div className="index-ledger">
      <InView className="index-tally">
        <div className="index-tally-main">
          <span className="index-tally-label">Merged pull requests</span>
          <Tally value={s.merged} pad className="index-tally-big" />
          <p className="index-tally-dek">
            Into {s.repos} open-source AI and developer-tool projects. Every row below links to the
            pull request itself.
          </p>
        </div>
        <div className="index-tally-side">
          <div>
            <span className="index-tally-label">Projects</span>
            <span className="index-tally-fig">
              <Tally value={s.repos} pad />
            </span>
          </div>
          <div>
            <span className="index-tally-label">Largest PR</span>
            <span className="index-tally-fig">
              +<Tally value={largest} />
            </span>
          </div>
          <div>
            <span className="index-tally-label">Lines added</span>
            <span className="index-tally-fig">
              +<Tally value={s.linesAdded} />
            </span>
          </div>
          <div>
            <span className="index-tally-label">Lines removed</span>
            <span className="index-tally-fig index-tally-muted">
              −<Tally value={s.linesRemoved} />
            </span>
          </div>
          <div>
            <span className="index-tally-label">Files changed</span>
            <span className="index-tally-fig">
              <Tally value={s.files} />
            </span>
          </div>
          <div>
            <span className="index-tally-label">Status</span>
            <span className="index-tally-fig index-tally-word">All merged</span>
          </div>
        </div>
      </InView>

      <InView as="ol" className="index-board" amount={0.1}>
        {contributionsByRepo.map((g, i) => {
          const add = g.prs.reduce((n, p) => n + p.additions, 0);
          const del = g.prs.reduce((n, p) => n + p.deletions, 0);
          return (
            <li key={g.repo} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${slugOf(g.repo)}`} className="index-listing">
                <span className="index-listing-top">
                  <span className="index-listing-name">{g.name}</span>
                  <span className="index-listing-count">
                    {g.prs.length}
                    <small>{g.prs.length === 1 ? "PR" : "PRs"}</small>
                  </span>
                </span>
                <span
                  className="index-listing-bar"
                  aria-hidden
                  style={{ "--v": g.prs.length / maxPrs } as React.CSSProperties}
                />
                <span className="index-listing-desc">{g.description}</span>
                <span className="index-listing-diff">
                  <span>+{add.toLocaleString("en-US")}</span>
                  <span className="index-diff-del">−{del.toLocaleString("en-US")}</span>
                  <span className="index-listing-repo">{g.repo}</span>
                </span>
              </a>
            </li>
          );
        })}
      </InView>

      <div className="index-ledger-wrap">
        <table className="index-table">
          <caption className="index-sr">
            Every merged pull request, grouped by project
          </caption>
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Pull request</th>
              <th scope="col" className="index-num">
                Files
              </th>
              <th scope="col">Change +/−</th>
              <th scope="col" className="index-num">
                Status
              </th>
            </tr>
          </thead>
          {contributionsByRepo.map((g) => {
            const rows: LedgerRow[] = [...g.prs]
              .sort((a, b) => b.date.localeCompare(a.date) || b.number - a.number)
              .map((p) => ({
                key: `${p.repo}-${p.number}`,
                number: p.number,
                title: p.title,
                summary: p.summary,
                url: p.url,
                files: p.files,
                additions: p.additions,
                deletions: p.deletions,
                addV: p.additions / maxLines,
                delV: p.deletions / maxLines,
              }));
            return (
              <LedgerGroup
                key={g.repo}
                id={slugOf(g.repo)}
                name={g.name}
                repo={g.repo}
                url={g.url}
                description={g.description}
                rows={rows}
              />
            );
          })}
          <tfoot>
            <tr>
              <td colSpan={5}>
                {s.merged} pull requests · all merged · {s.repos} projects ·{" "}
                {s.files} files · +{s.linesAdded.toLocaleString("en-US")} / −
                {s.linesRemoved.toLocaleString("en-US")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
