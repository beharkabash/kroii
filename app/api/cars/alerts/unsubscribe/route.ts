import { NextRequest, NextResponse } from 'next/server';
import { InventoryAlertsService } from '@/app/lib/features/inventory-alerts';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsubscribe token is required',
        },
        { status: 400 }
      );
    }

    const alertId = InventoryAlertsService.verifyUnsubscribeToken(token);
    if (!alertId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired unsubscribe token',
        },
        { status: 400 }
      );
    }

    const success = await InventoryAlertsService.deactivateAlert(alertId);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to unsubscribe from alert',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Olet peruuttanut tilauksen onnistuneesti',
    });
  } catch (error) {
    console.error('Error unsubscribing from alert:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Tilauksen peruuttaminen epäonnistui',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Virhe - Kroi Auto Center</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1>Virhe</h1>
          <p class="error">Puuttuva tai virheellinen linkki.</p>
          <a href="https://kroiautocenter.fi">Takaisin etusivulle</a>
        </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    const alertId = InventoryAlertsService.verifyUnsubscribeToken(token);
    if (!alertId) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Virhe - Kroi Auto Center</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1>Virhe</h1>
          <p class="error">Virheellinen tai vanhentunut linkki.</p>
          <a href="https://kroiautocenter.fi">Takaisin etusivulle</a>
        </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    const success = await InventoryAlertsService.deactivateAlert(alertId);
    if (!success) {
      return new Response(
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Virhe - Kroi Auto Center</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1>Virhe</h1>
          <p class="error">Tilauksen peruuttaminen epäonnistui.</p>
          <a href="https://kroiautocenter.fi">Takaisin etusivulle</a>
        </body>
        </html>`,
        {
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Tilaus peruutettu - Kroi Auto Center</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .success { color: #28a745; }
          .btn { background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <h1>Tilaus peruutettu</h1>
        <p class="success">Olet onnistuneesti peruuttanut autojen ilmoitushälytyksen.</p>
        <p>Et saa enää sähköpostihälytyksiä uusista autoista.</p>
        <a href="https://kroiautocenter.fi" class="btn">Takaisin etusivulle</a>
      </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Error in unsubscribe GET:', error);
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Virhe - Kroi Auto Center</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
          .error { color: #dc3545; }
        </style>
      </head>
      <body>
        <h1>Virhe</h1>
        <p class="error">Palvelinvirhe. Yritä myöhemmin uudelleen.</p>
        <a href="https://kroiautocenter.fi">Takaisin etusivulle</a>
      </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}