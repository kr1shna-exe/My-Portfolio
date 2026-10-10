import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { decisions } from "@/data/decisions";

export function MattersOfRecord() {
  return (
    <section
      id="record"
      className="relative z-2 bg-[var(--paper)] px-5 py-20 sm:px-6"
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <SectionHeading>Matters of record</SectionHeading>
        <div className="gap-x-14 sm:columns-2">
          {decisions.map((decision, index) => (
            <Reveal
              key={decision.call}
              delay={index * 0.05}
              className="break-inside-avoid border-b py-4.5"
            >
              <p className="font-mono text-[0.7rem] text-[var(--muted)]">
                {decision.date}
              </p>
              <h3 className="mt-1 text-[1.02rem] font-[640]">
                {decision.call}
              </h3>
              <p className="mt-1.5 text-[0.9rem] text-[var(--muted)]">
                <span className="font-medium text-[var(--ink)]">Why: </span>
                {decision.why}{" "}
                <span className="font-medium text-[var(--ink)]">Price: </span>
                {decision.price}
              </p>
              <p className="mt-2 font-mono text-[0.7rem]">{decision.product}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
