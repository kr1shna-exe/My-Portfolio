import { contributionsByRepo } from "@/data/open-source";
import { experience, showcase, type ShowcaseProject } from "@/data/site";
import type { ExperienceItem } from "@/data/experience";

export type ClusterId = "agents" | "memory" | "realtime" | "applied" | "oss";

export const CLUSTERS: Record<
  ClusterId,
  { label: string; short: string; x: number; y: number; rx: number; ry: number; tone: string }
> = {
  agents: { label: "Agents", short: "agents", x: 25, y: 23, rx: 15, ry: 12, tone: "cobalt" },
  memory: { label: "Memory & retrieval", short: "memory", x: 54, y: 17, rx: 13, ry: 10, tone: "pink" },
  oss: { label: "Open source", short: "upstream", x: 87, y: 28, rx: 11, ry: 18, tone: "mint" },
  applied: { label: "Applied LLM tools", short: "applied", x: 22, y: 53, rx: 13, ry: 10, tone: "lilac" },
  realtime: { label: "Real-time systems", short: "real-time", x: 66, y: 53, rx: 14, ry: 10, tone: "sun" },
};

export const CLUSTER_ORDER: ClusterId[] = ["agents", "memory", "applied", "realtime", "oss"];

type Base = { id: string; label: string; x: number; y: number };
export type MapPoint =
  | (Base & { kind: "project"; cluster: ClusterId; project: ShowcaseProject })
  | (Base & { kind: "role"; cluster: null; between: [ClusterId, ClusterId]; role: ExperienceItem })
  | (Base & { kind: "oss"; cluster: "oss"; repo: RepoGroup });

export type RepoGroup = (typeof contributionsByRepo)[number];

const proj = (slug: string) => showcase.find((p) => p.slug === slug)!;
const role = (company: string) => experience.find((e) => e.company === company)!;

// Hand-placed coordinates on a 100 x 68 plane (the map's aspect ratio).
const PROJECT_POS: Record<string, [number, number, ClusterId]> = {
  "code-boss": [19, 19, "agents"],
  vision2react: [31, 29, "agents"],
  memora: [58, 14, "memory"],
  trimfit: [17, 50, "applied"],
  twisense: [28, 57, "applied"],
  exness: [72, 50, "realtime"],
  n8n: [60, 58, "realtime"],
};

const ROLE_POS: Record<string, [number, number, [ClusterId, ClusterId]]> = {
  CompanyInsights: [42, 22, ["agents", "memory"]],
  Springreen: [47, 47, ["applied", "realtime"]],
  Beasova: [40, 60, ["applied", "realtime"]],
};

// One point per upstream project (ordered by PR count); dot size = PR count.
const OSS_POS: [number, number][] = [
  [90, 21],
  [82, 30],
  [92, 43],
  [93, 13],
  [78, 45],
  [95, 33],
  [86, 50],
  [76, 18],
];

export const POINTS: MapPoint[] = [
  ...Object.entries(PROJECT_POS).map(([slug, [x, y, cluster]]) => {
    const project = proj(slug);
    return { id: slug, kind: "project" as const, label: project.title, x, y, cluster, project };
  }),
  ...Object.entries(ROLE_POS).map(([company, [x, y, between]]) => ({
    id: `role-${company.toLowerCase()}`,
    kind: "role" as const,
    label: company,
    x,
    y,
    cluster: null,
    between,
    role: role(company),
  })),
  ...contributionsByRepo.slice(0, OSS_POS.length).map((repo, i) => ({
    id: `oss-${repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    kind: "oss" as const,
    label: repo.name,
    x: OSS_POS[i][0],
    y: OSS_POS[i][1],
    cluster: "oss" as const,
    repo,
  })),
];

/** "Similarity" is proximity on this hand-placed plane, mapped into (0, 1]. */
export function similarity(a: MapPoint, b: MapPoint) {
  const d = Math.hypot(a.x - b.x, (a.y - b.y) * 1.1);
  return Math.exp(-d / 34);
}

export const NEIGHBOURS: Record<string, { id: string; sim: number }[]> = Object.fromEntries(
  POINTS.map((p) => [
    p.id,
    POINTS.filter((q) => q.id !== p.id)
      .map((q) => ({ id: q.id, sim: similarity(p, q) }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 3),
  ])
);

export const POINT_BY_ID: Record<string, MapPoint> = Object.fromEntries(
  POINTS.map((p) => [p.id, p])
);

/** Decorative "embedding dust": seeded, so server and client agree. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const DUST: { x: number; y: number; c: ClusterId; r: number }[] = (() => {
  const rnd = mulberry32(42);
  const out: { x: number; y: number; c: ClusterId; r: number }[] = [];
  for (const id of CLUSTER_ORDER) {
    const c = CLUSTERS[id];
    for (let i = 0; i < 46; i++) {
      const u = rnd() || 1e-6;
      const v = rnd();
      const r = Math.sqrt(-2 * Math.log(u)) * 0.5;
      out.push({
        x: +(c.x + Math.cos(2 * Math.PI * v) * r * c.rx).toFixed(2),
        y: +(c.y + Math.sin(2 * Math.PI * v) * r * c.ry).toFixed(2),
        c: id,
        r: +(0.25 + rnd() * 0.35).toFixed(2),
      });
    }
  }
  return out;
})();

export function clusterOf(p: MapPoint): ClusterId[] {
  return p.kind === "role" ? p.between : [p.cluster];
}
