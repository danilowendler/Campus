import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  noShimmer?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard({ children, className, style, noShimmer = false, onClick }, ref) {
    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 24px 60px -24px rgba(0,0,0,.6)",
          ...style,
        }}
        onClick={onClick}
      >
        {!noShimmer && (
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "inherit",
              background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)",
              opacity: 0.6,
              zIndex: 0,
            }}
            aria-hidden="true"
          />
        )}
        <div className="relative z-[1]">{children}</div>
      </div>
    );
  }
);
