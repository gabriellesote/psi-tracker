// apps/mobile/src/shared/theme/fonts.ts
//
// Fonte Nunito (arredondada e amigável) carregada no app.

import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

export const nunitoFontFiles = {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
};

export const fontFamilyByWeight = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
} as const;

export type FontWeightName = keyof typeof fontFamilyByWeight;
