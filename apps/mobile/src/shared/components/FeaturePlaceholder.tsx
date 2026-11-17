// apps/mobile/src/shared/components/FeaturePlaceholder.tsx
//
// Tela provisória para as frentes que ainda vamos construir.

import { StyleSheet, View } from 'react-native';
import { colorTokens, radiusTokens, spacingTokens } from '@psi-tracker/shared';

import { AppText } from './AppText';
import { Card } from './Card';
import { ScreenContainer } from './ScreenContainer';

interface FeaturePlaceholderProps {
  title: string;
  description: string;
  emoji: string;
}

export function FeaturePlaceholder({ title, description, emoji }: FeaturePlaceholderProps) {
  return (
    <ScreenContainer title={title}>
      <Card style={styles.card}>
        <AppText variant="display">{emoji}</AppText>
        <AppText color="textSecondary" style={styles.centeredText}>
          {description}
        </AppText>
        <View style={styles.badge}>
          <AppText variant="caption" weight="bold" color="primaryStrong">
            Em construção
          </AppText>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: spacingTokens.xxl,
  },
  centeredText: {
    textAlign: 'center',
  },
  badge: {
    backgroundColor: colorTokens.primarySoft,
    borderRadius: radiusTokens.pill,
    paddingHorizontal: spacingTokens.sm,
    paddingVertical: spacingTokens.xxs,
  },
});
