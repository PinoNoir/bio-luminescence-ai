# Sighting edit/delete UI

Type: task
Status: resolved

## Question

Ticket 13 only built Sighting create (`SightingForm.tsx` + `/sightings/new`, create-only). Species already has both create (ticket 11) and edit, but Sighting doesn't, even though ticket 06 made Sightings owner-editable too. Extend `SightingForm.tsx` to a real `mode: 'create' | 'edit'` component mirroring `SpeciesForm.tsx`'s pattern, add a `/sightings/$sightingId/edit` route, and wire an edit affordance into the sighting log rows on `SpeciesDetail.tsx`. The one genuinely new decision: no delete pattern exists anywhere in the app yet, so delete-confirmation UX has to be decided from scratch.

## Answer

`sightingForm.ts`: added a `location: string` field to `SightingDraft` (the create form never actually captured it, even though the `Sighting` type and mock data both have it — editing would otherwise silently drop a sighting's location on save). Added `draftFromSighting(sighting, speciesLabel)` mirroring `draftFromSpecies`.

`SightingForm.tsx`: added `mode: 'create' | 'edit'` (required, like `SpeciesForm`), an optional `sighting` prop for edit-mode field data, and an optional `onDelete`. Heading and submit label switch per mode ("Log a sighting"/"Log sighting" vs "Edit sighting"/"Save changes"). Added the missing "Location name" field, shown in the preview above the lat/lng line.

Delete confirmation: no modal/dialog component exists anywhere in this codebase (`Auth.tsx` was rebuilt in ticket 16 specifically to drop a `fixed inset-0` overlay), so a dialog would be a new, unproven pattern. Went with an inline two-step confirm instead — a quiet "Delete sighting" text link (edit mode only) that expands in place to "Delete this sighting? [Confirm delete] [Cancel]" on click, using the `red-600/20`/`text-red-400` destructive-action styling already established in `Navigation.tsx`'s sign-out button and `settings.tsx`. No new color or component introduced.

`/sightings/$sightingId/edit` (new route, hand-registered in `routeTree.gen.ts`): looks up the sighting and its species from mock data, passes both into `SightingForm`. Submit and delete are both console.log stubs, like every other CRUD action in this app pre-Supabase — navigates back to the species detail page either way.

`SpeciesDetail.tsx`: sighting log rows get a hover-revealed edit (pencil) icon-link in the existing right-hand column, matching the row-hover-reveal convention already used on the Explore listing rows. Delete isn't exposed in the row itself — only on the edit page — keeping a destructive action off a dense list where a stray click is easy, consistent with the confirm-step decision above.
