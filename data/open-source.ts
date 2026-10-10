export type Contribution = {
  /** "owner/name" of the upstream repository. */
  repo: string;
  number: number;
  /** The title the PR landed under upstream. */
  title: string;
  /** One sentence, first person, on what the change did. */
  summary: string;
  url: string;
  state: "merged" | "open" | "closed";
  /** ISO date the PR was merged (or opened, if not merged). */
  date: string;
  additions: number;
  deletions: number;
  files: number;
  /** True only for stand-in entries; variants show a visible "sample" tag. */
  sample?: boolean;
};

export type UpstreamRepo = {
  repo: string;
  name: string;
  /** One line on what the project is, for readers who don't know it. */
  description: string;
  url: string;
};

// Krishna's pull requests to other people's projects, as of 2026-10-10.
// Titles, merge dates and diff stats were read from each repository's git
// history (the squash or merge commit that landed the PR).
export const upstreamRepos: UpstreamRepo[] = [
  {
    repo: "assistant-ui/assistant-ui",
    name: "assistant-ui",
    description: "React components and runtime for AI chat interfaces",
    url: "https://github.com/assistant-ui/assistant-ui",
  },
  {
    repo: "OpenHands/OpenHands",
    name: "OpenHands",
    description: "An open platform for AI software-development agents",
    url: "https://github.com/OpenHands/OpenHands",
  },
  {
    repo: "langgenius/dify",
    name: "Dify",
    description: "An open-source platform for building LLM apps and agent workflows",
    url: "https://github.com/langgenius/dify",
  },
  {
    repo: "Kilo-Org/kilocode",
    name: "Kilo Code",
    description: "An open-source AI coding agent",
    url: "https://github.com/Kilo-Org/kilocode",
  },
  {
    repo: "generalaction/emdash",
    name: "Emdash",
    description: "A desktop app for running many coding agents in parallel",
    url: "https://github.com/generalaction/emdash",
  },
  {
    repo: "reflex-dev/reflex",
    name: "Reflex",
    description: "Full-stack web apps in pure Python",
    url: "https://github.com/reflex-dev/reflex",
  },
];

const pr = (
  repo: string,
  number: number,
  title: string,
  summary: string,
  date: string,
  files: number,
  additions: number,
  deletions: number
): Contribution => ({
  repo,
  number,
  title,
  summary,
  url: `https://github.com/${repo}/pull/${number}`,
  state: "merged",
  date,
  files,
  additions,
  deletions,
});

/** Newest first. */
export const contributions: Contribution[] = [
  pr("assistant-ui/assistant-ui", 9050, "fix(react-pi): resubscribe a mounted thread after a decoder limit ends its stream", "A thread that hit the stream decoder's limit went silent; now it reconnects on its own.", "2026-10-09", 7, 79, 1),
  pr("reflex-dev/reflex", 7410, "fix(state): avoid leaking filtered async vars", "Async vars that should have been filtered out could still leak into state updates; now they don't.", "2026-10-09", 4, 129, 17),
  pr("Kilo-Org/kilocode", 14809, "fix(cli): clean up MCP servers when their startup is interrupted", "Interrupting startup left MCP server processes running; they're now cleaned up, with a test that waits on the real client instead of sleeping.", "2026-10-09", 8, 245, 1),
  pr("Kilo-Org/kilocode", 14816, "fix(cli): reuse the loaded transcript when pruning large payloads", "Pruning large payloads re-read the whole transcript; it now reuses the one already in memory.", "2026-10-09", 5, 126, 30),
  pr("generalaction/emdash", 3308, "fix(open-in): try the user's default terminal on Linux", "\"Open in terminal\" on Linux now tries the user's default terminal before falling back.", "2026-10-09", 3, 45, 1),
  pr("assistant-ui/assistant-ui", 9046, "fix(core): stop applying transport snapshots after cancel", "Cancelling a run could still let late transport snapshots overwrite the thread; they're now ignored.", "2026-10-08", 4, 63, 1),
  pr("assistant-ui/assistant-ui", 9026, "fix(core): retry failed interactable saves", "A failed interactable save used to be dropped; it now retries on flush or with the next save.", "2026-10-08", 5, 890, 27),
  pr("assistant-ui/assistant-ui", 9021, "fix(core): preserve edits across persistence adapter switches", "Switching back to a persistence adapter mid-save could lose an edit; the queue now keeps it.", "2026-10-08", 5, 490, 27),
  pr("OpenHands/OpenHands", 17876, "fix(e2e): preserve mock validation trajectories", "Made the mock-LLM end-to-end suite keep its validation trajectories intact.", "2026-10-08", 7, 155, 15),
  pr("generalaction/emdash", 3298, "fix(terminals): stop resizing xterm without its PTY on remount", "Switching tasks remounted the terminal and resized xterm before its PTY existed; fixed and covered by tests.", "2026-10-08", 2, 171, 37),
  pr("assistant-ui/assistant-ui", 8934, "fix(core): keep committed thread deletions successful", "A thread deletion that had already committed could be reported as failed; it now stays successful.", "2026-10-07", 4, 157, 19),
  pr("assistant-ui/assistant-ui", 8903, "fix: follow thread content that grows without a DOM change", "Auto-scroll now keeps following thread content that grows without a DOM change.", "2026-10-06", 5, 213, 40),
  pr("assistant-ui/assistant-ui", 8922, "fix(core): withdraw a frame's tools from the parent when its last cross-origin provider unsubscribes", "An embedded frame's tools lingered in the parent after its last cross-origin provider left; they're now withdrawn.", "2026-10-06", 3, 180, 14),
  pr("assistant-ui/assistant-ui", 8924, "fix(core): reject a disposed frame's tool calls instead of waiting 30 s", "Tool calls to a disposed frame hung for 30 seconds; they now fail immediately.", "2026-10-06", 12, 178, 12),
  pr("assistant-ui/assistant-ui", 8926, "fix(core): keep a new thread's automatic title when its runtime restarts during first initialize", "A new thread could lose its auto-generated title if the runtime restarted while it was first initializing.", "2026-10-06", 6, 376, 217),
  pr("OpenHands/OpenHands", 17869, "feat(files): configure workspace file discovery", "Made workspace file discovery configurable from settings, with tests.", "2026-10-05", 21, 982, 54),
  pr("OpenHands/OpenHands", 17855, "test(catalog): remove upstream data mirrors", "Removed tests that only mirrored upstream catalog data.", "2026-10-05", 2, 0, 63),
  pr("langgenius/dify", 43347, "refactor(api): enable strict typing for migration tests", "Brought the legacy model-type migration tests under strict type checking.", "2026-10-02", 2, 165, 130),
  pr("langgenius/dify", 43342, "refactor(api): enable strict typing for agent controller tests", "Brought the agent controller tests under strict type checking.", "2026-10-02", 2, 55, 51),
];

export const mergedContributions = contributions.filter(
  (c) => c.state === "merged"
);

export function repoInfo(repo: string): UpstreamRepo {
  return (
    upstreamRepos.find((r) => r.repo === repo) ?? {
      repo,
      name: repo.split("/")[1],
      description: "",
      url: `https://github.com/${repo}`,
    }
  );
}

/** PRs grouped by repository, repos ordered by PR count. */
export const contributionsByRepo = upstreamRepos
  .map((r) => ({ ...r, prs: contributions.filter((c) => c.repo === r.repo) }))
  .filter((r) => r.prs.length > 0)
  .sort((a, b) => b.prs.length - a.prs.length);

export const contributionStats = {
  merged: mergedContributions.length,
  repos: new Set(contributions.map((c) => c.repo)).size,
  linesAdded: contributions.reduce((sum, c) => sum + c.additions, 0),
  linesRemoved: contributions.reduce((sum, c) => sum + c.deletions, 0),
  files: contributions.reduce((sum, c) => sum + c.files, 0),
  /** First and last merge dates, ISO. */
  since: contributions.reduce((a, c) => (c.date < a ? c.date : a), contributions[0].date),
  latest: contributions.reduce((a, c) => (c.date > a ? c.date : a), contributions[0].date),
  hasSamples: contributions.some((c) => c.sample),
};
