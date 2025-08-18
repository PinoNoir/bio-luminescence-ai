import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Search, Grid3X3, List, Zap, BookOpen, Globe, TrendingUp } from 'lucide-react';
import { mockSpecies, mockModules } from '~/data';

export const Route = createFileRoute('/search')({
  component: SearchComponent,
});

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'species' | 'modules' | 'content'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const searchResults = {
    species: mockSpecies.filter(species => 
      (species.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      species.scientificname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      species.habitat.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    modules: mockModules.filter(module => 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.objectives.some((obj: string) => obj.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  };

  const allResults = searchTerm ? [...searchResults.species, ...searchResults.modules] : [];
  const totalResults = searchResults.species.length + searchResults.modules.length;

  const searchTypes = [
    { value: 'all', label: 'All Content', icon: Globe, count: totalResults },
    { value: 'species', label: 'Species', icon: Zap, count: searchResults.species.length },
    { value: 'modules', label: 'Learning Modules', icon: BookOpen, count: searchResults.modules.length },
    { value: 'content', label: 'Research Content', icon: TrendingUp, count: 0 }
  ];

  const renderSpeciesResult = (species: any) => (
    <div key={species.id} className="bg-abyss/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-bio-blue/30 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-bio-blue/20 to-bio-cyan/20 rounded-lg flex items-center justify-center">
          <Zap className="w-8 h-8 text-bio-blue" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{species.commonName}</h4>
          <p className="text-sm text-gray-400 italic mb-2">{species.scientificname}</p>
          <p className="text-sm text-gray-300 mb-3">{species.habitat}</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-bio-blue/20 text-bio-blue rounded-full">
              {species.depthRange.zone}
            </span>
            <span className="px-2 py-1 bg-bio-green/20 text-bio-green rounded-full">
              {species.bioluminescenceType[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModuleResult = (module: any) => (
    <div key={module.id} className="bg-abyss/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-bio-blue/30 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-bio-green/20 to-bio-blue/20 rounded-lg flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-bio-green" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{module.title}</h4>
          <p className="text-sm text-gray-300 mb-3">{module.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Level {module.difficultyLevel}</span>
            <span>{module.estimatedDuration} min</span>
            <span>{module.objectives.length} objectives</span>
          </div>
        </div>
      </div>
    </div>
  );

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
              Search the{' '}
              <span className="text-bio-blue animate-bio-glow-subtle">
                Deep
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover bioluminescent species, learning modules, and research content. 
              Search across our comprehensive database of marine life and educational resources.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for species, modules, habitats, research topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-abyss/50 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bio-blue/50 focus:border-bio-blue/50 transition-all text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-bio-blue/20 text-bio-blue' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list' 
                        ? 'bg-bio-blue/20 text-bio-blue' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Type Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {searchTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSearchType(type.value as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      searchType === type.value
                        ? 'bg-bio-blue/20 text-bio-blue border border-bio-blue/30'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.label}</span>
                    {searchTerm && (
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                        {type.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Results Count */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-8"
            >
              <p className="text-gray-400">
                Found <span className="text-bio-blue font-semibold">{totalResults}</span> results for "{searchTerm}"
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {!searchTerm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Start your search</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Enter a search term above to explore our database of bioluminescent species, 
                learning modules, and research content.
              </p>
            </motion.div>
          ) : totalResults === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or browse our categories</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }
            >
              {/* Render results based on search type */}
              {searchType === 'all' || searchType === 'species' ? 
                searchResults.species.map((species, index) => (
                  <motion.div
                    key={species.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {renderSpeciesResult(species)}
                  </motion.div>
                )) : null
              }
              
              {searchType === 'all' || searchType === 'modules' ? 
                searchResults.modules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: (searchResults.species.length + index) * 0.1 }}
                  >
                    {renderModuleResult(module)}
                  </motion.div>
                )) : null
              }
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
