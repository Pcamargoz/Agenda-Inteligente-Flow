# Faktory Flow Agenda — DOCS

## 1. Visão Geral

Central de agendas de consultoria: cadastros, eventos, cronogramas, registros (atendimento/treino/tarefas), OSs com assinatura digital pública e controle de saldo de horas por cliente. Uso interno da Faktory.

## 2. Fluxo Principal

1. Usuário abre `index.html` (SPA) → `switchView('agenda')` reidrata estado do `localStorage`.
2. Cria consultores/empresas/cards de cliente em **Cadastros**.
3. Cria eventos na agenda (`saveEvent` em [index.html:7014](index.html#L7014)) → push em `EVENTS` + persist.
4. (Opcional) `teamsSync('create', ev)` POSTa no Microsoft Graph se o usuário estiver conectado.
5. Conclui registros (atendimento/treino) → vira candidato a OS (`Em OS`).
6. Gera OS via modal → envia por SMTP, mailto ou WhatsApp; `os.status='enviada'`.
7. **No envio**, `osDebitHours(os)` debita saldo de horas do card do cliente (idempotente).
8. Cliente acessa link público `publicOSLink(osId)`, revisa, desenha assinatura → `osMarkSigned` → `status='assinada'`.
9. Em cancelamento, `osRefundHours` estorna o saldo se `hoursDebited === true`.
10. Todo estado é serializado em `localStorage` a cada ação relevante (`persist()`).

## 3. Integrações Externas

**SMTP via Nodemailer (serverless POST)**
Envio de OS por e-mail real e (a partir desta API) também notificações de cronograma/cancelamento.
Credenciais: `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_FROM_NAME`, opcional `SMTP_BCC`.
Se cair: envio por e-mail faz fallback automático para `mailto:` (abre cliente local). WhatsApp e link público continuam.

**Microsoft Graph via MSAL.js (SPA browser, sem backend)**
Replica eventos da agenda no calendário Outlook/Teams do usuário logado.
Credenciais: `TEAMS_CFG.clientId` e `TEAMS_CFG.tenantId` hardcoded em [index.html](index.html) (registro Entra ID do usuário). Sem env var — público por natureza no SPA.
Se cair: agenda local continua intacta; toast amarelo `"Teams não sincronizou"`. Nenhum dado se perde.

**html2pdf.js (CDN)**
Exportação de OSs/cronogramas em PDF dentro do navegador.
Credenciais: nenhuma.
Se cair: botões de exportar PDF param de funcionar; resto do sistema intacto.

**wa.me (deep link, sem API)**
Envio de OS via WhatsApp Web.
Credenciais: nenhuma.
Se cair (improvável): usuário precisa colar o conteúdo manualmente.

## 4. Automações e Jobs

**`setInterval(updateSyncTime, 30000)`** ([index.html:22617](index.html)) — atualiza o "Salvo X" no rodapé da sidebar. Cosmético; falha invisível.

**Rate limit in-memory na função SMTP** ([api/send-os-email.js:14](api/send-os-email.js)) — 20 envios/min por IP, reset por janela. Por instância serverless (não distribuído). Falha = 429 ao chamador.

Não identificadas outras automações/cron — sem backend persistente, sem filas, sem workers.

## 5. Variáveis de Ambiente

| Nome | Obrigatória | Descrição |
|---|---|---|
| `SMTP_HOST` | sim | Host do servidor SMTP |
| `SMTP_PORT` | não (default 587) | Porta SMTP |
| `SMTP_SECURE` | não (default auto por porta) | `true` para 465, `false` para 587/STARTTLS |
| `SMTP_USER` | sim | Usuário SMTP |
| `SMTP_PASS` | sim | Senha (use senha-de-app no Gmail/Outlook) |
| `SMTP_FROM` | não | Remetente; default = `SMTP_USER` |
| `SMTP_FROM_NAME` | não | Nome exibido; default `"Faktory Flow Agenda"` |
| `SMTP_BCC` | não | BCC fixo para auditoria de todos os envios |

Microsoft Graph **não** usa env var — `clientId`/`tenantId` ficam em `TEAMS_CFG` no [index.html](index.html). Ao trocar de tenant, editar diretamente o objeto.

## 6. Como Rodar Localmente

Pré-requisitos: Node ≥ 18 e Vercel CLI (`npm i -g vercel`) — necessário porque a função serverless **não roda com servidor estático**.

```bash
cp .env.example .env.local   # editar SMTP_*
npm install
npm run dev                  # vercel dev → http://localhost:3000
```

Para deploy: `npm run deploy` (`vercel --prod`). Domínio atual: `https://agenda-inteligente-flow.vercel.app`.

Healthcheck da API SMTP: `GET /api/send-os-email` retorna `{ ready: true/false, configured: { ... } }`.

Se for testar a integração com Teams local, adicionar `http://localhost:3000` como redirect URI **SPA** no app registrado no Entra ID.

## 7. Decisões de Arquitetura

**Persistência em `localStorage`, sem backend de dados** → simplicidade radical, deploy zero-custo no Vercel free tier, funciona offline. Risco se mudar: precisa migrar todo o estado serializado para um banco (consultores, empresas, eventos, OSs, cards, logs) e reescrever todas as chamadas que hoje mutam arrays globais (`EVENTS`, `RECORDS`, etc.).

**Single-file `index.html` (~22k linhas, sem build/bundler)** → edição direta, sem toolchain, sem dependency tree. Risco se mudar: introduzir Vite/React quebra o fluxo de hot-edit e exige refatorar todo o estado global imperativo em componentes/state management.

**MSAL Public Client (PKCE) no browser, sem backend de auth** → integração com Teams/Outlook sem rodar servidor OAuth. Risco se mudar (ex.: introduzir backend de tokens): refresh tokens de longa duração precisam de armazenamento seguro server-side e nova rota; o `clientId`/`tenantId` atuais foram registrados como **SPA** no Entra — registro `Web` exige client secret.

## Documentação do Fluxo de Agendamento e Implantação

Abaixo estão os documentos detalhados que descrevem o fluxo operacional, visual e as recomendações para a equipe:

- [FLUXO_AGENDAMENTO_IMPLANTACAO.md](FLUXO_AGENDAMENTO_IMPLANTACAO.md) — Guia operacional completo (passo a passo para consultores).
- [docs/01_visual_e_estilos.md](docs/01_visual_e_estilos.md) — Parte visual, páginas/abas e frameworks/estilos.
- [docs/02_componentes_utilizados.md](docs/02_componentes_utilizados.md) — Lista de componentes reutilizáveis.
- [docs/03_logicas_e_validacoes.md](docs/03_logicas_e_validacoes.md) — Regras de validação e lógica de negócio.
- [docs/04_fluxo_codigo_geral.md](docs/04_fluxo_codigo_geral.md) — Fluxo operacional (visão geral para desenvolvimento).
- [docs/05_fluxo_criar_empresa_e_card.md](docs/05_fluxo_criar_empresa_e_card.md) — Fluxo para criar empresa e adicionar card no Kanban.
- [docs/06_fluxo_criar_editar_cronograma.md](docs/06_fluxo_criar_editar_cronograma.md) — Processo detalhado para criar/editar cronogramas.
- [docs/07_tarefas_atendimentos_treinamentos.md](docs/07_tarefas_atendimentos_treinamentos.md) — Como funcionam tarefas, atendimentos e treinamentos.
- [docs/08_estrutura_banco_de_dados.md](docs/08_estrutura_banco_de_dados.md) — Estrutura/coleções do banco de dados (recomendações).

- Índice navegável: [docs/INDEX.md](docs/INDEX.md) — sumário navegável com links por público (Operação / Dev / QA).

Observação: os fluxos detalhados em `docs/05`—`docs/07` foram consolidados no documento mestre [FLUXO_AGENDAMENTO_IMPLANTACAO.md](FLUXO_AGENDAMENTO_IMPLANTACAO.md). Os arquivos originais podem ter sido removidos ou mesclados; consulte o fluxo mestre para o passo a passo completo.

- Guia operacional curto: [GUIDA_OPERACIONAL.md](GUIDA_OPERACIONAL.md) — Resumo executivo para coordenadores e consultores.
- Checklists de aceitação: [docs/ACCEPTANCE_CHECKLISTS.md](docs/ACCEPTANCE_CHECKLISTS.md) — QA e homologação por tela.
-- Modelos de e-mail: *não aplicável* (removido)

Se quiser, posso também gerar um índice `docs/INDEX.md` e criar um PDF unificado com todos esses documentos.
