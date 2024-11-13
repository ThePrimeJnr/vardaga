/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          900: 'rgba(146, 30, 20, 1)',
          800: 'rgba(146, 30, 20, 0.9)',
          100: 'rgba(255, 239, 238, 1)',
        }
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(100%)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        'slide-left': {
          '0%': {
            transform: 'translateX(100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        'slide-right': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        'bounce-gentle': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-10px)'
          }
        },
        'pulse-soft': {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.7
          }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-left': 'slide-left 0.5s ease-in-out',
        'slide-right': 'slide-right 0.5s ease-in-out',
        'bounce-gentle': 'bounce-gentle 3s infinite ease-in-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

