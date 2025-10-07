import { resend, FROM_EMAIL, CONTACT_EMAIL } from './resend-client';

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

    // Use simple HTML template to avoid React Email Html component conflicts
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Uusi Yhteydenottopyyntö</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          ${data.leadScore && data.leadScore >= 70 ? `
            <div style="background: #10b981; color: white; padding: 10px 15px; border-radius: 6px; margin-bottom: 20px; text-align: center; font-weight: bold;">
              🔥 Korkea-arvoinen liidi (Score: ${data.leadScore}/100)
            </div>
          ` : ''}
          <h2 style="color: #9333ea; margin-top: 0;">Asiakkaan tiedot</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; font-weight: bold; width: 30%;">Nimi:</td><td style="padding: 10px 0;">${data.name}</td></tr>
            <tr><td style="padding: 10px 0; font-weight: bold;">Sähköposti:</td><td style="padding: 10px 0;"><a href="mailto:${data.email}" style="color: #9333ea;">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding: 10px 0; font-weight: bold;">Puhelin:</td><td style="padding: 10px 0;"><a href="tel:${data.phone}" style="color: #9333ea;">${data.phone}</a></td></tr>` : ''}
            ${data.carInterest ? `<tr><td style="padding: 10px 0; font-weight: bold;">Kiinnostuksen kohde:</td><td style="padding: 10px 0; color: #ec4899; font-weight: bold;">${data.carInterest}</td></tr>` : ''}
            <tr><td style="padding: 10px 0; font-weight: bold;">Aika:</td><td style="padding: 10px 0;">${new Date(timestamp).toLocaleString('fi-FI')}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
            <h3 style="color: #9333ea; margin-top: 0;">Viesti:</h3>
            <p style="white-space: pre-wrap; margin: 0;">${data.message}</p>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>Kroi Auto Center Oy | Läkkisepäntie 15 B 300620, Helsinki</p>
          <p>kroiautocenter@gmail.com | +358 41 3188214</p>
        </div>
      </div>
    `;

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
    // Use simple HTML template to avoid React Email Html component conflicts
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Kiitos yhteydenotostasi!</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; margin-top: 0;">Hei ${data.name},</p>
          <p style="font-size: 16px;">Kiitos, että otit meihin yhteyttä! Olemme saaneet viestisi ja otamme sinuun yhteyttä mahdollisimman pian, yleensä 24 tunnin sisällä.</p>
          ${data.carInterest ? `
            <div style="background: white; padding: 20px; border-radius: 6px; border: 2px solid #9333ea; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 16px;">Olet kiinnostunut autosta: <strong style="color: #9333ea;">${data.carInterest}</strong></p>
            </div>
          ` : ''}
          <h2 style="color: #9333ea; font-size: 20px;">Miksi valita Kroi Auto Center?</h2>
          <div style="margin-bottom: 20px;">
            <div style="margin-bottom: 15px; padding-left: 25px; position: relative;">
              <span style="position: absolute; left: 0; color: #ec4899;">✓</span>
              <strong>Yli 15 vuoden kokemus</strong> autojen myynnistä ja ostosta
            </div>
            <div style="margin-bottom: 15px; padding-left: 25px; position: relative;">
              <span style="position: absolute; left: 0; color: #ec4899;">✓</span>
              <strong>Laadukkaita ja tarkastettuja</strong> käytettyjä autoja
            </div>
            <div style="margin-bottom: 15px; padding-left: 25px; position: relative;">
              <span style="position: absolute; left: 0; color: #ec4899;">✓</span>
              <strong>Henkilökohtaista ja joustavaa</strong> palvelua
            </div>
            <div style="margin-bottom: 15px; padding-left: 25px; position: relative;">
              <span style="position: absolute; left: 0; color: #ec4899;">✓</span>
              <strong>Luotettava perheyritys</strong> Helsingissä
            </div>
          </div>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://kroiautocenter.fi" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Tutustu autoihimme
            </a>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>Kroi Auto Center Oy | Läkkisepäntie 15 B 300620, Helsinki<br/>kroiautocenter@gmail.com | +358 41 3188214</p>
        </div>
      </div>
    `;

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