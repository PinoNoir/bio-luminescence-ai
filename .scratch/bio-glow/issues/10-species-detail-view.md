# Species detail view

Type: prototype
Status: claimed

Blocked by: 06

## Question

What does the per-species detail view look like and how does it behave — the "learn more about this species" experience (ticket 05) with photos, taxonomy, bioluminescence details, and linked Sightings? Build a rough concrete prototype (layout, key interactions) to react to rather than deciding this in the abstract. Depends on the species schema from ticket 06 (what data is actually available to show).

## Prototype built — awaiting reaction

Three structurally different variants, live at `/prototype-species-detail?variant=A|B|C` (`pnpm dev`, visit directly — not linked from nav). Demo subject: Atolla wyvillei (deep, dramatic, and a good stress-test since mock `imageUrl` is empty). Code under `src/routes/-prototype-species-detail/` and `src/routes/prototype-species-detail.tsx`; also added a real typography foundation (Fraunces/Inter/IBM Plex Mono via Google Fonts, wired into `tailwind.config.mjs`) shared across all three, not itself part of the experiment.

- **A — Field Specimen Card**: two-column data-sheet grid, photo framed like a specimen with corner brackets, taxonomy as a monospace data table, Sightings as a literal logbook list. Document-led, dense, no scroll drama.
- **B — Descent**: full-bleed scroll journey; the background darkens toward black as you scroll and the species' own glow gets visibly brighter against it — dramatizing that bioluminescence is more visible in darkness, not decorative motion. Sightings render as a depth-ordered timeline. Atmosphere-led; works well with no photo since the glow itself is the hero.
- **C — Split Lab Panel**: persistent sticky left panel with a light-pattern visualizer that actually animates according to the species' real `lightPattern` (steady/pulsing/flashing/wave — flashing and wave use custom keyframes, pulsing reuses the existing `bio-pulse`), tabbed content (Overview / Taxonomy & Biology / Sightings) on the right. Utility/tool-led, most information-dense without a giant scroll.

This is HITL — needs an actual look, not just a description. Once you've picked one (or want to mix pieces from different ones), I'll fold the winner into a real `/species/$speciesId` route, capture the full variant set on a throwaway branch per the prototype skill, and close this out.
