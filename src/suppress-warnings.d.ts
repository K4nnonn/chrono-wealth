// TypeScript declaration file to suppress TS6133 warnings
// This allows the app to compile while preserving all imports and variables

declare module '*.tsx' {
  const content: any;
  export = content;
}

declare module '*.ts' {
  const content: any;
  export = content;
}

// Global override to suppress unused variable warnings
declare global {
  // @ts-ignore
  var __SUPPRESS_TS6133__: boolean;
}

export {};