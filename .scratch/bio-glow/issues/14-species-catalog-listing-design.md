# Species catalog/listing design

Type: prototype
Status: resolved

## Question

`explore.tsx` (the primary way people browse the catalog) is the last major screen that never picked up the Fraunces/Inter/IBM Plex Mono + specimen-card visual language established in tickets 10/11/13 — it's still on the original default-font, `bio-blue`/`bio-cyan` styling. It also still renders `SpeciesCard`, which carries the same `backdrop-blur-sm`-per-card performance issue root-caused in ticket 12 (3 blur instances per card × up to 8 species shown at once = worse than home's old problem, since Explore shows the full catalog, unfiltered, on load).

What should the species catalog/listing page look like — grid vs. list vs. something else, how search/filter/view-toggle relate to the new visual system, and what a listing card looks like (redesign `SpeciesCard` itself since it's shared with Home's "From the catalog" section and would fix the blur issue everywhere at once, or build something listing-specific)? Build a rough concrete prototype to react to.

## Answer

Three variants prototyped: **A — Specimen Grid** (redesigned card grid, corner-bracket motif at card scale), **B — Index List** (dense monospace table, no photos), **C — Depth Column** (grouped by depth zone as the primary axis, leaning into the app's core domain concept instead of a flat filterable list).

**Both B and C liked, merged into one hybrid**: depth-zone sections (C's grouping — Sunlight/Twilight/Midnight, each with a subtle background shift) containing dense table rows (B's density — species/light-type/pattern/depth columns, no photos). Folded directly into `explore.tsx`, replacing the old default-styled grid/list-toggle page and dropping `SpeciesCard` from this route entirely — sidesteps the backdrop-blur perf issue from ticket 12 on this page specifically (`SpeciesCard` itself is unchanged and still used on Home's "From the catalog").

No throwaway branch this time — the three prototype variants were built and reacted to in the same session, then directly rewritten into the real route rather than promoted piecemeal (no separate component files were created to fold in from).
