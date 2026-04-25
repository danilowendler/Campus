"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/campus/LogoMark";
import { CampusButton } from "@/components/campus/CampusButton";

type AuthTab = "login" | "register";

interface FieldError {
  email?: string;
  password?: string;
  name?: string;
}

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
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

    // Simulate async auth
    await new Promise((r) => setTimeout(r, 900));

    setCookie("campus_session", "mock_session_token");
    setSuccess(true);
    setLoading(false);

    const next = searchParams.get("next") ?? "/projects";
    router.push(next);
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
          "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px -24px rgba(0,0,0,0.7), 0 0 60px -20px rgba(237,21,90,0.12)",
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
                    ? "linear-gradient(135deg, rgba(255,46,99,.22), rgba(237,21,90,.22))"
                    : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-muted)",
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(237,21,90,.35)"
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
    border: `1px solid ${hasError ? "rgba(237,21,90,.6)" : "var(--border-strong)"}`,
    borderRadius: "var(--radius)",
    color: "var(--text)",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    fontFamily: "var(--font)",
    boxShadow: hasError ? "0 0 0 3px rgba(237,21,90,.12)" : "none",
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
