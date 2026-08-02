// PROTOTYPE — wipe me. Variant B for ticket 13: "Quick Log" — a
// single-flow, phone-width form optimized for standing on a boat logging
// a sighting fast. Geolocation is the hero interaction, not buried in a
// section — you're already standing where you saw it.
import { BioluminescentSpecies } from '~/types';
import { SightingDraft } from './types';
import SpeciesPicker from './SpeciesPicker';
import { Field, NumberInput, TextInput, TextArea, PhotoAttach } from './fields';
import { LocateFixed, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface VariantProps {
  draft: SightingDraft;
  setDraft: (d: SightingDraft) => void;
  onSave: () => void;
}

function VariantB({ draft, setDraft, onSave }: VariantProps) {
  const accent = '#00E5FF';
  const [locating, setLocating] = useState(false);
  const hasLocation = draft.latitude !== '' && draft.longitude !== '';

  const grabLocation = () => {
    if (!('geolocation' in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDraft({
          ...draft,
          latitude: Math.round(pos.coords.latitude * 1000) / 1000,
          longitude: Math.round(pos.coords.longitude * 1000) / 1000,
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleSelect = (species: BioluminescentSpecies) => {
    setDraft({ ...draft, speciesId: species.id, speciesLabel: species.commonName });
  };

  return (
    <div className="min-h-screen bg-[#0B1426] pt-28 pb-24 px-6 flex justify-center">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-white mb-1 text-center">Log a sighting</h1>
        <p className="text-white/40 text-sm text-center mb-8">Fast entry, right where you are</p>

        {/* Hero: location capture */}
        <button
          type="button"
          onClick={grabLocation}
          disabled={locating}
          className="w-full flex flex-col items-center justify-center gap-3 rounded-lg border-2 py-8 mb-6 transition-colors"
          style={{ borderColor: hasLocation ? accent : `${accent}44` }}
        >
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${hasLocation ? 'animate-bio-pulse' : ''}`}
            style={{ backgroundColor: `${accent}22`, boxShadow: hasLocation ? `0 0 24px ${accent}` : undefined }}
          >
            {locating ? (
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
            ) : (
              <LocateFixed className="w-6 h-6" style={{ color: accent }} />
            )}
          </div>
          <p className="text-white font-medium">
            {hasLocation ? `${draft.latitude}, ${draft.longitude}` : locating ? 'Locating…' : 'Tap to capture location'}
          </p>
        </button>

        <div className="space-y-5">
          <Field label="Species">
            {draft.speciesId ? (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-3 py-2.5">
                <span className="text-white">{draft.speciesLabel}</span>
                <button type="button" onClick={() => setDraft({ ...draft, speciesId: '', speciesLabel: '' })} className="text-xs text-white/40">
                  change
                </button>
              </div>
            ) : (
              <SpeciesPicker onSelect={handleSelect} accent={accent} />
            )}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Depth (m)">
              <NumberInput value={draft.depthM} onChange={(v) => setDraft({ ...draft, depthM: v })} />
            </Field>
            <Field label="Date">
              <TextInput type="date" value={draft.sightedAt} onChange={(v) => setDraft({ ...draft, sightedAt: v })} />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <TextArea value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} rows={2} />
          </Field>

          <PhotoAttach count={draft.photoCount} onChange={(n) => setDraft({ ...draft, photoCount: n })} accent={accent} />
        </div>

        <button
          onClick={onSave}
          className="w-full mt-8 px-6 py-3 rounded font-medium text-[#0B1426] transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          Log sighting
        </button>
      </div>
    </div>
  );
}

export default VariantB;
