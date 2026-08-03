# Real species photos on detail and home pages

Type: task
Status: resolved

## Question

While adding photo thumbnails to the ticket 14 catalog redesign, root-caused that `speciesImages.ts`'s image pipeline was almost entirely non-functional (see ticket 14's answer for the full diagnosis — EOL's classic API dead, GBIF thin coverage, Unsplash/Pexels never configured, a misleading generic fallback photo). Fixed there by switching to Wikipedia's REST API. That fix already benefits `SpeciesCard` (used on Home's "From the catalog") automatically since it already called the shared service — but two more prominent surfaces still show only the abstract glow-dot placeholder instead of a real photo: the species detail page's large hero photo frame (reads `species.imageUrl` from mock data, which is always empty, never calling the image service at all) and the home page's hand-built "Featured specimen" block (same issue, separate markup from `SpeciesDetail`).

## Answer

`SpeciesDetail.tsx`: added `useSpeciesImages(species)`, with `species.imageUrl` (a real uploaded photo, once ticket 07's Storage bucket exists) taking priority over the fetched photo, which takes priority over the existing glow-dot placeholder. Added a small "via {source}" attribution tag in the frame's bottom-left corner (mirroring the existing bottom-right "SPEC. {aphiaId}" tag) since Wikipedia photos need credit — only shown for the fetched photo, not a real uploaded one.

`home.tsx`: same treatment for the "Featured specimen" hero block — real photo when found (with the same attribution tag), the pulsing glow-dot animation otherwise. The photo container keeps the existing hover-scale transition, now clipped with `overflow-hidden` so it doesn't blow out the specimen frame on hover.

Both fall back gracefully to the pre-existing glow-dot placeholder for species without a Wikipedia match (2 of the 8 mock species) — never shows a wrong or misleading photo.
