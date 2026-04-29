"use client";

import { useEffect } from "react";
import { CampusButton } from "@/components/campus/CampusButton";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[projects]", error);
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
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>

        <div>
          <p className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
            Algo deu errado
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Não foi possível carregar os projetos. Verifique sua conexão e tente novamente.
          </p>
        </div>

        <CampusButton variant="primary" onClick={reset}>
          Tentar novamente
        </CampusButton>
      </div>
    </main>
  );
}
