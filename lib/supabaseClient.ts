import { createClient } from './supabase/client'

// Singleton instance of the Supabase client for client-side use
export const supabase = createClient()
