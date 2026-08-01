// PROTOTYPE — wipe me. Throwaway route for ticket 11
// (.scratch/bio-glow/issues/11-species-entry-form-ui.md). Three structurally
// different species entry/edit form layouts, switchable via ?variant=, with
// ?mode=create|edit toggling the two flows ticket 09 requires handling
// differently. Not linked from any nav — visit /prototype-species-form directly.
import { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { mockSpecies } from '~/data';
import PrototypeSwitcher, { VariantMeta } from './-prototype-species-form/PrototypeSwitcher';
import VariantA from './-prototype-species-form/VariantA';
import VariantB from './-prototype-species-form/VariantB';
import VariantC from './-prototype-species-form/VariantC';
import { emptyDraft, draftFromSpecies, SpeciesDraft } from './-prototype-species-form/types';

const VARIANTS: VariantMeta[] = [
  { key: 'A', label: 'Identify → Describe' },
  { key: 'B', label: 'Live Specimen Preview' },
  { key: 'C', label: 'Field Log Checklist' },
];

export const Route = createFileRoute('/prototype-species-form')({
  validateSearch: (search: Record<string, unknown>): { variant: string; mode: 'create' | 'edit' } => ({
    variant: typeof search.variant === 'string' ? search.variant : 'A',
    mode: search.mode === 'edit' ? 'edit' : 'create',
  }),
  component: PrototypeSpeciesForm,
});

function PrototypeSpeciesForm() {
  const { variant, mode } = Route.useSearch();
  // Editing Atolla wyvillei for consistency with the ticket 10 prototype's demo subject.
  const editSubject = mockSpecies.find((s) => s.scientificname === 'Atolla wyvillei') ?? mockSpecies[1];

  const [draft, setDraft] = useState<SpeciesDraft>(mode === 'edit' ? draftFromSpecies(editSubject) : emptyDraft);
  const [savedFlash, setSavedFlash] = useState(false);

  // Reset the draft when mode changes so switching create<->edit doesn't leak state.
  useEffect(() => {
    setDraft(mode === 'edit' ? draftFromSpecies(editSubject) : emptyDraft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleSave = () => {
    // Stub — no live species table yet (ticket 06 is schema-only so far).
    console.log('Species draft (would be saved):', draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <>
      {variant === 'A' && <VariantA draft={draft} setDraft={setDraft} mode={mode} onSave={handleSave} />}
      {variant === 'B' && <VariantB draft={draft} setDraft={setDraft} mode={mode} onSave={handleSave} />}
      {variant === 'C' && <VariantC draft={draft} setDraft={setDraft} mode={mode} onSave={handleSave} />}
      {savedFlash && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] bg-green-500/20 border border-green-400/40 text-green-300 text-sm font-data px-4 py-2 rounded">
          Draft logged to console (stub — no live table yet)
        </div>
      )}
      <PrototypeSwitcher variants={VARIANTS} current={variant} mode={mode} />
    </>
  );
}
