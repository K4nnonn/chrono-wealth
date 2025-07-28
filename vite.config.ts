import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // @ts-ignore
  typescript: { 
    check: false,
    transpileOnly: true,
    ignoreBuildErrors: true
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'unused-import': 'silent'
    },
    ignoreAnnotations: true,
    target: 'es2020'
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
    emptyOutDir: true,
    rollupOptions: {
      onwarn() {
        return false;
      },
      external: [],
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