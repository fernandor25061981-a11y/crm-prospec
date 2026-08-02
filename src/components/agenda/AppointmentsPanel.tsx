import { STATUS_KANBAN_LABELS } from "@/lib/kanban";
import { FOCUS_RING } from "@/lib/ui";
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
    <div className="rounded-md border border-line bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle && <span className="text-xs text-faint">{subtitle}</span>}
      </div>

      {leads.length === 0 ? (
        <p className="mt-2 text-sm text-faint">{emptyMessage}</p>
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
                  className={`flex w-full items-center justify-between gap-3 rounded-md border border-line-soft px-3 py-2 text-left hover:bg-hover ${FOCUS_RING}`}
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{lead.nome}</span>
                  <span
                    className={`shrink-0 text-xs font-medium ${
                      overdue ? "text-red-600 dark:text-red-400" : "text-faint"
                    }`}
                  >
                    {lead.proximo_contato ? formatHorario(lead.proximo_contato) : "--:--"}
                  </span>
                  <span className="shrink-0 text-xs text-faint">
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
