"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      className={cn("inline-flex gap-1 p-1 rounded-xl", className)}
      role="tablist"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className="px-4 py-2 rounded-[9px] text-[13px] font-medium transition-all duration-200 cursor-pointer border-0"
            style={
              isActive
                ? {
                    background:
                      "linear-gradient(135deg, rgba(255,46,99,.22), rgba(237,21,90,.22))",
                    color: "#fff",
                    boxShadow: "inset 0 0 0 1px rgba(237,21,90,.35)",
                  }
                : {
                    background: "transparent",
                    color: "var(--text-muted)",
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,.15)"
                    : "rgba(255,255,255,.07)",
                  color: isActive ? "#fff" : "var(--text-faint)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
