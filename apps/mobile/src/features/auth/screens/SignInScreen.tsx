// apps/mobile/src/features/auth/screens/SignInScreen.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { colorTokens, radiusTokens, spacingTokens } from '@psi-tracker/shared';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/shared/components/AppText';
import { Card } from '@/shared/components/Card';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { TextField } from '@/shared/components/TextField';
import { useAuth } from '../context/use-auth';

export function SignInScreen() {
  const { signInWithGoogle, signInWithEmailForDevelopment } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [developmentEmail, setDevelopmentEmail] = useState('');
  const [developmentPassword, setDevelopmentPassword] = useState('');

  async function runSignIn(signInAction: () => Promise<unknown>) {
    setErrorMessage(null);
    setIsSigningIn(true);
    try {
      await signInAction();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível entrar');
    } finally {
      setIsSigningIn(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.logoBubble}>
          <AppText variant="display">🧠</AppText>
        </View>
        <AppText variant="display" weight="extrabold" style={styles.centeredText}>
          PSI Tracker
        </AppText>
        <AppText color="textSecondary" style={styles.centeredText}>
          Seu cantinho para acompanhar a terapia, o humor e o autocuidado.
        </AppText>

        <PrimaryButton
          label="Continuar com Google"
          appearance="outlined"
          isLoading={isSigningIn}
          leadingIcon={<Ionicons name="logo-google" size={20} color={colorTokens.primary} />}
          onPress={() => runSignIn(signInWithGoogle)}
        />

        {__DEV__ && (
          <Card>
            <AppText variant="caption" weight="bold" color="textSecondary">
              SÓ NO DESENVOLVIMENTO · entrar com e-mail
            </AppText>
            <TextField
              label="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
              value={developmentEmail}
              onChangeText={setDevelopmentEmail}
            />
            <TextField
              label="Senha"
              secureTextEntry
              value={developmentPassword}
              onChangeText={setDevelopmentPassword}
            />
            <PrimaryButton
              label="Entrar"
              isLoading={isSigningIn}
              onPress={() =>
                runSignIn(() =>
                  signInWithEmailForDevelopment(developmentEmail, developmentPassword),
                )
              }
            />
          </Card>
        )}

        {errorMessage && (
          <AppText color="danger" style={styles.centeredText}>
            {errorMessage}
          </AppText>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorTokens.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacingTokens.lg,
    gap: spacingTokens.md,
  },
  logoBubble: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: radiusTokens.pill,
    backgroundColor: colorTokens.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});
