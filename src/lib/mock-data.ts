export interface Member {
  name: string;
  course: string;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  description: string;
  scope: string;
  reward: string;
  skills: string[];
  slots: number;
  members: Member[];
  authorId: string;
  status: "active" | "full" | "closed";
  createdAt: string;
}

export const MOCK_USER_ID = "user-danilo";
export const MOCK_USER_NAME = "Danilo Wendler";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Plataforma de Mobilidade Inteligente",
    company: "Ford",
    description:
      "Desenvolva um dashboard em tempo real que integra dados de telemetria veicular, padrões de tráfego e IA para otimizar rotas urbanas e reduzir emissões de CO₂.",
    scope:
      "O time será responsável por: (1) ingestão de dados de telemetria via WebSocket, (2) visualizações interativas com D3.js ou Recharts, (3) modelo de recomendação de rotas com Python/FastAPI, (4) integração com a API de mapas HERE. Reuniões semanais com o time de engenharia da Ford.",
    reward:
      "Fast-track para processo seletivo da Ford, mentoria com engenheiros sênior, visita técnica ao Centro de P&D e certificado de conclusão.",
    skills: ["React", "TypeScript", "Python", "WebSocket", "D3.js"],
    slots: 5,
    members: [
      { name: "Mariana Costa", course: "Tecnologia" },
      { name: "Rafael Souza", course: "Design" },
    ],
    authorId: "user-fiap-01",
    status: "active",
    createdAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "proj-2",
    title: "IA para Diagnóstico de Crédito Rural",
    company: "Raízen",
    description:
      "Crie um modelo de machine learning que analisa variáveis climáticas, histórico de safra e dados financeiros para prever inadimplência e sugerir limites de crédito seguros.",
    scope:
      "Pipeline completo de MLOps: coleta de dados abertos (INMET, IBGE), feature engineering, treinamento com XGBoost/LightGBM, API de inferência em FastAPI e painel de monitoramento de drift. O modelo será validado com dados reais de cooperativas parceiras.",
    reward:
      "Mentoria com cientistas de dados da Raízen, prioridade em estágio, participação no Agro Hackathon e premiação em dinheiro ao melhor modelo.",
    skills: ["Python", "Machine Learning", "FastAPI", "SQL", "Pandas"],
    slots: 4,
    members: [
      { name: "Lucas Ferreira", course: "Tecnologia" },
      { name: "Beatriz Lima", course: "Tecnologia" },
      { name: "André Nunes", course: "Negócios" },
    ],
    authorId: "user-fiap-02",
    status: "active",
    createdAt: "2026-04-12T14:00:00Z",
  },
  {
    id: "proj-3",
    title: "Super App de Saúde Preventiva",
    company: "Hapvida",
    description:
      "Mobile app que usa wearables e IA conversacional para engajar usuários em hábitos preventivos, reduzindo sinistros e melhorando indicadores de saúde da carteira.",
    scope:
      "App React Native com integração ao Apple Health e Google Fit, backend Node.js + Supabase, chatbot com GPT-4o para triagem sintomática e gamificação por pontos de saúde. Conformidade com LGPD e HIPAA obrigatória.",
    reward:
      "Estágio direto na área de inovação, mentoria com médicos e tech leads, acesso ao laboratório de saúde digital e certificação em Health Tech.",
    skills: ["React Native", "Node.js", "OpenAI API", "Supabase", "UX"],
    slots: 6,
    members: [
      { name: "Camila Rocha", course: "Saúde" },
      { name: "Diego Alves", course: "Tecnologia" },
    ],
    authorId: MOCK_USER_ID,
    status: "active",
    createdAt: "2026-04-14T09:30:00Z",
  },
  {
    id: "proj-4",
    title: "Marketplace de Cursos Corporativos",
    company: "Ambev Tech",
    description:
      "Plataforma white-label de e-learning com micro-frontends, recomendação personalizada de conteúdo e analytics de engajamento para RH de grandes empresas.",
    scope:
      "Arquitetura micro-frontend com Module Federation, design system próprio com Storybook, sistema de recomendação com embeddings e PostgreSQL pgvector, dashboards de L&D em Next.js e integração com LMS via xAPI/Tin Can.",
    reward:
      "Bootcamp interno de 2 semanas na Ambev Tech, fast-track para contratação CLT, acesso a créditos AWS e participação nos tech talks mensais.",
    skills: ["Next.js", "Micro-frontends", "PostgreSQL", "AWS", "Storybook"],
    slots: 5,
    members: [
      { name: "Fernanda Melo", course: "Tecnologia" },
      { name: "Gustavo Pires", course: "Design" },
      { name: "Isabela Santos", course: "Educação" },
      { name: "Thiago Carvalho", course: "Tecnologia" },
    ],
    authorId: "user-fiap-03",
    status: "active",
    createdAt: "2026-04-16T11:00:00Z",
  },
  {
    id: "proj-5",
    title: "Sistema de Compliance ESG em Tempo Real",
    company: "Itaú BBA",
    description:
      "Plataforma que monitora indicadores ESG de carteiras de investimento, gera relatórios automatizados para reguladores e alerta gestores sobre desvios de metas.",
    scope:
      "Ingestão de dados de 3 bolsas via streaming (Kafka), scoring ESG proprietário, API GraphQL para consultas de portfólio, relatórios PDF automatizados com Puppeteer e painel React com filtros avançados. Segurança SOC2 exigida.",
    reward:
      "Programa de talentos do Itaú BBA com bolsa-auxílio, mentoria com analistas de ESG e convite para o Itaú Summit anual.",
    skills: ["Kafka", "GraphQL", "React", "Node.js", "Docker"],
    slots: 4,
    members: [],
    authorId: "user-fiap-04",
    status: "active",
    createdAt: "2026-04-18T16:00:00Z",
  },
];
