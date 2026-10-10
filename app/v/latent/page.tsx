import { contributionStats } from "@/data/open-source";
import { VariantSwitcher } from "@/components/variants/switcher";
import { RevealObserver } from "@/components/variants/latent/reveal";
import { EmbeddingMap } from "@/components/variants/latent/embedding-map";
import { LatentFooter } from "@/components/variants/latent/footer";
import { ForwardPass } from "@/components/variants/latent/forward-pass";
import { LatentHero } from "@/components/variants/latent/hero";
import { OpenSource } from "@/components/variants/latent/open-source";
import {
  About,
  Experience,
  LatentNav,
  Marquee,
  MoreWork,
} from "@/components/variants/latent/sections";

export default function LatentPage() {
  return (
    <>
      <LatentNav />
      <main id="main" tabIndex={-1}>
        <LatentHero />
        <Marquee
          tone="sun"
          items={[
            "agents",
            "memory & retrieval",
            "real-time systems",
            "applied LLM tools",
            "open source",
            `${contributionStats.merged} PRs merged upstream`,
            "7 products shipped",
            "6 live right now",
            "100% open source",
          ]}
        />
        <EmbeddingMap />
        <ForwardPass />
        <MoreWork />
        <OpenSource />
        <Experience />
        <About />
        <Marquee
          tone="pink"
          items={["say hi", "agents", "memory", "Figma to code", "say hi", "open source", "real work"]}
        />
      </main>
      <LatentFooter />
      <RevealObserver />
      <VariantSwitcher current="latent" />
    </>
  );
}
