// apps/mobile/src/shared/components/AppText.tsx
//
// Texto padrão do app: já aplica a fonte, o tamanho e a cor do design system.

import { colorTokens, typographyTokens, type ColorTokenName } from '@psi-tracker/shared';
import { Text, type TextProps } from 'react-native';

import { fontFamilyByWeight, type FontWeightName } from '@/shared/theme/fonts';

type TextVariant = keyof typeof typographyTokens.fontSize;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  weight?: FontWeightName;
  color?: ColorTokenName;
}

export function AppText({
  variant = 'body',
  weight = 'regular',
  color = 'textPrimary',
  style,
  ...textProps
}: AppTextProps) {
  return (
    <Text
      style={[
        {
          fontFamily: fontFamilyByWeight[weight],
          fontSize: typographyTokens.fontSize[variant],
          color: colorTokens[color],
        },
        style,
      ]}
      {...textProps}
    />
  );
}
