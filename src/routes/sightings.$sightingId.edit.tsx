import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SightingForm } from '~/components';
import { mockSightings, mockSpecies } from '~/data';
import { SightingDraft } from '~/lib/sightingForm';

export const Route = createFileRoute('/sightings/$sightingId/edit')({
  component: EditSightingPage,
});

function EditSightingPage() {
  const { sightingId } = Route.useParams();
  const navigate = useNavigate();
  const sighting = mockSightings.find((s) => s.id === sightingId);
  const species = sighting ? mockSpecies.find((s) => s.id === sighting.speciesId) : undefined;

  if (!sighting) {
    return (
      <div className="min-h-screen bg-[#0B1426] pt-28 px-6 text-center text-white/60">
        Sighting not found.
      </div>
    );
  }

  const goBack = () => {
    if (species) {
      navigate({ to: '/species/$speciesId', params: { speciesId: species.id } });
    } else {
      navigate({ to: '/explore' });
    }
  };

  const handleSubmit = (draft: SightingDraft) => {
    // Stub — no live sightings table yet (ticket 06 is schema-only so far).
    console.log('Sighting edit draft (would be saved):', draft);
    goBack();
  };

  const handleDelete = () => {
    // Stub — no live sightings table yet (ticket 06 is schema-only so far).
    console.log('Sighting (would be deleted):', sighting.id);
    goBack();
  };

  return (
    <SightingForm
      mode="edit"
      sighting={sighting}
      initialSpecies={species ? { id: species.id, label: species.commonName } : undefined}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}
