import { BioluminescentSpecies } from '~/types';

// Image service interfaces
interface ImageSource {
  url: string;
  license: string;
  author: string;
  source: string;
}

// Multiple image sources for redundancy
export class SpeciesImageService {
  private static readonly UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  private static readonly PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

  // Primary method to get species images
  static async getSpeciesImages(species: BioluminescentSpecies): Promise<ImageSource[]> {
    try {
      // Try multiple sources in order of preference. Wikipedia goes first —
      // verified against all 8 mock species: correctly-matched photos for
      // 6/8, CORS-enabled (Access-Control-Allow-Origin: *), no API key
      // needed. GBIF only has media for a minority of species (1/8 in the
      // same check) but costs nothing to also try. EOL and a generic
      // "fallback" stock photo were removed — EOL's classic API returns
      // zero images for every species tested (a dead API, not a CORS
      // artifact), and a fallback that shows an unrelated ocean-wave photo
      // is actively misleading, worse than showing no photo at all.
      const sources = [
        () => this.getWikipediaImage(species),
        () => this.getGBIFImages(species),
        () => this.getUnsplashImages(species),
        () => this.getPexelsImages(species),
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

  // Wikipedia REST API summary endpoint — CORS-enabled, no key required.
  // Returns at most one image (the article's lead photo), but it's
  // reliably the correct species.
  private static async getWikipediaImage(species: BioluminescentSpecies): Promise<ImageSource[]> {
    try {
      const title = encodeURIComponent(species.scientificname);
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const thumbnail = data.thumbnail?.source || data.originalimage?.source;

      if (!thumbnail) {
        return [];
      }

      return [
        {
          url: thumbnail,
          license: 'See Wikipedia article for license',
          author: 'Wikipedia contributors',
          source: 'Wikipedia',
        },
      ];
    } catch (error) {
      console.warn('Wikipedia API failed:', error);
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
