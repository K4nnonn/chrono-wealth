/**
 * Global Event Bus for Financial Intelligence Platform
 * Handles time propagation and insight acknowledgment
 */

type EventCallback = (data: any) => void;

interface EventBus {
  on: (event: string, callback: EventCallback) => void;
  emit: (event: string, data?: any) => void;
  off: (event: string, callback: EventCallback) => void;
}

class PlatformEventBus implements EventBus {
  private events: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event: string, data?: any): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }

  off(event: string, callback: EventCallback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

// Global event bus instance
export const eventBus = new PlatformEventBus();

// Event types
export const EVENTS = {
  PROPAGATE_TIME: 'PROPAGATE_TIME',
  SURFACE_INSIGHT: 'SURFACE_INSIGHT',
  ACKNOWLEDGE_INSIGHT: 'ACKNOWLEDGE_INSIGHT',
} as const;

export type TimeHorizon = 1 | 3 | 5 | 10;
export type InsightPolarity = 'positive' | 'negative' | 'neutral';

export interface InsightData {
  id: string;
  text: string;
  significance: number;
  polarity: InsightPolarity;
  formula?: string;
  variables?: Record<string, number>;
  acknowledged?: boolean;
}