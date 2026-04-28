"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { Badge } from "./Badge";
import { SkillTag } from "./SkillTag";
import { Avatar } from "./Avatar";
import { CampusButton } from "./CampusButton";
import { useProjects } from "@/lib/projects-context";
import type { Project } from "@/lib/mock-data";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const { joinProject, leaveProject, isMember, isAuthor } = useProjects();
  const [loading, setLoading] = useState<"join" | "leave" | null>(null);
  const [mounted, setMounted] = useState(false);

  const memberOf = isMember(project.id);
  const authorOf = isAuthor(project.id);
  const isFull = project.status === "full" || project.members.length >= project.slots;
  const emptySlots = Math.max(0, project.slots - project.members.length);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleJoin() {
    setLoading("join");
    await new Promise((r) => setTimeout(r, 700));
    joinProject(project.id);
    setLoading(null);
  }

  async function handleLeave() {
    setLoading("leave");
    await new Promise((r) => setTimeout(r, 700));
    leaveProject(project.id);
    setLoading(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        opacity: mounted ? 1 : 0,
        transition: "opacity .25s ease",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={project.title}
    >
      <GlassCard
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(.97)",
          transition: "transform .3s cubic-bezier(.22,1,.36,1), opacity .25s ease",
          opacity: mounted ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(237,21,90,.25), rgba(176,14,68,.2))",
                  border: "1px solid rgba(237,21,90,.3)",
                  color: "#FF7A9C",
                }}
              >
                {project.company.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>
                  {project.company}
                </p>
                <h2 className="text-lg font-semibold leading-tight" style={{ color: "var(--text)" }}>
                  {project.title}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={isFull ? "full" : "live"}>
                {isFull ? "Lotado" : "Ao vivo"}
              </Badge>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors duration-150"
                style={{
                  color: "var(--text-muted)",
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid var(--border)",
                }}
                aria-label="Fechar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <SkillTag key={skill} label={skill} variant="pink" />
            ))}
          </div>

          {/* Description */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
              Sobre o Desafio
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {project.description}
            </p>
          </section>

          {/* Scope */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
              Escopo & Entregas
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {project.scope}
            </p>
          </section>

          {/* Reward */}
          <section
            className="rounded-xl p-4"
            style={{
              background: "linear-gradient(135deg, rgba(237,21,90,.08), rgba(176,14,68,.06))",
              border: "1px solid rgba(237,21,90,.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF7A9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#FF7A9C" }}>
                Recompensas
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {project.reward}
            </p>
          </section>

          {/* Team */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                Time
              </h3>
              <span className="text-xs font-medium" style={{ color: "var(--text-faint)" }}>
                <span style={{ color: "var(--text-muted)" }}>{project.members.length}</span>/{project.slots} membros
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {project.members.map((member, i) => (
                <div
                  key={`${member.name}-${i}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                  style={{ background: "rgba(255,255,255,.03)", border: "1px solid var(--border)" }}
                >
                  <Avatar name={member.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      {member.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                      {member.course}
                    </p>
                  </div>
                  {i === 0 && project.authorId && (
                    <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(237,21,90,.12)", color: "#FF7A9C", border: "1px solid rgba(237,21,90,.2)" }}>
                      Criador
                    </span>
                  )}
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                  style={{ border: "1px dashed var(--border)", background: "transparent" }}
                >
                  <span
                    className="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs"
                    style={{
                      background: "rgba(255,255,255,.04)",
                      border: "1px dashed var(--border-strong)",
                      color: "var(--text-faint)",
                    }}
                  >
                    ?
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-faint)" }}>
                    Vaga disponível
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Actions */}
          {!authorOf && (
            <div className="flex justify-end pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              {memberOf ? (
                <CampusButton
                  variant="secondary"
                  loading={loading === "leave"}
                  onClick={handleLeave}
                >
                  Sair do projeto
                </CampusButton>
              ) : (
                <CampusButton
                  variant="primary"
                  loading={loading === "join"}
                  disabled={isFull}
                  onClick={handleJoin}
                >
                  {isFull ? "Projeto lotado" : "Entrar no projeto"}
                </CampusButton>
              )}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
