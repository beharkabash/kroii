import * as React from 'react';

interface AutoResponderEmailProps {
  name: string;
  carInterest?: string;
}

export const AutoResponderEmail: React.FC<AutoResponderEmailProps> = ({
  name,
  carInterest,
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
          <h1 style={{ color: 'white', margin: 0, fontSize: '28px' }}>
            Kiitos yhteydenotostasi!
          </h1>
        </div>

        <div style={{
          background: '#f9fafb',
          padding: '30px',
          borderRadius: '0 0 8px 8px',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '16px', marginTop: 0 }}>Hei {name},</p>

          <p style={{ fontSize: '16px' }}>
            Kiitos, että otit meihin yhteyttä! Olemme saaneet viestisi ja otamme sinuun yhteyttä
            mahdollisimman pian, yleensä 24 tunnin sisällä.
          </p>

          {carInterest && (
            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '6px',
              border: '2px solid #9333ea',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>
                Olet kiinnostunut autosta: <strong style={{ color: '#9333ea' }}>{carInterest}</strong>
              </p>
            </div>
          )}

          <h2 style={{ color: '#9333ea', fontSize: '20px' }}>Miksi valita Kroi Auto Center?</h2>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px', paddingLeft: '25px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#ec4899' }}>✓</span>
              <strong>Yli 15 vuoden kokemus</strong> autojen myynnistä ja ostosta
            </div>
            <div style={{ marginBottom: '15px', paddingLeft: '25px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#ec4899' }}>✓</span>
              <strong>Laadukkaita ja tarkastettuja</strong> käytettyjä autoja
            </div>
            <div style={{ marginBottom: '15px', paddingLeft: '25px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#ec4899' }}>✓</span>
              <strong>Henkilökohtaista ja joustavaa</strong> palvelua
            </div>
            <div style={{ marginBottom: '15px', paddingLeft: '25px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#ec4899' }}>✓</span>
              <strong>Luotettava perheyritys</strong> Helsingissä
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            marginTop: '20px'
          }}>
            <h3 style={{ color: '#9333ea', marginTop: 0, fontSize: '18px' }}>Ota yhteyttä heti</h3>
            <p style={{ margin: '10px 0' }}>
              <strong>Puhelin:</strong><br />
              <a href="tel:+358413188214" style={{ color: '#9333ea', textDecoration: 'none' }}>
                +358 41 3188214
              </a><br />
              <a href="tel:+358442423508" style={{ color: '#9333ea', textDecoration: 'none' }}>
                +358 44 2423508
              </a>
            </p>
            <p style={{ margin: '10px 0' }}>
              <strong>WhatsApp:</strong><br />
              <a href="https://wa.me/358413188214" style={{ color: '#10b981', textDecoration: 'none' }}>
                Lähetä meille viesti WhatsAppilla
              </a>
            </p>
            <p style={{ margin: '10px 0' }}>
              <strong>Osoite:</strong><br />
              Läkkisepäntie 15 B 300620<br />
              Helsinki, Finland
            </p>
            <p style={{ margin: '10px 0' }}>
              <strong>Aukioloajat:</strong><br />
              MA-PE: 10:00 - 18:00<br />
              LA: 11:00 - 17:00<br />
              SU: Suljettu
            </p>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <a
              href="https://kroiautocenter.fi"
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 'bold'
              }}
            >
              Tutustu autoihimme
            </a>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '12px' }}>
          <p>Seuraa meitä sosiaalisessa mediassa:</p>
          <p>
            <a href="https://www.facebook.com/people/Kroi-Auto-Center-Oy/61561550627512/" style={{ color: '#9333ea', textDecoration: 'none', margin: '0 10px' }}>
              Facebook
            </a>
            |
            <a href="https://www.instagram.com/kroiautocenteroy" style={{ color: '#ec4899', textDecoration: 'none', margin: '0 10px' }}>
              Instagram
            </a>
          </p>
          <p style={{ marginTop: '10px' }}>
            Kroi Auto Center Oy | Läkkisepäntie 15 B 300620, Helsinki<br />
            kroiautocenter@gmail.com | +358 41 3188214
          </p>
        </div>
      </div>
    </body>
  </html>
);

export default AutoResponderEmail;