import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  searchSpecies, 
  getSpeciesById, 
  searchBioluminescentSpecies,
  convertWormsToBioluminescentSpecies,
  fetchBioluminescentSpeciesFromWorms
} from '~/services/worms';
import { AphiaRecord, BioluminescentSpecies } from '~/types';

export const useWormsSpecies = () => {
  const queryClient = useQueryClient();

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

  // Search for bioluminescent species
  const bioluminescentSpeciesQuery = useQuery({
    queryKey: ['worms', 'bioluminescent'],
    queryFn: searchBioluminescentSpecies,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Fetch and convert bioluminescent species
  const convertedSpeciesQuery = useQuery({
    queryKey: ['worms', 'converted-species'],
    queryFn: fetchBioluminescentSpeciesFromWorms,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Convert a single WORMS record to your format
  const convertSpeciesMutation = useMutation({
    mutationFn: convertWormsToBioluminescentSpecies,
    onSuccess: (data) => {
      // Invalidate and refetch the converted species query
      queryClient.invalidateQueries({ queryKey: ['worms', 'converted-species'] });
    },
  });

  return {
    // Queries
    searchSpeciesQuery,
    getSpeciesByIdQuery,
    bioluminescentSpeciesQuery,
    convertedSpeciesQuery,
    
    // Mutations
    convertSpeciesMutation,
    
    // Utility functions
    searchSpecies,
    getSpeciesById,
    searchBioluminescentSpecies,
    convertWormsToBioluminescentSpecies,
    fetchBioluminescentSpeciesFromWorms,
  };
};

// Example usage in a component:
/*
import { useWormsSpecies } from '~/hooks/useWormsSpecies';

function SpeciesExplorer() {
  const { 
    searchSpeciesQuery, 
    convertedSpeciesQuery,
    convertSpeciesMutation 
  } = useWormsSpecies();
  
  const [searchTerm, setSearchTerm] = useState('');
  const searchResults = searchSpeciesQuery(searchTerm);
  const bioluminescentSpecies = convertedSpeciesQuery;
  
  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for marine species..."
      />
      
      {searchResults.data && (
        <div>
          <h3>Search Results:</h3>
          {searchResults.data.map(species => (
            <div key={species.AphiaID}>
              <h4>{species.scientificname}</h4>
              <p>Status: {species.status}</p>
              <button 
                onClick={() => convertSpeciesMutation.mutate(species)}
                disabled={convertSpeciesMutation.isPending}
              >
                {convertSpeciesMutation.isPending ? 'Converting...' : 'Convert to Bioluminescent Species'}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {bioluminescentSpecies.data && (
        <div>
          <h3>Bioluminescent Species from WORMS:</h3>
          {bioluminescentSpecies.data.map(species => (
            <div key={species.AphiaID}>
              <h4>{species.commonName || species.scientificname}</h4>
              <p>Light Color: {species.lightColor}</p>
              <p>Pattern: {species.lightPattern}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/
