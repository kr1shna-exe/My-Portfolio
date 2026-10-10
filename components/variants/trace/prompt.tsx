import { showcase, site } from "@/data/site";

type Line = { kind: "comment" | "text" | "kv" | "tag" | "blank"; text?: string; k?: string; v?: string; href?: string };

const LINES: Line[] = [
  { kind: "tag", text: "<system>" },
  { kind: "comment", text: "# identity" },
  { kind: "text", text: `You are ${site.name}. ${site.role} at ${site.company.name}.` },
  { kind: "blank" },
  { kind: "comment", text: "# about" },
  ...site.bio.map<Line>((p) => ({ kind: "text", text: p })),
  { kind: "blank" },
  { kind: "comment", text: "# tools" },
  { kind: "kv", k: "email", v: site.email, href: `mailto:${site.email}` },
  ...site.socials.map<Line>((s) => ({
    kind: "kv",
    k: s.label.toLowerCase(),
    v: s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
    href: s.href,
  })),
  { kind: "tag", text: "</system>" },
];

const stack = [...new Set(showcase.flatMap((p) => (p.slug === "twisense" ? [] : p.tech)))];

const CONFIG: [string, string | number | string[]][] = [
  ["role", site.role],
  ["company", site.company.name],
  ...site.stats.map<[string, string | number]>((s) => [
    s.label.replace(/\s+/g, "_"),
    /^\d+$/.test(s.value) ? Number(s.value) : s.value,
  ]),
  ["stack", stack],
  ["updated", site.updated],
];

function JsonValue({ v }: { v: string | number | string[] }) {
  if (typeof v === "number") return <span className="trace-js-num">{v}</span>;
  if (Array.isArray(v))
    return (
      <>
        <span className="trace-js-p">[</span>
        {v.map((x, i) => (
          <span key={x} className="trace-js-arr">
            <span className="trace-js-str">&quot;{x}&quot;</span>
            {i < v.length - 1 && <span className="trace-js-p">, </span>}
          </span>
        ))}
        <span className="trace-js-p">]</span>
      </>
    );
  return <span className="trace-js-str">&quot;{v}&quot;</span>;
}

const wordCount = site.bio.join(" ").split(/\s+/).length;

export function SystemPrompt() {
  return (
    <div className="trace-sp-wrap">
    <div className="trace-sp">
      <div className="trace-sp-bar">
        <span className="trace-sp-tabs" aria-hidden>
          <span className="trace-sp-tab is-on">system_prompt.md</span>
        </span>
        <span className="trace-dimlabel trace-num" aria-hidden>
          {wordCount} words · read only
        </span>
      </div>
      <ol className="trace-sp-code">
        {LINES.map((l, i) => (
          <li key={i} className={`trace-sp-line is-${l.kind}`}>
            <span className="trace-sp-gutter trace-num" aria-hidden>
              {i + 1}
            </span>
            <span className="trace-sp-text">
              {l.kind === "kv" ? (
                <>
                  <span className="trace-sp-k">{l.k}</span>
                  <span className="trace-sp-colon">: </span>
                  <a
                    href={l.href}
                    className="trace-sp-v"
                    {...(l.href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  >
                    {l.v}
                  </a>
                </>
              ) : l.kind === "blank" ? (
                " "
              ) : (
                l.text
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
    <div className="trace-sp trace-cfg">
      <div className="trace-sp-bar">
        <span className="trace-sp-tabs" aria-hidden>
          <span className="trace-sp-tab is-on">config.json</span>
        </span>
      </div>
      <dl className="trace-js">
        <span className="trace-js-p" aria-hidden>
          {"{"}
        </span>
        {CONFIG.map(([k, v], i) => (
          <div key={k} className="trace-js-row">
            <dt>
              <span className="trace-js-key">&quot;{k}&quot;</span>
              <span className="trace-js-p">: </span>
            </dt>
            <dd>
              <JsonValue v={v} />
              {i < CONFIG.length - 1 && <span className="trace-js-p">,</span>}
            </dd>
          </div>
        ))}
        <span className="trace-js-p" aria-hidden>
          {"}"}
        </span>
      </dl>
    </div>
    </div>
  );
}
