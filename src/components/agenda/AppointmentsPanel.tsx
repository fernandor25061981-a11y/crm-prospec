import { STATUS_KANBAN_LABELS } from "@/lib/kanban";
import type { Lead } from "@/types/database";

function formatHorario(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(new Date(iso));
}

export function AppointmentsPanel({
  title,
  subtitle,
  leads,
  onOpenLead,
  emptyMessage = "Nenhum compromisso agendado.",
}: {
  title: string;
  subtitle?: string;
  leads: Lead[];
  onOpenLead: (lead: Lead) => void;
  emptyMessage?: string;
}) {
  return (
    <div className="rounded-md border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-900">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</span>
        )}
      </div>

      {leads.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-600">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {leads.map((lead) => {
            const overdue = lead.proximo_contato
              ? new Date(lead.proximo_contato).getTime() < new Date().getTime()
              : false;

            return (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => onOpenLead(lead)}
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-black/[.06] px-3 py-2 text-left hover:bg-black/[.04] dark:border-white/[.08] dark:hover:bg-white/[.06]"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {lead.nome}
                  </span>
                  <span
                    className={`shrink-0 text-xs font-medium ${
                      overdue
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {lead.proximo_contato ? formatHorario(lead.proximo_contato) : "--:--"}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                    {STATUS_KANBAN_LABELS[lead.status_kanban]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
