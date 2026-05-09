/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        column: '#F1F5F9',
        brand: {
          primary: '#2563EB',
          secondary: '#64748B',
        },
        label: {
          Feature: '#DBEAFE',
          'Feature-text': '#1E40AF',
          Bug: '#FEE2E2',
          'Bug-text': '#991B1B',
          Issue: '#FEF3C7',
          'Issue-text': '#92400E',
          Undefined: '#F3F4F6',
          'Undefined-text': '#374151',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
