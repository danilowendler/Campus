"use client";

import { useState, useEffect, useRef } from "react";
import { CampusButton } from "./CampusButton";
import { SkillInput } from "./SkillInput";
import { useProfile, COURSES, type Course } from "@/lib/profile-context";
import { useToast } from "./Toast";

interface ProfileEditProps {
  onClose: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[12px] font-medium mb-1.5 uppercase tracking-wide"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "10px 13px",
  fontSize: 14,
  color: "var(--text)",
  fontFamily: "var(--font)",
  outline: "none",
  transition: "border-color .15s, box-shadow .15s",
};

export function ProfileEdit({ onClose }: ProfileEditProps) {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();

  const [name, setName] = useState(profile.name);
  const [course, setCourse] = useState<Course>(profile.course);
  const [bio, setBio] = useState(profile.bio);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [saving, setSaving] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);

  // close on overlay click
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  // close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), course, bio: bio.trim(), skills });
      toast("Perfil atualizado com sucesso!", "success");
      onClose();
    } finally {
      setSaving(false);
    }
  }

  function focusInput(el: HTMLElement | null) {
    if (!el) return;
    el.style.borderColor = "rgba(237,21,90,.5)";
    el.style.boxShadow = "0 0 0 3px rgba(237,21,90,.14)";
  }
  function blurInput(el: HTMLElement | null) {
    if (!el) return;
    el.style.borderColor = "var(--border)";
    el.style.boxShadow = "none";
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4"
      style={{ background: "rgba(0,0,0,.65)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full sm:max-w-lg flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: "rgba(16,16,20,.96)",
          border: "1px solid var(--border-strong)",
          backdropFilter: "blur(24px) saturate(140%)",
          boxShadow: "0 32px 80px -16px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.04) inset",
          animation: "fadeUp .35s cubic-bezier(.22,1,.36,1) both",
          /* Cap to 90% of the dynamic viewport so it clears the keyboard on mobile */
          maxHeight: "90dvh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
              Editar perfil
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              As alterações são refletidas imediatamente
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.07)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "transparent")
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body — flex-1 + overflow-y-auto allows the content to scroll
            while header and footer stay pinned */}
        <div className="flex-1 px-6 py-5 flex flex-col gap-5 overflow-y-auto">
          {/* Name */}
          <div>
            <FieldLabel>Nome completo</FieldLabel>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              style={inputStyle}
              onFocus={(e) => focusInput(e.currentTarget)}
              onBlur={(e) => blurInput(e.currentTarget)}
            />
            {!name.trim() && (
              <p className="text-[12px] mt-1" style={{ color: "#ff5577" }}>
                O nome não pode estar vazio
              </p>
            )}
          </div>

          {/* Course */}
          <div>
            <FieldLabel>Curso</FieldLabel>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value as Course)}
              style={{
                ...inputStyle,
                appearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 13px center",
                paddingRight: 36,
                cursor: "pointer",
              }}
              onFocus={(e) => focusInput(e.currentTarget)}
              onBlur={(e) => blurInput(e.currentTarget)}
            >
              {COURSES.map((c) => (
                <option key={c} value={c} style={{ background: "#101014", color: "#fafafa" }}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <FieldLabel>Bio</FieldLabel>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Fale um pouco sobre você..."
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: 80,
              }}
              onFocus={(e) => focusInput(e.currentTarget)}
              onBlur={(e) => blurInput(e.currentTarget)}
            />
          </div>

          {/* Skills */}
          <div>
            <FieldLabel>Skills</FieldLabel>
            <SkillInput value={skills} onChange={setSkills} maxTags={12} />
            <p className="text-[11px] mt-1.5" style={{ color: "var(--text-faint)" }}>
              Pressione Enter ou vírgula para adicionar
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <CampusButton variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </CampusButton>
          <CampusButton
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={saving}
            disabled={!name.trim()}
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </CampusButton>
        </div>
      </div>
    </div>
  );
}
