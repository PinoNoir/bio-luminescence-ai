# Sightings and species schema

Type: grilling
Status: resolved

## Question

What's the Postgres schema for `species` and `sightings` (columns, types, foreign keys), and what RLS policies enforce the access model from ticket 03 (public read, owner-scoped write)? Consult `supabase:supabase-postgres-best-practices` before proposing types/indexes/RLS shape.

## Answer

Decisions made while resolving this ticket (grilled one at a time):

- **Primary keys**: `uuid default gen_random_uuid()` on both tables — matches the existing frontend `id: string` typing and Supabase's `auth.uid()` convention. Fragmentation concerns from the best-practices guide don't apply at portfolio scale.
- **3D/video fields**: dropped (`videoUrl`, `threeDModelUrl` from the old mock type) — out of scope, no 3D/video feature exists in this destination.
- **Nested fields** (`depthRange`, `size`): flattened into typed columns rather than `jsonb`, for real constraints/indexing.
- **Depth unit**: normalized to meters only (`depth_min_m`/`depth_max_m`) — the existing WoRMS service (`worms.ts`) already implicitly assumes meters; dropping the unit choice matches actual oceanographic convention and simplifies range queries.
- **Size unit**: kept as a per-record choice (`size_length` + `size_unit` check constraint) since real specimens span mm to meters and forcing one unit isn't natural.
- **Sighting location**: plain `latitude`/`longitude double precision` columns with range CHECKs, not PostGIS — no confirmed need for radius/proximity queries yet (map visualization is still open fog), and this upgrades to `geography(Point)` later without much pain if needed.
- **Bioluminescence type**: native Postgres enum (`bioluminescence_type_enum`) in an array column with a GIN index, mirroring the existing TS enum — self-documents valid values at the DB level.
- **Amended while resolving ticket 07**: dropped the `cover_photo_path` column below — it's superseded by the `species_photos`/`sighting_photos` gallery tables from ticket 07, which support multiple photos and derive a "cover" image as the lowest-`sort_order` row instead of a separate synced column.
- **Ownership split** (amends ticket 03): Species are community-editable (any authenticated scientist can fix/improve an entry, like a shared taxon page) since they're objective taxonomy facts, not personal records. Sightings stay strictly owner-scoped for edit/delete, since "who saw this, where" is inherently personal. Species **delete** is creator-only even though edit is open, to avoid casual/accidental loss on a shared catalog — a judgment call, not explicitly asked; open to revisiting.

### Schema

```sql
create type public.bioluminescence_type_enum as enum (
  'bacterial', 'photophore', 'luciferin_luciferase', 'counter_illumination',
  'defensive_flash', 'communication', 'predation'
);

create table public.species (
  id uuid primary key default gen_random_uuid(),
  aphia_id bigint unique,                 -- WoRMS AphiaID; null if manually entered (ticket 09)
  scientific_name text not null,
  common_name text not null,
  authority text,
  taxon_rank text,
  bioluminescence_type public.bioluminescence_type_enum[] not null default '{}',
  depth_min_m numeric not null,
  depth_max_m numeric not null,
  depth_zone text not null check (depth_zone in ('sunlight','twilight','midnight','abyssal','hadal')),
  light_color text not null,              -- hex
  light_pattern text not null check (light_pattern in ('steady','pulsing','flashing','wave')),
  habitat text,
  diet text,
  size_length numeric,
  size_unit text check (size_unit in ('mm','cm','m')),
  conservation_status text,
  fun_facts text[] not null default '{}',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint species_depth_range_valid check (depth_max_m >= depth_min_m)
);

create index species_scientific_name_idx on public.species (scientific_name);
create index species_bioluminescence_type_idx on public.species using gin (bioluminescence_type);
create index species_created_by_idx on public.species (created_by);

create table public.sightings (
  id uuid primary key default gen_random_uuid(),
  species_id uuid not null references public.species(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete cascade,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  depth_m numeric,
  sighted_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sightings_species_id_idx on public.sightings (species_id);
create index sightings_submitted_by_idx on public.sightings (submitted_by);
create index sightings_sighted_at_idx on public.sightings (sighted_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger species_set_updated_at
  before update on public.species
  for each row execute function public.set_updated_at();

create trigger sightings_set_updated_at
  before update on public.sightings
  for each row execute function public.set_updated_at();
```

### RLS

```sql
alter table public.species enable row level security;
alter table public.sightings enable row level security;

-- Species: public read
create policy species_select_all on public.species
  for select to anon, authenticated using (true);

-- Species: any authenticated scientist can create or edit (community catalog)
create policy species_insert_authenticated on public.species
  for insert to authenticated with check ((select auth.uid()) is not null);

create policy species_update_authenticated on public.species
  for update to authenticated using (true) with check (true);

-- Species: creator-only delete
create policy species_delete_owner on public.species
  for delete to authenticated using ((select auth.uid()) = created_by);

-- Sightings: public read
create policy sightings_select_all on public.sightings
  for select to anon, authenticated using (true);

-- Sightings: owner-scoped write
create policy sightings_insert_own on public.sightings
  for insert to authenticated with check ((select auth.uid()) = submitted_by);

create policy sightings_update_own on public.sightings
  for update to authenticated
  using ((select auth.uid()) = submitted_by)
  with check ((select auth.uid()) = submitted_by);

create policy sightings_delete_own on public.sightings
  for delete to authenticated using ((select auth.uid()) = submitted_by);
```

All RLS policies wrap `auth.uid()` in `(select ...)` per the performance guidance (evaluated once per query, not per row), and both foreign key columns (`species_id`, `submitted_by`, `created_by`) are indexed.
