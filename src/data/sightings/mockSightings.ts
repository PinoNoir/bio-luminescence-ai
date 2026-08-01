import { Sighting } from '~/types';

export const mockSightings: Sighting[] = [
  {
    id: 's1',
    speciesId: '2', // Atolla wyvillei
    submittedBy: 'Dr. Elena Vasquez',
    location: 'Monterey Submarine Canyon',
    latitude: 36.7,
    longitude: -122.05,
    depthM: 1850,
    sightedAt: '2026-04-12',
    notes:
      'ROV Doc Ricketts encountered a single individual during a routine midwater transect. Full defensive flash sequence triggered on approach — recorded on high-speed camera.',
    photoCount: 4,
  },
  {
    id: 's2',
    speciesId: '2',
    submittedBy: 'Kenji Osei',
    location: 'Izu-Ogasawara Trench',
    latitude: 29.3,
    longitude: 140.1,
    depthM: 2400,
    sightedAt: '2026-02-03',
    notes: 'Bloom of ~30 individuals near a hydrothermal seep. Unusually shallow for this population.',
    photoCount: 6,
  },
  {
    id: 's3',
    speciesId: '2',
    submittedBy: 'Dr. Elena Vasquez',
    location: 'Monterey Submarine Canyon',
    latitude: 36.68,
    longitude: -122.02,
    depthM: 2100,
    sightedAt: '2025-11-19',
    notes: 'Juvenile specimen, notably dimmer flash than adults observed in the same canyon system.',
    photoCount: 2,
  },
];
