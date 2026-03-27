/**
 * Runtime environment validation.
 * Import this at the top of API routes to fail fast on missing config.
 */

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Check your .env.local file.`
    );
  }
  return value;
}

export function getEnvConfig() {
  return {
    openaiApiKey: requireEnv("OPENAI_API_KEY"),
    supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseServiceKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}
