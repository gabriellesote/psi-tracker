// packages/shared/src/money/format-cents-as-brl.ts
//
// O banco guarda dinheiro em centavos (90000). Esta função mostra como "R$ 900,00".

const brazilianRealFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCentsAsBrl(amountInCents: number): string {
  return brazilianRealFormatter.format(amountInCents / 100);
}
