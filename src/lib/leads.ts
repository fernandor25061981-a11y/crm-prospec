import type { Lead } from "@/types/database";

export function getLembreteDisplay(
  lead: Pick<Lead, "lembrete">,
  ultimaInteracao?: string | null
): string | null {
  return lead.lembrete || ultimaInteracao || null;
}
