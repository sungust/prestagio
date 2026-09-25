import type { ReactNode } from "react";

export function SectionHead({ title, kicker, id, as: Tag = "h2" }: { title: ReactNode; kicker?: ReactNode; id?: string; as?: "h1" | "h2" }) {
  return (
    <div className="section-head">
      <Tag id={id}>{title}</Tag>
      <span className="section-head__rule" aria-hidden="true" />
      {kicker ? <span className="kicker">{kicker}</span> : <span />}
    </div>
  );
}
