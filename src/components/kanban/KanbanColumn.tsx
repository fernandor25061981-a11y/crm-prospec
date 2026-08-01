"use client";

import { useDroppable } from "@dnd-kit/core";
import type { Lead, StatusKanban } from "@/types/database";
import { LeadCard } from "./LeadCard";

export function KanbanColumn({
  status,
  label,
  leads,
  onPatch,
  onError,
  onOpen,
}: {
  status: StatusKanban;
  label: string;
  leads: Lead[];
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onOpen: (lead: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex h-full w-72 shrink-0 flex-col rounded-lg border border-black/[.08] dark:border-white/[.145]">
      <div className="flex items-center justify-between border-b border-black/[.08] px-3 py-2 dark:border-white/[.145]">
        <h2 className="text-sm font-semibold">{label}</h2>
        <span className="rounded-full bg-black/[.04] px-2 py-0.5 text-xs text-zinc-500 dark:bg-white/[.08] dark:text-zinc-400">
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
            onPatch={(patch) => onPatch(lead.id, patch)}
            onError={onError}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}
