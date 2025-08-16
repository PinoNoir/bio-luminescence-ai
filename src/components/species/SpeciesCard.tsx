import { Eye, MapPin, Zap, Info } from 'lucide-react';
import { BioluminescentSpecies, SpeciesCardProps } from '~/types';
import { cn } from '~/lib/utils';
import { motion } from 'motion/react';

export function SpeciesCard({ 
  species, 
  variant = 'card', 
  showGlow = true, 
  onClick 
}: SpeciesCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(species);
    }
  };

  const glowColor = species.lightColor || '#00E5FF';
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };



  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-abyss/80 to-deep-sea/60 backdrop-blur-sm border border-white/10 cursor-pointer group',
        {
          'w-80 h-96': variant === 'card',
          'w-64 h-80': variant === 'tile',
          'w-full h-32 flex-row': variant === 'list'
        }
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={handleClick}
    >
      {/* Bioluminescent glow effect */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor}20 0%, transparent 70%)`
          }}
          animate={{
            boxShadow: [
              `0 0 20px ${glowColor}40`,
              `0 0 40px ${glowColor}60`,
              `0 0 20px ${glowColor}40`
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
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
        {species.imageUrl ? (
          <img
            src={species.imageUrl}
            alt={species.commonName || species.scientificname}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ocean-deep to-ocean-mid flex items-center justify-center">
            <Eye className="w-12 h-12 text-bio-blue opacity-50" />
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
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: glowColor }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut'
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
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </motion.div>
  );
}

export default SpeciesCard;
