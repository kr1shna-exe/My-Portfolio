import { ArrowGlyph } from "@/components/ui/arrow";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/data/experience";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      data-nav-section
      className="relative z-2 bg-[var(--paper)] px-5 py-20 sm:px-6"
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <SectionHeading>Experience</SectionHeading>
        <div>
          {experience.map((item, index) => (
            <Reveal
              key={`${item.company}-${item.start}`}
              delay={index * 0.07}
              className="grid gap-2 border-b py-8 first:border-t-0 sm:grid-cols-[11.5rem_1fr] sm:gap-8"
            >
              <p className="font-mono text-[0.78rem] leading-6 text-[var(--muted)] tabular-nums">
                {item.start} - {item.end}
              </p>
              <div>
                <h3 className="text-[1.25rem] leading-snug font-[640]">
                  {item.role}
                </h3>
                <p className="mt-1 text-[0.95rem]">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="group border-b pb-px transition-colors duration-200 hover:text-[var(--muted)]"
                    >
                      {item.company} <ArrowGlyph />
                    </a>
                  ) : (
                    item.company
                  )}
                  <span className="text-[var(--muted)]"> · {item.location}</span>
                </p>
                <p className="mt-3 max-w-[62ch] text-[0.95rem] text-[var(--muted)]">
                  {item.summary}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
