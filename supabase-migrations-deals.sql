-- ═══════════════════════════════════════════════════════════════
-- Go Livoo — Migration do Radar de Passagens (buscador pessoal)
-- Execute no SQL Editor do Supabase (supabase.com → SQL Editor)
-- Opcional: sem esta tabela, os alertas por alvo funcionam; apenas o
-- alerta de "queda relativa" (baseline 30 dias) fica inativo.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS deal_price_history (
  id         bigserial PRIMARY KEY,
  dest       text NOT NULL,            -- IATA do destino (ex.: MAD)
  price      numeric(10,2) NOT NULL,   -- menor preco ida/volta em cache (BRL)
  scanned_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deal_price_history_dest_time
  ON deal_price_history(dest, scanned_at DESC);

-- Acesso apenas pelo backend (Service Role bypassa RLS). Sem policies para anon.
ALTER TABLE deal_price_history ENABLE ROW LEVEL SECURITY;
