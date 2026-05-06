"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "./LogoMark";
import { Avatar } from "./Avatar";
import { useProfile } from "@/lib/profile-context";
import { signOut } from "@/lib/actions/profile";

const NAV_LINKS = [
  { label: "Projetos", href: "/projects" },
  { label: "Perfil", href: "/profile" },
];

export function AppNav() {
  const router = useRouter();
  const { profile } = useProfile();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function handleSignOut() {
    setMobileOpen(false);
    startTransition(async () => {
      await signOut();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <>
      <nav
        className="sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-7 h-16"
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Logo */}
        <a
          href="/projects"
          className="flex items-center gap-3 no-underline"
          style={{ color: "var(--text)" }}
        >
          <LogoMark size={34} />
          <span className="text-[17px] font-bold tracking-tight leading-none">
            Campus
          </span>
          <span
            className="text-[10px] font-semibold tracking-[.18em] uppercase px-1.5 py-0.5 rounded-md"
            style={{
              color: "var(--accent)",
              background: "var(--accent-light)",
              border: "1px solid var(--accent-subtle)",
            }}
          >
            FIAP
          </span>
        </a>

        {/* Links centrais — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
                (e.currentTarget as HTMLElement).style.background = "var(--surface)";
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

        {/* Ações autenticadas — desktop */}
        <div className="hidden md:flex items-center gap-2">
          {/* Configurações */}
          <a
            href="/settings"
            className="w-9 h-9 rounded-xl inline-flex items-center justify-center transition-colors no-underline"
            style={{
              color: "var(--text-muted)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text)";
              (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLElement).style.background = "var(--surface)";
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
            <Avatar name={profile.name} size="sm" />
            <button
              onClick={handleSignOut}
              className="w-9 h-9 rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer"
              style={{
                color: "var(--text-muted)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#ff5577";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,60,90,.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,90,.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLElement).style.background = "var(--surface)";
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

        {/* Mobile: avatar + hamburguer */}
        <div className="md:hidden flex items-center gap-2">
          <Avatar name={profile.name} size="sm" />
          <button
            className="w-9 h-9 rounded-xl inline-flex flex-col items-center justify-center gap-[5px]"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="app-mobile-drawer"
          >
            <span
              className="block w-[14px] h-[1.5px] rounded-full transition-all duration-200"
              style={{
                background: "currentColor",
                transform: mobileOpen ? "translateY(6.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-[14px] h-[1.5px] rounded-full transition-all duration-200"
              style={{ background: "currentColor", opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="block w-[14px] h-[1.5px] rounded-full transition-all duration-200"
              style={{
                background: "currentColor",
                transform: mobileOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] md:hidden"
          style={{ background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        id="app-mobile-drawer"
        className="fixed top-16 left-0 right-0 z-[100] md:hidden transition-all duration-300"
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(24px) saturate(140%)",
          WebkitBackdropFilter: "blur(24px) saturate(140%)",
          borderBottom: "1px solid var(--border)",
          transform: mobileOpen ? "translateY(0)" : "translateY(-110%)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col px-4 py-4 gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-4 py-3 rounded-xl text-[15px] font-medium no-underline transition-colors"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
                (e.currentTarget as HTMLElement).style.background = "var(--surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {label}
            </a>
          ))}

          <div
            className="pt-3 mt-1 flex flex-col gap-1"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <a
              href="/settings"
              className="px-4 py-3 rounded-xl text-[15px] font-medium no-underline transition-colors flex items-center gap-3"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMobileOpen(false)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
                (e.currentTarget as HTMLElement).style.background = "var(--surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Configurações
            </a>

            <button
              onClick={handleSignOut}
              disabled={isPending}
              className="px-4 py-3 rounded-xl text-[15px] font-medium transition-colors flex items-center gap-3 text-left w-full cursor-pointer disabled:opacity-50"
              style={{ color: "#ff5577", background: "transparent", border: "none" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,60,90,.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {isPending ? "Saindo…" : "Sair"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
