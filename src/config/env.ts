/**
 * Environment variable validation and type-safe access
 */

function getEnvVar(key: string, required: boolean = true): string {
    const value = process.env[key];

    if (!value && required) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value || '';
}

/**
 * Validated environment variables
 * This ensures all required env vars are present at build/runtime
 */
export const env = {
    // Public (client-side accessible)
    supabase: {
        url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
        anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    },

    // Server-side only
    kit19: {
        api: getEnvVar('KIT19_API', false),
        auth: getEnvVar('KIT19_AUTH', false),
    },

    supabaseServiceKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', false),

    // Optional
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
} as const;

/**
 * Validate environment on app startup
 */
export function validateEnv() {
    try {
        // Access env object to trigger validation
        const _ = env.supabase.url;
        console.log('✅ Environment variables validated');
    } catch (error) {
        console.error('❌ Environment validation failed:', error);
        if (env.isProduction) {
            throw error;
        }
    }
}
