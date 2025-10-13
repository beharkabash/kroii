'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [_isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Check if PWA is installed
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setUpdateAvailable(true);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  // Don't show anything if online and no updates
  if (isOnline && !updateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 mb-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Ei yhteyttä</span>
        </div>
      )}

      {updateAvailable && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Download className="h-4 w-4" />
            <span className="text-sm font-medium">Päivitys saatavilla</span>
          </div>
          <button
            onClick={handleUpdate}
            className="text-xs bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            Päivitä nyt
          </button>
        </div>
      )}

      {isOnline && !updateAvailable && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <Wifi className="h-4 w-4" />
          <span className="text-sm font-medium">Online</span>
        </div>
      )}
    </div>
  );
}