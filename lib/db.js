// ============================================================
// Conexão com o banco Neon (PostgreSQL serverless).
// Usado pelas funções serverless em /api para armazenar as
// Ordens de Serviço publicadas, de forma que o link enviado ao
// cliente possa ser aberto/assinado em QUALQUER dispositivo.
//
// Variável de ambiente necessária: DATABASE_URL
//   (Neon → Dashboard → Connection string → "Pooled connection")
//   Exemplo: postgresql://user:pass@ep-xxx-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
// ============================================================

import { neon } from '@neondatabase/serverless';

let _sql = null;

/** Devolve o client SQL do Neon (singleton por instância). */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    const err = new Error('DATABASE_URL não configurada no ambiente.');
    err.code = 'NO_DATABASE_URL';
    throw err;
  }
  if (!_sql) _sql = neon(url);
  return _sql;
}

let _schemaReady = false;

/**
 * Garante que a tabela `public_os` existe.
 * É barato: roda `create table if not exists` só uma vez por instância.
 */
export async function ensureSchema() {
  if (_schemaReady) return;
  const sql = getSql();
  await sql`
    create table if not exists public_os (
      id          text primary key,
      token       text not null,
      status      text,
      payload     jsonb not null,
      signature   jsonb,
      created_at  timestamptz not null default now(),
      updated_at  timestamptz not null default now()
    )
  `;
  _schemaReady = true;
}
