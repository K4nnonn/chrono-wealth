// Demo configuration for FlowSight Fi
// Minimal demo config for the dedicated demo route only

export const DEMO_CONFIG = {
  // Only used for /demo route
  DEMO_USER: {
    email: 'demo@flowsightfi.com',
    name: 'Demo User',
    id: 'demo-user-123'
  }
};

export function isDemoRoute(): boolean {
  return window.location.pathname === '/demo' || 
         window.location.pathname.startsWith('/demo/');
}

// Simple simulation delay for demo route only
export function simulateApiCall<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 800);
  });
}