-- ============================================================
-- Esquema do banco Neon (PostgreSQL) — Faktory Flow Agenda
-- Armazena as Ordens de Serviço publicadas para assinatura,
-- permitindo abrir/assinar o link em qualquer dispositivo.
--
-- A aplicação cria esta tabela automaticamente (ver lib/db.js),
-- mas você pode rodar este script manualmente no SQL Editor do
-- Neon para conferir/preparar o banco.
-- ============================================================

create table if not exists public_os (
  id          text primary key,          -- id da OS (mesmo id usado no app)
  token       text not null,             -- chave de acesso do link público
  status      text,                      -- rascunho | enviada | assinada | cancelada...
  payload     jsonb not null,            -- snapshot completo da OS para renderizar
  signature   jsonb,                     -- dados da assinatura do cliente
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Consulta pública sempre usa id + token juntos (a PK já cobre o id).
create index if not exists idx_public_os_token on public_os (token);
