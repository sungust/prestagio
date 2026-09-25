export type SceneKind =
  | "lake"
  | "coast"
  | "atoll"
  | "city-night"
  | "temple"
  | "riad"
  | "alpine"
  | "highland"
  | "cape"
  | "venice"
  | "riviera"
  | "road"
  | "jet"
  | "watch"
  | "aroma"
  | "interior"
  | "architecture"
  | "spa";

export type Tone = "dusk" | "day" | "night" | "dawn" | "golden";

/**
 * Every image in Prestagio carries its own rights metadata. When `src` is
 * empty the site renders an original Prestagio illustration for `scene`
 * instead, so no page ever shows unlicensed photography.
 */
export interface ImageRef {
  src?: string;
  alt: string;
  scene: SceneKind;
  tone?: Tone;
  credit?: string;
  license?: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
}

export type Section = "destinations" | "hotels" | "cars" | "watches" | "aroma";

export type ContentStatus = "draft" | "review" | "published";

export interface Source {
  title: string;
  url: string;
  publisher?: string;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  deck: string;
  section: Section;
  destinations: string[];
  tags: string[];
  author: string;
  editor?: string;
  published: string;
  updated?: string;
  status: ContentStatus;
  /** "research" articles are written from sources, not first-hand visits. */
  basis: "research" | "first-hand";
  hero: ImageRef;
  sources: Source[];
  related: string[];
  affiliates: string[];
  featured?: boolean;
  /** Specific call to action used when linking to this story, e.g. "Discover Como". */
  linkLabel: string;
  seoTitle?: string;
  seoDescription?: string;
  readingMinutes: number;
}

export interface Article extends ArticleMeta {
  html: string;
}

export interface Affiliate {
  id: string;
  label: string;
  program: "agoda";
  /** Approved deep link supplied by the affiliate programme. Empty until approved. */
  url: string;
  approved: boolean;
  /** Where to send visitors if the link is not active. */
  fallbackPath: string;
  /** The property's own photo from the Agoda Partners image-link tool; shown only linked to Agoda. */
  image?: string;
  notes?: string;
}
