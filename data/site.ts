import { experience } from "@/data/experience";
import { FEATURED_SLUGS, projects, type Project } from "@/data/projects";

// Shared copy for the redesign variants under /v. Taken from the "Portfolio
// copy rewrite" doc (hero option A, new bio, new taglines). The live homepage
// still reads data/projects.ts directly and is unchanged.

export const site = {
  name: "Krishna",
  role: "Founding AI/ML engineer",
  company: { name: "CompanyInsights", href: "https://companyinsights.ai" },
  headline: "I ship AI that does real work, from the agent loop to the last pixel.",
  subline: "Seven products shipped, six live, every one open source.",
  email: "madamanchikrishna525@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/kr1shna-exe/" },
    { label: "X", href: "https://x.com/KrishXCodes" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/jaya-krishna-09859a227" },
  ],
  bio: [
    "I'm Krishna, and I build AI that does the work instead of just talking about it. Agents that review pull requests, memory that remembers how you think, pipelines that turn a Figma file into shipping code.",
    "Right now I'm the founding AI/ML engineer at CompanyInsights, where I own the AI stack that turns messy business data into decisions. Before that I shipped production frontends and full-stack products at Springreen and Beasova.",
    "Everything here is open source, so read the code before you read the pitch. Off the clock it's research papers, films and anime, usually in that order.",
  ],
  stats: [
    { value: "7", label: "products shipped" },
    { value: "6", label: "live right now" },
    { value: "100%", label: "open source" },
  ],
  updated: "Oct 2026",
};

/** Rewritten taglines; falls back to the project's own when not rewritten. */
const TAGLINES: Record<string, string> = {
  "code-boss": "Code review by a panel of AI agents that read the repo before the diff.",
  memora: "Long-term memory for AI: what happened, what's true, and how you work.",
  vision2react: "Drop in a Figma file, get production Next.js components back.",
  n8n: "A self-hosted n8n, built from scratch. Drag nodes, wire services, let it run.",
  exness: "Real-time crypto trading: live prices, candlesticks on every timeframe, leverage.",
  trimfit: "Paste a job description, get back the resume that gets the interview.",
};

export type ShowcaseProject = Project & { liveUrl?: string; featured: boolean };

export const showcase: ShowcaseProject[] = projects.map((p) => ({
  ...p,
  tagline: TAGLINES[p.slug] ?? p.tagline,
  liveUrl: p.links.find((l) => l.href)?.href || undefined,
  featured: FEATURED_SLUGS.includes(p.slug),
}));

export const featured = FEATURED_SLUGS.map(
  (slug) => showcase.find((p) => p.slug === slug)!
);
export const moreWork = showcase.filter((p) => !p.featured);

export { experience };

/** Every variant, for the hub page and the floating switcher. */
export const VARIANTS = [
  {
    slug: "latent",
    name: "Latent",
    pitch: "Your name forms out of particles; the work reads as a network.",
    feel: "Black and white, particles, horizontal project slides",
  },
  {
    slug: "index",
    name: "Index",
    pitch: "Broadsheet at poster scale: type does all the talking.",
    feel: "Paper and ink, giant Archivo, ink-flood rows",
  },
] as const;
