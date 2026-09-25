import compiled from "@/generated/content.json";
import type { CompiledContent } from "./source";

/** All content, compiled at build time by scripts/build-content.ts. */
export const CONTENT = compiled as unknown as CompiledContent;
