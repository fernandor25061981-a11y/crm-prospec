import type { Lead } from "@/types/database";
import { NotificationCard } from "./NotificationCard";

export function NotificationColumn({
  overdueLeads,
  now,
  onPatch,
  onError,
  onOpen,
}: {
  overdueLeads: Array<Lead & { proximo_contato: string }>;
  now: number;
  onPatch: (leadId: string, patch: Partial<Lead>) => void;
  onError: (message: string) => void;
  onOpen: (lead: Lead) => void;
}) {
  return (
    <div className="flex h-full w-[calc(100vw-3rem)] shrink-0 snap-center flex-col rounded-lg border border-red-200 md:hidden dark:border-red-900/60">
      <div className="flex items-center gap-2 border-b border-red-200 px-3 py-2 dark:border-red-900/60">
        <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">
          Fila de Notificações
        </h2>
        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900 dark:text-red-300">
          {overdueLeads.length}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto bg-red-50/60 p-2 dark:bg-red-950/20">
        {overdueLeads.map((lead) => (
          <NotificationCard
            key={lead.id}
            lead={lead}
            now={now}
            onPatch={onPatch}
            onError={onError}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}
