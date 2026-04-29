export function MeshBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "55vw",
          height: "55vw",
          borderRadius: "50%",
          background: "#ff0055",
          opacity: 0.07,
          filter: "blur(110px)",
          mixBlendMode: "screen",
          animation: "blobFloat 18s ease-in-out infinite",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          top: "-15%",
          right: "-15%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "#b00e44",
          opacity: 0.06,
          filter: "blur(110px)",
          mixBlendMode: "screen",
          animation: "blobFloat 22s ease-in-out infinite reverse",
          animationDelay: "-6s",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "20%",
          width: "45vw",
          height: "45vw",
          borderRadius: "50%",
          background: "#ff2e63",
          opacity: 0.05,
          filter: "blur(110px)",
          mixBlendMode: "screen",
          animation: "blobFloat 26s ease-in-out infinite",
          animationDelay: "-12s",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          position: "absolute",
          top: "30%",
          left: "40%",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: "#ff0055",
          opacity: 0.04,
          filter: "blur(140px)",
          mixBlendMode: "screen",
          animation: "blobFloat 30s ease-in-out infinite reverse",
          animationDelay: "-9s",
        }}
      />
    </div>
  );
}
