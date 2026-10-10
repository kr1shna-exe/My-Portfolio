export type AnatomyStage = { name: string; desc: string };

export type Anatomy = {
  title: string;
  stages: AnatomyStage[];
  notes: string[];
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  tagline: string;
  status: string;
  tech: string[];
  image: string;
  links: { label: string; href: string }[];
  category?: string;
  repo?: string;
  anatomy?: Anatomy;
};

// PLACEHOLDER anatomy content for the three featured projects: stage flows
// derive from each product's real architecture as described, but the
// annotations are drafted and should be replaced with Krishna's wording.
export const anatomies: Record<string, Anatomy> = {
  "code-boss": {
    title: "Anatomy of a review",
    stages: [
      { name: "Pull request arrives", desc: "webhook, diff, linked issues" },
      { name: "AST chunking", desc: "the diff is cut by syntax tree, not by lines" },
      { name: "Context retrieval", desc: "vector search over the repo's history" },
      { name: "Agent panel", desc: "specialised reviewers, one concern each" },
      { name: "Verdict gate", desc: "findings merged, ranked, posted to the PR" },
    ],
    notes: [
      "Nothing is reviewed without its linked context; a diff alone is not a question.",
      "Line-based chunks split functions in half; AST chunks keep meaning intact.",
      "Vector context is what lets a model review like someone who has read the repo.",
      "One agent per concern beats one agent with a long prompt; disagreement is signal.",
      "The gate exists so the noisy reviewer never reaches the human.",
    ],
  },
  memora: {
    title: "Anatomy of a memory",
    stages: [
      { name: "Conversation arrives", desc: "messages, session context" },
      { name: "Tier routing", desc: "episodic, semantic, or procedural" },
      { name: "Memory write", desc: "embedded and stored in Qdrant" },
      { name: "Retrieval", desc: "vector search blended across tiers" },
      { name: "Context assembly", desc: "memories ranked into the reply" },
    ],
    notes: [
      "Not everything is worth remembering; the router decides what to forget.",
      "Three tiers because one store cannot serve recall, facts, and habits at once.",
      "Writes are gated; a bad memory poisons every later answer.",
      "Retrieval blends tiers; recency and similarity share the score.",
      "The reply carries its memories, so drift stays visible.",
    ],
  },
  vision2react: {
    title: "Anatomy of a build",
    stages: [
      { name: "Figma design in", desc: "file URL, frames, tokens" },
      { name: "Frame parsing", desc: "layout, tokens, structure extracted" },
      { name: "Parallel agents", desc: "one worker per frame" },
      { name: "Assembly", desc: "components merged, props reconciled" },
      { name: "Production code out", desc: "Next.js components, as a reviewable diff" },
    ],
    notes: [
      "Frames are isolated jobs; isolation beats context stuffing.",
      "Design tokens are extracted first so components share one vocabulary.",
      "Each worker sees one frame and nothing else; conflicts move to assembly.",
      "Assembly reconciles duplicates into shared components.",
      "The output is a diff to review, not a zip to trust.",
    ],
  },
};

export const FEATURED_SLUGS = ["code-boss", "memora", "vision2react"];

export const projects: Project[] = [
  {
    slug: "code-boss",
    title: "CodeBoss",
    description:
      "An AI-powered code review system that automatically analyzes pull requests using a multi-agent architecture that combines AST parsing, vector databases to provide context-aware code reviews on PR's.",
    tagline:
      "Multi-agent code review that reads pull requests with AST and vector context.",
    status: "Live",
    category: "AI",
    tech: ["Next.js", "Bun", "Drizzle", "Tailwind"],
    image: "/CodeBoss.png",
    links: [{ label: "Visit site", href: "https://codeboss.kr1shna.site" }],
    repo: "https://github.com/Kr1shna-exe/CodeBoss",
  },
  {
    slug: "memora",
    title: "Memora",
    description:
      "An AI-powered memory engine that learns from conversations using a three-tier memory architecture (episodic, semantic, procedural) with Qdrant vector search to provide personalized, context-aware assistance.",
    tagline:
      "A three-tier memory engine for AI: episodic, semantic, procedural, on Qdrant.",
    status: "Live",
    category: "AI",
    tech: ["Next.js", "FastAPI", "Qdrant", "PostgreSQL", "LangChain"],
    image: "/Memora.png",
    links: [{ label: "Visit site", href: "https://memora.kr1shna.site" }],
    repo: "https://github.com/kr1shna-exe/Memora",
  },
  {
    slug: "vision2react",
    title: "Vision2React",
    description:
      "Vision2React is an automated design-to-code platform that converts Figma designs into production-ready Nextjs components by using AI-powered parallel agentic workers to generate pixel-perfect code",
    tagline:
      "Figma designs to production Next.js components, generated by parallel agents.",
    status: "Live",
    category: "AI",
    tech: ["React", "Framer Motion", "Contentful"],
    image: "/Vision2React.png",
    links: [{ label: "View site", href: "https://vision2react.kr1shna.site" }],
    repo: "https://github.com/kr1shna-exe/Vision2React",
  },
  {
    slug: "n8n",
    title: "Workflow Automation",
    description:
      "A powerful, self-hosted workflow automation platform inspired by n8n. Build complex automation workflows with a visual node-based editor, connect different services, and let them work together.",
    tagline: "Self-hosted n8n-style automation engine with a visual node editor.",
    status: "Live",
    category: "Full-Stack",
    tech: ["Next.js", "Postgres", "D3.js"],
    image: "/New_N8N.png",
    links: [
      { label: "Visit site", href: "https://n8n.kr1shna.site" },
    ],
    repo: "https://github.com/kr1shna-exe/N8N",
  },
  {
    slug: "exness",
    title: "Trading Platform",
    description:
      "A high-performance, real-time cryptocurrency trading platform that has features like live price streaming, multiple timeframe candlestick charts, simple and leveraged trading positions.",
    tagline:
      "Real-time crypto trading: live streams, candlesticks, leveraged positions.",
    status: "In Production",
    category: "Full-Stack",
    tech: ["Next.js", "Postgres", "D3.js"],
    image: "/placeholders/project-dark.svg",
    links: [{ label: "Visit site", href: "" }],
    repo: "https://github.com/kr1shna-exe/Exness",
  },
  {
    slug: "trimfit",
    title: "Trimfit",
    description:
      "An AI-powered resume optimization platform that helps job seekers land more interviews faster by analyzing and tailoring resumes to specific job descriptions.",
    tagline: "Resume tailoring against real job descriptions.",
    status: "Live",
    category: "AI",
    tech: ["Next.js", "Postgres", "D3.js"],
    image: "/TrimFit.png",
    links: [{ label: "Visit site", href: "https://trimfit.kr1shna.site" }],
    repo: "https://github.com/kr1shna-exe/TrimFit",
  },
  {
    slug: "twisense",
    title: "Twisense",
    description:
      "An AI-powered resume optimization platform that helps job seekers land more interviews faster by analyzing and tailoring resumes to specific job descriptions.",
    tagline: "AI product, live.",
    status: "Live",
    category: "AI",
    tech: ["Next.js", "Postgres", "D3.js"],
    image: "/Twisense.png",
    links: [{ label: "Visit site", href: "https://twisense.kr1shna.site" }],
    repo: "https://github.com/kr1shna-exe/TWISENSE",
  },
];
