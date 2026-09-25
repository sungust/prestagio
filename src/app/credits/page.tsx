import type { Metadata } from "next";
import { ProsePage } from "@/components/ProsePage";
import { ALL_PHOTOS } from "@/lib/photos";

export const metadata: Metadata = { title: "Image Credits", alternates: { canonical: "/credits" } };

export default function CreditsPage() {
  return (
    <ProsePage title="Image credits" lede="Every photograph on Prestagio, who took it, and the licence it is used under.">
      <p>
        Prestagio&rsquo;s photographs are freely licensed, most from Wikimedia Commons, and we thank the photographers who share their work. Each
        photo has been resized and cropped for the site and is otherwise unaltered. Photos under a Creative Commons ShareAlike (BY-SA) licence remain
        available under that same licence. The photos are atmospheric, not endorsements: unless a caption says so, they do not show the specific hotel,
        car, watch or fragrance recommended alongside them.
      </p>
      <ul className="credits">
        {ALL_PHOTOS.map((p) => (
          <li key={p.src}>
            {p.alt}. Photo: {p.artist},{" "}
            <a href={p.licenseUrl} rel="license noopener">
              {p.license}
            </a>
            , via{" "}
            <a href={p.sourceUrl} rel="noopener">
              Wikimedia Commons
            </a>
            .
          </li>
        ))}
      </ul>
    </ProsePage>
  );
}
