import Link from "next/link";


import { CLUSTERS, NEIGHBOURS, POINT_BY_ID, type MapPoint } from "./map-data";
import { GlassFrame } from "./glass-frame";

export function PointDetail({
  point,
  onPick,
  compact = false,
}: {
  point: MapPoint;
  onPick?: (id: string) => void;
  compact?: boolean;
}) {
  const nn = NEIGHBOURS[point.id];
  return (
    <div className="latent-detail" data-kind={point.kind}>
      <Visual point={point} compact={compact} />
      <div className="latent-detail-tags">
        {point.kind === "role" ? (
          <span className="latent-tag">
            Role · {CLUSTERS[point.between[0]].label} and {CLUSTERS[point.between[1]].label.toLowerCase()}
          </span>
        ) : (
          <span className="latent-tag">
            {CLUSTERS[point.cluster].label}
          </span>
        )}
        {point.kind === "project" && point.project.featured && (
          <span className="latent-tag latent-tag-outline">Featured</span>
        )}
      </div>

      {point.kind === "project" && (
        <>
          <h3 className="latent-detail-title">{point.project.title}</h3>
          <p className="latent-detail-copy">{point.project.tagline}</p>
          {point.project.slug !== "twisense" && (
            <ul className="latent-chips" aria-label="Stack">
              {point.project.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <div className="latent-detail-links">
            {point.project.liveUrl && (
              <a href={point.project.liveUrl} target="_blank" rel="noreferrer">
                Live site ↗
              </a>
            )}
            {point.project.repo && (
              <a href={point.project.repo} target="_blank" rel="noreferrer">
                Code ↗
              </a>
            )}
            {point.project.slug !== "twisense" && (
              <Link href={`/projects/${point.project.slug}`}>Case study →</Link>
            )}
          </div>
        </>
      )}

      {point.kind === "role" && (
        <>
          <h3 className="latent-detail-title">{point.role.role}</h3>
          <p className="latent-detail-copy">{point.role.summary}</p>
          {point.role.link && (
            <div className="latent-detail-links">
              <a href={point.role.link} target="_blank" rel="noreferrer">
                {point.role.company} ↗
              </a>
            </div>
          )}
        </>
      )}

      {point.kind === "oss" && (
        <>
          <h3 className="latent-detail-title">{point.repo.name}</h3>
          <p className="latent-detail-copy">{point.repo.description}</p>
          <ul className="latent-detail-prs">
            {point.repo.prs.slice(0, 3).map((pr) => (
              <li key={pr.number}>
                <a href={pr.url} target="_blank" rel="noreferrer">
                  <span className="latent-mono">#{pr.number}</span> {pr.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="latent-detail-links">
            <a href={point.repo.url} target="_blank" rel="noreferrer">
              Repo ↗
            </a>
            <a href={`#oss-${point.repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
              {point.repo.prs.length > 3 ? `All ${point.repo.prs.length} PRs ↓` : "In the list ↓"}
            </a>
          </div>
        </>
      )}

      <div className="latent-nn">
        <p className="latent-mono latent-nn-head">Closest on the map</p>
        <ol>
          {nn.map((n) => {
            const q = POINT_BY_ID[n.id];
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => onPick?.(n.id)}
                  disabled={!onPick}
                  aria-label={`${q.label}${onPick ? ". Select" : ""}`}
                >
                  <span className="latent-nn-name">{q.label}</span>
                  <span className="latent-nn-bar" aria-hidden>
                    <i style={{ transform: `scaleX(${n.sim})` }} />
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function Visual({ point, compact }: { point: MapPoint; compact: boolean }) {
  if (point.kind === "project") {
    const p = point.project;
    return (
      <GlassFrame
        tone="light"
        title={p.title}
        image={p.slug === "exness" ? undefined : p.image}
        url={p.liveUrl}
        repo={p.repo}
        sizes={compact ? "(max-width: 767px) 92vw, 400px" : "(max-width: 1100px) 40vw, 440px"}
      />
    );
  }
  if (point.kind === "role") {
    return (
      <div className="latent-shot latent-shot-role">
        <span className="latent-mono">
          {point.role.start} – {point.role.end} · {point.role.location}
        </span>
        <b>{point.role.company}</b>
      </div>
    );
  }
  const r = point.repo;
  const add = r.prs.reduce((a, c) => a + c.additions, 0);
  const del = r.prs.reduce((a, c) => a + c.deletions, 0);
  return (
    <div className="latent-shot latent-shot-pr">
      <span className="latent-mono">{r.repo}</span>
      <b>
        {r.prs.length}
        <small> merged {r.prs.length === 1 ? "PR" : "PRs"}</small>
      </b>
      <span className="latent-mono latent-pr-diff">
        <em className="latent-add">+{add.toLocaleString("en-US")}</em>{" "}
        <em className="latent-del">−{del.toLocaleString("en-US")}</em> · all merged
      </span>
    </div>
  );
}
