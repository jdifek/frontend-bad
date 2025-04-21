module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'], theme: {
    extend: {
      colors: {
        'primary-blue': '#0A3EE2',
        'light-blue': '#E6F0FA',
        'navy-blue': '#003087',
        'silver': '#D3D3D3',
        'bright-blue': '#1E90FF',
        'text-primary': '#003087',
        'text-light': '#666666',
        'text-dark': '#333333',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '12px',
      },
    },
  },
  plugins: [],
}