import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SpeciesDetail } from '~/components';
import { mockSpecies, mockSightings } from '~/data';

export const Route = createFileRoute('/species/$speciesId')({
  component: SpeciesDetailPage,
});

function SpeciesDetailPage() {
  const { speciesId } = Route.useParams();
  const navigate = useNavigate();
  const species = mockSpecies.find((s) => s.id === speciesId);
  const sightings = mockSightings.filter((s) => s.speciesId === speciesId);

  if (!species) {
    return (
      <div className="min-h-screen bg-[#0B1426] pt-28 px-6 text-center text-white/60">
        Species not found.
      </div>
    );
  }

  return (
    <SpeciesDetail
      species={species}
      sightings={sightings}
      onBack={() => navigate({ to: '/explore' })}
    />
  );
}
