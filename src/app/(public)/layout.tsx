import { Nav } from "@/components/campus/Nav";
import { CampusButton } from "@/components/campus/CampusButton";
import { ScrollLink } from "@/components/campus/ScrollLink";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav
        actions={
          <>
            <ScrollLink
              targetId="como-funciona"
              className="px-3.5 py-2 text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Como funciona
            </ScrollLink>
            <a href="/login">
              <CampusButton variant="primary" size="sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="m10 17 5-5-5-5" /><path d="M15 12H3" />
                </svg>
                Entrar
              </CampusButton>
            </a>
          </>
        }
      />
      {children}
    </>
  );
}
