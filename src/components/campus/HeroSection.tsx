import { CampusButton } from "./CampusButton";

const stats = [
  { num: "+1.200", label: "Alunos ativos" },
  { num: "47", label: "Projetos rodando" },
  { num: "12", label: "Empresas parceiras" },
];

export function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        textAlign: "center",
        padding: "100px 28px 90px",
        maxWidth: 1040,
        margin: "0 auto",
      }}
    >
      {/* Eyebrow pill */}
      <div
        className="fade-up inline-flex items-center gap-2.5"
        style={{
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: ".14em",
          color: "#e4e4e7",
          textTransform: "uppercase",
          padding: "6px 14px 6px 6px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid var(--border-strong)",
          backdropFilter: "blur(10px)",
          marginBottom: 32,
          display: "inline-flex",
        }}
      >
        <span
          className="inline-flex items-center gap-1.5"
          style={{
            padding: "3px 10px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #FF2E63, #ED155A)",
            color: "#fff",
            fontWeight: 600,
            letterSpacing: ".08em",
          }}
        >
          ✦ Novo
        </span>
        Rede exclusiva para alunos FIAP
      </div>

      {/* Title */}
      <h1
        className="fade-up fade-up-1"
        style={{
          fontSize: "clamp(48px, 8.8vw, 124px)",
          fontWeight: 600,
          letterSpacing: "-.045em",
          lineHeight: 0.96,
          color: "var(--text)",
          marginBottom: 28,
        }}
      >
        Construa com as{" "}
        <em
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            background:
              "linear-gradient(135deg, #FFB3C7 0%, #FF2E63 30%, #ED155A 60%, #B00E44 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            display: "inline-block",
            filter: "drop-shadow(0 0 32px rgba(237,21,90,.5))",
            animation: "gradientShift 8s ease-in-out infinite",
            padding: "0 .04em",
          }}
        >
          pessoas certas
        </em>
      </h1>

      {/* Subtitle */}
      <p
        className="fade-up fade-up-2"
        style={{
          fontSize: "clamp(17px, 1.8vw, 20px)",
          color: "var(--text-muted)",
          lineHeight: 1.55,
          maxWidth: 620,
          margin: "0 auto 40px",
        }}
      >
        Conecte-se com outros alunos FIAP, monte equipes multidisciplinares e
        construa projetos reais para empresas parceiras.
      </p>

      {/* CTAs */}
      <div
        className="fade-up fade-up-3"
        style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
      >
        <CampusButton variant="primary" size="lg">
          Entrar na plataforma
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </CampusButton>
        <CampusButton variant="secondary" size="lg">
          Ver projetos
        </CampusButton>
      </div>

      {/* Stats */}
      <div
        className="fade-up fade-up-4"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 48,
          marginTop: 68,
          flexWrap: "wrap",
        }}
      >
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 44,
                fontWeight: 400,
                background: "linear-gradient(135deg, #FF5A82, #ED155A)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1,
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
