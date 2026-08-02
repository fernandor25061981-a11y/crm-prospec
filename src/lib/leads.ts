import type { Lead } from "@/types/database";

export function getContatoLabel(lead: Pick<Lead, "responsavel" | "recepcionista">): string {
  if (lead.responsavel) return lead.responsavel;
  if (lead.recepcionista) return lead.recepcionista;
  return "Falta contato";
}
