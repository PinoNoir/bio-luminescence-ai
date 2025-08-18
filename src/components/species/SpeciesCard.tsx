import { Eye, MapPin, Zap, Info } from 'lucide-react';
import { SpeciesCardProps } from '~/types';
import { cn } from '~/lib/utils';
import { useSpeciesImages } from '~/hooks';

function SpeciesCard({ 
  species, 
  variant = 'card', 
  showGlow = true, 
  onClick 
}: SpeciesCardProps) {
  const { bestImage, isLoading, error } = useSpeciesImages(species);
  
  const handleClick = () => {
    if (onClick) {
      onClick(species);
    }
  };

  const glowColor = species.lightColor || '#00E5FF';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-abyss/80 to-deep-sea/60 backdrop-blur-sm border border-white/10 cursor-pointer group transition-all duration-300 hover:scale-105',
        {
          'w-80 h-96': variant === 'card',
          'w-64 h-80': variant === 'tile',
          'w-full h-32 flex-row': variant === 'list'
        }
      )}
      onClick={handleClick}
    >
      {/* Bioluminescent glow effect */}
      {showGlow && (
        <div
          className="absolute inset-0 pointer-events-none animate-pulse"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor}20 0%, transparent 70%)`,
            boxShadow: `0 0 20px ${glowColor}40`
          }}
        />
      )}

      {/* Species image */}
      <div className={cn(
        'relative overflow-hidden',
        {
          'h-48': variant === 'card',
          'h-40': variant === 'tile',
          'h-full w-32': variant === 'list'
        }
      )}>
        {isLoading ? (
          // Loading skeleton
          <div className="w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-mid flex items-center justify-center animate-pulse">
            <div className="text-center">
              <Eye className="w-8 h-8 text-bio-blue opacity-50 mx-auto mb-2" />
              <div className="text-xs text-bio-blue">Loading image...</div>
            </div>
          </div>
        ) : bestImage ? (
          // Real image from service
          <div className="relative w-full h-full">
            <img
              src={bestImage.url}
              alt={species.commonName || species.scientificname}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback div (hidden by default) */}
            <div className="hidden w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-mid items-center justify-center">
              <Eye className="w-12 h-12 text-bio-blue opacity-50" />
            </div>
            
            {/* Image attribution */}
            <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              via {bestImage.source}
            </div>
          </div>
        ) : (
          // No image available
          <div className="w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-mid flex items-center justify-center">
            <div className="text-center">
              <Eye className="w-12 h-12 text-bio-blue opacity-50 mx-auto mb-2" />
              <div className="text-xs text-bio-blue">No image available</div>
            </div>
          </div>
        )}
        
        {/* Depth indicator */}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
          {species.depthRange.min}-{species.depthRange.max}m
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        'p-4',
        {
          'space-y-3': variant !== 'list',
          'flex-1 flex flex-col justify-center space-y-2': variant === 'list'
        }
      )}>
        {/* Names */}
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">
            {species.commonName || species.scientificname}
          </h3>
          {species.commonName && (
            <p className="text-sm text-gray-300 italic">
              {species.scientificname}
            </p>
          )}
        </div>

        {/* Bioluminescence info */}
        <div className="flex items-center space-x-2">
          <Zap 
            className="w-4 h-4" 
            style={{ color: glowColor }}
          />
          <span className="text-sm text-gray-300 capitalize">
            {species.bioluminescenceType?.[0]?.replace('_', ' ')}
          </span>
        </div>

        {/* Habitat */}
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-bio-green" />
          <span className="text-sm text-gray-300 truncate">
            {species.habitat}
          </span>
        </div>

        {/* Light pattern indicator */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: glowColor,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
          
          <button className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Info className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </div>
  );
}

export default SpeciesCard;
