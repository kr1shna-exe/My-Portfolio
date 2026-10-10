import { experience, shortMonth } from "./data";
import { InView } from "./in-view";

/* Career record: one ruled column per role, newest on the left, set like
   the columns of a broadsheet page. */
export function Career() {
  return (
    <InView as="ol" className="index-career" amount={0.05}>
      {experience.map((x, i) => {
        const now = x.end === "Present";
        return (
          <li key={x.company} className="index-role" style={{ "--i": i } as React.CSSProperties}>
            <p className="index-role-dates">
              <span>
                {shortMonth(x.start)} → {now ? "now" : shortMonth(x.end)}
              </span>
              {now && (
                <span className="index-role-now">Current</span>
              )}
            </p>
            <h3 className="index-role-co">
              {x.link ? (
                <a href={x.link} target="_blank" rel="noreferrer" className="index-role-colink">
                  {x.company}
                  <span aria-hidden className="index-role-arrow">
                    ↗
                  </span>
                </a>
              ) : (
                x.company
              )}
            </h3>
            <p className="index-role-title">
              {x.role} · {x.location}
            </p>
            <p className="index-role-sum">{x.summary}</p>
            {x.highlights.length > 0 && (
              <ul className="index-role-hl">
                {x.highlights.map((h) => (
                  <li key={h}>{h.trim()}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </InView>
  );
}
