-- ============================================================
-- Campus FIAP — Schema inicial
-- ============================================================

-- -------------------------------------------------------
-- 1. USERS
-- Espelha auth.users. Criado automaticamente via trigger.
-- -------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text        not null default '',
  email       text        not null,
  course      text        not null default 'Tecnologia',
  bio         text,
  skills      text[]      not null default '{}',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger: cria row em public.users ao registrar no auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------
-- 2. PROJECTS
-- -------------------------------------------------------
create table if not exists public.projects (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  description text        not null default '',
  scope       text        not null default '',
  reward      text        not null default '',
  company     text        not null,
  slots       int         not null default 4 check (slots between 2 and 10),
  skills      text[]      not null default '{}',
  status      text        not null default 'active' check (status in ('active', 'full', 'closed')),
  author_id   uuid        not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index em author_id (FK) — evita full scan em cascades e joins
create index if not exists projects_author_id_idx on public.projects (author_id);
-- Index em status — filtragem frequente por projetos ativos
create index if not exists projects_status_idx on public.projects (status);
-- Index composto para listagem ordenada
create index if not exists projects_created_at_idx on public.projects (created_at desc);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------
-- 3. MEMBERSHIPS
-- -------------------------------------------------------
create table if not exists public.memberships (
  user_id    uuid        not null references public.users(id) on delete cascade,
  project_id uuid        not null references public.projects(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (user_id, project_id)
);

-- Index em project_id (FK não indexada automaticamente pelo PG)
create index if not exists memberships_project_id_idx on public.memberships (project_id);

-- -------------------------------------------------------
-- 4. VIEW: projects_with_members
-- Agrega membros por projeto — evita N+1 no feed
-- -------------------------------------------------------
create or replace view public.projects_with_members
with (security_invoker = true)
as
select
  p.*,
  count(m.user_id)::int                        as member_count,
  coalesce(
    jsonb_agg(
      jsonb_build_object('name', u.name, 'course', u.course)
      order by m.joined_at
    ) filter (where m.user_id is not null),
    '[]'::jsonb
  )                                             as members
from public.projects p
left join public.memberships m on m.project_id = p.id
left join public.users       u on u.id = m.user_id
group by p.id;

-- -------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- -------------------------------------------------------

alter table public.users       enable row level security;
alter table public.projects    enable row level security;
alter table public.memberships enable row level security;

-- USERS policies
-- Leitura: qualquer autenticado pode ler perfis (necessário para exibir membros)
create policy "users_select_authenticated"
  on public.users for select
  to authenticated
  using (true);

-- Escrita: apenas o próprio usuário
create policy "users_update_own"
  on public.users for update
  to authenticated
  using      ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- PROJECTS policies
-- Leitura: qualquer autenticado
create policy "projects_select_authenticated"
  on public.projects for select
  to authenticated
  using (true);

-- Inserção: qualquer autenticado (author_id deve ser o próprio)
create policy "projects_insert_own"
  on public.projects for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

-- Atualização/deleção: apenas o autor
create policy "projects_update_own"
  on public.projects for update
  to authenticated
  using      ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "projects_delete_own"
  on public.projects for delete
  to authenticated
  using ((select auth.uid()) = author_id);

-- MEMBERSHIPS policies
-- Leitura: qualquer autenticado (para mostrar quem está no projeto)
create policy "memberships_select_authenticated"
  on public.memberships for select
  to authenticated
  using (true);

-- Inserção: apenas o próprio usuário pode entrar
create policy "memberships_insert_own"
  on public.memberships for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Deleção: apenas o próprio usuário pode sair
create policy "memberships_delete_own"
  on public.memberships for delete
  to authenticated
  using ((select auth.uid()) = user_id);
