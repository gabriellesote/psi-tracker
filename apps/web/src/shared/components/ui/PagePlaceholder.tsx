// apps/web/src/shared/components/ui/PagePlaceholder.tsx
//
// Tela provisória para as frentes que ainda vamos construir.

interface PagePlaceholderProps {
  title: string;
  description: string;
  emoji: string;
}

export function PagePlaceholder({ title, description, emoji }: PagePlaceholderProps) {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-extrabold">{title}</h1>
      <div className="flex flex-col items-center gap-3 rounded-large bg-surface px-6 py-16 text-center ring-1 ring-border">
        <span className="text-5xl" aria-hidden>
          {emoji}
        </span>
        <p className="max-w-md text-text-secondary">{description}</p>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary-strong">
          Em construção
        </span>
      </div>
    </section>
  );
}
