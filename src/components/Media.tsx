import Image from "next/image";
import type { ImageRef } from "@/lib/types";
import { resolveImage } from "@/lib/photos";
import { Scene } from "./Scene";

export const ILLUSTRATION_CREDIT = "Illustration: Prestagio";

/**
 * Renders photography when an image has a `src` or Prestagio has a photo for
 * its scene, otherwise an original Prestagio illustration for the scene.
 */
export function Media({
  image,
  className = "",
  sizes = "100vw",
  priority = false,
  decorative = false,
  seed,
}: {
  image: ImageRef;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Decorative when adjacent text already describes the content. */
  decorative?: boolean;
  seed?: string;
}) {
  image = resolveImage(image);
  const alt = decorative ? "" : image.alt;
  return (
    <div className={`media ${className}`}>
      {image.src ? (
        <Image src={image.src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
      ) : (
        <Scene kind={image.scene} tone={image.tone} seed={seed ?? image.alt} title={alt || undefined} />
      )}
    </div>
  );
}

/** The picture alone, for containers that already provide `.media` framing. */
export function Artwork({ image, seed, sizes = "100vw", title }: { image: ImageRef; seed?: string; sizes?: string; title?: string }) {
  return image.src ? (
    <Image src={image.src} alt={title ?? ""} fill sizes={sizes} style={{ objectFit: "cover" }} />
  ) : (
    <Scene kind={image.scene} tone={image.tone} seed={seed ?? image.alt} title={title} />
  );
}

export function creditFor(image: ImageRef): string {
  image = resolveImage(image);
  if (!image.src) return ILLUSTRATION_CREDIT;
  return [image.credit, image.license].filter(Boolean).join(" · ");
}

export function Figure({ image, priority, sizes }: { image: ImageRef; priority?: boolean; sizes?: string }) {
  image = resolveImage(image);
  return (
    <figure className="figure">
      <Media image={image} priority={priority} sizes={sizes} />
      <figcaption>
        <span>{image.src ? "" : "Illustration for this story; photography to follow."}</span>
        <span>
          {image.sourceUrl ? (
            <a href={image.sourceUrl} rel="noopener">
              {creditFor(image)}
            </a>
          ) : (
            creditFor(image)
          )}
        </span>
      </figcaption>
    </figure>
  );
}
