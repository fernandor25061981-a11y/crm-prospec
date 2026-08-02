"use client";

import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { AgendamentoModal } from "@/components/lead-detail/AgendamentoModal";
import { CONTATO_PRINCIPAL_COLORS, getContatoPrincipal, getLembreteDisplay } from "@/lib/leads";
import type { Lead } from "@/types/database";
import { CallButton } from "./CallButton";
import { ProximoContatoLabel } from "./ProximoContatoLabel";
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
  fallbackTexto = null,
  onPatch,
  onError,
  onOpen,
}: {
  lead: Lead & { proximo_contato: string };
  now: number;
  fallbackTexto?: string | null;
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onOpen: (lead: Lead) => void;
}) {
  const telefone = lead.telefone_fixo ?? lead.whatsapp;
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const lembrete = getLembreteDisplay(lead, fallbackTexto);
  const contato = getContatoPrincipal(lead);

  return (
    <div className="flex max-w-sm shrink-0 items-start gap-3 rounded-md border border-red-200 bg-white px-3 py-2 shadow-sm dark:border-red-900/60 dark:bg-zinc-900">
      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onOpen(lead)}>
        <p className="truncate text-base font-medium">{lead.nome}</p>
        <p className={`truncate text-sm ${CONTATO_PRINCIPAL_COLORS[contato.tipo]}`}>
          {contato.texto}
        </p>
        <p className="text-sm break-words text-zinc-500 dark:text-zinc-400">
          {lembrete ? `Lembrete: ${lembrete}` : "Sem lembrete"}
        </p>
      </div>
      <div className="ml-auto flex shrink-0 flex-col items-end gap-1 border-l border-black/[.06] pl-2 dark:border-white/[.08]">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Atrasado {formatAtraso(lead.proximo_contato, now)}
        </p>
        <ProximoContatoLabel proximoContato={lead.proximo_contato} />
        <div className="flex items-center gap-1.5">
          <CallButton telefone={telefone} />
          <WhatsappButton whatsapp={lead.whatsapp} />
          <button
            type="button"
            title="Agendamento"
            onClick={() => setAgendamentoOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-zinc-500 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
          >
            <CalendarClock className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AgendamentoModal
        leadId={lead.id}
        proximoContato={lead.proximo_contato}
        lembrete={lead.lembrete}
        open={agendamentoOpen}
        onClose={() => setAgendamentoOpen(false)}
        onPatch={(patch) => onPatch(lead.id, patch)}
        onError={onError}
      />
    </div>
  );
}
