import type { Lead } from "@/types/database";
import { ReschedulePopover } from "./ReschedulePopover";
import { WhatsappButton } from "./WhatsappButton";

const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function formatAtraso(proximoContato: string, now: number): string {
  const diffMs = new Date(proximoContato).getTime() - now;
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin === 0) return "agora";
  if (diffMin > -60) return rtf.format(diffMin, "minute");
  const diffHours = Math.round(diffMs / 3_600_000);
  if (diffHours > -24) return rtf.format(diffHours, "hour");
  const diffDays = Math.round(diffMs / 86_400_000);
  return rtf.format(diffDays, "day");
}

export function NotificationCard({
  lead,
  now,
  onPatch,
  onError,
}: {
  lead: Lead & { proximo_contato: string };
  now: number;
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
}) {
  const telefone = lead.telefone_fixo ?? lead.whatsapp;

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-md border border-red-200 bg-white px-3 py-2 shadow-sm dark:border-red-900/60 dark:bg-zinc-900">
      <div className="min-w-0">
        <p className="max-w-[10rem] truncate text-sm font-medium">{lead.nome}</p>
        <p className="max-w-[10rem] truncate text-xs text-zinc-500 dark:text-zinc-400">
          {telefone ?? "Sem telefone"}
        </p>
        <p className="text-xs font-medium text-red-600 dark:text-red-400">
          Atrasado {formatAtraso(lead.proximo_contato, now)}
        </p>
      </div>
      <div className="flex items-center gap-1 border-l border-black/[.06] pl-2 dark:border-white/[.08]">
        <WhatsappButton whatsapp={lead.whatsapp} />
        <ReschedulePopover
          leadId={lead.id}
          proximoContato={lead.proximo_contato}
          onPatch={(proximoContato) => onPatch(lead.id, { proximo_contato: proximoContato })}
          onError={onError}
        />
      </div>
    </div>
  );
}
