// Enterprise Security Framework
// Comprehensive security monitoring, encryption, and threat detection

import { logSecurityEvent } from './security';

export interface SecurityMetrics {
  anomalousTransactions: number;
  suspiciousLogins: number;
  dataIntegrityViolations: number;
  encryptionFailures: number;
  lastSecurityScan: Date;
}

export interface ThreatAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  threats: string[];
  mitigations: string[];
  confidence: number;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export class EnterpriseSecurityManager {
  private static instance: EnterpriseSecurityManager;
  private auditLog: AuditEvent[] = [];
  private securityMetrics: SecurityMetrics;
  private encryptionKey: string;

  private constructor() {
    this.securityMetrics = {
      anomalousTransactions: 0,
      suspiciousLogins: 0,
      dataIntegrityViolations: 0,
      encryptionFailures: 0,
      lastSecurityScan: new Date()
    };
    this.encryptionKey = this.generateEncryptionKey();
  }

  public static getInstance(): EnterpriseSecurityManager {
    if (!EnterpriseSecurityManager.instance) {
      EnterpriseSecurityManager.instance = new EnterpriseSecurityManager();
    }
    return EnterpriseSecurityManager.instance;
  }

  /**
   * Generate cryptographically secure encryption key
   */
  private generateEncryptionKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Encrypt sensitive financial data
   */
  public async encryptFinancialData(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);
      
      const keyBuffer = encoder.encode(this.encryptionKey.slice(0, 32));
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
      
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        dataBuffer
      );
      
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      this.securityMetrics.encryptionFailures++;
      this.logAuditEvent({
        action: 'encryption_failure',
        resource: 'financial_data',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        severity: 'error'
      });
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt sensitive financial data
   */
  public async decryptFinancialData(encryptedData: string): Promise<any> {
    try {
      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(this.encryptionKey.slice(0, 32));
      
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encrypted
      );
      
      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (error) {
      this.securityMetrics.encryptionFailures++;
      throw new Error('Decryption failed');
    }
  }

  /**
   * Detect anomalous transaction patterns
   */
  public detectTransactionAnomalies(transactions: any[]): ThreatAssessment {
    const threats: string[] = [];
    let totalAnomaly = 0;

    // Check for unusual spending patterns
    const amounts = transactions.map(t => t.amount || 0);
    const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const largeTransactions = amounts.filter(amt => amt > avgAmount * 5);
    
    if (largeTransactions.length > 0) {
      threats.push(`${largeTransactions.length} unusually large transactions detected`);
      totalAnomaly += largeTransactions.length * 10;
    }

    // Check for rapid-fire transactions
    const timestamps = transactions.map(t => new Date(t.created_at || t.date));
    timestamps.sort((a, b) => a.getTime() - b.getTime());
    
    let rapidTransactions = 0;
    for (let i = 1; i < timestamps.length; i++) {
      const timeDiff = timestamps[i].getTime() - timestamps[i-1].getTime();
      if (timeDiff < 60000) { // Less than 1 minute apart
        rapidTransactions++;
      }
    }
    
    if (rapidTransactions > 5) {
      threats.push(`${rapidTransactions} rapid-fire transactions detected`);
      totalAnomaly += rapidTransactions * 5;
    }

    // Update metrics
    this.securityMetrics.anomalousTransactions += threats.length;

    const level = this.calculateThreatLevel(totalAnomaly);
    
    return {
      level,
      threats,
      mitigations: this.generateMitigations(threats),
      confidence: Math.min(95, 70 + (totalAnomaly / 10))
    };
  }

  /**
   * Calculate threat level based on anomaly score
   */
  private calculateThreatLevel(anomalyScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (anomalyScore >= 100) return 'critical';
    if (anomalyScore >= 50) return 'high';
    if (anomalyScore >= 20) return 'medium';
    return 'low';
  }

  /**
   * Generate security mitigations based on detected threats
   */
  private generateMitigations(threats: string[]): string[] {
    const mitigations: string[] = [];
    
    threats.forEach(threat => {
      if (threat.includes('large transactions')) {
        mitigations.push('Enable transaction amount limits');
        mitigations.push('Require additional verification for large amounts');
      }
      
      if (threat.includes('rapid-fire')) {
        mitigations.push('Implement transaction rate limiting');
        mitigations.push('Add cooling-off periods between transactions');
      }
    });
    
    return mitigations;
  }

  /**
   * Log comprehensive audit events
   */
  public logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
    const auditEvent: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...event
    };
    
    this.auditLog.push(auditEvent);
    
    // Keep only last 10,000 events in memory
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-10000);
    }
    
    // Log to security monitoring
    logSecurityEvent(event.action, {
      ...event.details,
      severity: event.severity,
      resource: event.resource
    });
  }

  /**
   * Validate data integrity using checksums
   */
  public async validateDataIntegrity(data: any, expectedChecksum?: string): Promise<boolean> {
    try {
      const jsonString = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const currentChecksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      if (expectedChecksum) {
        const isValid = currentChecksum === expectedChecksum;
        if (!isValid) {
          this.securityMetrics.dataIntegrityViolations++;
          this.logAuditEvent({
            action: 'data_integrity_violation',
            resource: 'financial_data',
            details: { expected: expectedChecksum, actual: currentChecksum },
            severity: 'critical'
          });
        }
        return isValid;
      }
      
      return true;
    } catch (error) {
      this.securityMetrics.dataIntegrityViolations++;
      return false;
    }
  }

  /**
   * Generate data integrity checksum
   */
  public async generateChecksum(data: any): Promise<string> {
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(jsonString);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Perform comprehensive security scan
   */
  public performSecurityScan(): SecurityMetrics & { recommendations: string[] } {
    const recommendations: string[] = [];
    
    if (this.securityMetrics.anomalousTransactions > 10) {
      recommendations.push('Review and investigate anomalous transactions');
    }
    
    if (this.securityMetrics.encryptionFailures > 0) {
      recommendations.push('Address encryption infrastructure issues');
    }
    
    if (this.securityMetrics.dataIntegrityViolations > 0) {
      recommendations.push('Investigate data integrity violations immediately');
    }
    
    const daysSinceLastScan = Math.floor(
      (Date.now() - this.securityMetrics.lastSecurityScan.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastScan > 7) {
      recommendations.push('Security scans should be performed weekly');
    }
    
    this.securityMetrics.lastSecurityScan = new Date();
    
    return {
      ...this.securityMetrics,
      recommendations
    };
  }

  /**
   * Get security audit report
   */
  public getAuditReport(hours: number = 24): {
    events: AuditEvent[];
    summary: Record<string, number>;
    critical: AuditEvent[];
  } {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const events = this.auditLog.filter(event => event.timestamp >= cutoff);
    
    const summary = events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const critical = events.filter(event => event.severity === 'critical');
    
    return { events, summary, critical };
  }

  /**
   * Reset security metrics (for testing/administrative purposes)
   */
  public resetMetrics(): void {
    this.securityMetrics = {
      anomalousTransactions: 0,
      suspiciousLogins: 0,
      dataIntegrityViolations: 0,
      encryptionFailures: 0,
      lastSecurityScan: new Date()
    };
  }
}

// Export singleton instance
export const enterpriseSecurity = EnterpriseSecurityManager.getInstance();
