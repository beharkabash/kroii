import { z } from 'zod';

/**
 * Input validation schemas using Zod
 * Provides type-safe validation and sanitization
 */

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nimi on liian lyhyt (vähintään 2 merkkiä)')
    .max(100, 'Nimi on liian pitkä (enintään 100 merkkiä)')
    .regex(/^[a-zA-ZäöåÄÖÅ\s'-]+$/, 'Nimi sisältää virheellisiä merkkejä')
    .transform((val) => val.trim()),

  email: z
    .string()
    .email('Virheellinen sähköpostiosoite')
    .min(5, 'Sähköpostiosoite on liian lyhyt')
    .max(255, 'Sähköpostiosoite on liian pitkä')
    .toLowerCase()
    .transform((val) => val.trim()),

  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        // Finnish phone number format: +358 or 0 followed by 9-10 digits
        const phoneRegex = /^(\+358|0)[1-9]\d{7,9}$/;
        return phoneRegex.test(val.replace(/[\s-]/g, ''));
      },
      { message: 'Virheellinen puhelinnumero' }
    )
    .transform((val) => val?.trim().replace(/[\s-]/g, '')),

  message: z
    .string()
    .min(10, 'Viesti on liian lyhyt (vähintään 10 merkkiä)')
    .max(5000, 'Viesti on liian pitkä (enintään 5000 merkkiä)')
    .transform((val) => val.trim()),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Newsletter subscription validation schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Virheellinen sähköpostiosoite')
    .min(5, 'Sähköpostiosoite on liian lyhyt')
    .max(255, 'Sähköpostiosoite on liian pitkä')
    .toLowerCase()
    .transform((val) => val.trim()),

  name: z
    .string()
    .min(2, 'Nimi on liian lyhyt (vähintään 2 merkkiä)')
    .max(100, 'Nimi on liian pitkä (enintään 100 merkkiä)')
    .optional()
    .transform((val) => val?.trim()),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .trim();
}

/**
 * Sanitize string for safe display
 * More aggressive than sanitizeHtml, suitable for user-generated content
 */
export function sanitizeString(input: string): string {
  if (!input) return '';

  return input
    .replace(/[<>'"&]/g, (char) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[char] || char;
    })
    .trim();
}

/**
 * Validate and sanitize environment variables
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL: z.string().email().default('kroiautocenter@gmail.com'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().positive()).default('10'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default('60000'),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate email format (additional check)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check for SQL injection patterns (defense in depth)
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bOR\b|\bAND\b).*[=<>]/i,
    /UNION.*SELECT/i,
    /INSERT.*INTO/i,
    /UPDATE.*SET/i,
    /DELETE.*FROM/i,
    /DROP.*TABLE/i,
    /CREATE.*TABLE/i,
    /ALTER.*TABLE/i,
    /EXEC.*\(/i,
    /EXECUTE.*\(/i,
    /--/,
    /\/\*/,
    /xp_/i,
    /sp_/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Check for XSS patterns
 */
export function containsXss(input: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Comprehensive input validation
 * Returns true if input is safe, false if potentially malicious
 */
export function isInputSafe(input: string): boolean {
  if (!input) return true;

  return !containsSqlInjection(input) && !containsXss(input);
}

/**
 * Validate request body size
 * Prevents DoS attacks via large payloads
 */
export function validateBodySize(body: unknown, maxSizeBytes: number = 100000): boolean {
  const bodyString = JSON.stringify(body);
  const sizeInBytes = new Blob([bodyString]).size;
  return sizeInBytes <= maxSizeBytes;
}