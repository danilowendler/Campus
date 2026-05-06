"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/campus/GlassCard";
import { CampusButton } from "@/components/campus/CampusButton";
import { useTheme, type Theme } from "@/components/campus/ThemeProvider";
import { useToast } from "@/components/campus/Toast";

/* ─── Toggle Switch ────────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative inline-flex w-11 h-6 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0"
      style={{
        background: checked
          ? "linear-gradient(135deg, #FF2E63, #ED155A)"
          : "rgba(255,255,255,0.1)",
        border: "1px solid",
        borderColor: checked ? "transparent" : "var(--border-strong)",
        boxShadow: checked ? "0 0 14px -3px var(--accent-strong)" : "none",
      }}
    >
      <span
        className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full transition-transform duration-200"
        style={{
          background: "#fff",
          transform: checked ? "translateX(20px)" : "translateX(0)",
          boxShadow: "0 1px 4px rgba(0,0,0,.35)",
        }}
      />
    </button>
  );
}

/* ─── Section Header ───────────────────────────────────────────── */
function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>
        {title}
      </h2>
      {description && (
        <p className="text-[13px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      )}
    </div>
  );
}

/* ─── Password Input ───────────────────────────────────────────── */
function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        className="block text-[13px] font-medium mb-1.5"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-colors"
        style={{
          background: "rgba(255,255,255,.04)",
          border: "1px solid",
          borderColor: error ? "rgba(255,60,90,.5)" : "var(--border-strong)",
          color: "var(--text)",
          fontFamily: "var(--font)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "rgba(255,60,90,.5)"
            : "var(--border-strong)";
        }}
      />
      {error && (
        <p className="text-[12px] mt-1" style={{ color: "#ff5577" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Theme options ────────────────────────────────────────────── */
const themeOptions: { id: Theme; label: string; icon: React.ReactNode }[] = [
  {
    id: "dark",
    label: "Escuro",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    id: "light",
    label: "Claro",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    id: "system",
    label: "Sistema",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

/* ─── Notification items ───────────────────────────────────────── */
const notifItems = [
  {
    key: "newProjects" as const,
    label: "Novos projetos publicados",
    desc: "Quando uma empresa parceira abrir uma nova vaga",
  },
  {
    key: "teamActivity" as const,
    label: "Atividade no time",
    desc: "Quando alguém entrar ou sair de um projeto seu",
  },
  {
    key: "directMessages" as const,
    label: "Mensagens diretas",
    desc: "Notificações de mensagens de outros membros",
  },
  {
    key: "platformUpdates" as const,
    label: "Atualizações da plataforma",
    desc: "Novidades e melhorias no Campus FIAP",
  },
];

type NotifState = Record<"newProjects" | "teamActivity" | "directMessages" | "platformUpdates", boolean>;

/* ─── Page ─────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwErrors, setPwErrors] = useState<Partial<typeof pwForm>>({});

  const [notifs, setNotifs] = useState<NotifState>({
    newProjects: true,
    teamActivity: true,
    directMessages: false,
    platformUpdates: true,
  });
  const [notifLoading, setNotifLoading] = useState(false);

  function handleSavePassword() {
    const errors: Partial<typeof pwForm> = {};
    if (!pwForm.current) errors.current = "Informe a senha atual";
    if (!pwForm.next) errors.next = "Informe a nova senha";
    else if (pwForm.next.length < 8) errors.next = "Mínimo de 8 caracteres";
    if (pwForm.next !== pwForm.confirm) errors.confirm = "Senhas não coincidem";

    if (Object.keys(errors).length > 0) {
      setPwErrors(errors);
      return;
    }

    setPwErrors({});
    setPwLoading(true);
    setTimeout(() => {
      setPwLoading(false);
      setPwForm({ current: "", next: "", confirm: "" });
      toast("Senha atualizada com sucesso", "success");
    }, 900);
  }

  function handleSaveNotifications() {
    setNotifLoading(true);
    setTimeout(() => {
      setNotifLoading(false);
      toast("Preferências de notificação salvas", "success");
    }, 600);
  }

  function handleSignOutAll() {
    document.cookie =
      "campus_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/login");
  }

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-10 sm:px-6">
      {/* Page header */}
      <div
        className="mb-10"
        style={{ animation: "fadeUp .6s cubic-bezier(.22,1,.36,1) both" }}
      >
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Configurações
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Gerencie sua conta e preferências da plataforma
        </p>
      </div>

      <div
        className="flex flex-col gap-5"
        style={{
          animation: "fadeUp .5s cubic-bezier(.22,1,.36,1) both",
          animationDelay: ".1s",
        }}
      >
        {/* ── Aparência ── */}
        <GlassCard className="p-6">
          <SectionHeader
            title="Aparência"
            description="Escolha como o Campus aparece para você"
          />
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ id, label, icon }) => {
              const active = theme === id;
              return (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className="flex flex-col items-center gap-2.5 py-5 rounded-xl transition-all duration-200 cursor-pointer"
                  style={{
                    background: active
                      ? "var(--accent-light)"
                      : "rgba(255,255,255,.03)",
                    border: "1px solid",
                    borderColor: active
                      ? "var(--accent-mid)"
                      : "var(--border)",
                    color: active ? "var(--accent)" : "var(--text-muted)",
                    boxShadow: active
                      ? "0 0 20px -6px var(--accent-subtle)"
                      : "none",
                  }}
                >
                  <span className="w-6 h-6 flex items-center justify-center">
                    {icon}
                  </span>
                  <span className="text-[13px] font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* ── Segurança ── */}
        <GlassCard className="p-6">
          <SectionHeader
            title="Segurança"
            description="Atualize sua senha de acesso à plataforma"
          />
          <div className="flex flex-col gap-4">
            <PasswordInput
              label="Senha atual"
              value={pwForm.current}
              onChange={(v) => setPwForm((f) => ({ ...f, current: v }))}
              placeholder="••••••••"
              error={pwErrors.current}
            />
            <PasswordInput
              label="Nova senha"
              value={pwForm.next}
              onChange={(v) => setPwForm((f) => ({ ...f, next: v }))}
              placeholder="Mínimo 8 caracteres"
              error={pwErrors.next}
            />
            <PasswordInput
              label="Confirmar nova senha"
              value={pwForm.confirm}
              onChange={(v) => setPwForm((f) => ({ ...f, confirm: v }))}
              placeholder="Repita a nova senha"
              error={pwErrors.confirm}
            />
            <div className="flex justify-end pt-1">
              <CampusButton
                variant="primary"
                size="sm"
                loading={pwLoading}
                onClick={handleSavePassword}
              >
                Salvar senha
              </CampusButton>
            </div>
          </div>
        </GlassCard>

        {/* ── Notificações ── */}
        <GlassCard className="p-6">
          <SectionHeader
            title="Notificações"
            description="Escolha quais atualizações você quer receber por e-mail"
          />
          <div className="flex flex-col">
            {notifItems.map(({ key, label, desc }, i) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 py-3.5"
                style={{
                  borderTop:
                    i > 0 ? "1px solid var(--border)" : "none",
                }}
              >
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {desc}
                  </p>
                </div>
                <Toggle
                  checked={notifs[key]}
                  onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))}
                  label={label}
                />
              </div>
            ))}
          </div>
          <div
            className="flex justify-end mt-4 pt-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <CampusButton
              variant="primary"
              size="sm"
              loading={notifLoading}
              onClick={handleSaveNotifications}
            >
              Salvar preferências
            </CampusButton>
          </div>
        </GlassCard>

        {/* ── Sessão ── */}
        <GlassCard
          className="p-6"
          style={{ borderColor: "rgba(255,60,90,.18)" }}
        >
          <SectionHeader title="Sessão" />
          <div className="flex items-center justify-between gap-6">
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                Sair de todos os dispositivos
              </p>
              <p
                className="text-[12px] mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Encerra sua sessão em todos os aparelhos conectados à sua conta
              </p>
            </div>
            <CampusButton
              variant="danger"
              size="sm"
              onClick={handleSignOutAll}
              className="flex-shrink-0"
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair de todos
            </CampusButton>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
