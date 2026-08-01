// PROTOTYPE — wipe me. Variant B for ticket 10: "Descent".
// A scroll-driven vertical journey: the background darkens toward true black
// as you scroll down (surface → midnight), and the species' own glow gets
// visibly brighter against it — dramatizing the actual fact that
// bioluminescence is more visible in darkness, not decoration.
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { BioluminescentSpecies } from '~/types';
import { MockSighting } from './mockSightings';

interface VariantProps {
  species: BioluminescentSpecies;
  sightings: MockSighting[];
}

function VariantB({ species, sightings }: VariantProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glow = species.lightColor || '#00E5FF';

  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgLightness = useTransform(scrollYProgress, [0, 1], [12, 0]); // % lightness, surface -> abyssal black
  const background = useTransform(bgLightness, (l) => `hsl(210 45% ${l}%)`);
  const glowScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.6]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);

  return (
    <motion.div ref={containerRef} style={{ background }} className="min-h-[500vh]">
      {/* Fixed glow orb tracking scroll depth */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 260,
          height: 260,
          backgroundColor: glow,
          scale: glowScale,
          opacity: glowOpacity,
          filter: 'blur(60px)',
        }}
      />

      {/* Stop 1: surface / identity */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="font-data text-xs uppercase tracking-[0.4em] text-white/50 mb-6">
          0m · sunlight zone
        </p>
        <h1 className="font-display text-6xl md:text-7xl text-white leading-none">
          {species.commonName}
        </h1>
        <p className="mt-4 font-display italic text-xl text-white/60">{species.scientificname}</p>
        <p className="mt-16 text-white/40 text-sm animate-bounce font-data">scroll to descend ↓</p>
      </section>

      {/* Stop 2: bioluminescence */}
      <section className="relative min-h-screen flex items-center px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-data text-xs uppercase tracking-[0.4em] text-white/40 mb-4">
            {species.depthRange.min}–{species.depthRange.max}m · {species.depthRange.zone} zone
          </p>
          <h2 className="font-display text-4xl text-white mb-6">How it glows</h2>
          <div className="flex items-center gap-3 mb-6">
            {species.bioluminescenceType.map((t) => (
              <span
                key={t}
                className="text-xs font-data uppercase tracking-wide px-3 py-1.5 rounded-full border"
                style={{ borderColor: `${glow}88`, color: glow }}
              >
                {t.replace(/_/g, ' ')}
              </span>
            ))}
            <span className="text-xs font-data uppercase tracking-wide text-white/50">
              {species.lightPattern} pattern
            </span>
          </div>
          <p className="text-white/70 text-lg leading-relaxed">
            {species.funFacts[0]}
          </p>
        </div>
      </section>

      {/* Stop 3: habitat + diet */}
      <section className="relative min-h-screen flex items-center px-6">
        <div className="max-w-2xl mx-auto grid gap-10">
          <div>
            <p className="font-data text-xs uppercase tracking-[0.4em] text-white/40 mb-3">Habitat</p>
            <p className="text-white/80 text-xl font-display leading-relaxed">{species.habitat}</p>
          </div>
          <div>
            <p className="font-data text-xs uppercase tracking-[0.4em] text-white/40 mb-3">Diet</p>
            <p className="text-white/80 text-xl font-display leading-relaxed">{species.diet}</p>
          </div>
        </div>
      </section>

      {/* Stop 4: sightings, as a depth-ordered descent log */}
      <section className="relative min-h-screen px-6 py-32">
        <div className="max-w-2xl mx-auto">
          <p className="font-data text-xs uppercase tracking-[0.4em] text-white/40 mb-8">
            {species.depthRange.zone === 'hadal' || species.depthRange.zone === 'abyssal'
              ? 'the abyss · logged sightings'
              : 'logged sightings'}
          </p>
          <div className="space-y-8 border-l border-white/15 pl-8">
            {[...sightings]
              .sort((a, b) => b.depthM - a.depthM)
              .map((s) => (
                <div key={s.id} className="relative">
                  <span
                    className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full"
                    style={{ backgroundColor: glow, boxShadow: `0 0 12px ${glow}` }}
                  />
                  <p className="font-data text-sm text-white/50">
                    {s.depthM}m · {s.sightedAt} · {s.location}
                  </p>
                  <p className="text-white/80 mt-1">{s.notes}</p>
                  <p className="font-data text-xs text-white/30 mt-2">
                    logged by {s.submittedBy} · {s.photoCount} photos
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default VariantB;
