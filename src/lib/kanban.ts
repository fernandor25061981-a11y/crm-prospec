import type { StatusKanban } from "@/types/database";

export const STATUS_KANBAN_LABELS: Record<StatusKanban, string> = {
  lead_novo: "Lead novo",
  nao_atendeu: "Não atendeu",
  atendente: "Atendente",
  responsavel: "Responsável",
  apresentacao: "Apresentação",
  follow_up: "Follow up",
  whatsapp: "Whatsapp",
};

export const STATUS_KANBAN_ORDEM: StatusKanban[] = [
  "lead_novo",
  "nao_atendeu",
  "atendente",
  "responsavel",
  "apresentacao",
  "follow_up",
  "whatsapp",
];
