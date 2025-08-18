import { supabase } from '../services/supabase';

export const fetchPost = async (postId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error('Post not found');
    }
    throw error;
  }

  return data;
};

export const fetchPosts = async () => {
  const { data, error } = await supabase.from("posts").select("*");

  if (error) {
    throw error;
  }

  return data;
};
