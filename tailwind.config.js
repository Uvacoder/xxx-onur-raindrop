module.exports = {
  content: ['./src/**/*.js'],
  theme: {
    screens: {
      xs: '320px',
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    extend: {
      lineHeight: {
        slack: '1.7',
        slacker: '1.75'
      },
      listStyleType: {
        circle: 'circle'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
}
