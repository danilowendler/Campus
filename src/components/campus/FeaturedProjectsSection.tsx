import { Badge } from "./Badge";
import { SkillTag } from "./SkillTag";
import { TeamSlots } from "./TeamSlots";
import { TiltCard } from "./TiltCard";

const PROJECTS = [
  {
    id: "p1",
    title: "App de Finanças para Jovens",
    company: "Itaú Unibanco",
    description:
      "Plataforma simples de controle financeiro voltada para universitários que estão gerenciando dinheiro pela primeira vez. Desafio real com mentoria de produto.",
    skills: ["React Native", "Node.js", "Design UI"],
    slots: 4,
    members: [
      { name: "João Silva" },
      { name: "Ana Lima" },
    ],
    visualVariant: "default",
  },
  {
    id: "p2",
    title: "IA que estuda com você",
    company: "Cogna Educação",
    description: "LLMs que viram tutor: resumos automáticos, flashcards e geração de questões.",
    skills: ["Python", "ML"],
    slots: 5,
    members: [{ name: "Carlos Mendes" }],
    visualVariant: "alt",
  },
  {
    id: "p3",
    title: "Rede de Saúde Mental",
    company: "FIAP Health",
    description: "Conecta estudantes com psicólogos voluntários e grupos de apoio dentro da universidade.",
    skills: ["Mobile", "Backend"],
    slots: 3,
    members: [{ name: "Camila Torres" }, { name: "Vitor Nunes" }],
    visualVariant: "alt2",
  },
];

const visualStyles: Record<string, React.CSSProperties> = {
  default: {
    background:
      "radial-gradient(circle, rgba(237,21,90,.42), rgba(176,14,68,.2) 40%, transparent 70%)",
  },
  alt: {
    background:
      "radial-gradient(circle, rgba(255,46,99,.38), rgba(237,21,90,.18) 40%, transparent 70%)",
  },
  alt2: {
    background:
      "radial-gradient(circle, rgba(176,14,68,.42), rgba(255,46,99,.2) 40%, transparent 70%)",
  },
};

export function FeaturedProjectsSection() {
  const [big, ...small] = PROJECTS;

  return (
    <section
      id="projetos"
      style={{
        padding: "0 28px 80px",
        maxWidth: 1240,
        margin: "0 auto",
        scrollMarginTop: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 48,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 500,
            color: "#FF7A9C",
            letterSpacing: ".16em",
            textTransform: "uppercase",
            padding: "5px 12px",
            borderRadius: 999,
            background: "rgba(237,21,90,.10)",
            border: "1px solid rgba(237,21,90,.25)",
          }}
        >
          Ao vivo agora
        </span>
        <h2
          style={{
            fontSize: "clamp(30px, 4.5vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-.03em",
            lineHeight: 1.05,
            maxWidth: 740,
            marginTop: 18,
            marginBottom: 14,
            textAlign: "center",
          }}
        >
          Projetos{" "}
          <em
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              background: "linear-gradient(135deg, #FF5A82 0%, #ED155A 55%, #B00E44 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            rodando agora
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "var(--text-muted)",
            maxWidth: 600,
            lineHeight: 1.55,
            textAlign: "center",
          }}
        >
          Equipes de alunos FIAP construindo soluções reais para empresas
          parceiras. Você pode entrar agora.
        </p>
      </div>

      {/* Bento assimétrico */}
      <div
        className="projects-bento"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 18,
        }}
      >
        {/* bp-1: card grande */}
        <div style={{ gridColumn: "span 4", gridRow: "span 2", minHeight: 420 }}>
          <TiltCard className="h-full" intensity={8}>
            <div
              className="project-bento big"
              style={{
                position: "relative",
                padding: 26,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                overflow: "hidden",
                height: "100%",
                minHeight: 420,
              }}
            >
              {/* Decoração visual */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: -40,
                  top: -30,
                  width: 280,
                  height: 280,
                  borderRadius: "50%",
                  filter: "blur(10px)",
                  pointerEvents: "none",
                  ...visualStyles[big.visualVariant],
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <Badge variant="live">Ao vivo</Badge>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-faint)",
                      fontWeight: 500,
                    }}
                  >
                    {big.company}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 34,
                    fontWeight: 600,
                    letterSpacing: "-.02em",
                    lineHeight: 1.08,
                    marginBottom: 14,
                    maxWidth: "80%",
                    color: "var(--text)",
                  }}
                >
                  {big.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    color: "var(--text-muted)",
                    lineHeight: 1.55,
                    maxWidth: "90%",
                  }}
                >
                  {big.description}
                </p>
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {big.skills.map((s) => (
                    <SkillTag key={s} label={s} />
                  ))}
                </div>
                <TeamSlots members={big.members} slots={big.slots} stackBg="transparent" />
              </div>
            </div>
          </TiltCard>
        </div>

        {/* bp-2 e bp-3: cards menores */}
        {small.map((p) => (
          <div key={p.id} style={{ gridColumn: "span 2", minHeight: 200 }}>
            <TiltCard className="h-full" intensity={10}>
              <div
                style={{
                  position: "relative",
                  padding: 26,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  overflow: "hidden",
                  height: "100%",
                  minHeight: 200,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: -40,
                    top: -30,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    filter: "blur(10px)",
                    pointerEvents: "none",
                    ...visualStyles[p.visualVariant],
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Badge variant="live">Ao vivo</Badge>
                  </div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "-.02em",
                      lineHeight: 1.2,
                      marginBottom: 8,
                      color: "var(--text)",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.55,
                    }}
                  >
                    {p.company}
                  </p>
                </div>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {p.skills.map((s) => (
                      <SkillTag key={s} label={s} />
                    ))}
                  </div>
                  <TeamSlots members={p.members} slots={p.slots} stackBg="transparent" />
                </div>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}
