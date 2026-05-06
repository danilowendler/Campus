"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/campus/LogoMark";
import { CampusButton } from "@/components/campus/CampusButton";
import { createClient } from "@/lib/supabase/client";

type AuthTab = "login" | "register";

interface FieldError {
  email?: string;
  password?: string;
  name?: string;
  form?: string;
  formSuccess?: string;
}

export function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab: AuthTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [tab, setTab] = useState<AuthTab>(initialTab);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [success, setSuccess] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function validate(): FieldError {
    const errs: FieldError = {};
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";
    const name = nameRef.current?.value.trim() ?? "";

    if (tab === "register" && !name) {
      errs.name = "Nome é obrigatório.";
    }

    if (!email) {
      errs.email = "E-mail é obrigatório.";
    } else if (!email.endsWith("@fiap.com.br")) {
      errs.email = "Use seu e-mail institucional (@fiap.com.br).";
    }

    if (!password) {
      errs.password = "Senha é obrigatória.";
    } else if (password.length < 6) {
      errs.password = "Mínimo de 6 caracteres.";
    }

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    const supabase = createClient();
    const email = emailRef.current!.value.trim();
    const password = passwordRef.current!.value;

    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrors({ form: "E-mail ou senha incorretos." });
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
      router.refresh();
      const next = searchParams.get("next") ?? "/projects";
      router.push(next);
      return;
    } else {
      const name = nameRef.current!.value.trim();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) {
        setErrors({ form: error.message });
        setLoading(false);
        return;
      }
      // Se confirmação de e-mail está ativa, session será null após signUp
      if (!data.session) {
        setLoading(false);
        setErrors({ formSuccess: "Conta criada! Verifique seu e-mail para confirmar o cadastro e depois entre." });
        return;
      }
      // Confirmação desativada (dev) — sessão já existe, redirecionar
      setSuccess(true);
      setLoading(false);
      router.refresh();
      const next = searchParams.get("next") ?? "/projects";
      router.push(next);
      return;
    }
  }

  function switchTab(next: AuthTab) {
    setTab(next);
    setErrors({});
  }

  return (
    <div
      className="auth-card"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius-xl)",
        backdropFilter: "blur(24px) saturate(150%)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px -24px rgba(0,0,0,0.7), 0 0 60px -20px var(--accent-soft)",
        padding: "40px 36px",
        width: "100%",
        maxWidth: "400px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%)",
          pointerEvents: "none",
          borderRadius: "inherit",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <LogoMark size={40} />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--text)",
                lineHeight: 1.2,
              }}
            >
              Campus FIAP
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}
            >
              Rede profissional para alunos FIAP
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            padding: "4px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            backdropFilter: "blur(10px)",
            marginBottom: "24px",
          }}
        >
          {(["login", "register"] as AuthTab[]).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "calc(var(--radius) - 2px)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(255,46,99,.22), var(--accent-subtle))"
                    : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-muted)",
                  boxShadow: isActive
                    ? "inset 0 0 0 1px var(--accent-mid)"
                    : "none",
                }}
              >
                {t === "login" ? "Entrar" : "Cadastrar"}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {tab === "register" && (
            <Field label="Nome completo" error={errors.name}>
              <input
                ref={nameRef}
                type="text"
                placeholder="Seu nome"
                autoComplete="name"
                style={inputStyle(!!errors.name)}
              />
            </Field>
          )}

          <Field label="E-mail institucional" error={errors.email}>
            <input
              ref={emailRef}
              type="email"
              placeholder="nome@fiap.com.br"
              autoComplete="email"
              style={inputStyle(!!errors.email)}
              onChange={() => errors.email && setErrors((e) => ({ ...e, email: undefined }))}
            />
          </Field>

          <Field label="Senha" error={errors.password}>
            <input
              ref={passwordRef}
              type="password"
              placeholder="••••••••"
              autoComplete={tab === "login" ? "current-password" : "new-password"}
              style={inputStyle(!!errors.password)}
              onChange={() => errors.password && setErrors((e) => ({ ...e, password: undefined }))}
            />
          </Field>

          {errors.form && (
            <p
              role="alert"
              style={{
                fontSize: "13px",
                color: "#ff5577",
                background: "var(--accent-light)",
                border: "1px solid var(--accent-subtle)",
                borderRadius: "var(--radius)",
                padding: "10px 12px",
              }}
            >
              {errors.form}
            </p>
          )}

          {errors.formSuccess && (
            <p
              role="status"
              style={{
                fontSize: "13px",
                color: "#4ade80",
                background: "rgba(74,222,128,.08)",
                border: "1px solid rgba(74,222,128,.25)",
                borderRadius: "var(--radius)",
                padding: "10px 12px",
              }}
            >
              {errors.formSuccess}
            </p>
          )}

          <div style={{ marginTop: "4px" }}>
            <CampusButton
              variant="primary"
              size="lg"
              type="submit"
              disabled={loading || success}
              loading={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {success ? "Redirecionando…" : tab === "login" ? "Entrar na plataforma" : "Criar conta"}
            </CampusButton>
          </div>
        </form>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-faint)",
            marginTop: "20px",
            lineHeight: 1.5,
          }}
        >
          Acesso exclusivo para e-mails{" "}
          <span style={{ color: "var(--text-muted)" }}>@fiap.com.br</span>
        </p>
      </div>
    </div>
  );
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${hasError ? "var(--accent)" : "var(--border-strong)"}`,
    borderRadius: "var(--radius)",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    fontFamily: "var(--font)",
    boxShadow: hasError ? "0 0 0 3px var(--accent-soft)" : "none",
  };
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--text-muted)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          role="alert"
          style={{
            fontSize: "12px",
            color: "#ff5577",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
