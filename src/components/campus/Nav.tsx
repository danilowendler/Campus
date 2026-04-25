"use client";

import { LogoMark } from "./LogoMark";
import { cn } from "@/lib/utils";

interface NavProps {
  /** Slot direito — botões de autenticação ou avatar do usuário logado */
  actions?: React.ReactNode;
  className?: string;
}

export function Nav({ actions, className }: NavProps) {
  return (
    <nav
      className={cn("sticky top-0 z-[100] flex items-center justify-between px-7 h-16", className)}
      style={{
        background: "rgba(9,9,11,0.55)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <button
        className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer text-base font-semibold tracking-tight"
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
      </button>

      {/* Links centrais */}
      <div className="hidden md:flex items-center gap-1">
        {["Projetos", "Perfil"].map((label) => (
          <a
            key={label}
            href="#"
            className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
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

      {/* Slot de ações */}
      <div className="flex items-center gap-2">{actions}</div>
    </nav>
  );
}
