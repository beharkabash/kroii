import { prisma } from './db/prisma';
import { inventory_alerts } from '@prisma/client';

export interface AlertCriteria {
  vehicleMake?: string;
  vehicleModel?: string;
  maxPrice?: number;
  minYear?: number;
  maxMileage?: number;
  bodyType?: string;
  fuelType?: string;
}

interface Car {
  brand?: string;
  model?: string;
  priceEur: number;
  year: number;
  fuel?: string;
  kmNumber?: number;
  category?: string;
}

export interface InventoryAlert {
  id: string;
  email: string;
  name?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  maxPrice?: number;
  minYear?: number;
  maxMileage?: number;
  bodyType?: string;
  fuelType?: string;
  isActive: boolean;
  createdAt: Date;
  lastNotified?: Date;
  notificationCount: number;
}

export class InventoryAlertsService {
  /**
   * Create a new inventory alert subscription
   */
  static async createAlert(data: {
    email: string;
    name?: string;
    criteria: AlertCriteria;
  }): Promise<InventoryAlert> {
    try {
      const alert = await prisma.inventory_alerts.create({
        data: {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: data.email.toLowerCase().trim(),
          name: data.name?.trim(),
          vehicleMake: data.criteria.vehicleMake,
          vehicleModel: data.criteria.vehicleModel,
          maxPrice: data.criteria.maxPrice,
          minYear: data.criteria.minYear,
          maxMileage: data.criteria.maxMileage,
          bodyType: data.criteria.bodyType,
          fuelType: data.criteria.fuelType,
          isActive: true,
          createdAt: new Date(),
          notificationCount: 0,
        },
      });

      return {
        id: alert.id,
        email: alert.email,
        name: alert.name || undefined,
        vehicleMake: alert.vehicleMake || undefined,
        vehicleModel: alert.vehicleModel || undefined,
        maxPrice: alert.maxPrice || undefined,
        minYear: alert.minYear || undefined,
        maxMileage: alert.maxMileage || undefined,
        bodyType: alert.bodyType || undefined,
        fuelType: alert.fuelType || undefined,
        isActive: alert.isActive,
        createdAt: alert.createdAt,
        lastNotified: alert.lastNotified || undefined,
        notificationCount: alert.notificationCount,
      };
    } catch (error) {
      console.error('Error creating inventory alert:', error);
      throw new Error('Failed to create inventory alert');
    }
  }

  /**
   * Get all active alerts
   */
  static async getActiveAlerts(): Promise<InventoryAlert[]> {
    try {
      const alerts = await prisma.inventory_alerts.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      return alerts.map((alert: inventory_alerts) => ({
        id: alert.id,
        email: alert.email,
        name: alert.name || undefined,
        vehicleMake: alert.vehicleMake || undefined,
        vehicleModel: alert.vehicleModel || undefined,
        maxPrice: alert.maxPrice || undefined,
        minYear: alert.minYear || undefined,
        maxMileage: alert.maxMileage || undefined,
        bodyType: alert.bodyType || undefined,
        fuelType: alert.fuelType || undefined,
        isActive: alert.isActive,
        createdAt: alert.createdAt,
        lastNotified: alert.lastNotified || undefined,
        notificationCount: alert.notificationCount,
      }));
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      return [];
    }
  }

  /**
   * Get alerts for a specific email
   */
  static async getAlertsByEmail(email: string): Promise<InventoryAlert[]> {
    try {
      const alerts = await prisma.inventory_alerts.findMany({
        where: {
          email: email.toLowerCase().trim(),
          isActive: true
        },
        orderBy: { createdAt: 'desc' },
      });

      return alerts.map((alert: inventory_alerts) => ({
        id: alert.id,
        email: alert.email,
        name: alert.name || undefined,
        vehicleMake: alert.vehicleMake || undefined,
        vehicleModel: alert.vehicleModel || undefined,
        maxPrice: alert.maxPrice || undefined,
        minYear: alert.minYear || undefined,
        maxMileage: alert.maxMileage || undefined,
        bodyType: alert.bodyType || undefined,
        fuelType: alert.fuelType || undefined,
        isActive: alert.isActive,
        createdAt: alert.createdAt,
        lastNotified: alert.lastNotified || undefined,
        notificationCount: alert.notificationCount,
      }));
    } catch (error) {
      console.error('Error fetching alerts by email:', error);
      return [];
    }
  }

  /**
   * Update alert notification tracking
   */
  static async markAlertNotified(alertId: string): Promise<void> {
    try {
      await prisma.inventory_alerts.update({
        where: { id: alertId },
        data: {
          lastNotified: new Date(),
          notificationCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      console.error('Error updating alert notification:', error);
    }
  }

  /**
   * Deactivate/unsubscribe an alert
   */
  static async deactivateAlert(alertId: string): Promise<boolean> {
    try {
      await prisma.inventory_alerts.update({
        where: { id: alertId },
        data: { isActive: false },
      });
      return true;
    } catch (error) {
      console.error('Error deactivating alert:', error);
      return false;
    }
  }

  /**
   * Check if a car matches alert criteria
   */
  static matchesCriteria(car: Car, alert: InventoryAlert): boolean {
    // Vehicle make check
    if (alert.vehicleMake && car.brand?.toLowerCase() !== alert.vehicleMake.toLowerCase()) {
      return false;
    }

    // Vehicle model check
    if (alert.vehicleModel && car.model?.toLowerCase() !== alert.vehicleModel.toLowerCase()) {
      return false;
    }

    // Price check
    if (alert.maxPrice && car.priceEur > alert.maxPrice) {
      return false;
    }

    // Year check
    if (alert.minYear && car.year < alert.minYear) {
      return false;
    }

    // Fuel type check
    if (alert.fuelType && car.fuel?.toLowerCase() !== alert.fuelType.toLowerCase()) {
      return false;
    }

    // Body type check (using category as body type)
    if (alert.bodyType && car.category?.toLowerCase() !== alert.bodyType.toLowerCase()) {
      return false;
    }

    // Mileage check
    if (alert.maxMileage && car.kmNumber && car.kmNumber > alert.maxMileage) {
      return false;
    }

    return true;
  }

  /**
   * Find matching alerts for a new car
   */
  static async findMatchingAlerts(car: Car): Promise<InventoryAlert[]> {
    const activeAlerts = await this.getActiveAlerts();

    return activeAlerts.filter(alert =>
      this.matchesCriteria(car, alert)
    );
  }

  /**
   * Format alert criteria for display
   */
  static formatAlertCriteria(alert: InventoryAlert): string {
    const parts: string[] = [];

    if (alert.vehicleMake) {
      parts.push(`Merkki: ${alert.vehicleMake}`);
    }

    if (alert.vehicleModel) {
      parts.push(`Malli: ${alert.vehicleModel}`);
    }

    if (alert.bodyType) {
      parts.push(`Korimalli: ${alert.bodyType}`);
    }

    if (alert.maxPrice) {
      parts.push(`Enintään: ${alert.maxPrice.toLocaleString('fi-FI')}€`);
    }

    if (alert.minYear) {
      parts.push(`Vähintään: ${alert.minYear}`);
    }

    if (alert.fuelType) {
      parts.push(`Polttoaine: ${alert.fuelType}`);
    }

    if (alert.maxMileage) {
      parts.push(`Enintään: ${alert.maxMileage.toLocaleString('fi-FI')} km`);
    }

    return parts.length > 0 ? parts.join(', ') : 'Kaikki autot';
  }

  /**
   * Generate unsubscribe token
   */
  static generateUnsubscribeToken(alertId: string): string {
    // In production, use proper JWT or secure token generation
    return Buffer.from(`${alertId}:${Date.now()}`).toString('base64');
  }

  /**
   * Verify unsubscribe token
   */
  static verifyUnsubscribeToken(token: string): string | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [alertId] = decoded.split(':');
      return alertId;
    } catch (error) {
      return null;
    }
  }
}

export default InventoryAlertsService;