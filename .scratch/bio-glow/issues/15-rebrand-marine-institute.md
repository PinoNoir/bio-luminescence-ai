# Rebrand: Bio Glow → Marine Institute

Type: task
Status: resolved

## Question

Rename the site from "Bio Glow" (nav logo/title, page `<title>`, home/login/signup copy, `CONTEXT.md`, `CLAUDE.md`) to "Marine Institute", and replace the current logo — a plain lucide `Zap` icon, called out as generic — with a distinctive mark. Full rebrand: name, logo, and all in-app copy.

## Answer

Renamed everywhere "Bio Glow"/"DeepGlow" appeared: `Navigation.tsx` (both desktop and mobile logo), `index.html` `<title>`, `home.tsx` hero copy, `login.tsx`/`signup.tsx` headings, `CONTEXT.md` domain doc title, `CLAUDE.md` project description. Left the wayfinder map's own title ("Bio Glow: species catalog...") and this repo's `.scratch/bio-glow/` directory name as-is — those are internal planning artifacts, not user-facing branding, and renaming them isn't part of what was asked.

New logo: a custom SVG mark (`src/components/layout/Logo.tsx`) replacing the plain `Zap` icon — a hexagonal specimen-frame outline (echoing the corner-bracket motif used throughout the app since ticket 10's detail view) with a pulsing glow dot at center. Ties the brand mark directly to the product's own established visual language instead of an off-the-shelf icon, which was the actual complaint.

Did not touch: the GitHub repo name (`bio-luminescence-ai`), `package.json`'s `name` field, or any URLs/slugs — those are structural/infrastructure identifiers, not the user-facing branding this ticket was scoped to, and renaming a live repo is a separate, more disruptive decision.

Incidental fix found while sweeping for remaining references: `dist/index.html` was a stray tracked build artifact (containing the old title) — `dist/` was never gitignored. Added `/dist/` to `.gitignore` and untracked the file rather than hand-editing a regenerable build output.

Also confirmed (not caused by this ticket, already tracked as fog — "Auth UX polish"): the `Auth.tsx` component renders a `fixed inset-0` overlay that covers the whole viewport, so the "Welcome Back to Marine Institute" / "Join Marine Institute" headings on login/signup never actually show — they're present in the DOM and correctly renamed, just visually hidden behind the auth form's own full-screen background. Worth knowing when that fog item gets picked up.
