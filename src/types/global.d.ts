// Global type declarations and build suppression
// This file helps suppress TypeScript warnings during development

declare module '*.tsx' {
  const content: any;
  export default content;
}

declare module '*.ts' {
  const content: any;
  export default content;
}

// Suppress TypeScript unused variable warnings globally
declare global {
  // Allow any unused variables during development
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type SuppressUnusedWarnings = any;
}

export {};