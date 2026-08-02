import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SpeciesForm } from '~/components';
import { SpeciesDraft } from '~/lib/speciesForm';

export const Route = createFileRoute('/species/new')({
  component: NewSpeciesPage,
});

function NewSpeciesPage() {
  const navigate = useNavigate();

  const handleSubmit = (draft: SpeciesDraft) => {
    // Stub — no live species table yet (ticket 06 is schema-only so far).
    console.log('New species draft (would be saved):', draft);
    navigate({ to: '/explore' });
  };

  return <SpeciesForm mode="create" onSubmit={handleSubmit} />;
}
