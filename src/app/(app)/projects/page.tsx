import { createClient } from "@/lib/supabase/server";
import { ProjectsFeed } from "@/components/campus/ProjectsFeed";

export const metadata = {
  title: "Projetos",
  description: "Explore projetos reais publicados por empresas parceiras e entre no time certo para você.",
  openGraph: {
    title: "Projetos — Campus FIAP",
    description: "Explore projetos reais publicados por empresas parceiras e entre no time certo para você.",
  },
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Busca projetos com membros agregados (view evita N+1)
  const { data: projects = [] } = await supabase
    .from("projects_with_members")
    .select("*")
    .order("created_at", { ascending: false });

  // IDs dos projetos em que o usuário é membro
  const { data: myMemberships } = await supabase
    .from("memberships")
    .select("project_id")
    .eq("user_id", user?.id ?? "")
    .returns<{ project_id: string }[]>();

  const memberProjectIds = new Set((myMemberships ?? []).map((m) => m.project_id));

  return (
    <ProjectsFeed
      initialProjects={projects ?? []}
      currentUserId={user?.id ?? ""}
      memberProjectIds={[...memberProjectIds]}
    />
  );
}
