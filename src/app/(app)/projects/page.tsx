import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectsFeed } from "@/components/campus/ProjectsFeed";
import type { OpenProjectWithVacancies, ProjectWithMembers } from "@/lib/supabase/types";

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
  if (!user) redirect("/login");

  const userId = user.id;

  // Primeiro busca memberships para usar no filtro de "meus projetos"
  const { data: membershipsData } = await supabase
    .from("memberships")
    .select("project_id")
    .eq("user_id", userId)
    .returns<{ project_id: string }[]>();

  const memberProjectIds = (membershipsData ?? []).map((m) => m.project_id);

  // 4 queries paralelas depois de ter os IDs de membership
  const [partnerRes, academicRes, openRes, myProjectsRes] = await Promise.all([
    supabase
      .from("projects_with_members")
      .select("*")
      .eq("category", "partner")
      .order("created_at", { ascending: false })
      .returns<ProjectWithMembers[]>(),
    supabase
      .from("projects_with_members")
      .select("*")
      .eq("category", "academic")
      .order("created_at", { ascending: false })
      .returns<ProjectWithMembers[]>(),
    // Nível 3 — view dedicada: filtra category='open', status='active' e member_count<slots
    // Ordenação por maior disponibilidade (slots livres) prioriza UX de quem busca time.
    supabase
      .from("open_projects_with_vacancies")
      .select("*")
      .order("available_slots", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<OpenProjectWithVacancies[]>(),
    // Todos os projetos que o usuário é membro OU autor, sem filtro de vagas/status.
    // Garante que a aba "Meus projetos" mostre projetos lotados (category='open' full)
    // que desapareceriam da open_projects_with_vacancies.
    memberProjectIds.length > 0 || true
      ? supabase
          .from("projects_with_members")
          .select("*")
          .or(
            `author_id.eq.${userId}${memberProjectIds.length > 0 ? `,id.in.(${memberProjectIds.join(",")})` : ""}`
          )
          .order("created_at", { ascending: false })
          .returns<ProjectWithMembers[]>()
      : Promise.resolve({ data: [] as ProjectWithMembers[] }),
  ]);

  const partnerProjects = partnerRes.data ?? [];
  const academicProjects = academicRes.data ?? [];
  // Cast para ProjectWithMembers — available_slots é extra e não usado pelo ProjectCard
  const openProjects = (openRes.data ?? []) as ProjectWithMembers[];
  const myProjects = myProjectsRes.data ?? [];

  return (
    <ProjectsFeed
      partnerProjects={partnerProjects}
      academicProjects={academicProjects}
      openProjects={openProjects}
      myProjects={myProjects}
      currentUserId={userId}
      memberProjectIds={memberProjectIds}
    />
  );
}
