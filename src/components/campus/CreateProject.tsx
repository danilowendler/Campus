"use client";

import { useEffect, useState, useTransition } from "react";
import { GlassCard } from "./GlassCard";
import { SkillInput } from "./SkillInput";
import { CampusButton } from "./CampusButton";
import { createProject } from "@/lib/actions/projects";

interface CreateProjectProps {
  onClose: () => void;
  onCreated?: () => void;
}

interface FormState {
  title: string;
  company: string;
  description: string;
  scope: string;
  reward: string;
  skills: string[];
  slots: number;
}

const EMPTY_FORM: FormState = {
  title: "",
  company: "",
  description: "",
  scope: "",
  reward: "",
  skills: [],
  slots: 4,
};

export function CreateProject({ onClose, onCreated }: CreateProjectProps) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [mounted, setMounted] = useState(false);

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

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) errs.title = "Título é obrigatório";
    if (!form.company.trim()) errs.company = "Empresa é obrigatória";
    if (!form.description.trim()) errs.description = "Descrição é obrigatória";
    if (form.skills.length === 0) errs.skills = "Adicione ao menos uma skill";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    startTransition(async () => {
      await createProject({
        title: form.title.trim(),
        company: form.company.trim(),
        description: form.description.trim(),
        scope: form.scope.trim() || "A ser definido com o time.",
        reward: form.reward.trim() || "A combinar.",
        skills: form.skills,
        slots: form.slots,
      });
      onCreated?.();
      onClose();
    });
  }

  const inputBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    color: "var(--text)",
    fontFamily: "var(--font)",
    fontSize: 14,
    padding: "10px 14px",
    width: "100%",
    outline: "none",
    transition: "border-color .15s, box-shadow .15s",
  };

  function focusStyle(e: React.FocusEvent<HTMLElement>) {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(237,21,90,.5)";
    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(237,21,90,.14)";
  }
  function blurStyle(e: React.FocusEvent<HTMLElement>) {
    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
    (e.currentTarget as HTMLElement).style.boxShadow = "none";
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
      aria-label="Novo projeto"
    >
      <GlassCard
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto"
        style={{
          transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(.97)",
          transition: "transform .3s cubic-bezier(.22,1,.36,1), opacity .25s ease",
          opacity: mounted ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Modal header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
                Novo Projeto
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                Publique um desafio e monte seu time
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg inline-flex items-center justify-center transition-colors duration-150"
              style={{
                color: "var(--text-muted)",
                background: "rgba(255,255,255,.05)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.05)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              }}
              aria-label="Fechar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {/* Row: title + company */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Título do projeto" error={errors.title} required>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Ex: Dashboard de Telemetria"
                  style={inputBase}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </Field>
              <Field label="Empresa parceira" error={errors.company} required>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Ex: Ford, Itaú, Raízen…"
                  style={inputBase}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Descrição" error={errors.description} required>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Descreva o problema que o projeto resolve e o impacto esperado…"
                rows={3}
                style={{ ...inputBase, resize: "vertical" }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            {/* Scope */}
            <Field label="Escopo & Entregas" hint="Opcional — detalhe as responsabilidades do time">
              <textarea
                value={form.scope}
                onChange={(e) => set("scope", e.target.value)}
                placeholder="Liste as principais entregas, tecnologias e rituais do projeto…"
                rows={3}
                style={{ ...inputBase, resize: "vertical" }}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            {/* Reward */}
            <Field label="Recompensas" hint="Opcional — o que o time ganha ao concluir">
              <input
                type="text"
                value={form.reward}
                onChange={(e) => set("reward", e.target.value)}
                placeholder="Ex: fast-track para estágio, mentoria, premiação…"
                style={inputBase}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            {/* Skills */}
            <Field label="Skills necessárias" error={errors.skills} required>
              <SkillInput
                value={form.skills}
                onChange={(tags) => set("skills", tags)}
                placeholder="React, Python, UX… (Enter para adicionar)"
              />
            </Field>

            {/* Slots slider */}
            <Field label={`Vagas no time — ${form.slots} pessoas`}>
              <div className="flex items-center gap-3">
                <span className="text-xs w-4 text-center" style={{ color: "var(--text-faint)" }}>2</span>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={form.slots}
                  onChange={(e) => set("slots", Number(e.target.value))}
                  className="flex-1 accent-[#ED155A]"
                  style={{ accentColor: "#ED155A", cursor: "pointer" }}
                />
                <span className="text-xs w-5 text-center" style={{ color: "var(--text-faint)" }}>10</span>
                <span
                  className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-sm font-semibold flex-shrink-0"
                  style={{
                    background: "rgba(237,21,90,.12)",
                    border: "1px solid rgba(237,21,90,.25)",
                    color: "#FF7A9C",
                  }}
                >
                  {form.slots}
                </span>
              </div>
            </Field>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <CampusButton type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </CampusButton>
              <CampusButton type="submit" variant="primary" loading={isPending}>
                {isPending ? "" : "Publicar projeto"}
              </CampusButton>
            </div>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium flex items-center gap-1" style={{ color: "var(--text)" }}>
        {label}
        {required && <span style={{ color: "#ED155A" }}>*</span>}
        {hint && <span className="ml-1 font-normal text-xs" style={{ color: "var(--text-faint)" }}>— {hint}</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: "#ff5577" }}>
          {error}
        </p>
      )}
    </div>
  );
}
