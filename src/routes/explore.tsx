import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Search, Grid3X3, List, Zap, Compass } from 'lucide-react';
import { mockSpecies } from '~/data';
import { SpeciesCard } from '~/components';

export const Route = createFileRoute('/explore')({
  component: ExploreComponent,
});

function ExploreComponent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepth, setSelectedDepth] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredSpecies = mockSpecies.filter(species => {
    const matchesSearch = (species.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         species.scientificname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepth = selectedDepth === 'all' || species.depthRange.zone === selectedDepth;
    const matchesType = selectedType === 'all' || 
                       species.bioluminescenceType.some(type => type === selectedType);
    
    return matchesSearch && matchesDepth && matchesType;
  });

  const depthZones = [
    { value: 'all', label: 'All Depths', color: 'text-gray-400' },
    { value: 'sunlight', label: 'Sunlight Zone (0-200m)', color: 'text-bio-blue' },
    { value: 'twilight', label: 'Twilight Zone (200-1000m)', color: 'text-bio-cyan' },
    { value: 'midnight', label: 'Midnight Zone (1000m+)', color: 'text-bio-purple' }
  ];

  const bioluminescenceTypes = [
    { value: 'all', label: 'All Types', color: 'text-gray-400' },
    { value: 'PHOTOPHORE', label: 'Photophores', color: 'text-bio-green' },
    { value: 'DEFENSIVE_FLASH', label: 'Defensive Flash', color: 'text-bio-pink' },
    { value: 'COMMUNICATION', label: 'Communication', color: 'text-bio-cyan' }
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
              Explore{' '}
              <span className="text-bio-blue animate-bio-glow-subtle">
                Bioluminescent
              </span>{' '}
              Species
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the fascinating world of living light. From surface waters to the deepest abyss, 
              explore how marine organisms create their own illumination.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-abyss/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search species by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bio-blue/50 focus:border-bio-blue/50 transition-all"
                  />
                </div>
              </div>

              {/* Depth Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedDepth}
                  onChange={(e) => setSelectedDepth(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-bio-blue/50 focus:border-bio-blue/50 transition-all"
                >
                  {depthZones.map(zone => (
                    <option key={zone.value} value={zone.value} className="bg-abyss text-white">
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-bio-blue/50 focus:border-bio-blue/50 transition-all"
                >
                  {bioluminescenceTypes.map(type => (
                    <option key={type.value} value={type.value} className="bg-abyss text-white">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-bio-blue/20 text-bio-blue' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-bio-blue/20 text-bio-blue' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              Found <span className="text-bio-blue font-semibold">{filteredSpecies.length}</span> species
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-bio-blue" />
              <span>Bioluminescent Life</span>
            </div>
          </div>
        </div>
      </div>

      {/* Species Grid/List */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {filteredSpecies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Compass className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No species found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }
            >
              {filteredSpecies.map((species, index) => (
                <motion.div
                  key={species.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <SpeciesCard species={species} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
