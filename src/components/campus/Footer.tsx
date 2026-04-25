import { LogoMark } from "./LogoMark";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "36px 28px",
        textAlign: "center",
        fontSize: 13,
        color: "var(--text-faint)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--text-muted)",
        }}
      >
        <LogoMark size={22} />
        <span style={{ fontWeight: 600, fontSize: 14 }}>Campus</span>
      </div>

      <span>© {new Date().getFullYear()} Campus FIAP. Todos os direitos reservados.</span>

      <span>
        Feito para alunos da{" "}
        <a
          href="https://www.fiap.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-fiap-link"
        >
          FIAP
        </a>
      </span>
    </footer>
  );
}
