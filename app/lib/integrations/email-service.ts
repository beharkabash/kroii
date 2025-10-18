/**
 * Email service stub
 * Provides interface without actual email functionality
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export class EmailService {
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    console.log('Email service stub - would send email:', {
      to: options.to,
      subject: options.subject,
      from: options.from || 'noreply@kroiauto.fi'
    });
    // Return true to indicate success (stub implementation)
    return true;
  }

  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Kroi Auto Center',
      text: `Welcome ${name}! Thank you for joining us.`
    });
  }

  static async sendNewsletterEmail(emails: string[], subject: string, content: string): Promise<boolean> {
    return this.sendEmail({
      to: emails,
      subject,
      html: content
    });
  }

  static async sendNotificationEmail(email: string, subject: string, message: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject,
      text: message
    });
  }

  static async sendNewsletterConfirmation(email: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Newsletter Subscription Confirmed',
      text: 'Thank you for subscribing to our newsletter!'
    });
  }

  static async notifyMatchingAlerts(matches: unknown[]): Promise<boolean> {
    console.log('Email service stub - would notify matching alerts:', matches);
    return true;
  }
}

export default EmailService;