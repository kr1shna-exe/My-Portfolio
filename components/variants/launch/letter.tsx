import { site } from "@/data/site";

import { Reveal } from "./reveal";

export function Letter() {
  return (
    <section id="about" className="launch-section" aria-labelledby="launch-about-h">
      <div className="launch-wrap">
        <Reveal className="launch-head is-center">
          <span className="launch-eyebrow">05 · About</span>
          <h2 id="launch-about-h" className="launch-h2">
            The short version.
          </h2>
        </Reveal>
        <Reveal className="launch-card launch-letter">
          <div className="launch-letter-top">
            <span>From: {site.name}</span>
            <span>{site.updated}</span>
          </div>
          {site.bio.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <div className="launch-sign">
            <div>
              <div className="launch-sign-name" aria-hidden>
                {site.name}
              </div>
              <div className="launch-sign-role">
                {site.role}, {site.company.name}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
