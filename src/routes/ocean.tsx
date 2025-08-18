import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Waves, Eye, Camera, RotateCcw, ZoomIn, ZoomOut, Play, Pause, Info } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/ocean')({
  component: OceanComponent,
});

function OceanComponent() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'explore' | 'learn' | 'research'>('explore');
  const [selectedDepth, setSelectedDepth] = useState<string>('surface');

  const depthZones = [
    { value: 'surface', label: 'Surface (0-200m)', color: 'text-bio-blue', description: 'Sunlight zone with coral reefs and coastal species' },
    { value: 'twilight', label: 'Twilight (200-1000m)', color: 'text-bio-cyan', description: 'Mesopelagic zone with migrating creatures' },
    { value: 'midnight', label: 'Midnight (1000m+)', color: 'text-bio-purple', description: 'Deep abyss with bioluminescent displays' }
  ];

  const viewModes = [
    { value: 'explore', label: 'Explore', icon: Eye, description: 'Free exploration mode' },
    { value: 'learn', label: 'Learn', icon: Info, description: 'Guided learning experience' },
    { value: 'research', label: 'Research', icon: Camera, description: 'Scientific observation mode' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-sea via-abyss to-ocean-deep">
      {/* Header */}
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              3D{' '}
              <span className="text-bio-blue animate-bio-glow-subtle">
                Ocean
              </span>{' '}
              Experience
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Immerse yourself in the mysterious depths of the ocean. Explore bioluminescent species 
              in their natural habitat through an interactive 3D environment.
            </p>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-abyss/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* View Mode Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">View Mode</h3>
                <div className="space-y-2">
                  {viewModes.map(mode => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.value}
                        onClick={() => setViewMode(mode.value as any)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                          viewMode === mode.value
                            ? 'bg-bio-blue/20 text-bio-blue border border-bio-blue/30'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">{mode.label}</div>
                          <div className="text-xs text-gray-400">{mode.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Depth Zone Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Depth Zone</h3>
                <div className="space-y-2">
                  {depthZones.map(zone => (
                    <button
                      key={zone.value}
                      onClick={() => setSelectedDepth(zone.value)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedDepth === zone.value
                          ? 'bg-bio-blue/20 text-bio-blue border border-bio-blue/30'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div className="font-medium">{zone.label}</div>
                      <div className="text-xs text-gray-400">{zone.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Controls */}
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Camera Controls</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all flex flex-col items-center gap-1">
                    <ZoomIn className="w-4 h-4" />
                    <span className="text-xs">Zoom In</span>
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all flex flex-col items-center gap-1">
                    <ZoomOut className="w-4 h-4" />
                    <span className="text-xs">Zoom Out</span>
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-xs">Reset View</span>
                  </button>
                  <button className="p-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all flex flex-col items-center gap-1">
                    <Camera className="w-4 h-4" />
                    <span className="text-xs">Screenshot</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Playback Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-6 py-3 bg-bio-blue/20 hover:bg-bio-blue/30 text-bio-blue rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* 3D Canvas Placeholder */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            {/* 3D Canvas Container */}
            <div className="bg-abyss/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-ocean-surface via-ocean-mid to-ocean-deep relative">
                {/* Placeholder for 3D content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Waves className="w-16 h-16 text-bio-blue mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">3D Ocean Environment</h3>
                    <p className="text-gray-400 max-w-md">
                      Interactive 3D visualization of the {selectedDepth} zone. 
                      Navigate with mouse/touch to explore bioluminescent species.
                    </p>
                  </div>
                </div>

                {/* Depth Indicator */}
                <div className="absolute top-4 right-4">
                  <div className="bg-abyss/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    <div className="text-xs text-gray-400">Current Depth</div>
                    <div className="text-sm font-semibold text-white">
                      {depthZones.find(z => z.value === selectedDepth)?.label}
                    </div>
                  </div>
                </div>

                {/* View Mode Indicator */}
                <div className="absolute top-4 left-4">
                  <div className="bg-abyss/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
                    <div className="text-xs text-gray-400">Mode</div>
                    <div className="text-sm font-semibold text-white capitalize">
                      {viewMode}
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-abyss/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 text-center">
                    <div className="text-xs text-gray-400">
                      <span className="text-bio-blue font-medium">Mouse:</span> Rotate • 
                      <span className="text-bio-blue font-medium"> Scroll:</span> Zoom • 
                      <span className="text-bio-blue font-medium"> Right-click:</span> Pan
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Species Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6 bg-abyss/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Featured Species in This Zone</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="w-3 h-3 bg-bio-blue rounded-full mb-2 animate-bio-pulse"></div>
                  <h4 className="font-medium text-white mb-1">Crystal Jelly</h4>
                  <p className="text-sm text-gray-400">Aequorea victoria</p>
                  <p className="text-xs text-gray-500 mt-2">Produces green fluorescent protein (GFP)</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="w-3 h-3 bg-bio-pink rounded-full mb-2 animate-bio-pulse"></div>
                  <h4 className="font-medium text-white mb-1">Atolla Jellyfish</h4>
                  <p className="text-sm text-gray-400">Atolla wyvillei</p>
                  <p className="text-xs text-gray-500 mt-2">Creates "burglar alarm" light displays</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="w-3 h-3 bg-bio-green rounded-full mb-2 animate-bio-pulse"></div>
                  <h4 className="font-medium text-white mb-1">Firefly Squid</h4>
                  <p className="text-sm text-gray-400">Watasenia scintillans</p>
                  <p className="text-xs text-gray-500 mt-2">Thousands of photophores for communication</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
