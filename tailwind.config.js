/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Royal violet (premium, confident, elegant)
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#6D28D9', // Main primary color
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#312e81',
        },
        // Secondary - Muted teal (modern balance)
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0EA5A8', // Main secondary color
          700: '#0d9488',
          800: '#0f766e',
          900: '#115e59',
        },
        // Accent - Metallic gold (luxury highlights & CTAs)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#D4AF37', // Main accent color
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Semantic colors
        success: {
          DEFAULT: '#15803D',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#15803D',
          600: '#166534',
        },
        error: {
          DEFAULT: '#B91C1C',
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#B91C1C',
          600: '#991b1b',
        },
        warning: {
          DEFAULT: '#B45309',
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#B45309',
          600: '#92400e',
        },
        info: {
          DEFAULT: '#4338CA',
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4338CA',
          600: '#3730a3',
        },
        // Dark mode colors
        dark: {
          DEFAULT: '#1E1B4B',
          50: '#312e81',
          100: '#1E1B4B',
        },
        surface: {
          DEFAULT: '#312E81',
          50: '#f5f3ff',
          100: '#312E81',
        },
      },
      spacing: {
        // 8pt baseline system
        '0.5': '4px',   // space-1
        '1.5': '12px',  // space-3
        '3': '24px',    // space-5
        '6': '48px',    // space-7
        '8': '64px',    // space-8
      },
      fontSize: {
        // Fluid typography scale
        'display': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['clamp(1.875rem, 3vw, 3rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'subheading': ['clamp(1.25rem, 2vw, 1.875rem)', { lineHeight: '1.3', fontWeight: '500' }],
      },
      boxShadow: {
        // Matching SCSS shadow tokens
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'lg': '0 12px 20px rgba(0, 0, 0, 0.10), 0 6px 10px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 30px rgba(0, 0, 0, 0.12), 0 10px 15px rgba(0, 0, 0, 0.06)',
        'accent': '0 10px 25px rgba(212, 175, 55, 0.2)',
        'primary': '0 10px 25px rgba(109, 40, 217, 0.2)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
      },
      transitionDuration: {
        'fast': '120ms',
        'base': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
