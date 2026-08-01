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
import { LeadDetailModal } from "@/components/lead-detail/LeadDetailModal";
import { STATUS_KANBAN_LABELS, STATUS_KANBAN_ORDEM } from "@/lib/kanban";
import { updateLeadFase } from "@/services/leads";
import type { Lead, StatusKanban } from "@/types/database";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCardBody } from "./LeadCardBody";
import { NotificationQueue } from "./NotificationQueue";

type DetailState = { mode: "closed" } | { mode: "edit"; lead: Lead } | { mode: "create" };

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailState>(() =>
    searchParams.get("new") === "1" ? { mode: "create" } : { mode: "closed" }
  );

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setDetail({ mode: "create" });
      router.replace("/kanban");
    }
  }, [searchParams, router]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const leadsByStatus = useMemo(() => {
    const map = new Map<StatusKanban, Lead[]>();
    for (const status of STATUS_KANBAN_ORDEM) map.set(status, []);
    for (const lead of leads) map.get(lead.status_kanban)?.push(lead);
    return map;
  }, [leads]);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) ?? null : null;

  function patchLead(leadId: string, patch: Partial<Lead>) {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...patch } : l)));
  }

  function openLeadDetail(lead: Lead) {
    setDetail({ mode: "edit", lead });
  }

  function closeLeadDetail() {
    setDetail({ mode: "closed" });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const novaFase = over.id as StatusKanban;
    if (!STATUS_KANBAN_ORDEM.includes(novaFase)) return;

    const leadId = String(active.id);
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

      <NotificationQueue leads={leads} onPatch={patchLead} onError={setErrorMessage} />

      <DndContext
        id="kanban-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          <div className="flex h-full min-w-max gap-4">
            {STATUS_KANBAN_ORDEM.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                label={STATUS_KANBAN_LABELS[status]}
                leads={leadsByStatus.get(status) ?? []}
                onPatch={patchLead}
                onError={setErrorMessage}
                onOpen={openLeadDetail}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeLead && <LeadCardBody lead={activeLead} dragging />}
        </DragOverlay>
      </DndContext>

      <LeadDetailModal
        lead={detail.mode === "edit" ? detail.lead : null}
        open={detail.mode !== "closed"}
        onClose={closeLeadDetail}
        onCreated={(novoLead) => {
          setLeads((prev) => [novoLead, ...prev]);
          closeLeadDetail();
        }}
        onPatched={patchLead}
        onError={setErrorMessage}
      />
    </div>
  );
}
