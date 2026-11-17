// apps/mobile/src/app/(tabs)/_layout.tsx
//
// Barra de abas inferior com as cinco frentes do app.

import Ionicons from '@expo/vector-icons/Ionicons';
import { colorTokens } from '@psi-tracker/shared';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { fontFamilyByWeight } from '@/shared/theme/fonts';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const tabDefinitions: { routeName: string; title: string; iconName: IoniconName }[] = [
  { routeName: 'index', title: 'Diário', iconName: 'calendar-outline' },
  { routeName: 'sessions', title: 'Sessões', iconName: 'chatbubbles-outline' },
  { routeName: 'finance', title: 'Financeiro', iconName: 'wallet-outline' },
  { routeName: 'notebook', title: 'Caderno', iconName: 'book-outline' },
  { routeName: 'profile', title: 'Perfil', iconName: 'person-circle-outline' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorTokens.primaryStrong,
        tabBarInactiveTintColor: colorTokens.textSecondary,
        tabBarLabelStyle: { fontFamily: fontFamilyByWeight.semibold },
        tabBarStyle: {
          backgroundColor: colorTokens.surface,
          borderTopColor: colorTokens.border,
        },
      }}
    >
      {tabDefinitions.map((tabDefinition) => (
        <Tabs.Screen
          key={tabDefinition.routeName}
          name={tabDefinition.routeName}
          options={{
            title: tabDefinition.title,
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name={tabDefinition.iconName}
                size={size}
                color={focused ? colorTokens.primaryStrong : colorTokens.textSecondary}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
