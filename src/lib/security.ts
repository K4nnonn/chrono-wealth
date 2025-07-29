// Security utilities and CSP configuration

export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.plaid.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://aqjcnnrijtivfcidrckr.supabase.co wss://aqjcnnrijtivfcidrckr.supabase.co https://api.stripe.com https://production.plaid.com https://sandbox.plaid.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://cdn.plaid.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Email validation with additional security checks
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const suspiciousPatterns = [
    /\+.*\+/, // Multiple plus signs
    /@.*@/, // Multiple @ symbols
    /\.{2,}/, // Consecutive dots
    /script/i, // Script injection attempts
  ];
  
  if (!emailRegex.test(email)) return false;
  if (suspiciousPatterns.some(pattern => pattern.test(email))) return false;
  
  return true;
};

// Password strength validation
export const validatePasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noCommonPatterns: !/^(password|123456|qwerty|admin|user)/i.test(password),
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    isValid: score >= 4,
    score,
    checks,
    strength: score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong'
  };
};

// Rate limiting implementation (client-side tracking)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.attempts.has(key)) {
      this.attempts.set(key, []);
    }
    
    const keyAttempts = this.attempts.get(key)!;
    
    // Remove old attempts outside the window
    const recentAttempts = keyAttempts.filter(time => time > windowStart);
    this.attempts.set(key, recentAttempts);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    return true;
  }
  
  getRemainingTime(key: string, windowMs: number): number {
    if (!this.attempts.has(key)) return 0;
    
    const keyAttempts = this.attempts.get(key)!;
    if (keyAttempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...keyAttempts);
    const remaining = windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, remaining);
  }
}

export const rateLimiter = new RateLimiter();

// Secure session management
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Data encryption utilities (for sensitive local storage)
export const encryptData = async (data: string, key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(key.padEnd(32, '0').slice(0, 32));
  
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
};

export const decryptData = async (encryptedData: string, key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(key.padEnd(32, '0').slice(0, 32));
  
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
  
  return new TextDecoder().decode(decrypted);
};

// Security monitoring
export const logSecurityEvent = (event: string, details: Record<string, any>) => {
  const securityEvent = {
    type: 'security',
    event,
    details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  console.warn('Security Event:', securityEvent);
  
  // In production, send to security monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to SIEM, security dashboard, etc.
  }
};