/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          text: '#F8FAFC',
          muted: '#CBD5E1'
        },
        light: {
           // Option 1: Soft Lavender (Current - Very Elegant) ✨
            bg: '#ece9fbff', // Soft purple-tinted white
           
           // Option 2: Warm Cream (Uncomment to use) 🌅
          //  bg: '#65421cff', // Warm peachy cream
           
           // Option 3: Mint Fresh (Uncomment to use) 🌿
           // bg: '#F0FDF4', // Fresh mint green
           
           // Option 4: Rose Blush (Uncomment to use) 🌸
          //  bg: '#f7dfe0ff', // Soft rose pink
           
           // Option 5: Sky Blue (Uncomment to use - matches your theme) ☁️
          //  bg: '#c7e1f2ff', // Light sky blue (your current)
           
           // Option 6: Sunset Peach (Uncomment to use) 🍑
          //  bg: '#f1e5d7ff', // Warm peach
           
           card: '#FFFFFF',
        },
        primary: {
            blue: '#2563EB',
            light: '#60A5FA',
            dark: '#1E40AF',
            gradientStart: '#3B82F6',
            gradientEnd: '#8B5CF6',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        'dark-hero-gradient': 'linear-gradient(135deg, #1E3A8A 0%, #312E81 100%)',
        'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)',
        'glass-dark': 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(30, 41, 59, 0.3) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}