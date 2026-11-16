/** Mantecado's colours, shared by the sitting cat and the run. The cat is drawn art, so it keeps its own palette instead of DS tokens. */
export const MC = {
  white: '#fdfdfd',
  orange: '#e67e22',
  nose: '#e08e79',
  eyeYellow: '#f2c94c',
  dark: '#33292b',
  sparkle: '#c0c1ff',
  mouth: '#5a2a2e',
  darkMid: '#7a4e20',
  orangeLight: '#fce0c0',
  border: '#e8a040',
  whisker: 'rgba(51, 41, 43, 0.35)',
  /** Legs on the far side of the running cat, a shade darker than white. */
  farLeg: '#e6e0da',
  shadow: '0 8px 40px rgba(120, 60, 0, 0.28), 0 0 0 1.5px rgba(230, 126, 34, 0.5)',
} as const;
