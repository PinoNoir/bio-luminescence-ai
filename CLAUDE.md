# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Marine Institute" — a React SPA for exploring bioluminescent marine species: species browsing/search, guided learning modules, a 3D ocean view, and user accounts/progress tracking. Species taxonomy data is sourced from the public WoRMS API; app data (species records, learning modules, user progress) is meant to live in Supabase, though most routes currently render from local mock data (`src/data/`) rather than live queries.

## Commands

Package manager is pnpm (see `packageManager` in package.json).

```bash
pnpm install       # install deps
pnpm dev           # start Vite dev server on port 3000
pnpm build         # vite build && tsc --noEmit (type-checking is part of the build, not a separate step)
pnpm start         # vite start — inherited from a prior TanStack Start setup; not a real Vite CLI subcommand, likely broken (see Known issues)
```

There is no lint script, no test framework, and no test files in the repo. Don't assume `pnpm test` or `pnpm lint` exist.

## Architecture

**Stack**: React 19 + Vite 6 + TanStack Router (file-based) + TanStack Query + Tailwind CSS + shadcn/ui (`new-york` style) + Supabase (auth/DB/storage) + `three` for 3D.

**This is a client-only SPA, not TanStack Start.** The repo previously used TanStack Start (see `.tanstack/`, `.nitro/`, `.output/` build artifacts, all gitignored) and was migrated off it — see the "Removed... Tanstack start" commit. Leftover traces from that era still exist and are dead weight, not live architecture:
- `src/utils/posts.ts` queries a `posts` Supabase table unrelated to this app's domain (species/learning) — template leftover, not wired into any route.
- `src/utils/seo.ts` has hardcoded `@tannerlinsley` Twitter handles (from the TanStack Start starter template).
- `src/components/3d/` and `src/pages/` are empty directories left over from the 3D-component removal / Start migration.
- `src/utils/supabase.ts` (server-side client, keyed by `SUPABASE_KEY`) is separate from `src/services/supabase.ts` (browser client, keyed by `VITE_SUPABASE_ANON_KEY`) — a holdover from when SSR needed a distinct server client. Nothing currently imports the server one; new code should use `src/services/supabase.ts`.

**Routing**: File-based routes live in `src/routes/*.tsx`, each exporting `Route = createFileRoute('/path')({ component })`. `src/routeTree.gen.ts` is an auto-generated route tree — never hand-edit it. Important: `vite.config.ts` does **not** include the `@tanstack/router-plugin` Vite plugin, and no `@tanstack/router-cli` is installed, so adding/removing/renaming a route file will **not** automatically regenerate `routeTree.gen.ts`. Until that tooling is reinstated, new routes need the generated file updated manually (or the plugin re-added) to be reachable. `/` redirects to `/home` (`src/routes/index.tsx`).

**Path aliases**: `~/*` maps to `src/*` (defined in both `tsconfig.json` paths and via the `vite-tsconfig-paths` plugin) — this is the alias actually used throughout the codebase (`~/components`, `~/services/supabase`, `~/types`, etc.). Note `components.json` (the shadcn/ui config) additionally declares `@/lib` and `@/hooks` aliases that are **not** configured in `tsconfig.json` or Vite — if you run the shadcn CLI to add components, check generated imports use `~/` or fix them, since `@/` won't resolve.

**Data layer**:
- `src/services/supabase.ts` — browser Supabase client plus a `supabaseService` class wrapping all CRUD/auth/storage/realtime calls (species, learning modules, user progress, interactive experiences). This is the intended data-access surface for Supabase-backed features.
- `src/services/worms.ts` — thin client for the public WoRMS REST API (`marinespecies.org`) with manual rate limiting (95 req/min), plus heuristics (`determineBioluminescenceType`, `generateLightColor`, etc.) that convert a WoRMS `AphiaRecord` into this app's `BioluminescentSpecies` shape. Use this when working with real taxonomic data rather than mocks.
- `src/services/speciesImages.ts` — multi-source image lookup (EOL, GBIF, Unsplash, Pexels, fallback) for a species, tried in order until one returns results.
- `src/data/` — static mock data (`mockSpecies`, `mockModules`) that most routes currently render directly instead of querying Supabase/WoRMS. When wiring a route to real data, replace the mock import with the corresponding hook/service call rather than layering both.
- Hooks in `src/hooks/` (`useAuth`, `useWormsSpecies`, `useSpeciesImages`) wrap the above services in TanStack Query. `QueryClient` is instantiated once in `src/routes/__root.tsx` with a 5-minute default `staleTime`.

**Types**: `src/types/index.ts` is the single source of truth for domain types (`BioluminescentSpecies`, `LearningModule`, `UserProgress`, `AphiaRecord`, etc.). `BioluminescentSpecies extends AphiaRecord`, so it carries both WoRMS taxonomy fields and app-specific fields (depth range, bioluminescence type, light color/pattern).

**Auth**: `useAuth` (`src/hooks/useAuth.ts`) wraps Supabase auth (`getUser`, `signIn`, `signInWithPassword`, `signUp`, `signOut`) in TanStack Query, keyed under `['auth', ...]`. `src/components/layout/Navigation.tsx` reads `isAuthenticated`/`user` from it to switch between signed-in and signed-out nav states.

**Styling**: Tailwind CSS v3 (`tailwind.config.mjs` + `@tailwind base/components/utilities` in `src/styles/app.css`), driven by a custom "bioluminescent" palette (`bio-blue`, `bio-green`, `bio-pink`, `abyss`, `ocean-deep`, etc.) and glow/pulse/float keyframe animations used throughout the UI for the deep-sea aesthetic. shadcn/ui components use CSS variables (`--background`, `--primary`, etc., also defined in `app.css`) resolved via `cn()` (`src/lib/utils.ts`, `clsx` + `tailwind-merge`). Note `@tailwindcss/postcss` (Tailwind v4's PostCSS plugin) is listed in `package.json` dependencies but `postcss.config.mjs` actually uses the v3 `tailwindcss` plugin — the v4 package is currently unused; don't assume v4 syntax works.

**Environment variables** (`.env.local`, gitignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (browser client), `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_ACCESS_TOKEN` (server-side/MCP), `VITE_WORMS_API_BASE`. `speciesImages.ts` additionally reads `VITE_UNSPLASH_ACCESS_KEY` / `VITE_PEXELS_API_KEY` if set.

## Known issues / gotchas

- `pnpm start` runs `vite start`, which isn't a valid Vite CLI command — likely non-functional post-migration.
- `routeTree.gen.ts` regeneration is not wired into the build (see Routing above) — verify new routes actually appear in that file.
- Two conflicting import-alias schemes exist (`~/*` used in code vs `@/lib`, `@/hooks` in `components.json`) — prefer `~/`.

## Agent skills

### Issue tracker

Issues and wayfinder maps live as markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
