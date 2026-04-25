import { GlassCard } from "./GlassCard";

const ICON_SEARCH = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
);
const ICON_USERS = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ICON_CODE = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>
  </svg>
);
const ICON_ROCKET = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);
const ICON_LAYERS = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12.83 2.18-9 4a2 2 0 0 0 0 3.64l9 4a2 2 0 0 0 1.66 0l9-4a2 2 0 0 0 0-3.64l-9-4a2 2 0 0 0-1.66 0z"/>
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
  </svg>
);
const ICON_TRENDING = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const CARDS = [
  {
    icon: ICON_SEARCH,
    title: "Encontre",
    sub: "Navegue projetos reais postados por empresas parceiras da FIAP e filtre pelo que mais combina com você.",
    num: "01",
    span: "cf-1",
  },
  {
    icon: ICON_USERS,
    title: "Monte seu time",
    sub: "Convide alunos de outros cursos. Diversidade de habilidades é o segredo dos melhores projetos.",
    num: "02",
    span: "cf-2",
  },
  {
    icon: ICON_CODE,
    title: "Construa",
    sub: "Desenvolva a solução com sua equipe usando as tecnologias que dominam.",
    num: "03",
    span: "cf-3",
  },
  {
    icon: ICON_ROCKET,
    title: "Ship",
    sub: "Entregue para a empresa parceira e receba feedback real de quem vai usar.",
    num: "04",
    span: "cf-4",
  },
  {
    icon: ICON_LAYERS,
    title: "Portfólio",
    sub: "Cada projeto entregue vira um case real no seu perfil. Recrutadores adoram ver código em produção.",
    num: "05",
    span: "cf-5",
  },
  {
    icon: ICON_TRENDING,
    title: "Recompensas",
    sub: "Mentorships, fast-track hiring e visitas técnicas às empresas para os times que se destacam.",
    num: "06",
    span: "",
  },
];

const iconBox: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, rgba(255,46,99,.22), rgba(237,21,90,.22))",
  border: "1px solid rgba(237,21,90,.32)",
  color: "#FFB3C7",
  boxShadow: "0 0 24px rgba(237,21,90,.2)",
  marginBottom: 16,
  flexShrink: 0,
};

const bentoNum: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontSize: 54,
  background: "linear-gradient(135deg, #FF5A82, #ED155A)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  lineHeight: 1,
  marginBottom: 14,
};

interface BentoCardProps {
  icon: React.ReactNode;
  title: string;
  sub: string;
  num: string;
  big?: boolean;
}

function BentoCard({ icon, title, sub, num }: BentoCardProps) {
  return (
    <GlassCard
      style={{
        position: "relative",
        padding: 28,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        height: "100%",
        minHeight: 220,
      }}
    >
      <div>
        <div style={bentoNum}>{num}</div>
        <div style={iconBox}>{icon}</div>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-.02em",
            lineHeight: 1.15,
            marginBottom: 10,
            color: "var(--text)",
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.55 }}>{sub}</p>
      </div>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -20,
          bottom: -20,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(237,21,90,.22), transparent 60%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
    </GlassCard>
  );
}

export function HowItWorksSection() {
  return (
    <section
      style={{
        padding: "80px 28px",
        maxWidth: 1240,
        margin: "0 auto",
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
          Como funciona
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
          De ideia a{" "}
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
            projeto real
          </em>{" "}
          em 6 passos
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
          Um fluxo simples que transforma desafios de empresas reais em
          experiências que constroem carreira.
        </p>
      </div>

      {/* Bento grid — 3 colunas × 2 linhas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
        }}
      >
        {CARDS.map((card) => (
          <BentoCard key={card.num} {...card} />
        ))}
      </div>

    </section>
  );
}
