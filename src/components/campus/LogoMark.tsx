import { cn } from "@/lib/utils";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 28, className }: LogoMarkProps) {
  return (
    <span
      className={cn("inline-flex items-center justify-center relative flex-shrink-0", className)}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.286),
        background: "linear-gradient(135deg, #FF2E63 0%, #ED155A 50%, #B00E44 100%)",
        boxShadow: "0 0 18px rgba(237,21,90,.5), inset 0 0 12px rgba(255,255,255,.15)",
      }}
      aria-hidden="true"
    >
      {/* inner shimmer */}
      <span
        className="absolute inset-px pointer-events-none"
        style={{
          borderRadius: Math.round(size * 0.286) - 1,
          background: "linear-gradient(135deg, rgba(255,255,255,.18), transparent 60%)",
        }}
      />
      {/* C icon */}
      <svg
        width={size * 0.57}
        height={size * 0.57}
        viewBox="0 0 16 16"
        fill="none"
        className="relative z-10"
      >
        <path
          d="M11 5.5A4 4 0 1 0 11 10.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
