import { AphiaRecord, Distribution, Vernacular, WoRMSApiResponse } from '~/types';

const WORMS_API_BASE = import.meta.env.VITE_WORMS_API_BASE || 'https://www.marinespecies.org/rest';

class WoRMSService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = WORMS_API_BASE;
  }

  // Core API methods
  async getSpeciesByName(scientificName: string): Promise<AphiaRecord[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/AphiaRecordsByName/${encodeURIComponent(scientificName)}?marine_only=true&extant_only=true`
      );
      
      if (!response.ok) {
        throw new Error(`WoRMS API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching species by name:', error);
      return [];
    }
  }

  async getSpeciesById(aphiaId: number): Promise<AphiaRecord | null> {
    try {
      const response = await fetch(`${this.baseUrl}/AphiaRecordByAphiaID/${aphiaId}`);
      
      if (!response.ok) {
        if (response.status === 204) return null;
        throw new Error(`WoRMS API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching species by ID:', error);
      return null;
    }
  }

  async getClassification(aphiaId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/AphiaClassificationByAphiaID/${aphiaId}`);
      
      if (!response.ok) {
        throw new Error(`WoRMS API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching classification:', error);
      return null;
    }
  }

  async getDistribution(aphiaId: number): Promise<Distribution[]> {
    try {
      const response = await fetch(`${this.baseUrl}/AphiaDistributionsByAphiaID/${aphiaId}`);
      
      if (!response.ok) {
        if (response.status === 204) return [];
        throw new Error(`WoRMS API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching distribution:', error);
      return [];
    }
  }

  async getVernaculars(aphiaId: number): Promise<Vernacular[]> {
    try {
      const response = await fetch(`${this.baseUrl}/AphiaVernacularsByAphiaID/${aphiaId}`);
      
      if (!response.ok) {
        if (response.status === 204) return [];
        throw new Error(`WoRMS API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching vernaculars:', error);
      return [];
    }
  }

  async getChildren(aphiaId: number): Promise<AphiaRecord[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/AphiaChildrenByAphiaID/${aphiaId}?marine_only=true&extant_only=true`
      );
      
      if (!response.ok) {
        if (response.status === 204) return [];
        throw new Error(`WoRMS API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching children:', error);
      return [];
    }
  }

  async getSynonyms(aphiaId: number): Promise<AphiaRecord[]> {
    try {
      const response = await fetch(`${this.baseUrl}/AphiaSynonymsByAphiaID/${aphiaId}`);
      
      if (!response.ok) {
        if (response.status === 204) return [];
        throw new Error(`WoRMS API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching synonyms:', error);
      return [];
    }
  }

  // Specialized methods for bioluminescent species
  async searchBioluminescentSpecies(): Promise<AphiaRecord[]> {
    const bioluminescentTerms = [
      'Pyrodinium',
      'Noctiluca',
      'Atolla',
      'Aequorea',
      'Periphylla',
      'Tomopteris',
      'Chaetopterus',
      'Odontosyllis',
      'Lingulodinium',
      'Alexandrium',
      'Pyrocystis',
      'Ceratium',
      'Gonyaulax',
      'Bioluminescent',
      'Photuris',
      'Photinus',
      'Lampyridae',
      'Anglerfish',
      'Lanternfish',
      'Hatchetfish',
      'Vampire squid',
      'Crystal jelly',
      'Atolla jellyfish',
      'Deep sea anglerfish',
      'Flashlight fish'
    ];

    const allResults: AphiaRecord[] = [];

    for (const term of bioluminescentTerms) {
      try {
        const results = await this.getSpeciesByName(term);
        allResults.push(...results);
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to fetch results for term: ${term}`, error);
      }
    }

    // Remove duplicates based on AphiaID
    const uniqueResults = allResults.filter((species, index, self) => 
      index === self.findIndex(s => s.AphiaID === species.AphiaID)
    );

    return uniqueResults;
  }

  async searchByTaxonomy(taxonomy: { 
    kingdom?: string; 
    phylum?: string; 
    class?: string; 
    order?: string; 
    family?: string; 
  }): Promise<AphiaRecord[]> {
    // This would require implementing a more complex search
    // For now, we'll search by family/order level
    if (taxonomy.family) {
      return this.getSpeciesByName(taxonomy.family);
    }
    if (taxonomy.order) {
      return this.getSpeciesByName(taxonomy.order);
    }
    return [];
  }

  // Batch operations
  async getMultipleSpecies(aphiaIds: number[]): Promise<AphiaRecord[]> {
    if (aphiaIds.length === 0) return [];
    
    try {
      const queryString = aphiaIds.map(id => `aphiaids[]=${id}`).join('&');
      const response = await fetch(`${this.baseUrl}/AphiaRecordsByAphiaIDs?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`WoRMS API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching multiple species:', error);
      return [];
    }
  }

  // Utility methods
  isMarineSpecies(species: AphiaRecord): boolean {
    return species.isMarine === true;
  }

  isExtinct(species: AphiaRecord): boolean {
    return species.isExtinct === true;
  }

  isValidSpecies(species: AphiaRecord): boolean {
    return species.status === 'accepted';
  }
}

export const wormsService = new WoRMSService();
export default wormsService;
