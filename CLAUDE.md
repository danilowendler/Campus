# Campus FIAP — Engineering Briefing

Closed professional network for FIAP students. Partner companies post real challenges; students form teams and earn career rewards (mentorships, fast-track hiring, tech visits). Access restricted to `@fiap.com.br` email domain.

Full PRD: [docs/PRD.md](docs/PRD.md)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web frontend | Next.js 14+ (App Router) + TypeScript |
| Mobile | React Native / Expo |
| UI components | Tailwind CSS + shadcn/ui |
| Backend / DB | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth — enforce `@fiap.com.br` domain |

---

## Folder Structure

```
campus-fiap/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login / register routes
│   ├── dashboard/          # Authenticated shell & layout
│   ├── projects/           # Projects feed & detail
│   └── profile/            # Student profile
├── components/
│   ├── ui/                 # shadcn/ui primitives (Button, Input, Dialog…)
│   └── campus/             # Domain components (ProjectCard, TeamSlots, SkillTag, Nav…)
├── lib/
│   ├── supabase/           # client.ts + server.ts helpers
│   └── utils.ts
├── docs/
│   └── PRD.md
└── CLAUDE.md
```

---

## Design System (Dark Mode)

Design source: `project/Campus Landing.html`

### CSS Tokens (`app/globals.css`)

```css
:root {
  --bg:             #0a0a0c;
  --bg-elevated:    #101014;
  --surface:        rgba(255,255,255,0.04);
  --surface-2:      rgba(255,255,255,0.06);
  --border:         rgba(255,255,255,0.08);
  --border-strong:  rgba(255,255,255,0.14);
  --text:           #fafafa;
  --text-muted:     #a1a1aa;
  --text-faint:     #52525b;
  --accent:         #ED155A;   /* FIAP neon pink-red — primary CTA */
  --accent-2:       #FF2E63;   /* FIAP hot pink — gradient start */
  --accent-3:       #B00E44;   /* FIAP deep red — gradient end */
  --accent-soft:    rgba(237,21,90,.14);
  --radius:         12px;
  --radius-lg:      20px;
  --radius-xl:      28px;
  --font:           'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  --font-serif:     'Instrument Serif', ui-serif, Georgia, serif;
}
```

### Tailwind Config Extensions

Map the tokens above into `tailwind.config.ts` so they're usable as utilities (`bg-surface`, `text-muted`, `border-strong`, etc.).

### Key Visual Patterns

- **Background**: `#0a0a0c` base + 4 animated blobs (`filter: blur(110px)`, `mix-blend-mode: screen`) in `#ED155A` / `#FF2E63` / `#B00E44` + 6% opacity grain texture overlay.
- **Glass cards**: `backdrop-filter: blur(20px) saturate(140%)`, `border: 1px solid var(--border)`, inner gradient shimmer via `::before`.
- **Primary button**: `background: linear-gradient(135deg, #FF2E63, #ED155A, #B00E44)`, `box-shadow: 0 8px 28px -8px rgba(237,21,90,.65)`. Hover: `translateY(-2px)` + stronger glow.
- **Tilt cards**: `transform-style: preserve-3d`, radial glow follows cursor via CSS `--mx`/`--my` vars.
- **Typography**: `clamp()` for fluid headings; italic `Instrument Serif` for hero emphasis words.
- **Animations**: `fadeUp` (0.7s `cubic-bezier(.22,1,.36,1)`), `gradientShift`, `marquee`.
- **Skill tags**: small pill with `--accent-soft` background + `--accent` text, `border: 1px solid rgba(237,21,90,.3)`.

---

## Coding Conventions

- TypeScript strict mode throughout.
- Tailwind utilities for all styling; avoid inline styles except for dynamic CSS vars.
- shadcn/ui for primitives — extend with campus-specific variants in `components/campus/`.
- **Server Components by default**; add `"use client"` only when needed (tilt, hover state, toast, form).
- Supabase RLS is the security boundary — never expose the service-role key to the client.
- `@fiap.com.br` domain check must happen server-side (Supabase Auth hook or middleware), not only on the client.
- **⚠️ Sidebar de filtros de skills (Milestone 10):** antes de escrever qualquer
  código de layout para a `ProjectsSidebar`, o agente DEVE pausar e solicitar
  permissão e alinhamento explícito ao usuário no prompt — propondo estrutura,
  breakpoints, comportamento sticky/drawer e agrupamento de filtros. Codificar
  o layout sem essa aprovação prévia é uma violação direta do briefing.
- **Para novas implementações de UI** (a partir do Milestone 11, ex.: Dropzone
  de currículo), utilizar preferencialmente `@base-ui/react` no lugar do
  `shadcn/ui`, mantendo a estética Glassmorphism, Dark Mode e o tom Magenta
  (`--accent: #ED155A`). Componentes shadcn já existentes permanecem como
  estão; a regra vale para componentes novos.

---

## Data Models

```sql
users        (id, name, email, course, skills text[], bio, avatar_url,
              resume_path text, resume_name text)                            -- v2: resume cols
projects     (id, title, description, company, slots int, reward text,
              skills text[], status, author_id,
              category check (category in ('partner','academic','open')))   -- v2
memberships  (user_id, project_id, joined_at)
```

RLS: users can only read/write their own `users` row; `memberships` rows are user-scoped; `projects` are readable by all authenticated users.

- Storage bucket `resumes/`: upload/delete restritos ao dono (`auth.uid`); leitura liberada para qualquer usuário autenticado (`role = 'authenticated'`), de modo que empresas parceiras possam baixar o PDF a partir do perfil público.
- `users.resume_path` e `users.resume_name` são graváveis apenas pelo próprio usuário (RLS já existente em `users`).
- `projects.category` é gravável apenas pelo `author_id`.

---

## Feature Implementation Order

1. **Auth** — Supabase Auth + `@fiap.com.br` guard + session middleware
2. **Projects feed** — card grid, live recruiting badge, skill tags
3. **Team formation** — slot visualization (`X/Y`), join/leave actions
4. **Project detail modal** — scope, rewards, team roster
5. **Student profile** — skills, bio, project history
6. **Company dashboard** — post challenges *(v2, out of scope for v1)*

### Phase 2 (post-MVP)

7. **Project categories** — partner / academic / open hierarchical feed
8. **Skills match sidebar** — filters, match score, URL state
   *(layout requires user approval before coding — see Coding Conventions)*
9. **Resume upload** — PDF upload to Storage, public download from profile
   *(parsing/auto-fill por IA fica para a V2)*
