import { Sighting } from '~/types';

export interface SightingDraft {
  speciesId: string;
  speciesLabel: string; // display cache so the picker doesn't need a re-lookup
  location: string; // human-readable place name, e.g. "Monterey Submarine Canyon"
  latitude: number | '';
  longitude: number | '';
  depthM: number | '';
  sightedAt: string; // yyyy-mm-dd
  notes: string;
  photoCount: number; // stub — no real upload yet
}

export const emptyDraft: SightingDraft = {
  speciesId: '',
  speciesLabel: '',
  location: '',
  latitude: '',
  longitude: '',
  depthM: '',
  sightedAt: new Date().toISOString().slice(0, 10),
  notes: '',
  photoCount: 0,
};

export function draftFromSighting(sighting: Sighting, speciesLabel: string): SightingDraft {
  return {
    speciesId: sighting.speciesId,
    speciesLabel,
    location: sighting.location,
    latitude: sighting.latitude,
    longitude: sighting.longitude,
    depthM: sighting.depthM,
    sightedAt: sighting.sightedAt,
    notes: sighting.notes,
    photoCount: sighting.photoCount,
  };
}
