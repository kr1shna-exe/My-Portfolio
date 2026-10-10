export type Decision = {
  date: string;
  call: string;
  why: string;
  price: string;
  product: string;
};

// PLACEHOLDER ENTRIES: the calls reflect real stack choices visible in the
// projects, but the reasons and prices are drafted. Replace with Krishna's
// own wording (sourced from his X posts) when that data arrives.
export const decisions: Decision[] = [
  {
    date: "Feb 2026",
    call: "Qdrant over pgvector for memory search",
    why: "three memory tiers need per-collection tuning.",
    price: "one more service to run.",
    product: "memora",
  },
  {
    date: "Jan 2026",
    call: "Reviews gated by AST context, not diff lines",
    why: "line diffs lie about scope.",
    price: "slower first pass on large PRs.",
    product: "codeboss",
  },
  {
    date: "Nov 2025",
    call: "Bun for the review pipeline runtime",
    why: "startup latency dominated per-PR cost.",
    price: "a few ecosystem workarounds.",
    product: "codeboss",
  },
  {
    date: "Oct 2025",
    call: "Parallel agents per Figma frame, not one big pass",
    why: "isolation beats context stuffing.",
    price: "merge conflicts moved to assembly.",
    product: "vision2react",
  },
  {
    date: "Aug 2025",
    call: "Visual node editor built on D3, not a canvas lib",
    why: "the graph is data first.",
    price: "wrote my own hit-testing.",
    product: "workflow automation",
  },
  {
    date: "Jun 2025",
    call: "Candlesticks stream over websockets, render on demand",
    why: "paint cost, not network, was the ceiling.",
    price: "more client state.",
    product: "trading platform",
  },
];
