// apps/mobile/src/shared/components/ScreenContainer.tsx
//
// Moldura de toda tela: fundo, respiro nas bordas e área segura (notch/barra do sistema).

import { colorTokens, spacingTokens } from '@psi-tracker/shared';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from './AppText';

interface ScreenContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function ScreenContainer({ title, subtitle, children }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText variant="display" weight="extrabold">
          {title}
        </AppText>
        {subtitle && (
          <AppText color="textSecondary" style={styles.subtitle}>
            {subtitle}
          </AppText>
        )}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorTokens.background,
  },
  content: {
    padding: spacingTokens.lg,
    gap: spacingTokens.md,
  },
  subtitle: {
    marginTop: -spacingTokens.xs,
  },
});
