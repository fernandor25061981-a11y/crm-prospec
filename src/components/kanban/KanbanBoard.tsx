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
import { BuscaModal } from "@/components/busca/BuscaModal";
import { CsvModal } from "@/components/csv/CsvModal";
import { LeadFichaModal } from "@/components/lead-detail/LeadFichaModal";
import { LeadFormModal } from "@/components/lead-detail/LeadFormModal";
import { STATUS_KANBAN_LABELS, STATUS_KANBAN_ORDEM } from "@/lib/kanban";
import { deleteLead, getUltimasInteracoesRegistradas, updateLeadFase } from "@/services/leads";
import type { Lead, StatusKanban } from "@/types/database";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCardBody } from "./LeadCardBody";
import { NotificationColumn } from "./NotificationColumn";

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
  const [ultimasInteracoes, setUltimasInteracoes] = useState<Map<string, string>>(new Map());
  const wantsNew = searchParams.get("new") === "1";
  const wantsCsv = searchParams.get("csv") === "1";
  const wantsBusca = searchParams.get("busca") === "1";
  const [detail, setDetail] = useState<DetailState>(() =>
    wantsNew ? { mode: "create" } : { mode: "closed" }
  );
  const [handledNew, setHandledNew] = useState(wantsNew);
  const [csvOpen, setCsvOpen] = useState(wantsCsv);
  const [handledCsv, setHandledCsv] = useState(wantsCsv);
  const [buscaOpen, setBuscaOpen] = useState(wantsBusca);
  const [handledBusca, setHandledBusca] = useState(wantsBusca);

  if (wantsNew && !handledNew) {
    setHandledNew(true);
    setDetail({ mode: "create" });
  } else if (!wantsNew && handledNew) {
    setHandledNew(false);
  }

  if (wantsCsv && !handledCsv) {
    setHandledCsv(true);
    setCsvOpen(true);
  } else if (!wantsCsv && handledCsv) {
    setHandledCsv(false);
  }

  if (wantsBusca && !handledBusca) {
    setHandledBusca(true);
    setBuscaOpen(true);
  } else if (!wantsBusca && handledBusca) {
    setHandledBusca(false);
  }

  useEffect(() => {
    if (wantsNew || wantsCsv || wantsBusca) {
      router.replace("/kanban");
    }
  }, [wantsNew, wantsCsv, wantsBusca, router]);

  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 8 } });
  // Quantidade de sensores precisa ser constante: o dnd-kit usa sensors.map() como deps de efeito.
  // O drag no mobile continua desativado porque LeadCard não anexa os listeners nesse caso.
  const sensors = useSensors(pointerSensor);

  const leadIdsKey = useMemo(() => leads.map((l) => l.id).join(","), [leads]);

  useEffect(() => {
    let cancelled = false;
    getUltimasInteracoesRegistradas(leadIdsKey ? leadIdsKey.split(",") : [])
      .then((map) => {
        if (!cancelled) setUltimasInteracoes(map);
      })
      .catch(() => {
        // Não bloqueia o board por um dado secundário; cards ficam sem fallback de lembrete.
      });
    return () => {
      cancelled = true;
    };
  }, [leadIdsKey]);

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

      <DndContext
        id="kanban-board"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory md:snap-none">
          {/* O padding fica na linha, não no container de scroll: o padding-right de um
              container rolável é ignorado no fim do scroll e cortava a última coluna.
              O min-w-max é a outra metade da correção — sem ele a linha fica presa na
              largura da viewport, as colunas transbordam a caixa dela e o padding-right
              volta a ficar de fora da área rolável. Vale nos dois breakpoints. */}
          <div className="flex h-full gap-4 p-6 min-w-max">
            {/* Renderiza sempre: a coluna some sozinha (retorna null) quando não há
                atrasado. É ela que hospeda o relógio de 20s — subir esse estado para
                cá faria o quadro inteiro, e a ficha aberta junto, repintar a cada tique. */}
            <NotificationColumn
              leads={leads}
              ultimasInteracoes={ultimasInteracoes}
              onPatch={patchLead}
              onError={setErrorMessage}
              onOpen={openFicha}
            />

            {STATUS_KANBAN_ORDEM.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                label={STATUS_KANBAN_LABELS[status]}
                leads={leadsByStatus.get(status) ?? []}
                ultimasInteracoes={ultimasInteracoes}
                onPatch={patchLead}
                onError={setErrorMessage}
                onOpen={openFicha}
                onChangeFase={moveLeadToFase}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeLead && (
            <LeadCardBody
              lead={activeLead}
              dragging
              fallbackTexto={ultimasInteracoes.get(activeLead.id) ?? null}
            />
          )}
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

      <BuscaModal
        open={buscaOpen}
        onClose={() => setBuscaOpen(false)}
        leads={leads}
        onSelect={(lead) => {
          setBuscaOpen(false);
          openFicha(lead);
        }}
      />

      <CsvModal
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        leads={leads}
        onImported={(novos) => setLeads((prev) => [...novos, ...prev])}
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
