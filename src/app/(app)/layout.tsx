import { AppNav } from "@/components/campus/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      {children}
    </>
  );
}
