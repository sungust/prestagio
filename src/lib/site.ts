export const SITE = {
  name: "Prestagio",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://prestagio.com").replace(/\/$/, ""),
  description:
    "Prestagio is a luxury travel and lifestyle publication. Design an escape shaped around where you stay, how you arrive, and everything you take with you.",
  contactEmail: "hello@prestagio.com",
};

/** Primary navigation. Order and labels are part of the brief; tests assert them. */
export const PRIMARY_NAV = [
  { label: "Destinations", href: "/destinations" },
  { label: "Stays", href: "/hotels" },
  { label: "Cars", href: "/cars" },
  { label: "Watches", href: "/watches" },
  { label: "Aroma", href: "/aroma" },
] as const;

export const PLAN_HREF = "/plan";

export const SECTIONS = {
  destinations: {
    label: "Destinations",
    path: "/destinations",
    title: "Destinations",
    intro: "Place guides, architecture and culture, considered itineraries, and where each journey might lead next.",
  },
  hotels: {
    label: "Stays",
    path: "/hotels",
    title: "Stays",
    intro: "Hotels, resorts and villas worth building a journey around, and how to choose the right shore, street or valley for yours.",
  },
  cars: {
    label: "Cars",
    path: "/cars",
    title: "Cars",
    intro: "Design, craftsmanship and grand touring, and the car as a second home on the road.",
  },
  watches: {
    label: "Watches",
    path: "/watches",
    title: "Watches",
    intro: "Makers, movements and design, and how the right piece belongs to a particular place or occasion.",
  },
  aroma: {
    label: "Aroma",
    path: "/aroma",
    title: "Aroma",
    intro: "Considered scents for the room and the car: materials, composition and the atmosphere they carry with you.",
  },
} as const;

export function absoluteUrl(path = "/") {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
