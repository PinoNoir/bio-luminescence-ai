// PROTOTYPE — wipe me. Variant B for ticket 11: "Live Specimen Preview".
// Split screen: form on the left, a live-updating miniature of ticket 10's
// winning Field Specimen Card on the right — direct manipulation, and a
// visual through-line back to the detail view scientists will actually see.
import { useState } from 'react';
import { AphiaRecord } from '~/types';
import { SpeciesDraft } from './types';
import WormsSearchField from './WormsSearchField';
import {
  Field,
  TextInput,
  NumberInput,
  TextArea,
  SelectInput,
  BioluminescenceTypeChips,
  ColorPicker,
  FunFactsEditor,
} from './fields';

interface VariantProps {
  draft: SpeciesDraft;
  setDraft: (d: SpeciesDraft) => void;
  mode: 'create' | 'edit';
  onSave: () => void;
}

function MiniSpecimenCard({ draft }: { draft: SpeciesDraft }) {
  const accent = draft.lightColor || '#00E5FF';
  return (
    <div className="sticky top-28">
      <p className="text-xs uppercase tracking-widest text-white/30 font-data mb-3">Live preview</p>
      <div className="relative aspect-square border rounded-none mb-4" style={{ borderColor: `${accent}55` }}>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] to-[#1a2332]">
          <div
            className="w-12 h-12 rounded-full animate-bio-pulse"
            style={{ backgroundColor: accent, boxShadow: `0 0 30px ${accent}` }}
          />
        </div>
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-white/30 font-data mb-1">Field Record</p>
      <h2 className="font-display text-2xl text-white leading-tight">
        {draft.commonName || <span className="text-white/20">Common name…</span>}
      </h2>
      <p className="italic text-white/40 font-display text-sm mt-1">
        {draft.scientificname || <span className="text-white/20">Scientific name…</span>}
      </p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {draft.bioluminescenceType.length === 0 && (
          <span className="text-xs text-white/20 font-data">no type selected</span>
        )}
        {draft.bioluminescenceType.map((t) => (
          <span
            key={t}
            className="text-[10px] font-data uppercase px-1.5 py-0.5 rounded-sm border"
            style={{ borderColor: `${accent}66`, color: accent }}
          >
            {t.replace(/_/g, ' ')}
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-1 text-xs font-data text-white/50">
        <p>
          Depth: {draft.depthMin === '' ? '—' : draft.depthMin}–{draft.depthMax === '' ? '—' : draft.depthMax}m ·{' '}
          {draft.depthZone}
        </p>
        <p>
          Size: {draft.sizeLength === '' ? '—' : draft.sizeLength}
          {draft.sizeUnit} · {draft.lightPattern}
        </p>
      </div>
      {draft.habitat && <p className="mt-3 text-sm text-white/60 line-clamp-2">{draft.habitat}</p>}
    </div>
  );
}

function VariantB({ draft, setDraft, mode, onSave }: VariantProps) {
  const [searching, setSearching] = useState(mode === 'create');
  const accent = draft.lightColor || '#00E5FF';

  const handleSelect = (record: AphiaRecord) => {
    setDraft({
      ...draft,
      aphiaId: record.AphiaID,
      scientificname: record.scientificname,
      authority: record.authority,
      rank: record.rank,
    });
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-[#0B1426] pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_320px] gap-12">
        <div>
          <h1 className="font-display text-3xl text-white mb-6">
            {mode === 'create' ? 'Add a species' : `Edit ${draft.scientificname || 'species'}`}
          </h1>

          {searching ? (
            <WormsSearchField onSelect={handleSelect} onSkip={() => setSearching(false)} accent={accent} />
          ) : (
            <div className="space-y-7">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50 font-data">
                  {draft.scientificname || 'No species identified yet'}
                </span>
                {mode === 'create' && (
                  <button onClick={() => setSearching(true)} className="hover:opacity-80" style={{ color: accent }}>
                    Change species
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Scientific name">
                  <TextInput value={draft.scientificname} onChange={(v) => setDraft({ ...draft, scientificname: v })} />
                </Field>
                <Field label="Common name">
                  <TextInput value={draft.commonName} onChange={(v) => setDraft({ ...draft, commonName: v })} />
                </Field>
              </div>

              <Field label="Bioluminescence type" accent={accent}>
                <BioluminescenceTypeChips
                  value={draft.bioluminescenceType}
                  onChange={(v) => setDraft({ ...draft, bioluminescenceType: v })}
                  accent={accent}
                />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Depth min (m)">
                  <NumberInput value={draft.depthMin} onChange={(v) => setDraft({ ...draft, depthMin: v })} />
                </Field>
                <Field label="Depth max (m)">
                  <NumberInput value={draft.depthMax} onChange={(v) => setDraft({ ...draft, depthMax: v })} />
                </Field>
                <Field label="Zone">
                  <SelectInput
                    value={draft.depthZone}
                    onChange={(v) => setDraft({ ...draft, depthZone: v })}
                    options={['sunlight', 'twilight', 'midnight', 'abyssal', 'hadal'] as const}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Light color">
                  <ColorPicker value={draft.lightColor} onChange={(v) => setDraft({ ...draft, lightColor: v })} />
                </Field>
                <Field label="Light pattern">
                  <SelectInput
                    value={draft.lightPattern}
                    onChange={(v) => setDraft({ ...draft, lightPattern: v })}
                    options={['steady', 'pulsing', 'flashing', 'wave'] as const}
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Habitat">
                  <TextArea value={draft.habitat} onChange={(v) => setDraft({ ...draft, habitat: v })} />
                </Field>
                <Field label="Diet">
                  <TextArea value={draft.diet} onChange={(v) => setDraft({ ...draft, diet: v })} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <Field label="Size">
                  <NumberInput value={draft.sizeLength} onChange={(v) => setDraft({ ...draft, sizeLength: v })} />
                </Field>
                <Field label="Unit">
                  <SelectInput
                    value={draft.sizeUnit}
                    onChange={(v) => setDraft({ ...draft, sizeUnit: v })}
                    options={['mm', 'cm', 'm'] as const}
                  />
                </Field>
              </div>

              <Field label="Fun facts" accent={accent}>
                <FunFactsEditor value={draft.funFacts} onChange={(v) => setDraft({ ...draft, funFacts: v })} accent={accent} />
              </Field>

              <button
                onClick={onSave}
                className="px-6 py-2.5 rounded font-medium text-[#0B1426] transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                {mode === 'create' ? 'Add species' : 'Save changes'}
              </button>
            </div>
          )}
        </div>

        <MiniSpecimenCard draft={draft} />
      </div>
    </div>
  );
}

export default VariantB;
