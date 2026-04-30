# Campus FIAP

Rede profissional fechada para alunos FIAP. Empresas parceiras postam desafios reais; alunos formam equipes e constroem soluções para ganhar recompensas de carreira (mentorias, fast-track de contratação, visitas técnicas).

**Acesso restrito a e-mails `@fiap.com.br`.**

## Produção

[https://campus-fiap.vercel.app](https://campus-fiap.vercel.app)

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Backend / DB | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth — domínio `@fiap.com.br` enforçado server-side |
| Deploy | Vercel |

## Setup local

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### Instalação

```bash
git clone https://github.com/danilowendler/Campus.git
cd campus-fiap
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e preencha com as chaves do seu projeto Supabase:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

### Banco de dados

Aplique as migrations na ordem no painel SQL do Supabase:

```
supabase/migrations/20260428000001_initial_schema.sql
supabase/migrations/20260428000002_seed.sql
supabase/migrations/20260428000003_functions.sql
supabase/migrations/20260428000004_security_fixes.sql
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura de pastas

```
campus-fiap/
├── app/
│   ├── (auth)/         # Login
│   ├── (app)/          # Rotas autenticadas (projects, profile, settings)
│   └── page.tsx        # Landing page pública
├── components/
│   ├── ui/             # Primitivos shadcn/ui
│   └── campus/         # Componentes de domínio
├── lib/
│   └── supabase/       # client.ts + server.ts
└── supabase/
    └── migrations/     # Schema SQL versionado
```
