// packages/shared/src/design/design-tokens.ts
//
// Fonte única das cores, cantos e espaçamentos do site e do app.
// Mudou aqui, muda nos dois. (Paleta provisória: será refinada no concept design.)

export const colorTokens = {
  background: '#FAF7FF',
  surface: '#FFFFFF',
  surfaceMuted: '#F3EEFC',
  border: '#E8E1F5',

  textPrimary: '#2D2640',
  textSecondary: '#6F6787',
  textOnPrimary: '#FFFFFF',

  primary: '#8B6CF6',
  primaryStrong: '#6F4FE0',
  primarySoft: '#EDE6FF',

  accentPeach: '#FFB8A1',
  accentMint: '#9EE3C7',
  accentSky: '#A9D3FF',

  success: '#3FBF8A',
  warning: '#F5A524',
  danger: '#E5566B',
} as const;

/** Cor de cada nota de humor, de 1 (muito mal) a 5 (muito bem). */
export const moodColorTokens = {
  1: '#E5566B',
  2: '#FF9F80',
  3: '#F5D76E',
  4: '#9EE3C7',
  5: '#5CC8A0',
} as const;

export const radiusTokens = {
  small: 10,
  medium: 16,
  large: 24,
  pill: 999,
} as const;

export const spacingTokens = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typographyTokens = {
  fontFamily: 'Nunito',
  fontSize: { caption: 12, body: 15, subtitle: 18, title: 24, display: 32 },
} as const;

export type ColorTokenName = keyof typeof colorTokens;
