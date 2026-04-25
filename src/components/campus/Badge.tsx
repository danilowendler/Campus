import { cn } from "@/lib/utils";

type BadgeVariant = "live" | "magenta" | "full" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  live: {
    background: "rgba(34,197,94,.12)",
    color: "#4ade80",
    border: "1px solid rgba(34,197,94,.3)",
  },
  magenta: {
    background: "rgba(237,21,90,.14)",
    color: "#FF7A9C",
    border: "1px solid rgba(237,21,90,.32)",
  },
  full: {
    background: "rgba(255,60,90,.12)",
    color: "#ff5577",
    border: "1px solid rgba(255,60,90,.3)",
  },
  default: {
    background: "rgba(255,255,255,.05)",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
  },
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[11px] font-medium tracking-[.02em]",
        className
      )}
      style={variantStyles[variant]}
    >
      {variant === "live" && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: "#4ade80",
            boxShadow: "0 0 8px #4ade80",
            animation: "glowPulse 1.6s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
