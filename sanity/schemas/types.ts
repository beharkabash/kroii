/**
 * Sanity type definitions for schemas
 */

export interface SanityRule {
  required(): SanityRule;
  email(): SanityRule;
  min(length: number): SanityRule;
  max(length: number): SanityRule;
  custom<T>(validator: (value: T) => true | string): SanityRule;
}