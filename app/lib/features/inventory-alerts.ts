/**
 * Inventory Alerts Module
 * Manage inventory notifications and alerts
 */

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'new_arrival' | 'price_drop' | 'back_in_stock';
  carId: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface AlertPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  types: string[];
}

class InventoryAlertsService {
  private alerts: InventoryAlert[] = [];
  private subscribers = new Map<string, AlertPreferences>();

  /**
   * Subscribe to inventory alerts
   */
  subscribe(userId: string, preferences: AlertPreferences): void {
    this.subscribers.set(userId, preferences);
  }

  /**
   * Unsubscribe from alerts
   */
  unsubscribe(userId: string): void {
    this.subscribers.delete(userId);
  }

  /**
   * Create a new alert
   */
  createAlert(alert: Omit<InventoryAlert, 'id' | 'createdAt' | 'read'>): InventoryAlert {
    const newAlert: InventoryAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false
    };

    this.alerts.push(newAlert);
    this.notifySubscribers(newAlert);
    return newAlert;
  }

  /**
   * Get alerts for a specific car
   */
  getAlertsForCar(carId: string): InventoryAlert[] {
    return this.alerts.filter(alert => alert.carId === carId);
  }

  /**
   * Get unread alerts count
   */
  getUnreadCount(): number {
    return this.alerts.filter(alert => !alert.read).length;
  }

  /**
   * Mark alert as read
   */
  markAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
    }
  }

  /**
   * Mark all alerts as read
   */
  markAllAsRead(): void {
    this.alerts.forEach(alert => {
      alert.read = true;
    });
  }

  /**
   * Notify subscribers about new alert
   */
  private notifySubscribers(alert: InventoryAlert): void {
    this.subscribers.forEach((preferences, userId) => {
      if (preferences.types.includes(alert.type)) {
        // In real app, send notifications based on preferences
        console.log(`Notifying user ${userId} about alert:`, alert.message);
      }
    });
  }

  /**
   * Clean up old alerts
   */
  cleanup(daysOld: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const initialLength = this.alerts.length;
    this.alerts = this.alerts.filter(alert => alert.createdAt > cutoffDate);

    return initialLength - this.alerts.length;
  }
}

export const inventoryAlerts = new InventoryAlertsService();

export default inventoryAlerts;