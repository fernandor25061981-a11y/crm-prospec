"use client";

import { useOverdueLeads } from "@/hooks/useOverdueLeads";
import type { Lead } from "@/types/database";
import { NotificationCard } from "./NotificationCard";

// O relógio de atrasados mora aqui, e não no KanbanBoard, porque o tique de 20s
// re-renderiza quem o hospeda: lá em cima ele repintava a ficha aberta a cada
// tique e derrubava o cursor de quem estivesse digitando nela.
export function NotificationColumn({
  leads,
  ultimasInteracoes,
  onPatch,
  onError,
  onOpen,
}: {
  leads: Lead[];
  ultimasInteracoes: Map<string, string>;
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onOpen: (lead: Lead) => void;
}) {
  const { overdueLeads, now } = useOverdueLeads(leads);

  if (overdueLeads.length === 0) return null;

  return (
    <div className="flex h-full w-[calc(100vw-3rem)] shrink-0 snap-center flex-col rounded-lg border border-line-danger md:w-96 md:snap-none">
      <div className="flex items-center justify-center gap-2 border-b border-line-danger px-3 py-2">
        <h2 className="text-center text-lg font-semibold text-red-700 dark:text-red-400">
          Fila de Notificações
        </h2>
        <span className="min-w-6 rounded-full bg-red-100 px-1.5 py-0.5 text-center text-base font-bold leading-tight tabular-nums text-red-700 dark:bg-red-900 dark:text-red-200">
          {overdueLeads.length}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto bg-red-50/60 p-2 dark:bg-red-950/20">
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
