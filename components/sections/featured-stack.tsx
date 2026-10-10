"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, type RefObject } from "react";

import { ArrowGlyph } from "@/components/ui/arrow";
import { MediaReveal } from "@/components/ui/media-reveal";
import type { Project } from "@/data/projects";

type SheetProps = {
  project: Project;
  ownRef: RefObject<HTMLElement | null>;
  nextRef: RefObject<HTMLElement | null> | null;
  priority: boolean;
};

function Sheet({ project, ownRef, nextRef, priority }: SheetProps) {
  const reduce = useReducedMotion();
  const isLast = nextRef === null;

  // Progress of this sheet travelling from the bottom of the viewport to the
  // top: drives the curved leading edge flattening out as it docks.
  const { scrollYProgress: enter } = useScroll({
    target: ownRef,
    offset: ["start end", "start start"],
  });
  const radius = useTransform(enter, [0, 0.9], [40, 0], { clamp: true });

  // Progress of the NEXT sheet covering this one. Instead of darkening the
  // covered sheet, fade it toward the paper ground so it recedes quietly.
  const { scrollYProgress: cover } = useScroll({
    target: nextRef ?? ownRef,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(cover, (value) =>
    isLast ? 1 : 1 - 0.035 * value
  );
  const veil = useTransform(cover, (value) => (isLast ? 0 : 0.55 * value));

  const external = project.links.find((link) => link.href);

  return (
    <motion.section
      id={project.slug}
      ref={ownRef as RefObject<HTMLElement>}
      style={
        reduce
          ? undefined
          : {
              scale,
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
            }
      }
      className="sticky top-0 grid min-h-[100dvh] origin-[center_18%] items-start overflow-hidden border-t bg-[var(--sheet)] px-5 pt-[clamp(5.5rem,14vh,8.5rem)] pb-10 shadow-[0_-18px_44px_rgba(23,21,15,0.07)] will-change-transform sm:px-6"
    >
      <div className="mx-auto grid w-full max-w-[1240px] items-start gap-7 lg:grid-cols-[1.7fr_1fr] lg:gap-12">
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.title} case study`}
          className="group block"
        >
          <MediaReveal className="relative aspect-[16/9] w-full overflow-hidden border">
            <Image
              src={project.image}
              alt={`${project.title} interface`}
              fill
              sizes="(min-width: 1024px) 680px, 100vw"
              priority={priority}
              className="object-cover object-top transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          </MediaReveal>
        </Link>
        <div>
          <h2 className="text-[clamp(1.9rem,3.2vw,2.6rem)] leading-tight font-[640] tracking-[-0.01em]">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors duration-200 hover:text-[var(--muted)]"
            >
              {project.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-[44ch] text-[var(--muted)]">
            {project.tagline}
          </p>
          <p className="mt-5 font-mono text-xs text-[var(--muted)]">
            {project.tech.join(", ")}
          </p>
          <div className="mt-4 flex flex-wrap gap-5 font-mono text-[0.8rem]">
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
        </div>
      </div>
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[var(--paper)]"
          style={{ opacity: veil }}
        />
      )}
    </motion.section>
  );
}

export function FeaturedStack({ featured }: { featured: Project[] }) {
  const refA = useRef<HTMLElement | null>(null);
  const refB = useRef<HTMLElement | null>(null);
  const refC = useRef<HTMLElement | null>(null);
  const refs = [refA, refB, refC];

  return (
    <div id="work" data-nav-section className="relative">
      {featured.slice(0, 3).map((project, index) => (
        <Sheet
          key={project.slug}
          project={project}
          ownRef={refs[index]}
          nextRef={index < 2 ? refs[index + 1] : null}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
