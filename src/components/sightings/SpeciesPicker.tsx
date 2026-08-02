// Searches the local catalog (mockSpecies), not WoRMS. A Sighting always
// references an existing cataloged Species; it doesn't create one.
import { useState } from 'react';
import { Search } from 'lucide-react';
import { mockSpecies } from '~/data';
import { BioluminescentSpecies } from '~/types';

interface SpeciesPickerProps {
  onSelect: (species: BioluminescentSpecies) => void;
  accent?: string;
}

function SpeciesPicker({ onSelect, accent = '#00E5FF' }: SpeciesPickerProps) {
  const [term, setTerm] = useState('');
  const matches =
    term.length > 1
      ? mockSpecies.filter(
          (s) => s.commonName.toLowerCase().includes(term.toLowerCase()) || s.scientificname.toLowerCase().includes(term.toLowerCase()),
        )
      : [];

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Which species did you see?"
          className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-3 py-2.5 text-white placeholder:text-white/30 focus:outline-none"
          style={{ borderColor: term.length > 1 ? `${accent}55` : undefined }}
        />
      </div>
      {term.length > 1 && (
        <div className="mt-2 border border-white/10 rounded divide-y divide-white/10 max-h-64 overflow-y-auto">
          {matches.length === 0 && <p className="p-3 text-sm text-white/40">Not in the catalog yet — add it first, then come back to log the sighting.</p>}
          {matches.map((species) => (
            <button type="button" key={species.id} onClick={() => onSelect(species)} className="w-full flex items-center gap-3 text-left p-3 hover:bg-white/5 transition-colors">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: species.lightColor }} />
              <div>
                <p className="text-white">{species.commonName}</p>
                <p className="text-xs text-white/40 font-data italic">{species.scientificname}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpeciesPicker;
