import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { SpeciesCard } from '~/components';
import { BioluminescentSpecies } from '~/types';
import { mockSpecies, mockSightings } from '~/data';

export const Route = createFileRoute('/home')({
  component: Home,
})

// A handful of specimens, not the whole catalog — this is a preview, not Explore.
const FEATURED_SPECIES = mockSpecies.slice(0, 3);
const HERO_SPECIES = mockSpecies.find((s) => s.scientificname === 'Atolla wyvillei') ?? mockSpecies[0];

function Home() {
  const navigate = useNavigate();
  const heroGlow = HERO_SPECIES.lightColor || '#00E5FF';

  const handleSpeciesClick = (species: BioluminescentSpecies) => {
    navigate({ to: '/species/$speciesId', params: { speciesId: species.id } });
  };

  const distinctTypes = new Set(mockSpecies.flatMap((s) => s.bioluminescenceType)).size;
  const maxDepth = Math.max(...mockSpecies.map((s) => s.depthRange.max));

  const stats = [
    { label: 'Species logged', value: String(mockSpecies.length) },
    { label: 'Sightings recorded', value: String(mockSightings.length) },
    { label: 'Light mechanisms', value: String(distinctTypes) },
    { label: 'Deepest record', value: `${maxDepth.toLocaleString()}m` },
  ];

  return (
    <div className="min-h-screen bg-[#0B1426]">
      {/* Hero */}
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-14 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-data mb-4">
              Field catalog · est. this year
            </p>
            <h1 className="font-display text-5xl md:text-6xl text-white leading-[1.05]">
              A living record of what glows in the dark
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              Marine Institute is a working catalog of bioluminescent and deepwater species,
              built for marine biologists to document what they find — taxonomy, light
              behavior, depth, and every field sighting logged against it.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link
                to="/explore"
                className="px-6 py-3 rounded font-medium text-[#0B1426] transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#00E5FF' }}
              >
                Browse the catalog
              </Link>
              <Link
                to="/species/new"
                className="px-6 py-3 rounded font-medium text-white/80 border border-white/15 hover:border-white/30 hover:text-white transition-colors"
              >
                Add a species
              </Link>
            </div>
          </div>

          {/* Featured specimen — the one continuously-animating element on the page */}
          <Link
            to="/species/$speciesId"
            params={{ speciesId: HERO_SPECIES.id }}
            className="block group"
          >
            <div
              className="relative aspect-square border"
              style={{ borderColor: `${heroGlow}55` }}
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] to-[#1a2332] transition-transform duration-500 group-hover:scale-[1.02]">
                <div
                  className="w-20 h-20 rounded-full animate-bio-pulse"
                  style={{ backgroundColor: heroGlow, boxShadow: `0 0 50px ${heroGlow}` }}
                />
              </div>
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-white/30 font-data">
              Featured specimen
            </p>
            <p className="font-display text-2xl text-white mt-1">{HERO_SPECIES.commonName}</p>
            <p className="italic text-white/40 font-display text-sm">{HERO_SPECIES.scientificname}</p>
          </Link>
        </div>
      </div>

      {/* Stats — real numbers from the catalog, not marketing copy */}
      <div className="py-12 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-data text-3xl text-white tabular-nums">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-white/40 font-data mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured species — a small preview, not the whole catalog */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl text-white">From the catalog</h2>
              <p className="text-white/50 mt-2 max-w-xl">
                A few recent entries. The full catalog covers every depth from the sunlit surface
                to the abyss.
              </p>
            </div>
            <Link to="/explore" className="text-sm text-bio-blue hover:text-bio-cyan transition-colors whitespace-nowrap">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_SPECIES.map((species) => (
              <SpeciesCard key={species.id} species={species} onClick={handleSpeciesClick} showGlow={false} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA — points at real, working features */}
      <div className="py-20 px-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl text-white mb-4">Found something that glows?</h2>
          <p className="text-white/60 mb-8">
            Sign in to log a field sighting, add a new species to the catalog, or fix up an
            existing entry — every record here is community-maintained by the scientists who
            use it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-block px-8 py-3 rounded font-medium text-[#0B1426] transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#00E5FF' }}
            >
              Create an account
            </Link>
            <Link
              to="/sightings/new"
              className="inline-block px-8 py-3 rounded font-medium text-white/80 border border-white/15 hover:border-white/30 hover:text-white transition-colors"
            >
              Log a sighting
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
