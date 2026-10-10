"use client";

import { useReducedMotion } from "framer-motion";
import { CornerDownLeft } from "lucide-react";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";

import { ANSWERS, FALLBACK, SUGGESTED, matchQuestion, type Answer } from "./ask-data";

type SpanDef = {
  name: string;
  start: number;
  dur: number;
  color: string;
  note?: string;
};

type Run = {
  key: number;
  answer: Answer;
  query: string;
  fallback: boolean;
  tokens: string[];
  spans: SpanDef[];
  streamStart: number;
  total: number;
};

const MS_PER_TOKEN = 34;

function buildRun(key: number, answer: Answer, query: string, fallback: boolean): Run {
  const tokens = answer.text.match(/\S+\s*/g) ?? [];
  const spans: SpanDef[] = [{ name: "parse.query", start: 0, dur: 70, color: "var(--tr-peri)" }];
  let cursor = 70;
  if (fallback) {
    spans.push({
      name: "retrieve site.index",
      start: 70,
      dur: 180,
      color: "var(--tr-rose)",
      note: "0 hits",
    });
    cursor = 250;
  } else {
    answer.sources.forEach((s, k) => {
      const start = 70 + k * 28;
      spans.push({ name: `retrieve ${s.id}`, start, dur: s.ms, color: "var(--tr-mint)" });
      cursor = Math.max(cursor, start + s.ms);
    });
    spans.push({ name: "rank.sources", start: cursor, dur: 90, color: "var(--tr-rose)" });
    cursor += 90;
  }
  const streamDur = tokens.length * MS_PER_TOKEN;
  spans.push({ name: "stream.answer", start: cursor, dur: streamDur, color: "var(--tr-amber)" });
  return {
    key,
    answer,
    query,
    fallback,
    tokens,
    spans,
    streamStart: cursor,
    total: cursor + streamDur,
  };
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export function AskConsole() {
  const reduce = useReducedMotion();
  const [run, setRun] = useState<Run | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [draft, setDraft] = useState("");
  const keyRef = useRef(0);
  const touched = useRef(false);
  const inputId = useId();

  const start = (answer: Answer, query: string, fallback = false) => {
    keyRef.current += 1;
    setRun(buildRun(keyRef.current, answer, query, fallback));
    setElapsed(reduce ? Number.POSITIVE_INFINITY : 0);
  };

  const askIndex = (i: number) => {
    touched.current = true;
    const a = ANSWERS[i];
    if (a) start(a, a.question);
  };

  // Frame loop for the active run; stops itself when the run is done.
  useEffect(() => {
    if (!run || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = now - t0;
      setElapsed(t);
      if (t < run.total + 60) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce]);

  // Resting state: replay the first question once the name has typed out.
  const autoRun = useEffectEvent(() => {
    if (!touched.current) start(ANSWERS[0], ANSWERS[0].question);
  });
  useEffect(() => {
    const t = window.setTimeout(autoRun, reduce ? 0 : 1500);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // The command palette can ask questions too.
  const onExternalAsk = useEffectEvent((e: Event) => {
    const id = (e as CustomEvent<string>).detail;
    const i = ANSWERS.findIndex((a) => a.id === id);
    if (i >= 0) askIndex(i);
  });
  useEffect(() => {
    const h = (e: Event) => onExternalAsk(e);
    window.addEventListener("trace:ask", h);
    return () => window.removeEventListener("trace:ask", h);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q) return;
    touched.current = true;
    const i = matchQuestion(q);
    if (i >= 0) start(ANSWERS[i], q);
    else start(FALLBACK, q, true);
    setDraft("");
  };

  const done = run ? elapsed >= run.total : false;
  const streaming = run ? elapsed >= run.streamStart && !done : false;
  const shownTokens = run
    ? Math.max(0, Math.min(run.tokens.length, Math.floor((elapsed - run.streamStart) / MS_PER_TOKEN) + 1))
    : 0;
  const status = !run
    ? "idle"
    : done
      ? run.fallback
        ? "200 · no match"
        : "200 · ok"
      : streaming
        ? "streaming"
        : "retrieving";
  const clock = run ? Math.min(elapsed, run.total) : 0;

  const chips = SUGGESTED.map((id) => ANSWERS.findIndex((a) => a.id === id));

  return (
    <section className="trace-ask" aria-labelledby="trace-ask-title">
      <div className="trace-ask-bar">
        <span className={`trace-ask-led ${run && !done ? "is-busy" : ""}`} aria-hidden />
        <h2 id="trace-ask-title" className="trace-ask-title">
          Ask this portfolio
        </h2>
        <span className="trace-ask-status" aria-hidden>
          <span>{status}</span>
          <span className="trace-num">{fmt(clock)} ms</span>
        </span>
      </div>

      <form className="trace-ask-input" onSubmit={submit} role="search">
        <label htmlFor={inputId} className="trace-sr">
          Ask a question about Krishna&apos;s work
        </label>
        <span className="trace-ask-prompt" aria-hidden>
          ›
        </span>
        <input
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="ask about CodeBoss, memory, the stack…"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="send"
        />
        <button type="submit" className="trace-ask-run" disabled={!draft.trim()}>
          run <CornerDownLeft size={13} aria-hidden />
        </button>
      </form>

      <div className="trace-chips" role="group" aria-label="Suggested questions">
        {chips.map((i) => (
          <button
            key={ANSWERS[i].id}
            type="button"
            className="trace-chip"
            aria-pressed={run?.answer.id === ANSWERS[i].id && !run.fallback}
            onClick={() => askIndex(i)}
          >
            {ANSWERS[i].chip}
          </button>
        ))}
      </div>

      <div className="trace-ask-out">
        {run ? (
          <>
            <p className="trace-ask-q">
              <span aria-hidden>user ›</span> {run.query}
            </p>
            <div className="trace-ask-a" aria-hidden>
              <p className="trace-ask-ghost">{run.answer.text}</p>
              <p className="trace-ask-live">
                {run.tokens.slice(0, elapsed >= run.streamStart ? shownTokens : 0).join("")}
                {!done && <span className="trace-caret" />}
                {!streaming && !done && <span className="trace-ask-wait">retrieving context</span>}
              </p>
            </div>
            <p className="trace-sr" aria-live="polite">
              {done ? run.answer.text : ""}
            </p>
          </>
        ) : (
          <p className="trace-ask-a trace-ask-idle">Pick a question, or type your own.</p>
        )}
      </div>

      <div className="trace-wf" aria-label="Retrieval spans for this answer" role="list">
        {(run?.spans ?? PLACEHOLDER_SPANS).map((s, k) => {
          const total = run?.total ?? 1;
          const progressed = run ? Math.max(0, Math.min(s.dur, elapsed - s.start)) : 0;
          const left = (s.start / total) * 100;
          const width = (progressed / total) * 100;
          const live = run && elapsed >= s.start && elapsed < s.start + s.dur;
          return (
            <div className="trace-wf-row" role="listitem" key={`${run?.key ?? 0}-${k}`}>
              <span className="trace-wf-name" title={s.name}>
                {s.name}
              </span>
              <span className="trace-wf-track">
                <i
                  className={live ? "is-live" : ""}
                  style={{ left: `${left}%`, width: `${width}%`, background: s.color }}
                />
                <span className="trace-tip" aria-hidden>
                  <b>{s.name}</b>
                  <span>
                    start +{fmt(s.start)} ms · dur {fmt(s.dur)} ms
                  </span>
                  {s.note && <span>{s.note}</span>}
                </span>
              </span>
              <span className="trace-wf-ms trace-num">
                {run ? (s.note && progressed >= s.dur ? s.note : `${fmt(progressed)}ms`) : "–"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="trace-ask-foot">
        <div className="trace-ask-srcs">
          <span className="trace-dimlabel">sources</span>
          {run && !run.fallback && done ? (
            run.answer.sources.map((s) => (
              <a key={s.id} href={s.href} className="trace-src">
                {s.id}
              </a>
            ))
          ) : (
            <span className="trace-dimlabel">{run?.fallback && done ? "none matched" : "…"}</span>
          )}
        </div>
        <span className="trace-num trace-dimlabel">
          {run ? `${Math.min(shownTokens, run.tokens.length)} / ${run.tokens.length} tokens` : "0 tokens"}
        </span>
      </div>

      <p className="trace-ask-note">
        Replayed run over this site&apos;s own content. Answers are pre-written from the pages
        below and matched to your question by keyword; no model is called, and the timings are
        the replay&apos;s own.
      </p>
    </section>
  );
}

const PLACEHOLDER_SPANS: SpanDef[] = [
  { name: "parse.query", start: 0, dur: 1, color: "var(--tr-peri)" },
  { name: "retrieve …", start: 0, dur: 1, color: "var(--tr-mint)" },
  { name: "rank.sources", start: 0, dur: 1, color: "var(--tr-rose)" },
  { name: "stream.answer", start: 0, dur: 1, color: "var(--tr-amber)" },
];
