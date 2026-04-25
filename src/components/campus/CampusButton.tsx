import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type ButtonSize = "sm" | "default" | "lg";

interface CampusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #FF2E63 0%, #ED155A 55%, #B00E44 100%)",
    color: "#fff",
    boxShadow: "0 8px 28px -8px rgba(237,21,90,.65), inset 0 1px 0 rgba(255,255,255,.25)",
    border: "none",
  },
  secondary: {
    background: "rgba(255,255,255,0.04)",
    color: "var(--text)",
    border: "1px solid var(--border-strong)",
    backdropFilter: "blur(8px)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "none",
    padding: "8px 14px",
  },
  accent: {
    background: "linear-gradient(135deg, #FF2E63, #ED155A)",
    color: "#fff",
    boxShadow: "0 6px 20px -6px rgba(237,21,90,.55)",
    border: "none",
  },
  danger: {
    background: "rgba(255,60,90,.12)",
    color: "#ff5577",
    border: "1px solid rgba(255,60,90,.3)",
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-[13px]",
  default: "px-[18px] py-[10px] text-sm",
  lg: "px-7 py-3.5 text-[15px] font-semibold",
};

const hoverMap: Record<ButtonVariant, React.CSSProperties> = {
  primary: { transform: "translateY(-2px)", boxShadow: "0 14px 42px -10px rgba(237,21,90,.8), inset 0 1px 0 rgba(255,255,255,.3)" },
  secondary: { background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.22)", transform: "translateY(-1px)" },
  ghost: { color: "var(--text)", background: "rgba(255,255,255,0.05)" },
  accent: { transform: "translateY(-1px)", boxShadow: "0 10px 28px -6px rgba(237,21,90,.7)" },
  danger: { background: "rgba(255,60,90,.2)" },
};

export function CampusButton({
  variant = "primary",
  size = "default",
  loading = false,
  className,
  children,
  disabled,
  onMouseEnter,
  onMouseLeave,
  style,
  ...props
}: CampusButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium cursor-pointer",
        "transition-[transform,box-shadow,background,border-color] duration-150",
        "whitespace-nowrap select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:!transform-none",
        sizeStyles[size],
        size === "lg" && "rounded-xl",
        className
      )}
      style={{ ...variantStyles[variant], fontFamily: "var(--font)", ...style }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const hover = hoverMap[variant];
          Object.assign((e.currentTarget as HTMLElement).style, hover);
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          const base = variantStyles[variant];
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "";
          el.style.boxShadow = (base.boxShadow as string) ?? "";
          el.style.background = base.background as string;
          if ("borderColor" in hoverMap[variant]) {
            el.style.borderColor = "";
          }
        }
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (variant === "primary") (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {loading ? (
        <span
          className="w-5 h-5 rounded-full border-2"
          style={{
            borderColor: "rgba(255,255,255,.15)",
            borderTopColor: "#fff",
            animation: "spin .7s linear infinite",
          }}
          aria-label="Carregando"
        />
      ) : (
        children
      )}
    </button>
  );
}
