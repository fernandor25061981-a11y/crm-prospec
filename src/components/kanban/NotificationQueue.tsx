"use client";

import type { Lead } from "@/types/database";
import { NotificationCard } from "./NotificationCard";

export function NotificationQueue({
  overdueLeads,
  now,
  ultimasInteracoes,
  onPatch,
  onError,
  onOpen,
}: {
  overdueLeads: Array<Lead & { proximo_contato: string }>;
  now: number;
  ultimasInteracoes: Map<string, string>;
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onOpen: (lead: Lead) => void;
}) {
  if (overdueLeads.length === 0) return null;

  return (
    <div className="border-b border-line bg-red-50/60 px-6 py-3 dark:bg-red-950/20">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-semibold text-red-700 dark:text-red-400">
          Fila de Notificações
        </span>
        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900 dark:text-red-300">
          {overdueLeads.length}
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {overdueLeads.map((lead) => (
          <NotificationCard
            key={lead.id}
            lead={lead}
            now={now}
            fallbackTexto={ultimasInteracoes.get(lead.id) ?? null}
            onPatch={onPatch}
            onError={onError}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}
