import { Suspense } from "react";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { getLeads } from "@/services/leads";

export const dynamic = "force-dynamic";

export default async function KanbanPage() {
  const leads = await getLeads();

  return (
    <Suspense fallback={<div className="p-6 text-sm text-neutral-500">Carregando quadro...</div>}>
      <KanbanBoard initialLeads={leads} />
    </Suspense>
  );
}
