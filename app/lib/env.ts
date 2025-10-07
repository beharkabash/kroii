import { z } from 'zod';

/**
 * Environment variable validation schema
 * Validates and provides type-safe access to environment variables
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith('G-') || val.startsWith('UA-'),
      'Google Analytics ID must start with G- or UA-'
    ),

  // Email service (Resend)
  RESEND_API_KEY: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith('re_'),
      'Resend API key must start with re_'
    ),

  // Contact email
  CONTACT_EMAIL: z
    .string()
    .email('Must be a valid email address')
    .default('kroiautocenter@gmail.com'),

  // Rate limiting configuration
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().positive().max(1000)),

  RATE_LIMIT_WINDOW_MS: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 60000))
    .pipe(z.number().positive().max(600000)),

  // Security settings
  ENABLE_RATE_LIMITING: z
    .string()
    .optional()
    .transform((val) => val !== 'false')
    .pipe(z.boolean()),

  // API URLs (for production)
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .optional()
    .or(z.literal('')),

  // Vercel-specific variables (auto-populated in Vercel)
  VERCEL: z.string().optional(),
  VERCEL_ENV: z
    .enum(['production', 'preview', 'development'])
    .optional(),
  VERCEL_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and parse environment variables
 * Throws error if validation fails
 */
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      throw new Error(
        `Environment variable validation failed:\n${errors.join('\n')}`
      );
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * Use this instead of process.env for type safety and validation
 */
export const env = validateEnv();

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if running in test environment
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Check if deployed on Vercel
 */
export const isVercel = !!env.VERCEL;

/**
 * Get the application URL
 */
export function getAppUrl(): string {
  if (env.NEXT_PUBLIC_API_URL) {
    return env.NEXT_PUBLIC_API_URL;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  return isDevelopment ? 'http://localhost:3000' : 'https://kroiautocenter.fi';
}

/**
 * Log environment configuration (sanitized for security)
 * Only logs in development mode
 */
export function logEnvironment(): void {
  if (!isDevelopment) return;

  console.log('[ENV] Environment configuration:');
  console.log(`  NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  NEXT_PUBLIC_GA_MEASUREMENT_ID: ${env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'Set' : 'Not set'}`);
  console.log(`  RESEND_API_KEY: ${env.RESEND_API_KEY ? 'Set' : 'Not set'}`);
  console.log(`  CONTACT_EMAIL: ${env.CONTACT_EMAIL}`);
  console.log(`  RATE_LIMIT_MAX_REQUESTS: ${env.RATE_LIMIT_MAX_REQUESTS}`);
  console.log(`  RATE_LIMIT_WINDOW_MS: ${env.RATE_LIMIT_WINDOW_MS}`);
  console.log(`  ENABLE_RATE_LIMITING: ${env.ENABLE_RATE_LIMITING}`);
  console.log(`  App URL: ${getAppUrl()}`);
}