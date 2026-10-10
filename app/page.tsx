import { SiteNav } from "@/components/nav/site-nav";
import { About } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience-section";
import { FeaturedStack } from "@/components/sections/featured-stack";
import { Hero } from "@/components/sections/hero";
import { MattersOfRecord } from "@/components/sections/matters-of-record";
import { MoreWork } from "@/components/sections/more-work";
import { SiteFooter } from "@/components/sections/site-footer";
import { FEATURED_SLUGS, projects } from "@/data/projects";

export default function Home() {
  const featured = FEATURED_SLUGS.flatMap((slug) => {
    const project = projects.find((entry) => entry.slug === slug);
    return project ? [project] : [];
  });
  const rest = projects.filter(
    (project) => !FEATURED_SLUGS.includes(project.slug)
  );

  return (
    <div className="relative">
      <SiteNav />
      <main id="main">
        <Hero />
        <FeaturedStack featured={featured} />
        <MoreWork projects={rest} />
        <MattersOfRecord />
        <ExperienceSection />
        <About />
      </main>
      <SiteFooter />
    </div>
  );
}
