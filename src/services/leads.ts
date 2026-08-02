import { supabase } from "@/utils/supabase";
import { STATUS_KANBAN_LABELS } from "@/lib/kanban";
import type {
  Interacao,
  InteracaoTipo,
  Lead,
  LeadInsert,
  LeadUpdate,
  StatusKanban,
} from "@/types/database";

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getLeadById(leadId: string): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createLead(lead: LeadInsert): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

const TAMANHO_LOTE = 500;

/**
 * Insere em lotes porque uma importação grande estoura o limite de payload.
 * O Postgres derruba o lote inteiro em qualquer linha inválida, então quem chama
 * precisa validar antes (é o que `analisarCsv` faz).
 */
export async function createLeads(leads: LeadInsert[]): Promise<Lead[]> {
  const criados: Lead[] = [];

  for (let i = 0; i < leads.length; i += TAMANHO_LOTE) {
    const { data, error } = await supabase
      .from("leads")
      .insert(leads.slice(i, i + TAMANHO_LOTE))
      .select();

    if (error) throw new Error(error.message);
    criados.push(...data);
  }

  return criados;
}

export async function updateLead(leadId: string, patch: LeadUpdate): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update(patch)
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLead(leadId: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", leadId);
  if (error) throw new Error(error.message);
}

export async function getInteracoes(leadId: string): Promise<Interacao[]> {
  const { data, error } = await supabase
    .from("interacoes")
    .select("*")
    .eq("lead_id", leadId)
    .order("data_criacao", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateLeadFase(
  leadId: string,
  faseAnterior: StatusKanban,
  novaFase: StatusKanban
): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update({ status_kanban: novaFase })
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  const { error: interacaoError } = await supabase.from("interacoes").insert({
    lead_id: leadId,
    tipo: "mudanca_fase",
    descricao: `${STATUS_KANBAN_LABELS[faseAnterior]} → ${STATUS_KANBAN_LABELS[novaFase]}`,
  });

  if (interacaoError) throw new Error(interacaoError.message);

  return data;
}

export async function updateAgendamento(
  leadId: string,
  proximoContato: string | null,
  lembrete: string | null
): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update({ proximo_contato: proximoContato, lembrete })
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getUltimasInteracoesRegistradas(
  leadIds: string[]
): Promise<Map<string, string>> {
  if (leadIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("interacoes")
    .select("lead_id, descricao, data_criacao")
    .in("lead_id", leadIds)
    .in("tipo", ["ligacao", "whatsapp"])
    .order("data_criacao", { ascending: false });

  if (error) throw new Error(error.message);

  const map = new Map<string, string>();
  for (const row of data) {
    if (!map.has(row.lead_id) && row.descricao) map.set(row.lead_id, row.descricao);
  }
  return map;
}

export async function addAnotacaoManual(
  leadId: string,
  tipo: Extract<InteracaoTipo, "ligacao" | "whatsapp">,
  descricao: string
): Promise<Interacao> {
  const { data, error } = await supabase
    .from("interacoes")
    .insert({ lead_id: leadId, tipo, descricao })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
