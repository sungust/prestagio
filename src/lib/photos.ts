import type { ImageRef, SceneKind } from "./types";

/**
 * Prestagio's own photography, cut from the approved homepage design and
 * served from /public/images/escape. A scene only maps to a photo that
 * genuinely shows it; scenes without a matching photo (Paris, Kyoto, Venice,
 * the Highlands, Cape Town) keep their illustration.
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
}

const CREDIT = "Image: Prestagio";

function photo(name: string, width: number, height: number, alt: string): Photo {
  return { src: `/images/escape/${name}.webp`, width, height, alt };
}

export const PHOTOS = {
  hero: photo("hero", 2048, 890, "A cliffside terrace above the sea at sunset, with a pool and sofas looking out over a coastal village"),
  heroCoast: photo("hero-coast", 968, 890, "A cliffside terrace above the sea at sunset, looking out over a coastal village"),
  sea: photo("sea", 356, 218, "A yacht anchored in a turquoise cove beneath rocky cliffs"),
  city: photo("city", 358, 218, "A cathedral dome rising above old city rooftops at golden hour"),
  drives: photo("drives", 350, 218, "A dark saloon on a mountain road above a lake"),
  wellness: photo("wellness", 348, 218, "A swimmer in an infinity pool looking out over a lake and mountains"),
  architecture: photo("architecture", 348, 218, "Stone arches framing palm trees, a pool and the sea"),
  como: photo("como", 1020, 560, "A stone terrace with sofas above Lake Como, with cypresses and mountains beyond"),
  arrival: photo("arrival", 876, 252, "A traveller walking from a private jet to a waiting black car"),
  maldives: photo("maldives", 872, 262, "An overwater villa on stilts above a calm lagoon at sunset"),
  stay: photo("stay", 306, 204, "A hotel bedroom with floor-to-ceiling windows over the sea"),
  arrive: photo("arrive", 306, 204, "A traveller beside a private jet at dusk"),
  drive: photo("drive", 306, 204, "A dark saloon on a coastal mountain road"),
  time: photo("time", 300, 204, "A gold wristwatch with a dark blue dial"),
  atmosphere: photo("atmosphere", 308, 204, "A bottle of fragrance on a rock above the sea"),
  explore: photo("explore", 306, 204, "A cliffside village of colourful houses above the sea"),
} satisfies Record<string, Photo>;

const BY_SCENE: Partial<Record<SceneKind, Photo>> = {
  lake: PHOTOS.como,
  coast: PHOTOS.heroCoast,
  atoll: PHOTOS.maldives,
  jet: PHOTOS.arrival,
  road: PHOTOS.drive,
  alpine: PHOTOS.drives,
  watch: PHOTOS.time,
  aroma: PHOTOS.atmosphere,
  interior: PHOTOS.stay,
  spa: PHOTOS.wellness,
  architecture: PHOTOS.architecture,
  riad: PHOTOS.architecture,
  riviera: PHOTOS.explore,
};

/** Planner feelings use the photos from the homepage's escape cards. */
const BY_MOOD: Record<string, Photo> = {
  sea: PHOTOS.sea,
  city: PHOTOS.city,
  art: PHOTOS.architecture,
  lifetime: PHOTOS.maldives,
  weekend: PHOTOS.como,
  wellness: PHOTOS.wellness,
  drive: PHOTOS.drives,
};

function toImage(base: ImageRef, p: Photo): ImageRef {
  return { ...base, src: p.src, alt: p.alt, width: p.width, height: p.height, credit: CREDIT };
}

/** The image to show: its own licensed photo, else Prestagio's photo for its scene, else unchanged (illustration). */
export function resolveImage(image: ImageRef): ImageRef {
  if (image.src) return image;
  const p = BY_SCENE[image.scene];
  return p ? toImage(image, p) : image;
}

export function moodImage(id: string, image: ImageRef): ImageRef {
  if (image.src) return image;
  const p = BY_MOOD[id];
  return p ? toImage(image, p) : resolveImage(image);
}
