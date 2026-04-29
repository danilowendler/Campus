"use client";

import { useEffect } from "react";
import { CampusButton } from "@/components/campus/CampusButton";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfileError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[profile]", error);
  }, [error]);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-24">
      <div
        className="flex flex-col items-center text-center gap-5 max-w-sm"
        style={{ animation: "fadeUp .5s cubic-bezier(.22,1,.36,1) both" }}
      >
        <span
          className="w-16 h-16 rounded-2xl inline-flex items-center justify-center"
          style={{
            background: "rgba(255,60,90,.1)",
            border: "1px solid rgba(255,60,90,.25)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff5577" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>

        <div>
          <p className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
            Perfil indisponível
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Não foi possível carregar os dados do perfil. Verifique sua conexão e tente novamente.
          </p>
        </div>

        <CampusButton variant="primary" onClick={reset}>
          Tentar novamente
        </CampusButton>
      </div>
    </main>
  );
}
