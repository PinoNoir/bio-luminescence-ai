import { LearningModule } from '~/types';

export const mockModules: LearningModule[] = [
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
