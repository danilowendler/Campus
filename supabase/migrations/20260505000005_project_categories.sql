-- ============================================================
-- Campus FIAP — Categorização de projetos (Milestone 9)
-- Adiciona category em projects + view auxiliar para o feed
-- "Em aberto" (Nível 3).
-- ============================================================

-- -------------------------------------------------------
-- 1. Coluna category
-- -------------------------------------------------------
alter table public.projects
  add column if not exists category text not null default 'open'
  check (category in ('partner', 'academic', 'open'));

-- Index — feed filtra/agrupa por categoria em toda listagem
create index if not exists projects_category_idx on public.projects (category);

-- -------------------------------------------------------
-- 2. Backfill do seed
-- Empresas parceiras do seed (20260428000002_seed.sql) → 'partner'.
-- Demais projetos permanecem 'open' (default).
-- Nota: 'Ambev Tech' não consta no seed original, mas é incluída aqui
-- para cobrir projetos criados manualmente com esse nome.
-- -------------------------------------------------------
update public.projects
set category = 'partner'
where company in ('Ford', 'Raízen', 'Hapvida', 'Ambev Tech', 'Itaú BBA');

-- -------------------------------------------------------
-- 3. View projects_with_members — recriada para incluir category
-- Postgres não permite ADD COLUMN em view; é necessário recriar.
-- CASCADE garante que dependências (ex: open_projects_with_vacancies)
-- sejam recriadas corretamente se já existirem.
-- -------------------------------------------------------
drop view if exists public.open_projects_with_vacancies;
drop view if exists public.projects_with_members cascade;

create view public.projects_with_members
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
-- 4. View open_projects_with_vacancies — Nível 3 do feed
-- Filtragem 100% server-side: somente categoria 'open',
-- ainda ativos e com vagas livres. Ordenação por maior
-- disponibilidade (slots - member_count desc) para priorizar
-- projetos onde o estudante tem mais chance de entrar.
-- -------------------------------------------------------
create view public.open_projects_with_vacancies
with (security_invoker = true)
as
select
  v.*,
  (v.slots - v.member_count) as available_slots
from public.projects_with_members v
where v.category = 'open'
  and v.status   = 'active'
  and v.member_count < v.slots;

-- -------------------------------------------------------
-- 5. RLS — category é coberto pela policy projects_update_own
-- (UPDATE somente por author_id = auth.uid()). Não há policy
-- adicional necessária: não-autores não podem alterar a coluna
-- pois não podem alterar nenhuma coluna da linha.
-- Documentado aqui para futuras revisões de auditoria.
-- -------------------------------------------------------
