import type { ImageRef, SceneKind } from "./types";

/**
 * Prestagio's photography register. Every photo is freely licensed (CC0 or
 * Creative Commons), was checked for watermarks, and is credited on
 * /credits. Files live in /public/images/photos.
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  artist: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

function photo(name: string, width: number, height: number, alt: string, artist: string, license: string, licenseUrl: string, sourceUrl: string): Photo {
  return { src: `/images/photos/${name}.webp`, width, height, alt, artist, license, licenseUrl, sourceUrl };
}

export const PHOTOS = {
  hero: photo("hero", 2400, 1531, "Positano and the Amalfi Coast at sunset, the sun setting over a calm sea", "Ricardo Gomez Angel", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/deed.en", "https://commons.wikimedia.org/wiki/File:Positano%27s_sunset_(Unsplash).jpg"),
  sea: photo("sea", 1600, 1200, "A sailing yacht at anchor in a turquoise cove below a wild headland", "Scruzin", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Memory_Cove_with_Sailing_Yacht_Arriba_at_anchor.jpg"),
  city: photo("city", 1600, 822, "Florence at sunset from Piazzale Michelangelo, with the Duomo and the Arno", "Diego Delso", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Vista_de_Florencia_desde_Piazzale_Michelangelo,_Italia,_2022-09-18,_DD_199.jpg"),
  citynight: photo("citynight", 1600, 1025, "The Eiffel Tower and Pont Alexandre III lit up above the Seine at blue hour", "Getfunky Paris", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg"),
  drives: photo("drives", 1600, 1100, "The hairpin bends of the Stelvio Pass climbing through cloud", "Raul Taciu", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/deed.en", "https://commons.wikimedia.org/wiki/File:Stelvio_Pass_(Unsplash).jpg"),
  wellness: photo("wellness", 1600, 1200, "A swimmer at the edge of an infinity pool looking out over forested hills", "Ruwanil dushan", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:1.20_best_friends.jpg"),
  architecture: photo("architecture", 1600, 900, "A tiled courtyard ringed by white arches in a Marrakech palace", "karel291", "CC BY 3.0", "https://creativecommons.org/licenses/by/3.0", "https://commons.wikimedia.org/wiki/File:Riad_Zitoun_Jdid,_Marrakesh,_Morocco_-_panoramio_(3).jpg"),
  como: photo("como", 1600, 1067, "Cypresses and a lawn above Lake Como in the gardens of Villa del Balbianello", "Phyrexian", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Lenno_-_Villa_del_Balbianello_0617.JPG"),
  comoVilla: photo("como-villa", 1600, 1071, "Villa del Balbianello on its wooded promontory in Lake Como", "FAI – Fondo Ambiente Italiano", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Vista_dal_lago_su_Villa_del_Balbianello,_Bene_FAI_sul_Lago_di_Como.jpg"),
  arrival: photo("arrival", 1600, 1200, "A dark business jet waiting on a sunlit apron", "Monaam Ben Fredj", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Euro_Executive_Jet_Dassault_Falcon_900B_01.jpg"),
  arrive: photo("arrive", 1600, 1069, "The cream leather cabin of a private jet", "Matti Blume", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Embraer,_EBACE_2019,_Le_Grand-Saconnex_(EB190394).jpg"),
  maldives: photo("maldives", 1600, 857, "A wooden jetty leading to overwater villas above a turquoise lagoon in the Maldives", "Martin Falbisoner", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Diamonds_Thudufushi_Beach_and_Water_Villas,_May_2017_-04.jpg"),
  stay: photo("stay", 1600, 1066, "A breakfast tray on a linen bed, with the sea beyond the window", "Umani.Hotel", "CC BY 4.0", "https://creativecommons.org/licenses/by/4.0", "https://commons.wikimedia.org/wiki/File:Hotel_Umani_Double_Room_Sea_view_(9).jpg"),
  drive: photo("drive", 1600, 791, "A silver Porsche 911 on a country road", "Ermell", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Porsche_911_Turbo_(Typ_930-3.3)_ADAC_Deutschland_Klassik_2018_6290583.jpg"),
  time: photo("time", 1600, 1067, "A steel wristwatch with a white dial resting on dark wood", "Pixel.la", "CC0", "https://creativecommons.org/publicdomain/zero/1.0/deed.en", "https://commons.wikimedia.org/wiki/File:Fashion-wristwatch-time-watch_(24217032812).jpg"),
  atmosphere: photo("atmosphere", 1600, 1200, "A glass bottle of fragrance on a pale wooden table", "Santeri Viinamäki", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Perfume_glass_bottle.jpg"),
  explore: photo("explore", 1600, 1060, "Manarola in the Cinque Terre, its coloured houses on a cliff above a stormy sea", "Anyul Rivas", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Le_cinque_terre_-_Manarola_-_Dicembre_2017.jpg"),
  amalfi: photo("amalfi", 1600, 1067, "Positano rising from the sea on the Amalfi Coast at dusk", "Thomas Fabian", "CC BY-SA 2.0", "https://creativecommons.org/licenses/by-sa/2.0", "https://commons.wikimedia.org/wiki/File:Positano_at_sunset.jpg"),
  capetown: photo("capetown", 1600, 1027, "Table Mountain above the Cape Town city bowl at dawn", "Daniel Case", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0", "https://commons.wikimedia.org/wiki/File:Cape_Town_City_Bowl_and_Table_Mountain_at_dawn.jpg"),
  engadin: photo("engadin", 1600, 1067, "Lake St. Moritz reflecting the peaks of the Engadin", "Isiwal", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Sankt_Moritz_Lake_Piz_Muragl.jpg"),
  highlands: photo("highlands", 1600, 1200, "A car on the empty road through Glen Coe beneath Buachaille Etive Mòr", "Kenneth Barker", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Glen_Coe_highway_and_car.jpg"),
  kyoto: photo("kyoto", 1600, 1067, "Yasaka Pagoda above a quiet lane of wooden houses in Kyoto", "663highland", "CC BY 2.5", "https://creativecommons.org/licenses/by/2.5", "https://commons.wikimedia.org/wiki/File:150124_At_Yasakakamimachi_Kyoto_Japan01n.jpg"),
  lisbon: photo("lisbon", 1600, 1067, "The rooftops of Alfama in Lisbon, with São Vicente de Fora and the Tagus beyond", "Ingo Mehling", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Lissabon_-_Santa_Luzia_-_Alfama_-_2.jpg"),
  marrakech: photo("marrakech", 1600, 1062, "The cobalt-blue villa and cacti of the Jardin Majorelle in Marrakech", "Viault", "CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0", "https://commons.wikimedia.org/wiki/File:Le_jardin_des_majorelle_21.JPG"),
  riviera: photo("riviera", 1600, 1200, "The bay of Villefranche-sur-Mer and Cap Ferrat on the French Riviera", "Miniwark", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Villefranche-sur-Mer_P1000931.jpg"),
  venice: photo("venice", 1600, 1062, "Water taxis on the Grand Canal approaching the Rialto Bridge at golden hour", "kallerna", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Ponte_di_Rialto_Venice_1.jpg"),
} satisfies Record<string, Photo>;

/** Fallback photos for images that name only a scene. */
const BY_SCENE: Partial<Record<SceneKind, Photo>> = {
  lake: PHOTOS.comoVilla,
  coast: PHOTOS.amalfi,
  atoll: PHOTOS.maldives,
  "city-night": PHOTOS.citynight,
  temple: PHOTOS.kyoto,
  riad: PHOTOS.marrakech,
  alpine: PHOTOS.engadin,
  highland: PHOTOS.highlands,
  cape: PHOTOS.capetown,
  venice: PHOTOS.venice,
  riviera: PHOTOS.riviera,
  road: PHOTOS.drive,
  jet: PHOTOS.arrival,
  watch: PHOTOS.time,
  aroma: PHOTOS.atmosphere,
  interior: PHOTOS.stay,
  architecture: PHOTOS.architecture,
  spa: PHOTOS.wellness,
};

export function creditLine(p: { credit?: string; license?: string }): string {
  return [p.credit, p.license].filter(Boolean).join(" · ");
}

/** An ImageRef for a photo, with its credit and licence. */
export function photoImage(p: Photo, base?: Partial<ImageRef>): ImageRef {
  return {
    scene: base?.scene ?? "coast",
    tone: base?.tone,
    src: p.src,
    alt: p.alt,
    width: p.width,
    height: p.height,
    credit: `Photo: ${p.artist}`,
    license: p.license,
    sourceUrl: p.sourceUrl,
  };
}

/** The image to show: its own photo, else the photo for its scene, else unchanged (illustration). */
export function resolveImage(image: ImageRef): ImageRef {
  if (image.src) return image;
  const p = BY_SCENE[image.scene];
  return p ? photoImage(p, image) : image;
}

/** Every photo, for the credits page. */
export const ALL_PHOTOS: Photo[] = Object.values(PHOTOS);
