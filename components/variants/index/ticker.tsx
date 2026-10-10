import { cn } from "@/lib/utils";

export type TickerItem = { label: string; text: string; live?: boolean };

/* A wire-service band. The visible strip is decorative and loops (CSS only,
   paused on hover and under reduced motion); screen readers get the same
   items once, as a plain list. */
export function Ticker({
  items,
  label,
  reverse = false,
  tone = "ink",
}: {
  items: TickerItem[];
  label: string;
  reverse?: boolean;
  tone?: "ink" | "paper";
}) {
  const strip = (hidden: boolean) => (
    <div className="index-tick-strip" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className="index-tick-item">
          <b>{it.label}</b>
          {it.live && <i className="index-live-dot" aria-hidden />}
          <span>{it.text}</span>
          <span className="index-tick-sep" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <aside className={cn("index-ticker", tone === "paper" && "index-ticker-paper")} aria-label={label}>
      <ul className="index-sr">
        {items.map((it, i) => (
          <li key={i}>
            {it.label}: {it.text}
          </li>
        ))}
      </ul>
      <div className={cn("index-tick-track", reverse && "index-tick-reverse")} aria-hidden>
        {strip(true)}
        {strip(true)}
      </div>
    </aside>
  );
}
