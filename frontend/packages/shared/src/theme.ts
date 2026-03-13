export const theme = {
  colors: {
    cream: '#fdf8f0',
    'brown-dark': '#3d2518',
    'brown-medium': '#5c3d2e',
    'brown-light': '#8b6f4e',
    earth: '#d4a574',
    'earth-light': '#e8d5b5',
    sand: '#f5ead6',
    'sand-dark': '#ede0cc',
    white: '#ffffff',
    error: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
  },
  fonts: {
    serif: "'Playfair Display', Georgia, serif",
    sans: "'Inter', system-ui, sans-serif",
  },
} as const;

export type Theme = typeof theme;
