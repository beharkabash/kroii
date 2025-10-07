import * as React from 'react';

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
  carInterest?: string;
  timestamp: string;
  leadScore?: number;
}

export const ContactNotificationEmail: React.FC<ContactNotificationEmailProps> = ({
  name,
  email,
  phone,
  message,
  carInterest,
  timestamp,
  leadScore,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
          padding: '30px',
          borderRadius: '8px 8px 0 0',
          textAlign: 'center'
        }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
            Uusi Yhteydenottopyyntö
          </h1>
        </div>

        <div style={{
          background: '#f9fafb',
          padding: '30px',
          borderRadius: '0 0 8px 8px',
          border: '1px solid #e5e7eb'
        }}>
          {leadScore && leadScore >= 70 && (
            <div style={{
              background: '#10b981',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '6px',
              marginBottom: '20px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              🔥 Korkea-arvoinen liidi (Score: {leadScore}/100)
            </div>
          )}

          <h2 style={{ color: '#9333ea', marginTop: 0 }}>Asiakkaan tiedot</h2>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ padding: '10px 0', fontWeight: 'bold', width: '30%' }}>Nimi:</td>
              <td style={{ padding: '10px 0' }}>{name}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px 0', fontWeight: 'bold' }}>Sähköposti:</td>
              <td style={{ padding: '10px 0' }}>
                <a href={`mailto:${email}`} style={{ color: '#9333ea' }}>{email}</a>
              </td>
            </tr>
            {phone && (
              <tr>
                <td style={{ padding: '10px 0', fontWeight: 'bold' }}>Puhelin:</td>
                <td style={{ padding: '10px 0' }}>
                  <a href={`tel:${phone}`} style={{ color: '#9333ea' }}>{phone}</a>
                </td>
              </tr>
            )}
            {carInterest && (
              <tr>
                <td style={{ padding: '10px 0', fontWeight: 'bold' }}>Kiinnostuksen kohde:</td>
                <td style={{ padding: '10px 0', color: '#ec4899', fontWeight: 'bold' }}>{carInterest}</td>
              </tr>
            )}
            <tr>
              <td style={{ padding: '10px 0', fontWeight: 'bold' }}>Aika:</td>
              <td style={{ padding: '10px 0' }}>{new Date(timestamp).toLocaleString('fi-FI')}</td>
            </tr>
          </table>

          <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ color: '#9333ea', marginTop: 0 }}>Viesti:</h3>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{message}</p>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <a
              href={`mailto:${email}?subject=Re: Yhteydenottopyyntö - Kroi Auto Center`}
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                marginRight: '10px'
              }}
            >
              Vastaa sähköpostilla
            </a>
            {phone && (
              <a
                href={`https://wa.me/${phone.replace(/[^0-9+]/g, '')}?text=Hei ${name}! Kiitos yhteydenotostasi Kroi Auto Centeriin.`}
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: '#10b981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                Vastaa WhatsAppilla
              </a>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '12px' }}>
          <p>Kroi Auto Center Oy | Läkkisepäntie 15 B 300620, Helsinki</p>
          <p>kroiautocenter@gmail.com | +358 41 3188214</p>
        </div>
      </div>
    </body>
  </html>
);

export default ContactNotificationEmail;