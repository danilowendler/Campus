"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Field } from "@base-ui/react/field";
import { CampusButton } from "./CampusButton";
import { SkillInput } from "./SkillInput";
import { useProfile, COURSES, type Course } from "@/lib/profile-context";
import { useToast } from "./Toast";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { uploadResume, deleteResume } from "@/lib/actions/resume";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const TITLE_ID = "profile-edit-title";

  useFocusTrap(dialogRef, true);

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
    el.style.borderColor = "var(--accent)";
    el.style.boxShadow = "0 0 0 3px var(--accent-soft)";
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
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
    >
      <div
        ref={dialogRef}
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
            <h2 id={TITLE_ID} className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
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

          {/* Currículo */}
          <ResumeDropzone />
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

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_MIME = "application/pdf";

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function ResumeDropzone() {
  const { profile, setResumeLocal } = useProfile();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [localSize, setLocalSize] = useState<number | null>(null);

  const hasResume = Boolean(profile.resume_path && profile.resume_name);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    // Validação client-side (a Server Action revalida).
    if (file.type !== RESUME_MIME) {
      toast("O currículo precisa estar em PDF", "error");
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      toast("PDF excede o limite de 5 MB", "error");
      return;
    }

    const fd = new FormData();
    fd.append("resume", file);

    startTransition(async () => {
      const result = await uploadResume(fd);
      if ("error" in result) {
        toast(result.error, "error");
        return;
      }
      setResumeLocal({
        resume_path: `${profile.id}/resume.pdf`,
        resume_name: file.name,
      });
      setLocalSize(file.size);
      toast("Currículo enviado com sucesso", "success");
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    // Permite re-selecionar o mesmo arquivo após erro.
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (isPending) return;
    handleFiles(e.dataTransfer.files);
  }

  function handleDelete() {
    if (isPending) return;
    startTransition(async () => {
      const result = await deleteResume();
      if ("error" in result) {
        toast(result.error, "error");
        return;
      }
      setResumeLocal({ resume_path: null, resume_name: null });
      setLocalSize(null);
      toast("Currículo removido", "success");
    });
  }

  return (
    <Field.Root className="block">
      <Field.Label
        nativeLabel={false}
        render={
          <span
            className="block text-[12px] font-medium mb-1.5 uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          />
        }
      >
        Currículo (PDF)
      </Field.Label>

      {!hasResume ? (
        <label
          htmlFor="resume-file-input"
          onDragOver={(e) => {
            e.preventDefault();
            if (!isPending) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          aria-busy={isPending}
          className="flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 rounded-xl"
          style={{
            background: "rgba(255,255,255,.05)",
            border: `1.5px dashed ${
              isDragging ? "rgba(237,21,90,.55)" : "rgba(255,255,255,.1)"
            }`,
            padding: "22px 16px",
            boxShadow: isDragging
              ? "0 0 0 4px rgba(237,21,90,.12), 0 8px 24px -10px rgba(237,21,90,.4)"
              : "none",
            opacity: isPending ? 0.7 : 1,
            pointerEvents: isPending ? "none" : "auto",
          }}
          onMouseEnter={(e) => {
            if (isPending || isDragging) return;
            const el = e.currentTarget;
            el.style.borderColor = "rgba(237,21,90,.3)";
            el.style.boxShadow = "0 0 0 4px rgba(237,21,90,.08)";
          }}
          onMouseLeave={(e) => {
            if (isPending || isDragging) return;
            const el = e.currentTarget;
            el.style.borderColor = "rgba(255,255,255,.1)";
            el.style.boxShadow = "none";
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--accent)", marginBottom: 8 }}
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
            {isPending ? "Enviando…" : "Arraste seu PDF ou clique para selecionar"}
          </span>
          <span className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>
            Apenas .pdf, até 5 MB
          </span>
          <input
            id="resume-file-input"
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={handleInputChange}
            disabled={isPending}
          />
        </label>
      ) : (
        <div
          className="flex items-center gap-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px) saturate(140%)",
            padding: "12px 14px",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{
              width: 36,
              height: 36,
              background: "var(--accent-soft)",
              border: "1px solid rgba(237,21,90,.25)",
              color: "var(--accent)",
            }}
            aria-hidden="true"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-[13px] font-medium truncate"
              style={{ color: "var(--text)" }}
              title={profile.resume_name ?? undefined}
            >
              {profile.resume_name}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
              {isPending ? "Processando…" : localSize !== null ? `PDF · ${formatBytes(localSize)}` : "PDF anexado"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            aria-label="Remover currículo"
            className="inline-flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              width: 32,
              height: 32,
              background: "rgba(255,60,90,.12)",
              color: "#ff5577",
              border: "1px solid rgba(255,60,90,.3)",
            }}
            onMouseEnter={(e) => {
              if (isPending) return;
              (e.currentTarget as HTMLElement).style.background = "rgba(255,60,90,.2)";
            }}
            onMouseLeave={(e) => {
              if (isPending) return;
              (e.currentTarget as HTMLElement).style.background = "rgba(255,60,90,.12)";
            }}
          >
            {isPending ? (
              <span
                className="rounded-full border-2"
                style={{
                  width: 14,
                  height: 14,
                  borderColor: "rgba(255,60,90,.25)",
                  borderTopColor: "#ff5577",
                  animation: "spin .7s linear infinite",
                }}
                aria-hidden="true"
              />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
              </svg>
            )}
          </button>
        </div>
      )}

      <Field.Description
        render={
          <p
            className="text-[11px] mt-1.5"
            style={{ color: "var(--text-faint)" }}
          />
        }
      >
        Empresas parceiras logadas poderão baixar este PDF a partir do seu perfil.
      </Field.Description>
    </Field.Root>
  );
}
