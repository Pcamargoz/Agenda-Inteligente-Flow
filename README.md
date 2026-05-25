# Faktory Flow Agenda

[![Guia Operacional](https://img.shields.io/badge/Guia-Operacional-blue)](docs/GUIDA_OPERACIONAL.md) [![Documentação](https://img.shields.io/badge/Documenta%C3%A7%C3%A3o-tecnica-lightgrey)](DOCS.md) [![Índice](https://img.shields.io/badge/%E2%86%92-Índice-green)](docs/INDEX.md) [![QA Checklists](https://img.shields.io/badge/QA-Checklists-yellow)](docs/ACCEPTANCE_CHECKLISTS.md)

Front-end estático + serverless function (Vercel) para envio de **Ordens de Serviço** por e-mail SMTP real.

## Sumário rápido

- 📘 Guia operacional (leitura inicial): [GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md)
- 🧭 Índice navegável: [docs/INDEX.md](docs/INDEX.md)
- ⚙️ Deploy & Tech: [DOCS.md](DOCS.md)
- 📗 Documentação técnica (unificada): [DOCUMENTACAO_TECNICA_2.md](DOCUMENTACAO_TECNICA_2.md)
- ✅ QA / Checklists: [docs/ACCEPTANCE_CHECKLISTS.md](docs/ACCEPTANCE_CHECKLISTS.md)
 - ✉️ Modelos de e-mail: *não aplicável* (removido)

---
<!-- Índice visual rápido -->
## Guia rápido (leitura inicial)

- **Leitura obrigatória (Operacional):** [GUIDA_OPERACIONAL.md](GUIDA_OPERACIONAL.md) — resumo acionável para coordenadores e consultores.
- **Leitura técnica (Referência):** [DOCS.md](DOCS.md) — índice com links para documentação detalhada e endpoints.
- **QA / Aceitação:** [docs/ACCEPTANCE_CHECKLISTS.md](docs/ACCEPTANCE_CHECKLISTS.md)
- **E-mails & Templates:** *não aplicável*

> Recomendo que a equipe de implantação leia apenas `GUIDA_OPERACIONAL.md` antes de começar; abra os documentos em `docs/` somente quando precisar de detalhes.

---

## O que está incluído

```
.
├── index.html                     # Aplicação front-end (single-file, localStorage)
├── api/
│   └── send-os-email.js           # Serverless function — envia OS via SMTP
├── package.json                   # Dependências (nodemailer)
├── vercel.json                    # Headers + config das functions
├── .env.example                   # Modelo das variáveis SMTP
├── .gitignore
└── README.md
```

---

## Deploy no Vercel — passo a passo

### 1. Subir para um repositório Git

```bash
cd "Agenda-Inteligente-Flow"
git init
git add .
git commit -m "feat: agenda + serverless OS email"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/faktory-flow-agenda.git
git push -u origin main
```

### 2. Criar projeto no Vercel

1. Acesse https://vercel.com/new
2. Importe o repositório que você acabou de criar
3. Em **Framework Preset**, escolha `Other` (o Vercel detecta sozinho)
4. **NÃO** clique em Deploy ainda — primeiro configure as variáveis (passo 3)

### 3. Configurar variáveis SMTP no Vercel

Em **Project Settings → Environment Variables**, adicione:

| Nome | Valor (exemplo Gmail) |
|------|------------------------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `seu-email@gmail.com` |
| `SMTP_PASS` | *senha de app* (16 caracteres, gerada em https://myaccount.google.com/apppasswords) |
| `SMTP_FROM` | `seu-email@gmail.com` |
| `SMTP_FROM_NAME` | `Faktory Flow Agenda` |
| `SMTP_BCC` *(opcional)* | `auditoria@suaempresa.com` |

Marque as três checkboxes (**Production**, **Preview**, **Development**).

### 4. Deploy

Volte para a aba **Deployments** e dispare um novo deploy (ou faça `git push` — o Vercel rebuilda automaticamente).

Em ~30 segundos o domínio fica disponível: `https://faktory-flow-agenda.vercel.app` (ou o nome que você der).

---

## Configuração SMTP por provedor

### Gmail (recomendado para testes)
1. Ative a verificação em duas etapas: https://myaccount.google.com/security
2. Crie uma senha de app: https://myaccount.google.com/apppasswords
3. Use a senha de 16 caracteres no `SMTP_PASS` (sem espaços)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Outlook / Office 365
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
```
Para contas corporativas com MFA, gere uma senha de app em https://account.microsoft.com/security.

### Hostinger
```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
```

### SendGrid (transactional, recomendado para produção em escala)
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxx   # sua API key
```

---

## Como testar

### Localmente (com Vercel CLI)

```bash
npm install
npm install -g vercel    # se ainda não tiver
cp .env.example .env.local
# preencha .env.local com suas credenciais SMTP

vercel dev               # sobe em http://localhost:3000
```

Abra `http://localhost:3000`, crie um template → cronograma → confirme com cliente → entre no card do cliente → crie uma OS → clique em **"Enviar por e-mail"**.

### Em produção (após deploy)

Mesma jornada, mas em `https://seu-projeto.vercel.app`.

---

## Como funciona o fluxo de envio

```
┌─────────────────────┐
│  Modal de OS (HTML) │
│  Botão "Enviar      │
│   por e-mail"       │
└──────────┬──────────┘
           │ fetch POST
           ▼
┌─────────────────────────────────────────┐
│  /api/send-os-email.js                  │
│  - Valida payload (to, subject, html)   │
│  - Lê env vars SMTP_*                   │
│  - nodemailer.createTransport({...})    │
│  - transporter.verify()                 │
│  - transporter.sendMail({...})          │
└──────────┬──────────────────────────────┘
           │ SMTP TLS
           ▼
┌─────────────────────────────────────────┐
│  Seu servidor SMTP (Gmail, Outlook,     │
│  Hostinger, SendGrid...)                │
└──────────┬──────────────────────────────┘
           │
           ▼
       📬 Cliente
```

Se a API estiver indisponível (ex.: durante desenvolvimento local sem env vars), o front-end faz **fallback automático para `mailto:`** — abre o cliente de e-mail padrão do sistema operacional do usuário.

---

## Segurança

- ✅ Credenciais SMTP **nunca** chegam ao browser — vivem só nas env vars do Vercel
- ✅ Validação de e-mail no servidor
- ✅ Rate limit por IP (20 envios/min) — best-effort
- ✅ Timeouts curtos (15s) para não estourar a função serverless
- ✅ `.env.local` no `.gitignore`

**Importante:** não cole credenciais SMTP diretamente no código do HTML. Sempre via env vars.

---

## Troubleshooting

### "Falha ao conectar ao SMTP"
- Verifique se está usando **senha de app**, não a senha da conta (Gmail/Outlook exigem isso desde 2022)
- Confirme se o domínio do `SMTP_FROM` corresponde ao do `SMTP_USER` (alguns provedores rejeitam)
- Teste se a conta SMTP está ativa fazendo login no webmail do provedor

### "Many requests" / 429
- Rate limit ativado. Aguarde 1 minuto. Se persistir, ajuste `RATE_MAX` em `api/send-os-email.js`

### Email vai parar no spam
- Configure SPF/DKIM/DMARC no DNS do seu domínio (não funciona em endereços @gmail.com de pessoa física para outros provedores)
- Para produção séria, use um serviço transacional (SendGrid, Postmark, Resend, Mailgun)

### "Function timeout"
- Aumente `maxDuration` em `vercel.json` (limite: 10s no plano Hobby, 60s no Pro)
- Verifique se o SMTP do provedor não está lento

---

## Próximos passos sugeridos

- [ ] Adicionar anexo PDF da OS gerado dinamicamente no servidor
- [ ] Webhook de assinatura (cliente clica em "aprovar" e atualiza o status)
- [ ] Templates de e-mail por tipo (atendimento / treinamento / tarefa)
- [ ] Persistir os logs de envio em um banco (Vercel KV, Postgres, etc.)
- [ ] OAuth para Gmail/Outlook em vez de senha de app

---

**Faktory Flow Agenda v2.0** — Sistema interno de gestão de agendas, cronogramas e ordens de serviço.
