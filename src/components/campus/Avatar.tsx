import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
  /** Borda fina para member-stack (passa a cor de fundo do card pai) */
  stackBorder?: string;
}

const sizeMap: Record<AvatarSize, { px: number; font: number }> = {
  sm: { px: 28, font: 11 },
  md: { px: 36, font: 13 },
  lg: { px: 60, font: 22 },
};

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ name, src, size = "md", className, stackBorder }: AvatarProps) {
  const { px, font } = sizeMap[size];

  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-full flex-shrink-0 font-semibold", className)}
      title={name}
      style={{
        width: px,
        height: px,
        fontSize: font,
        background: "linear-gradient(135deg, #FF2E63, #ED155A)",
        color: "#fff",
        boxShadow: stackBorder
          ? `inset 0 0 0 1px rgba(255,255,255,.12), 0 0 0 2px ${stackBorder}`
          : "inset 0 0 0 1px rgba(255,255,255,.12)",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          style={{ width: px, height: px, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
