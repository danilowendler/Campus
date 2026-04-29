import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { MeshBackground } from "@/components/campus/MeshBackground";
import { GrainOverlay } from "@/components/campus/GrainOverlay";
import { cn } from "@/lib/utils";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://campus.fiap.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Campus FIAP — Construa com as pessoas certas",
    template: "%s — Campus FIAP",
  },
  description:
    "Rede profissional fechada para alunos FIAP. Empresas parceiras publicam desafios reais; alunos formam times e ganham recompensas de carreira.",
  keywords: ["FIAP", "projetos", "estudantes", "carreira", "tecnologia", "times"],
  authors: [{ name: "FIAP" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Campus FIAP",
    title: "Campus FIAP — Construa com as pessoas certas",
    description:
      "Rede profissional fechada para alunos FIAP. Empresas parceiras publicam desafios reais; alunos formam times e ganham recompensas de carreira.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Campus FIAP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus FIAP — Construa com as pessoas certas",
    description:
      "Rede profissional fechada para alunos FIAP. Empresas parceiras publicam desafios reais; alunos formam times e ganham recompensas de carreira.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full antialiased",
        instrumentSans.variable,
        instrumentSerif.variable
      )}
    >
      <body
        className="min-h-full flex flex-col relative"
        style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font)" }}
      >
        <MeshBackground />
        <GrainOverlay />
        <div className="relative z-10 flex flex-col min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
