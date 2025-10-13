/**
 * PWA Utilities for Kroi Auto Center
 */

export interface PWAInstallPrompt extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export class PWAManager {
  private static installPrompt: PWAInstallPrompt | null = null;

  static init() {
    if (typeof window === 'undefined') return;

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e as PWAInstallPrompt;
    });

    // Register service worker
    this.registerServiceWorker();

    // Handle app updates
    this.handleAppUpdates();
  }

  static async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, inform user
                this.showUpdateNotification();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  static handleAppUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  static async promptInstall(): Promise<boolean> {
    if (!this.installPrompt) {
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const result = await this.installPrompt.userChoice;
      this.installPrompt = null;
      return result.outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  }

  static isInstalled(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as { standalone?: boolean }).standalone === true;
  }

  static isInstallable(): boolean {
    return this.installPrompt !== null;
  }

  static getInstallPrompt(): PWAInstallPrompt | null {
    return this.installPrompt;
  }

  private static showUpdateNotification() {
    // This could trigger a custom notification component
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Kroi Auto Center', {
        body: 'Uusi versio on saatavilla. Päivitä selain nähdäksesi uudet ominaisuudet.',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'app-update'
      });
    }
  }

  static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async sendNotification(title: string, options: NotificationOptions) {
    if (await this.requestNotificationPermission()) {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options
      });
    }
  }

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static onOnlineStatusChange(callback: (isOnline: boolean) => void) {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }

  static async cacheImportantPages() {
    if ('caches' in window) {
      const cache = await caches.open('kroi-auto-v1');
      const urlsToCache = [
        '/',
        '/cars',
        '/contact',
        '/offline',
        '/icon-192.png',
        '/icon-512.png'
      ];

      await cache.addAll(urlsToCache);
    }
  }

  static clearCache() {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  PWAManager.init();
}