import { useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { BioluminescentSpecies } from '~/types';
import { SightingDraft, emptyDraft } from '~/lib/sightingForm';
import SpeciesPicker from './SpeciesPicker';
import { Field, NumberInput, TextInput, TextArea, UseMyLocationButton, PhotoAttach } from './sighting-form-fields';

// Fixed cyan/blue accent for this page — not the per-species glow color,
// per explicit direction while reacting to the ticket 13 prototype.
const ACCENT = '#00E5FF';

interface SightingFormProps {
  initialSpecies?: { id: string; label: string };
  onSubmit: (draft: SightingDraft) => void;
}

function SightingPreview({ draft }: { draft: SightingDraft }) {
  return (
    <div className="sticky top-28">
      <p className="text-xs uppercase tracking-widest text-white/30 font-data mb-3">Preview</p>
      <div className="border rounded-lg p-5" style={{ borderColor: `${ACCENT}33` }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT }} />
          <p className="text-white font-medium">{draft.speciesLabel || <span className="text-white/20">Species…</span>}</p>
        </div>
        <div className="space-y-2 text-sm font-data text-white/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-white/30" />
            <span>
              {draft.latitude !== '' && draft.longitude !== '' ? `${draft.latitude}, ${draft.longitude}` : '—'}
              {draft.depthM !== '' ? ` · ${draft.depthM}m` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-white/30" />
            <span>{draft.sightedAt || '—'}</span>
          </div>
        </div>
        {draft.notes && <p className="mt-3 text-sm text-white/70">{draft.notes}</p>}
        <p className="mt-3 text-xs text-white/30 font-data">{draft.photoCount > 0 ? `${draft.photoCount} photo${draft.photoCount === 1 ? '' : 's'}` : 'no photos yet'}</p>
      </div>
    </div>
  );
}

function SightingForm({ initialSpecies, onSubmit }: SightingFormProps) {
  const [draft, setDraft] = useState<SightingDraft>(
    initialSpecies ? { ...emptyDraft, speciesId: initialSpecies.id, speciesLabel: initialSpecies.label } : emptyDraft,
  );

  const handleSelect = (species: BioluminescentSpecies) => {
    setDraft({ ...draft, speciesId: species.id, speciesLabel: species.commonName });
  };

  return (
    <div className="min-h-screen bg-[#0B1426] pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_320px] gap-12">
        <div>
          <h1 className="font-display text-3xl text-white mb-8">Log a sighting</h1>
          <div className="space-y-6">
            <Field label="Species">
              {draft.speciesId ? (
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-3 py-2.5">
                  <span className="text-white">{draft.speciesLabel}</span>
                  <button type="button" onClick={() => setDraft({ ...draft, speciesId: '', speciesLabel: '' })} className="text-xs text-white/40">
                    change
                  </button>
                </div>
              ) : (
                <SpeciesPicker onSelect={handleSelect} accent={ACCENT} />
              )}
            </Field>

            <UseMyLocationButton
              accent={ACCENT}
              onLocate={(lat, lng) => setDraft({ ...draft, latitude: Math.round(lat * 1000) / 1000, longitude: Math.round(lng * 1000) / 1000 })}
            />

            <div className="grid grid-cols-3 gap-3">
              <Field label="Latitude">
                <NumberInput value={draft.latitude} onChange={(v) => setDraft({ ...draft, latitude: v })} />
              </Field>
              <Field label="Longitude">
                <NumberInput value={draft.longitude} onChange={(v) => setDraft({ ...draft, longitude: v })} />
              </Field>
              <Field label="Depth (m)">
                <NumberInput value={draft.depthM} onChange={(v) => setDraft({ ...draft, depthM: v })} />
              </Field>
            </div>

            <Field label="Date">
              <TextInput type="date" value={draft.sightedAt} onChange={(v) => setDraft({ ...draft, sightedAt: v })} />
            </Field>

            <Field label="Notes">
              <TextArea value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} />
            </Field>

            <PhotoAttach count={draft.photoCount} onChange={(n) => setDraft({ ...draft, photoCount: n })} accent={ACCENT} />

            <button onClick={() => onSubmit(draft)} className="px-6 py-2.5 rounded font-medium text-[#0B1426] transition-opacity hover:opacity-90" style={{ backgroundColor: ACCENT }}>
              Log sighting
            </button>
          </div>
        </div>

        <SightingPreview draft={draft} />
      </div>
    </div>
  );
}

export default SightingForm;
