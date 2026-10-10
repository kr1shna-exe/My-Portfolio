import { VariantSwitcher } from "@/components/variants/switcher";
import { Hero } from "@/components/variants/launch/hero";
import { BuiltWith } from "@/components/variants/launch/built-with";
import { FeaturedBento } from "@/components/variants/launch/featured";
import { MoreWork } from "@/components/variants/launch/more-work";
import { OpenSource } from "@/components/variants/launch/open-source";
import { Experience } from "@/components/variants/launch/experience";
import { Letter } from "@/components/variants/launch/letter";
import { FinalCta, Footer } from "@/components/variants/launch/contact";
import { Nav } from "@/components/variants/launch/nav";

export default function LaunchPage() {
  return (
    <>
    <div data-variant="launch" className="launch-root">
      <div className="launch-ground" aria-hidden>
        <div className="launch-aurora">
          <div className="launch-aurora-conic" />
          <div className="launch-aurora-blob is-a" />
          <div className="launch-aurora-blob is-b" />
        </div>
        <div className="launch-dots" />
      </div>
      <div className="launch-noise" aria-hidden />

      <Nav />
      <main id="main">
        <Hero />
        <BuiltWith />
        <FeaturedBento />
        <OpenSource />
        <MoreWork />
        <Experience />
        <Letter />
        <FinalCta />
      </main>
      <Footer />
    </div>
    <VariantSwitcher current="launch" />
    </>
  );
}
