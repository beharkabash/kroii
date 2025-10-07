import { resend, FROM_EMAIL, CONTACT_EMAIL } from './resend-client';
import { ContactNotificationEmail } from './templates/contact-notification';
import { AutoResponderEmail } from './templates/auto-responder';
import { render } from '@react-email/render';
import { createElement } from 'react';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  carInterest?: string;
  leadScore?: number;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends email with exponential backoff retry logic
 */
async function sendWithRetry(
  emailFn: () => Promise<unknown>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<EmailResult> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await emailFn() as { id?: string; messageId?: string };
      return {
        success: true,
        messageId: result.id || result.messageId || 'unknown',
      };
    } catch (error) {
      lastError = error as Error;
      console.error(`Email send attempt ${attempt + 1} failed:`, error);

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to send email after retries',
  };
}

/**
 * Sends contact notification email to business
 */
export async function sendContactNotification(
  data: ContactFormData
): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured. Skipping email notification.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    const timestamp = new Date().toISOString();

    const emailHtml = await render(
      createElement(ContactNotificationEmail, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        carInterest: data.carInterest,
        timestamp,
        leadScore: data.leadScore,
      })
    );

    return await sendWithRetry(async () => {
      if (!resend) {
        throw new Error('Resend client not initialized');
      }
      return await resend.emails.send({
        from: FROM_EMAIL,
        to: CONTACT_EMAIL,
        subject: data.carInterest
          ? `Uusi yhteydenotto: ${data.name} - Kiinnostus: ${data.carInterest}`
          : `Uusi yhteydenotto: ${data.name}`,
        html: emailHtml,
        replyTo: data.email,
        tags: [
          { name: 'type', value: 'contact-notification' },
          { name: 'lead-score', value: data.leadScore?.toString() || '0' },
        ],
      });
    });
  } catch (error) {
    console.error('Error in sendContactNotification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sends auto-responder email to customer
 */
export async function sendAutoResponder(
  data: Pick<ContactFormData, 'name' | 'email' | 'carInterest'>
): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured. Skipping auto-responder.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    const emailHtml = await render(
      createElement(AutoResponderEmail, {
        name: data.name,
        carInterest: data.carInterest,
      })
    );

    return await sendWithRetry(async () => {
      if (!resend) {
        throw new Error('Resend client not initialized');
      }
      return await resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        subject: 'Kiitos yhteydenotostasi - Kroi Auto Center',
        html: emailHtml,
        replyTo: CONTACT_EMAIL,
        tags: [
          { name: 'type', value: 'auto-responder' },
        ],
      });
    });
  } catch (error) {
    console.error('Error in sendAutoResponder:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Sends newsletter subscription confirmation
 */
export async function sendNewsletterConfirmation(
  email: string,
  name?: string
): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured. Skipping newsletter confirmation.');
    return {
      success: false,
      error: 'Email service not configured',
    };
  }

  try {
    const displayName = name || 'arvokas asiakas';

    return await sendWithRetry(async () => {
      if (!resend) {
        throw new Error('Resend client not initialized');
      }
      return await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Tervetuloa Kroi Auto Center uutiskirjeelle!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">Tervetuloa!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
              <p>Hei ${displayName},</p>
              <p>Kiitos, että tilasit Kroi Auto Center uutiskirjeen! Saat nyt:</p>
              <ul>
                <li>Tiedot uusista autoista ensimmäisten joukossa</li>
                <li>Erikoistarjoukset ja kampanjat</li>
                <li>Autovinkkit ja huoltoneuvot</li>
              </ul>
              <p style="margin-top: 20px;">
                <a href="https://kroiautocenter.fi" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Tutustu autoihimme
                </a>
              </p>
            </div>
          </div>
        `,
        replyTo: CONTACT_EMAIL,
        tags: [
          { name: 'type', value: 'newsletter-confirmation' },
        ],
      });
    });
  } catch (error) {
    console.error('Error in sendNewsletterConfirmation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}