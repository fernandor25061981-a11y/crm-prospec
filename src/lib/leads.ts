import type { Lead } from "@/types/database";

export function getLembreteDisplay(
  lead: Pick<Lead, "lembrete">,
  ultimaInteracao?: string | null
): string | null {
  return lead.lembrete || ultimaInteracao || null;
}

export type ContatoPrincipal = {
  texto: string;
  tipo: "responsavel" | "atendente" | "nenhum";
};

export function getContatoPrincipal(
  lead: Pick<Lead, "responsavel" | "recepcionista">
): ContatoPrincipal {
  if (lead.responsavel) return { texto: lead.responsavel, tipo: "responsavel" };
  if (lead.recepcionista) return { texto: lead.recepcionista, tipo: "atendente" };
  return { texto: "Falta contato", tipo: "nenhum" };
}

export const CONTATO_PRINCIPAL_COLORS: Record<ContatoPrincipal["tipo"], string> = {
  responsavel: "text-green-600 dark:text-green-500",
  atendente: "text-yellow-600 dark:text-yellow-500",
  nenhum: "text-faint",
};
