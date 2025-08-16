import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Waves, Zap, BookOpen, Compass, Users, Award } from 'lucide-react';
import Navigation from '~/components/layout/Navigation';
import SpeciesCard from '~/components/species/SpeciesCard';
import ModuleCard from '~/components/learning/ModuleCard';
import { BioluminescentSpecies, LearningModule, BioluminescenceType } from '~/types';

export const Route = createFileRoute('/home')({   
  component: Home,
})

// Mock data for demonstration
const mockSpecies: BioluminescentSpecies[] = [
  {
    id: '1',
    AphiaID: 12345,
    url: '',
    scientificname: 'Aequorea victoria',
    authority: '',
    taxonRankID: 220,
    rank: 'species',
    status: 'accepted',
    commonName: 'Crystal Jelly',
    bioluminescenceType: [BioluminescenceType.PHOTOPHORE],
    depthRange: { min: 0, max: 300, unit: 'meters', zone: 'sunlight' },
    lightColor: '#00E5FF',
    lightPattern: 'pulsing',
    habitat: 'Coastal waters of the Pacific Northwest',
    diet: 'Small fish, copepods, and other zooplankton',
    size: { length: 15, unit: 'cm' },
    funFacts: [
      'The green fluorescent protein (GFP) was first isolated from this species',
      'Can produce both blue bioluminescence and green fluorescence',
      'Has been crucial in medical research and biotechnology'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    AphiaID: 12346,
    url: '',
    scientificname: 'Atolla wyvillei',
    authority: '',
    taxonRankID: 220,
    rank: 'species',
    status: 'accepted',
    commonName: 'Atolla Jellyfish',
    bioluminescenceType: [BioluminescenceType.DEFENSIVE_FLASH],
    depthRange: { min: 1000, max: 4000, unit: 'meters', zone: 'midnight' },
    lightColor: '#E91E63',
    lightPattern: 'flashing',
    habitat: 'Deep ocean waters worldwide',
    diet: 'Small crustaceans and other zooplankton',
    size: { length: 15, unit: 'cm' },
    funFacts: [
      'Creates a "burglar alarm" of light when attacked',
      'The light display can be seen from great distances',
      'Lives in complete darkness of the deep ocean'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1582639590180-cd26abacbf2c?w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockModules: LearningModule[] = [
  {
    id: '1',
    title: 'Introduction to Bioluminescence',
    description: 'Discover the fascinating world of living light and how marine organisms create their own illumination.',
    difficultyLevel: 1,
    estimatedDuration: 30,
    depthLevel: 'surface',
    prerequisites: [],
    objectives: [
      'Understand what bioluminescence is',
      'Learn about different types of light production',
      'Explore common bioluminescent species'
    ],
    content: [],
    speciesIds: ['1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Deep Sea Light Shows',
    description: 'Journey into the abyss to explore the most spectacular bioluminescent displays on Earth.',
    difficultyLevel: 3,
    estimatedDuration: 45,
    depthLevel: 'midnight',
    prerequisites: ['1'],
    objectives: [
      'Explore deep-sea bioluminescent species',
      'Understand survival strategies using light',
      'Learn about deep-sea ecosystems'
    ],
    content: [],
    speciesIds: ['2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function Home() {
  const handleSpeciesClick = (species: BioluminescentSpecies) => {
    console.log('Species clicked:', species);
  };

  const handleModuleStart = (module: LearningModule) => {
    console.log('Module started:', module);
  };

  return (
    <div className="min-h-screen bg-ocean-gradient">
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-6xl font-bold text-white mb-6">
              Explore the{' '}
              <span className="text-bio-blue animate-bio-glow">
                Luminous
              </span>{' '}
              Deep
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Dive into the mysterious world of bioluminescent marine life. 
              Discover how creatures of the deep create their own light to survive, 
              communicate, and thrive in the ocean's darkest depths.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <motion.button
                className="px-8 py-4 bg-bio-blue rounded-lg text-white font-semibold hover:bg-bio-cyan transition-colors animate-bio-pulse"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5" />
                  <span>Start Exploring</span>
                </div>
              </motion.button>
              
              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg text-white font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  <Waves className="w-5 h-5" />
                  <span>3D Ocean View</span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, label: 'Species', value: '500+', color: 'text-bio-blue' },
              { icon: BookOpen, label: 'Modules', value: '50+', color: 'text-bio-green' },
              { icon: Users, label: 'Learners', value: '10K+', color: 'text-bio-pink' },
              { icon: Award, label: 'Depths', value: '6000m', color: 'text-bio-cyan' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color} animate-bio-pulse`} />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Featured Species */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Featured Species</h2>
            <p className="text-gray-300 max-w-2xl">
              Meet some of the most fascinating bioluminescent creatures from various ocean depths.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockSpecies.map((species) => (
              <SpeciesCard
                key={species.id}
                species={species}
                onClick={handleSpeciesClick}
                showGlow={true}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Learning Modules */}
      <div className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Learning Modules</h2>
            <p className="text-gray-300 max-w-2xl">
              Start your journey with guided learning modules that take you from the surface to the abyss.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onStart={handleModuleStart}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Dive Deeper?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of ocean enthusiasts exploring the mysteries of bioluminescence.
              Create your account and start your underwater adventure today.
            </p>
            
            <motion.button
              className="px-12 py-4 bg-gradient-to-r from-bio-blue to-bio-cyan rounded-lg text-white font-bold text-lg hover:from-bio-cyan hover:to-bio-green transition-all duration-300 animate-bio-pulse"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Begin Your Journey
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
