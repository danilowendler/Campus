-- ============================================================
-- Função: sync_project_status
-- Atualiza status do projeto para 'full' ou 'active'
-- com base no número de membros vs vagas.
-- Chamada após join/leave — evita race condition no cliente.
-- ============================================================
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
begin
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
