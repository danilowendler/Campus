"use client";

import { Avatar } from "./Avatar";
import { SkillTag } from "./SkillTag";
import { CampusButton } from "./CampusButton";
import { useProfile } from "@/lib/profile-context";

interface ProfileHeaderProps {
  onEdit: () => void;
}

export function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  const { profile } = useProfile();

  return (
    <div
      className="w-full"
      style={{ animation: "fadeUp .6s cubic-bezier(.22,1,.36,1) both" }}
    >
        {/* Cover strip */}
        <div
          className="w-full h-32 rounded-2xl mb-0"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-soft) 0%, rgba(176,14,68,.12) 50%, rgba(255,46,99,.08) 100%)",
            border: "1px solid var(--border)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* decorative orbs */}
          <div
            className="absolute -top-8 -right-8 w-40 h-40 rounded-full"
            style={{
              background: "radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)",
              filter: "blur(24px)",
            }}
          />
          <div
            className="absolute bottom-0 left-16 w-24 h-24 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(176,14,68,.18) 0%, transparent 70%)",
              filter: "blur(18px)",
            }}
          />
        </div>

        {/* Info row */}
        <div className="flex items-end justify-between gap-4 px-1 -mt-7">
          {/* Avatar (overlaps cover) */}
          <div
            style={{
              padding: 3,
              borderRadius: "50%",
              background: "var(--bg-elevated)",
              border: "2px solid var(--border-strong)",
              display: "inline-flex",
            }}
          >
            <Avatar name={profile.name} size="lg" />
          </div>

          {/* Edit button */}
          <CampusButton
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="mb-1"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar perfil
          </CampusButton>
        </div>

        {/* Name / course / bio */}
        <div className="mt-4 px-1 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>
            {profile.name}
          </h1>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                background: "var(--accent-light)",
                border: "1px solid var(--accent-subtle)",
                color: "#FF7A9C",
              }}
            >
              {profile.course}
            </span>
            <span className="text-xs" style={{ color: "var(--text-faint)" }}>
              {profile.email}
            </span>
          </div>

          {profile.bio && (
            <p
              className="text-sm leading-relaxed mt-1 max-w-xl"
              style={{ color: "var(--text-muted)" }}
            >
              {profile.bio}
            </p>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.skills.map((s) => (
                <SkillTag key={s} label={s} variant="pink" />
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
