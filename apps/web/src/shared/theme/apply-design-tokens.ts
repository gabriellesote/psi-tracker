// apps/web/src/shared/theme/apply-design-tokens.ts
//
// Transforma os design tokens compartilhados (os mesmos do app) em variáveis CSS.
// O Tailwind lê essas variáveis (veja styles/global.css), então classes como
// "bg-primary" ou "text-text-secondary" usam exatamente as cores do app.

import { colorTokens, moodColorTokens, radiusTokens } from '@psi-tracker/shared';

function toKebabCase(camelCaseName: string): string {
  return camelCaseName.replace(/[A-Z]/g, (upperLetter) => `-${upperLetter.toLowerCase()}`);
}

export function applyDesignTokensToDocument(rootElement: HTMLElement = document.documentElement) {
  for (const [colorName, colorValue] of Object.entries(colorTokens)) {
    rootElement.style.setProperty(`--psi-color-${toKebabCase(colorName)}`, colorValue);
  }

  for (const [moodScore, moodColor] of Object.entries(moodColorTokens)) {
    rootElement.style.setProperty(`--psi-color-mood-${moodScore}`, moodColor);
  }

  for (const [radiusName, radiusInPixels] of Object.entries(radiusTokens)) {
    rootElement.style.setProperty(`--psi-radius-${radiusName}`, `${radiusInPixels}px`);
  }
}
