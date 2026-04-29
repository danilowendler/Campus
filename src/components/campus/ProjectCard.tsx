"use client";

import { useState, useTransition } from "react";
import { GlassCard } from "./GlassCard";
import { Badge } from "./Badge";
import { SkillTag } from "./SkillTag";
import { TeamSlots } from "./TeamSlots";
import { CampusButton } from "./CampusButton";
import { joinProject, leaveProject, deleteProject } from "@/lib/actions/projects";
import type { ProjectWithMembers } from "@/lib/supabase/types";

interface ProjectCardProps {
  project: ProjectWithMembers;
  currentUserId: string;
  isMember: boolean;
  onViewDetail: (project: ProjectWithMembers) => void;
}

export function ProjectCard({ project, currentUserId, isMember: isMemberProp, onViewDetail }: ProjectCardProps) {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<"join" | "leave" | "delete" | null>(null);

  // Optimistic local state — reflete imediatamente sem esperar revalidatePath
  const [optimisticMember, setOptimisticMember] = useState(isMemberProp);
  const [optimisticCount, setOptimisticCount] = useState(project.member_count);

  const isAuthor = project.author_id === currentUserId;
  const isFull = project.status === "full" || optimisticCount >= project.slots;

  const members = Array.isArray(project.members)
    ? (project.members as { name: string; course: string }[])
    : [];

  function handleJoin(e: React.MouseEvent) {
    e.stopPropagation();
    if (optimisticMember || isFull) return;
    setPendingAction("join");
    // Optimistic update imediato
    setOptimisticMember(true);
    setOptimisticCount((c) => c + 1);
    startTransition(async () => {
      try {
        await joinProject(project.id);
      } catch {
        // Reverte se falhar
        setOptimisticMember(false);
        setOptimisticCount((c) => c - 1);
      } finally {
        setPendingAction(null);
      }
    });
  }

  function handleLeave(e: React.MouseEvent) {
    e.stopPropagation();
    if (!optimisticMember) return;
    setPendingAction("leave");
    // Optimistic update imediato
    setOptimisticMember(false);
    setOptimisticCount((c) => Math.max(0, c - 1));
    startTransition(async () => {
      try {
        await leaveProject(project.id);
      } catch {
        // Reverte se falhar
        setOptimisticMember(true);
        setOptimisticCount((c) => c + 1);
      } finally {
        setPendingAction(null);
      }
    });
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setPendingAction("delete");
    startTransition(async () => {
      try {
        await deleteProject(project.id);
      } finally {
        setPendingAction(null);
      }
    });
  }

  return (
    <GlassCard
      className="flex flex-col gap-4 p-5 cursor-pointer group transition-transform duration-200 hover:-translate-y-0.5"
      style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 24px 60px -24px rgba(0,0,0,.6)" }}
      onClick={() => onViewDetail(project)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(237,21,90,.2), rgba(176,14,68,.15))",
              border: "1px solid rgba(237,21,90,.25)",
              color: "#FF7A9C",
            }}
          >
            {project.company.slice(0, 2).toUpperCase()}
          </span>
          <span className="text-xs font-medium truncate" style={{ color: "var(--text-muted)" }}>
            {project.company}
          </span>
        </div>
        <Badge variant={isFull ? "full" : "live"} className="flex-shrink-0">
          {isFull ? "Lotado" : "Ao vivo"}
        </Badge>
      </div>

      {/* Title */}
      <div>
        <h3
          className="text-[15px] font-semibold leading-snug mb-1.5 group-hover:text-white transition-colors"
          style={{ color: "var(--text)" }}
        >
          {project.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: "var(--text-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {project.skills.slice(0, 4).map((skill) => (
          <SkillTag key={skill} label={skill} variant="pink" />
        ))}
        {project.skills.length > 4 && (
          <SkillTag label={`+${project.skills.length - 4}`} variant="gray" />
        )}
      </div>

      {/* Footer: team + actions */}
      <div className="flex items-center justify-between gap-3 pt-1 mt-auto">
        <TeamSlots
          members={members}
          slots={project.slots}
          stackBg="var(--bg-elevated)"
        />

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {isAuthor && (
            <CampusButton
              variant="danger"
              size="sm"
              loading={isPending && pendingAction === "delete"}
              onClick={handleDelete}
              aria-label="Excluir projeto"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </CampusButton>
          )}

          {optimisticMember && !isAuthor && (
            <CampusButton
              variant="secondary"
              size="sm"
              loading={isPending && pendingAction === "leave"}
              onClick={handleLeave}
            >
              Sair
            </CampusButton>
          )}

          {!optimisticMember && !isAuthor && (
            <CampusButton
              variant={isFull ? "ghost" : "primary"}
              size="sm"
              loading={isPending && pendingAction === "join"}
              disabled={isFull || (isPending && pendingAction === "join")}
              onClick={handleJoin}
            >
              {isFull ? "Lotado" : "Entrar"}
            </CampusButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
