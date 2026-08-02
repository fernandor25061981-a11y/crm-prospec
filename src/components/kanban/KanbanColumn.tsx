"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Lead, StatusKanban } from "@/types/database";
import { LeadCard } from "./LeadCard";

export function KanbanColumn({
  status,
  label,
  leads,
  ultimasInteracoes,
  onPatch,
  onError,
  onOpen,
  onChangeFase,
}: {
  status: StatusKanban;
  label: string;
  leads: Lead[];
  ultimasInteracoes: Map<string, string>;
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onOpen: (lead: Lead) => void;
  onChangeFase: (leadId: string, novaFase: StatusKanban) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex h-full w-[calc(100vw-3rem)] shrink-0 snap-center flex-col rounded-lg border border-line md:w-72 md:snap-none">
      <div className="flex items-center justify-center gap-2 border-b border-line px-3 py-2">
        <h2 className="text-center text-lg font-semibold">{label}</h2>
        <span className="min-w-6 rounded-full bg-hover px-1.5 py-0.5 text-center text-base font-bold leading-tight tabular-nums text-foreground">
          {leads.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto p-2 ${
          isOver ? "bg-accent-soft" : ""
        }`}
      >
        {leads.length === 0 && (
          <p className="px-1 py-4 text-center text-xs text-faint">Nenhum lead</p>
        )}
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            fallbackTexto={ultimasInteracoes.get(lead.id) ?? null}
            onPatch={(patch) => onPatch(lead.id, patch)}
            onError={onError}
            onOpen={onOpen}
            onChangeFase={(novaFase) => onChangeFase(lead.id, novaFase)}
          />
        ))}
      </div>
    </div>
  );
}
