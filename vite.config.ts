import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent'
    },
    // Complete TypeScript suppression
    target: 'esnext',
    drop: [],
    tsconfigRaw: {
      compilerOptions: {
        verbatimModuleSyntax: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        strict: false,
        noEmit: false,
        skipLibCheck: true,
        allowUnusedLabels: true,
        allowUnreachableCode: true,
        exactOptionalPropertyTypes: false,
        noFallthroughCasesInSwitch: false,
        noImplicitOverride: false,
        noImplicitReturns: false,
        noPropertyAccessFromIndexSignature: false,
        noUncheckedIndexedAccess: false,
        noImplicitAny: false,
        useDefineForClassFields: false
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress all warnings during build
        return;
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts', 'd3']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'd3']
  }
}));