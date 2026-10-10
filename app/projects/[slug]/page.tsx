import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnatomySection } from "@/components/sections/anatomy";
import { ArrowGlyph } from "@/components/ui/arrow";
import { MediaReveal } from "@/components/ui/media-reveal";
import { anatomies, FEATURED_SLUGS, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata | undefined> {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return;

  return {
    title: `${project.title} · Krishna`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} · Krishna`,
      description: project.tagline,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectDetail({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    notFound();
  }

  const external = project.links.find((link) => link.href);
  // Back returns to where this project lives on the homepage: featured
  // projects to their own sheet, the rest to the More work list.
  const backHref = FEATURED_SLUGS.includes(project.slug)
    ? `/#${project.slug}`
    : "/#more-work";

  return (
    <main id="main" className="mx-auto w-full max-w-[900px] px-5 pt-24 pb-20 sm:px-6">
      <Link
        href={backHref}
        className="font-mono text-[0.8rem] transition-colors duration-200 hover:text-[var(--muted)]"
      >
        ← index
      </Link>

      <header className="mt-10">
        <h1 className="text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.95] font-[700] tracking-[-0.015em]">
          {project.title}
        </h1>
        <p className="mt-4 max-w-[52ch] text-[1.05rem] text-[var(--muted)]">
          {project.tagline}
        </p>
        <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-[0.8rem]">
          <span className="text-[var(--muted)]">{project.tech.join(", ")}</span>
          <span className="text-[var(--muted)]">
            {project.status.toLowerCase()}
          </span>
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
        </div>
      </header>

      <MediaReveal className="relative mt-10 aspect-[16/9] w-full overflow-hidden border">
        <Image
          src={project.image}
          alt={`${project.title} interface`}
          fill
          sizes="(min-width: 900px) 852px, 100vw"
          priority
          className="object-cover object-top"
        />
      </MediaReveal>

      <p className="mt-10 max-w-[62ch] text-[1.02rem]">{project.description}</p>

      {anatomies[project.slug] && (
        <AnatomySection anatomy={anatomies[project.slug]} />
      )}
    </main>
  );
}
