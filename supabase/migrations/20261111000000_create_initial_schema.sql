-- supabase/migrations/20261111000000_create_initial_schema.sql
--
-- Schema inicial do PSI Tracker.
-- Todas as tabelas pertencem a um usuário (user_id -> auth.users) e são
-- protegidas por Row Level Security: cada pessoa só enxerga os próprios dados.
--
-- Como as frentes se conectam:
--   patient_profiles   1 ─── 1  auth.users
--   medications        N ─── 1  auth.users
--   medication_intakes N ─── 1  medications           (calendário: tomei ou não o remédio)
--   diagnoses          N ─── 1  auth.users            (transtornos investigados/confirmados)
--   session_packages   N ─── 1  auth.users            (pacote de R$ 900)
--   therapy_sessions   N ─── 1  session_packages      (cada sessão realizada dá baixa de R$ 225)
--   notebook_pages     N ─── 1  therapy_sessions      (anotação pode ser ligada a uma sessão)
--   daily_logs         N ─── 1  auth.users            (calendário: humor e menstruação)

-- =============================================================================
-- Tipos enumerados
-- =============================================================================

create type public.diagnosis_status as enum (
  'under_investigation', -- em investigação
  'confirmed',           -- comprovado
  'ruled_out'            -- descartado
);

create type public.therapy_session_status as enum (
  'scheduled',   -- a realizar
  'completed',   -- realizada
  'rescheduled', -- reagendada
  'cancelled'    -- cancelada
);

create type public.menstrual_flow_intensity as enum (
  'spotting', -- escape
  'light',    -- leve
  'medium',   -- moderado
  'heavy'     -- intenso
);

-- =============================================================================
-- Função utilitária: mantém a coluna updated_at sempre atualizada
-- =============================================================================

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- Perfil do paciente
-- =============================================================================

create table public.patient_profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  birth_date  date,          -- a idade é calculada a partir daqui, nunca salva
  weight_kg   numeric(5, 2) check (weight_kg > 0),
  gender      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Cria o perfil vazio automaticamente quando um usuário se cadastra
create or replace function public.create_patient_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.patient_profiles (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created_create_patient_profile
  after insert on auth.users
  for each row execute function public.create_patient_profile_for_new_user();

-- =============================================================================
-- Remédios e registro de tomada
-- =============================================================================

create table public.medications (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name                 text not null,
  dosage_amount        numeric(10, 2) not null check (dosage_amount > 0), -- ex.: 50
  dosage_unit          text not null,                                     -- ex.: mg, gotas, comprimido
  doses_per_day        smallint not null default 1 check (doses_per_day > 0),
  frequency_description text,                                             -- ex.: "1 de manhã e 1 à noite"
  started_on           date,
  ended_on             date,
  is_active            boolean not null default true,
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint medications_end_after_start check (ended_on is null or started_on is null or ended_on >= started_on)
);

create table public.medication_intakes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  medication_id  uuid not null references public.medications (id) on delete cascade,
  intake_date    date not null,
  was_taken      boolean not null,
  doses_taken    smallint not null default 1 check (doses_taken >= 0),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint medication_intakes_one_per_day unique (medication_id, intake_date)
);

-- =============================================================================
-- Transtornos (investigados e comprovados)
-- =============================================================================

create table public.diagnoses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name           text not null,
  status         public.diagnosis_status not null default 'under_investigation',
  diagnosed_on   date,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- =============================================================================
-- Financeiro: pacotes de sessões
-- Valores monetários são guardados em CENTAVOS (inteiro) para evitar erros
-- de arredondamento: R$ 900,00 = 90000 | R$ 225,00 = 22500
-- =============================================================================

create table public.session_packages (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null default auth.uid() references auth.users (id) on delete cascade,
  total_amount_cents   integer not null default 90000 check (total_amount_cents > 0),
  session_price_cents  integer not null default 22500 check (session_price_cents > 0),
  paid_on              date not null default current_date,
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- =============================================================================
-- Sessões de terapia
-- =============================================================================

create table public.therapy_sessions (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  session_package_id        uuid references public.session_packages (id) on delete set null,
  scheduled_at              timestamptz not null,
  status                    public.therapy_session_status not null default 'scheduled',
  rescheduled_from_session_id uuid references public.therapy_sessions (id) on delete set null,
  notes                     text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

-- Saldo de cada pacote: somente sessões REALIZADAS dão baixa no valor pago.
-- security_invoker faz a view respeitar o RLS de quem consulta.
create view public.session_package_balances
with (security_invoker = true)
as
select
  session_package.id                                              as session_package_id,
  session_package.user_id,
  session_package.paid_on,
  session_package.total_amount_cents,
  session_package.session_price_cents,
  count(therapy_session.id)::integer                              as completed_sessions_count,
  (count(therapy_session.id) * session_package.session_price_cents)::integer
                                                                  as used_amount_cents,
  (session_package.total_amount_cents
    - count(therapy_session.id) * session_package.session_price_cents)::integer
                                                                  as remaining_amount_cents,
  (session_package.total_amount_cents / session_package.session_price_cents
    - count(therapy_session.id))::integer                         as remaining_sessions_count
from public.session_packages as session_package
left join public.therapy_sessions as therapy_session
  on therapy_session.session_package_id = session_package.id
 and therapy_session.status = 'completed'
group by session_package.id;

-- =============================================================================
-- Caderno (estilo Notion): páginas aninhadas, opcionalmente ligadas a uma sessão
-- =============================================================================

create table public.notebook_pages (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null default auth.uid() references auth.users (id) on delete cascade,
  parent_page_id      uuid references public.notebook_pages (id) on delete cascade,
  therapy_session_id  uuid references public.therapy_sessions (id) on delete set null,
  title               text not null default 'Sem título',
  icon                text,
  content             jsonb not null default '[]'::jsonb, -- blocos do editor
  is_archived         boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- =============================================================================
-- Diário / calendário: humor e ciclo menstrual (um registro por dia)
-- =============================================================================

create table public.daily_logs (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  log_date                  date not null,
  mood_score                smallint check (mood_score between 1 and 5), -- 1 = muito mal, 5 = muito bem
  mood_notes                text,
  is_menstruating           boolean not null default false,
  menstrual_flow_intensity  public.menstrual_flow_intensity,
  notes                     text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  constraint daily_logs_one_per_day unique (user_id, log_date),
  constraint daily_logs_flow_requires_menstruation
    check (menstrual_flow_intensity is null or is_menstruating)
);

-- =============================================================================
-- Índices para as consultas mais comuns
-- =============================================================================

create index medications_user_id_idx              on public.medications (user_id);
create index medication_intakes_user_date_idx     on public.medication_intakes (user_id, intake_date);
create index diagnoses_user_id_idx                on public.diagnoses (user_id);
create index session_packages_user_id_idx         on public.session_packages (user_id);
create index therapy_sessions_user_scheduled_idx  on public.therapy_sessions (user_id, scheduled_at);
create index therapy_sessions_package_idx         on public.therapy_sessions (session_package_id);
create index notebook_pages_user_parent_idx       on public.notebook_pages (user_id, parent_page_id);
create index notebook_pages_session_idx           on public.notebook_pages (therapy_session_id);

-- =============================================================================
-- Triggers de updated_at e Row Level Security
-- =============================================================================

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'patient_profiles',
    'medications',
    'medication_intakes',
    'diagnoses',
    'session_packages',
    'therapy_sessions',
    'notebook_pages',
    'daily_logs'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at_timestamp()',
      table_name
    );

    execute format('alter table public.%I enable row level security', table_name);

    execute format(
      'create policy "Owner can manage own rows" on public.%I
         for all to authenticated
         using ((select auth.uid()) = user_id)
         with check ((select auth.uid()) = user_id)',
      table_name
    );
  end loop;
end;
$$;
