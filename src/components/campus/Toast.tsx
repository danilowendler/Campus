"use client";

import { createContext, useCallback, useContext, useState } from "react";

/* ─── Types ────────────────────────────────────────────────── */
type ToastType = "default" | "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void;
}

/* ─── Context ──────────────────────────────────────────────── */
const ToastContext = createContext<ToastCtx | null>(null);

/* ─── Provider ─────────────────────────────────────────────── */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const typeColors: Record<ToastType, React.CSSProperties> = {
    default: {},
    success: { borderColor: "rgba(74,222,128,.35)", color: "#4ade80" },
    error: { borderColor: "rgba(255,60,90,.35)", color: "#ff5577" },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div
          className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2"
          aria-live="polite"
          aria-label="Notificações"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className="px-[18px] py-3 rounded-xl text-[13px] font-medium max-w-xs"
              style={{
                background: "rgba(20,20,24,.85)",
                color: "var(--text)",
                border: "1px solid var(--border-strong)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,.8)",
                animation: "fadeUp .35s ease both",
                ...typeColors[t.type],
              }}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/* ─── Hook ─────────────────────────────────────────────────── */
export function useToast(): ToastCtx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
