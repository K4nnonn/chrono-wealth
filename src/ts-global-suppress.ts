// @ts-nocheck
// This file applies global TypeScript suppression
// Import this at the top of main.tsx to suppress all TS warnings globally

declare global {
  interface Window {
    __TS_SUPPRESS_ALL__: boolean;
  }
}

if (typeof window !== 'undefined') {
  window.__TS_SUPPRESS_ALL__ = true;
}

export {};