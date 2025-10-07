/**
 * Lead Scoring System
 * Assigns a score 0-100 based on contact form data quality
 */

export interface LeadScoringData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  carInterest?: string;
}

export interface LeadScore {
  score: number;
  factors: Record<string, number>;
  quality: 'low' | 'medium' | 'high';
}

/**
 * Calculate lead score based on multiple factors
 */
export function calculateLeadScore(data: LeadScoringData): LeadScore {
  const factors: Record<string, number> = {};
  let totalScore = 0;

  // Phone number provided (20 points)
  if (data.phone && data.phone.trim().length > 0) {
    factors['phone_provided'] = 20;
    totalScore += 20;
  }

  // Email quality (10 points)
  const emailDomain = data.email.split('@')[1];
  const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  if (emailDomain && !freeEmailProviders.includes(emailDomain.toLowerCase())) {
    factors['business_email'] = 10;
    totalScore += 10;
  } else {
    factors['personal_email'] = 5;
    totalScore += 5;
  }

  // Name quality (10 points)
  const nameParts = data.name.trim().split(/\s+/);
  if (nameParts.length >= 2) {
    factors['full_name'] = 10;
    totalScore += 10;
  } else {
    factors['partial_name'] = 5;
    totalScore += 5;
  }

  // Message quality (30 points)
  const messageLength = data.message.trim().length;
  if (messageLength > 100) {
    factors['detailed_message'] = 30;
    totalScore += 30;
  } else if (messageLength > 50) {
    factors['medium_message'] = 20;
    totalScore += 20;
  } else if (messageLength > 20) {
    factors['short_message'] = 10;
    totalScore += 10;
  } else {
    factors['minimal_message'] = 5;
    totalScore += 5;
  }

  // Specific car interest (30 points)
  if (data.carInterest && data.carInterest.trim().length > 0) {
    factors['car_interest'] = 30;
    totalScore += 30;
  }

  // Message contains contact preference keywords (bonus 10 points)
  const urgentKeywords = ['nyt', 'heti', 'pian', 'kiireellinen', 'asap', 'tänään', 'huomenna'];
  const messageLower = data.message.toLowerCase();
  if (urgentKeywords.some(keyword => messageLower.includes(keyword))) {
    factors['urgent_contact'] = 10;
    totalScore += 10;
  }

  // Message contains purchase intent keywords (bonus 10 points)
  const intentKeywords = ['ostaa', 'ostamaan', 'osto', 'hankkia', 'rahoitus', 'vaihtoauto', 'koeajo'];
  if (intentKeywords.some(keyword => messageLower.includes(keyword))) {
    factors['purchase_intent'] = 10;
    totalScore += 10;
  }

  // Determine quality level
  let quality: 'low' | 'medium' | 'high';
  if (totalScore >= 70) {
    quality = 'high';
  } else if (totalScore >= 40) {
    quality = 'medium';
  } else {
    quality = 'low';
  }

  return {
    score: Math.min(totalScore, 100),
    factors,
    quality,
  };
}

/**
 * Format lead score for logging
 */
export function formatLeadScore(leadScore: LeadScore): string {
  const factorsStr = Object.entries(leadScore.factors)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return `Score: ${leadScore.score}/100 (${leadScore.quality}) - Factors: ${factorsStr}`;
}