import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    /**
     * Keep Tailwind defaults and add a single custom 'desktop' breakpoint.
     * This keeps predictable responsive behavior while still allowing your
     * 1367px desktop-specific styles.
     */
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      desktop: '1367px',
    },

    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },

    extend: {
      // Font families (assumes you load these fonts via <link> or @font-face)
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },

      // Clean, semantic typography scale for the luxury layout
      fontSize: {
        // Hero / very large headings (used for full-screen section titles)
        'hero-mobile': ['2rem', { lineHeight: '1.05' }], // 32px
        'hero-tablet': ['3.5rem', { lineHeight: '1.02' }], // 56px
        'hero-desktop': ['6rem', { lineHeight: '1' }], // 96px

        // Section split titles (the stacked editorial text)
        'split-mobile': ['2.25rem', { lineHeight: '1.02' }], // 36px
        'split-tablet': ['3.75rem', { lineHeight: '1.01' }], // 60px
        'split-desktop': ['7.75rem', { lineHeight: '0.98' }], // 88px

        // Smaller section headings / overlays
        'section-mobile': ['1.25rem', { lineHeight: '1.2' }], // 20px
        'section-desktop': ['3rem', { lineHeight: '1.05' }], // 48px
      },

      // small utility for tracking and letter-spacing consistent with editorial look
      letterSpacing: {
        tightness: '-0.01em',
      },

      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
