import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { BookOpen, Clock, Target, Users, Star, ChevronRight, Play, Lock, CheckCircle } from 'lucide-react';
import { mockModules } from '~/data';

export const Route = createFileRoute('/learn')({
  component: LearnComponent,
});

function LearnComponent() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedDepth, setSelectedDepth] = useState<string>('all');

  const filteredModules = mockModules.filter(module => {
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficultyLevel.toString() === selectedDifficulty;
    const matchesDepth = selectedDepth === 'all' || module.depthLevel === selectedDepth;
    return matchesDifficulty && matchesDepth;
  });

  const difficultyLevels = [
    { value: 'all', label: 'All Levels', color: 'text-gray-400' },
    { value: '1', label: 'Beginner', color: 'text-bio-green' },
    { value: '2', label: 'Intermediate', color: 'text-bio-blue' },
    { value: '3', label: 'Advanced', color: 'text-bio-purple' }
  ];

  const depthLevels = [
    { value: 'all', label: 'All Depths', color: 'text-gray-400' },
    { value: 'surface', label: 'Surface Waters', color: 'text-bio-blue' },
    { value: 'midnight', label: 'Deep Sea', color: 'text-bio-purple' }
  ];

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'text-bio-green';
      case 2: return 'text-bio-blue';
      case 3: return 'text-bio-purple';
      default: return 'text-gray-400';
    }
  };

  const getDepthColor = (depth: string) => {
    switch (depth) {
      case 'surface': return 'text-bio-blue';
      case 'midnight': return 'text-bio-purple';
      default: return 'text-gray-400';
    }
  };

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
              Learning{' '}
              <span className="text-bio-blue animate-bio-glow-subtle">
                Modules
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dive deep into the science of bioluminescence. From beginner concepts to advanced research, 
              explore the fascinating world of living light through interactive learning experiences.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-abyss/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <BookOpen className="w-8 h-8 text-bio-blue mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{mockModules.length}</div>
              <div className="text-gray-400">Learning Modules</div>
            </div>
            <div className="bg-abyss/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Users className="w-8 h-8 text-bio-green mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-gray-400">Active Learners</div>
            </div>
            <div className="bg-abyss/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Clock className="w-8 h-8 text-bio-cyan mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">25+</div>
              <div className="text-gray-400">Hours of Content</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-abyss/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Difficulty Filter */}
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-bio-blue/50 focus:border-bio-blue/50 transition-all"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value} className="bg-abyss text-white">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Depth Filter */}
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-300 mb-2">Depth Focus</label>
                <select
                  value={selectedDepth}
                  onChange={(e) => setSelectedDepth(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-bio-blue/50 focus:border-bio-blue/50 transition-all"
                >
                  {depthLevels.map(depth => (
                    <option key={depth.value} value={depth.value} className="bg-abyss text-white">
                      {depth.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              Showing <span className="text-bio-blue font-semibold">{filteredModules.length}</span> modules
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Star className="w-4 h-4 text-bio-blue" />
              <span>Curated Learning Path</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {filteredModules.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No modules found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {filteredModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-abyss/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-bio-blue/30 transition-all group cursor-pointer"
                >
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-bio-blue transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficultyLevel)} bg-white/5 border border-current/20`}>
                        {difficultyLevels.find(l => l.value === module.difficultyLevel.toString())?.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDepthColor(module.depthLevel)} bg-white/5 border border-current/20`}>
                        {depthLevels.find(d => d.value === module.depthLevel)?.label}
                      </span>
                    </div>
                  </div>

                  {/* Module Details */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{module.estimatedDuration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>{module.objectives.length} objectives</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{module.speciesIds.length} species</span>
                    </div>
                  </div>

                  {/* Objectives Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Learning Objectives</h4>
                    <div className="space-y-2">
                      {module.objectives.slice(0, 3).map((objective, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-bio-green" />
                          <span>{objective}</span>
                        </div>
                      ))}
                      {module.objectives.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{module.objectives.length - 3} more objectives
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 px-4 py-2 bg-bio-blue/20 hover:bg-bio-blue/30 text-bio-blue rounded-lg transition-colors group">
                      <Play className="w-4 h-4" />
                      <span>Start Learning</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    {module.prerequisites.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lock className="w-3 h-3" />
                        <span>Prerequisites required</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
