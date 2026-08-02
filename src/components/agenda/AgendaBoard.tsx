"use client";

import { useMemo, useState } from "react";
import { LeadFichaModal } from "@/components/lead-detail/LeadFichaModal";
import { LeadFormModal } from "@/components/lead-detail/LeadFormModal";
import { dateKey, dateKeyFromIso, isSameDay } from "@/lib/agenda";
import { deleteLead } from "@/services/leads";
import type { Lead } from "@/types/database";
import { AppointmentsPanel } from "./AppointmentsPanel";
import { MonthCalendar } from "./MonthCalendar";

type DetailState =
  | { mode: "closed" }
  | { mode: "ficha"; leadId: string }
  | { mode: "edit"; leadId: string };

function sortByHorario(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    const ta = a.proximo_contato ? new Date(a.proximo_contato).getTime() : Infinity;
    const tb = b.proximo_contato ? new Date(b.proximo_contato).getTime() : Infinity;
    return ta - tb;
  });
}

export function AgendaBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailState>({ mode: "closed" });

  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const leadsByDate = useMemo(() => {
    const map = new Map<string, Lead[]>();
    for (const lead of leads) {
      if (!lead.proximo_contato) continue;
      const key = dateKeyFromIso(lead.proximo_contato);
      const bucket = map.get(key) ?? [];
      bucket.push(lead);
      map.set(key, bucket);
    }
    for (const [key, bucket] of map) map.set(key, sortByHorario(bucket));
    return map;
  }, [leads]);

  const todayLeads = leadsByDate.get(dateKey(today)) ?? [];
  const selectedDateLeads = leadsByDate.get(dateKey(selectedDate)) ?? [];
  const selectedIsToday = isSameDay(selectedDate, today);

  const detailLead =
    detail.mode === "ficha" || detail.mode === "edit"
      ? leads.find((l) => l.id === detail.leadId) ?? null
      : null;

  function patchLead(leadId: string, patch: Partial<Lead>) {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...patch } : l)));
  }

  function openFicha(lead: Lead) {
    setDetail({ mode: "ficha", leadId: lead.id });
  }

  function openEdit(lead: Lead) {
    setDetail({ mode: "edit", leadId: lead.id });
  }

  function closeLeadDetail() {
    setDetail({ mode: "closed" });
  }

  function cancelForm() {
    setDetail((prev) => (prev.mode === "edit" ? { mode: "ficha", leadId: prev.leadId } : { mode: "closed" }));
  }

  async function handleDeleteLead(lead: Lead) {
    try {
      await deleteLead(lead.id);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      closeLeadDetail();
    } catch {
      setErrorMessage("Não foi possível excluir o lead. Tente novamente.");
    }
  }

  return (
    <div className="flex h-dvh flex-col">
      {errorMessage && (
        <div className="flex items-center justify-between border-b border-line-danger bg-red-50 px-6 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {errorMessage}
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-4 text-xs underline"
          >
            Fechar
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <MonthCalendar
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            leadsByDate={leadsByDate}
          />

          <div className="flex flex-col gap-6">
            <AppointmentsPanel
              title="Compromissos do Dia"
              subtitle={new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(today)}
              leads={todayLeads}
              onOpenLead={openFicha}
              emptyMessage="Nenhum compromisso agendado para hoje."
            />

            {!selectedIsToday && (
              <AppointmentsPanel
                title="Compromissos do Dia Selecionado"
                subtitle={new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
                  selectedDate
                )}
                leads={selectedDateLeads}
                onOpenLead={openFicha}
              />
            )}
          </div>
        </div>
      </div>

      <LeadFichaModal
        lead={detail.mode === "ficha" ? detailLead : null}
        open={detail.mode === "ficha"}
        onClose={closeLeadDetail}
        onEdit={openEdit}
        onDelete={handleDeleteLead}
        onPatch={patchLead}
        onError={setErrorMessage}
      />

      <LeadFormModal
        lead={detail.mode === "edit" ? detailLead : null}
        open={detail.mode === "edit"}
        onCancel={cancelForm}
        onCreated={() => closeLeadDetail()}
        onPatched={(leadId, patch) => {
          patchLead(leadId, patch);
          closeLeadDetail();
        }}
        onError={setErrorMessage}
      />
    </div>
  );
}
