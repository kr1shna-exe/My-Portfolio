import { VariantSwitcher } from "@/components/variants/switcher";
import { About } from "@/components/variants/index/about";
import { Career } from "@/components/variants/index/career";
import { Contact } from "@/components/variants/index/contact";
import { contributionsByRepo, contributionStats } from "@/data/open-source";
import {
  allTech,
  featured,
  pad,
  showcase,
  site,
} from "@/components/variants/index/data";
import { IndexHero } from "@/components/variants/index/hero";
import { SectionHead } from "@/components/variants/index/in-view";
import { Ledger } from "@/components/variants/index/ledger";
import { Masthead } from "@/components/variants/index/masthead";
import { FeatureSheets } from "@/components/variants/index/sheets";
import { Ticker, type TickerItem } from "@/components/variants/index/ticker";
import { WorkIndex } from "@/components/variants/index/work-index";

const shipping: TickerItem[] = [
  { label: "Now shipping", text: `the AI stack at ${site.company.name}`, live: true },
  {
    label: "Merged upstream",
    text: `${contributionStats.merged} PRs into ${contributionsByRepo.map((g) => g.name).join(", ")}`,
  },
  ...showcase.map((p) => ({
    label: p.title,
    text: p.liveUrl ? p.liveUrl.replace(/^https?:\/\//, "") : p.status.toLowerCase(),
    live: Boolean(p.liveUrl) && p.status === "Live",
  })),
];

const stack: TickerItem[] = allTech.map((t) => {
  const n = showcase.filter((p) => p.slug !== "twisense" && p.tech.includes(t)).length;
  return { label: t, text: `in ${n} ${n === 1 ? "product" : "products"}` };
});

export default function IndexPage() {
  return (
    <div data-variant="index" className="index-root">
      <Masthead />
      <main id="main">
        <IndexHero />

        <Ticker items={shipping} label="Now shipping" />

        <section id="work" className="index-section" aria-labelledby="work-title">
          <SectionHead
            id="work-title"
            code="A2 · The Index"
            title="Index of work"
            aside={`${pad(showcase.length)} entries · ${pad(featured.length)} features`}
          />
          <WorkIndex />
        </section>

        <section id="features" aria-labelledby="features-title" className="index-features">
          <div className="index-section index-section-tight">
            <SectionHead
              id="features-title"
              code="A3 · Features"
              title="Three, in depth"
              aside="Each one taken apart, stage by stage"
            />
          </div>
          <FeatureSheets />
        </section>

        <section id="record" className="index-section index-record" aria-labelledby="record-title">
          <SectionHead
            id="record-title"
            code="B1 · Markets"
            title="Contributions on record"
            aside={`${contributionStats.merged} merged PRs · ${pad(contributionStats.repos)} projects I don't own`}
          />
          <Ledger />
        </section>

        <Ticker items={stack} label="The stack" reverse tone="paper" />

        <section id="career" className="index-section" aria-labelledby="career-title">
          <SectionHead id="career-title" code="C1 · Career" title="Career record" aside="Newest first" />
          <Career />
        </section>

        <section id="about" className="index-section" aria-labelledby="about-title">
          <SectionHead id="about-title" code="C2 · Column" title="In my own words" aside="Opinion" />
          <About />
        </section>
      </main>

      <footer id="contact" className="index-foot" aria-labelledby="contact-title">
        <div className="index-section">
          <SectionHead
            id="contact-title"
            code="D1 · Correspondence"
            title="Letters to the editor"
            aside="By email, or elsewhere"
            tone="ink"
          />
          <Contact />
          <div className="index-colophon">
            <span>KRISHNA/INDEX</span>
            <span>Set in Archivo and Spline Sans Mono</span>
            <span>Every product open source</span>
            <span>Updated {site.updated}</span>
          </div>
        </div>
      </footer>
      <VariantSwitcher current="index" />
    </div>
  );
}
