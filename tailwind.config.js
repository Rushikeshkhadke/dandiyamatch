/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0208',
        card: '#1A0A0A',
        'card-surface': '#250E13',
        'card-border': '#3D151C',
        primary: {
          DEFAULT: '#FF4D00',
          hover: '#FF631E',
          glow: 'rgba(255, 77, 0, 0.4)',
        },
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFE566',
          dark: '#B8860B',
          glow: 'rgba(255, 215, 0, 0.35)',
        },
        maroon: {
          900: '#0D0208',
          800: '#1A0A0A',
          700: '#2A0D14',
          600: '#3D151C',
        },
        marigold: '#FF9900',
        sindoor: '#D90429',
        text: {
          primary: '#FFF5E4',
          muted: '#8B6F5E',
          dim: '#5E493C',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(255, 77, 0, 0.45)',
        'glow-gold': '0 0 25px rgba(255, 215, 0, 0.35)',
        'card-deep': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'floatUp 8s ease-in-out infinite',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(100vh) scale(0.6)', opacity: '0' },
          '20%': { opacity: '0.8' },
          '80%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-10vh) scale(1)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
