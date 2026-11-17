// apps/mobile/src/shared/components/TextField.tsx

import { colorTokens, radiusTokens, spacingTokens, typographyTokens } from '@psi-tracker/shared';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { fontFamilyByWeight } from '@/shared/theme/fonts';
import { AppText } from './AppText';

interface TextFieldProps extends TextInputProps {
  label: string;
}

export function TextField({ label, style, ...textInputProps }: TextFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <AppText variant="caption" weight="semibold" color="textSecondary">
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={colorTokens.textSecondary}
        style={[styles.input, style]}
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    gap: spacingTokens.xxs,
  },
  input: {
    minHeight: 48,
    borderRadius: radiusTokens.medium,
    borderWidth: 1,
    borderColor: colorTokens.border,
    backgroundColor: colorTokens.surfaceMuted,
    paddingHorizontal: spacingTokens.md,
    fontFamily: fontFamilyByWeight.regular,
    fontSize: typographyTokens.fontSize.body,
    color: colorTokens.textPrimary,
  },
});
