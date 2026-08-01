// PROTOTYPE — wipe me. Variant A for ticket 11: "Identify → Describe" wizard.
// Two real steps — you can't meaningfully describe bioluminescence before
// you've identified the species — so numbered steps encode a real sequence,
// not decoration. Edit mode skips straight to step 2.
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

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-data border"
        style={{
          borderColor: active || done ? '#00E5FF' : 'rgba(255,255,255,0.2)',
          color: active || done ? '#00E5FF' : 'rgba(255,255,255,0.4)',
          backgroundColor: active ? '#00E5FF1a' : 'transparent',
        }}
      >
        {n}
      </span>
      <span className={`text-sm font-data uppercase tracking-wide ${active ? 'text-white' : 'text-white/40'}`}>
        {label}
      </span>
    </div>
  );
}

function VariantA({ draft, setDraft, mode, onSave }: VariantProps) {
  const [step, setStep] = useState<1 | 2>(mode === 'edit' ? 2 : 1);
  const accent = draft.lightColor || '#00E5FF';

  const handleSelect = (record: AphiaRecord) => {
    setDraft({
      ...draft,
      aphiaId: record.AphiaID,
      scientificname: record.scientificname,
      authority: record.authority,
      rank: record.rank,
    });
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#0B1426] pt-28 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        {mode === 'create' && (
          <div className="flex items-center gap-6 mb-10">
            <StepDot n={1} label="Identify" active={step === 1} done={step > 1} />
            <div className="flex-1 h-px bg-white/10" />
            <StepDot n={2} label="Describe" active={step === 2} done={false} />
          </div>
        )}

        <h1 className="font-display text-3xl text-white mb-8">
          {mode === 'create' ? (step === 1 ? 'Identify the species' : 'Describe what you observed') : `Edit ${draft.scientificname || 'species'}`}
        </h1>

        {step === 1 && mode === 'create' ? (
          <WormsSearchField onSelect={handleSelect} onSkip={() => setStep(2)} accent={accent} />
        ) : (
          <div className="space-y-8">
            <div className="border border-white/10 rounded p-4 space-y-3 bg-white/[0.02]">
              <p className="text-xs font-data uppercase tracking-widest text-white/30 mb-1">
                Taxonomy {draft.aphiaId ? `— imported from WoRMS (AphiaID ${draft.aphiaId})` : '— entered manually'}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Scientific name">
                  <TextInput value={draft.scientificname} onChange={(v) => setDraft({ ...draft, scientificname: v })} />
                </Field>
                <Field label="Authority">
                  <TextInput value={draft.authority} onChange={(v) => setDraft({ ...draft, authority: v })} />
                </Field>
                <Field label="Common name">
                  <TextInput value={draft.commonName} onChange={(v) => setDraft({ ...draft, commonName: v })} />
                </Field>
                <Field label="Rank">
                  <TextInput value={draft.rank} onChange={(v) => setDraft({ ...draft, rank: v })} />
                </Field>
              </div>
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
              <FunFactsEditor
                value={draft.funFacts}
                onChange={(v) => setDraft({ ...draft, funFacts: v })}
                accent={accent}
              />
            </Field>

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              {mode === 'create' && (
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  ← Back
                </button>
              )}
              <button
                onClick={onSave}
                className="ml-auto px-6 py-2.5 rounded font-medium text-[#0B1426] transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent }}
              >
                {mode === 'create' ? 'Add species' : 'Save changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VariantA;
