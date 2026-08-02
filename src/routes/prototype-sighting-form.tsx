// PROTOTYPE — wipe me. Throwaway route for ticket 13
// (.scratch/bio-glow/issues/13-sighting-entry-form-ui.md). Three
// structurally different Sighting entry form layouts, switchable via
// ?variant=. Not linked from any nav — visit /prototype-sighting-form directly.
import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import PrototypeSwitcher, { VariantMeta } from './-prototype-sighting-form/PrototypeSwitcher';
import VariantA from './-prototype-sighting-form/VariantA';
import VariantB from './-prototype-sighting-form/VariantB';
import VariantC from './-prototype-sighting-form/VariantC';
import { emptyDraft, SightingDraft } from './-prototype-sighting-form/types';

const VARIANTS: VariantMeta[] = [
  { key: 'A', label: 'Field Log' },
  { key: 'B', label: 'Quick Log' },
  { key: 'C', label: 'Sighting Card Preview' },
];

export const Route = createFileRoute('/prototype-sighting-form')({
  validateSearch: (search: Record<string, unknown>): { variant: string } => ({
    variant: typeof search.variant === 'string' ? search.variant : 'A',
  }),
  component: PrototypeSightingForm,
});

function PrototypeSightingForm() {
  const { variant } = Route.useSearch();
  const [draft, setDraft] = useState<SightingDraft>(emptyDraft);
  const [savedFlash, setSavedFlash] = useState(false);

  const handleSave = () => {
    // Stub — no live sightings table or Storage bucket yet (tickets 06/07 are schema-only so far).
    console.log('Sighting draft (would be saved):', draft);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <>
      {variant === 'A' && <VariantA draft={draft} setDraft={setDraft} onSave={handleSave} />}
      {variant === 'B' && <VariantB draft={draft} setDraft={setDraft} onSave={handleSave} />}
      {variant === 'C' && <VariantC draft={draft} setDraft={setDraft} onSave={handleSave} />}
      {savedFlash && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] bg-green-500/20 border border-green-400/40 text-green-300 text-sm font-data px-4 py-2 rounded">
          Draft logged to console (stub — no live table yet)
        </div>
      )}
      <PrototypeSwitcher variants={VARIANTS} current={variant} />
    </>
  );
}
