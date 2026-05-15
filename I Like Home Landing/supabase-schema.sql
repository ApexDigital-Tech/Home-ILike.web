-- I Like Home Supabase schema
-- Run this once in Supabase SQL Editor for project:
-- https://gugcasbyewqvjqiiucnw.supabase.co

create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  operation text default 'Venta',
  status text default 'Disponible',
  featured boolean default false,
  property_type text,
  zone text,
  address text,
  price numeric default 0,
  bedrooms int default 0,
  bathrooms int default 0,
  parking int default 0,
  built_area numeric default 0,
  lot_area numeric default 0,
  description text,
  features text,
  commercial_notes text,
  agent_name text,
  agent_whatsapp text,
  photos jsonb default '[]'::jsonb
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  phone text,
  interest text,
  zone text,
  property_type text,
  budget text,
  source text default 'Web'
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text not null,
  phone text,
  date date,
  time time,
  appointment_type text,
  notes text,
  status text default 'Pendiente'
);

create table if not exists public.team_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  owner text,
  due_date date,
  status text default 'Pendiente'
);

create table if not exists public.company_policies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  content text not null,
  updated_by text
);

alter table public.properties enable row level security;
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.team_tasks enable row level security;
alter table public.company_policies enable row level security;

drop policy if exists "Public read properties" on public.properties;
create policy "Public read properties"
on public.properties for select
to anon, authenticated
using (true);

drop policy if exists "Public insert properties" on public.properties;
create policy "Public insert properties"
on public.properties for insert
to anon, authenticated
with check (true);

drop policy if exists "Public insert leads" on public.leads;
create policy "Public insert leads"
on public.leads for insert
to anon, authenticated
with check (true);

drop policy if exists "Public read leads" on public.leads;
create policy "Public read leads"
on public.leads for select
to anon, authenticated
using (true);

drop policy if exists "Public insert appointments" on public.appointments;
create policy "Public insert appointments"
on public.appointments for insert
to anon, authenticated
with check (true);

drop policy if exists "Public read appointments" on public.appointments;
create policy "Public read appointments"
on public.appointments for select
to anon, authenticated
using (true);

drop policy if exists "Public manage team tasks" on public.team_tasks;
create policy "Public manage team tasks"
on public.team_tasks for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Public manage company policies" on public.company_policies;
create policy "Public manage company policies"
on public.company_policies for all
to anon, authenticated
using (true)
with check (true);
