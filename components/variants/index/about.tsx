import { site } from "./data";
import { InView } from "./in-view";

/* Opinion column: a pull quote at poster scale, the bio set in a narrow
   justified column with a drop cap, and a second quote breaking it. Both
   quotes are lifted verbatim from the bio. */
export function About() {
  const [p1, p2, p3] = site.bio;
  return (
    <div className="index-about">
      <InView className="index-pull">
        <span className="index-pull-mark" aria-hidden>
          “
        </span>
        <blockquote>
          <p>I build AI that does the work instead of just talking about it.</p>
        </blockquote>
        <p className="index-pull-by">Krishna · Founding AI/ML engineer</p>
      </InView>
      <div className="index-column">
        <p>
          <span className="index-dropcap" aria-hidden>
            {p1.charAt(0)}
          </span>
          <span className="index-sr">{p1.charAt(0)}</span>
          {p1.slice(1)}
        </p>
        <p>{p2}</p>
        <aside className="index-pull-sm" aria-label="Pull quote">
          <p>Read the code before you read the pitch.</p>
        </aside>
        <p>{p3}</p>
      </div>
    </div>
  );
}
