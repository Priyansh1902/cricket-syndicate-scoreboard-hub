
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config';

// Initialize with valid URL patterns to prevent runtime errors
// These will be replaced with real values when connecting to Supabase
const supabaseUrl = supabaseConfig.url;
const supabaseKey = supabaseConfig.anonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
