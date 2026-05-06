"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/campus/ProfileHeader";
import { ProfileEdit } from "@/components/campus/ProfileEdit";
import { ProjectCard } from "@/components/campus/ProjectCard";
import { ProjectDetail } from "@/components/campus/ProjectDetail";
import { useProfile } from "@/lib/profile-context";
import type { UserRow, ProjectWithMembers } from "@/lib/supabase/types";

interface ProfilePageClientProps {
  initialProfile: UserRow;
  myProjects: ProjectWithMembers[];
  currentUserId: string;
}

export function ProfilePageClient({ initialProfile, myProjects, currentUserId }: ProfilePageClientProps) {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<ProjectWithMembers | null>(null);
  const { profile } = useProfile();

  const skillCount = profile.skills.length;
  const memberCount = myProjects.filter((p) => p.author_id !== currentUserId).length;
  const authorCount = myProjects.filter((p) => p.author_id === currentUserId).length;

  const stats = [
    { label: "Projetos como membro", value: memberCount },
    { label: "Projetos criados", value: authorCount },
    { label: "Skills cadastradas", value: skillCount },
  ];

  return (
    <>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-12 pb-20 sm:px-6 flex flex-col gap-8">
        <ProfileHeader onEdit={() => setEditing(true)} />

        <hr className="my-2" style={{ border: "none", borderTop: "1px solid var(--border)" }} />

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-3 sm:gap-4"
          style={{ animation: "fadeUp .65s cubic-bezier(.22,1,.36,1) .05s both" }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1 py-4 px-1 rounded-xl text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}
            >
              <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--text)" }}>
                {s.value}
              </span>
              <span className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <hr className="my-2" style={{ border: "none", borderTop: "1px solid var(--border)" }} />

        {/* My Projects */}
        <section
          className="flex flex-col gap-5"
          style={{ animation: "fadeUp .65s cubic-bezier(.22,1,.36,1) .1s both" }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
              Meus projetos
            </h2>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full tabular-nums"
              style={{
                background: "var(--accent-light)",
                border: "1px solid var(--accent-subtle)",
                color: "#FF7A9C",
              }}
            >
              {myProjects.length}
            </span>
          </div>

          {myProjects.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 py-14 rounded-2xl"
              style={{ border: "1px dashed var(--border-strong)", background: "rgba(255,255,255,.015)" }}
            >
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--accent-light)", border: "1px solid var(--accent-subtle)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ED155A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l.09-.09a4.5 4.5 0 0 1 6.32 0 4.5 4.5 0 0 0 6.32 0l.09-.09c1.26-1.5 2-5 2-5a4.5 4.5 0 0 0-4.5 4.5" />
                  <path d="M12 2C6.5 2 2 6.5 2 12" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                Nenhum projeto ainda
              </p>
              <p className="text-[13px] text-center max-w-xs" style={{ color: "var(--text-faint)" }}>
                Entre em um projeto no feed ou crie o seu próprio para ele aparecer aqui.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  currentUserId={currentUserId}
                  isMember={p.author_id !== currentUserId}
                  onViewDetail={setSelected}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {editing && <ProfileEdit onClose={() => setEditing(false)} />}
      {selected && (
        <ProjectDetail
          project={selected}
          currentUserId={currentUserId}
          isMember={selected.author_id !== currentUserId}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
