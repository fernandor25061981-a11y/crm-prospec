// Tipagens espelhando supabase/schema.sql

export type StatusKanban =
  | "lead_novo"
  | "nao_atendeu"
  | "atendente"
  | "responsavel"
  | "apresentacao"
  | "follow_up"
  | "whatsapp";

export type TemperaturaSite = "sem_site" | "incompleto" | "ranqueado";

export type TemperaturaGmn = "sem_perfil" | "abandonado" | "otimizado";

export type InteracaoTipo = "mudanca_fase" | "ligacao" | "whatsapp";

export type Lead = {
  id: string;
  nome: string;
  categoria: string | null;
  idade_negocio: string | null;
  maps_url: string | null;
  website_url: string | null;
  telefone_fixo: string | null;
  whatsapp: string | null;
  cidade: string | null;
  recepcionista: string | null;
  responsavel: string | null;
  status_kanban: StatusKanban;
  temperatura_site: TemperaturaSite;
  temperatura_gmn: TemperaturaGmn;
  proximo_contato: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadInsert = Omit<Lead, "id" | "created_at" | "updated_at"> &
  Partial<Pick<Lead, "id" | "created_at" | "updated_at">>;

export type LeadUpdate = Partial<LeadInsert>;

export type Interacao = {
  id: string;
  lead_id: string;
  tipo: InteracaoTipo;
  descricao: string | null;
  data_criacao: string;
};

export type InteracaoInsert = Omit<Interacao, "id" | "data_criacao"> &
  Partial<Pick<Interacao, "id" | "data_criacao">>;

export type InteracaoUpdate = Partial<InteracaoInsert>;

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
        Relationships: [];
      };
      interacoes: {
        Row: Interacao;
        Insert: InteracaoInsert;
        Update: InteracaoUpdate;
        Relationships: [
          {
            foreignKeyName: "interacoes_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      status_kanban_enum: StatusKanban;
      temperatura_site_enum: TemperaturaSite;
      temperatura_gmn_enum: TemperaturaGmn;
      interacao_tipo_enum: InteracaoTipo;
    };
  };
}
