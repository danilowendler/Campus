import { AppNav } from "@/components/campus/AppNav";
import { ToastProvider } from "@/components/campus/Toast";
import { ThemeProvider } from "@/components/campus/ThemeProvider";
import { ProfileProvider } from "@/lib/profile-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <ToastProvider>
          <AppNav />
          {children}
        </ToastProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
