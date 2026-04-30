# Campus FIAP — Plano de Execução
# Project at - https://github.com/danilowendler/Campus

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

- [x] `components/campus/LogoMark.tsx` — ícone quadrado com gradiente e glow rosa
- [x] `components/campus/Nav.tsx` — barra sticky com glassmorphism (blur 18px), logo, links e slot de ações
- [x] `components/campus/Avatar.tsx` — círculo com iniciais e gradiente radial; variantes `sm` / `md` / `lg`
- [x] `components/campus/SkillTag.tsx` — pill rosa com borda `rgba(237,21,90,.3)` e variante `violet`
- [x] `components/campus/Badge.tsx` — `badge-live` (pulsante verde) e `badge-magenta`
- [x] `components/campus/GlassCard.tsx` — wrapper com `backdrop-filter`, borda e shimmer `::before`
- [x] `components/campus/TiltCard.tsx` — wrapper `"use client"` com efeito 3D e glow seguindo cursor
- [x] `components/campus/CampusButton.tsx` — variantes `primary`, `secondary`, `ghost`, `accent`, `danger`; tamanhos `sm`/`default`/`lg`
- [x] `components/campus/SkillInput.tsx` — input multi-tag controlado (`"use client"`)
- [x] `components/campus/Tabs.tsx` — tabs com fundo glass e tab ativa com gradiente rosa
- [x] `components/campus/TeamSlots.tsx` — visualização `X/Y` com avatares empilhados e vagas com `?`
- [x] `components/campus/Toast.tsx` + `ToastProvider` — notificações flutuantes (`"use client"`)
- [x] Página `/ui-kit` temporária listando todos os componentes (para revisão visual antes de prosseguir)

**Commit final:** `feat: add campus ui-kit components (nav, cards, buttons, tags, tilt, toast)`

---

## Milestone 2 — Landing Page

**Branch:** `feat/landing`  
**Objetivo:** Página pública `/` fiel ao protótipo, estática (sem dados reais), totalmente navegável.

### Seções a implementar (em ordem)

- [x] **Hero** — heading com `clamp()`, palavra em itálico `Instrument Serif` com gradiente, subtítulo, dois CTAs, hero-stats (`+1.200 alunos`, `47 projetos`, `12 empresas`)
- [x] **Marquee de skills** — faixa infinita com tags de tecnologias (mask fade nas bordas)
- [x] **"Como Funciona"** — bento grid 3×2 com 6 cards: Encontre, Monte, Construa, Ship, Portfólio, Recompensas; cada card tem número itálico, ícone, título, subtexto e decoração de fundo
- [x] **"Projetos rodando agora"** — bento assimétrico: 1 card grande (`bp-1`) + 2 cards menores (`bp-2`, `bp-3`) com `TiltCard`, badge "Ao vivo", skills e member-stack
- [x] **CTA section** — caixa com gradiente de fundo, heading com `<em>`, parágrafo e botão primário
- [x] **Footer** — `LogoMark` + texto de copyright + link "FIAP"

**Commit final:** `feat: landing page — hero, marquee, bento how-it-works, featured projects, cta`

---

## Milestone 3 — Autenticação (UI)

**Branch:** `feat/auth-ui`  
**Objetivo:** Tela de login/cadastro com visual do protótipo, usando estado local (sem backend ainda).

### Entregas

- [x] `app/(auth)/login/page.tsx` — rota pública
- [x] `components/campus/AuthScreen.tsx` — card glass centralizado com logo, tabs "Entrar"/"Cadastrar", campos de e-mail e senha, botão primário com loader
- [x] Validação client-side: e-mail deve terminar em `@fiap.com.br` (mensagem de erro inline)
- [x] Animação `fadeUp` na entrada do card
- [x] Redirecionamento simulado para `/projects` após submit (usando `useRouter`)
- [x] Proxy `proxy.ts` esqueleto: rota `/projects` e `/profile` protegidas (retorna para `/login` se sem sessão)

**Commit final:** `feat: auth screen ui with fiap domain validation and route protection skeleton`

---

## Milestone 4 — Feed de Projetos (UI)

**Branch:** `feat/projects-ui`  
**Objetivo:** Página `/projects` com grid de cards, modal de detalhe, e formulário de criação — tudo com dados mock.

### Entregas

- [x] `app/(app)/projects/page.tsx` — rota protegida dentro do grupo `(app)` com layout autenticado
- [x] `components/campus/ProjectCard.tsx` — card com título, empresa, descrição truncada (`-webkit-line-clamp: 2`), skills, `TeamSlots`, botões "Entrar" / "Sair" / "Excluir"
- [x] `components/campus/ProjectDetail.tsx` — modal overlay glass com detalhes completos: escopo, recompensas, roster de membros, vagas com `?`, ações de join/leave
- [x] `components/campus/CreateProject.tsx` — modal com inputs: título, empresa, descrição, skills (`SkillInput`), slider de vagas (2–10), botão com loader
- [x] Tabs "Todos" / "Meus projetos" com contador de projetos e botão "+ Novo projeto"
- [x] Estado vazio (`EmptyState`) com ícone Rocket e CTA contextual
- [x] Dados mock em `lib/mock-data.ts` com 5 projetos reais (Ford, Raízen, Hapvida, Ambev Tech, Itaú BBA)
- [x] Context `ProjectsProvider` (`"use client"`) com actions: `addProject`, `joinProject`, `leaveProject`, `deleteProject`
- [x] Split de layouts por route group: `(public)/layout.tsx` (Nav pública) e `(app)/layout.tsx` (AppNav autenticado)
- [x] `components/campus/AppNav.tsx` — navbar autenticada com logo, links centrais, botão de configurações e sign-out

### Página de Configurações (`/settings`)

- [x] `app/(app)/settings/page.tsx` — página de configurações com 4 seções:
  - **Aparência** — seletor dark / claro / sistema com persistência em `localStorage`
  - **Segurança** — formulário de troca de senha com validação inline e toast de confirmação
  - **Notificações** — 4 toggles de preferências de e-mail
  - **Sessão** — botão "Sair de todos os dispositivos" com variante danger
- [x] `components/campus/ThemeProvider.tsx` — context de tema com `style.setProperty()` para aplicação imediata dos tokens CSS
- [x] Suporte a light mode: tokens completos (`--bg`, `--text`, `--border`, `--nav-bg`, `--surface`, etc.) aplicados diretamente no `<html>` via JS
- [x] `AppNav` totalmente theme-aware: usa `var(--nav-bg)`, `var(--surface)`, `var(--surface-2)` em vez de valores rgba hardcoded

**Commits:**
- `feat: projects feed ui — card grid, detail modal, create form, context with mock data`
- `feat: split nav — public layout with landing nav, app layout with authenticated nav (settings + sign-out)`
- `feat: settings page — theme toggle, password form, notification preferences, theme-aware navbar`

---

## Milestone 5 — Perfil do Estudante (UI)

**Branch:** `feat/profile-ui`  
**Objetivo:** Página `/profile` com exibição e edição de dados do usuário, usando estado local.

### Entregas

- [x] `lib/profile-context.tsx` — `ProfileProvider` com estado mock (Danilo Wendler): nome, e-mail, curso, bio, skills; wired no `(app)/layout.tsx` para que o `AppNav` reflita edições em tempo real
- [x] `app/(app)/profile/page.tsx` — rota protegida com `ProfileHeader`, row de 3 stats (membro / autor / skills), seção "Meus Projetos" com grid de `ProjectCard`; ambos os modais (`ProfileEdit` e `ProjectDetail`) elevados ao root da página para evitar quebra de `position: fixed` por stacking context
- [x] `components/campus/ProfileHeader.tsx` — cover strip com gradiente e orbs decorativos, `Avatar` variante `lg` sobreposto na borda, nome, badge de curso, e-mail, bio, pills de skills; recebe `onEdit` como prop (sem modais internos)
- [x] `components/campus/ProfileEdit.tsx` — modal glass com `backdropFilter`; campos: nome (validação inline), select de curso (5 opções), textarea de bio, `SkillInput`; loader de 650 ms + Toast de sucesso; comportamento mobile-first: sheet que sobe da base (`items-end`) com `maxHeight: 90dvh`
- [x] Seção "Meus projetos" filtra por `profile.name` (live context) em vez de `MOCK_USER_NAME` hardcoded — renomear o perfil reflete imediatamente
- [x] `StatsRow` com contadores reativos: projetos como membro, projetos criados, skills cadastradas
- [x] `EmptyState` com ícone de foguete e CTA contextual
- [x] `ProjectDetail` corrigido: overlay com `pt-20` para o card não ficar colado no navbar de 64px
- [x] Toast de confirmação ao salvar

**Commit final:** `feat: student profile page — view, edit form, my projects section` — PR #6 mergeado em `main`

---

## Milestone 6 — Integração Supabase (Backend)

**Branch:** `feat/supabase-integration` → **PR #8 mergeado em `main`**  
**Objetivo:** Substituir todos os dados mock por Supabase real; autenticação funcional.

### Entregas

- [x] Criar projeto no Supabase e adicionar `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `lib/supabase/client.ts` — cliente browser (`createBrowserClient`)
- [x] `lib/supabase/server.ts` — cliente server (`createServerClient` com cookies)
- [x] Migrations SQL: `users`, `projects`, `memberships` com triggers, indexes em todas as FKs, view `projects_with_members` (evita N+1), função `sync_project_status`
- [x] RLS policies: `users` (self), `projects` (authenticated read, author write), `memberships` (self)
- [x] Validação de domínio `@fiap.com.br` no trigger `handle_new_user` + `CHECK CONSTRAINT` na tabela — server-side enforcement
- [x] `proxy.ts` atualizado com sessão real via `@supabase/ssr` (`getUser()`, não `getSession()`)
- [x] `AuthScreen` — `signInWithPassword` e `signUp` reais; trata fluxo de confirmação de e-mail
- [x] `app/projects/page.tsx` — Server Component com `select * from projects_with_members`
- [x] `CreateProject.tsx` — Server Action com `revalidatePath`
- [x] `ProjectCard.tsx` — join/leave via Server Actions com **optimistic update** (reverte se falhar)
- [x] `app/profile/page.tsx` — Server Component; `ProfileEdit` persiste via Server Action
- [x] Seed SQL com 4 projetos de exemplo (usa primeiro `auth.users` existente)

### Auditoria de segurança (migration 000004)

- [x] Policy `users_insert_blocked` — bloqueia INSERT direto por clientes autenticados
- [x] `sync_project_status` verifica que chamador é membro/autor antes de executar
- [x] `set_updated_at` com `security definer` + `set search_path = ''`
- [x] Corrigido stale closure em `updateProfile` no `profile-context`

**Commits:**
- `feat: supabase integration — auth, rls, real data for projects and profiles`
- `fix: seed usa primeiro auth.users existente em vez de UUID placeholder`
- `fix: auth flow — router.refresh() before push, handle email confirmation on signUp`
- `security: auditoria e correções de segurança + optimistic updates`

---

## Milestone 7 — Polimento & Responsividade

**Branch:** `feat/polish` → **PR #9 mergeado em `main`**  
**Objetivo:** Garantir que a interface seja pixel-perfect em mobile e que as animações estejam corretas.

### Entregas

- [x] Breakpoints mobile: `max-width: 860px` (bento vira 1 coluna) e `600px` (hero CTAs empilhados)
- [x] `prefers-reduced-motion` — blobs (`.mesh-blob`), marquee (`.marquee-track`) e `TiltCard` (JS + CSS) desativados
- [x] Loading skeletons nos cards enquanto dados carregam — `Skeletons.tsx` + `loading.tsx` em `/projects` e `/profile`
- [x] Error boundaries para falhas de fetch — `error.tsx` com UI amigável e botão retry em `/projects` e `/profile`
- [x] Metadados SEO em `app/layout.tsx` — `metadataBase`, `title` template, Open Graph completo, Twitter card, `robots`; metadados específicos por rota em `/projects` e `/profile`
- [x] Favicon usando `LogoMark` exportado como `app/icon.svg`
- [x] Acessibilidade: `useFocusTrap` hook; `role="dialog"` + `aria-modal` + `aria-labelledby` nos 3 modais; `GlassCard` com `forwardRef`; `:focus-visible` global com `--accent`
- [x] Navbar: menus mobile com drawer animado (hamburguer + overlay + Escape) no `Nav` e `AppNav`
- [x] Login movido para grupo `(auth)` raiz com navbar minimalista (só logo, sem distrações)
- [x] Navbar: logo 34px, `Campus` weight 700, badge `FIAP` accent; duplicação de "Como funciona" removida; CTA "Entrar" tamanho normal com ícone após texto
- [x] Links centrais do navbar com scroll suave — `ScrollLink` para `#projetos` e `#como-funciona`; `FeaturedProjectsSection` recebeu `id="projetos"` + `scrollMarginTop`
- [x] Hero: botão "Ver projetos" removido; "Entrar na plataforma" centralizado e solo

**Commits:**
- `feat: polish -- responsividade, a11y, skeletons, SEO e refinamentos de UI`

---

## Milestone 8 — Deploy

**Branch:** `feat/deploy` → merge em `main`  
**Objetivo:** Aplicação em produção na Vercel com variáveis de ambiente configuradas.

### Entregas

- [x] Conectar repositório GitHub à Vercel
- [x] Configurar variáveis de ambiente de produção no painel Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Configurar domínio personalizado (opcional)
- [x] Rodar `npm run build` localmente sem erros antes do merge
- [x] Verificar deploy de preview no PR antes de promover para produção
- [x] Testar fluxo completo em produção com e-mail `@fiap.com.br` real
- [x] Documentar URL de produção no `README.md`

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
