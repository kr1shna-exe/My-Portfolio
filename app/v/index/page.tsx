import { VariantSwitcher } from "@/components/variants/switcher";
import { About } from "@/components/variants/index/about";
import { Career } from "@/components/variants/index/career";
import { Contact } from "@/components/variants/index/contact";
import { contributionStats } from "@/data/open-source";
import { liveCount, showcase, site } from "@/components/variants/index/data";
import { IndexHero } from "@/components/variants/index/hero";
import { InkEdge } from "@/components/variants/index/ink-edge";
import { SectionHead } from "@/components/variants/index/in-view";
import { Ledger } from "@/components/variants/index/ledger";
import { Masthead } from "@/components/variants/index/masthead";
import { FeatureSheets } from "@/components/variants/index/sheets";
import { WorkIndex } from "@/components/variants/index/work-index";

export default function IndexPage() {
  return (
    <div data-variant="index" className="index-root">
      <InkEdge />
      <Masthead />
      <main id="main">
        <IndexHero />

        <section id="work" className="index-section" aria-labelledby="work-title">
          <SectionHead
            id="work-title"
            title="Work"
            aside={`${showcase.length} projects, ${liveCount} live`}
          />
          <WorkIndex />
        </section>

        <section id="features" aria-labelledby="features-title" className="index-features">
          <div className="index-section index-section-tight">
            <SectionHead
              id="features-title"
              title="Featured"
              aside="How each one works, stage by stage"
            />
          </div>
          <FeatureSheets />
        </section>

        <section id="open-source" className="index-section index-record" aria-labelledby="oss-title">
          <SectionHead
            id="oss-title"
            title="Open source"
            aside={`${contributionStats.merged} merged pull requests to ${contributionStats.repos} projects I don't maintain`}
          />
          <Ledger />
        </section>

        <section id="experience" className="index-section" aria-labelledby="career-title">
          <SectionHead id="career-title" title="Experience" />
          <Career />
        </section>

        <section id="about" className="index-section" aria-labelledby="about-title">
          <SectionHead id="about-title" title="About" />
          <About />
        </section>
      </main>

      <footer id="contact" className="index-foot" aria-labelledby="contact-title">
        <div className="index-section">
          <SectionHead
            id="contact-title"
            title="Contact"
            tone="ink"
          />
          <Contact />
          <div className="index-colophon">
            <span>{site.name}</span>
            <span>Updated {site.updated}</span>
          </div>
        </div>
      </footer>
      <VariantSwitcher current="index" />
    </div>
  );
}
