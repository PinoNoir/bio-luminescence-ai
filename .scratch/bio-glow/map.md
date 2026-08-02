# Marine Institute: species catalog + sighting CRUD

_(Effort renamed from "Bio Glow" per ticket 15 — the `.scratch/bio-glow/` directory and ticket file paths are unchanged; only user-facing branding was in scope for the rename.)_

## Destination

A deployed, portfolio-quality web app where marine biologists browse a bioluminescent/deepwater Species catalog — including a rich per-species detail view with photos — and log field Sightings (location, depth, date, photos, notes) of those species. Public visitors can browse everything without an account. Signing in as a scientist enables full CRUD on Species and Sightings, scoped to records they own for edit/delete. Backend on Supabase (Postgres + Auth + Storage + Realtime); frontend is the existing React 19 + Vite + TanStack Router scaffold, hosted on AWS.

## Notes

- This effort carries execution: tickets include both decisions and the build work itself, not just decisions — the destination is a finished, deployed app.
- Domain: read `CONTEXT.md` before exploring domain terms. `Species` and `Sighting` are already defined there.
- Consult `supabase:supabase` and `supabase:supabase-postgres-best-practices` skills for anything touching schema, RLS, storage, or auth.
- Consult `frontend-design` for any UI/visual work — the whole point of this project is to showcase design and frontend skill, so visual polish is not optional scope.
- Grilling/prototype/research tickets should use `/grilling`, `/prototype`, `/research` respectively per the ticket's `Type:` line.

## Decisions so far

- [Scope and execution mode](./issues/01-scope-and-execution-mode.md) — destination includes building and deploying the app, not just deciding the architecture.
- [Core entities](./issues/02-core-entities.md) — Species (catalog/taxonomy) and Sighting (field record) as separate entities, many Sightings per Species.
- [Access model](./issues/03-access-model.md) — public browsing, authenticated CRUD (no moderation queue); amended by ticket 06 — Species are community-editable, Sightings are owner-scoped.
- [AWS's role in the stack](./issues/04-aws-role-in-stack.md) — Supabase owns the entire backend; AWS hosts only the static frontend build.
- [AWS hosting mechanism](./issues/08-aws-hosting-mechanism.md) — AWS Amplify Hosting: native SPA rewrite rule, guided HTTPS/custom domain, git-based CI/CD, effectively free at portfolio scale.
- [Sightings and species schema](./issues/06-sightings-and-species-schema.md) — full Postgres schema (UUID PKs, flat typed columns, enum bioluminescence types, plain lat/lng) and RLS policies for both tables.
- [Photo storage design](./issues/07-photo-storage-design.md) — single public `photos` Supabase Storage bucket, entity-id path convention, `species_photos`/`sighting_photos` gallery tables (5MB/JPEG-PNG-WebP/6-per-entity limits), RLS on `storage.objects` via `storage.foldername()` mirroring ticket 06's ownership split.
- [Species entry flow](./issues/09-species-entry-flow.md) — hybrid: WoRMS supplies the taxonomic backbone (search-and-import), the scientist manually enters all bioluminescence-specific fields. `worms.ts`'s heuristic guessing functions are dead code under this decision, to be removed.
- [Species detail view](./issues/10-species-detail-view.md) — "Field Specimen Card" layout wins (of 3 prototyped); folded into `SpeciesDetail.tsx` + a real `/species/$speciesId` route, wired from Home and Explore. Added a real `Sighting` type + mock data. Full 3-variant prototype preserved on `throwaway/species-detail-prototype-2026-07-31`.
- [Species entry form UI](./issues/11-species-entry-form-ui.md) — "Field Log Checklist" layout wins (of 3 prototyped); folded into `SpeciesForm.tsx` + real `/species/new` and `/species/$speciesId/edit` routes, wired from Explore and the Species detail page. Along the way, fixed every WoRMS endpoint in `worms.ts` (all were hitting non-existent URLs — the search feature had never worked) and removed the dead heuristic-guessing code ticket 09 had flagged. Full 3-variant prototype preserved on `throwaway/species-form-prototype-2026-08-01`.
- [Home page redesign and scroll performance](./issues/12-home-page-redesign.md) — root-caused sluggish scrolling to ~30+ simultaneous `backdrop-blur-sm` instances from rendering 8 `SpeciesCard`s + 3 `ModuleCard`s at once; cut that by dropping the out-of-scope Learning Modules section and trimming featured species to 3. Rewrote the page in the Fraunces/Inter/IBM Plex Mono + specimen-card language from tickets 10/11 (it had never been updated), with real computed stats instead of fabricated marketing numbers.
- [Sighting entry form UI](./issues/13-sighting-entry-form-ui.md) — "Sighting Card Preview" layout wins (of 3 prototyped), with a fixed cyan/blue accent instead of per-species color; folded into `SightingForm.tsx` + a real `/sightings/new` route, wired from the Species detail page (pre-filled) and the home page CTA. Species picker searches the local catalog, not WoRMS. Real browser geolocation, not mocked. Full 3-variant prototype preserved on `throwaway/sighting-form-prototype-2026-08-02`.
- [Species catalog/listing design](./issues/14-species-catalog-listing-design.md) — merged hybrid of two liked variants: depth-zone sections (Sunlight/Twilight/Midnight) containing dense monospace table rows. Replaces the old default-styled grid/list Explore page, drops `SpeciesCard` (and its backdrop-blur perf cost) from this route.
- [Rebrand: Bio Glow → Marine Institute](./issues/15-rebrand-marine-institute.md) — full rename (nav, page title, home/login/signup copy, `CONTEXT.md`, `CLAUDE.md`) plus a new custom SVG logo mark (`Logo.tsx`) — a specimen-frame corner-bracket outline with a glow dot, tied to the app's own established visual language instead of a generic stock icon. Repo name and `package.json` left unchanged (structural, not user-facing branding).
- [Auth UX polish](./issues/16-auth-ux-polish.md) — rebuilt `Auth.tsx` (dropped the `fixed inset-0` overlay that hid the login/signup headings, restyled to match the established card/input language) and fixed `login.tsx`/`signup.tsx` headings to `font-display`. Also fixed a real bug found along the way: the sign-in/sign-up cross-links used `<a href>` (full page reload) instead of TanStack's `Link`.

## Not yet specified

- Visual design direction for remaining key screens (species catalog/listing) — will graduate into `/prototype` tickets once its data model and flows are settled.
- A scroll-driven "depth darkening" motion technique (background darkens + species glow intensifies as you scroll deeper) was prototyped for the species detail view (ticket 10, Variant B) and liked, but not used there — worth revisiting for a different page once one's identified as a good fit.
- Using the WoRMS integration more broadly across the site, not just the species entry form (raised while reacting to ticket 11) — no specific surface identified yet.
- A "recently added species" section on the home page (raised while reacting to ticket 11) — depends on there being a real species table to query recency from, which doesn't exist yet (ticket 06 is schema-only).
- Whether Sightings get a map/geo visualization (the existing `/ocean` route was a 3D scene whose components were previously removed) and, if so, what renders it.
- Sighting edit/delete UI — ticket 13 only built create; Species has both create (ticket 11) and edit, Sighting doesn't yet, even though ticket 06 made Sightings owner-editable too.
- How the existing routes (`explore`, `ocean`, `search`, `profile`, `settings`) map onto the new Species + Sighting model — likely `explore`/`search` become Species/Sighting listings and `profile` shows a scientist's own Sightings, but this isn't decided.
- Demo data seeding strategy so the deployed portfolio site looks populated on first visit (real WoRMS-sourced species vs curated sample set, sample Sightings).
- Deployment automation (GitHub Actions or manual) for both the Supabase migrations and the AWS frontend deploy.
- The reference "Marine Institute" design image (light card, real photography, editorial serif/sans, blue accent) and how/whether it relates to the dark abyss + specimen-card system used everywhere so far — explicitly parked while reacting to ticket 14; still undecided.

## Out of scope

- The existing standalone "Learn" module (guided lessons, quizzes, `mockModules`) is out of scope for this effort. See [Learn module scope](./issues/05-learn-module-scope.md) — the underlying intent (learn more about a species) is served instead by the in-scope Species detail view.
