import { VariantSwitcher } from "@/components/variants/switcher";
import { Contact } from "@/components/variants/trace/contact";
import { Hero } from "@/components/variants/trace/hero";
import { RUN_ID } from "@/components/variants/trace/meta";
import { MoreWork } from "@/components/variants/trace/more-work";
import { Outbound } from "@/components/variants/trace/outbound";
import { PaletteProvider } from "@/components/variants/trace/palette";
import { SystemPrompt } from "@/components/variants/trace/prompt";
import { SectionHead } from "@/components/variants/trace/section-head";
import { Timeline } from "@/components/variants/trace/timeline";
import { Topbar } from "@/components/variants/trace/topbar";
import { Work } from "@/components/variants/trace/work";
import { contributionStats } from "@/data/open-source";
import { featured, moreWork, site } from "@/data/site";

export default function TracePage() {
  return (
    <div data-variant="trace" className="trace-root">
      <PaletteProvider>
        <Topbar />
        <main id="main" className="trace-main">
          <Hero />

          <section id="work" className="trace-sec" aria-labelledby="trace-h-work">
            <SectionHead
              index="01"
              kind="trace"
              name="work.featured"
              id="trace-h-work"
              title="Every product, as the trace of its own pipeline."
              lede={`${featured.length} featured runs. Pick one; every stage of how it works becomes a span in the waterfall. Hover a span for detail.`}
            />
            <Work />
          </section>

          <section id="more" className="trace-sec" aria-labelledby="trace-h-more">
            <SectionHead
              index="02"
              kind="children"
              name="work.more"
              id="trace-h-more"
              title="More runs."
              lede={`${moreWork.length} more products, from a self-hosted automation engine to a real-time trading platform.`}
            />
            <MoreWork />
          </section>

          <section id="outbound" className="trace-sec" aria-labelledby="trace-h-outbound">
            <SectionHead
              index="03"
              kind="outbound"
              name="open_source.calls"
              id="trace-h-outbound"
              title="Outbound calls."
              lede={`${contributionStats.merged} pull requests merged into ${contributionStats.repos} AI and dev-tool projects other people run. Pick a project to filter the log; every title opens the PR.`}
            />
            <Outbound />
          </section>

          <section id="timeline" className="trace-sec" aria-labelledby="trace-h-timeline">
            <SectionHead
              index="04"
              kind="long-running"
              name="experience"
              id="trace-h-timeline"
              title="A long-running trace."
              lede="Every role I've held, on one time axis. The amber one is still running."
            />
            <Timeline />
          </section>

          <section id="prompt" className="trace-sec" aria-labelledby="trace-h-prompt">
            <SectionHead
              index="05"
              kind="config"
              name="about.system_prompt"
              id="trace-h-prompt"
              title="System prompt."
              lede="The short version of who's behind the runs."
            />
            <SystemPrompt />
          </section>

          <section id="contact" className="trace-sec trace-sec-last" aria-labelledby="trace-h-contact">
            <SectionHead
              index="06"
              kind="io"
              name="contact"
              id="trace-h-contact"
              title="Open a channel."
              lede="Email is fastest. Or press Ctrl K (Cmd K on a Mac) from anywhere on the page."
            />
            <Contact />
          </section>
        </main>
        <footer className="trace-foot">
          <span>
            <b>krishna</b> / run <span className="trace-num">{RUN_ID}</span>
          </span>
          <span className="trace-foot-mid">
            <i className="trace-dot trace-dot-amber trace-pulse" aria-hidden /> 1 span still running ·
            CompanyInsights
          </span>
          <span>updated {site.updated}</span>
        </footer>
      </PaletteProvider>
      <VariantSwitcher current="trace" />
    </div>
  );
}
