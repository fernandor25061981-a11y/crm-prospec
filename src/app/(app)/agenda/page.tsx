import { AgendaBoard } from "@/components/agenda/AgendaBoard";
import { getLeads } from "@/services/leads";

export default async function AgendaPage() {
  const leads = await getLeads();

  return <AgendaBoard initialLeads={leads} />;
}
