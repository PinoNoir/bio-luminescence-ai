import { AphiaRecord } from '~/types';

// WORMS API base URL
const WORMS_API_BASE = 'https://www.marinespecies.org/rest';

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

    // WoRMS returns 204 No Content for zero-result queries on some endpoints
    // (e.g. distributions) — a real "success, nothing found", not an error.
    if (response.status === 204) {
      return [] as unknown as T;
    }

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

// AphiaRecordsByName returns 404 (not 204) when nothing matches — a real
// "no results", not an error, unlike a 404 on an ID-keyed endpoint.
const searchByName = async (query: string): Promise<AphiaRecord[]> => {
  const endpoint = `/AphiaRecordsByName/${encodeURIComponent(query)}?like=true&marine_only=true`;
  try {
    return await wormsApiRequest<AphiaRecord[]>(endpoint);
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return [];
    }
    throw error;
  }
};

// Search for species by name
export const searchSpecies = searchByName;

// Get species by AphiaID
export const getSpeciesById = async (aphiaId: number): Promise<AphiaRecord> => {
  const endpoint = `/AphiaRecordByAphiaID/${aphiaId}`;
  return wormsApiRequest<AphiaRecord>(endpoint);
};

// Get species by scientific name
export const getSpeciesByName = searchByName;

// Get vernacular names (common names) for a species
export const getVernacularNames = async (aphiaId: number): Promise<any[]> => {
  const endpoint = `/AphiaVernacularsByAphiaID/${aphiaId}`;
  return wormsApiRequest<any[]>(endpoint);
};

// Get distribution data for a species
export const getDistribution = async (aphiaId: number): Promise<any[]> => {
  const endpoint = `/AphiaDistributionsByAphiaID/${aphiaId}`;
  return wormsApiRequest<any[]>(endpoint);
};

// Get external links and references
export const getExternalLinks = async (aphiaId: number): Promise<any[]> => {
  const endpoint = `/AphiaExternalIDByAphiaID/${aphiaId}?type=lsid`;
  return wormsApiRequest<any[]>(endpoint);
};

// Get classification (taxonomy tree)
export const getClassification = async (aphiaId: number): Promise<any> => {
  const endpoint = `/AphiaClassificationByAphiaID/${aphiaId}`;
  return wormsApiRequest<any>(endpoint);
};

