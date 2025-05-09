module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        },
        boxShadow: {
          'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        },
        backdropBlur: {
          xs: '2px',
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
    ],
  }