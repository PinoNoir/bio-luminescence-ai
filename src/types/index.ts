// Core species and taxonomy types based on WoRMS API
export interface AphiaRecord {
  AphiaID: number;
  url: string;
  scientificname: string;
  authority: string;
  taxonRankID: number;
  rank: string;
  status: string;
  unacceptreason?: string;
  valid_AphiaID?: number;
  valid_name?: string;
  valid_authority?: string;
  parentNameUsageID?: number;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  citation?: string;
  lsid?: string;
  isMarine?: boolean;
  isBrackish?: boolean;
  isFreshwater?: boolean;
  isTerrestrial?: boolean;
  isExtinct?: boolean;
  match_type?: string;
  modified?: string;
}

export interface Distribution {
  locality: string;
  locationID: string;
  higherGeography: string;
  higherGeographyID: string;
  recordStatus: 'valid' | 'doubtful' | 'inaccurate';
  typeStatus?: string;
  establishmentMeans?: string;
  invasiveness?: string;
  occurrence?: string;
  decimalLatitude?: number;
  decimalLongitude?: number;
  qualityStatus: 'checked' | 'trusted' | 'unreviewed';
}

export interface Vernacular {
  vernacular: string;
  language_code: string;
  language: string;
}

// Bioluminescence-specific types
export enum BioluminescenceType {
  BACTERIAL = 'bacterial',
  PHOTOPHORE = 'photophore',
  LUCIFERIN_LUCIFERASE = 'luciferin_luciferase',
  COUNTER_ILLUMINATION = 'counter_illumination',
  DEFENSIVE_FLASH = 'defensive_flash',
  COMMUNICATION = 'communication',
  PREDATION = 'predation'
}

export interface DepthRange {
  min: number;
  max: number;
  unit: 'meters' | 'feet';
  zone: 'sunlight' | 'twilight' | 'midnight' | 'abyssal' | 'hadal';
}

export interface BioluminescentSpecies extends AphiaRecord {
  id: string;
  commonName: string; // Made required
  bioluminescenceType: BioluminescenceType[];
  depthRange: DepthRange;
  lightColor: string; // Hex color of bioluminescence
  lightPattern: 'steady' | 'pulsing' | 'flashing' | 'wave';
  habitat: string;
  diet: string;
  size: {
    length: number;
    unit: 'mm' | 'cm' | 'm';
  };
  conservationStatus?: string;
  funFacts: string[];
  imageUrl?: string;
  videoUrl?: string;
  threeDModelUrl?: string;
  discoveryDate?: string;
  discoveredBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Learning system types
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  estimatedDuration: number; // minutes
  depthLevel: 'surface' | 'twilight' | 'midnight' | 'abyssal';
  prerequisites: string[]; // Module IDs
  objectives: string[];
  content: ModuleContent[];
  speciesIds: string[];
  quizQuestions?: QuizQuestion[];
  interactive3D?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleContent {
  id: string;
  type: 'text' | 'image' | 'video' | '3d_model' | 'interactive' | 'quiz';
  title: string;
  content: string;
  mediaUrl?: string;
  duration?: number;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'drag_drop';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  progressPercentage: number;
  completedSections: string[];
  quizScores: Record<string, number>;
  timeSpent: number; // minutes
  lastAccessedAt: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
}

// 3D and visualization types
export interface InteractiveExperience {
  id: string;
  speciesId: string;
  type: '3d_model' | 'simulation' | 'game' | 'ar_view';
  title: string;
  description: string;
  assets: {
    modelUrl?: string;
    textureUrl?: string;
    animationUrl?: string;
    soundUrl?: string;
  };
  controls: {
    rotate: boolean;
    zoom: boolean;
    animate: boolean;
    lighting: boolean;
  };
  metadata: {
    polyCount?: number;
    fileSize?: number;
    loadTime?: number;
  };
  createdAt: string;
}

// UI Component types
export interface SpeciesCardProps {
  species: BioluminescentSpecies;
  variant?: 'card' | 'tile' | 'list';
  showGlow?: boolean;
  onClick?: (species: BioluminescentSpecies) => void;
}

export interface OceanEnvironmentProps {
  depth: number;
  species?: BioluminescentSpecies[];
  ambientLight?: boolean;
  particleCount?: number;
  cameraPosition?: [number, number, number];
}

// API Response types
export interface WoRMSApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// Navigation and UI types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  depth?: number;
  children?: NavigationItem[];
}

export interface DepthLevel {
  name: string;
  range: DepthRange;
  color: string;
  species: BioluminescentSpecies[];
  unlocked: boolean;
}
