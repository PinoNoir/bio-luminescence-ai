import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ywpslgjwvjjrauxzxisc.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

export const supabaseServer = createClient(supabaseUrl, supabaseKey!)

// For client-side usage, we'll use the client from services/supabase.ts
// This file is kept for any server-side operations that might be needed
// but simplified to remove SSR dependencies
