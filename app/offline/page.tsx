'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Car, Phone, Mail } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle redirect when user comes back online
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (isOnline) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="h-8 w-8 text-green-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Yhteys palautettu!
          </h1>
          <p className="text-gray-600 mb-6">
            Internet-yhteys on taas käytettävissä. Siirrymme takaisin sivustolle...
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Ladataan...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="h-8 w-8 text-orange-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Ei internet-yhteyttä
        </h1>

        <p className="text-gray-600 mb-8">
          Näyttää siltä, että internet-yhteys on katkennut. Tarkista yhteys ja yritä uudelleen.
        </p>

        <div className="space-y-4 mb-8">
          <button
            onClick={handleReload}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Yritä uudelleen</span>
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Car className="h-5 w-5" />
            <span>Etusivulle</span>
          </button>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Voit myös ottaa yhteyttä suoraan:
          </h3>

          <div className="space-y-3">
            <a
              href="tel:+358501234567"
              className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>+358 50 123 4567</span>
            </a>

            <a
              href="mailto:info@kroiautocenter.fi"
              className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>info@kroiautocenter.fi</span>
            </a>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500">
          <p>Kroi Auto Center</p>
          <p>Laadukkaita käytettyjä autoja Helsingissä</p>
        </div>
      </div>
    </div>
  );
}