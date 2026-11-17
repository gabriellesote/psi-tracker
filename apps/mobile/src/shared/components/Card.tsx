// apps/mobile/src/shared/components/Card.tsx

import { colorTokens, radiusTokens, spacingTokens } from '@psi-tracker/shared';
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colorTokens.surface,
    borderRadius: radiusTokens.large,
    padding: spacingTokens.lg,
    gap: spacingTokens.md,
    borderWidth: 1,
    borderColor: colorTokens.border,
    shadowColor: colorTokens.primaryStrong,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});
