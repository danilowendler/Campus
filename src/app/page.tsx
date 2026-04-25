export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <p
          className="text-sm font-medium tracking-widest uppercase mb-4"
          style={{ color: "var(--accent)" }}
        >
          Campus FIAP
        </p>
        <h1
          className="text-4xl font-semibold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Construa com as{" "}
          <em style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}>
            pessoas certas
          </em>
        </h1>
      </div>
    </main>
  );
}
