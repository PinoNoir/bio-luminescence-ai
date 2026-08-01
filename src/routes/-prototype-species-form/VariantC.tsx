// PROTOTYPE — wipe me. Variant C for ticket 11: "Field Log Checklist".
// Grouped, collapsible sections with a monospace completion counter per
// section — a structured intake sheet, matching how a scientist actually
// fills out field data: not necessarily linearly, but by category.
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

type SectionKey = 'identity' | 'biolum' | 'depth' | 'habitat';

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
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <span className="text-sm font-medium text-white">{title}</span>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-data tabular-nums"
            style={{ color: complete ? accent : 'rgba(255,255,255,0.4)' }}
          >
            {done}/{total}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-white/40 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {expanded && <div className="p-4 space-y-4 border-t border-white/10">{children}</div>}
    </div>
  );
}

function VariantC({ draft, setDraft, mode, onSave }: VariantProps) {
  const accent = draft.lightColor || '#00E5FF';
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({
    identity: mode === 'create',
    biolum: mode === 'edit',
    depth: false,
    habitat: false,
  });
  const toggle = (k: SectionKey) => setExpanded((e) => ({ ...e, [k]: !e[k] }));

  const identityDone = [draft.scientificname, draft.commonName].filter(Boolean).length;
  const biolumDone = [draft.bioluminescenceType.length > 0, !!draft.lightPattern].filter(Boolean).length;
  const depthDone = [draft.depthMin !== '', draft.depthMax !== '', draft.sizeLength !== ''].filter(Boolean).length;
  const habitatDone = [draft.habitat, draft.diet].filter(Boolean).length;
  const totalDone = identityDone + biolumDone + depthDone + habitatDone;

  const handleSelect = (record: AphiaRecord) => {
    setDraft({
      ...draft,
      aphiaId: record.AphiaID,
      scientificname: record.scientificname,
      authority: record.authority,
      rank: record.rank,
    });
    setExpanded((e) => ({ ...e, identity: false, biolum: true }));
  };

  return (
    <div className="min-h-screen bg-[#0B1426] pt-28 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-3xl text-white">
            {mode === 'create' ? 'Field log entry' : `Edit ${draft.scientificname || 'species'}`}
          </h1>
          <span className="text-xs font-data text-white/40 tabular-nums">{totalDone}/9 fields</span>
        </div>

        <div className="space-y-3">
          <Section
            title="Identity"
            done={identityDone}
            total={2}
            expanded={expanded.identity}
            onToggle={() => toggle('identity')}
            accent={accent}
          >
            {mode === 'create' && !draft.scientificname ? (
              <WormsSearchField onSelect={handleSelect} onSkip={() => {}} accent={accent} />
            ) : null}
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Scientific name">
                <TextInput value={draft.scientificname} onChange={(v) => setDraft({ ...draft, scientificname: v })} />
              </Field>
              <Field label="Common name">
                <TextInput value={draft.commonName} onChange={(v) => setDraft({ ...draft, commonName: v })} />
              </Field>
              <Field label="Authority">
                <TextInput value={draft.authority} onChange={(v) => setDraft({ ...draft, authority: v })} />
              </Field>
              <Field label="Rank">
                <TextInput value={draft.rank} onChange={(v) => setDraft({ ...draft, rank: v })} />
              </Field>
            </div>
          </Section>

          <Section
            title="Bioluminescence"
            done={biolumDone}
            total={2}
            expanded={expanded.biolum}
            onToggle={() => toggle('biolum')}
            accent={accent}
          >
            <Field label="Type" accent={accent}>
              <BioluminescenceTypeChips
                value={draft.bioluminescenceType}
                onChange={(v) => setDraft({ ...draft, bioluminescenceType: v })}
                accent={accent}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Color">
                <ColorPicker value={draft.lightColor} onChange={(v) => setDraft({ ...draft, lightColor: v })} />
              </Field>
              <Field label="Pattern">
                <SelectInput
                  value={draft.lightPattern}
                  onChange={(v) => setDraft({ ...draft, lightPattern: v })}
                  options={['steady', 'pulsing', 'flashing', 'wave'] as const}
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Depth & size"
            done={depthDone}
            total={3}
            expanded={expanded.depth}
            onToggle={() => toggle('depth')}
            accent={accent}
          >
            <div className="grid grid-cols-3 gap-3">
              <Field label="Min (m)">
                <NumberInput value={draft.depthMin} onChange={(v) => setDraft({ ...draft, depthMin: v })} />
              </Field>
              <Field label="Max (m)">
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
          </Section>

          <Section
            title="Habitat & notes"
            done={habitatDone}
            total={2}
            expanded={expanded.habitat}
            onToggle={() => toggle('habitat')}
            accent={accent}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Habitat">
                <TextArea value={draft.habitat} onChange={(v) => setDraft({ ...draft, habitat: v })} />
              </Field>
              <Field label="Diet">
                <TextArea value={draft.diet} onChange={(v) => setDraft({ ...draft, diet: v })} />
              </Field>
            </div>
            <Field label="Fun facts" accent={accent}>
              <FunFactsEditor value={draft.funFacts} onChange={(v) => setDraft({ ...draft, funFacts: v })} accent={accent} />
            </Field>
          </Section>
        </div>

        <button
          onClick={onSave}
          className="mt-8 px-6 py-2.5 rounded font-medium text-[#0B1426] transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          {mode === 'create' ? 'Add species' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

export default VariantC;
