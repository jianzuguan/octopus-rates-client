import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        price: {
          earning: 'hsl(130, 100%, 50%)',
          free: 'hsl(110, 100%, 69%)',
          cheap: 'hsl(80, 100%, 69%)',
          alright: 'hsl(50, 100%, 69%)',
          expensive: 'hsl(0, 100%, 69%)',
          'earning-dark': colors.lime['500'],
          'free-dark': colors.lime['600'],
          'cheap-dark': colors.lime['950'],
          'alright-dark': colors.yellow['700'],
          'expensive-dark': colors.red['800'],
        },
      },
    },
  },
  safelist: [
    {
      pattern: /bg-price-*/, // You can display all the colors that you need
      variants: ['dark'], // Optional
    },
  ],
  plugins: [],
}
export default config
