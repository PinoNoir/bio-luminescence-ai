import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SpeciesForm } from '~/components';
import { mockSpecies } from '~/data';
import { SpeciesDraft } from '~/lib/speciesForm';

export const Route = createFileRoute('/species/$speciesId/edit')({
  component: EditSpeciesPage,
});

function EditSpeciesPage() {
  const { speciesId } = Route.useParams();
  const navigate = useNavigate();
  const species = mockSpecies.find((s) => s.id === speciesId);

  if (!species) {
    return (
      <div className="min-h-screen bg-[#0B1426] pt-28 px-6 text-center text-white/60">
        Species not found.
      </div>
    );
  }

  const handleSubmit = (draft: SpeciesDraft) => {
    // Stub — no live species table yet (ticket 06 is schema-only so far).
    console.log('Species edit draft (would be saved):', draft);
    navigate({ to: '/species/$speciesId', params: { speciesId } });
  };

  return <SpeciesForm mode="edit" species={species} onSubmit={handleSubmit} />;
}
