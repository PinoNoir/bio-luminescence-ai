# Sighting entry form UI

Type: prototype
Status: resolved

## Question

Species has a full CRUD form (ticket 11); Sightings only render mock data — there's no way to actually log one yet, even though "log field Sightings" is half the app's stated destination. What does the Sighting entry form look like and how does it behave — picking an existing Species (not importing a new one; a Sighting always references a cataloged Species), capturing location (lat/lng, ticket 06 kept this plain rather than PostGIS — is a browser-geolocation "use my location" button worth it for a field-data tool?), depth, date, notes, and photos (ticket 07: up to 6, 5MB, JPEG/PNG/WebP)? Build a rough concrete prototype to react to. Photo upload and save stay stubs, same reasoning as ticket 11 — no live Supabase table or Storage bucket yet.

## Answer

**Variant C ("Sighting Card Preview") wins**, with one adjustment: a fixed cyan/blue accent (`#00E5FF`) instead of the per-species dynamic glow color the prototype used.

Folded into real code:
- `src/components/sightings/SightingForm.tsx` (+ `SpeciesPicker.tsx`, `sighting-form-fields.tsx`) — real route `src/routes/sightings.new.tsx` at `/sightings/new`
- `src/lib/sightingForm.ts` — `SightingDraft` type + `emptyDraft`
- Wired up: a "Log a sighting" link on the Species detail page's sighting log (pre-fills the species via `?speciesId=`), and a "Log a sighting" link alongside the home page's "Create an account" CTA
- Geolocation capture is real (`navigator.geolocation`), species picker searches the local catalog rather than WoRMS — confirmed both work end-to-end with real browser geolocation and real pre-fill from a species page
- Save stays a stub (logs the draft), same reasoning as ticket 11 — no live Sightings table or Storage bucket yet

Full 3-variant prototype preserved on `throwaway/sighting-form-prototype-2026-08-02`.
