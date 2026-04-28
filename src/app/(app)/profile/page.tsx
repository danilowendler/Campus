"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/campus/ProfileHeader";
import { ProfileEdit } from "@/components/campus/ProfileEdit";
import { ProjectCard } from "@/components/campus/ProjectCard";
import { ProjectDetail } from "@/components/campus/ProjectDetail";
import { ProjectsProvider, useProjects } from "@/lib/projects-context";
import { useProfile } from "@/lib/profile-context";
import type { Project } from "@/lib/mock-data";

/* ─── My projects section ──────────────────────────────────── */
function MyProjects({ onViewDetail }: { onViewDetail: (p: Project) => void }) {
  const { projects, isAuthor } = useProjects();
  const { profile } = useProfile();

  // Match by profile.name so renaming the user reflects immediately
  const mine = projects.filter(
    (p) => p.members.some((m) => m.name === profile.name) || isAuthor(p.id)
  );

  return (
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
            background: "rgba(237,21,90,.1)",
            border: "1px solid rgba(237,21,90,.22)",
            color: "#FF7A9C",
          }}
        >
          {mine.length}
        </span>
      </div>

      {mine.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((p) => (
            <ProjectCard key={p.id} project={p} onViewDetail={onViewDetail} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Empty state ──────────────────────────────────────────── */
function EmptyProjects() {
  return (
    <div
      className="flex flex-col items-center gap-3 py-14 rounded-2xl"
      style={{
        border: "1px dashed var(--border-strong)",
        background: "rgba(255,255,255,.015)",
      }}
    >
      <span
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: "rgba(237,21,90,.1)",
          border: "1px solid rgba(237,21,90,.2)",
        }}
      >
        {/* Rocket icon — semantically correct for "no projects yet" */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ED155A"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
  );
}

/* ─── Stats row ────────────────────────────────────────────── */
function StatsRow() {
  const { projects, isAuthor } = useProjects();
  const { profile } = useProfile();

  const memberCount = projects.filter((p) =>
    p.members.some((m) => m.name === profile.name)
  ).length;
  const authorCount = projects.filter((p) => isAuthor(p.id)).length;
  const skillCount = profile.skills.length;

  const stats = [
    { label: "Projetos como membro", value: memberCount },
    { label: "Projetos criados", value: authorCount },
    { label: "Skills cadastradas", value: skillCount },
  ];

  return (
    <div
      className="grid grid-cols-3 gap-3 sm:gap-4"
      style={{ animation: "fadeUp .65s cubic-bezier(.22,1,.36,1) .05s both" }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center gap-1 py-4 px-1 rounded-xl text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
          }}
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
  );
}

/* ─── Divider ──────────────────────────────────────────────── */
function Divider() {
  return (
    <hr className="my-2" style={{ border: "none", borderTop: "1px solid var(--border)" }} />
  );
}

/* ─── Page shell ───────────────────────────────────────────── */
function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      {/*
       * pt-12 gives breathing room from the 64px sticky navbar.
       * pb-20 prevents the last card from touching the viewport edge.
       * Both modals live here — outside any animated ancestor —
       * so `position: fixed` behaves correctly on all browsers.
       */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-12 pb-20 sm:px-6 flex flex-col gap-8">
        <ProfileHeader onEdit={() => setEditing(true)} />
        <Divider />
        <StatsRow />
        <Divider />
        <MyProjects onViewDetail={setSelected} />
      </main>

      {editing && <ProfileEdit onClose={() => setEditing(false)} />}
      {selected && <ProjectDetail project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ─── Root export ───────────────────────────────────────────── */
export default function ProfilePageRoot() {
  return (
    <ProjectsProvider>
      <ProfilePage />
    </ProjectsProvider>
  );
}
