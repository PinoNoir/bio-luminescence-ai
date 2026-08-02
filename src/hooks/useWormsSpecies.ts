import { useQuery } from '@tanstack/react-query';
import { searchSpecies, getSpeciesById } from '~/services/worms';

export const useWormsSpecies = () => {
  // Search for species by name
  const searchSpeciesQuery = (query: string) => useQuery({
    queryKey: ['worms', 'search', query],
    queryFn: () => searchSpecies(query),
    enabled: query.length > 2, // Only search when query is longer than 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get species by AphiaID
  const getSpeciesByIdQuery = (aphiaId: number) => useQuery({
    queryKey: ['worms', 'species', aphiaId],
    queryFn: () => getSpeciesById(aphiaId),
    enabled: !!aphiaId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    // Queries
    searchSpeciesQuery,
    getSpeciesByIdQuery,

    // Utility functions
    searchSpecies,
    getSpeciesById,
  };
};
