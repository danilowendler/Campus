import { AppNav } from "@/components/campus/AppNav";
import { ToastProvider } from "@/components/campus/Toast";
import { ThemeProvider } from "@/components/campus/ThemeProvider";
import { ProfileProvider } from "@/lib/profile-context";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("users").select("*").eq("id", user.id).single()
    : { data: null };

  return (
    <ThemeProvider>
      <ProfileProvider initialData={profile}>
        <ToastProvider>
          <AppNav />
          {children}
        </ToastProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
