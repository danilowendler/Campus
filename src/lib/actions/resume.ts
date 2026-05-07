"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const RESUME_BUCKET = "resumes";
const RESUME_FILENAME = "resume.pdf";
const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_MIME = "application/pdf";

export type ResumeActionResult = { ok: true } | { error: string };

function resumePathFor(userId: string): string {
  return `${userId}/${RESUME_FILENAME}`;
}

export async function uploadResume(formData: FormData): Promise<ResumeActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Arquivo não enviado" };
  }

  if (file.type !== RESUME_MIME) {
    return { error: "O currículo precisa estar em PDF" };
  }
  if (file.size > MAX_RESUME_BYTES) {
    return { error: "PDF excede o limite de 5 MB" };
  }

  const path = resumePathFor(user.id);

  const { error: uploadError } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(path, file, {
      contentType: RESUME_MIME,
      upsert: true,
    });
  if (uploadError) return { error: uploadError.message };

  const { error: updateError } = await supabase
    .from("users")
    .update({
      resume_path: path,
      resume_name: file.name,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (updateError) return { error: updateError.message };

  revalidatePath("/profile");
  return { ok: true };
}

export async function deleteResume(): Promise<ResumeActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: row, error: fetchError } = await supabase
    .from("users")
    .select("resume_path")
    .eq("id", user.id)
    .single();
  if (fetchError) return { error: fetchError.message };

  const pathToRemove = row?.resume_path ?? resumePathFor(user.id);

  const { error: removeError } = await supabase.storage
    .from(RESUME_BUCKET)
    .remove([pathToRemove]);
  if (removeError) return { error: removeError.message };

  const { error: updateError } = await supabase
    .from("users")
    .update({
      resume_path: null,
      resume_name: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);
  if (updateError) return { error: updateError.message };

  revalidatePath("/profile");
  return { ok: true };
}
