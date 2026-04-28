-- ============================================================
-- Campus FIAP — Seed de desenvolvimento
-- Execução manual: cole no SQL Editor do Supabase
-- NÃO rodar em produção
--
-- PRÉ-REQUISITO: crie ao menos 1 usuário pelo app ou pelo
-- Supabase Auth dashboard antes de rodar este seed.
-- O seed usa o primeiro usuário encontrado em auth.users
-- como autor dos projetos de exemplo.
-- ============================================================

do $$
declare
  seed_author_id uuid;
  p1 uuid := gen_random_uuid();
  p2 uuid := gen_random_uuid();
  p3 uuid := gen_random_uuid();
  p4 uuid := gen_random_uuid();
begin

  -- Pega o UUID do primeiro usuário autenticado existente
  select id into seed_author_id from auth.users order by created_at limit 1;

  if seed_author_id is null then
    raise exception 'Nenhum usuário encontrado em auth.users. Crie um usuário pelo app primeiro.';
  end if;

  -- Projetos de exemplo
  insert into public.projects (id, title, description, scope, reward, company, slots, skills, status, author_id)
  values
    (
      p1,
      'Plataforma de Mobilidade Inteligente',
      'Desenvolva um dashboard em tempo real que integra dados de telemetria veicular, padrões de tráfego e IA para otimizar rotas urbanas e reduzir emissões de CO₂.',
      'O time será responsável por: (1) ingestão de dados de telemetria via WebSocket, (2) visualizações interativas com D3.js ou Recharts, (3) modelo de recomendação de rotas com Python/FastAPI, (4) integração com a API de mapas HERE.',
      'Fast-track para processo seletivo da Ford, mentoria com engenheiros sênior, visita técnica ao Centro de P&D e certificado de conclusão.',
      'Ford',
      5,
      array['React','TypeScript','Python','WebSocket','D3.js'],
      'active',
      seed_author_id
    ),
    (
      p2,
      'IA para Diagnóstico de Crédito Rural',
      'Crie um modelo de machine learning que analisa variáveis climáticas, histórico de safra e dados financeiros para prever inadimplência e sugerir limites de crédito seguros.',
      'Pipeline completo de MLOps: coleta de dados abertos (INMET, IBGE), feature engineering, treinamento com XGBoost/LightGBM, API de inferência em FastAPI e painel de monitoramento de drift.',
      'Mentoria com cientistas de dados da Raízen, prioridade em estágio, participação no Agro Hackathon e premiação em dinheiro ao melhor modelo.',
      'Raízen',
      4,
      array['Python','Machine Learning','FastAPI','SQL','Pandas'],
      'active',
      seed_author_id
    ),
    (
      p3,
      'Super App de Saúde Preventiva',
      'Mobile app que usa wearables e IA conversacional para engajar usuários em hábitos preventivos, reduzindo sinistros e melhorando indicadores de saúde da carteira.',
      'App React Native com integração ao Apple Health e Google Fit, backend Node.js + Supabase, chatbot com GPT-4o para triagem sintomática e gamificação por pontos de saúde.',
      'Estágio direto na área de inovação, mentoria com médicos e tech leads, acesso ao laboratório de saúde digital e certificação em Health Tech.',
      'Hapvida',
      6,
      array['React Native','Node.js','OpenAI API','Supabase','UX'],
      'active',
      seed_author_id
    ),
    (
      p4,
      'Sistema de Compliance ESG em Tempo Real',
      'Plataforma que monitora indicadores ESG de carteiras de investimento, gera relatórios automatizados para reguladores e alerta gestores sobre desvios de metas.',
      'Ingestão de dados de 3 bolsas via streaming (Kafka), scoring ESG proprietário, API GraphQL para consultas de portfólio, relatórios PDF automatizados com Puppeteer e painel React com filtros avançados.',
      'Programa de talentos do Itaú BBA com bolsa-auxílio, mentoria com analistas de ESG e convite para o Itaú Summit anual.',
      'Itaú BBA',
      4,
      array['Kafka','GraphQL','React','Node.js','Docker'],
      'active',
      seed_author_id
    );

  raise notice 'Seed concluído. 4 projetos criados com author_id = %', seed_author_id;

end $$;
