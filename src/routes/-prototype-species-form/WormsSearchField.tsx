// PROTOTYPE — wipe me. Real WoRMS search (not mocked) — read-only external
// API, no reason to fake it. Shared across all three variants.
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useWormsSpecies } from '~/hooks';
import { AphiaRecord } from '~/types';

interface WormsSearchFieldProps {
  onSelect: (record: AphiaRecord) => void;
  onSkip: () => void;
  accent?: string;
}

function WormsSearchField({ onSelect, onSkip, accent = '#00E5FF' }: WormsSearchFieldProps) {
  const [term, setTerm] = useState('');
  const { searchSpeciesQuery } = useWormsSpecies();
  const { data, isLoading, isError } = searchSpeciesQuery(term);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search WoRMS by scientific or common name…"
          className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-3 py-2.5 text-white placeholder:text-white/30 focus:outline-none"
          style={{ borderColor: term.length > 2 ? `${accent}55` : undefined }}
          autoFocus
        />
        {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 animate-spin" />}
      </div>

      {term.length > 2 && (
        <div className="mt-2 border border-white/10 rounded divide-y divide-white/10 max-h-64 overflow-y-auto">
          {isError && (
            <p className="p-3 text-sm text-white/40">WoRMS search failed — check your connection, or skip below.</p>
          )}
          {!isError && !isLoading && (!data || data.length === 0) && (
            <p className="p-3 text-sm text-white/40">No matches in WoRMS.</p>
          )}
          {data?.slice(0, 8).map((record) => (
            <button
              type="button"
              key={record.AphiaID}
              onClick={() => onSelect(record)}
              className="w-full text-left p-3 hover:bg-white/5 transition-colors"
            >
              <p className="text-white italic font-display">{record.scientificname}</p>
              <p className="text-xs text-white/40 font-data mt-0.5">
                {record.authority} · {record.rank} · AphiaID {record.AphiaID}
              </p>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onSkip}
        className="mt-3 text-xs font-data uppercase tracking-wide text-white/40 hover:text-white/70 transition-colors"
      >
        Can't find it? Enter manually →
      </button>
    </div>
  );
}

export default WormsSearchField;
