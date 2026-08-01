// PROTOTYPE — wipe me. Shared draft shape for ticket 11
// (.scratch/bio-glow/issues/11-species-entry-form-ui.md).
import { BioluminescenceType, BioluminescentSpecies } from '~/types';

export interface SpeciesDraft {
  aphiaId: number | null;
  scientificname: string;
  authority: string;
  rank: string;
  commonName: string;
  bioluminescenceType: BioluminescenceType[];
  depthMin: number | '';
  depthMax: number | '';
  depthZone: BioluminescentSpecies['depthRange']['zone'];
  lightColor: string;
  lightPattern: BioluminescentSpecies['lightPattern'];
  habitat: string;
  diet: string;
  sizeLength: number | '';
  sizeUnit: BioluminescentSpecies['size']['unit'];
  funFacts: string[];
}

export const emptyDraft: SpeciesDraft = {
  aphiaId: null,
  scientificname: '',
  authority: '',
  rank: '',
  commonName: '',
  bioluminescenceType: [],
  depthMin: '',
  depthMax: '',
  depthZone: 'twilight',
  lightColor: '#00E5FF',
  lightPattern: 'pulsing',
  habitat: '',
  diet: '',
  sizeLength: '',
  sizeUnit: 'cm',
  funFacts: [],
};

export function draftFromSpecies(species: BioluminescentSpecies): SpeciesDraft {
  return {
    aphiaId: species.AphiaID,
    scientificname: species.scientificname,
    authority: species.authority,
    rank: species.rank,
    commonName: species.commonName,
    bioluminescenceType: species.bioluminescenceType,
    depthMin: species.depthRange.min,
    depthMax: species.depthRange.max,
    depthZone: species.depthRange.zone,
    lightColor: species.lightColor,
    lightPattern: species.lightPattern,
    habitat: species.habitat,
    diet: species.diet,
    sizeLength: species.size.length,
    sizeUnit: species.size.unit,
    funFacts: species.funFacts,
  };
}

export const BIOLUMINESCENCE_OPTIONS = Object.values(BioluminescenceType);

export const LIGHT_COLOR_SWATCHES = ['#00E5FF', '#76FF03', '#E91E63', '#9C27B0', '#00BCD4', '#FF9800'];
