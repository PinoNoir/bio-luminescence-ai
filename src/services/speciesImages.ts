import { BioluminescentSpecies } from '~/types';

// Image service interfaces
interface ImageSource {
  url: string;
  license: string;
  author: string;
  source: string;
}

interface ImageSearchResult {
  images: ImageSource[];
  total: number;
  source: string;
}

// Multiple image sources for redundancy
export class SpeciesImageService {
  private static readonly UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  private static readonly PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

  // Primary method to get species images
  static async getSpeciesImages(species: BioluminescentSpecies): Promise<ImageSource[]> {
    try {
      // Try multiple sources in order of preference
      const sources = [
        () => this.getEOLImages(species),
        () => this.getGBIFImages(species),
        () => this.getUnsplashImages(species),
        () => this.getPexelsImages(species),
        () => this.getFallbackImages(species)
      ];

      for (const source of sources) {
        try {
          const images = await source();
          if (images && images.length > 0) {
            return images;
          }
        } catch (error) {
          console.warn(`Image source failed:`, error);
          continue;
        }
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch species images:', error);
      return [];
    }
  }

  // Encyclopedia of Life API (Free, high-quality)
  private static async getEOLImages(species: BioluminescentSpecies): Promise<ImageSource[]> {
    try {
      // Search EOL by scientific name
      const searchUrl = `https://eol.org/api/search/1.0.json?q=${encodeURIComponent(species.scientificname)}&page=1&exact=true`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData.results || searchData.results.length === 0) {
        return [];
      }

      const eolId = searchData.results[0].id;
      
      // Get images for the species
      const imagesUrl = `https://eol.org/api/pages/1.0/${eolId}.json?images=1&videos=0&sounds=0&maps=0&text=0&iucn=false&subjects=overview&licenses=all&details=true&common_names=0&synonyms=0&references=0&vetted=0`;
      const imagesResponse = await fetch(imagesUrl);
      const imagesData = await imagesResponse.json();

      if (!imagesData.dataObjects) {
        return [];
      }

      return imagesData.dataObjects
        .filter((obj: any) => obj.dataType === 'http://purl.org/dc/dcmitype/StillImage')
        .map((obj: any) => ({
          url: obj.contentURL || obj.eolThumbnailURL,
          license: obj.license || 'Unknown',
          author: obj.rightsHolder || 'Unknown',
          source: 'Encyclopedia of Life'
        }))
        .slice(0, 5); // Limit to 5 images
    } catch (error) {
      console.warn('EOL API failed:', error);
      return [];
    }
  }

  // GBIF API (Global Biodiversity Information Facility)
  private static async getGBIFImages(species: BioluminescentSpecies): Promise<ImageSource[]> {
    try {
      const searchUrl = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(species.scientificname)}`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData.usageKey) {
        return [];
      }

      // Get media for the species
      const mediaUrl = `https://api.gbif.org/v1/species/${searchData.usageKey}/media?limit=5`;
      const mediaResponse = await fetch(mediaUrl);
      const mediaData = await mediaResponse.json();

      if (!mediaData.results) {
        return [];
      }

      return mediaData.results
        .filter((item: any) => item.type === 'StillImage')
        .map((item: any) => ({
          url: item.identifier,
          license: item.license || 'Unknown',
          author: item.creator || 'Unknown',
          source: 'GBIF'
        }));
    } catch (error) {
      console.warn('GBIF API failed:', error);
      return [];
    }
  }

  // Unsplash API (High-quality stock photos)
  private static async getUnsplashImages(species: BioluminescentSpecies): Promise<ImageSource[]> {
    if (!this.UNSPLASH_ACCESS_KEY) {
      return [];
    }

    try {
      // Search for marine/ocean related terms
      const searchTerms = [
        species.commonName,
        'marine biology',
        'ocean life',
        'bioluminescent',
        'jellyfish',
        'deep sea'
      ].filter(Boolean);

      const searchTerm = searchTerms[0] || 'marine biology';
      const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&orientation=landscape&per_page=5`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Client-ID ${this.UNSPLASH_ACCESS_KEY}`
        }
      });

      const data = await response.json();

      if (!data.results) {
        return [];
      }

      return data.results.map((photo: any) => ({
        url: photo.urls.regular,
        license: 'Unsplash License',
        author: photo.user.name,
        source: 'Unsplash'
      }));
    } catch (error) {
      console.warn('Unsplash API failed:', error);
      return [];
    }
  }

  // Pexels API (Alternative free stock photos)
  private static async getPexelsImages(species: BioluminescentSpecies): Promise<ImageSource[]> {
    if (!this.PEXELS_API_KEY) {
      return [];
    }

    try {
      const searchTerm = species.commonName || species.scientificname;
      const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=5`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': this.PEXELS_API_KEY
        }
      });

      const data = await response.json();

      if (!data.photos) {
        return [];
      }

      return data.photos.map((photo: any) => ({
        url: photo.src.medium,
        license: 'Pexels License',
        author: photo.photographer,
        source: 'Pexels'
      }));
    } catch (error) {
      console.warn('Pexels API failed:', error);
      return [];
    }
  }

  // Fallback to curated marine images
  private static async getFallbackImages(species: BioluminescentSpecies): Promise<ImageSource[]> {
    // Curated collection of marine life images
    const fallbackImages = [
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        license: 'Unsplash',
        author: 'Unsplash',
        source: 'Fallback'
      },
      {
        url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
        license: 'Unsplash',
        author: 'Unsplash',
        source: 'Fallback'
      }
    ];

    return fallbackImages;
  }

  // Get a single best image for a species
  static async getBestSpeciesImage(species: BioluminescentSpecies): Promise<ImageSource | null> {
    const images = await this.getSpeciesImages(species);
    return images.length > 0 ? images[0] : null;
  }

  // Search for images by scientific name
  static async searchImagesByScientificName(scientificName: string): Promise<ImageSource[]> {
    const mockSpecies = {
      scientificname: scientificName,
      commonName: scientificName
    } as BioluminescentSpecies;

    return this.getSpeciesImages(mockSpecies);
  }
}

// Convenience functions
export const getSpeciesImages = (species: BioluminescentSpecies) => 
  SpeciesImageService.getSpeciesImages(species);

export const getBestSpeciesImage = (species: BioluminescentSpecies) => 
  SpeciesImageService.getBestSpeciesImage(species);

export const searchImagesByScientificName = (scientificName: string) => 
  SpeciesImageService.searchImagesByScientificName(scientificName);
