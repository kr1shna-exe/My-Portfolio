import { site, showcase } from "@/data/site";

/** Deterministic short run id derived from the site's own content. */
function hash(input: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export const RUN_ID = `0x${hash(site.name + site.updated + site.headline).slice(0, 6)}`;
export const LIVE_COUNT = showcase.filter((p) => p.liveUrl).length;
export const SHIPPED_COUNT = showcase.length;

/** One span color per product, used everywhere that product appears. */
export const PROJECT_COLOR: Record<string, string> = {
  "code-boss": "var(--tr-peri)",
  memora: "var(--tr-mint)",
  vision2react: "var(--tr-rose)",
  n8n: "var(--tr-mint)",
  exness: "var(--tr-dim)",
  trimfit: "var(--tr-peri)",
  twisense: "var(--tr-rose)",
};

export const SECTIONS = [
  { id: "work", label: "work", title: "Featured work" },
  { id: "more", label: "more", title: "More work" },
  { id: "outbound", label: "open source", title: "Open source" },
  { id: "timeline", label: "timeline", title: "Experience" },
  { id: "prompt", label: "about", title: "About" },
  { id: "contact", label: "contact", title: "Contact" },
] as const;

export function host(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
