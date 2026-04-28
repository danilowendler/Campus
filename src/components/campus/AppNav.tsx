"use client";

import { useRouter } from "next/navigation";
import { LogoMark } from "./LogoMark";
import { Avatar } from "./Avatar";
import { MOCK_USER_NAME } from "@/lib/mock-data";

const NAV_LINKS = [
  { label: "Projetos", href: "/projects" },
  { label: "Perfil", href: "/profile" },
];

export function AppNav() {
  const router = useRouter();

  function handleSignOut() {
    document.cookie = "campus_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/login");
  }

  return (
    <nav
      className="sticky top-0 z-[100] flex items-center justify-between px-7 h-16"
      style={{
        background: "rgba(9,9,11,0.55)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <a
        href="/projects"
        className="flex items-center gap-2.5 no-underline text-base font-semibold tracking-tight"
        style={{ color: "var(--text)" }}
      >
        <LogoMark size={28} />
        <span>Campus</span>
        <span style={{ color: "var(--border-strong)" }}>·</span>
        <span
          className="font-medium text-[13px] tracking-[.12em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          FIAP
        </span>
      </a>

      {/* Links centrais */}
      <div className="hidden md:flex items-center gap-1">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Ações autenticadas */}
      <div className="flex items-center gap-2">
        {/* Configurações */}
        <a
          href="/profile"
          className="w-9 h-9 rounded-xl inline-flex items-center justify-center transition-colors no-underline"
          style={{
            color: "var(--text-muted)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text)";
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
          }}
          aria-label="Configurações do perfil"
          title="Configurações"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </a>

        {/* Avatar + sair */}
        <div className="flex items-center gap-2 pl-1">
          <Avatar name={MOCK_USER_NAME} size="sm" />
          <button
            onClick={handleSignOut}
            className="w-9 h-9 rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer"
            style={{
              color: "var(--text-muted)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#ff5577";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,60,90,.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,90,.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            }}
            aria-label="Sair"
            title="Sair"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
