"use client";

import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { AgendamentoModal } from "@/components/lead-detail/AgendamentoModal";
import { STATUS_KANBAN_LABELS, STATUS_KANBAN_ORDEM } from "@/lib/kanban";
import { CONTATO_PRINCIPAL_COLORS, getContatoPrincipal, getLembreteDisplay } from "@/lib/leads";
import type { Lead, StatusKanban } from "@/types/database";
import { CallButton } from "./CallButton";
import { ProximoContatoLabel } from "./ProximoContatoLabel";
import { TemperatureBar } from "./TemperatureBar";
import { WhatsappButton } from "./WhatsappButton";

export function LeadCardBody({
  lead,
  dragging = false,
  fallbackTexto = null,
  onPatch,
  onError,
  onChangeFase,
}: {
  lead: Lead;
  dragging?: boolean;
  fallbackTexto?: string | null;
  onPatch?: (patch: Partial<Lead>) => void;
  onError?: (message: string) => void;
  onChangeFase?: (novaFase: StatusKanban) => void;
}) {
  const telefone = lead.telefone_fixo ?? lead.whatsapp;
  const [agendamentoOpen, setAgendamentoOpen] = useState(false);
  const lembrete = getLembreteDisplay(lead, fallbackTexto);
  const contato = getContatoPrincipal(lead);

  return (
    <div
      className={`rounded-md border border-black/[.08] bg-white p-3 shadow-sm dark:border-white/[.145] dark:bg-zinc-900 ${
        dragging ? "shadow-lg" : ""
      }`}
    >
      <p className="mb-1.5 truncate text-base font-medium">{lead.nome}</p>

      <TemperatureBar site={lead.temperatura_site} gmn={lead.temperatura_gmn} />

      <div className="mt-1.5 flex items-center justify-between gap-2 text-sm">
        <span className={`min-w-0 truncate ${CONTATO_PRINCIPAL_COLORS[contato.tipo]}`}>
          {contato.texto}
        </span>
        <span className="shrink-0">
          <ProximoContatoLabel proximoContato={lead.proximo_contato} />
        </span>
      </div>

      <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
        {lembrete ? `Lembrete: ${lembrete}` : "Sem lembrete"}
      </p>

      {!dragging && onPatch && onError && (
        <div className="mt-2 flex items-center justify-end gap-1.5 border-t border-black/[.06] pt-2 dark:border-white/[.08]">
          {onChangeFase && (
            <select
              value={lead.status_kanban}
              onChange={(e) => onChangeFase(e.target.value as StatusKanban)}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="mr-auto rounded-md border border-black/[.08] bg-transparent px-1.5 py-1 text-base md:hidden dark:border-white/[.145]"
            >
              {STATUS_KANBAN_ORDEM.map((status) => (
                <option key={status} value={status}>
                  {STATUS_KANBAN_LABELS[status]}
                </option>
              ))}
            </select>
          )}
          <CallButton telefone={telefone} />
          <WhatsappButton whatsapp={lead.whatsapp} />
          <button
            type="button"
            title="Agendamento"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setAgendamentoOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-zinc-500 hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
          >
            <CalendarClock className="h-5 w-5" />
          </button>
        </div>
      )}

      {onPatch && onError && (
        <AgendamentoModal
          leadId={lead.id}
          proximoContato={lead.proximo_contato}
          lembrete={lead.lembrete}
          open={agendamentoOpen}
          onClose={() => setAgendamentoOpen(false)}
          onPatch={onPatch}
          onError={onError}
        />
      )}
    </div>
  );
}
