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
    <div className="flex h-full w-[calc(100vw-3rem)] shrink-0 snap-center flex-col rounded-lg border border-black/[.08] md:w-72 md:snap-none dark:border-white/[.145]">
      <div className="relative flex items-center justify-center border-b border-black/[.08] px-3 py-2 dark:border-white/[.145]">
        <h2 className="text-center text-lg font-semibold">{label}</h2>
        <span className="absolute right-3 rounded-full bg-black/[.04] px-2 py-0.5 text-xs text-zinc-500 dark:bg-white/[.08] dark:text-zinc-400">
          {leads.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto p-2 ${
          isOver ? "bg-black/[.03] dark:bg-white/[.05]" : ""
        }`}
      >
        {leads.length === 0 && (
          <p className="px-1 py-4 text-center text-xs text-zinc-400 dark:text-zinc-600">
            Nenhum lead
          </p>
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
