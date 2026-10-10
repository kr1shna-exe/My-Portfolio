import { site } from "./data";

const NAV = [
  { href: "#work", label: "Index" },
  { href: "#features", label: "Features" },
  { href: "#record", label: "Open source" },
  { href: "#career", label: "Career" },
  { href: "#about", label: "About" },
];

export function Masthead() {
  return (
    <header className="index-mast">
      <a href="#top" className="index-mast-mark" aria-label="Krishna, back to top">
        KRISHNA<span aria-hidden>/INDEX</span>
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
