"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: {
  title: string;
  company: string;
  description: string;
  scope: string;
  reward: string;
  skills: string[];
  slots: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

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

  // Upsert atômico — sem race condition
  const { error: memberError } = await supabase
    .from("memberships")
    .insert({ user_id: user.id, project_id: projectId })
    .select()
    .single();

  if (memberError && memberError.code !== "23505") {
    // 23505 = unique_violation (já é membro)
    throw new Error(memberError.message);
  }

  // Atualiza status para "full" se vagas esgotadas
  await supabase.rpc("sync_project_status", { p_project_id: projectId });

  revalidatePath("/projects");
}

export async function leaveProject(projectId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("memberships")
    .delete()
    .eq("user_id", user.id)
    .eq("project_id", projectId);

  if (error) throw new Error(error.message);

  await supabase.rpc("sync_project_status", { p_project_id: projectId });

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
