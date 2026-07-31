# Bio Glow: species catalog + sighting CRUD

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

## Not yet specified

- Visual design direction for key screens (species catalog, species detail, sighting form, any map/geo view) — will graduate into `/prototype` tickets once the core data model and flows (tickets 06, 09, 10) are settled.
- Whether Sightings get a map/geo visualization (the existing `/ocean` route was a 3D scene whose components were previously removed) and, if so, what renders it.
- How the existing routes (`explore`, `ocean`, `search`, `profile`, `settings`) map onto the new Species + Sighting model — likely `explore`/`search` become Species/Sighting listings and `profile` shows a scientist's own Sightings, but this isn't decided.
- Demo data seeding strategy so the deployed portfolio site looks populated on first visit (real WoRMS-sourced species vs curated sample set, sample Sightings).
- Deployment automation (GitHub Actions or manual) for both the Supabase migrations and the AWS frontend deploy.
- Auth UX polish — the existing `Auth.tsx` form is unstyled scaffolding, not portfolio-quality yet.

## Out of scope

- The existing standalone "Learn" module (guided lessons, quizzes, `mockModules`) is out of scope for this effort. See [Learn module scope](./issues/05-learn-module-scope.md) — the underlying intent (learn more about a species) is served instead by the in-scope Species detail view.
