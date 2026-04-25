import { CampusButton } from "./CampusButton";

export function CtaSection() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 48px",
        textAlign: "center",
        borderRadius: 32,
        maxWidth: 1080,
        margin: "0 auto 100px",
        background:
          "linear-gradient(135deg, rgba(237,21,90,.18), rgba(176,14,68,.10) 50%, rgba(255,46,99,.14))",
        border: "1px solid var(--border-strong)",
        boxShadow: "0 40px 120px -30px rgba(237,21,90,.4)",
      }}
    >
      {/* Radial glow topo */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center top, rgba(237,21,90,.35), transparent 60%)",
        }}
      />

      <h2
        style={{
          position: "relative",
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 600,
          letterSpacing: "-.035em",
          lineHeight: 1.05,
          marginBottom: 16,
          maxWidth: 720,
          marginLeft: "auto",
          marginRight: "auto",
          color: "var(--text)",
        }}
      >
        Pronto para construir algo{" "}
        <em
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            background: "linear-gradient(135deg, #FF5A82, #ED155A)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          real?
        </em>
      </h2>

      <p
        style={{
          position: "relative",
          fontSize: 17,
          color: "var(--text-muted)",
          marginBottom: 32,
          maxWidth: 520,
          marginLeft: "auto",
          marginRight: "auto",
          lineHeight: 1.6,
        }}
      >
        Use seu e-mail <strong style={{ color: "var(--text)" }}>@fiap.com.br</strong> e entre na
        rede. Projetos reais, equipes reais, recompensas reais.
      </p>

      <CampusButton variant="primary" size="lg" style={{ position: "relative" }}>
        Criar minha conta grátis
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </CampusButton>
    </section>
  );
}
