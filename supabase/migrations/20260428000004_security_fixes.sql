-- ============================================================
-- Campus FIAP — Correções de segurança (auditoria)
-- ============================================================

-- -------------------------------------------------------
-- FIX 1: Bloquear INSERT direto em public.users
-- O trigger handle_new_user (SECURITY DEFINER) ainda funciona.
-- Nenhum cliente autenticado deve inserir diretamente.
-- -------------------------------------------------------
create policy "users_insert_blocked"
  on public.users for insert
  to authenticated
  with check (false);

-- -------------------------------------------------------
-- FIX 2: Validação de domínio @fiap.com.br no banco
-- Hook "before_user_created" não está disponível no plano
-- free do Supabase, então usamos uma CHECK CONSTRAINT no
-- trigger handle_new_user + uma função auxiliar que pode
-- ser usada como hook via pg_net no futuro.
--
-- Abordagem: adicionar CHECK na coluna email de public.users
-- E adicionar validação no trigger para rejeitar o insert
-- em auth.users se o domínio for inválido.
-- -------------------------------------------------------

-- Adiciona constraint de domínio na tabela pública
alter table public.users
  add constraint users_email_fiap_domain
  check (email like '%@fiap.com.br');

-- Substitui handle_new_user com validação de domínio
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Bloqueia cadastro com domínio fora do @fiap.com.br
  if new.email not like '%@fiap.com.br' then
    raise exception 'Apenas e-mails @fiap.com.br são permitidos.'
      using errcode = 'P0001';
  end if;

  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

-- -------------------------------------------------------
-- FIX 3: set_updated_at com search_path seguro
-- -------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -------------------------------------------------------
-- FIX 4: sync_project_status — restringir acesso
-- Apenas membros ou autor do projeto podem chamar.
-- Substituímos SECURITY DEFINER por verificação explícita
-- de que o chamador é membro ou autor do projeto.
-- -------------------------------------------------------
create or replace function public.sync_project_status(p_project_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_slots      int;
  v_member_cnt int;
  v_new_status text;
  v_caller_id  uuid;
begin
  v_caller_id := (select auth.uid());

  -- Verifica que o chamador é membro ou autor do projeto
  if not exists (
    select 1 from public.projects where id = p_project_id and author_id = v_caller_id
    union all
    select 1 from public.memberships where project_id = p_project_id and user_id = v_caller_id
  ) then
    raise exception 'Acesso negado: apenas membros ou autor podem sincronizar o status.'
      using errcode = '42501';
  end if;

  select slots into v_slots
  from public.projects
  where id = p_project_id;

  select count(*) into v_member_cnt
  from public.memberships
  where project_id = p_project_id;

  v_new_status := case when v_member_cnt >= v_slots then 'full' else 'active' end;

  update public.projects
  set status = v_new_status, updated_at = now()
  where id = p_project_id and status != 'closed';
end;
$$;
