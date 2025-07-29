import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Source Sans Pro', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Source Sans Pro', 'DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--accent-destructive))",
          foreground: "hsl(var(--primary-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--accent-warning))",
          foreground: "hsl(var(--background))",
        },
        success: {
          DEFAULT: "hsl(var(--accent-success))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          teal: "hsl(var(--accent-teal))",
          coral: "hsl(var(--accent-coral))",
          success: "hsl(var(--accent-success))",
          warning: "hsl(var(--accent-warning))",
          destructive: "hsl(var(--accent-destructive))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        elegant: "var(--shadow-elegant)",
        glow: "var(--shadow-glow)",
        card: "var(--shadow-card)",
        soft: "var(--shadow-soft)",
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-flow': 'var(--gradient-flow)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-hero': 'var(--gradient-hero)',
        // Financial Psychology Gradients
        'gradient-wealth': 'var(--gradient-wealth)',
        'gradient-growth': 'var(--gradient-growth)',
        'gradient-confidence': 'var(--gradient-confidence)',
        'gradient-warning': 'var(--gradient-warning)',
        'gradient-danger': 'var(--gradient-danger)',
        // Chart Gradients
        'gradient-chart-positive': 'var(--gradient-chart-positive)',
        'gradient-chart-neutral': 'var(--gradient-chart-neutral)',
        'gradient-chart-negative': 'var(--gradient-chart-negative)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 1.5s infinite",
        "bounce-subtle": "bounce-subtle 2s infinite",
        "float": "float 3s ease-in-out infinite",
        // Financial Psychology Animations
        "wealth-pulse": "wealth-pulse 3s ease-in-out infinite",
        "growth-surge": "growth-surge 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "confidence-glow": "confidence-glow 4s ease-in-out infinite",
        "achievement-celebration": "achievement-celebration 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "chart-entry": "chart-entry 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "data-reveal": "data-reveal 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "insight-appear": "insight-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.4)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--primary) / 0.6)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        // Financial Psychology Keyframes
        "wealth-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(var(--accent-success) / 0.3)",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(var(--accent-success) / 0.6), 0 0 60px hsl(var(--accent-teal) / 0.2)",
            transform: "scale(1.02)"
          },
        },
        "growth-surge": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.8" },
          "50%": { transform: "translateY(-3px)", opacity: "1" },
        },
        "confidence-glow": {
          "0%, 100%": { boxShadow: "0 0 15px hsl(var(--accent-teal) / 0.3)" },
          "50%": { boxShadow: "0 0 30px hsl(var(--accent-teal) / 0.6), 0 0 50px hsl(var(--primary) / 0.2)" },
        },
        "achievement-celebration": {
          "0%": { transform: "scale(1)" },
          "50%": { 
            transform: "scale(1.1)",
            boxShadow: "0 0 40px hsl(var(--accent-success) / 0.8)"
          },
          "100%": { 
            transform: "scale(1)",
            boxShadow: "0 0 20px hsl(var(--accent-success) / 0.4)"
          },
        },
        "chart-entry": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px) scale(0.95)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0) scale(1)"
          },
        },
        "data-reveal": {
          "0%": { 
            opacity: "0",
            transform: "translateX(-10px)",
            filter: "blur(2px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateX(0)",
            filter: "blur(0)"
          },
        },
        "insight-appear": {
          "0%": { 
            opacity: "0",
            transform: "translateY(15px) rotate(-1deg)"
          },
          "70%": { transform: "translateY(-2px) rotate(0.5deg)" },
          "100%": { 
            opacity: "1",
            transform: "translateY(0) rotate(0deg)"
          },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for accessibility
    function({ addUtilities }) {
      addUtilities({
        '.focus-ring': {
          '&:focus-visible': {
            outline: '2px solid hsl(var(--ring))',
            outlineOffset: '2px',
          },
        },
        '.hover-lift': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: 'var(--shadow-elegant)',
          },
        },
        '.text-balance': {
          textWrap: 'balance',
        },
      });
    },
  ],
} satisfies Config;

export default config;