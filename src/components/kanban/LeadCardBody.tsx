"use client";

import { CalendarClock } from "lucide-react";
import { useState } from "react";
import { AgendamentoModal } from "@/components/lead-detail/AgendamentoModal";
import { STATUS_KANBAN_LABELS, STATUS_KANBAN_ORDEM } from "@/lib/kanban";
import { CONTATO_PRINCIPAL_COLORS, getContatoPrincipal, getLembreteDisplay } from "@/lib/leads";
import { BTN_ICON, CARD, FOCUS_RING } from "@/lib/ui";
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
      className={`${CARD} p-3 ${dragging ? "shadow-lg" : ""}`}
    >
      <p className="mb-1.5 truncate text-base font-medium">{lead.nome}</p>

      <div className="flex items-center gap-2">
        <TemperatureBar site={lead.temperatura_site} gmn={lead.temperatura_gmn} />
        <span className="ml-auto min-w-0 truncate text-right">
          <ProximoContatoLabel proximoContato={lead.proximo_contato} />
        </span>
      </div>

      <p className={`mt-1.5 truncate text-sm ${CONTATO_PRINCIPAL_COLORS[contato.tipo]}`}>
        {contato.texto}
      </p>

      <p className="mt-1 text-sm break-words text-faint">
        {lembrete ? `Lembrete: ${lembrete}` : "Sem lembrete"}
      </p>

      {!dragging && onPatch && onError && (
        <div className="mt-2 flex items-center justify-end gap-1.5 border-t border-line-soft pt-2">
          {onChangeFase && (
            <select
              value={lead.status_kanban}
              onChange={(e) => onChangeFase(e.target.value as StatusKanban)}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className={`mr-auto rounded-md border border-line-strong bg-transparent px-1.5 py-1 text-base md:hidden ${FOCUS_RING}`}
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
            onClick={(e) => {
              e.stopPropagation();
              setAgendamentoOpen(true);
            }}
            className={`${BTN_ICON} text-faint`}
          >
            <CalendarClock className="h-5 w-5" />
          </button>
        </div>
      )}

      {onPatch && onError && (
        // O Modal não é portalizado: sem isolar os eventos, cliques dentro dele
        // borbulham até o onClick da raiz do LeadCard e abrem a ficha por trás.
        <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <AgendamentoModal
            leadId={lead.id}
            proximoContato={lead.proximo_contato}
            lembrete={lead.lembrete}
            open={agendamentoOpen}
            onClose={() => setAgendamentoOpen(false)}
            onPatch={onPatch}
            onError={onError}
          />
        </div>
      )}
    </div>
  );
}
