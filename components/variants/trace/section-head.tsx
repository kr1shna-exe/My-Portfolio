export function SectionHead({
  index,
  kind,
  name,
  title,
  lede,
  id,
  aside,
}: {
  index: string;
  kind: string;
  name: string;
  title: string;
  lede?: string;
  id: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className="trace-sh">
      <div className="trace-sh-meta" aria-hidden>
        <span className="trace-sh-idx trace-num">{index}</span>
        <span className="trace-sh-kind">{kind}</span>
        <code>{name}</code>
        <span className="trace-sh-rule" />
      </div>
      <div className="trace-sh-row">
        <div>
          <h2 id={id} className="trace-h2">
            {title}
          </h2>
          {lede && <p className="trace-sh-lede">{lede}</p>}
        </div>
        {aside && <div className="trace-sh-aside">{aside}</div>}
      </div>
    </header>
  );
}
