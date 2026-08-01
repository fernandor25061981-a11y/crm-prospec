import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { getLeads } from "@/services/leads";

export default async function KanbanPage() {
  const leads = await getLeads();

  return <KanbanBoard initialLeads={leads} />;
}
