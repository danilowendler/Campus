"use client";

import { useState, useEffect, useRef } from "react";
import { LogoMark } from "./LogoMark";
import { ScrollLink } from "./ScrollLink";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Projetos em Destaque", targetId: "projetos" },
  { label: "Como funciona", targetId: "como-funciona" },
];

interface NavProps {
  actions?: React.ReactNode;
  className?: string;
}

export function Nav({ actions, className }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // trap scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn("sticky top-0 z-[100] flex items-center justify-between px-4 sm:px-7 h-16", className)}
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Logo */}
        <a
          href="/"
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
              background: "rgba(237,21,90,.1)",
              border: "1px solid rgba(237,21,90,.2)",
              letterSpacing: ".18em",
            }}
          >
            FIAP
          </span>
        </a>

        {/* Links centrais — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, targetId }) => (
            <ScrollLink
              key={label}
              targetId={targetId}
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
            </ScrollLink>
          ))}
        </div>

        {/* Ações + hamburguer */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">{actions}</div>

          {/* Hamburguer — mobile only */}
          <button
            className="md:hidden w-9 h-9 rounded-xl inline-flex flex-col items-center justify-center gap-[5px] transition-colors"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
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
              style={{
                background: "currentColor",
                opacity: mobileOpen ? 0 : 1,
              }}
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] md:hidden"
          style={{ background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
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
          {NAV_LINKS.map(({ label, targetId }) => (
            <ScrollLink
              key={label}
              targetId={targetId}
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
            </ScrollLink>
          ))}
          {actions && (
            <div
              className="flex flex-col gap-2 pt-3 mt-1"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
