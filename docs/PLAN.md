# Campus FIAP — Plano de Execução

> **Estratégia:** interface primeiro, dados reais depois.  
> Cada milestone entrega algo navegável e testável antes de avançar.  
> O protótipo de referência está em `project/Campus Landing.html` — toda a UI deve ser
> uma transcrição pixel-perfect desse arquivo para componentes React/Next.js.

---

## Milestone 0 — Setup & Fundação

**Branch:** `feat/setup`  
**Objetivo:** Repositório Next.js funcional com design system configurado, pronto para receber componentes.

### Entregas

- [x] Inicializar projeto Next.js 14 com App Router e TypeScript strict  
  ```bash
  npx create-next-app@latest campus-fiap --typescript --tailwind --app --src-dir no --import-alias "@/*"
  ```
- [x] Configurar `tailwind.config.ts` com os tokens do design system (cores, raios, fontes)
- [x] Adicionar variáveis CSS em `app/globals.css` (`--bg`, `--accent`, `--text-muted` etc.)
- [x] Importar fontes `Instrument Sans` e `Instrument Serif` via `next/font/google`
- [x] Instalar e inicializar shadcn/ui (`npx shadcn@latest init`)
- [x] Criar estrutura de pastas: `components/ui/`, `components/campus/`, `lib/`
- [x] Configurar `app/layout.tsx` com fundo `--bg` e a mesh de blobs animados
- [x] Adicionar `MeshBackground` e `GrainOverlay` como componentes de layout fixo
- [x] Commit de validação: rodar `npm run build` sem erros

**Commit final:** `feat: scaffold next.js app with design system tokens and mesh background`

---

## Milestone 1 — Componentes Base (UI Kit)

**Branch:** `feat/ui-kit`  
**Objetivo:** Biblioteca de componentes primitivos extraída do HTML de referência, sem lógica de negócio.

### Entregas

- [ ] `components/campus/LogoMark.tsx` — ícone quadrado com gradiente e glow rosa
- [ ] `components/campus/Nav.tsx` — barra sticky com glassmorphism (blur 18px), logo, links e slot de ações
- [ ] `components/campus/Avatar.tsx` — círculo com iniciais e gradiente radial; variantes `sm` / `md` / `lg`
- [ ] `components/campus/SkillTag.tsx` — pill rosa com borda `rgba(237,21,90,.3)` e variante `violet`
- [ ] `components/campus/Badge.tsx` — `badge-live` (pulsante verde) e `badge-magenta`
- [ ] `components/campus/GlassCard.tsx` — wrapper com `backdrop-filter`, borda e shimmer `::before`
- [ ] `components/campus/TiltCard.tsx` — wrapper `"use client"` com efeito 3D e glow seguindo cursor
- [ ] `components/campus/Button.tsx` — variantes `primary`, `secondary`, `ghost`, `accent`, `danger`; tamanhos `sm`/`default`/`lg`
- [ ] `components/campus/SkillInput.tsx` — input multi-tag controlado (`"use client"`)
- [ ] `components/campus/Tabs.tsx` — tabs com fundo glass e tab ativa com gradiente rosa
- [ ] `components/campus/TeamSlots.tsx` — visualização `X/Y` com avatares empilhados e vagas com `?`
- [ ] `components/campus/Toast.tsx` + `ToastProvider` — notificações flutuantes (`"use client"`)
- [ ] Página `/ui-kit` temporária listando todos os componentes (para revisão visual antes de prosseguir)

**Commit final:** `feat: add campus ui-kit components (nav, cards, buttons, tags, tilt, toast)`

---

## Milestone 2 — Landing Page

**Branch:** `feat/landing`  
**Objetivo:** Página pública `/` fiel ao protótipo, estática (sem dados reais), totalmente navegável.

### Seções a implementar (em ordem)

- [ ] **Hero** — heading com `clamp()`, palavra em itálico `Instrument Serif` com gradiente, subtítulo, dois CTAs, hero-stats (`+1.200 alunos`, `47 projetos`, `12 empresas`)
- [ ] **Marquee de skills** — faixa infinita com tags de tecnologias (mask fade nas bordas)
- [ ] **"Como Funciona"** — bento grid 6 colunas com 6 cards: Encontre, Monte, Construa, Ship, Portfólio, Recompensas; cada card tem ícone, título, subtexto e decoração de fundo
- [ ] **"Projetos rodando agora"** — bento assimétrico: 1 card grande (`bp-1`) + 2 cards menores (`bp-2`, `bp-3`) com `TiltCard`, badge "Ao vivo", skills e member-stack
- [ ] **CTA section** — caixa com gradiente de fundo, heading com `<em>`, parágrafo e botão primário
- [ ] **Footer** — `LogoMark` + texto de copyright + link "FIAP"

**Commit final:** `feat: landing page — hero, marquee, bento how-it-works, featured projects, cta`

---

## Milestone 3 — Autenticação (UI)

**Branch:** `feat/auth-ui`  
**Objetivo:** Tela de login/cadastro com visual do protótipo, usando estado local (sem backend ainda).

### Entregas

- [ ] `app/(auth)/login/page.tsx` — rota pública
- [ ] `components/campus/AuthScreen.tsx` — card glass centralizado com logo, tabs "Entrar"/"Cadastrar", campos de e-mail e senha, botão primário com loader
- [ ] Validação client-side: e-mail deve terminar em `@fiap.com.br` (mensagem de erro inline)
- [ ] Animação `fadeUp` na entrada do card
- [ ] Redirecionamento simulado para `/projects` após submit (usando `useRouter`)
- [ ] Middleware `middleware.ts` esqueleto: rota `/projects` e `/profile` protegidas (retorna para `/login` se sem sessão)

**Commit final:** `feat: auth screen ui with fiap domain validation and route protection skeleton`

---

## Milestone 4 — Feed de Projetos (UI)

**Branch:** `feat/projects-ui`  
**Objetivo:** Página `/projects` com grid de cards, modal de detalhe, e formulário de criação — tudo com dados mock.

### Entregas

- [ ] `app/projects/page.tsx` — rota protegida
- [ ] `components/campus/ProjectCard.tsx` — card com título, empresa, descrição truncada (`-webkit-line-clamp: 2`), skills, `TeamSlots`, botões "Entrar" / "Sair" / "Excluir"
- [ ] `components/campus/ProjectDetail.tsx` — modal overlay glass com detalhes completos: escopo, recompensas, roster de membros, vagas com `?`, ações de join/leave
- [ ] `components/campus/CreateProject.tsx` — modal com inputs: título, empresa, descrição, skills (`SkillInput`), slider de vagas (2–10), botão com loader
- [ ] `app/projects/page.tsx` — tabs "Todos" / "Meus", contador de projetos, botão "+ Novo projeto"
- [ ] Estado vazio (`EmptyState`) com ícone Rocket e CTA
- [ ] Dados mock em `lib/mock-data.ts` com 4–6 projetos de exemplo
- [ ] Context `ProjectsContext` (`"use client"`) com actions: `addProject`, `joinProject`, `leaveProject`, `deleteProject`

**Commit final:** `feat: projects feed ui — card grid, detail modal, create form, context with mock data`

---

## Milestone 5 — Perfil do Estudante (UI)

**Branch:** `feat/profile-ui`  
**Objetivo:** Página `/profile` com exibição e edição de dados do usuário, usando estado local.

### Entregas

- [ ] `app/profile/page.tsx` — rota protegida
- [ ] `components/campus/ProfileHeader.tsx` — avatar grande, nome, curso, bio, botão "Editar perfil"
- [ ] `components/campus/ProfileEdit.tsx` — formulário inline ou modal: nome, curso (select com as 5 opções), bio, `SkillInput`
- [ ] Seção "Meus projetos" listando os projetos em que o usuário é membro (reutiliza `ProjectCard` em modo compacto)
- [ ] Opção de courses: Tecnologia, Design, Negócios, Saúde, Educação
- [ ] Toast de confirmação ao salvar

**Commit final:** `feat: student profile page — view, edit form, my projects section`

---

## Milestone 6 — Integração Supabase (Backend)

**Branch:** `feat/supabase-integration`  
**Objetivo:** Substituir todos os dados mock por Supabase real; autenticação funcional.

### Entregas

- [ ] Criar projeto no Supabase e adicionar `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `lib/supabase/client.ts` — cliente browser (`createBrowserClient`)
- [ ] `lib/supabase/server.ts` — cliente server (`createServerClient` com cookies)
- [ ] Migrations SQL:
  ```sql
  -- users, projects, memberships (ver data models no CLAUDE.md)
  ```
- [ ] RLS policies: `users` (self), `projects` (authenticated read, author write), `memberships` (self)
- [ ] Supabase Auth configurado com validação de domínio `@fiap.com.br` (hook `before_user_created` ou trigger)
- [ ] `middleware.ts` atualizado com sessão real via `@supabase/ssr`
- [ ] `app/(auth)/login/page.tsx` — `signInWithPassword` e `signUp` reais
- [ ] `app/projects/page.tsx` — substituir mock por `select * from projects` via Server Component
- [ ] `components/campus/CreateProject.tsx` — insert real com optimistic update
- [ ] `components/campus/ProjectCard.tsx` — join/leave via upsert/delete em `memberships`
- [ ] `app/profile/page.tsx` — load e update real de `users`
- [ ] Seed SQL com 4 projetos de exemplo para ambiente de dev

**Commit final:** `feat: supabase integration — auth, rls, real data for projects and profiles`

---

## Milestone 7 — Polimento & Responsividade

**Branch:** `feat/polish`  
**Objetivo:** Garantir que a interface seja pixel-perfect em mobile e que as animações estejam corretas.

### Entregas

- [ ] Breakpoints mobile: `max-width: 860px` (bento vira 1 coluna) e `600px` (padding reduzido)
- [ ] `prefers-reduced-motion` — desativar animações de blobs, tilt e marquee se necessário
- [ ] Loading skeletons nos cards enquanto dados carregam (Suspense boundaries)
- [ ] Error boundaries para falhas de fetch
- [ ] Metadados SEO em `app/layout.tsx` (`title`, `description`, `og:image`)
- [ ] Favicon usando o `LogoMark` exportado como SVG
- [ ] Revisão de acessibilidade: `aria-label` em botões de ícone, foco visível, contraste
- [ ] Testar fluxo completo: landing → login → projects → detalhe → entrar → perfil → sair

**Commit final:** `feat: mobile responsiveness, a11y pass, loading states, seo metadata`

---

## Milestone 8 — Deploy

**Branch:** `feat/deploy` → merge em `main`  
**Objetivo:** Aplicação em produção na Vercel com variáveis de ambiente configuradas.

### Entregas

- [ ] Conectar repositório GitHub à Vercel
- [ ] Configurar variáveis de ambiente de produção no painel Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Configurar domínio personalizado (opcional)
- [ ] Rodar `npm run build` localmente sem erros antes do merge
- [ ] Verificar deploy de preview no PR antes de promover para produção
- [ ] Testar fluxo completo em produção com e-mail `@fiap.com.br` real
- [ ] Documentar URL de produção no `README.md`

**Commit final:** `chore: production deploy — vercel config, env vars, readme with live url`

---

## Resumo dos Milestones

| # | Branch | Entrega principal | UI? | Backend? |
|---|--------|------------------|-----|----------|
| 0 | `feat/setup` | Next.js + design system | — | — |
| 1 | `feat/ui-kit` | Componentes base | ✓ | — |
| 2 | `feat/landing` | Landing page pública | ✓ | — |
| 3 | `feat/auth-ui` | Tela de login (UI) | ✓ | — |
| 4 | `feat/projects-ui` | Feed + modal + criação (mock) | ✓ | — |
| 5 | `feat/profile-ui` | Perfil do estudante (mock) | ✓ | — |
| 6 | `feat/supabase-integration` | Auth + DB real | — | ✓ |
| 7 | `feat/polish` | Responsividade + a11y | ✓ | — |
| 8 | `feat/deploy` | Deploy em produção | — | ✓ |

> **Referência visual permanente:** `project/Campus Landing.html`  
> Consultar este arquivo sempre que houver dúvida sobre espaçamentos, cores exatas ou comportamentos de interação.
