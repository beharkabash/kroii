import { InventoryAlert, InventoryAlertsService } from './inventory-alerts';

interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  priceEur: number;
  kmNumber: number;
  fuel: string;
  transmission: string;
  category?: string;
  description?: string;
  images?: Array<{ url: string; alt?: string }>;
}

export class EmailService {
  private static readonly FROM_EMAIL = process.env.SMTP_FROM || 'noreply@kroiautocenter.fi';
  private static readonly SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
  private static readonly SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
  private static readonly SMTP_USER = process.env.SMTP_USER;
  private static readonly SMTP_PASS = process.env.SMTP_PASS;
  private static readonly SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kroiautocenter.fi';

  /**
   * Send inventory alert email to a subscriber
   */
  static async sendInventoryAlert(alert: InventoryAlert, car: Car): Promise<boolean> {
    try {
      if (!this.SMTP_USER || !this.SMTP_PASS) {
        console.warn('SMTP credentials not configured, skipping email notification');
        return false;
      }

      const nodemailer = await import('nodemailer');

      const transporter = nodemailer.createTransport({
        host: this.SMTP_HOST,
        port: this.SMTP_PORT,
        secure: this.SMTP_PORT === 465,
        auth: {
          user: this.SMTP_USER,
          pass: this.SMTP_PASS,
        },
      });

      const unsubscribeToken = InventoryAlertsService.generateUnsubscribeToken(alert.id);
      const unsubscribeUrl = `${this.SITE_URL}/api/alerts/unsubscribe?token=${unsubscribeToken}`;
      const carUrl = `${this.SITE_URL}/cars/${car.slug}`;
      const mainImageUrl = car.images?.[0]?.url || `${this.SITE_URL}/cars/placeholder.jpg`;

      const emailHtml = this.generateAlertEmailHtml({
        alert,
        car,
        carUrl,
        unsubscribeUrl,
        mainImageUrl,
      });

      const mailOptions = {
        from: `"Kroi Auto Center" <${this.FROM_EMAIL}>`,
        to: alert.email,
        subject: `Uusi auto: ${car.brand} ${car.model} ${car.year}`,
        html: emailHtml,
        text: this.generateAlertEmailText({
          alert,
          car,
          carUrl,
          unsubscribeUrl,
        }),
      };

      await transporter.sendMail(mailOptions);

      // Mark alert as notified
      await InventoryAlertsService.markAlertNotified(alert.id);

      return true;
    } catch (error) {
      console.error('Error sending inventory alert email:', error);
      return false;
    }
  }

  /**
   * Generate HTML email content for inventory alert
   */
  private static generateAlertEmailHtml({
    alert,
    car,
    carUrl,
    unsubscribeUrl,
    mainImageUrl,
  }: {
    alert: InventoryAlert;
    car: Car;
    carUrl: string;
    unsubscribeUrl: string;
    mainImageUrl: string;
  }): string {
    const criteria = InventoryAlertsService.formatAlertCriteria(alert);

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Uusi auto - Kroi Auto Center</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #9333ea; color: white; padding: 20px; text-align: center; }
        .content { background: white; padding: 20px; }
        .car-image { width: 100%; max-width: 400px; height: 250px; object-fit: cover; border-radius: 8px; }
        .car-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .price { font-size: 24px; font-weight: bold; color: #9333ea; }
        .btn { background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 10px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .unsubscribe { font-size: 11px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚗 Uusi auto saatavilla!</h1>
          <p>Kriteerisi täyttävä auto on tullut myyntiin</p>
        </div>

        <div class="content">
          <p>Hei ${alert.name || ''},</p>

          <p>Sinulle on löytynyt sopiva auto kriteereiden perusteella:</p>
          <p><strong>${criteria}</strong></p>

          <div style="text-align: center;">
            <img src="${mainImageUrl}" alt="${car.brand} ${car.model}" class="car-image">
          </div>

          <div class="car-details">
            <h2>${car.brand} ${car.model} ${car.year}</h2>
            <div class="price">${car.priceEur.toLocaleString('fi-FI')} €</div>

            <div style="margin-top: 15px;">
              <p><strong>Vuosimalli:</strong> ${car.year}</p>
              <p><strong>Ajettu:</strong> ${car.kmNumber.toLocaleString('fi-FI')} km</p>
              <p><strong>Polttoaine:</strong> ${car.fuel}</p>
              <p><strong>Vaihteisto:</strong> ${car.transmission}</p>
              ${car.category ? `<p><strong>Korimalli:</strong> ${car.category}</p>` : ''}
            </div>

            ${car.description ? `<p style="margin-top: 15px;"><strong>Kuvaus:</strong> ${car.description.substring(0, 200)}${car.description.length > 200 ? '...' : ''}</p>` : ''}
          </div>

          <div style="text-align: center;">
            <a href="${carUrl}" class="btn">Katso auto</a>
          </div>

          <p>Kiitos kun käytät Kroi Auto Centerin palveluja!</p>
          <p>Terveisin,<br>Kroi Auto Center</p>
        </div>

        <div class="footer">
          <p>Kroi Auto Center - Laadukkaita käytettyjä autoja Helsingissä</p>
          <p>📍 Käyntiosoite: Helsingin keskusta</p>
          <p>📧 info@kroiautocenter.fi | 📞 +358 XX XXX XXXX</p>

          <div class="unsubscribe">
            <p>Et halua enää vastaanottaa autoilmoituksia?</p>
            <a href="${unsubscribeUrl}" style="color: #999;">Peruuta tilaus</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Generate plain text email content for inventory alert
   */
  private static generateAlertEmailText({
    alert,
    car,
    carUrl,
    unsubscribeUrl,
  }: {
    alert: InventoryAlert;
    car: Car;
    carUrl: string;
    unsubscribeUrl: string;
  }): string {
    const criteria = InventoryAlertsService.formatAlertCriteria(alert);

    return `
Uusi auto saatavilla - Kroi Auto Center

Hei ${alert.name || ''},

Sinulle on löytynyt sopiva auto kriteereiden perusteella:
${criteria}

Auto:
${car.brand} ${car.model} ${car.year}
Hinta: ${car.priceEur.toLocaleString('fi-FI')} €
Vuosimalli: ${car.year}
Ajettu: ${car.kmNumber.toLocaleString('fi-FI')} km
Polttoaine: ${car.fuel}
Vaihteisto: ${car.transmission}
${car.category ? `Korimalli: ${car.category}` : ''}

${car.description ? `Kuvaus: ${car.description.substring(0, 300)}${car.description.length > 300 ? '...' : ''}` : ''}

Katso auto: ${carUrl}

Kiitos kun käytät Kroi Auto Centerin palveluja!

Terveisin,
Kroi Auto Center

---
Kroi Auto Center - Laadukkaita käytettyjä autoja Helsingissä
Käyntiosoite: Helsingin keskusta
Email: info@kroiautocenter.fi
Puhelin: +358 XX XXX XXXX

Et halua enää vastaanottaa autoilmoituksia?
Peruuta tilaus: ${unsubscribeUrl}
    `.trim();
  }

  /**
   * Send notifications for a new car to all matching alerts
   */
  static async notifyMatchingAlerts(car: Car): Promise<number> {
    try {
      const matchingAlerts = await InventoryAlertsService.findMatchingAlerts(car);
      let sentCount = 0;

      for (const alert of matchingAlerts) {
        const success = await this.sendInventoryAlert(alert, car);
        if (success) {
          sentCount++;
        }

        // Add small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (sentCount > 0) {
        console.log(`Sent ${sentCount} inventory alert emails for car: ${car.brand} ${car.model}`);
      }

      return sentCount;
    } catch (error) {
      console.error('Error notifying matching alerts:', error);
      return 0;
    }
  }
}

export default EmailService;