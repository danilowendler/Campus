import { AppNav } from "@/components/campus/AppNav";
import { ToastProvider } from "@/components/campus/Toast";
import { ThemeProvider } from "@/components/campus/ThemeProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppNav />
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
