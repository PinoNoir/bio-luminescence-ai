import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SightingForm } from '~/components';
import { mockSpecies } from '~/data';
import { SightingDraft } from '~/lib/sightingForm';

export const Route = createFileRoute('/sightings/new')({
  validateSearch: (search: Record<string, unknown>): { speciesId?: string } => ({
    speciesId: typeof search.speciesId === 'string' ? search.speciesId : undefined,
  }),
  component: NewSightingPage,
});

function NewSightingPage() {
  const { speciesId } = Route.useSearch();
  const navigate = useNavigate();
  const preselected = speciesId ? mockSpecies.find((s) => s.id === speciesId) : undefined;

  const handleSubmit = (draft: SightingDraft) => {
    // Stub — no live sightings table or Storage bucket yet (tickets 06/07 are schema-only so far).
    console.log('Sighting draft (would be saved):', draft);
    if (preselected) {
      navigate({ to: '/species/$speciesId', params: { speciesId: preselected.id } });
    } else {
      navigate({ to: '/explore' });
    }
  };

  return (
    <SightingForm
      initialSpecies={preselected ? { id: preselected.id, label: preselected.commonName } : undefined}
      onSubmit={handleSubmit}
    />
  );
}
