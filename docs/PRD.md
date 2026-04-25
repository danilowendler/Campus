# PROJECT ARCHITECTURE: Campus FIAP

## 1. CONTEXT & PROBLEM

- Alunos da faculdade FIAP desenvolvem projetos e trabalhos acadêmicos de alta qualidade (muitas vezes chegando a finais de concursos), mas não conseguem monetizar essas ideias ou transformá-las em uma porta de entrada direta para o mercado de trabalho.

- Muitos estudantes saem da faculdade apenas com o diploma, sem um portfólio de projetos reais validados por grandes empresas.

- Existe um gap entre a produção acadêmica e a necessidade das empresas por talentos que já resolveram problemas de negócio reais.


## 2. PROPOSED SOLUTION

- Uma plataforma de rede profissional exclusiva para estudantes da FIAP, chamada Campus FIAP. Nela, empresas parceiras (como a Ford) publicam desafios e projetos reais. Os alunos podem formar times, aplicar suas habilidades técnicas e resolver esses desafios em troca de recompensas de carreira.

## DIFERENCIAIS

- Ecossistema Fechado: Acesso restrito a alunos com e-mail institucional da FIAP.

- Portfólio de Impacto: O aluno sai da faculdade com histórico de projetos resolvidos para empresas reais.

- Gamificação e Recompensas: Premiações que vão além do financeiro, como visitas a times de tecnologia, mentorias ou "fast-track" em processos seletivos.

- Interface Moderna: Design focado em experiência de desenvolvedor, com modo escuro e componentes minimalistas.


## 3. FUNCTIONAL REQUIREMENTS

- Autenticação Institucional: Filtro por e-mail @fiap.com.br
- Dashboard de Projetos: Feed de desafios ativos de empresas
- Formação de Times: Visualização de vagas abertas em projetos
- Modal de Detalhes: Escopo do projeto e recompensas
- Tags de Habilidades: Mapeamento de stacks (React, Python, etc)
- Status "Ao Vivo": Indicador de projetos recrutando agora

## DETALHAMENTO DAS FEATURES

- Login e Autenticação: Restrito a domínios de e-mail da faculdade. Integração com sistema de identidade estudantil.

- Dashboard de Projetos Ativos: Listagem de cards contendo o título do projeto, empresa proponente, breve descrição e progresso de recrutamento de membros.

- Sistema de Times: Permite ao usuário ver quem já está no projeto e quais vagas estão abertas (ex: "2/4 membros"). Botão direto para "Entrar no projeto".

- Gerenciamento de Habilidades: Categorização de projetos por stacks técnicas (React Native, Node.js, Python, Machine Learning, Design UI).

- Fluxo de Recompensa: Seção detalhando o que o time vencedor ganha (visitas técnicas, entrevistas garantidas, etc).


## 4. USER PERSONAS

### Estudante FIAP
O usuário principal. Aluno de graduação ou MBA que busca aplicar seus conhecimentos em problemas reais para acelerar sua carreira e construir um portfólio sólido.

### Empresa Parceira
Organizações que buscam inovação e recrutamento de novos talentos. Publicam desafios reais para identificar os melhores desenvolvedores e mentes criativas da instituição.


## 5. TECHNICAL STACK

- Next.js
- React
- Tailwind CSS
- Supabase
- PostgreSQL
- Claude Code

- Frontend: Next.js (App Router) com TypeScript para a plataforma web.
- Mobile: React Native / Expo para acesso rápido aos desafios via smartphone.
- UI Components: Tailwind CSS e shadcn/ui (estilo Dark Mode conforme referências visuais).
- Backend/Database: Supabase (PostgreSQL) com Row Level Security para garantir privacidade dos dados dos alunos.
- Autenticação: Supabase Auth com validação de domínio de e-mail.


## 6. DESIGN LANGUAGE

- Campus FIAP Visual: Interface em modo escuro (Dark Mode) com paleta de cores baseada em tons de rosa/vinho e cinzas profundos.
- Componentização: Uso de cards com bordas suaves, tags coloridas para skills e estados de hover bem definidos.
- UX de Recrutamento: Modais limpos que mostram o "Time (X/Y)" e espaços vazios representados por ícones de interrogação para vagas abertas.


## 7. PROCESS

- Break app build into logical milestones (steps)
- Each milestone should be a deliverable increment
- Prioritize core functionality first, then iterate
- Test each milestone before moving to the next
