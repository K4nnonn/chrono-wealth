// Compliance and audit utilities for enterprise requirements

import { logError, trackMetric } from './monitoring';
import { sanitizeInput } from './security';

export interface AuditEvent {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
}

class AuditLogger {
  private events: AuditEvent[] = [];
  private maxEvents = 1000;

  log(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
    };

    // Sanitize sensitive data
    if (auditEvent.metadata) {
      auditEvent.metadata = this.sanitizeMetadata(auditEvent.metadata);
    }

    this.events.push(auditEvent);
    
    // Keep only recent events in memory
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Track metrics
    trackMetric(`audit_event_${event.action}`, 1, {
      sensitivity: event.sensitivity,
      resource: event.resource,
    });

    // Log critical events immediately
    if (event.sensitivity === 'critical') {
      console.warn('CRITICAL AUDIT EVENT:', auditEvent);
    }

    // In production, send to audit service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAuditService(auditEvent);
    }
  }

  private sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sanitized = { ...metadata };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'ssn', 'credit_card'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitizeInput(sanitized[key]);
      }
    });

    return sanitized;
  }

  private getClientIP(): string {
    // In production, this would be extracted from headers
    return 'client-ip-not-available';
  }

  private async sendToAuditService(event: AuditEvent): Promise<void> {
    try {
      // In production, send to external audit service like Splunk, ELK, etc.
      await fetch('/api/audit-service', {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      logError(error as Error, { context: 'audit_service_send', eventId: event.id });
    }
  }

  getEvents(filter?: Partial<AuditEvent>): AuditEvent[] {
    if (!filter) return [...this.events];

    return this.events.filter(event => {
      return Object.entries(filter).every(([key, value]) => {
        if (key === 'timestamp') {
          // Handle timestamp range filtering if needed
          return true;
        }
        return event[key as keyof AuditEvent] === value;
      });
    });
  }

  exportAuditLog(): string {
    return JSON.stringify(this.events, null, 2);
  }
}

export const auditLogger = new AuditLogger();

// Data privacy utilities
export const maskPersonalData = (data: string, type: 'email' | 'phone' | 'ssn' | 'card'): string => {
  switch (type) {
    case 'email':
      const [user, domain] = data.split('@');
      return `${user.substring(0, 2)}***@${domain}`;
    case 'phone':
      return data.replace(/(\d{3})\d{3}(\d{4})/, '$1-***-$2');
    case 'ssn':
      return data.replace(/(\d{3})\d{2}(\d{4})/, '$1-**-$2');
    case 'card':
      return data.replace(/(\d{4})\d{8}(\d{4})/, '$1-****-****-$2');
    default:
      return data;
  }
};

// GDPR compliance utilities
export const gdprCompliance = {
  // Data subject access request
  exportUserData: async (userId: string): Promise<any> => {
    auditLogger.log({
      userId,
      action: 'data_export_request',
      resource: 'user_data',
      sensitivity: 'high',
      metadata: { requestType: 'GDPR_ACCESS' },
    });

    // Implementation would fetch all user data
    return { message: 'Data export initiated' };
  },

  // Right to be forgotten
  deleteUserData: async (userId: string): Promise<void> => {
    auditLogger.log({
      userId,
      action: 'data_deletion_request',
      resource: 'user_data',
      sensitivity: 'critical',
      metadata: { requestType: 'GDPR_DELETION' },
    });

    // Implementation would anonymize/delete user data
  },

  // Data portability
  exportPortableData: async (userId: string): Promise<any> => {
    auditLogger.log({
      userId,
      action: 'data_portability_request',
      resource: 'user_data',
      sensitivity: 'high',
      metadata: { requestType: 'GDPR_PORTABILITY' },
    });

    // Implementation would export data in portable format
    return { message: 'Portable data export initiated' };
  },
};

// SOC2 compliance utilities
export const soc2Compliance = {
  // Security principle
  logSecurityEvent: (event: string, details: Record<string, any>) => {
    auditLogger.log({
      action: 'security_event',
      resource: 'system',
      sensitivity: 'high',
      metadata: { event, ...details, compliance: 'SOC2_SECURITY' },
    });
  },

  // Availability principle
  logAvailabilityEvent: (event: string, details: Record<string, any>) => {
    auditLogger.log({
      action: 'availability_event',
      resource: 'system',
      sensitivity: 'medium',
      metadata: { event, ...details, compliance: 'SOC2_AVAILABILITY' },
    });
  },

  // Processing integrity principle
  logProcessingEvent: (event: string, details: Record<string, any>) => {
    auditLogger.log({
      action: 'processing_event',
      resource: 'data',
      sensitivity: 'medium',
      metadata: { event, ...details, compliance: 'SOC2_PROCESSING' },
    });
  },

  // Confidentiality principle
  logConfidentialityEvent: (event: string, details: Record<string, any>) => {
    auditLogger.log({
      action: 'confidentiality_event',
      resource: 'data',
      sensitivity: 'critical',
      metadata: { event, ...details, compliance: 'SOC2_CONFIDENTIALITY' },
    });
  },

  // Privacy principle
  logPrivacyEvent: (event: string, details: Record<string, any>) => {
    auditLogger.log({
      action: 'privacy_event',
      resource: 'personal_data',
      sensitivity: 'critical',
      metadata: { event, ...details, compliance: 'SOC2_PRIVACY' },
    });
  },
};

// PCI-DSS compliance utilities (for payment processing)
export const pciCompliance = {
  logPaymentEvent: (event: string, amount: number, currency: string, metadata?: Record<string, any>) => {
    auditLogger.log({
      action: 'payment_event',
      resource: 'payment_data',
      sensitivity: 'critical',
      metadata: {
        event,
        amount: maskPersonalData(amount.toString(), 'card'),
        currency,
        compliance: 'PCI_DSS',
        ...metadata,
      },
    });
  },

  validateCardNumber: (cardNumber: string): boolean => {
    // Luhn algorithm validation
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },
};

// Compliance reporting
export const generateComplianceReport = (startDate: string, endDate: string) => {
  const events = auditLogger.getEvents();
  const filteredEvents = events.filter(event => 
    event.timestamp >= startDate && event.timestamp <= endDate
  );

  const report = {
    period: { startDate, endDate },
    totalEvents: filteredEvents.length,
    eventsBySensitivity: {
      low: filteredEvents.filter(e => e.sensitivity === 'low').length,
      medium: filteredEvents.filter(e => e.sensitivity === 'medium').length,
      high: filteredEvents.filter(e => e.sensitivity === 'high').length,
      critical: filteredEvents.filter(e => e.sensitivity === 'critical').length,
    },
    eventsByAction: {} as Record<string, number>,
    complianceEvents: {
      gdpr: filteredEvents.filter(e => e.metadata?.requestType?.startsWith('GDPR')).length,
      soc2: filteredEvents.filter(e => e.metadata?.compliance?.startsWith('SOC2')).length,
      pci: filteredEvents.filter(e => e.metadata?.compliance === 'PCI_DSS').length,
    },
    generatedAt: new Date().toISOString(),
  };

  // Count events by action
  filteredEvents.forEach(event => {
    report.eventsByAction[event.action] = (report.eventsByAction[event.action] || 0) + 1;
  });

  return report;
};
