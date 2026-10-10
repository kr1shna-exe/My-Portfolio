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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-18" -> "18 Sep 2026" (no timezone drift). */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Shorten long month names in experience dates: "March 2026" -> "Mar 2026". */
export function shortMonth(s: string) {
  return s.replace(/^([A-Z][a-z]{2})[a-z]+/, "$1");
}

export const allTech = Array.from(
  new Set(showcase.filter((p) => !HIDE_DETAILS.has(p.slug)).flatMap((p) => p.tech))
);
