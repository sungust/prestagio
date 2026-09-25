import Link from "next/link";
import { Arrow } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingBlock: "96px 128px", maxWidth: 760 }}>
      <span className="kicker kicker--bronze">Page not found</span>
      <h1 style={{ fontSize: "clamp(40px,6vw,72px)", textTransform: "uppercase", margin: "12px 0 16px" }}>A road not on the map</h1>
      <p className="lede">The page you were looking for has moved or no longer exists.</p>
      <p style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 28 }}>
        <Link href="/plan" className="btn">
          Design My Escape <Arrow />
        </Link>
        <Link href="/destinations" className="btn btn--ghost">
          Browse destinations
        </Link>
      </p>
    </div>
  );
}
