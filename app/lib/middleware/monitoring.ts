/**
 * Monitoring middleware stub
 * Provides interface without actual monitoring functionality
 */

export interface MonitoringEvent {
  name: string;
  data?: any;
  timestamp?: Date;
}

export class MonitoringService {
  static async trackEvent(event: MonitoringEvent): Promise<void> {
    console.log('Monitoring stub - would track event:', event);
    return;
  }

  static async trackApiCall(endpoint: string, method: string, duration: number, statusCode: number): Promise<void> {
    console.log('Monitoring stub - would track API call:', {
      endpoint,
      method,
      duration,
      statusCode
    });
    return;
  }

  static async trackError(error: Error, context?: any): Promise<void> {
    console.error('Monitoring stub - would track error:', error, context);
    return;
  }
}

export function withMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
) {
  return async (...args: T): Promise<R> => {
    const start = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - start;
      await MonitoringService.trackEvent({
        name: `${name}_success`,
        data: { duration }
      });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      await MonitoringService.trackError(error as Error, { name, duration });
      throw error;
    }
  };
}

// Legacy exports for compatibility
export const APIMonitoring = {
  ...MonitoringService,
  withMonitoring: <T extends (...args: any[]) => any>(fn: T, name?: string): T => {
    // Return the function as-is for stub implementation
    return fn;
  }
};
export const HealthMonitoring = MonitoringService;

export default MonitoringService;