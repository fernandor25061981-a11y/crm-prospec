import type { TemperaturaGmn, TemperaturaSite } from "@/types/database";

export const TEMPERATURA_SITE_LABELS: Record<TemperaturaSite, string> = {
  sem_site: "Sem site",
  incompleto: "Incompleto",
  ranqueado: "Ranqueado",
};

export const TEMPERATURA_GMN_LABELS: Record<TemperaturaGmn, string> = {
  sem_perfil: "Sem perfil",
  abandonado: "Abandonado",
  otimizado: "Otimizado",
};

export const TEMPERATURA_SITE_COLORS: Record<TemperaturaSite, string> = {
  sem_site: "bg-red-500",
  incompleto: "bg-yellow-500",
  ranqueado: "bg-green-500",
};

export const TEMPERATURA_GMN_COLORS: Record<TemperaturaGmn, string> = {
  sem_perfil: "bg-red-500",
  abandonado: "bg-yellow-500",
  otimizado: "bg-green-500",
};
