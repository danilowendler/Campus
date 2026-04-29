import { LogoMark } from "@/components/campus/LogoMark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav
        className="sticky top-0 z-[100] flex items-center px-4 sm:px-7 h-16"
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <a
          href="/"
          className="flex items-center gap-3 no-underline"
          style={{ color: "var(--text)" }}
        >
          <LogoMark size={34} />
          <span className="text-[17px] font-bold tracking-tight leading-none">
            Campus
          </span>
          <span
            className="text-[10px] font-semibold tracking-[.18em] uppercase px-1.5 py-0.5 rounded-md"
            style={{
              color: "var(--accent)",
              background: "rgba(237,21,90,.1)",
              border: "1px solid rgba(237,21,90,.2)",
            }}
          >
            FIAP
          </span>
        </a>
      </nav>
      {children}
    </>
  );
}
