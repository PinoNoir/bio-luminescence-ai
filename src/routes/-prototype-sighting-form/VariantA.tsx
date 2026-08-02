// PROTOTYPE — wipe me. Variant A for ticket 13: "Field Log" — grouped
// sections with completion counters, mirroring ticket 11's winning
// Species entry pattern for consistency across both entry forms.
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BioluminescentSpecies } from '~/types';
import { SightingDraft } from './types';
import SpeciesPicker from './SpeciesPicker';
import { Field, TextInput, NumberInput, TextArea, UseMyLocationButton, PhotoAttach } from './fields';

interface VariantProps {
  draft: SightingDraft;
  setDraft: (d: SightingDraft) => void;
  onSave: () => void;
}

type SectionKey = 'species' | 'location' | 'when' | 'notes';

function Section({
  title,
  done,
  total,
  expanded,
  onToggle,
  children,
  accent,
}: {
  title: string;
  done: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  accent: string;
}) {
  const complete = done === total;
  return (
    <div className="border border-white/10 rounded overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <span className="text-sm font-medium text-white">{title}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-data tabular-nums" style={{ color: complete ? accent : 'rgba(255,255,255,0.4)' }}>
            {done}/{total}
          </span>
          <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {expanded && <div className="p-4 space-y-4 border-t border-white/10">{children}</div>}
    </div>
  );
}

function VariantA({ draft, setDraft, onSave }: VariantProps) {
  const accent = '#00E5FF';
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({
    species: true,
    location: false,
    when: false,
    notes: false,
  });
  const toggle = (k: SectionKey) => setExpanded((e) => ({ ...e, [k]: !e[k] }));

  const speciesDone = draft.speciesId ? 1 : 0;
  const locationDone = [draft.latitude !== '', draft.longitude !== '', draft.depthM !== ''].filter(Boolean).length;
  const whenDone = draft.sightedAt ? 1 : 0;
  const notesDone = [draft.notes, draft.photoCount > 0].filter(Boolean).length;

  const handleSelect = (species: BioluminescentSpecies) => {
    setDraft({ ...draft, speciesId: species.id, speciesLabel: species.commonName });
    setExpanded((e) => ({ ...e, species: false, location: true }));
  };

  return (
    <div className="min-h-screen bg-[#0B1426] pt-28 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl text-white mb-8">Log a sighting</h1>

        <div className="space-y-3">
          <Section title="Species" done={speciesDone} total={1} expanded={expanded.species} onToggle={() => toggle('species')} accent={accent}>
            {draft.speciesId ? (
              <div className="flex items-center justify-between">
                <p className="text-white">{draft.speciesLabel}</p>
                <button type="button" onClick={() => setDraft({ ...draft, speciesId: '', speciesLabel: '' })} className="text-xs text-white/40 hover:text-white/70">
                  change
                </button>
              </div>
            ) : (
              <SpeciesPicker onSelect={handleSelect} accent={accent} />
            )}
          </Section>

          <Section title="Location & depth" done={locationDone} total={3} expanded={expanded.location} onToggle={() => toggle('location')} accent={accent}>
            <UseMyLocationButton accent={accent} onLocate={(lat, lng) => setDraft({ ...draft, latitude: Math.round(lat * 1000) / 1000, longitude: Math.round(lng * 1000) / 1000 })} />
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
          </Section>

          <Section title="When" done={whenDone} total={1} expanded={expanded.when} onToggle={() => toggle('when')} accent={accent}>
            <Field label="Date">
              <TextInput type="date" value={draft.sightedAt} onChange={(v) => setDraft({ ...draft, sightedAt: v })} />
            </Field>
          </Section>

          <Section title="Notes & photos" done={notesDone} total={2} expanded={expanded.notes} onToggle={() => toggle('notes')} accent={accent}>
            <Field label="Notes">
              <TextArea value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} />
            </Field>
            <PhotoAttach count={draft.photoCount} onChange={(n) => setDraft({ ...draft, photoCount: n })} accent={accent} />
          </Section>
        </div>

        <button
          onClick={onSave}
          className="mt-8 px-6 py-2.5 rounded font-medium text-[#0B1426] transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          Log sighting
        </button>
      </div>
    </div>
  );
}

export default VariantA;
