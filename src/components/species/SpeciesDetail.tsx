import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { BioluminescentSpecies, Sighting } from '~/types';

interface SpeciesDetailProps {
  species: BioluminescentSpecies;
  sightings: Sighting[];
  onBack: () => void;
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/10 py-2 gap-4">
      <span className="text-xs uppercase tracking-widest text-white/40 font-data">{label}</span>
      <span className="text-sm text-white font-data text-right">{value}</span>
    </div>
  );
}

function SpeciesDetail({ species, sightings, onBack }: SpeciesDetailProps) {
  const [showFullFacts, setShowFullFacts] = useState(false);
  const glow = species.lightColor || '#00E5FF';
  const visibleFacts = species.funFacts.slice(0, showFullFacts ? undefined : 4);

  return (
    <div className="min-h-screen bg-[#0B1426] pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Link
            to="/species/$speciesId/edit"
            params={{ speciesId: species.id }}
            className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
            style={{ color: glow }}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
        </div>

        <div className="grid md:grid-cols-[360px_1fr] gap-10">
          {/* Left column: specimen frame + data sheet */}
          <div>
            <div
              className="relative aspect-square border rounded-none"
              style={{ borderColor: `${glow}55` }}
            >
              {(['-top-px -left-px', '-top-px -right-px', '-bottom-px -left-px', '-bottom-px -right-px'] as const).map(
                (pos, i) => (
                  <span
                    key={i}
                    className={`absolute ${pos} w-5 h-5 border-white/70`}
                    style={{
                      borderTopWidth: pos.includes('top') ? 2 : 0,
                      borderBottomWidth: pos.includes('bottom') ? 2 : 0,
                      borderLeftWidth: pos.includes('left') ? 2 : 0,
                      borderRightWidth: pos.includes('right') ? 2 : 0,
                    }}
                  />
                ),
              )}
              {species.imageUrl ? (
                <img
                  src={species.imageUrl}
                  alt={species.commonName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] to-[#1a2332]">
                  <div
                    className="w-16 h-16 rounded-full animate-bio-pulse"
                    style={{ backgroundColor: glow, boxShadow: `0 0 40px ${glow}` }}
                  />
                </div>
              )}
              <div className="absolute bottom-2 right-2 text-[10px] font-data text-white/50 tracking-wider">
                SPEC. {species.AphiaID}
              </div>
            </div>

            <div className="mt-6">
              <DataRow label="AphiaID" value={String(species.AphiaID)} />
              <DataRow label="Rank" value={species.rank} />
              <DataRow label="Authority" value={species.authority} />
              <DataRow
                label="Depth range"
                value={`${species.depthRange.min}–${species.depthRange.max} ${species.depthRange.unit}`}
              />
              <DataRow label="Zone" value={species.depthRange.zone} />
              <DataRow label="Size" value={`${species.size.length} ${species.size.unit}`} />
              <DataRow label="Light pattern" value={species.lightPattern} />
            </div>
          </div>

          {/* Right column: identity, biology, sightings */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-data mb-2">
              Field Record
            </p>
            <h1 className="font-display text-5xl text-white leading-[1.05]">
              {species.commonName}
            </h1>
            <p className="mt-2 text-lg italic text-white/50 font-display">{species.scientificname}</p>

            <div className="flex items-center gap-2 mt-6">
              {species.bioluminescenceType.map((t) => (
                <span
                  key={t}
                  className="text-xs font-data uppercase tracking-wide px-2 py-1 rounded-sm border"
                  style={{ borderColor: `${glow}66`, color: glow }}
                >
                  {t.replace(/_/g, ' ')}
                </span>
              ))}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xs uppercase tracking-widest text-white/40 font-data mb-2">
                  Habitat
                </h2>
                <p className="text-white/75 leading-relaxed">{species.habitat}</p>
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-widest text-white/40 font-data mb-2">
                  Diet
                </h2>
                <p className="text-white/75 leading-relaxed">{species.diet}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xs uppercase tracking-widest text-white/40 font-data mb-3">
                Notes
              </h2>
              <ul className="space-y-2">
                {visibleFacts.map((fact, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/70">
                    <span className="font-data text-white/30">{String(i + 1).padStart(2, '0')}</span>
                    {fact}
                  </li>
                ))}
              </ul>
              {species.funFacts.length > 4 && (
                <button
                  onClick={() => setShowFullFacts(!showFullFacts)}
                  className="mt-3 flex items-center text-sm hover:opacity-80 transition-opacity"
                  style={{ color: glow }}
                >
                  {showFullFacts ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" /> Show more
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Sightings logbook */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs uppercase tracking-widest text-white/40 font-data">
                  Sighting log — {sightings.length} {sightings.length === 1 ? 'entry' : 'entries'}
                </h2>
              </div>
              {sightings.length === 0 ? (
                <p className="text-sm text-white/40">No sightings logged yet for this species.</p>
              ) : (
                <div className="space-y-0">
                  {sightings.map((s) => (
                    <div
                      key={s.id}
                      className="grid grid-cols-[90px_70px_1fr_110px] gap-4 py-3 border-b border-white/5 text-sm font-data"
                    >
                      <span className="text-white/50">{s.sightedAt}</span>
                      <span style={{ color: glow }}>{s.depthM}m</span>
                      <span className="text-white/80 truncate">{s.location}</span>
                      <span className="text-white/40 text-right truncate">{s.submittedBy}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeciesDetail;
