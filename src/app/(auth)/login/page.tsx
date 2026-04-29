import { Suspense } from "react";
import { AuthScreen } from "@/components/campus/AuthScreen";

export const metadata = {
  title: "Entrar — Campus FIAP",
  description: "Acesse a rede profissional fechada da FIAP com seu e-mail institucional.",
};

export default function LoginPage() {
  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div
        style={{
          animation: "fadeUp 0.7s cubic-bezier(.22,1,.36,1) both",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Suspense>
          <AuthScreen />
        </Suspense>
      </div>
    </main>
  );
}
