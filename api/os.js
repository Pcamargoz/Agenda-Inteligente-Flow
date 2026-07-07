// ============================================================
// Serverless Function — Sincronização de Ordens de Serviço
// Endpoint: /api/os   (Node.js runtime, Neon PostgreSQL)
//
// Permite que o link público de assinatura funcione em qualquer
// dispositivo, guardando a OS no banco (Neon) em vez de só no
// localStorage do navegador que a criou.
//
//   GET  /api/os?id=<osId>&token=<token>   → lê a OS (página pública do cliente)
//   POST /api/os { action:'save', id, token, os }        → publica/atualiza a OS (admin)
//   POST /api/os { action:'sign', id, token, signature } → registra a assinatura (cliente)
//
// Segurança: o `token` (24 chars aleatórios gerado no front) funciona
// como uma chave de acesso. Toda leitura/escrita exige id + token corretos.
// ============================================================

import { getSql, ensureSchema } from '../lib/db.js';

// ---------- Rate limiting simples em memória (best-effort, por instância) ----------
const RATE_LIMIT = new Map(); // ip -> { count, resetAt }
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;

function rateLimitCheck(ip) {
  const now = Date.now();
  const cur = RATE_LIMIT.get(ip);
  if (!cur || cur.resetAt < now) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (cur.count >= RATE_MAX) return false;
  cur.count++;
  return true;
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // Health check
  if (req.method === 'GET' && !req.query?.id) {
    return res.status(200).json({
      service: 'Faktory Flow Agenda — os sync',
      version: '1.0.0',
      ready: !!process.env.DATABASE_URL,
      hint: process.env.DATABASE_URL
        ? 'API pronta. Use GET ?id&token para ler ou POST {action} para gravar.'
        : 'DATABASE_URL não configurada. Veja docs/BANCO_DE_DADOS_NEON.md.',
      timestamp: new Date().toISOString(),
    });
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .split(',')[0].trim();
  if (!rateLimitCheck(ip)) {
    return res.status(429).json({ error: 'Muitas requisições. Aguarde 1 minuto.' });
  }

  try {
    await ensureSchema();
    const sql = getSql();

    // ---------------- LEITURA (página pública do cliente) ----------------
    if (req.method === 'GET') {
      const id = String(req.query.id || '');
      const token = String(req.query.token || '');
      if (!isNonEmptyString(id) || !isNonEmptyString(token)) {
        return res.status(400).json({ error: 'Parâmetros obrigatórios: id, token' });
      }
      const rows = await sql`
        select payload, status, signature
        from public_os
        where id = ${id} and token = ${token}
        limit 1
      `;
      if (!rows.length) {
        return res.status(404).json({ ok: false, error: 'OS não encontrada' });
      }
      const row = rows[0];
      // payload já carrega os dados da OS; garante status atualizado no objeto devolvido
      const os = { ...(row.payload || {}), status: row.status || row.payload?.status };
      return res.status(200).json({ ok: true, os });
    }

    // ---------------- ESCRITA ----------------
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { action, id, token } = body;

      if (!isNonEmptyString(id) || !isNonEmptyString(token)) {
        return res.status(400).json({ error: 'Campos obrigatórios: id, token' });
      }

      // --- Publicar / atualizar a OS (admin) ---
      if (action === 'save') {
        const os = body.os;
        if (!os || typeof os !== 'object') {
          return res.status(400).json({ error: 'Campo obrigatório: os (objeto)' });
        }
        const payloadStr = JSON.stringify(os);
        if (payloadStr.length > 4 * 1024 * 1024) {
          return res.status(413).json({ error: 'OS muito grande (limite ~4MB).' });
        }
        const status = typeof os.status === 'string' ? os.status : null;
        // Upsert: só sobrescreve se o token conferir (impede colisão de terceiros).
        const rows = await sql`
          insert into public_os (id, token, status, payload)
          values (${id}, ${token}, ${status}, ${payloadStr}::jsonb)
          on conflict (id) do update
            set token = excluded.token,
                status = excluded.status,
                payload = excluded.payload,
                updated_at = now()
          where public_os.token = ${token}
          returning id
        `;
        if (!rows.length) {
          return res.status(409).json({ error: 'Já existe uma OS com este id e outro token.' });
        }
        return res.status(200).json({ ok: true, id });
      }

      // --- Registrar assinatura (cliente) ---
      if (action === 'sign') {
        const sig = body.signature;
        if (!sig || typeof sig !== 'object') {
          return res.status(400).json({ error: 'Campo obrigatório: signature (objeto)' });
        }
        const sigStr = JSON.stringify(sig);
        if (sigStr.length > 4 * 1024 * 1024) {
          return res.status(413).json({ error: 'Assinatura muito grande (limite ~4MB).' });
        }
        // Mescla os campos de assinatura dentro do payload e marca como assinada.
        const patch = JSON.stringify({ ...sig, status: 'assinada' });
        const rows = await sql`
          update public_os
          set signature = ${sigStr}::jsonb,
              status = 'assinada',
              payload = coalesce(payload, '{}'::jsonb) || ${patch}::jsonb,
              updated_at = now()
          where id = ${id} and token = ${token}
            and coalesce(status, '') <> 'assinada'
          returning id
        `;
        if (!rows.length) {
          // Ou não existe / token errado, ou já estava assinada.
          const check = await sql`
            select status from public_os where id = ${id} and token = ${token} limit 1
          `;
          if (!check.length) {
            return res.status(404).json({ ok: false, error: 'OS não encontrada' });
          }
          return res.status(200).json({ ok: true, id, alreadySigned: true });
        }
        return res.status(200).json({ ok: true, id });
      }

      return res.status(400).json({ error: 'action inválida. Use "save" ou "sign".' });
    }

    return res.status(405).json({ error: 'Método não permitido.' });
  } catch (err) {
    if (err && err.code === 'NO_DATABASE_URL') {
      return res.status(500).json({
        error: 'Banco não configurado',
        detail: 'Defina DATABASE_URL nas variáveis de ambiente (veja docs/BANCO_DE_DADOS_NEON.md).',
      });
    }
    console.error('[api/os] erro:', err);
    return res.status(500).json({ error: 'Falha no banco de dados', detail: err.message || String(err) });
  }
}
