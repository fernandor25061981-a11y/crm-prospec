import type { TemperaturaGmn, TemperaturaSite } from "@/types/database";

export type LeadFormState = {
  nome: string;
  categoria: string;
  idade_negocio: string;
  cidade: string;
  telefone_fixo: string;
  whatsapp: string;
  recepcionista: string;
  responsavel: string;
  maps_url: string;
  website_url: string;
  temperatura_site: TemperaturaSite;
  temperatura_gmn: TemperaturaGmn;
  proximo_contato: string;
};
