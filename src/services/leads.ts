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

export async function updateProximoContato(
  leadId: string,
  proximoContato: string | null
): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update({ proximo_contato: proximoContato })
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
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
