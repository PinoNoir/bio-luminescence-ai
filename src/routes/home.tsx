import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Waves, Zap, BookOpen, Compass, Users, Award } from 'lucide-react';
import { SpeciesCard, ModuleCard } from '~/components';
import { BioluminescentSpecies, LearningModule } from '~/types';
import { mockSpecies, mockModules } from '~/data';

export const Route = createFileRoute('/home')({   
  component: Home,
})

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [speciesData, setSpeciesData] = useState<BioluminescentSpecies[]>([]);
  const [modulesData, setModulesData] = useState<LearningModule[]>([]);

  useEffect(() => {
    // Simulate loading time for data and images
    const loadData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSpeciesData(mockSpecies);
        setModulesData(mockModules);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSpeciesClick = (species: BioluminescentSpecies) => {
    console.log('Species clicked:', species);
  };

  const handleModuleStart = (module: LearningModule) => {
    console.log('Module started:', module);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-ocean-gradient">
      <div className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-16 bg-white/10 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded-lg mb-8 max-w-3xl mx-auto animate-pulse"></div>
            <div className="flex items-center justify-center space-x-4">
              <div className="h-12 w-32 bg-white/10 rounded-lg animate-pulse"></div>
              <div className="h-12 w-32 bg-white/10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center">
                <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-3 animate-pulse"></div>
                <div className="h-8 bg-white/10 rounded-lg mb-1 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="h-10 bg-white/10 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-5 bg-white/10 rounded-lg max-w-2xl animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-64 bg-white/10 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-ocean-gradient">
      
      {/* Hero Section */}
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
            <div
              className="text-center my-16"
            >
              <h1 className="text-6xl font-bold text-white mb-6">
                Explore the{' '}
                <span className="text-bio-blue animate-bio-glow-subtle">
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
                <button
                  className="px-8 py-4 bg-bio-blue rounded-lg text-white font-semibold hover:bg-bio-cyan transition-colors animate-bio-glow-button"

                >
                  <div className="flex items-center space-x-2">
                    <Compass className="w-5 h-5 text-deep-sea"  />
                    <span className="text-deep-sea">Start Exploring</span>
                  </div>
                </button>
                
                <button
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Waves className="w-5 h-5" />
                    <span>3D Ocean View</span>
                  </div>
                </button>
              </div>
            </div>
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
                <div
                  key={index}
                  className="text-center"
                >
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Featured Species */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Species</h2>
            <p className="text-gray-300 max-w-2xl">
              Meet some of the most fascinating bioluminescent creatures from various ocean depths.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {speciesData.map((species) => (
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
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Learning Modules</h2>
            <p className="text-gray-300 max-w-2xl">
              Start your journey with guided learning modules that take you from the surface to the abyss.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modulesData.map((module) => (
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
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Dive Deeper?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of ocean enthusiasts exploring the mysteries of bioluminescence.
              Create your account and start your underwater adventure today.
            </p>
            
            <button
              className="px-12 py-4 bg-gradient-to-r from-bio-blue to-bio-cyan rounded-lg text-white font-bold text-lg hover:from-bio-cyan hover:to-bio-green transition-all duration-300 animate-bio-pulse"
            >
              Begin Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
