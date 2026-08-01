import type { TemperaturaGmn, TemperaturaSite } from "@/types/database";

export const TEMPERATURA_SITE_LABELS: Record<TemperaturaSite, string> = {
  sem_site: "Site: sem site",
  incompleto: "Site: incompleto",
  ranqueado: "Site: ranqueado",
};

export const TEMPERATURA_GMN_LABELS: Record<TemperaturaGmn, string> = {
  sem_perfil: "GMN: sem perfil",
  abandonado: "GMN: abandonado",
  otimizado: "GMN: otimizado",
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
