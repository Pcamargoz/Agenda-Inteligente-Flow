// ============================================================
// Serverless Function (exemplo) — Node.js runtime
// Envia OS por email usando SMTP configurado em variáveis de ambiente.
// Este arquivo é um exemplo; para recomendações operacionais e variáveis,
// consulte `docs/EMAIL_ENVIO.md`.
// Endpoint: POST /api/send-os-email
// ============================================================

import nodemailer from 'nodemailer';

// ---------- Rate limiting simples em memória (best-effort, por instância) ----------
const RATE_LIMIT = new Map(); // ip -> { count, resetAt }
const RATE_WINDOW_MS = 60_000; // 1 minuto
const RATE_MAX = 20;           // máximo 20 envios/minuto por IP

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

// ---------- Validações ----------
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(e) {
  return typeof e === 'string' && EMAIL_RX.test(e.trim());
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

// ---------- Handler ----------
export default async function handler(req, res) {
  // CORS: liberado para permitir testes locais/remotos. Ajuste conforme a política
  // de segurança da sua infraestrutura de deploy (veja docs/EMAIL_ENVIO.md).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  // Health check: GET retorna se o SMTP está configurado (sem expor credenciais)
  if (req.method === 'GET') {
    const cfg = {
      smtp_host: !!process.env.SMTP_HOST,
      smtp_user: !!process.env.SMTP_USER,
      smtp_pass: !!process.env.SMTP_PASS,
      smtp_from: !!process.env.SMTP_FROM,
      smtp_from_name: !!process.env.SMTP_FROM_NAME,
    };
    const ready = cfg.smtp_host && cfg.smtp_user && cfg.smtp_pass;
    return res.status(200).json({
      service: 'Faktory Flow Agenda — send-os-email',
      version: '1.1.0',
      ready,
      configured: cfg,
      hint: ready
        ? 'API pronta. Faça POST com { to, subject, html, text } para enviar.'
        : 'SMTP não configurado. Veja docs/EMAIL_ENVIO.md para orientações sobre variáveis e operação.',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (!rateLimitCheck(ip)) {
    return res.status(429).json({ error: 'Muitas requisições. Aguarde 1 minuto.' });
  }

  try {
    // Body parsing (Vercel já parseia JSON quando Content-Type: application/json)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { to, subject, html, text, replyTo, osId, attachments, kind, relatedId } = body;

    // Validações
    if (!to)      return res.status(400).json({ error: 'Campo obrigatório: to' });
    if (!subject) return res.status(400).json({ error: 'Campo obrigatório: subject' });
    if (!isValidEmail(to)) return res.status(400).json({ error: 'E-mail destinatário inválido' });
    if (replyTo && !isValidEmail(replyTo)) return res.status(400).json({ error: 'replyTo inválido' });
    if (!html && !text) return res.status(400).json({ error: 'Forneça html ou text' });
    if (attachments && !Array.isArray(attachments)) {
      return res.status(400).json({ error: 'attachments deve ser um array' });
    }
    // Tamanho máximo do payload (proteção contra anexos enormes)
    const totalSize = JSON.stringify(body).length;
    if (totalSize > 9 * 1024 * 1024) {
      return res.status(413).json({ error: 'Payload muito grande (limite ~9MB)' });
    }

    // Env vars SMTP
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_SECURE,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM,
      SMTP_FROM_NAME,
      SMTP_BCC,
    } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return res.status(500).json({
        error: 'SMTP não configurado no servidor',
        detail: 'Defina SMTP_HOST, SMTP_USER e SMTP_PASS nas variáveis de ambiente da sua plataforma (veja docs/EMAIL_ENVIO.md).',
      });
    }

    const port = parseInt(SMTP_PORT, 10) || 587;
    const secure = String(SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      // timeouts curtos para não travar a função serverless
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    // Verificação rápida da conexão (opcional, ajuda a diagnosticar erros)
    try {
      await transporter.verify();
    } catch (verifyErr) {
      return res.status(502).json({
        error: 'Falha ao conectar ao SMTP',
        detail: verifyErr.message,
        hint: 'Verifique SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS e se o provedor exige senha de app.',
      });
    }

    const fromEmail = SMTP_FROM || SMTP_USER;
    const fromName = SMTP_FROM_NAME || 'Faktory Flow Agenda';

    // Mapeia anexos para o formato do nodemailer
    let mailAttachments;
    if (attachments && attachments.length) {
      mailAttachments = attachments.map(att => ({
        filename: att.filename || 'arquivo.bin',
        content: att.content,
        encoding: att.encoding || 'base64',
        contentType: att.contentType || undefined,
      }));
    }

    const mailOptions = {
      from: `"${fromName.replace(/"/g, '')}" <${fromEmail}>`,
      to,
      subject,
      text: text || stripHtml(html),
      html: html || `<pre style="font-family:sans-serif;white-space:pre-wrap">${(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`,
      replyTo: replyTo || undefined,
      bcc: SMTP_BCC || undefined,
      attachments: mailAttachments,
      headers: {
        'X-Faktory-Flow-OS': osId || 'unknown',
        'X-Faktory-Flow-Kind': kind || 'generic',
        'X-Faktory-Flow-RelatedId': relatedId || '',
        'X-Mailer': 'Faktory Flow Agenda v2',
      },
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
  } catch (err) {
    console.error('[send-os-email] erro:', err);
    return res.status(500).json({
      error: 'Falha ao enviar email',
      detail: err.message || String(err),
    });
  }
}
