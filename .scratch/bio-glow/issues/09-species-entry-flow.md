# Species entry flow

Type: grilling
Status: resolved

Blocked by: 06

## Question

How does a scientist add a new Species — search-and-import from the existing WoRMS integration (`src/services/worms.ts`) with bioluminescence-specific fields (light color/pattern, depth range) added on top, a fully manual form, or both? Depends on the species schema from ticket 06.

## Answer

Hybrid: WoRMS supplies the verified taxonomic backbone, the scientist supplies the actual field data.

1. Scientist searches WoRMS by name — reuse `searchSpecies`/`getSpeciesByName` from `worms.ts` (already wrapped in `useWormsSpecies.searchSpeciesQuery`, debounced via `enabled: query.length > 2`).
2. On selecting a result, import `scientific_name`, `authority`, `taxon_rank`, `aphia_id` from the `AphiaRecord`. `getVernacularNames` can suggest a `common_name`, editable rather than locked.
3. The scientist fills in every bioluminescence-specific field themselves: `bioluminescence_type`, `depth_min_m`/`depth_max_m`/`depth_zone`, `light_color`, `light_pattern`, `habitat`, `diet`, `size_length`/`size_unit`, `fun_facts` — this is real observed data only they have, not something WoRMS or a heuristic can supply.
4. If WoRMS has no match (plausible for a genuinely new/unlisted deep-sea species), everything is entered manually and `aphia_id` stays `null`.

**Implementation note for whoever builds this**: `worms.ts`'s heuristic estimation functions (`determineBioluminescenceType`, `estimateDepthRange`, `generateLightColor`, `determineLightPattern`, `generateHabitatDescription`, `estimateDiet`, `estimateSize`, `generateFunFacts`) and their callers (`convertWormsToBioluminescentSpecies`, `fetchBioluminescentSpeciesFromWorms`, `searchBioluminescentSpecies`) become dead code under this decision — they guess bioluminescence characteristics from genus-name keyword matching, which this flow deliberately replaces with real scientist-entered data. Remove them rather than leave them unused. Keep `searchSpecies`, `getSpeciesById`, `getSpeciesByName`, `getVernacularNames`, `getDistribution`, `getClassification` — those stay as the real search/import surface.

**New ticket surfaced**: what the entry/edit form actually looks like (WoRMS search-and-select UI, layout for the manual fields) is now sharp enough to ticket — see ticket 11.
