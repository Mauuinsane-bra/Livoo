-- ═══════════════════════════════════════════════════════════════
-- Go Livoo — Migrations Supabase
-- Execute no SQL Editor do Supabase (supabase.com → SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Perfis de usuário ─────────────────────────────────────
-- Requerido por /api/user-profile (antes usava arquivo local JSON)

CREATE TABLE IF NOT EXISTS user_profiles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id         text UNIQUE NOT NULL,
  nome_completo    text NOT NULL,
  cpf              text UNIQUE NOT NULL,  -- somente dígitos, sem pontos/traços
  rg               text,
  email            text UNIQUE NOT NULL,
  username         text UNIQUE NOT NULL,
  endereco         text NOT NULL,
  cep              text NOT NULL,
  profile_complete boolean DEFAULT true,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- Índices para lookups rápidos de duplicatas
CREATE INDEX IF NOT EXISTS idx_user_profiles_clerk_id  ON user_profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_cpf        ON user_profiles(cpf);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email      ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username   ON user_profiles(username);

-- Row Level Security (RLS) — usuários só leem/editam o próprio perfil
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- O Service Role (usado pelo backend) bypassa RLS automaticamente
-- Políticas abaixo são para acessos via anon/authenticated key (frontend)
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- ── 2. Waitlist ──────────────────────────────────────────────
-- Requerido por /api/waitlist

CREATE TABLE IF NOT EXISTS waitlist (
  id         bigserial PRIMARY KEY,
  name       text NOT NULL,
  email      text UNIQUE NOT NULL,
  interests  text[],
  created_at timestamptz DEFAULT now()
);

-- ── 3. Roteiros (itineraries) ────────────────────────────────
-- Requerido por /api/roteiro (salva histórico de roteiros gerados)

CREATE TABLE IF NOT EXISTS itineraries (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text,  -- clerk_id (nullable para usuários anônimos)
  prompt      text NOT NULL,
  parsed_data jsonb,
  status      text DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'completed')),
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON itineraries(user_id);

-- ── 4. Verificações de documentação (prep_checks) ────────────
-- Requerido por /api/prep (salva histórico de verificações Sherpa)

CREATE TABLE IF NOT EXISTS prep_checks (
  id               bigserial PRIMARY KEY,
  user_id          text,  -- clerk_id (nullable para anônimos)
  nationality      text NOT NULL,
  destination      text NOT NULL,
  destination_name text,
  result           jsonb,
  paid             boolean DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prep_checks_user_id ON prep_checks(user_id);

-- ── 5. Alertas de preço (price_alerts) ──────────────────────
-- Para Sprint 12 (ainda não implementado no backend)

CREATE TABLE IF NOT EXISTS price_alerts (
  id            bigserial PRIMARY KEY,
  user_id       text NOT NULL,
  origin        text NOT NULL,
  destination   text NOT NULL,
  target_price  numeric(10,2) NOT NULL,
  current_price numeric(10,2),
  active        boolean DEFAULT true,
  last_checked  timestamptz,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
