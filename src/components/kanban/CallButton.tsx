import { Phone } from "lucide-react";

export function CallButton({ telefone }: { telefone: string | null }) {
  if (!telefone) {
    return (
      <span
        className="flex h-10 w-10 items-center justify-center rounded-md text-zinc-300 dark:text-zinc-700"
        title="Sem telefone cadastrado"
      >
        <Phone className="h-5 w-5" />
      </span>
    );
  }

  return (
    <a
      href={`tel:${telefone}`}
      title="Ligar"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="flex h-10 w-10 items-center justify-center rounded-md text-blue-600 hover:bg-black/[.04] dark:text-blue-500 dark:hover:bg-white/[.06]"
    >
      <Phone className="h-5 w-5" />
    </a>
  );
}
