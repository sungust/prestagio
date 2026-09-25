# The Planner: logic and dataset

The Planner runs entirely on curated data and transparent rules, with no paid API. Code: `src/lib/planner/`.

## Flow

| Step | Where | What happens |
|---|---|---|
| 1 Choose the feeling | `/plan?step=1` | Multi-select of 7 moods (the 5 from the brief + "Slow down and restore", "An iconic drive"). |
| 2 Set the boundaries | `/plan?step=2` | Departure (35 airports, free text allowed), month or exact dates, nights, party, comfortable nightly budget. All optional. |
| 3 Reveal three escapes | `/plan?step=3` | Three distinct escapes with reasons, cautions, 3-day outline, stay and journey preview, travel effort. |
| 4 Explore an escape | `/plan/escape/<id>?…` | Destination, itinerary adapted to length, stay (+ Agoda module when approved), arrival & ground transport, car *or* transfer, watch, aroma, related stories. |
| 5 Save or share | same page | Escape card, save to device, copy link, native share, print/PDF, email **only on request** with a separate unchecked newsletter opt-in. |

Answers live only in the URL (`m`, `from`, `mo`, `n`, `p`, `b`), so results are shareable and nothing is stored server-side. The homepage preview pre-fills step 1 and continues at step 2.

## Scoring rules (`engine.ts`)

| Rule | Points |
|---|---|
| Mood fit (0–3 per destination per mood) | +4 × fit, for each chosen mood |
| No chosen mood is a strong fit (≥2) | −6 |
| Month is a best month | +4 |
| Month is a busiest month | −1 (+ caution) |
| Month when many stays close | −8 (+ caution) |
| Nights within ideal range | +3 |
| Nights below minimum | −3 per missing night (+ caution) |
| Budget ≥ editorial price level | +1 |
| Budget below price level | −4 per level (+ caution) |
| Party fit strong / poor | +2 / −6 (+ caution) |
| Flight > 7 h on ≤ 3 nights | −6 (+ caution) |
| Flight > 10 h on 4–5 nights | −4 (+ caution) |
| "Long weekend" chosen and flight > 5 h | −4 |

Every reason and caution shown to the visitor is emitted by the rule that scored it.

**Diversity:** a greedy pick never shows two destinations from the same `group`. It subtracts 6 for a shared country and 3 for the same dominant mood, so the three escapes are different journeys rather than three similar hotels.

**Transport:** a car is offered only where `driving.suitable` is true. Families and friends get the five-seat option. Everywhere else (Amalfi in season, Venice, Kyoto, Paris, Marrakech, Maldives) the escape shows a transfer and explains why.

**Travel effort:** great-circle distance ÷ 800 km/h + 30 min, rounded to half hours, shown only for known airports, and labelled as an estimate that does not imply a direct flight. Under 250 km counts as "no flight needed". No fares, tolls, fuel or schedules are shown.

**Itinerary:** 3 core days. Longer stays add curated extra days, and any remainder is left free.

## Optional AI enhancement (`narrator.ts`)

It sits behind the `EscapeNarrator` interface and is off by default. When `AI_ENHANCEMENT_ENABLED=true` and `ANTHROPIC_API_KEY` is set, it adds one short paragraph to the escape page that rephrases only facts from the dataset (the prompt forbids prices, availability, ratings and quotes). Cost controls: a daily cap (`AI_DAILY_REQUEST_CAP`), an in-memory cache, low effort, an 8-second timeout, no retries, and server-side refusal fallbacks. Any failure falls back to the deterministic page.

## Initial curated dataset

| Destination | Group | Stay (research-based) | Transport | Watch | Aroma |
|---|---|---|---|---|---|
| Lake Como | italy | Villa d'Este, Cernobbio | Aston Martin DB12 Volante / Range Rover | JLC Reverso | Cypress & warm stone |
| Amalfi Coast | italy-south | Le Sirenuse, Positano | Private driver & boat | Omega Seamaster 300M | Lemon leaf & neroli |
| Baa Atoll, Maldives | indian-ocean | Soneva Fushi | Seaplane | Rolex Submariner | Vetiver & coconut water |
| Paris | france-city | Ritz Paris | Chauffeured car | Cartier Tank | Iris & soft leather |
| Kyoto | japan | Aman Kyoto | Rail + private driver | Grand Seiko SBGA211 | Hinoki & green tea |
| Lisbon & Sintra coast | portugal | Bairro Alto Hotel | Porsche 911 Targa 4 / Range Rover | IWC Portugieser | Bitter orange & cedar |
| Marrakech | morocco | La Mamounia | Private driver & 4×4 | Cartier Santos | Damask rose & cedar |
| St. Moritz & Engadin | alps | Badrutt's Palace | Bentley Continental GT / Range Rover | AP Royal Oak | Stone pine & woodsmoke |
| Scottish Highlands | uk | Inverlochy Castle Hotel | Range Rover / Defender 110 | Tudor Black Bay | Heather & peat smoke |
| Cape Town & Winelands | southern-africa | Ellerman House | Porsche 911 Targa 4 / Range Rover | Rolex GMT-Master II | Fynbos & sea air |
| Venice | italy-venice | Aman Venice | Private water taxi | Patek Philippe Calatrava | Amber & lagoon salt |
| Cap-Ferrat & Riviera | france-coast | Grand-Hôtel du Cap-Ferrat | Ferrari Roma Spider / Range Rover | VC Overseas | Fig & mimosa |

Files: `content/planner/{moods,airports,cars,watches,aromas}.json`, `content/planner/destinations/*.json`. **Editors should fact-check the dataset before launch.** It was compiled from general knowledge and has not been verified against current property information. `npm run content:check` validates references, ranges, and that no attraction is listed as a stay.
