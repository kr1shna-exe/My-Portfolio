import { showcase } from "@/data/site";

const ALIAS: Record<string, string> = { Postgres: "PostgreSQL" };

function techList() {
  const seen = new Set<string>();
  const out: string[] = [];
  // Twisense's metadata is unreliable, so leave it out of the stack.
  for (const p of showcase.filter((p) => p.slug !== "twisense")) {
    for (const t of p.tech) {
      const name = ALIAS[t] ?? t;
      if (!seen.has(name)) {
        seen.add(name);
        out.push(name);
      }
    }
  }
  return out;
}

function Track({ tech, hidden }: { tech: string[]; hidden?: boolean }) {
  return (
    <ul className="launch-marquee-track" aria-hidden={hidden || undefined} role="list">
      {tech.map((t) => (
        <li key={t} className="launch-marquee-item">
          <i aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function BuiltWith() {
  const tech = techList();
  return (
    <section className="launch-built" aria-label="Built with">
      <p className="launch-built-label">The stack behind seven shipped products</p>
      <div className="launch-marquee">
        <Track tech={tech} />
        <Track tech={tech} hidden />
      </div>
    </section>
  );
}
