"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/campus/ProjectCard";
import { ProjectDetail } from "@/components/campus/ProjectDetail";
import { CreateProject } from "@/components/campus/CreateProject";
import { CampusButton } from "@/components/campus/CampusButton";
import { ProjectsSidebar } from "@/components/campus/ProjectsSidebar";
import { ProjectsFiltersProvider, useProjectsFilters } from "@/lib/projects-filters-context";
import { useProfile } from "@/lib/profile-context";
import { calculateMatchScore } from "@/lib/skills-match";
import type { ProjectCategory, ProjectWithMembers } from "@/lib/supabase/types";

type Tab = "all" | "mine";

interface ProjectsFeedProps {
  partnerProjects: ProjectWithMembers[];
  academicProjects: ProjectWithMembers[];
  openProjects: ProjectWithMembers[];
  // Todos os projetos do usuário (membro ou autor), sem filtro de vagas/status.
  // Usado na aba "Meus projetos" para incluir projetos lotados que saem da view open.
  myProjects: ProjectWithMembers[];
  currentUserId: string;
  memberProjectIds: string[];
}

interface SectionMeta {
  id: ProjectCategory;
  title: string;
  subtitle: string;
  emphasis: "primary" | "secondary" | "tertiary";
  emptyText: string;
}

const SECTIONS: SectionMeta[] = [
  {
    id: "partner",
    title: "Empresas Parceiras",
    subtitle: "Desafios reais publicados por empresas parceiras da FIAP",
    emphasis: "primary",
    emptyText: "Nenhum desafio de empresa parceira ativo no momento.",
  },
  {
    id: "academic",
    title: "Acadêmicos · FIAP",
    subtitle: "Iniciativas vinculadas a cursos e disciplinas da FIAP",
    emphasis: "secondary",
    emptyText: "Nenhum projeto acadêmico publicado por enquanto.",
  },
  {
    id: "open",
    title: "Em Aberto",
    subtitle: "Projetos livres com vagas disponíveis para entrar agora",
    emphasis: "tertiary",
    emptyText: "Nenhuma vaga aberta agora — volte em breve ou crie a sua.",
  },
];

export function ProjectsFeed(props: ProjectsFeedProps) {
  return (
    <ProjectsFiltersProvider>
      <ProjectsFeedInner {...props} />
    </ProjectsFiltersProvider>
  );
}

function ProjectsFeedInner({
  partnerProjects,
  academicProjects,
  openProjects,
  myProjects,
  currentUserId,
  memberProjectIds,
}: ProjectsFeedProps) {
  const [tab, setTab] = useState<Tab>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectWithMembers | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { filters } = useProjectsFilters();
  const { profile } = useProfile();

  const memberSet = useMemo(() => new Set(memberProjectIds), [memberProjectIds]);

  // "Meus projetos" usa myProjects (sem filtro de vagas) agrupado por categoria.
  // Isso evita que projetos lotados (ex: open full) desapareçam da aba do usuário.
  const mineByCategory: Record<ProjectCategory, ProjectWithMembers[]> = useMemo(
    () => ({
      partner: myProjects.filter((p) => p.category === "partner"),
      academic: myProjects.filter((p) => p.category === "academic"),
      open: myProjects.filter((p) => p.category === "open"),
    }),
    [myProjects]
  );

  const baseSectionData: Record<ProjectCategory, ProjectWithMembers[]> =
    tab === "all"
      ? {
          partner: partnerProjects,
          academic: academicProjects,
          open: openProjects,
        }
      : mineByCategory;

  // Skills disponíveis nos projetos visíveis (todas as seções da aba atual)
  // — alimenta sugestões da Sidebar.
  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    Object.values(baseSectionData).forEach((arr) => {
      arr.forEach((p) => p.skills.forEach((s) => set.add(s)));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [baseSectionData]);

  // Aplica filtros + calcula match score por projeto.
  // Categoria filter: se categoria selecionada !== 'all', oculta seções diferentes
  // (mas preserva a estrutura de 3 seções para que "all" não vire grid plano).
  const sectionData: Record<
    ProjectCategory,
    { project: ProjectWithMembers; matchScore: number }[]
  > = useMemo(() => {
    const filterSet = new Set(filters.skills.map((s) => s.toLowerCase()));
    const userSkillSet = new Set(profile.skills.map((s) => s.trim().toLowerCase()));

    function passesFilters(p: ProjectWithMembers): boolean {
      // Categoria
      if (filters.category !== "all" && p.category !== filters.category) return false;
      // Vagas abertas
      if (filters.openOnly) {
        const hasVacancy = p.status === "active" && p.member_count < p.slots;
        if (!hasVacancy) return false;
      }
      // Skills (todas as selecionadas devem estar no projeto)
      if (filters.skills.length > 0) {
        const projectSet = new Set(p.skills.map((s) => s.toLowerCase()));
        for (const s of filterSet) {
          if (!projectSet.has(s)) return false;
        }
      }
      return true;
    }

    function annotate(arr: ProjectWithMembers[]) {
      const mapped = arr
        .filter(passesFilters)
        .map((project) => {
          const { score } = calculateMatchScore(
            Array.from(userSkillSet),
            project.skills
          );
          return { project, matchScore: score };
        });

      // matchOnly: filtra projetos sem overlap e ordena por score desc dentro da seção
      if (filters.matchOnly) {
        return mapped
          .filter((m) => m.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore);
      }
      return mapped;
    }

    return {
      partner: annotate(baseSectionData.partner),
      academic: annotate(baseSectionData.academic),
      open: annotate(baseSectionData.open),
    };
  }, [baseSectionData, filters, profile.skills]);

  // totalActive: projetos com status 'active' e vagas disponíveis (excluindo lotados),
  // somando todas as seções visíveis (após filtros aplicados na aba "all").
  const totalActive = useMemo(() => {
    const allFeed = [
      ...sectionData.partner,
      ...sectionData.academic,
      ...sectionData.open,
    ];
    return allFeed.filter(
      ({ project: p }) => p.status === "active" && p.member_count < p.slots
    ).length;
  }, [sectionData]);

  const visibleCount =
    sectionData.partner.length +
    sectionData.academic.length +
    sectionData.open.length;

  const myCount = myProjects.length;

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar (sticky desktop / drawer mobile) */}
        <ProjectsSidebar availableSkills={availableSkills} />

        <div className="min-w-0">
          {/* Page header */}
          <div
            className="flex flex-col gap-1 mb-8"
            style={{ animation: "fadeUp .6s cubic-bezier(.22,1,.36,1) both" }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
                  Projetos
                </h1>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  <span style={{ color: "var(--text)" }}>{totalActive}</span> projetos ativos
                  aguardando o seu time
                </p>
              </div>
              <CampusButton
                variant="primary"
                size="default"
                onClick={() => setShowCreate(true)}
                className="flex-shrink-0 mt-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Novo projeto
              </CampusButton>
            </div>

            {/* Tabs + mobile filter toggle row */}
            <div className="flex items-center gap-2 mt-6 flex-wrap">
              <div
                className="flex gap-1 p-1 rounded-xl w-fit"
                style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border)" }}
              >
                {([
                  { id: "all" as Tab, label: "Todos" },
                  { id: "mine" as Tab, label: "Meus projetos" },
                ] as const).map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className="px-4 py-1.5 text-sm font-medium rounded-[9px] transition-all duration-200"
                    style={
                      tab === id
                        ? {
                            background: "linear-gradient(135deg, #FF2E63, #ED155A)",
                            color: "#fff",
                            boxShadow: "0 2px 12px -4px rgba(237,21,90,.55)",
                          }
                        : { color: "var(--text-muted)", background: "transparent" }
                    }
                  >
                    {label}
                    {id === "mine" && (
                      <span
                        className="ml-1.5 text-[11px] px-1.5 py-px rounded-full font-semibold"
                        style={
                          tab === "mine"
                            ? { background: "rgba(255,255,255,.2)", color: "#fff" }
                            : { background: "rgba(255,255,255,.08)", color: "var(--text-faint)" }
                        }
                      >
                        {myCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty global */}
          {visibleCount === 0 ? (
            <GlobalEmptyState tab={tab} onCreateClick={() => setShowCreate(true)} />
          ) : (
            <div className="flex flex-col gap-12">
              {(() => {
                const visibleSections = SECTIONS.filter(
                  (s) => sectionData[s.id].length > 0
                );
                if (visibleSections.length === 0) {
                  return <GlobalEmptyState tab={tab} onCreateClick={() => setShowCreate(true)} />;
                }
                return visibleSections.map((section) => (
                  <Section
                    key={section.id}
                    meta={section}
                    items={sectionData[section.id]}
                    currentUserId={currentUserId}
                    memberSet={memberSet}
                    onViewDetail={setSelectedProject}
                  />
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          currentUserId={currentUserId}
          isMember={memberSet.has(selectedProject.id)}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {showCreate && (
        <CreateProject
          onClose={() => setShowCreate(false)}
          onCreated={() => setTab("mine")}
        />
      )}
    </main>
  );
}

function Section({
  meta,
  items,
  currentUserId,
  memberSet,
  onViewDetail,
}: {
  meta: SectionMeta;
  items: { project: ProjectWithMembers; matchScore: number }[];
  currentUserId: string;
  memberSet: Set<string>;
  onViewDetail: (project: ProjectWithMembers) => void;
}) {
  const isPrimary = meta.emphasis === "primary";

  return (
    <section
      style={
        isPrimary
          ? {
              padding: "24px 24px 28px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--accent-soft)",
              background:
                "linear-gradient(180deg, var(--accent-light) 0%, transparent 60%)",
            }
          : undefined
      }
    >
      <header className="flex items-end justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <h2
            className="font-semibold tracking-tight"
            style={{
              color: "var(--text)",
              fontSize: isPrimary ? 22 : 18,
              letterSpacing: isPrimary ? "-0.01em" : undefined,
            }}
          >
            {meta.title}
          </h2>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: isPrimary
                ? "linear-gradient(135deg, rgba(255,46,99,.22), rgba(176,14,68,.18))"
                : "rgba(255,255,255,.06)",
              color: isPrimary ? "#fff" : "var(--text-muted)",
              border: isPrimary
                ? "1px solid var(--accent-strong)"
                : "1px solid var(--border)",
            }}
          >
            {items.length}
          </span>
        </div>
        <p
          className="text-xs sm:text-sm m-0"
          style={{ color: "var(--text-muted)" }}
        >
          {meta.subtitle}
        </p>
      </header>

      {items.length === 0 ? (
        <SectionEmpty text={meta.emptyText} />
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
            animation: "fadeUp .5s cubic-bezier(.22,1,.36,1) both",
            animationDelay: ".1s",
          }}
        >
          {items.map(({ project, matchScore }) => (
            <ProjectCard
              key={project.id}
              project={project}
              currentUserId={currentUserId}
              isMember={memberSet.has(project.id)}
              onViewDetail={onViewDetail}
              matchScore={matchScore}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SectionEmpty({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl px-5 py-8 text-center text-sm"
      style={{
        border: "1px dashed var(--border-strong)",
        background: "rgba(255,255,255,.02)",
        color: "var(--text-muted)",
      }}
    >
      {text}
    </div>
  );
}

function GlobalEmptyState({
  tab,
  onCreateClick,
}: {
  tab: Tab;
  onCreateClick: () => void;
}) {
  const { activeCount, reset } = useProjectsFilters();
  const filtered = activeCount > 0;
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-24 gap-5"
      style={{ animation: "fadeUp .5s cubic-bezier(.22,1,.36,1) both" }}
    >
      <span
        className="w-16 h-16 rounded-2xl inline-flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, var(--accent-soft), rgba(176,14,68,.08))",
          border: "1px solid var(--accent-subtle)",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF7A9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      </span>
      <div>
        <p className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
          {filtered
            ? "Nenhum projeto bate com os filtros"
            : tab === "all"
            ? "Nenhum projeto encontrado"
            : "Você ainda não está em nenhum projeto"}
        </p>
        <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
          {filtered
            ? "Ajuste ou limpe os filtros da Sidebar para ver mais resultados."
            : tab === "all"
            ? "Quando empresas parceiras publicarem desafios, eles aparecerão aqui."
            : "Entre em um projeto existente ou crie o seu para começar a construir."}
        </p>
      </div>
      {filtered ? (
        <CampusButton variant="secondary" onClick={() => reset()}>
          Limpar filtros
        </CampusButton>
      ) : tab === "mine" ? (
        <CampusButton variant="primary" onClick={onCreateClick}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Criar primeiro projeto
        </CampusButton>
      ) : null}
    </div>
  );
}
