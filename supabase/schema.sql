-- CRM de Prospecção — Schema inicial
-- Colar este script no SQL Editor do painel Supabase (Project > SQL Editor > New query).
-- Idempotente: pode ser rodado mais de uma vez sem duplicar objetos.

-- ============================================================
-- Extensões
-- ============================================================
create extension if not exists pgcrypto;

-- ============================================================
-- Enums
-- ============================================================
do $$ begin
  create type status_kanban_enum as enum (
    'lead_novo',
    'nao_atendeu',
    'atendente',
    'responsavel',
    'apresentacao',
    'follow_up',
    'whatsapp'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type temperatura_site_enum as enum (
    'sem_site',
    'incompleto',
    'ranqueado'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type temperatura_gmn_enum as enum (
    'sem_perfil',
    'abandonado',
    'otimizado'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type interacao_tipo_enum as enum (
    'mudanca_fase',
    'ligacao',
    'whatsapp'
  );
exception when duplicate_object then null; end $$;

-- ============================================================
-- Tabela: leads
-- ============================================================
create table if not exists leads (
  id                uuid primary key default gen_random_uuid(),
  nome              text not null,
  categoria         text,
  idade_negocio     text,
  maps_url          text,
  website_url       text,
  telefone_fixo     text,
  whatsapp          text,
  cidade            text,
  recepcionista     text,
  responsavel       text,
  status_kanban     status_kanban_enum not null default 'lead_novo',
  temperatura_site  temperatura_site_enum not null default 'sem_site',
  temperatura_gmn   temperatura_gmn_enum not null default 'sem_perfil',
  proximo_contato   timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists leads_status_kanban_idx on leads (status_kanban);
create index if not exists leads_proximo_contato_idx on leads (proximo_contato);

-- ============================================================
-- Tabela: interacoes
-- ============================================================
create table if not exists interacoes (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid not null references leads (id) on delete cascade,
  tipo          interacao_tipo_enum not null,
  descricao     text,
  data_criacao  timestamptz not null default now()
);

create index if not exists interacoes_lead_id_idx on interacoes (lead_id);

-- ============================================================
-- Trigger: manter leads.updated_at atualizado
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on leads;
create trigger leads_set_updated_at
  before update on leads
  for each row
  execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- Sistema é single-user por enquanto: RLS habilitado com policy
-- aberta para permitir todas as operações via chave anon/service_role.
-- TODO: restringir por owner_id quando auth multi-usuário for implementado.
-- ============================================================
alter table leads enable row level security;
alter table interacoes enable row level security;

drop policy if exists "leads_allow_all" on leads;
create policy "leads_allow_all" on leads
  for all
  using (true)
  with check (true);

drop policy if exists "interacoes_allow_all" on interacoes;
create policy "interacoes_allow_all" on interacoes
  for all
  using (true)
  with check (true);
