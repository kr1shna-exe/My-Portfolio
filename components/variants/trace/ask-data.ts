import { contributionStats, contributionsByRepo } from "@/data/open-source";
import { site } from "@/data/site";

/* Canned answers for the "Ask this portfolio" console. Every sentence is
   restated from data/site.ts, data/projects.ts or data/experience.ts; nothing
   here is new information. A visitor's free text is matched to the nearest
   answer by keyword, and the reply is replayed token by token. */

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (iso: string) => {
  const [, m, d] = iso.split("-").map(Number);
  return `${MON[m - 1]} ${d}`;
};
const repoList = contributionsByRepo.map((r) => `${r.name} (${r.prs.length})`);
const OSS_TEXT = `${contributionStats.merged} pull requests merged into ${contributionStats.repos} projects other people run, between ${day(contributionStats.since)} and ${day(contributionStats.latest)}: ${repoList.slice(0, -1).join(", ")} and ${repoList[repoList.length - 1]}. Mostly fixes: a thread that reconnects after hitting the stream decoder's limit, MCP servers cleaned up when startup is interrupted, edits that survive a persistence adapter switch. That's +${contributionStats.linesAdded.toLocaleString("en-US")} / −${contributionStats.linesRemoved.toLocaleString("en-US")} lines across ${contributionStats.files} files.`;

export type Source = {
  /** Shown in the span name, e.g. "site.bio" */
  id: string;
  /** Section anchor the citation jumps to */
  href: string;
  /** Replay duration for this retrieval span, in ms */
  ms: number;
};

export type Answer = {
  id: string;
  /** Short chip label */
  chip: string;
  /** The question as echoed in the transcript */
  question: string;
  text: string;
  sources: Source[];
  keywords: string[];
};

export const ANSWERS: Answer[] = [
  {
    id: "shipped",
    chip: "What have you shipped?",
    question: "What have you shipped?",
    text: "Seven products shipped, six live right now, and every one is open source. Start with three. CodeBoss: code review by a panel of AI agents that read the repo before the diff. Memora: long-term memory for AI, covering what happened, what's true, and how you work. Vision2React: drop in a Figma file, get production Next.js components back.",
    sources: [
      { id: "site.subline", href: "#top", ms: 120 },
      { id: "work.featured", href: "#work", ms: 210 },
    ],
    keywords: ["shipped", "ship", "built", "build", "product", "project", "portfolio", "made", "work", "launch", "live"],
  },
  {
    id: "agents",
    chip: "What do your agents do?",
    question: "What have you built with agents?",
    text: "Two products are built around teams of agents. CodeBoss reviews pull requests with a panel of specialised reviewers, one concern each, and a verdict gate that merges and ranks what they find. Vision2React runs one agent per Figma frame in parallel, then assembles the result. At CompanyInsights I'm building agentic workflows over business data.",
    sources: [
      { id: "anatomy.code-boss", href: "#work", ms: 180 },
      { id: "anatomy.vision2react", href: "#work", ms: 240 },
      { id: "experience.companyinsights", href: "#timeline", ms: 150 },
    ],
    keywords: ["agent", "agents", "agentic", "multi-agent", "llm", "ai", "autonomous", "parallel"],
  },
  {
    id: "codeboss",
    chip: "How does CodeBoss review a PR?",
    question: "How does CodeBoss review a pull request?",
    text: "A pull request arrives by webhook, with its diff and linked issues. CodeBoss cuts the diff by syntax tree, not by lines, then runs vector search over the repo's history for context. A panel of specialised reviewers takes one concern each, and a verdict gate merges and ranks the findings before posting them to the PR.",
    sources: [
      { id: "anatomy.code-boss", href: "#work", ms: 190 },
      { id: "projects.code-boss", href: "#work", ms: 130 },
    ],
    keywords: ["codeboss", "code boss", "review", "reviewer", "pull request", "diff", "ast", "syntax", "webhook", "github"],
  },
  {
    id: "memora",
    chip: "How does Memora remember?",
    question: "How does Memora remember things?",
    text: "Memora keeps three tiers of memory: episodic for what happened, semantic for what's true, procedural for how you work. Each conversation is routed to a tier, embedded and written to Qdrant. On recall, vector search blends across the tiers, and the ranked memories are assembled into the reply.",
    sources: [
      { id: "anatomy.memora", href: "#work", ms: 200 },
      { id: "projects.memora", href: "#work", ms: 140 },
    ],
    keywords: ["memora", "memory", "memories", "remember", "tier", "tiers", "episodic", "semantic", "procedural", "qdrant", "recall", "vector"],
  },
  {
    id: "vision2react",
    chip: "Figma to code, how?",
    question: "How does Vision2React turn Figma into code?",
    text: "Give it a Figma file URL. It parses every frame for layout, tokens and structure, then runs one agent per frame in parallel. Assembly merges the components and reconciles their props, and what comes out is production Next.js components as a reviewable diff.",
    sources: [
      { id: "anatomy.vision2react", href: "#work", ms: 210 },
      { id: "projects.vision2react", href: "#work", ms: 120 },
    ],
    keywords: ["vision2react", "vision", "figma", "design", "frame", "frames", "design-to-code", "components", "react", "pixel"],
  },
  {
    id: "now",
    chip: "What are you building now?",
    question: "What are you working on now?",
    text: "I'm the founding AI/ML engineer at CompanyInsights, since March 2026. I lead the design and development of the AI-native systems behind CompanyInsights.ai: agentic workflows, retrieval pipelines and scalable LLM infrastructure that turn unstructured business data into actionable insights.",
    sources: [
      { id: "experience.companyinsights", href: "#timeline", ms: 160 },
      { id: "site.bio", href: "#prompt", ms: 110 },
    ],
    keywords: ["now", "current", "currently", "today", "companyinsights", "company insights", "job", "role", "founding", "employer", "building"],
  },
  {
    id: "experience",
    chip: "Where have you worked?",
    question: "Where have you worked?",
    text: "Three roles so far. Founding AI/ML engineer at CompanyInsights, March 2026 to now. Full-stack engineer at Springreen, Oct 2024 to Feb 2025, where I produced ApeHR's marketing experience. Lead frontend engineer at Beasova, Aug to Sep 2024, shipping client web apps with React, Tailwind CSS and the MERN stack.",
    sources: [
      { id: "experience.timeline", href: "#timeline", ms: 230 },
    ],
    keywords: ["experience", "worked", "career", "springreen", "beasova", "history", "resume", "cv", "before", "previous", "jobs", "background", "apehr"],
  },
  {
    id: "stack",
    chip: "What's your stack?",
    question: "What's your stack?",
    text: "Across the seven products: Next.js, React and Tailwind on the front, Bun, FastAPI and Drizzle behind them, PostgreSQL and Qdrant for data, LangChain in Memora, and D3.js for the charts.",
    sources: [
      { id: "projects.*.tech", href: "#work", ms: 260 },
    ],
    keywords: ["stack", "tech", "technology", "tools", "language", "languages", "framework", "nextjs", "next.js", "python", "fastapi", "typescript", "postgres", "langchain", "bun"],
  },
  {
    id: "more",
    chip: "What else is there?",
    question: "What else have you built?",
    text: "Four more besides the featured three. Workflow Automation: a self-hosted n8n, built from scratch, where you drag nodes and wire services. Trading Platform: real-time crypto trading with live prices, candlesticks on every timeframe, and leverage. Trimfit: paste a job description, get back the resume that gets the interview. And Twisense.",
    sources: [
      { id: "work.more", href: "#more", ms: 200 },
    ],
    keywords: ["n8n", "workflow", "automation", "trading", "crypto", "candlestick", "trimfit", "twisense", "else", "other", "more", "side"],
  },
  {
    id: "oss",
    chip: "What have you merged upstream?",
    question: "Do you contribute to open source?",
    text: OSS_TEXT,
    sources: [
      { id: "open-source.contributions", href: "#outbound", ms: 220 },
      { id: "open-source.repos", href: "#outbound", ms: 140 },
    ],
    keywords: ["open source", "open-source", "oss", "contribute", "contribution", "contributions", "pr", "prs", "upstream", "merged", "assistant-ui", "openhands", "dify", "kilo", "kilocode", "emdash", "reflex", "repos"],
  },
  {
    id: "offclock",
    chip: "What about off the clock?",
    question: "What do you do off the clock?",
    text: "Research papers, films and anime, usually in that order.",
    sources: [
      { id: "site.bio", href: "#prompt", ms: 90 },
    ],
    keywords: ["hobby", "hobbies", "fun", "free time", "off", "outside", "film", "films", "movie", "anime", "papers", "interests", "weekend", "personal"],
  },
  {
    id: "contact",
    chip: "How do I reach you?",
    question: "How do I reach you?",
    text: `Email is fastest: ${site.email}. I'm also on GitHub as kr1shna-exe, on X as KrishXCodes, and on LinkedIn. Press Ctrl K (or Cmd K) anywhere on this page to copy the email.`,
    sources: [
      { id: "site.socials", href: "#contact", ms: 80 },
    ],
    keywords: ["contact", "email", "mail", "reach", "hire", "hiring", "talk", "linkedin", "twitter", "x", "message", "dm", "call", "connect"],
  },
];

/** The chips shown by default under the console. */
export const SUGGESTED = ["shipped", "agents", "oss", "memora", "now"];

export const FALLBACK: Answer = {
  id: "fallback",
  chip: "",
  question: "",
  text: "Nothing on this site answers that directly, and I'd rather not guess. I can tell you what I've shipped, how CodeBoss reviews a PR, how Memora remembers, what I'm building now, or how to reach me.",
  sources: [],
  keywords: [],
};

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Returns the index into ANSWERS of the best keyword match, or -1. */
export function matchQuestion(raw: string): number {
  const text = ` ${raw.toLowerCase().replace(/[^a-z0-9.+#\s-]/g, " ").replace(/\s+/g, " ")} `;
  let best = -1;
  let bestScore = 0;
  ANSWERS.forEach((a, i) => {
    let score = 0;
    for (const kw of a.keywords) {
      if (kw.includes(" ") || kw.includes("-")) {
        if (text.includes(kw)) score += 3;
      } else if (kw.length <= 2) {
        if (new RegExp(`\\s${escapeRe(kw)}\\s`).test(text)) score += 1;
      } else if (new RegExp(`[\\s]${escapeRe(kw)}`).test(text)) {
        score += kw.length > 5 ? 2 : 1.5;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return best;
}
