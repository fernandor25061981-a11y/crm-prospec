import { Phone } from "lucide-react";
import { BTN_ICON } from "@/lib/ui";

export function CallButton({ telefone }: { telefone: string | null }) {
  if (!telefone) {
    return (
      <span
        className="flex h-10 w-10 items-center justify-center rounded-md text-disabled"
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
      className={`${BTN_ICON} text-blue-600 dark:text-blue-500`}
    >
      <Phone className="h-5 w-5" />
    </a>
  );
}
