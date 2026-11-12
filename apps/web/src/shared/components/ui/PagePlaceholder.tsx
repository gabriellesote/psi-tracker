// apps/web/src/shared/components/ui/PagePlaceholder.tsx
//
// Tela provisória para as frentes que ainda vamos construir.

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      <p className="text-slate-600">{description}</p>
      <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
        Em construção
      </p>
    </section>
  );
}
