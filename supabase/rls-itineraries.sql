-- supabase/rls-itineraries.sql
-- Row Level Security para a tabela `itineraries`.
--
-- POR QUE: o site grava previews de roteiro usando a chave ANON do Supabase
-- (NEXT_PUBLIC_SUPABASE_ANON_KEY), que é PÚBLICA — aparece no JavaScript do
-- browser. Sem RLS, qualquer pessoa com essa chave pode LER e APAGAR todos os
-- roteiros de todos os usuários direto na API do Supabase.
--
-- COMO APLICAR (Mauricio):
--   1. Abrir https://supabase.com/dashboard → projeto do Go Livoo
--   2. Menu lateral → SQL Editor → New query
--   3. Colar este arquivo inteiro → Run
--
-- EFEITO: a chave pública continua podendo INSERIR previews (o site continua
-- funcionando igual), mas deixa de poder ler, alterar ou apagar qualquer linha.

alter table public.itineraries enable row level security;

-- Permite ao site (chave anon) continuar gravando novos previews
create policy "anon pode inserir roteiros"
  on public.itineraries
  for insert
  to anon
  with check (true);

-- NENHUMA policy de SELECT/UPDATE/DELETE para anon = leitura/escrita bloqueadas
-- para o público. O painel do Supabase (service role) continua vendo tudo.

-- ⚠️ ATENÇÃO — /meus-roteiros:
-- A página /meus-roteiros lê a tabela `itineraries` com a chave anon
-- (getUserItineraries em lib/supabase.ts). Com o RLS acima, essa leitura passa
-- a retornar vazio. Duas opções para reativá-la com segurança:
--
--   Opção A (recomendada): configurar SUPABASE_SERVICE_ROLE_KEY na Vercel
--   (Settings → Environment Variables; a chave está em Supabase → Settings →
--   API → service_role) e migrar getUserItineraries para usá-la SOMENTE no
--   servidor. A service role ignora RLS e nunca vai ao browser.
--
--   Opção B (paliativa, menos segura): permitir SELECT ao anon apenas em linhas
--   com user_id preenchido igual ao filtro — NÃO protege de verdade sem
--   integração Clerk↔Supabase JWT. Evitar.
--
-- Enquanto a Opção A não for feita, /meus-roteiros mostrará lista vazia.
-- Trade-off aceito em 12/mai: proteger os dados de todos os usuários vale mais
-- do que uma página com pouco uso.

-- Mesma proteção para a waitlist, se a tabela existir:
-- alter table public.waitlist enable row level security;
-- create policy "anon pode entrar na waitlist" on public.waitlist
--   for insert to anon with check (true);
