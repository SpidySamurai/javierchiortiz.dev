// tailwind.config.mjs
import { join } from 'path';

/** Helper to use CSS variables with opacity in Tailwind */
function withOpacity(variable) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variable}) / ${opacityValue})`;
    }
    return `rgb(var(${variable}))`;
  };
}

export default {
  content: [join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'), join(__dirname, 'src/app/globals.css')],
  theme: {
    extend: {
      colors: {
        primary: withOpacity('--color-primary'),
        secondary: withOpacity('--color-secondary'),
        'secondary-light': withOpacity('--color-secondary-light'),
        white: withOpacity('--color-white'),
        gray: withOpacity('--color-gray'),
        // Puedes agregar más tokens aquí según la paleta
      },
    },
  },
  plugins: [],
};
