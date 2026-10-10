import { site } from "./data";

const NAV = [
  { href: "#work", label: "Work" },
  { href: "#features", label: "Featured" },
  { href: "#open-source", label: "Open source" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
];

export function Masthead() {
  return (
    <header className="index-mast">
      <a href="#top" className="index-mast-mark" aria-label="Krishna, back to top">
        KRISHNA
      </a>
      <nav aria-label="Sections" className="index-mast-nav">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="index-mast-link">
            {n.label}
          </a>
        ))}
      </nav>
      <a href={`mailto:${site.email}`} className="index-mast-cta">
        Contact<span aria-hidden> ↗</span>
      </a>
    </header>
  );
}
