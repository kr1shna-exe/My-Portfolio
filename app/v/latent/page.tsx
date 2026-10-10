import { VariantSwitcher } from "@/components/variants/switcher";
import { EmbeddingMap } from "@/components/variants/latent/embedding-map";
import { LatentFooter } from "@/components/variants/latent/footer";
import { ForwardPass } from "@/components/variants/latent/forward-pass";
import { LatentHero } from "@/components/variants/latent/hero";
import { OpenSource } from "@/components/variants/latent/open-source";
import { RevealObserver } from "@/components/variants/latent/reveal";
import { About, Experience, LatentNav, MoreWork } from "@/components/variants/latent/sections";

export default function LatentPage() {
  return (
    <>
      <LatentNav />
      <main id="main" tabIndex={-1}>
        <LatentHero />
        <EmbeddingMap />
        <ForwardPass />
        <MoreWork />
        <OpenSource />
        <Experience />
        <About />
      </main>
      <LatentFooter />
      <RevealObserver />
      <VariantSwitcher current="latent" />
    </>
  );
}
