/**
 * Email service stub (alternate path)
 * Provides interface without actual email functionality
 */

export {
  EmailService as default,
  EmailService,
  EmailOptions
} from '@/app/lib/integrations/email-service';

// Re-export specific methods for compatibility
import { EmailService } from '@/app/lib/integrations/email-service';
export const sendNewsletterConfirmation = EmailService.sendNewsletterConfirmation;