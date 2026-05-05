"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProjectCategory } from "@/lib/supabase/types";

const VALID_CATEGORIES: readonly ProjectCategory[] = ["partner", "academic", "open"];

export async function createProject(formData: {
  title: string;
  company: string;
  description: string;
  scope: string;
  reward: string;
  skills: string[];
  slots: number;
  category: ProjectCategory;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  if (!VALID_CATEGORIES.includes(formData.category)) {
    throw new Error("Categoria inválida");
  }

  const { error } = await supabase.from("projects").insert({
    ...formData,
    author_id: user.id,
    status: "active",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/projects");
}

export async function joinProject(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Insert direto sem .select().single() — evita erro PGRST116 mascarando 23505
  const { error: memberError } = await supabase
    .from("memberships")
    .insert({ user_id: user.id, project_id: projectId });

  if (memberError && memberError.code !== "23505") {
    // 23505 = unique_violation (já é membro) — ignorar
    throw new Error(memberError.message);
  }

  // Sincroniza status para "full" se vagas esgotadas
  await supabase.rpc("sync_project_status", { p_project_id: projectId });

  revalidatePath("/projects");
}

export async function leaveProject(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // RPC ANTES do delete: sync_project_status verifica se o chamador é membro ou autor.
  // Após o delete, o usuário não seria mais membro e a verificação falharia com 42501.
  await supabase.rpc("sync_project_status", { p_project_id: projectId });

  const { error } = await supabase
    .from("memberships")
    .delete()
    .eq("user_id", user.id)
    .eq("project_id", projectId);

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("author_id", user.id); // RLS garante, mas filtramos também aqui

  if (error) throw new Error(error.message);
  revalidatePath("/projects");
}
