import { Phone } from "lucide-react";
import type { Lead } from "@/types/database";
import { ProximoContatoLabel } from "./ProximoContatoLabel";
import { ReschedulePopover } from "./ReschedulePopover";
import { TemperatureBar } from "./TemperatureBar";
import { WhatsappButton } from "./WhatsappButton";

export function LeadCardBody({
  lead,
  dragging = false,
  onPatch,
  onError,
}: {
  lead: Lead;
  dragging?: boolean;
  onPatch?: (patch: Partial<Lead>) => void;
  onError?: (message: string) => void;
}) {
  const telefone = lead.telefone_fixo ?? lead.whatsapp;

  return (
    <div
      className={`rounded-md border border-black/[.08] bg-white p-3 shadow-sm dark:border-white/[.145] dark:bg-zinc-900 ${
        dragging ? "shadow-lg" : ""
      }`}
    >
      <TemperatureBar site={lead.temperatura_site} gmn={lead.temperatura_gmn} />

      <p className="mt-2 truncate text-sm font-medium">{lead.nome}</p>

      <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
        <Phone className="h-3 w-3 shrink-0" />
        <span className="truncate">{telefone ?? "Sem telefone"}</span>
      </div>

      <div className="mt-1">
        <ProximoContatoLabel proximoContato={lead.proximo_contato} />
      </div>

      {!dragging && onPatch && onError && (
        <div className="mt-2 flex items-center justify-end gap-1 border-t border-black/[.06] pt-2 dark:border-white/[.08]">
          <WhatsappButton whatsapp={lead.whatsapp} />
          <ReschedulePopover
            leadId={lead.id}
            proximoContato={lead.proximo_contato}
            onPatch={(proximoContato) => onPatch({ proximo_contato: proximoContato })}
            onError={onError}
          />
        </div>
      )}
    </div>
  );
}
