# Marine Institute

A web app for marine biologists to catalog bioluminescent and deepwater marine species and log new field sightings of them, with photo/data upload and a taxonomy backbone sourced from WoRMS.

## Language

**Species**:
A taxonomic entry — the catalog record for a bioluminescent/deepwater organism (scientific name, bioluminescence type, depth range, habitat, etc.). Already modeled as `BioluminescentSpecies` in `src/types/index.ts`, extending WoRMS's `AphiaRecord`.

**Sighting**:
A single field record of a Species being encountered: who logged it, where (coordinates), when, at what depth, with photos and notes. Many Sightings reference one Species.
_Avoid_: Discovery, observation, finding, occurrence.
