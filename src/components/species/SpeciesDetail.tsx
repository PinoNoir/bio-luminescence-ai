import { useState } from 'react';
import { 
  ArrowLeft, 
  Zap, 
  MapPin, 
  Ruler, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BioluminescentSpecies } from '~/types';

interface SpeciesDetailProps {
  species: BioluminescentSpecies;
  onBack: () => void;
  onStartLearning?: () => void;
}

function SpeciesDetail({ species, onBack, onStartLearning }: SpeciesDetailProps) {
  const [showFullFacts, setShowFullFacts] = useState(false);

  const glowColor = species.lightColor || '#00E5FF';

  return (
    <div className="min-h-screen bg-ocean-gradient">
      {/* Header with species info */}
      <div className="relative h-80 overflow-hidden">
        {species.imageUrl ? (
          <img
            src={species.imageUrl}
            alt={species.commonName || species.scientificname}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-mid" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div
            className="animate-fade-in-up"
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              {species.commonName || species.scientificname}
            </h1>
            {species.commonName && (
              <p className="text-xl text-gray-300 italic mb-4">
                {species.scientificname}
              </p>
            )}
            
            {onStartLearning && (
              <button
                onClick={onStartLearning}
                className="px-8 py-3 bg-bio-blue rounded-lg text-white font-semibold hover:bg-bio-cyan transition-colors animate-bio-pulse"
              >
                Start Learning Journey
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick facts section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <Ruler className="w-6 h-6 mx-auto mb-2 text-bio-blue" />
            <div className="text-sm text-gray-400">Size</div>
            <div className="text-lg font-bold text-white">
              {species.size.length} {species.size.unit}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <MapPin className="w-6 h-6 mx-auto mb-2 text-bio-green" />
            <div className="text-sm text-gray-400">Depth</div>
            <div className="text-lg font-bold text-white">
              {species.depthRange.min}-{species.depthRange.max}m
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2" style={{ color: glowColor }} />
            <div className="text-sm text-gray-400">Light Type</div>
            <div className="text-lg font-bold text-white capitalize">
              {species.bioluminescenceType?.[0]?.replace('_', ' ')}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div 
              className="w-6 h-6 mx-auto mb-2 rounded-full animate-bio-pulse"
              style={{ backgroundColor: glowColor }}
            />
            <div className="text-sm text-gray-400">Pattern</div>
            <div className="text-lg font-bold text-white capitalize">
              {species.lightPattern}
            </div>
          </div>
        </div>

        {/* Fun facts */}
        <div className="bg-white/5 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-bio-pink" />
            Fascinating Facts
          </h3>
          <div className="space-y-3">
            {species.funFacts.slice(0, showFullFacts ? undefined : 3).map((fact, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 animate-bio-pulse"
                  style={{ backgroundColor: glowColor }}
                />
                <p className="text-gray-300">{fact}</p>
              </div>
            ))}
          </div>
          {species.funFacts.length > 3 && (
            <button
              onClick={() => setShowFullFacts(!showFullFacts)}
              className="mt-4 flex items-center text-bio-blue hover:text-bio-cyan transition-colors"
            >
              {showFullFacts ? (
                <><ChevronUp className="w-4 h-4 mr-1" /> Show Less</>
              ) : (
                <><ChevronDown className="w-4 h-4 mr-1" /> Show More Facts</>
              )}
            </button>
          )}
        </div>

        {/* Habitat info */}
        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Habitat & Diet</h3>
          <p className="text-gray-300 mb-4">{species.habitat}</p>
          <p className="text-gray-300">{species.diet}</p>
        </div>
      </div>
    </div>
  );
}

export default SpeciesDetail;
