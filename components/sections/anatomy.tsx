import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Anatomy } from "@/data/projects";

export function AnatomySection({ anatomy }: { anatomy: Anatomy }) {
  return (
    <section className="mt-14">
      <SectionHeading>{anatomy.title}</SectionHeading>
      <Reveal className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div>
          {anatomy.stages.map((stage, index) => (
            <div key={stage.name}>
              {index > 0 && (
                <p
                  aria-hidden
                  className="py-1.5 text-center text-[0.8rem] text-[var(--muted)]"
                >
                  ↓
                </p>
              )}
              <div className="relative border border-[color:var(--ink)] bg-[var(--sheet)] px-4 py-3.5">
                <span className="absolute -top-2.5 left-3 bg-[var(--paper)] px-1.5 font-mono text-[0.7rem]">
                  {index + 1}
                </span>
                <p className="text-[0.95rem] font-[640]">{stage.name}</p>
                <p className="text-[0.8rem] text-[var(--muted)]">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div>
          {anatomy.notes.map((note, index) => (
            <div
              key={note}
              className="grid grid-cols-[2rem_1fr] gap-3 border-b py-3 text-[0.88rem] first:pt-0"
            >
              <span className="font-mono text-[0.75rem]">{index + 1}</span>
              <p className="text-[var(--muted)]">{note}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
