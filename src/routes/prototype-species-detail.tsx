// PROTOTYPE — wipe me. Throwaway route for ticket 10
// (.scratch/bio-glow/issues/10-species-detail-view.md). Three structurally
// different species-detail layouts, switchable via ?variant=. Not linked
// from any nav — visit /prototype-species-detail directly. See PrototypeSwitcher
// for the floating bar (hidden in production builds).
import { createFileRoute } from '@tanstack/react-router';
import { mockSpecies } from '~/data';
import PrototypeSwitcher, { VariantMeta } from './-prototype-species-detail/PrototypeSwitcher';
import VariantA from './-prototype-species-detail/VariantA';
import VariantB from './-prototype-species-detail/VariantB';
import VariantC from './-prototype-species-detail/VariantC';
import { mockSightings } from './-prototype-species-detail/mockSightings';

const VARIANTS: VariantMeta[] = [
  { key: 'A', label: 'Field Specimen Card' },
  { key: 'B', label: 'Descent (scroll depth)' },
  { key: 'C', label: 'Split Lab Panel' },
];

export const Route = createFileRoute('/prototype-species-detail')({
  validateSearch: (search: Record<string, unknown>): { variant: string } => ({
    variant: typeof search.variant === 'string' ? search.variant : 'A',
  }),
  component: PrototypeSpeciesDetail,
});

function PrototypeSpeciesDetail() {
  const { variant } = Route.useSearch();
  // Atolla wyvillei — deep, dramatic, defensive-flash jellyfish; good stress
  // test for the "no photo yet" case since imageUrl is empty in mock data.
  const species = mockSpecies.find((s) => s.scientificname === 'Atolla wyvillei') ?? mockSpecies[1];

  return (
    <>
      {variant === 'A' && <VariantA species={species} sightings={mockSightings} />}
      {variant === 'B' && <VariantB species={species} sightings={mockSightings} />}
      {variant === 'C' && <VariantC species={species} sightings={mockSightings} />}
      <PrototypeSwitcher variants={VARIANTS} current={variant} />
    </>
  );
}
