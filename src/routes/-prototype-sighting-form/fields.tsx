// PROTOTYPE — wipe me. Shared input primitives for ticket 13.
import { useState } from 'react';
import { LocateFixed, Loader2, Camera } from 'lucide-react';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-current transition-colors';

export function Field({ label, children, accent }: { label: string; children: React.ReactNode; accent?: string }) {
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

export function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputClass} />
  );
}

export function NumberInput({ value, onChange, placeholder }: { value: number | ''; onChange: (v: number | '') => void; placeholder?: string }) {
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

export function TextArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${inputClass} resize-none`} />;
}

// A real geolocation request (navigator.geolocation) — not mocked. Falls
// back gracefully to manual entry if denied or unavailable.
export function UseMyLocationButton({
  onLocate,
  accent,
}: {
  onLocate: (lat: number, lng: number) => void;
  accent: string;
}) {
  const [state, setState] = useState<'idle' | 'locating' | 'denied' | 'unsupported'>('idle');

  const handleClick = () => {
    if (!('geolocation' in navigator)) {
      setState('unsupported');
      return;
    }
    setState('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocate(pos.coords.latitude, pos.coords.longitude);
        setState('idle');
      },
      () => setState('denied'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'locating'}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded border font-medium transition-colors"
        style={{ borderColor: `${accent}66`, color: accent }}
      >
        {state === 'locating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
        {state === 'locating' ? 'Locating…' : 'Use my current location'}
      </button>
      {state === 'denied' && (
        <p className="text-xs text-white/40 mt-2">Location access denied — enter coordinates manually below.</p>
      )}
      {state === 'unsupported' && (
        <p className="text-xs text-white/40 mt-2">Geolocation isn't available here — enter coordinates manually.</p>
      )}
    </div>
  );
}

export function PhotoAttach({ count, onChange, accent }: { count: number; onChange: (n: number) => void; accent: string }) {
  return (
    <label
      className="flex items-center justify-center gap-2 border border-dashed rounded p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
      style={{ borderColor: 'rgba(255,255,255,0.15)' }}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => onChange(Math.min(6, count + (e.target.files?.length ?? 0)))}
      />
      <Camera className="w-5 h-5 text-white/40" />
      <span className="text-sm text-white/50">
        {count === 0 ? 'Attach photos (up to 6)' : `${count} photo${count === 1 ? '' : 's'} attached`}
      </span>
      {count > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onChange(0);
          }}
          className="text-xs ml-2 hover:opacity-80"
          style={{ color: accent }}
        >
          clear
        </button>
      )}
    </label>
  );
}
