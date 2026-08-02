export interface SightingDraft {
  speciesId: string;
  speciesLabel: string; // display cache so the picker doesn't need a re-lookup
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
  latitude: '',
  longitude: '',
  depthM: '',
  sightedAt: new Date().toISOString().slice(0, 10),
  notes: '',
  photoCount: 0,
};
