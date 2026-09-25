import type { ReactNode } from "react";

export function ProsePage({ kicker = "Prestagio", title, lede, children }: { kicker?: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <>
      <header className="wrap page-head">
        <span className="kicker kicker--bronze">{kicker}</span>
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
      </header>
      <div className="wrap">
        <div className="page-prose">{children}</div>
      </div>
    </>
  );
}
