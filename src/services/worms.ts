import { AphiaRecord, BioluminescentSpecies, BioluminescenceType, WoRMSApiResponse } from '~/types';

// WORMS API base URL
const WORMS_API_BASE = 'https://www.marinespecies.org/rest/Aphia';

// Rate limiting - WORMS API has a limit of 100 requests per minute
let requestCount = 0;
let lastResetTime = Date.now();

const checkRateLimit = () => {
  const now = Date.now();
  if (now - lastResetTime >= 60000) { // 1 minute
    requestCount = 0;
    lastResetTime = now;
  }
  
  if (requestCount >= 95) { // Leave some buffer
    throw new Error('Rate limit approaching. Please wait before making more requests.');
  }
  
  requestCount++;
};

// Generic WORMS API request function
const wormsApiRequest = async <T>(endpoint: string): Promise<T> => {
  checkRateLimit();
  
  try {
    const response = await fetch(`${WORMS_API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`WORMS API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('WORMS API request failed:', error);
    throw error;
  }
};

// Search for species by name
export const searchSpecies = async (query: string): Promise<AphiaRecord[]> => {
  const endpoint = `/SearchByName/${encodeURIComponent(query)}?marine_only=true&offset=1`;
  return wormsApiRequest<AphiaRecord[]>(endpoint);
};

// Get species by AphiaID
export const getSpeciesById = async (aphiaId: number): Promise<AphiaRecord> => {
  const endpoint = `/${aphiaId}`;
  return wormsApiRequest<AphiaRecord>(endpoint);
};

// Get species by scientific name
export const getSpeciesByName = async (scientificName: string): Promise<AphiaRecord[]> => {
  const endpoint = `/SearchByName/${encodeURIComponent(scientificName)}?marine_only=true&offset=1`;
  return wormsApiRequest<AphiaRecord[]>(endpoint);
};

// Get vernacular names (common names) for a species
export const getVernacularNames = async (aphiaId: number): Promise<any[]> => {
  const endpoint = `/${aphiaId}/vernaculars`;
  return wormsApiRequest<any[]>(endpoint);
};

// Get distribution data for a species
export const getDistribution = async (aphiaId: number): Promise<any[]> => {
  const endpoint = `/${aphiaId}/distributions`;
  return wormsApiRequest<any[]>(endpoint);
};

// Get external links and references
export const getExternalLinks = async (aphiaId: number): Promise<any[]> => {
  const endpoint = `/${aphiaId}/external_identifiers`;
  return wormsApiRequest<any[]>(endpoint);
};

// Get classification (taxonomy tree)
export const getClassification = async (aphiaId: number): Promise<any> => {
  const endpoint = `/${aphiaId}/classification`;
  return wormsApiRequest<any>(endpoint);
};

// Search for bioluminescent species (using keywords)
export const searchBioluminescentSpecies = async (): Promise<AphiaRecord[]> => {
  // Search for common bioluminescent groups
  const bioluminescentGroups = [
    'Aequorea', 'Atolla', 'Periphylla', 'Beroe', 'Mnemiopsis',
    'Noctiluca', 'Pyrocystis', 'Ceratium', 'Gonyaulax', 'Lingulodinium'
  ];
  
  const results: AphiaRecord[] = [];
  
  for (const group of bioluminescentGroups) {
    try {
      const species = await searchSpecies(group);
      results.push(...species);
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.warn(`Failed to search for ${group}:`, error);
    }
  }
  
  // Remove duplicates and filter for accepted species
  const uniqueResults = results.filter((species, index, self) => 
    index === self.findIndex(s => s.AphiaID === species.AphiaID) &&
    species.status === 'accepted'
  );
  
  return uniqueResults;
};

// Convert WORMS API data to your BioluminescentSpecies format
export const convertWormsToBioluminescentSpecies = async (
  wormsRecord: AphiaRecord
): Promise<Partial<BioluminescentSpecies>> => {
  try {
    // Get additional data
    const [vernacularNames, distribution] = await Promise.all([
      getVernacularNames(wormsRecord.AphiaID),
      getDistribution(wormsRecord.AphiaID)
    ]);
    
    // Find English common name
    const englishName = vernacularNames?.find(v => v.language_code === 'en')?.vernacular || '';
    
    // Determine bioluminescence type based on taxonomy and common names
    const bioluminescenceType = determineBioluminescenceType(wormsRecord, englishName);
    
    // Estimate depth range based on distribution and taxonomy
    const depthRange = estimateDepthRange(wormsRecord, distribution);
    
    // Generate light color based on species characteristics
    const lightColor = generateLightColor(wormsRecord, bioluminescenceType);
    
    return {
      AphiaID: wormsRecord.AphiaID,
      url: wormsRecord.url,
      scientificname: wormsRecord.scientificname,
      authority: wormsRecord.authority,
      taxonRankID: wormsRecord.taxonRankID,
      rank: wormsRecord.rank,
      status: wormsRecord.status,
      commonName: englishName,
      bioluminescenceType,
      depthRange,
      lightColor,
      lightPattern: determineLightPattern(bioluminescenceType),
      habitat: generateHabitatDescription(wormsRecord, distribution),
      diet: estimateDiet(wormsRecord),
      size: estimateSize(wormsRecord),
      funFacts: generateFunFacts(wormsRecord, bioluminescenceType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error converting WORMS data:', error);
    throw error;
  }
};

// Helper functions to determine species characteristics
const determineBioluminescenceType = (
  record: AphiaRecord, 
  commonName: string
): BioluminescenceType[] => {
  const types: BioluminescenceType[] = [];
  
  // Check common names for bioluminescence indicators
  const bioluminescentKeywords = ['jelly', 'jellyfish', 'ctenophore', 'dinoflagellate'];
  const hasBioluminescentKeywords = bioluminescentKeywords.some(keyword => 
    commonName.toLowerCase().includes(keyword) || 
    record.scientificname.toLowerCase().includes(keyword)
  );
  
  if (hasBioluminescentKeywords) {
    // Jellyfish and ctenophores typically use photophores
    if (commonName.toLowerCase().includes('jelly') || record.scientificname.toLowerCase().includes('aequorea')) {
      types.push(BioluminescenceType.PHOTOPHORE);
    }
    
    // Deep sea species often use defensive flashing
    if (record.scientificname.toLowerCase().includes('atolla') || 
        record.scientificname.toLowerCase().includes('periphylla')) {
      types.push(BioluminescenceType.DEFENSIVE_FLASH);
    }
    
    // Dinoflagellates use luciferin-luciferase
    if (record.scientificname.toLowerCase().includes('noctiluca') || 
        record.scientificname.toLowerCase().includes('pyrocystis')) {
      types.push(BioluminescenceType.LUCIFERIN_LUCIFERASE);
    }
  }
  
  return types.length > 0 ? types : [BioluminescenceType.PHOTOPHORE];
};

const estimateDepthRange = (record: AphiaRecord, distribution: any[]): any => {
  // Default to surface waters, can be refined with distribution data
  return {
    min: 0,
    max: 200,
    unit: 'meters',
    zone: 'sunlight'
  };
};

const generateLightColor = (record: AphiaRecord, bioluminescenceType: BioluminescenceType[]): string => {
  // Generate colors based on bioluminescence type
  const colorMap: Record<BioluminescenceType, string> = {
    [BioluminescenceType.PHOTOPHORE]: '#00E5FF', // Blue
    [BioluminescenceType.DEFENSIVE_FLASH]: '#E91E63', // Pink
    [BioluminescenceType.LUCIFERIN_LUCIFERASE]: '#4CAF50', // Green
    [BioluminescenceType.BACTERIAL]: '#FF9800', // Orange
    [BioluminescenceType.COUNTER_ILLUMINATION]: '#9C27B0', // Purple
    [BioluminescenceType.COMMUNICATION]: '#2196F3', // Blue
    [BioluminescenceType.PREDATION]: '#F44336' // Red
  };
  
  return colorMap[bioluminescenceType[0]] || '#00E5FF';
};

const determineLightPattern = (bioluminescenceType: BioluminescenceType[]): 'steady' | 'pulsing' | 'flashing' | 'wave' => {
  if (bioluminescenceType.includes(BioluminescenceType.DEFENSIVE_FLASH)) {
    return 'flashing';
  }
  if (bioluminescenceType.includes(BioluminescenceType.COUNTER_ILLUMINATION)) {
    return 'steady';
  }
  return 'pulsing';
};

const generateHabitatDescription = (record: AphiaRecord, distribution: any[]): string => {
  return 'Marine waters, specific habitat details available from distribution data';
};

const estimateDiet = (record: AphiaRecord): string => {
  return 'Small plankton and organic matter';
};

const estimateSize = (record: AphiaRecord): any => {
  return {
    length: 15,
    unit: 'cm'
  };
};

const generateFunFacts = (record: AphiaRecord, bioluminescenceType: BioluminescenceType[]): string[] => {
  const facts = [
    `Scientific name: ${record.scientificname}`,
    `Taxonomic rank: ${record.rank}`,
    `Marine species: ${record.isMarine ? 'Yes' : 'No'}`
  ];
  
  if (bioluminescenceType.length > 0) {
    facts.push(`Bioluminescence type: ${bioluminescenceType.join(', ')}`);
  }
  
  return facts;
};

// Example usage function
export const fetchBioluminescentSpeciesFromWorms = async (): Promise<Partial<BioluminescentSpecies>[]> => {
  try {
    const wormsSpecies = await searchBioluminescentSpecies();
    const convertedSpecies: Partial<BioluminescentSpecies>[] = [];
    
    for (const species of wormsSpecies.slice(0, 10)) { // Limit to 10 for demo
      try {
        const converted = await convertWormsToBioluminescentSpecies(species);
        convertedSpecies.push(converted);
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`Failed to convert species ${species.AphiaID}:`, error);
      }
    }
    
    return convertedSpecies;
  } catch (error) {
    console.error('Failed to fetch species from WORMS:', error);
    throw error;
  }
};
