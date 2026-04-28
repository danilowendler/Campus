"use client";

import { useState } from "react";
import { ProjectsProvider, useProjects } from "@/lib/projects-context";
import { ProjectCard } from "@/components/campus/ProjectCard";
import { ProjectDetail } from "@/components/campus/ProjectDetail";
import { CreateProject } from "@/components/campus/CreateProject";
import { CampusButton } from "@/components/campus/CampusButton";
import type { Project } from "@/lib/mock-data";

type Tab = "all" | "mine";

function ProjectsFeed() {
  const { projects, currentUserName, isMember, isAuthor } = useProjects();
  const [tab, setTab] = useState<Tab>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered =
    tab === "all"
      ? projects
      : projects.filter(
          (p) =>
            p.members.some((m) => m.name === currentUserName) ||
            isAuthor(p.id)
        );

  const activeCount = projects.filter((p) => p.status === "active").length;

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 sm:px-6">
      {/* Page header */}
      <div
        className="flex flex-col gap-1 mb-8"
        style={{ animation: "fadeUp .6s cubic-bezier(.22,1,.36,1) both" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
              Projetos
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: "var(--text)" }}>{activeCount}</span> projetos ativos
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

        {/* Tabs */}
        <div
          className="flex gap-1 mt-6 p-1 rounded-xl w-fit"
          style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid var(--border)",
          }}
        >
          {(
            [
              { id: "all" as Tab, label: "Todos" },
              { id: "mine" as Tab, label: "Meus projetos" },
            ] as const
          ).map(({ id, label }) => (
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
                  {
                    projects.filter(
                      (p) =>
                        p.members.some((m) => m.name === currentUserName) ||
                        isAuthor(p.id)
                    ).length
                  }
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <EmptyState tab={tab} onCreateClick={() => setShowCreate(true)} />
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            animation: "fadeUp .5s cubic-bezier(.22,1,.36,1) both",
            animationDelay: ".1s",
          }}
        >
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onViewDetail={setSelectedProject}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateProject
          onClose={() => setShowCreate(false)}
          onCreated={() => setTab("mine")}
        />
      )}
    </main>
  );
}

function EmptyState({ tab, onCreateClick }: { tab: Tab; onCreateClick: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-24 gap-5"
      style={{ animation: "fadeUp .5s cubic-bezier(.22,1,.36,1) both" }}
    >
      <span
        className="w-16 h-16 rounded-2xl inline-flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(237,21,90,.12), rgba(176,14,68,.08))",
          border: "1px solid rgba(237,21,90,.2)",
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
          {tab === "all" ? "Nenhum projeto encontrado" : "Você ainda não está em nenhum projeto"}
        </p>
        <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-muted)" }}>
          {tab === "all"
            ? "Quando empresas parceiras publicarem desafios, eles aparecerão aqui."
            : "Entre em um projeto existente ou crie o seu para começar a construir."}
        </p>
      </div>

      {tab === "mine" && (
        <CampusButton variant="primary" onClick={onCreateClick}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Criar primeiro projeto
        </CampusButton>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <ProjectsProvider>
      <ProjectsFeed />
    </ProjectsProvider>
  );
}
