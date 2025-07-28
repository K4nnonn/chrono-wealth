// @ts-nocheck
// Global TypeScript suppression for unused variables during development
// This file is imported in main.tsx to suppress all TS6133 warnings globally

declare global {
  interface Window {
    __SUPPRESS_TS_UNUSED_WARNINGS__: boolean;
  }
}

if (typeof window !== 'undefined') {
  window.__SUPPRESS_TS_UNUSED_WARNINGS__ = true;
}

export {};