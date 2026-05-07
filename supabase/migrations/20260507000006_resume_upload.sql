-- ============================================================
-- Campus FIAP — Gestão de Currículo (Milestone 11)
-- Adiciona suporte a upload de PDF de currículo:
--   1. Colunas resume_path / resume_name em public.users
--   2. Bucket privado `resumes` no Supabase Storage
--   3. RLS em storage.objects:
--      - INSERT/UPDATE/DELETE: somente o dono (path inicia com auth.uid())
--      - SELECT: qualquer usuário autenticado (download público interno)
-- ============================================================

-- -------------------------------------------------------
-- 1. Colunas em public.users
-- resume_path: caminho dentro do bucket (ex.: "<uid>/cv-2026.pdf")
-- resume_name: nome original do arquivo, para exibição na UI
-- -------------------------------------------------------
alter table public.users
  add column if not exists resume_path text,
  add column if not exists resume_name text;

-- -------------------------------------------------------
-- 2. Bucket `resumes`
-- Privado (public = false) — leitura sempre passa por RLS.
-- file_size_limit e allowed_mime_types replicam, em camada
-- adicional, a validação que será feita na Server Action.
-- 5 MB = 5 * 1024 * 1024 = 5242880 bytes.
-- -------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  5242880,
  array['application/pdf']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- -------------------------------------------------------
-- 3. RLS em storage.objects para o bucket `resumes`
--
-- Convenção de path: "<auth.uid()>/<arquivo>.pdf".
-- A primeira pasta do path identifica o dono do arquivo —
-- (storage.foldername(name))[1] devolve esse segmento.
--
-- INSERT/UPDATE/DELETE: dono (auth.uid()) tem que bater
-- com o primeiro segmento do path.
-- SELECT: liberado para qualquer authenticated (qualquer
-- estudante/empresa parceira logada pode baixar o CV).
-- -------------------------------------------------------

-- INSERT — apenas o dono pode subir, sob seu próprio prefixo
drop policy if exists "resumes_insert_own" on storage.objects;
create policy "resumes_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- UPDATE — apenas o dono pode atualizar metadados/conteúdo
drop policy if exists "resumes_update_own" on storage.objects;
create policy "resumes_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- DELETE — apenas o dono pode remover o próprio CV
drop policy if exists "resumes_delete_own" on storage.objects;
create policy "resumes_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- SELECT — qualquer authenticated pode ler/baixar
-- (empresas parceiras precisam acessar o CV no perfil público)
drop policy if exists "resumes_select_authenticated" on storage.objects;
create policy "resumes_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'resumes');
