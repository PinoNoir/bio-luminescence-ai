// PROTOTYPE — wipe me. Variant C for ticket 10: "Split Lab Panel".
// A persistent split screen: sticky photo + a live light-pattern visualizer
// that actually animates according to the species' real lightPattern data
// (steady/pulsing/flashing/wave), paired with tabbed content on the right.
// The utility/tool-led direction, vs. A's document and B's atmosphere.
import { useState } from 'react';
import { BioluminescentSpecies } from '~/types';
import { MockSighting } from './mockSightings';

interface VariantProps {
  species: BioluminescentSpecies;
  sightings: MockSighting[];
}

const TABS = ['Overview', 'Taxonomy & Biology', 'Sightings'] as const;
type Tab = (typeof TABS)[number];

function LightPatternVisualizer({
  color,
  pattern,
}: {
  color: string;
  pattern: BioluminescentSpecies['lightPattern'];
}) {
  return (
    <div className="relative w-24 h-24 rounded-full flex items-center justify-center">
      <style>{`
        @keyframes proto-flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.12; } }
        .proto-flash { animation: proto-flash 0.9s steps(2, jump-none) infinite; }
        @keyframes proto-wave { 0% { transform: translateX(-120%) rotate(20deg); } 100% { transform: translateX(120%) rotate(20deg); } }
        .proto-wave-sweep { animation: proto-wave 1.6s ease-in-out infinite; }
      `}</style>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: color,
          opacity: pattern === 'steady' ? 0.9 : 0.7,
          boxShadow: `0 0 30px ${color}`,
          ...(pattern === 'pulsing' ? {} : {}),
        }}
      />
      {pattern === 'pulsing' && (
        <div
          className="absolute inset-0 rounded-full animate-bio-pulse"
          style={{ backgroundColor: color }}
        />
      )}
      {pattern === 'flashing' && (
        <div className="absolute inset-0 rounded-full proto-flash" style={{ backgroundColor: color }} />
      )}
      {pattern === 'wave' && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 w-1/3 proto-wave-sweep"
            style={{ background: `linear-gradient(90deg, transparent, white, transparent)`, opacity: 0.5 }}
          />
        </div>
      )}
    </div>
  );
}

function VariantC({ species, sightings }: VariantProps) {
  const [tab, setTab] = useState<Tab>('Overview');
  const glow = species.lightColor || '#00E5FF';

  return (
    <div className="min-h-screen bg-[#0d1420] flex flex-col md:flex-row pt-20">
      {/* Sticky left panel */}
      <div className="md:w-[420px] md:sticky md:top-20 md:h-[calc(100vh-80px)] border-r border-white/10 flex flex-col">
        <div className="relative flex-1 min-h-[280px] bg-gradient-to-br from-[#0d1b2a] to-[#1a2332]">
          {species.imageUrl ? (
            <img src={species.imageUrl} alt={species.commonName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <LightPatternVisualizer color={glow} pattern={species.lightPattern} />
            </div>
          )}
        </div>
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="scale-[0.35] -m-8">
              <LightPatternVisualizer color={glow} pattern={species.lightPattern} />
            </div>
            <div>
              <p className="text-xs font-data uppercase tracking-widest text-white/40">
                {species.lightPattern} pattern
              </p>
              <p className="text-xs font-data text-white/30">live-encoded, not decorative</p>
            </div>
          </div>
          <h1 className="font-display text-3xl text-white leading-tight">{species.commonName}</h1>
          <p className="font-display italic text-white/50">{species.scientificname}</p>
        </div>
      </div>

      {/* Scrollable right content */}
      <div className="flex-1 px-6 md:px-10 py-8">
        <div className="max-w-2xl">
          <div className="flex gap-1 mb-8 border-b border-white/10">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? 'text-white border-current'
                    : 'text-white/40 border-transparent hover:text-white/70'
                }`}
                style={tab === t ? { color: glow, borderColor: glow } : undefined}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs font-data text-white/40 uppercase mb-1">Depth</p>
                  <p className="text-white font-data">
                    {species.depthRange.min}–{species.depthRange.max}m
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs font-data text-white/40 uppercase mb-1">Zone</p>
                  <p className="text-white font-data capitalize">{species.depthRange.zone}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-xs font-data text-white/40 uppercase mb-1">Size</p>
                  <p className="text-white font-data">
                    {species.size.length}{species.size.unit}
                  </p>
                </div>
              </div>
              <p className="text-white/75 leading-relaxed">{species.habitat}</p>
              <ul className="space-y-2">
                {species.funFacts.slice(0, 3).map((f, i) => (
                  <li key={i} className="text-sm text-white/70 flex gap-2">
                    <span style={{ color: glow }}>•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'Taxonomy & Biology' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-data text-sm">
                <span className="text-white/40">AphiaID</span>
                <span className="text-white">{species.AphiaID}</span>
                <span className="text-white/40">Rank</span>
                <span className="text-white">{species.rank}</span>
                <span className="text-white/40">Authority</span>
                <span className="text-white">{species.authority}</span>
                <span className="text-white/40">Status</span>
                <span className="text-white capitalize">{species.status}</span>
              </div>
              <div>
                <p className="text-xs font-data text-white/40 uppercase mb-2">Bioluminescence type</p>
                <div className="flex flex-wrap gap-2">
                  {species.bioluminescenceType.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-data uppercase px-2 py-1 rounded border"
                      style={{ borderColor: `${glow}66`, color: glow }}
                    >
                      {t.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-white/75 leading-relaxed">{species.diet}</p>
            </div>
          )}

          {tab === 'Sightings' && (
            <div className="space-y-4">
              {sightings.map((s) => (
                <div key={s.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">{s.location}</span>
                    <span className="text-xs font-data text-white/40">{s.sightedAt}</span>
                  </div>
                  <p className="text-sm text-white/70 mb-2">{s.notes}</p>
                  <p className="text-xs font-data text-white/40">
                    {s.depthM}m · {s.submittedBy} · {s.photoCount} photos
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VariantC;
