# Home page redesign and scroll performance

Type: task
Status: resolved

## Question

The home page scrolled sluggishly and read as bland/generic compared to the design language established by tickets 10/11. Diagnose and fix both.

## Answer

**Performance diagnosis**: every `SpeciesCard` and `ModuleCard` carries its own `backdrop-blur-sm`, plus nested blurred badges. The old home page rendered 8 `SpeciesCard`s + 3 `ModuleCard`s simultaneously — roughly 30+ active `backdrop-filter: blur()` instances on screen at once. Backdrop blur is one of the most expensive properties for scroll performance, since the browser has to resample everything behind each blurred element on every scroll frame.

Fixes (scoped to `home.tsx` — did not touch `SpeciesCard`/`ModuleCard` themselves, which is a larger, separate change affecting Explore too if wanted later):
- Removed the "Learning Modules" section entirely — out of scope per ticket 05 already, and it was the single biggest remaining chunk of blur instances (3 `ModuleCard`s + a nested overlay each)
- Trimmed "Featured Species" from all 8 mock species down to 3 — cuts 5 more blurred cards, and reads better as a curated preview rather than home trying to duplicate Explore
- Removed the fake 1000ms `setTimeout` loading delay — `mockSpecies` is synchronous local data, there was nothing to actually wait for
- Cut the continuous custom shadow-animating elements (`animate-bio-glow-subtle`, `animate-bio-glow-button`, `animate-bio-pulse`) from 3 down to 1 (the hero's featured-specimen glow orb) — per frontend-design's "spend your boldness in one place"

Verified with a Chrome DevTools performance trace during a synthetic full-page scroll: no jank insights flagged, CLS 0.00, ~60fps pacing throughout.

**Design**: home.tsx had never been updated to the Fraunces/Inter/IBM Plex Mono + "Field Specimen Card" visual language established in tickets 10/11 — still plain default sans throughout, which was a big part of the "bland" complaint. Rewrote using that established system rather than exploring new directions (the identity is already decided by precedent, not a fresh multi-variant question): a large featured-specimen hero (reusing the corner-bracket frame motif at scale), real computed stats from the actual mock data (species count, sighting count, distinct light mechanisms, deepest record) instead of fabricated marketing numbers ("500+ Species", "10K+ Learners"), and copy/CTAs that point at real, working features (Explore, Add a species, Sign up) instead of implying functionality that doesn't exist yet (no sightings CRUD UI exists, so the CTA doesn't claim one).

Not a HITL prototype ticket like 10/11 — no new direction to react to, just applying the already-chosen system to a page that had been left behind.
