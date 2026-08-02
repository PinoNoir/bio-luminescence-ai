import { useState } from 'react';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { Search, Plus } from 'lucide-react';
import { mockSpecies } from '~/data';
import { BioluminescentSpecies } from '~/types';

export const Route = createFileRoute('/explore')({
  component: ExploreComponent,
});

interface FilterState {
  searchTerm: string;
  depthZone: string;
  bioluminescenceType: string;
}

const DEPTH_ZONES = [
  { value: 'all', label: 'All depths' },
  { value: 'sunlight', label: 'Sunlight (0–200m)' },
  { value: 'twilight', label: 'Twilight (200–1000m)' },
  { value: 'midnight', label: 'Midnight (1000m+)' },
];

const BIOLUM_TYPES = [
  { value: 'all', label: 'All types' },
  { value: 'PHOTOPHORE', label: 'Photophore' },
  { value: 'DEFENSIVE_FLASH', label: 'Defensive flash' },
  { value: 'LUCIFERIN_LUCIFERASE', label: 'Luciferin-luciferase' },
];

const ZONES = [
  { key: 'sunlight', label: 'Sunlight zone', range: '0–200m', bg: '#0d1b2a' },
  { key: 'twilight', label: 'Twilight zone', range: '200–1000m', bg: '#0a1420' },
  { key: 'midnight', label: 'Midnight zone', range: '1000m+', bg: '#060d16' },
] as const;

const selectClass = 'bg-white/5 border border-white/10 rounded px-3 py-2.5 text-white text-sm focus:outline-none appearance-none';

function ExploreComponent() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({ searchTerm: '', depthZone: 'all', bioluminescenceType: 'all' });

  const results = mockSpecies.filter((s) => {
    const matchesSearch =
      s.commonName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      s.scientificname.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesDepth = filters.depthZone === 'all' || s.depthRange.zone === filters.depthZone;
    const matchesType = filters.bioluminescenceType === 'all' || s.bioluminescenceType.some((t) => t === filters.bioluminescenceType);
    return matchesSearch && matchesDepth && matchesType;
  });

  const handleSelect = (species: BioluminescentSpecies) => {
    navigate({ to: '/species/$speciesId', params: { speciesId: species.id } });
  };

  return (
    <div className="min-h-screen bg-[#0B1426] pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-data">Catalog</p>
          <Link to="/species/new" className="inline-flex items-center gap-1.5 text-xs text-bio-blue hover:text-bio-cyan transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add a species
          </Link>
        </div>
        <h1 className="font-display text-4xl text-white mb-8">Browse by depth</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              placeholder="Search by name…"
              className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-3 py-2.5 text-white placeholder:text-white/30 focus:outline-none"
              style={{ borderColor: filters.searchTerm ? '#00E5FF55' : undefined }}
            />
          </div>
          <select value={filters.depthZone} onChange={(e) => setFilters({ ...filters, depthZone: e.target.value })} className={selectClass}>
            {DEPTH_ZONES.map((z) => (
              <option key={z.value} value={z.value} className="bg-[#0B1426]">
                {z.label}
              </option>
            ))}
          </select>
          <select
            value={filters.bioluminescenceType}
            onChange={(e) => setFilters({ ...filters, bioluminescenceType: e.target.value })}
            className={selectClass}
          >
            {BIOLUM_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#0B1426]">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs font-data text-white/30 mt-6 mb-8">
          {results.length} of {mockSpecies.length} species
        </p>

        <div className="space-y-1 -mx-4">
          {ZONES.map((zone) => {
            const zoneSpecies = results.filter((s) => s.depthRange.zone === zone.key);
            if (zoneSpecies.length === 0) return null;
            return (
              <div key={zone.key} style={{ backgroundColor: zone.bg }} className="rounded-lg py-4 px-4">
                <div className="flex items-baseline justify-between px-4 mb-1">
                  <h2 className="font-display text-xl text-white">{zone.label}</h2>
                  <span className="text-xs font-data text-white/40">{zone.range}</span>
                </div>
                <div className="grid grid-cols-[2fr_1fr_1fr_100px] gap-4 px-4 py-2 text-[10px] uppercase tracking-widest text-white/30 font-data border-b border-white/10">
                  <span>Species</span>
                  <span>Light type</span>
                  <span>Pattern</span>
                  <span className="text-right">Depth</span>
                </div>
                {zoneSpecies.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => handleSelect(s)}
                    className="w-full grid grid-cols-[2fr_1fr_1fr_100px] gap-4 px-4 py-3 items-center text-left border-b border-white/5 last:border-b-0 hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.lightColor }} />
                      <div className="min-w-0">
                        <p className="text-white truncate group-hover:underline">{s.commonName}</p>
                        <p className="italic text-white/40 font-display text-sm truncate">{s.scientificname}</p>
                      </div>
                    </div>
                    <span className="text-sm font-data text-white/60 capitalize truncate">{s.bioluminescenceType[0]?.replace(/_/g, ' ')}</span>
                    <span className="text-sm font-data text-white/60 capitalize">{s.lightPattern}</span>
                    <span className="text-sm font-data text-white/40 text-right">
                      {s.depthRange.min}–{s.depthRange.max}m
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {results.length === 0 && <p className="text-white/40 text-center py-16">No specimens match those filters.</p>}
      </div>
    </div>
  );
}
