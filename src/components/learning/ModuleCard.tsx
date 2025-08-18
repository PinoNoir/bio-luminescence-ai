import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  ChevronRight, 
  Star,
  Play,
  Lock,
  CheckCircle
} from 'lucide-react';
import { LearningModule, UserProgress } from '~/types';
import { cn } from '~/lib/utils';

interface ModuleCardProps {
  module: LearningModule;
  userProgress?: UserProgress | null;
  isLocked?: boolean;
  onStart: (module: LearningModule) => void;
  onContinue?: (module: LearningModule) => void;
}

function ModuleCard({ 
  module, 
  userProgress, 
  isLocked = false, 
  onStart, 
  onContinue 
}: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const isCompleted = userProgress?.progressPercentage === 100;
  const isInProgress = userProgress && userProgress.progressPercentage > 0 && userProgress.progressPercentage < 100;
  
  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'text-bio-green';
      case 2: return 'text-bio-blue';
      case 3: return 'text-bio-cyan';
      case 4: return 'text-bio-pink';
      case 5: return 'text-bio-purple';
      default: return 'text-gray-400';
    }
  };
  
  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Easy';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };
  
  const getDepthColor = (depthLevel: string) => {
    switch (depthLevel) {
      case 'surface': return '#4FC3F7';
      case 'twilight': return '#3F51B5';
      case 'midnight': return '#1A237E';
      case 'abyssal': return '#0D47A1';
      default: return '#01579B';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const handleClick = () => {
    if (isLocked) return;
    
    if (isInProgress && onContinue) {
      onContinue(module);
    } else {
      onStart(module);
    }
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-br from-abyss/80 to-deep-sea/60 backdrop-blur-sm border border-white/10 cursor-pointer group',
        isLocked && 'opacity-50 cursor-not-allowed'
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={!isLocked ? "hover" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Depth indicator bar */}
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: getDepthColor(module.depthLevel) }}
      />
      
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-400 text-sm">Complete previous modules to unlock</p>
          </div>
        </div>
      )}
      
      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-bio-green rounded-full p-2">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      {userProgress && userProgress.progressPercentage > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/10">
          <motion.div
            className="h-full bg-bio-blue"
            initial={{ width: 0 }}
            animate={{ width: `${userProgress.progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
              {module.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-2">
              {module.description}
            </p>
          </div>
        </div>
        
        {/* Metadata */}
        <div className="space-y-3 mb-6">
          {/* Difficulty and duration */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3 h-3',
                      i < module.difficultyLevel 
                        ? getDifficultyColor(module.difficultyLevel) + ' fill-current'
                        : 'text-gray-600'
                    )}
                  />
                ))}
              </div>
              <span className={cn('font-medium', getDifficultyColor(module.difficultyLevel))}>
                {getDifficultyLabel(module.difficultyLevel)}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{module.estimatedDuration} min</span>
            </div>
          </div>
          
          {/* Objectives preview */}
          <div>
            <div className="text-xs text-gray-400 mb-1">Learning Objectives:</div>
            <div className="text-sm text-gray-300">
              {module.objectives.slice(0, 2).map((objective, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1 h-1 rounded-full bg-bio-blue mt-2 flex-shrink-0" />
                  <span className="text-xs leading-relaxed">{objective}</span>
                </div>
              ))}
              {module.objectives.length > 2 && (
                <div className="text-xs text-gray-500 mt-1">
                  +{module.objectives.length - 2} more objectives
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{module.content.length} sections</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{module.speciesIds.length} species</span>
            </div>
          </div>
          
          {!isLocked && (
            <motion.button
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors',
                isCompleted 
                  ? 'bg-bio-green/20 text-bio-green hover:bg-bio-green/30'
                  : isInProgress
                    ? 'bg-bio-blue/20 text-bio-blue hover:bg-bio-blue/30'
                    : 'bg-bio-cyan/20 text-bio-cyan hover:bg-bio-cyan/30'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCompleted ? (
                <>
                  <Award className="w-4 h-4" />
                  <span>Review</span>
                </>
              ) : isInProgress ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Continue</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </>
              )}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Hover glow effect */}
      {isHovered && !isLocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getDepthColor(module.depthLevel)}20 0%, transparent 70%)`
          }}
        />
      )}
    </motion.div>
  );
}

export default ModuleCard;
