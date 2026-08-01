// PROTOTYPE — wipe me. Shared input primitives for ticket 11 — atoms only,
// not layout, so each variant stays free to structure the form differently.
import { BioluminescenceType } from '~/types';
import { BIOLUMINESCENCE_OPTIONS, LIGHT_COLOR_SWATCHES } from './types';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-current transition-colors';

export function Field({
  label,
  children,
  accent,
}: {
  label: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <label className="block">
      <span
        className="block text-xs uppercase tracking-widest font-data mb-1.5"
        style={{ color: accent ? `${accent}cc` : 'rgba(255,255,255,0.4)' }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  accent,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  accent?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
      style={{ ...(accent ? ({ '--tw-ring-color': accent } as React.CSSProperties) : {}), borderColor: undefined }}
      onFocus={(e) => accent && (e.currentTarget.style.borderColor = accent)}
      onBlur={(e) => (e.currentTarget.style.borderColor = '')}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: number | '';
  onChange: (v: number | '') => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      placeholder={placeholder}
      className={`${inputClass} font-data`}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={`${inputClass} resize-none`}
    />
  );
}

export function SelectInput<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={`${inputClass} capitalize`}
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-[#0B1426] capitalize">
          {o.replace(/_/g, ' ')}
        </option>
      ))}
    </select>
  );
}

export function BioluminescenceTypeChips({
  value,
  onChange,
  accent,
}: {
  value: BioluminescenceType[];
  onChange: (v: BioluminescenceType[]) => void;
  accent: string;
}) {
  const toggle = (t: BioluminescenceType) => {
    onChange(value.includes(t) ? value.filter((v) => v !== t) : [...value, t]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {BIOLUMINESCENCE_OPTIONS.map((t) => {
        const active = value.includes(t);
        return (
          <button
            type="button"
            key={t}
            onClick={() => toggle(t)}
            className="text-xs font-data uppercase tracking-wide px-2.5 py-1.5 rounded-sm border transition-colors"
            style={
              active
                ? { borderColor: accent, color: accent, backgroundColor: `${accent}1a` }
                : { borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }
            }
          >
            {t.replace(/_/g, ' ')}
          </button>
        );
      })}
    </div>
  );
}

export function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {LIGHT_COLOR_SWATCHES.map((c) => (
        <button
          type="button"
          key={c}
          onClick={() => onChange(c)}
          className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
          style={{ backgroundColor: c, borderColor: value === c ? 'white' : 'transparent' }}
          aria-label={c}
        />
      ))}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} font-data w-28 py-1.5`}
      />
    </div>
  );
}

export function FunFactsEditor({
  value,
  onChange,
  accent,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  accent: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((fact, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="font-data text-xs text-white/30 w-5">{String(i + 1).padStart(2, '0')}</span>
          <input
            type="text"
            value={fact}
            onChange={(e) => onChange(value.map((f, idx) => (idx === i ? e.target.value : f)))}
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="text-white/30 hover:text-white/70 px-2"
            aria-label="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ''])}
        className="text-xs font-data uppercase tracking-wide hover:opacity-80"
        style={{ color: accent }}
      >
        + Add fact
      </button>
    </div>
  );
}
