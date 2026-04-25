import { Avatar } from "./Avatar";

interface Member {
  name: string;
  src?: string;
}

interface TeamSlotsProps {
  members: Member[];
  slots: number;
  /** Cor de fundo do card pai para a borda dos avatares empilhados */
  stackBg?: string;
  className?: string;
}

export function TeamSlots({ members, slots, stackBg = "#0a0a0c", className }: TeamSlotsProps) {
  const filled = members.length;
  const empty = Math.max(0, slots - filled);

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {/* Avatar stack */}
      <div className="flex">
        {members.map((m, i) => (
          <Avatar
            key={`${m.name}-${i}`}
            name={m.name}
            src={m.src}
            size="sm"
            stackBorder={stackBg}
            className={i > 0 ? "-ml-2" : ""}
          />
        ))}
        {/* Slots vazios com "?" */}
        {Array.from({ length: empty }).map((_, i) => (
          <span
            key={`empty-${i}`}
            className="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-medium flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px dashed var(--border-strong)",
              color: "var(--text-faint)",
              marginLeft: members.length > 0 || i > 0 ? "-8px" : "0",
              boxShadow: `0 0 0 2px ${stackBg}`,
            }}
            aria-label="Vaga disponível"
          >
            ?
          </span>
        ))}
      </div>

      {/* Contador X/Y */}
      <span className="text-xs font-medium" style={{ color: "var(--text-faint)" }}>
        <span style={{ color: "var(--text-muted)" }}>{filled}</span>/{slots} membros
      </span>
    </div>
  );
}
