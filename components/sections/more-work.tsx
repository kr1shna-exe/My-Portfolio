import Link from "next/link";

import { ArrowGlyph } from "@/components/ui/arrow";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/data/projects";

export function MoreWork({ projects }: { projects: Project[] }) {
  return (
    <section
      id="more-work"
      className="relative z-2 -mt-[16dvh] scroll-mt-6 rounded-t-[40px] border-t bg-[var(--paper)] px-5 pt-16 pb-20 shadow-[0_-18px_44px_rgba(23,21,15,0.07)] sm:px-6"
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <SectionHeading>More work</SectionHeading>
        <div>
          {projects.map((project, index) => {
            const external = project.links.find((link) => link.href);
            return (
              <Reveal
                key={project.slug}
                delay={index * 0.06}
                className="group/row grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t py-4.5 transition-colors duration-200 first:border-t-0 last:border-b hover:bg-[var(--sheet)] sm:grid-cols-[minmax(10rem,1.1fr)_2fr_auto_auto] sm:gap-6"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group inline-block text-[1.05rem] font-semibold transition-transform duration-200 group-hover/row:translate-x-1 motion-reduce:transition-none"
                >
                  {project.title}
                  <span
                    aria-hidden
                    className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
                <span className="hidden text-[0.92rem] text-[var(--muted)] sm:inline">
                  {project.tagline}
                </span>
                <span className="hidden font-mono text-xs text-[var(--muted)] opacity-70 transition-opacity duration-200 group-hover/row:opacity-100 sm:inline">
                  {project.status.toLowerCase()}
                </span>
                <span className="flex gap-4 font-mono text-[0.78rem]">
                  {external?.href && (
                    <a
                      href={external.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group border-b pb-px transition-colors duration-200 hover:text-[var(--muted)]"
                    >
                      visit <ArrowGlyph />
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="group border-b pb-px transition-colors duration-200 hover:text-[var(--muted)]"
                    >
                      repo <ArrowGlyph />
                    </a>
                  )}
                </span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
