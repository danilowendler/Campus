"use client";

import { useRef, useEffect, useState } from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
}

export function TiltCard({ children, className, style, intensity = 12 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -intensity;
    const rotY = ((x - cx) / cx) * intensity;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.setProperty("--mx", `${pctX}%`);
    card.style.setProperty("--my", `${pctY}%`);
  }

  function handleMouseLeave() {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <div
      ref={cardRef}
      className={cn("group relative", className)}
      style={{
        transformStyle: reducedMotion ? undefined : "preserve-3d",
        transition: reducedMotion ? undefined : "transform .4s cubic-bezier(.22,1,.36,1), box-shadow .3s",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow radial que segue cursor */}
      {!reducedMotion && (
        <span
          className="absolute inset-[-1px] rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[350ms] z-[2]"
          style={{
            background:
              "radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(237,21,90,.3), transparent 40%)",
          }}
          aria-hidden="true"
        />
      )}
      {/* Borda dinâmica que segue cursor */}
      {!reducedMotion && (
        <span
          className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[350ms] z-[3]"
          style={{
            padding: 1,
            background:
              "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(255,46,99,.7), rgba(237,21,90,.5) 30%, transparent 60%)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          aria-hidden="true"
        />
      )}
      <GlassCard className="h-full" noShimmer>
        {children}
      </GlassCard>
    </div>
  );
}
