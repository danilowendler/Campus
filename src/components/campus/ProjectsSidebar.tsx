"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SkillTag } from "@/components/campus/SkillTag";
import { useProjectsFilters } from "@/lib/projects-filters-context";
import { useProfile } from "@/lib/profile-context";
import { useFocusTrap } from "@/lib/useFocusTrap";
import type { ProjectCategory } from "@/lib/supabase/types";

interface ProjectsSidebarProps {
  // Skills extraídas dos projetos visíveis para popular sugestões.
  availableSkills: string[];
}

const CATEGORY_OPTIONS: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "partner", label: "Empresa Parceira" },
  { id: "academic", label: "Acadêmico" },
  { id: "open", label: "Em aberto" },
];

export function ProjectsSidebar({ availableSkills }: ProjectsSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const desktopSearchRef = useRef<HTMLInputElement | null>(null);
  const mobileSearchRef = useRef<HTMLInputElement | null>(null);

  useFocusTrap(drawerRef, drawerOpen);

  // Atalho `/` — foca a busca de skills (drawer abre se mobile).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (isMobile) {
        setDrawerOpen(true);
        // Espera o drawer montar antes de focar.
        setTimeout(() => mobileSearchRef.current?.focus(), 50);
      } else {
        desktopSearchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Fecha drawer com Escape.
  useEffect(() => {
    if (!drawerOpen) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [drawerOpen]);

  // Body scroll lock enquanto o drawer está aberto (mobile).
  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <>
      {/* DESKTOP — sticky aside */}
      <aside
        aria-label="Filtros de projetos"
        className="hidden lg:block sticky self-start"
        style={{ top: 80, maxHeight: "calc(100dvh - 96px)" }}
      >
        <SidebarBody
          availableSkills={availableSkills}
          searchInputRef={desktopSearchRef}
          variant="desktop"
        />
      </aside>

      {/* MOBILE — toggle button */}
      <MobileToggle drawerOpen={drawerOpen} onOpen={() => setDrawerOpen(true)} />

      {/* MOBILE — drawer overlay */}
      {drawerOpen && (
        <MobileDrawer
          drawerRef={drawerRef}
          availableSkills={availableSkills}
          searchInputRef={mobileSearchRef}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}

// ─── Mobile bits ─────────────────────────────────────────────────────────────

function MobileToggle({
  drawerOpen,
  onOpen,
}: {
  drawerOpen: boolean;
  onOpen: () => void;
}) {
  const { activeCount } = useProjectsFilters();
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={drawerOpen}
      aria-controls="projects-sidebar-drawer"
      className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid var(--border)",
        color: "var(--text)",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="10" y1="18" x2="14" y2="18" />
      </svg>
      Filtros
      {activeCount > 0 && (
        <span
          className="text-[11px] font-semibold px-1.5 py-px rounded-full"
          style={{
            background: "linear-gradient(135deg, #FF2E63, #ED155A)",
            color: "#fff",
          }}
        >
          {activeCount}
        </span>
      )}
    </button>
  );
}

function MobileDrawer({
  drawerRef,
  availableSkills,
  searchInputRef,
  onClose,
}: {
  drawerRef: React.RefObject<HTMLDivElement | null>;
  availableSkills: string[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
}) {
  const labelId = useId();
  return (
    <div
      className="lg:hidden fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      id="projects-sidebar-drawer"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar filtros"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative ml-0 mr-auto h-full w-[88vw] max-w-[340px] flex flex-col"
        style={{
          background: "var(--bg-elevated)",
          borderRight: "1px solid var(--border)",
          animation: "drawerSlideIn .25s cubic-bezier(.22,1,.36,1) both",
        }}
      >
        <div
          className="flex items-center justify-between px-4 h-14 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2
            id={labelId}
            className="text-base font-semibold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Filtros
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 inline-flex items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <SidebarBody
            availableSkills={availableSkills}
            searchInputRef={searchInputRef}
            variant="drawer"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Shared body ─────────────────────────────────────────────────────────────

function SidebarBody({
  availableSkills,
  searchInputRef,
  variant,
}: {
  availableSkills: string[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  variant: "desktop" | "drawer";
}) {
  const {
    filters,
    toggleSkill,
    setCategory,
    setOpenOnly,
    setMatchOnly,
    reset,
    activeCount,
  } = useProjectsFilters();
  const { profile } = useProfile();

  const [skillQuery, setSkillQuery] = useState("");
  const userSkillsCount = profile.skills.length;

  // Sugestões: skills disponíveis nos projetos visíveis, exceto as já ativas,
  // filtradas pela busca.
  const activeSet = useMemo(
    () => new Set(filters.skills.map((s) => s.toLowerCase())),
    [filters.skills]
  );
  const suggestions = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    return availableSkills
      .filter((s) => !activeSet.has(s.toLowerCase()))
      .filter((s) => (q ? s.toLowerCase().includes(q) : true))
      .slice(0, 24);
  }, [availableSkills, activeSet, skillQuery]);

  const wrapperClass =
    variant === "desktop"
      ? "w-[280px] flex flex-col rounded-[var(--radius-lg)] overflow-hidden"
      : "w-full flex flex-col gap-1";

  const wrapperStyle: React.CSSProperties =
    variant === "desktop"
      ? {
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          maxHeight: "calc(100dvh - 96px)",
        }
      : {};

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {/* Header (desktop only — drawer já tem header próprio) */}
      {variant === "desktop" && (
        <div
          className="flex items-center justify-between px-4 h-12 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "var(--text-muted)" }}
          >
            Filtros
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => reset()}
              className="text-[11px] font-medium transition-colors"
              style={{ color: "var(--accent)" }}
            >
              Limpar ({activeCount})
            </button>
          )}
        </div>
      )}

      {/* Drawer extra "Limpar" no topo se houver filtros */}
      {variant === "drawer" && activeCount > 0 && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => reset()}
            className="text-[12px] font-medium"
            style={{ color: "var(--accent)" }}
          >
            Limpar ({activeCount})
          </button>
        </div>
      )}

      {/* Body */}
      <div
        className={
          variant === "desktop"
            ? "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5"
            : "flex flex-col gap-5"
        }
      >
        {/* Grupo 1 — Match com meu perfil */}
        <Group title="Match" delay={0}>
          <ToggleRow
            icon={<MatchIcon />}
            label="Match com meu perfil"
            description={
              userSkillsCount > 0
                ? `Usa suas ${userSkillsCount} ${userSkillsCount === 1 ? "skill" : "skills"}`
                : "Cadastre suas skills no perfil"
            }
            checked={filters.matchOnly}
            disabled={userSkillsCount === 0}
            onChange={setMatchOnly}
          />
        </Group>

        <Divider />

        {/* Grupo 2 — Disponibilidade */}
        <Group title="Disponibilidade" delay={1}>
          <ToggleRow
            icon={<DotIcon color="#34d399" />}
            label="Apenas com vagas"
            checked={filters.openOnly}
            onChange={setOpenOnly}
          />
        </Group>

        <Divider />

        {/* Grupo 3 — Categoria */}
        <Group title="Categoria" delay={2}>
          <div className="flex flex-col gap-1">
            {CATEGORY_OPTIONS.map((opt) => {
              const active = filters.category === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCategory(opt.id)}
                  aria-pressed={active}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-left transition-colors"
                  style={{
                    color: active ? "var(--text)" : "var(--text-muted)",
                    background: active ? "rgba(237,21,90,.08)" : "transparent",
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      border: active
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border-strong)",
                      background: active ? "var(--accent-soft)" : "transparent",
                    }}
                  >
                    {active && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Group>

        <Divider />

        {/* Grupo 4 — Skills */}
        <Group title="Skills" delay={3}>
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="Buscar skill..."
                className="w-full text-sm pl-8 pr-9 py-2 rounded-lg outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
                aria-label="Buscar skill"
              />
              <span
                className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-faint)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <kbd
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(255,255,255,.06)",
                  color: "var(--text-faint)",
                  border: "1px solid var(--border)",
                }}
                aria-hidden="true"
              >
                /
              </kbd>
            </div>

            {/* Active chips */}
            {filters.skills.length > 0 && (
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5"
                  style={{ color: "var(--text-faint)" }}
                >
                  Ativos
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {filters.skills.map((s) => (
                    <SkillTag
                      key={s}
                      label={s}
                      variant="pink"
                      onRemove={() => toggleSkill(s)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5"
                  style={{ color: "var(--text-faint)" }}
                >
                  Sugeridas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSkill(s)}
                      className="px-[11px] py-1 text-xs font-medium rounded-full transition-all hover:-translate-y-0.5"
                      style={{
                        background: "rgba(255,255,255,.04)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filters.skills.length === 0 && suggestions.length === 0 && (
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                Nenhuma skill encontrada para esta busca.
              </p>
            )}
          </div>
        </Group>
      </div>
    </div>
  );
}

// ─── Pieces ──────────────────────────────────────────────────────────────────

function Group({
  title,
  children,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div
      className="fade-up"
      style={{
        animationDelay: `${delay * 60}ms`,
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-2"
        style={{ color: "var(--text-faint)" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <hr className="border-0 m-0" style={{ borderTop: "1px solid var(--border)" }} />
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className="flex items-center gap-3 w-full text-left p-2 -mx-2 rounded-lg transition-colors hover:bg-white/[0.03] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span
        className="w-7 h-7 rounded-lg inline-flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(255,255,255,.04)",
          border: "1px solid var(--border)",
        }}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight" style={{ color: "var(--text)" }}>
          {label}
        </p>
        {description && (
          <p
            className="text-[11px] mt-0.5 leading-tight"
            style={{ color: "var(--text-faint)" }}
          >
            {description}
          </p>
        )}
      </div>
      <span
        aria-hidden="true"
        className="relative inline-flex w-9 h-5 rounded-full flex-shrink-0 transition-colors"
        style={{
          background: checked ? "var(--accent)" : "rgba(255,255,255,.1)",
          border: "1px solid",
          borderColor: checked ? "var(--accent)" : "var(--border-strong)",
        }}
      >
        <span
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all"
          style={{
            background: "#fff",
            left: checked ? "calc(100% - 17px)" : "2px",
            boxShadow: "0 1px 3px rgba(0,0,0,.3)",
          }}
        />
      </span>
    </button>
  );
}

function MatchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function DotIcon({ color }: { color: string }) {
  return (
    <span
      className="w-2 h-2 rounded-full"
      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
    />
  );
}
