# Photo storage design

Type: grilling
Status: resolved

Blocked by: 06

## Question

How are Species and Sighting photos stored in Supabase Storage — bucket structure, path convention, file size/type limits, and how many photos per Sighting? Depends on the schema from ticket 06 (what references a photo, and from where).

## Answer

Sourced from the primary Supabase Storage docs (`storage/security/access-control.md`, `storage/schema/design.md`) rather than memory, per the `supabase` skill's rule to verify against current docs.

**Bucket**: single public bucket named `photos`. Public (not private + signed URLs) because everything is public-read anyway per ticket 03/06 — a public bucket serves plain, CDN-cacheable URLs with no signed-URL machinery needed. File size limit and allowed MIME types are enforced at the **bucket level** (server-side guarantee, not just client-side JS):

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
```

**Path convention**: `species/{species_id}/{uuid}.{ext}` and `sightings/{sighting_id}/{uuid}.{ext}` — the entity's own id as the folder, not the uploader's, since ownership is looked up from the entity (see RLS below), not encoded in the path.

**Multiple photos per entity** (supersedes the single `cover_photo_path` column ticket 06 tentatively added — that column is dropped): junction tables, matching ticket 02's "photos" (plural) on Sighting.

```sql
create table public.species_photos (
  id uuid primary key default gen_random_uuid(),
  species_id uuid not null references public.species(id) on delete cascade,
  storage_path text not null unique,
  uploaded_by uuid references auth.users(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index species_photos_species_id_idx on public.species_photos (species_id);

create table public.sighting_photos (
  id uuid primary key default gen_random_uuid(),
  sighting_id uuid not null references public.sightings(id) on delete cascade,
  storage_path text not null unique,
  uploaded_by uuid references auth.users(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index sighting_photos_sighting_id_idx on public.sighting_photos (sighting_id);
```

A "cover" image for card/list views is just the lowest `sort_order` row per entity — no separate column to keep in sync.

**Limits**: 5MB per file, JPEG/PNG/WebP only (bucket-level, above), max 6 photos per entity — enforced with a trigger (a small DB-level guarantee rather than trusting the client to count):

```sql
create or replace function public.enforce_photo_limit()
returns trigger
language plpgsql
as $$
declare
  photo_count integer;
  max_photos constant integer := 6;
begin
  if tg_table_name = 'species_photos' then
    select count(*) into photo_count from public.species_photos where species_id = new.species_id;
  else
    select count(*) into photo_count from public.sighting_photos where sighting_id = new.sighting_id;
  end if;

  if photo_count >= max_photos then
    raise exception 'Maximum of % photos per entry', max_photos;
  end if;

  return new;
end;
$$;

create trigger species_photos_limit
  before insert on public.species_photos
  for each row execute function public.enforce_photo_limit();

create trigger sighting_photos_limit
  before insert on public.sighting_photos
  for each row execute function public.enforce_photo_limit();
```

**RLS on `species_photos`/`sighting_photos`** (public read; write access mirrors ticket 06's ownership split — species community-writable, sightings owner-scoped):

```sql
alter table public.species_photos enable row level security;
alter table public.sighting_photos enable row level security;

create policy species_photos_select_all on public.species_photos
  for select to anon, authenticated using (true);

create policy species_photos_write_authenticated on public.species_photos
  for all to authenticated using (true) with check (true);

create policy sighting_photos_select_all on public.sighting_photos
  for select to anon, authenticated using (true);

create policy sighting_photos_write_own on public.sighting_photos
  for all to authenticated
  using (exists (select 1 from public.sightings s where s.id = sighting_id and s.submitted_by = (select auth.uid())))
  with check (exists (select 1 from public.sightings s where s.id = sighting_id and s.submitted_by = (select auth.uid())));
```

**RLS on `storage.objects`** (bucket `photos`), using `storage.foldername(name)` to read the entity-type and id out of the path, per the docs' folder-based policy pattern. `for all` is used deliberately, not just `for insert` — the docs' security checklist flags that upsert needs INSERT + SELECT + UPDATE together or file replacement silently fails:

```sql
create policy photos_select_all on storage.objects
  for select to anon, authenticated using (bucket_id = 'photos');

create policy photos_species_write on storage.objects
  for all to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = 'species')
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = 'species');

create policy photos_sightings_write on storage.objects
  for all to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = 'sightings'
    and exists (
      select 1 from public.sightings s
      where s.id::text = (storage.foldername(name))[2]
        and s.submitted_by = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = 'sightings'
    and exists (
      select 1 from public.sightings s
      where s.id::text = (storage.foldername(name))[2]
        and s.submitted_by = (select auth.uid())
    )
  );
```

Note: uploading a Sighting's photos requires the `sightings` row to exist first (its id is part of the path and the RLS ownership check), so the create flow is create-sighting-row → upload-photos, not simultaneous.
