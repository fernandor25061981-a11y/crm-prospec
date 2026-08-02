"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LeadFichaModal } from "@/components/lead-detail/LeadFichaModal";
import { LeadFormModal } from "@/components/lead-detail/LeadFormModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useOverdueLeads } from "@/hooks/useOverdueLeads";
import { STATUS_KANBAN_LABELS, STATUS_KANBAN_ORDEM } from "@/lib/kanban";
import { deleteLead, updateLeadFase } from "@/services/leads";
import type { Lead, StatusKanban } from "@/types/database";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCardBody } from "./LeadCardBody";
import { NotificationColumn } from "./NotificationColumn";
import { NotificationQueue } from "./NotificationQueue";

type DetailState =
  | { mode: "closed" }
  | { mode: "ficha"; leadId: string }
  | { mode: "create" }
  | { mode: "edit"; leadId: string };

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const wantsNew = searchParams.get("new") === "1";
  const [detail, setDetail] = useState<DetailState>(() =>
    wantsNew ? { mode: "create" } : { mode: "closed" }
  );
  const [handledNew, setHandledNew] = useState(wantsNew);

  if (wantsNew && !handledNew) {
    setHandledNew(true);
    setDetail({ mode: "create" });
  } else if (!wantsNew && handledNew) {
    setHandledNew(false);
  }

  useEffect(() => {
    if (wantsNew) {
      router.replace("/kanban");
    }
  }, [wantsNew, router]);

  const isMobile = useIsMobile();
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 8 } });
  const sensors = useSensors(...(isMobile ? [] : [pointerSensor]));
  const { overdueLeads, now } = useOverdueLeads(leads);

  const leadsByStatus = useMemo(() => {
    const map = new Map<StatusKanban, Lead[]>();
    for (const status of STATUS_KANBAN_ORDEM) map.set(status, []);
    for (const lead of leads) map.get(lead.status_kanban)?.push(lead);
    return map;
  }, [leads]);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) ?? null : null;

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

  async function moveLeadToFase(leadId: string, novaFase: StatusKanban) {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.status_kanban === novaFase) return;

    const faseAnterior = lead.status_kanban;
    patchLead(leadId, { status_kanban: novaFase });

    try {
      await updateLeadFase(leadId, faseAnterior, novaFase);
    } catch {
      patchLead(leadId, { status_kanban: faseAnterior });
      setErrorMessage("Não foi possível mover o lead. Tente novamente.");
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const novaFase = over.id as StatusKanban;
    if (!STATUS_KANBAN_ORDEM.includes(novaFase)) return;

    moveLeadToFase(String(active.id), novaFase);
  }

  return (
    <div className="flex h-dvh flex-col">
      {errorMessage && (
        <div className="flex items-center justify-between border-b border-red-200 bg-red-50 px-6 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
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

      <div className="hidden md:block">
        <NotificationQueue
          overdueLeads={overdueLeads}
          now={now}
          onPatch={patchLead}
          onError={setErrorMessage}
          onOpen={openFicha}
        />
      </div>

      <DndContext
        id="kanban-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 snap-x snap-mandatory md:snap-none">
          <div className="flex h-full gap-4 md:min-w-max">
            {overdueLeads.length > 0 && (
              <NotificationColumn
                overdueLeads={overdueLeads}
                now={now}
                onPatch={patchLead}
                onError={setErrorMessage}
                onOpen={openFicha}
              />
            )}
            {STATUS_KANBAN_ORDEM.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                label={STATUS_KANBAN_LABELS[status]}
                leads={leadsByStatus.get(status) ?? []}
                onPatch={patchLead}
                onError={setErrorMessage}
                onOpen={openFicha}
                onChangeFase={moveLeadToFase}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeLead && <LeadCardBody lead={activeLead} dragging />}
        </DragOverlay>
      </DndContext>

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
        open={detail.mode === "create" || detail.mode === "edit"}
        onCancel={cancelForm}
        onCreated={(novoLead) => {
          setLeads((prev) => [novoLead, ...prev]);
          closeLeadDetail();
        }}
        onPatched={(leadId, patch) => {
          patchLead(leadId, patch);
          closeLeadDetail();
        }}
        onError={setErrorMessage}
      />
    </div>
  );
}
