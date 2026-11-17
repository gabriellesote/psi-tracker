// apps/mobile/src/shared/components/PrimaryButton.tsx

import { colorTokens, radiusTokens, spacingTokens } from '@psi-tracker/shared';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { AppText } from './AppText';

type ButtonAppearance = 'filled' | 'outlined';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  appearance?: ButtonAppearance;
  leadingIcon?: ReactNode;
}

export function PrimaryButton({
  label,
  onPress,
  isLoading = false,
  appearance = 'filled',
  leadingIcon,
}: PrimaryButtonProps) {
  const isFilled = appearance === 'filled';

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        isFilled ? styles.filledButton : styles.outlinedButton,
        (pressed || isLoading) && styles.pressedButton,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isFilled ? colorTokens.textOnPrimary : colorTokens.primary} />
      ) : (
        <>
          {leadingIcon}
          <AppText weight="bold" color={isFilled ? 'textOnPrimary' : 'textPrimary'}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radiusTokens.pill,
    paddingHorizontal: spacingTokens.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingTokens.xs,
  },
  filledButton: {
    backgroundColor: colorTokens.primary,
  },
  outlinedButton: {
    backgroundColor: colorTokens.surface,
    borderWidth: 1.5,
    borderColor: colorTokens.border,
  },
  pressedButton: {
    opacity: 0.75,
  },
});
