# Species entry form UI

Type: prototype
Status: resolved

## Question

What does the Species entry/edit form look like and how does it behave — the WoRMS search-and-select step (ticket 09), the imported/read-only taxonomy fields vs. the manual bioluminescence fields, and how it differs (if at all) between creating a new Species and a community edit to an existing one? Build a rough concrete prototype to react to.

## Answer

**Variant C ("Field Log Checklist") wins.** Folded into real code:

- `src/components/species/SpeciesForm.tsx` — the form (shared between create/edit via a `mode` prop), plus `species-form-fields.tsx` (shared input primitives) and `WormsSearchField.tsx` (real WoRMS search, promoted from the prototype)
- `src/lib/speciesForm.ts` — `SpeciesDraft` type + `emptyDraft`/`draftFromSpecies` helpers
- Real routes: `src/routes/species.new.tsx` (`/species/new`) and `src/routes/species.$speciesId.edit.tsx` (`/species/$speciesId/edit`)
- Wired up: an "Add a species" button on Explore, an "Edit" link on the Species detail page (both were previously dead ends)
- Save stays a stub (logs the draft) — same reason as ticket 10, no live species table yet

While building the real (not mocked) WoRMS search, found every endpoint in `src/services/worms.ts` was hitting a URL that doesn't exist (`/rest/Aphia/SearchByName/...` instead of `/rest/AphiaRecordsByName/...`) — the WoRMS search feature had never actually worked. Fixed all endpoints and verified them against the live API. Also completed the dead-code removal ticket 09 had already decided on (`searchBioluminescentSpecies`, `convertWormsToBioluminescentSpecies`, `fetchBioluminescentSpeciesFromWorms`, and their heuristic helpers) — confirmed unused anywhere else first.

**Two ideas surfaced but not built** (not sharp enough to ticket, recorded as fog on the map instead): using the WoRMS integration more broadly across the site, and a "recently added species" section on the home page.

Full three-variant prototype preserved on `throwaway/species-form-prototype-2026-08-01`.
