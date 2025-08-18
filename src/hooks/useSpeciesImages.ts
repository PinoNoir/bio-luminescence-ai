import { useQuery } from '@tanstack/react-query';
import { BioluminescentSpecies } from '~/types';
import { 
  getSpeciesImages, 
  getBestSpeciesImage, 
  searchImagesByScientificName 
} from '~/services/speciesImages';

export const useSpeciesImages = (species: BioluminescentSpecies) => {
  // Get all images for a species
  const allImagesQuery = useQuery({
    queryKey: ['species-images', species.id, 'all'],
    queryFn: () => getSpeciesImages(species),
    enabled: !!species.id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Get the best single image for a species
  const bestImageQuery = useQuery({
    queryKey: ['species-images', species.id, 'best'],
    queryFn: () => getBestSpeciesImage(species),
    enabled: !!species.id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  return {
    allImages: allImagesQuery.data || [],
    bestImage: bestImageQuery.data,
    isLoading: allImagesQuery.isLoading || bestImageQuery.isLoading,
    error: allImagesQuery.error || bestImageQuery.error,
    refetch: () => {
      allImagesQuery.refetch();
      bestImageQuery.refetch();
    }
  };
};

// Hook for searching images by scientific name
export const useImageSearch = (scientificName: string) => {
  return useQuery({
    queryKey: ['image-search', scientificName],
    queryFn: () => searchImagesByScientificName(scientificName),
    enabled: scientificName.length > 2,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Hook for getting images from multiple species
export const useMultipleSpeciesImages = (speciesList: BioluminescentSpecies[]) => {
  return useQuery({
    queryKey: ['multiple-species-images', speciesList.map(s => s.id)],
    queryFn: async () => {
      const imagePromises = speciesList.map(species => getBestSpeciesImage(species));
      const images = await Promise.all(imagePromises);
      
      return speciesList.map((species, index) => ({
        species,
        image: images[index]
      }));
    },
    enabled: speciesList.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
