"use client";

import { useState } from "react";
import { Nav } from "@/components/campus/Nav";
import { LogoMark } from "@/components/campus/LogoMark";
import { Avatar } from "@/components/campus/Avatar";
import { Badge } from "@/components/campus/Badge";
import { SkillTag } from "@/components/campus/SkillTag";
import { GlassCard } from "@/components/campus/GlassCard";
import { TiltCard } from "@/components/campus/TiltCard";
import { CampusButton } from "@/components/campus/CampusButton";
import { SkillInput } from "@/components/campus/SkillInput";
import { Tabs } from "@/components/campus/Tabs";
import { TeamSlots } from "@/components/campus/TeamSlots";
import { ToastProvider, useToast } from "@/components/campus/Toast";

/* ─── Seção de heading ─────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <p
        className="text-xs font-semibold tracking-[.14em] uppercase mb-5"
        style={{ color: "var(--text-faint)" }}
      >
        {title}
      </p>
      <div className="flex flex-wrap gap-4 items-start">{children}</div>
    </section>
  );
}

/* ─── Botão de toast demo ──────────────────────────────────── */
function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <CampusButton variant="primary" onClick={() => toast("Operação concluída com sucesso!")}>
        Toast default
      </CampusButton>
      <CampusButton variant="accent" onClick={() => toast("Time entrou no projeto!", "success")}>
        Toast success
      </CampusButton>
      <CampusButton variant="danger" onClick={() => toast("Erro ao salvar alterações.", "error")}>
        Toast error
      </CampusButton>
    </div>
  );
}

/* ─── Conteúdo principal ───────────────────────────────────── */
function KitContent() {
  const [activeTab, setActiveTab] = useState("todos");
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript"]);

  const members = [
    { name: "Ana Lima" },
    { name: "Bruno Costa" },
    { name: "Carla Silva" },
  ];

  return (
    <div>
      {/* Nav */}
      <Nav
        actions={
          <>
            <CampusButton variant="ghost" size="sm">Entrar</CampusButton>
            <CampusButton variant="primary" size="sm">Cadastrar</CampusButton>
          </>
        }
      />

      <main className="max-w-5xl mx-auto px-7 py-14">
        <div className="mb-12">
          <p
            className="text-xs font-semibold tracking-[.16em] uppercase mb-3"
            style={{ color: "var(--accent)" }}
          >
            Campus FIAP
          </p>
          <h1
            className="text-4xl font-semibold tracking-tight mb-2"
            style={{ color: "var(--text)" }}
          >
            UI Kit —{" "}
            <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--accent)" }}>
              validação visual
            </em>
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Todos os componentes primitivos do design system Campus FIAP.
          </p>
        </div>

        {/* ── LogoMark ── */}
        <Section title="LogoMark">
          <LogoMark size={20} />
          <LogoMark size={28} />
          <LogoMark size={40} />
          <LogoMark size={56} />
        </Section>

        {/* ── Avatar ── */}
        <Section title="Avatar">
          <Avatar name="Ana Lima" size="sm" />
          <Avatar name="Bruno Costa" size="md" />
          <Avatar name="Carla Dias" size="lg" />
          <Avatar name="Danilo Wendler" size="md" />
          <Avatar name="Eva Martins" size="lg" />
        </Section>

        {/* ── Badge ── */}
        <Section title="Badge">
          <Badge variant="live">Ao vivo</Badge>
          <Badge variant="magenta">FIAP</Badge>
          <Badge variant="full">Esgotado</Badge>
          <Badge variant="default">Pausado</Badge>
        </Section>

        {/* ── SkillTag ── */}
        <Section title="SkillTag">
          <SkillTag label="React" />
          <SkillTag label="TypeScript" />
          <SkillTag label="Next.js" variant="violet" />
          <SkillTag label="Supabase" variant="blue" />
          <SkillTag label="Figma" variant="gray" />
          <SkillTag label="Remove" onRemove={() => {}} />
        </Section>

        {/* ── CampusButton ── */}
        <Section title="Button — variantes">
          <CampusButton variant="primary">Primary</CampusButton>
          <CampusButton variant="secondary">Secondary</CampusButton>
          <CampusButton variant="ghost">Ghost</CampusButton>
          <CampusButton variant="accent">Accent</CampusButton>
          <CampusButton variant="danger">Danger</CampusButton>
        </Section>

        <Section title="Button — tamanhos">
          <CampusButton variant="primary" size="sm">Small</CampusButton>
          <CampusButton variant="primary" size="default">Default</CampusButton>
          <CampusButton variant="primary" size="lg">Large</CampusButton>
          <CampusButton variant="primary" loading>Carregando…</CampusButton>
          <CampusButton variant="primary" disabled>Desabilitado</CampusButton>
        </Section>

        {/* ── Tabs ── */}
        <Section title="Tabs">
          <Tabs
            tabs={[
              { id: "todos", label: "Todos", count: 12 },
              { id: "meus", label: "Meus", count: 3 },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </Section>

        {/* ── SkillInput ── */}
        <Section title="SkillInput">
          <div className="w-full max-w-md">
            <SkillInput value={skills} onChange={setSkills} />
            <p className="text-xs mt-2" style={{ color: "var(--text-faint)" }}>
              Enter ou vírgula para adicionar • Backspace para remover o último
            </p>
          </div>
        </Section>

        {/* ── TeamSlots ── */}
        <Section title="TeamSlots">
          <div className="flex flex-col gap-4">
            <TeamSlots members={members} slots={5} />
            <TeamSlots members={[]} slots={4} />
            <TeamSlots members={members.slice(0, 1)} slots={3} />
          </div>
        </Section>

        {/* ── GlassCard ── */}
        <Section title="GlassCard">
          <GlassCard className="p-6 w-64">
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
              Glass Card
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              backdrop-filter blur(20px) com shimmer interno
            </p>
          </GlassCard>
          <GlassCard className="p-6 w-64" noShimmer>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--text)" }}>
              Sem shimmer
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Variante sem o gradiente interno superior
            </p>
          </GlassCard>
        </Section>

        {/* ── TiltCard ── */}
        <Section title="TiltCard (hover para efeito 3D)">
          <TiltCard className="w-64 h-44">
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <Badge variant="live">Ao vivo</Badge>
                <p className="text-base font-semibold mt-3" style={{ color: "var(--text)" }}>
                  App de Mobilidade FIAP
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <SkillTag label="React Native" />
                <SkillTag label="Supabase" variant="violet" />
              </div>
            </div>
          </TiltCard>
          <TiltCard className="w-64 h-44" intensity={8}>
            <div className="p-6 h-full flex flex-col justify-between">
              <div>
                <Badge variant="magenta">FIAP Challenge</Badge>
                <p className="text-base font-semibold mt-3" style={{ color: "var(--text)" }}>
                  Dashboard Analytics
                </p>
              </div>
              <TeamSlots members={members.slice(0, 2)} slots={4} />
            </div>
          </TiltCard>
        </Section>

        {/* ── Toast ── */}
        <Section title="Toast / Notificações">
          <ToastDemo />
        </Section>
      </main>
    </div>
  );
}

/* ─── Exportação com Provider ──────────────────────────────── */
export function UiKitClient() {
  return (
    <ToastProvider>
      <KitContent />
    </ToastProvider>
  );
}
