import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfilePageClient } from "@/components/campus/ProfilePageClient";

export const metadata = {
  title: "Perfil",
  description: "Visualize e edite seu perfil de estudante FIAP, suas skills e projetos.",
  openGraph: {
    title: "Perfil — Campus FIAP",
    description: "Visualize e edite seu perfil de estudante FIAP, suas skills e projetos.",
  },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // IDs dos projetos em que o usuário é membro
  const { data: memberRows } = await supabase
    .from("memberships")
    .select("project_id")
    .eq("user_id", user.id)
    .returns<{ project_id: string }[]>();

  const memberIds = (memberRows ?? []).map((r) => r.project_id);

  // Projetos em que é autor + membros
  const memberIdList = memberIds.length > 0 ? memberIds : ["00000000-0000-0000-0000-000000000000"];
  const { data: myProjects } = await supabase
    .from("projects_with_members")
    .select("*")
    .or(`author_id.eq.${user.id},id.in.(${memberIdList.join(",")})`)
    .order("created_at", { ascending: false });

  return (
    <ProfilePageClient
      initialProfile={profile ?? {
        id: user.id,
        name: user.email?.split("@")[0] ?? "",
        email: user.email ?? "",
        course: "Tecnologia",
        bio: null,
        skills: [],
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }}
      myProjects={myProjects ?? []}
      currentUserId={user.id}
    />
  );
}
