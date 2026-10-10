import { contributions } from "@/data/open-source";
import { anatomies } from "@/data/projects";
import { experience, featured, showcase, site } from "@/data/site";

export { anatomies, contributions, experience, featured, showcase, site };

/** Twisense's long description and stack are wrong in the data; show title, tagline, image only. */
export const HIDE_DETAILS = new Set(["twisense"]);

export const liveCount = showcase.filter((p) => p.liveUrl).length;
export const repoCount = showcase.filter((p) => p.repo).length;

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function isLive(p: (typeof showcase)[number]) {
  return Boolean(p.liveUrl) && p.status === "Live";
}

/** Shorten long month names in experience dates: "March 2026" -> "Mar 2026". */
export function shortMonth(s: string) {
  return s.replace(/^([A-Z][a-z]{2})[a-z]+/, "$1");
}
