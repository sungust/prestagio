import { formatHours } from "./estimate";
import type { Escape } from "./types";

export function travelEffort(e: Escape): string | null {
  const f = e.flight;
  if (!f) return null;
  if (f.hours === 0) return `Close to ${f.fromLabel}, within reach by road or rail.`;
  return `Roughly ${formatHours(f.hours)} flying from ${f.fromLabel} to ${f.toName}, if a direct route operates. Allow longer with a connection.`;
}

export function journeyStyle(e: Escape): string {
  return e.transport.kind === "car" ? `${e.transport.car.name}, your second home on the road` : e.transport.transfer.label;
}
