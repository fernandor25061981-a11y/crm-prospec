import { BTN_ACTION } from "@/lib/ui";

// O texto fica sobre a cor da temperatura (red/yellow/green-500, de lib/temperatura).
// São cores fixas do Tailwind, iguais nos dois temas, então o texto também é fixo:
// neutral-950 passa AA nas três — red-500 5,26:1 · yellow-500 10,3:1 · green-500 8,6:1.
const TEXTO_SOBRE_COR = "font-medium text-neutral-950";

export function StatusBar<T extends string>({
  label,
  value,
  labels,
  colors,
  href,
}: {
  label: string;
  value: T;
  labels: Record<T, string>;
  colors: Record<T, string>;
  href: string | null;
}) {
  const className = `${BTN_ACTION} ${TEXTO_SOBRE_COR} ${colors[value]}`;

  if (!href) {
    return (
      <div className={`${className} pointer-events-none opacity-50`} title={labels[value]}>
        {label}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={labels[value]}
      className={`${className} transition-opacity hover:opacity-80`}
    >
      Acessar {label}
    </a>
  );
}
