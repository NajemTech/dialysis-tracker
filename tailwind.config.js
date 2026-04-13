/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"Source Sans 3"', 'sans-serif'],
        arabic: ['"Noto Sans Arabic"', 'sans-serif'],
        arabicDisplay: ['"Noto Serif Arabic"', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        nutrient: {
          potassium: '#7C3AED',
          phosphorus: '#3B82F6',
          sodium: '#F59E0B',
          protein: '#EF4444',
        },
        background: '#FFFFFF',
        foreground: '#1F2937',
        card: '#FFFFFF',
        'card-foreground': '#1F2937',
        muted: '#F3F4F6',
        'muted-foreground': '#6B7280',
        accent: '#F3F4F6',
        'accent-foreground': '#1F2937',
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#10B981',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
