
// This file centralizes configuration variables for the app
// When connected to Supabase, environment variables will be used automatically

// Supabase configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key-that-is-long-enough-to-pass-validation',
};

// Match configuration
export const matchConfig = {
  maxOvers: 20,
  defaultOvers: 10,
};

// App configuration
export const appConfig = {
  appName: 'Cricket Syndicate',
  maxTeams: 10,
};
