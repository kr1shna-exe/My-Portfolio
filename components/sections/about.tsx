import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
  return (
    <section
      id="about"
      data-nav-section
      className="relative z-2 bg-[var(--paper)] px-5 pt-4 pb-24 sm:px-6"
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <SectionHeading>About</SectionHeading>
        <div className="max-w-[58ch] text-[1.05rem]">
          <p>
            I&apos;m Krishna. I build AI-native products end to end: agents,
            retrieval pipelines, and the interfaces around them. Right now
            I&apos;m the founding AI/ML engineer at{" "}
            <a
              href="https://companyinsights.ai"
              target="_blank"
              rel="noreferrer"
              className="border-b pb-px transition-colors duration-200 hover:text-[var(--muted)]"
            >
              CompanyInsights
            </a>
            , turning unstructured business data into systems that act on it.
            Before that I shipped full-stack products at Springreen and Beasova.
          </p>
          <p className="mt-4">
            Away from the editor: papers, movies, anime. Most of what I build
            is live, so click around.
          </p>
        </div>
        <p className="mt-9 font-mono text-xs text-[var(--muted)]">
          Updated Jul 2026
        </p>
      </div>
    </section>
  );
}
