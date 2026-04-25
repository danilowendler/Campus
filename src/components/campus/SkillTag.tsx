import { cn } from "@/lib/utils";

type SkillTagVariant = "pink" | "violet" | "blue" | "gray";

interface SkillTagProps {
  label: string;
  variant?: SkillTagVariant;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<SkillTagVariant, React.CSSProperties> = {
  pink: {
    background: "linear-gradient(135deg, rgba(237,21,90,.16), rgba(255,46,99,.12))",
    color: "#FF7A9C",
    border: "1px solid rgba(237,21,90,.32)",
    boxShadow: "inset 0 0 12px rgba(237,21,90,.10)",
  },
  violet: {
    background: "rgba(255,255,255,.04)",
    color: "#e4e4e7",
    border: "1px solid rgba(255,255,255,.14)",
  },
  blue: {
    background: "rgba(237,21,90,.08)",
    color: "#FFA3BB",
    border: "1px solid rgba(237,21,90,.22)",
  },
  gray: {
    background: "rgba(255,255,255,.05)",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
  },
};

export function SkillTag({ label, variant = "pink", onRemove, className }: SkillTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-[11px] py-1 text-xs font-medium rounded-full transition-[box-shadow,transform] duration-200",
        className
      )}
      style={variantStyles[variant]}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="bg-transparent border-0 cursor-pointer text-sm leading-none opacity-70 hover:opacity-100 p-0"
          style={{ color: "inherit" }}
          aria-label={`Remover ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
