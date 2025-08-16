import { createClient } from '@supabase/supabase-js';
import type { 
  BioluminescentSpecies, 
  LearningModule, 
  UserProgress, 
  InteractiveExperience,
  SupabaseResponse 
} from '~/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

class SupabaseService {
  // Species management
  async getAllSpecies(): Promise<BioluminescentSpecies[]> {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .order('scientific_name');

    if (error) {
      console.error('Error fetching species:', error);
      return [];
    }

    return data || [];
  }

  async getSpeciesById(id: string): Promise<BioluminescentSpecies | null> {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching species by ID:', error);
      return null;
    }

    return data;
  }

  async getSpeciesByDepth(minDepth: number, maxDepth: number): Promise<BioluminescentSpecies[]> {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .gte('depth_range->min', minDepth)
      .lte('depth_range->max', maxDepth)
      .order('depth_range->min');

    if (error) {
      console.error('Error fetching species by depth:', error);
      return [];
    }

    return data || [];
  }

  async getSpeciesByBioluminescenceType(type: string): Promise<BioluminescentSpecies[]> {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .contains('bioluminescence_type', [type]);

    if (error) {
      console.error('Error fetching species by bioluminescence type:', error);
      return [];
    }

    return data || [];
  }

  async createSpecies(species: Omit<BioluminescentSpecies, 'id' | 'createdAt' | 'updatedAt'>): Promise<BioluminescentSpecies | null> {
    const { data, error } = await supabase
      .from('species')
      .insert([
        {
          ...species,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating species:', error);
      return null;
    }

    return data;
  }

  async updateSpecies(id: string, updates: Partial<BioluminescentSpecies>): Promise<BioluminescentSpecies | null> {
    const { data, error } = await supabase
      .from('species')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating species:', error);
      return null;
    }

    return data;
  }

  async deleteSpecies(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('species')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting species:', error);
      return false;
    }

    return true;
  }

  // Learning modules
  async getAllLearningModules(): Promise<LearningModule[]> {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('*')
      .order('difficulty_level', { ascending: true });

    if (error) {
      console.error('Error fetching learning modules:', error);
      return [];
    }

    return data || [];
  }

  async getLearningModuleById(id: string): Promise<LearningModule | null> {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching learning module:', error);
      return null;
    }

    return data;
  }

  async getLearningModulesByDifficulty(level: number): Promise<LearningModule[]> {
    const { data, error } = await supabase
      .from('learning_modules')
      .select('*')
      .eq('difficulty_level', level)
      .order('title');

    if (error) {
      console.error('Error fetching modules by difficulty:', error);
      return [];
    }

    return data || [];
  }

  async createLearningModule(module: Omit<LearningModule, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningModule | null> {
    const { data, error } = await supabase
      .from('learning_modules')
      .insert([
        {
          ...module,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating learning module:', error);
      return null;
    }

    return data;
  }

  // User progress tracking
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }

    return data || [];
  }

  async getUserProgressForModule(userId: string, moduleId: string): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .single();

    if (error) {
      console.error('Error fetching module progress:', error);
      return null;
    }

    return data;
  }

  async updateUserProgress(userId: string, moduleId: string, progress: Partial<UserProgress>): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          module_id: moduleId,
          ...progress,
          last_accessed_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,module_id'
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error updating user progress:', error);
      return null;
    }

    return data;
  }

  // Interactive experiences
  async getInteractiveExperiences(speciesId?: string): Promise<InteractiveExperience[]> {
    let query = supabase
      .from('interactive_experiences')
      .select('*');

    if (speciesId) {
      query = query.eq('species_id', speciesId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interactive experiences:', error);
      return [];
    }

    return data || [];
  }

  async createInteractiveExperience(experience: Omit<InteractiveExperience, 'id' | 'createdAt'>): Promise<InteractiveExperience | null> {
    const { data, error } = await supabase
      .from('interactive_experiences')
      .insert([
        {
          ...experience,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating interactive experience:', error);
      return null;
    }

    return data;
  }

  // Search functionality
  async searchSpecies(query: string): Promise<BioluminescentSpecies[]> {
    const { data, error } = await supabase
      .from('species')
      .select('*')
      .or(`scientific_name.ilike.%${query}%,common_name.ilike.%${query}%,habitat.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching species:', error);
      return [];
    }

    return data || [];
  }

  // Real-time subscriptions
  subscribeToSpeciesUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('species-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'species'
        },
        callback
      )
      .subscribe();
  }

  subscribeToUserProgress(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-progress-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  // Authentication helpers
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }

    return user;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      return false;
    }

    return true;
  }

  // File storage for 3D models and media
  async uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;
