/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vulnerable': '#ef4444',
        'protected': '#22c55e',
        'dark-bg': '#0f172a',
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      boxShadow: {
        'vulnerable-glow': '0 0 15px rgba(239, 68, 68, 0.5)',
        'protected-glow': '0 0 15px rgba(34, 197, 94, 0.5)',
      }
    },
  },
  plugins: [],
}
