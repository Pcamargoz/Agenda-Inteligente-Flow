 
# Blueprint MVP — Sistema de Agendas de Consultoria

Documento único para **replicar** este sistema (Faktory Flow Agenda) em outro projeto. Cobre escopo mínimo, modelo de dados, fluxos, integrações e passo-a-passo de reconstrução. Não documenta o código existente — orienta como construí-lo de novo.

---

## 1. Resumo executivo

**O que é:** SPA + 1 função serverless para centralizar agenda, cronogramas, registros operacionais (atendimento/treinamento/tarefa), emissão de OS com assinatura digital pública, e controle de saldo de horas por cliente.

**Para quem:** consultorias com múltiplos consultores atendendo várias empresas, que precisam unificar planejamento, execução e cobrança em um único fluxo rastreável.

**Princípio arquitetural:** zero backend de dados. Tudo no `localStorage` do navegador. Backend serverless existe **apenas** para tarefas que exigem segredo (SMTP) — credenciais nunca tocam o cliente.

---

## 2. Escopo MVP — o que é essencial

| Essencial | Pode ficar para depois |
|---|---|
| Cadastros (consultor, empresa, tabelas auxiliares) | Filtros salvos por usuário |
| Agenda com criação/edição/conflito de eventos | Recorrências customizadas complexas |
| Cronograma builder + template | Drag-and-drop em kanban |
| Registros (atendimento/treinamento/tarefa) com checklist | Dashboard com múltiplas views |
| OS: gerar, enviar (SMTP+WhatsApp+mailto), assinar via link público | Anexos por e-mail |
| Saldo de horas debitado **na emissão da OS** (não na assinatura) | PDFs server-side |
| Persistência local + migração versionada | Auditoria centralizada |
| Integração Microsoft Graph (sync calendar) | Login multi-usuário real |

---

## 3. Modelo de dados

Toda entidade tem: `id` (gerado por `uid(prefix)`), `history[]` para auditoria. IDs por convenção: `c_*` consultor, `co_*` empresa, `e_*` evento, `s_*` série/cronograma, `r_*` registro, `os_*` ordem de serviço, `cc_*` card de cliente.

### Entidades principais

**CONSULTANTS** — `name`, `email`, `phone`, `workStart/workEnd` (jornada), `lunchMin`, `freeDays[]`, `blockedDates[]`, `defaultRecurrence`. Calcula capacidade via `workEnd - workStart - lunchMin`.

**COMPANIES** — `razao`, `fantasia`, `cnpj`, `responsavel`, `contato` (e-mail), `whatsapp`, `consultantId` (consultor padrão), `tipoAgenda`, `projeto`.

**EVENTS** — `consultantId`, `companyId`, `date` (ISO), `timeStart`/`timeEnd` (HH:MM), `typeId`, `title`, `status`, `recurrence`, `priority`, `seriesId`, `scheduleId`, `itemId`, `reagendadoDe`, `graphEventId` (para sync Microsoft Graph).

**SCHEDULES** (cronogramas) — `companyId`, `consultantId`, `from`/`to`, `status`, `mode` (`template` ou builder), `items[]` (no template), `eventIds[]` (gerados).

**RECORDS** — `kind` ∈ {`atendimento`, `treinamento`, `tarefa`}, `consultantId`, `companyId`, `date`, `timeStart/End`, `status`, `priority`, `checklist[]`, `linkedTaskIds[]`, `linkedEventId`.

**TEMPLATES** — `name`, `items[]`. Cada item: `kind`, `name`, `desc`, `checklist[]`, `suggestedDays`, `timeStart/End`, `priority`, `defaultResponsibleId`.

**CLIENT_CARDS** (kanban) — `companyId`, `status`, `statusManual`, `hoursContracted`, `hoursLog[]` (movimentações de débito/estorno).

**ORDERS_SERVICE** — `itemSrc` (`record`|`event`), `itemId`, `title`, `scope`, `clientEmail`, `clientWhatsapp`, `internalPending[]`, `clientPending[]`, `status` ∈ {`rascunho`, `enviada`, `assinada`, `cancelada`}, `sentAt`, `sentVia`, `signedAt`, `hoursDebited`, `hoursDebitedAmount`.

**Auxiliares** — `EVENT_TYPES`, `STATUSES`, `PERIODS`, `RECURRENCES`, `PRIORITIES`, `USERS` (perfis), `NOTIFICATIONS_LOG`.

### Estados possíveis

| Entidade | Estados |
|---|---|
| Evento | `criado` → `provisorio` → `confirmado` → `em-atendimento` → `atendido` (terminais: `reagendado`, `cancelado`) |
| Cronograma | `rascunho` → `aguardando-cliente` → `confirmado` |
| Registro | `em-andamento` → `pendente` → `em-atendimento` → `atendido` → `concluido` |
| OS | `rascunho` → `enviada` → `assinada` (terminal: `cancelada`) |
| Card cliente | `nao-iniciada` → `aguardando` → `em-andamento` → `concluida` (terminal: `cancelada`) |

Definir transições em uma tabela `STATUS_TRANSITIONS` e validar com `canTransitionTo(from, to)`. Saltos ilegais bloqueados.

---

## 4. Fluxo principal end-to-end

1. **Cadastro** — admin cria consultores, empresas e cards de cliente.
2. **Cronograma** — consultor monta cronograma (builder simples ou template V2) considerando `freeDays`, `blockedDates` e carga diária.
3. **Envio ao cliente** — cronograma vai pra `aguardando-cliente`; cliente revisa via link público.
4. **Confirmação** — ao confirmar, sistema gera `EVENTS` e `RECORDS` automaticamente, com status inicial conforme presença de data.
5. **Execução** — consultor atualiza registros (status, checklist). Treinamento com checklist incompleto **gera tarefa pendente** automaticamente.
6. **Geração de OS** — quando record vira `atendido`, abre-se modal de OS. Pendências internas vêm de checklists não concluídas; pendências do cliente vêm de tarefas abertas relacionadas à empresa.
7. **Emissão** — OS é enviada via SMTP (com fallback `mailto:`) ou WhatsApp. **No envio**, `os.status='enviada'` E `osDebitHours()` debita o saldo de horas do card do cliente (idempotente por flag `hoursDebited`).
8. **Assinatura** — cliente acessa link público (`publicOSLink(osId)`), revisa OS, desenha assinatura. `os.status='assinada'`, `signedAt=now`. Saldo já estava debitado.
9. **Cancelamento (se houver)** — `osRefundHours()` estorna o saldo se `hoursDebited` estiver `true`. Item de origem (record/event) restaurado ao status anterior.
10. **Sincronização externa (opcional)** — se conectado ao Microsoft Graph, cada criação/edição/exclusão de evento da agenda replica no calendário Outlook/Teams do usuário.

---

## 5. Regras de negócio críticas

| Regra | Por quê |
|---|---|
| Eventos `cancelado`/`reagendado` não aparecem na agenda padrão | Limpeza visual |
| Atendimento não pode ser "concluído" diretamente — só via OS | OS é o documento que finaliza |
| Treinamento concluído com checklist incompleto cria tarefa | Pendências não somem |
| Cronograma `confirmado` bloqueia edição | Garante consistência com o cliente |
| Reagendamento exige motivo e cria vínculo `reagendadoDe` | Rastreabilidade |
| Capacidade diária = jornada − almoço | Evita sobrecarga |
| Recorrências geram no máximo N=5 ocorrências adicionais | Evitar explosão de eventos |
| **Débito de horas acontece na emissão da OS, não na assinatura** | Reserva saldo já no compromisso firmado |
| Débito é idempotente (flag `hoursDebited`) | Permite chamar de múltiplos pontos sem dobrar |
| Cancelamento de OS estorna automaticamente se debitada | Saldo nunca fica "preso" |
| OS muda `itemSrc` para `concluido` ao assinar | Formaliza encerramento |
| Card do cliente atualiza status macro automaticamente | Visão executiva sem ação manual |

---

## 6. Stack recomendado

| Camada | Tecnologia | Por quê |
|---|---|---|
| Front | HTML/CSS/JS puro em **um arquivo** | Zero build, edição direta, deploy estático |
| Persistência | `localStorage` com chave versionada (ex: `app_v2`) | Offline, custo zero, simples |
| Persistência (alternativa enterprise) | Substituir por IndexedDB ou backend REST | Quando precisar multi-usuário ou volume |
| Serverless | Functions (Node 18+) | 1 só endpoint, deploy automático (ex.: Vercel/Netlify) |
| SMTP | `nodemailer` | Padrão de fato no Node |
| PDF client | `html2pdf.js` via CDN | Sem backend de documentos |
| Auth Microsoft | `@azure/msal-browser` via CDN (PKCE) | Sem servidor OAuth |
| Assinatura digital | `<canvas>` nativo + base64 PNG | Sem dependência externa |

**Alternativas válidas:** Vite + React, Next.js + Prisma + Postgres. Mas o ganho real (modularidade) custa toolchain + build + deploy + hot-reload mais lento na edição direta. Para um sistema interno com ≤ 10 usuários simultâneos, o stack flat é superior.

---

## 7. Arquitetura

```
┌─────────────────────────────────────────────────┐
│                  Browser (SPA)                  │
│  ┌───────────────────────────────────────────┐  │
│  │  index.html                               │  │
│  │  ├─ state (objeto global)                 │  │
│  │  ├─ arrays: EVENTS, RECORDS, OS, ...      │  │
│  │  ├─ render*() (DOM manual)                │  │
│  │  └─ persist() → localStorage              │  │
│  └───────────────────────────────────────────┘  │
│         │                  │              │     │
│         ▼                  ▼              ▼     │
│   localStorage         MSAL.js        html2pdf  │
└─────────│──────────────────│───────────────────┘
          │                  │
          ▼                  ▼
   /api/send-os-email   Microsoft Graph
          │                  │
          ▼                  ▼
        SMTP            Outlook/Teams
```

**Separação:**
- Front concentra **toda** regra de negócio + UI + persistência.
- Backend (serverless) é único e existe **só** para envio SMTP (segredo).
- Microsoft Graph é cliente-a-cliente — token vive no localStorage do usuário, nunca passa pelo nosso backend.
- PDF e assinatura ocorrem totalmente no browser.

**Padrões:**
- Estado global mutável (`state`, `EVENTS`, etc.) — sem Redux/MobX.
- Renderização manual com `render*()` funções idempotentes.
- Persistência versionada (`persist_v2`, `persist_v3`...) para migração suave entre versões.
- Auditoria via array `history` em cada entidade.

---

## 8. Integrações externas

### 8.1 Envio de e-mails (visão geral)

O envio de Ordens de Serviço (OS) pode ser realizado por um componente de backend que mantém segredos fora do navegador. Este repositório inclui uma função de exemplo para demonstração — para detalhes operacionais, variáveis e recomendações de produção, consulte `docs/EMAIL_ENVIO.md`.

Durante falhas do serviço de envio, a interface possui fallback para abrir o cliente de e-mail (`mailto:`) como alternativa de menor custo.

### 8.2 Microsoft Graph via MSAL.js (browser, PKCE)
- **SDK:** `@azure/msal-browser` v2.38+ via CDN jsDelivr.
- **Finalidade:** replicar eventos da agenda no calendário Outlook/Teams do usuário logado.
- **Config:** `clientId` + `tenantId` (ou `'common'`) hardcoded em `TEAMS_CFG` no `index.html` — público por natureza no SPA, não é segredo.
- **Scopes:** `User.Read`, `Calendars.ReadWrite`, `offline_access`. Adicionar `OnlineMeetings.ReadWrite` apenas para tenant M365 corporativo (gera link de reunião Teams automaticamente).
- **Pré-requisito:** registrar app no Microsoft Entra ID como **SPA** com redirect URI = URL do deploy.
- **Token persistence:** `localStorage` (`cacheLocation: 'localStorage'`).
- **Versão do token:** `requestedAccessTokenVersion: 2` no manifest se aceitar contas pessoais.
- **Se cair:** agenda local intacta; toast amarelo `"Teams não sincronizou"`.

### 8.3 html2pdf.js (CDN)
- **Finalidade:** export de OSs/cronogramas em PDF dentro do navegador.
- **Sem credenciais.** Se cair: botões de PDF não funcionam, resto intacto.

### 8.4 wa.me (deep link)
- **Finalidade:** envio de OS via WhatsApp Web.
- **Sem credenciais.** Monta URL `https://wa.me/{phone}?text={encoded}` e abre em nova aba.

---

## 9. Variáveis sensíveis

As variáveis e segredos relacionados a envio de e-mail e provedores transacionais estão documentados em `docs/EMAIL_ENVIO.md`. Para ambientes de produção, gerencie secrets via o sistema de infraestrutura adotado (ex.: secrets de projeto, Vault, etc.).

**Microsoft Graph**: o `clientId` e `tenantId` são configurados em `TEAMS_CFG` no front para uso SPA; redirect URIs e políticas devem ser ajustadas conforme o tenant e as regras da organização.

---

## 10. Como rodar e replicar

### 10.1 Pré-requisitos
- Node ≥ 18
- CLI/ ferramentas de execução conforme a plataforma escolhida (ex.: Vercel CLI, Netlify CLI, etc.).
- Conta Microsoft (corporativa ou pessoal) com acesso ao [Microsoft Entra ID](https://entra.microsoft.com) para registrar o app.

### 10.2 Setup (visão geral)
1. Instalar dependências: `npm install`.
2. Ajustar variáveis sensíveis via o sistema de segredos da plataforma escolhida.
3. Executar o ambiente de desenvolvimento conforme a plataforma: `npm run dev` (script ajustável).
4. Deploy conforme a infraestrutura adotada (ex.: `npm run deploy` que chama o CLI apropriado).

### 10.3 Registro Microsoft Entra (se for usar Teams sync)
1. https://entra.microsoft.com → **Registros de aplicativo** → **+ Novo registro**.
2. Nome livre. Tipos de conta: **Multilocatário + contas pessoais** (mais flexível).
3. Redirect URI: tipo **SPA**, URL = domínio do deploy.
4. Em **Permissões de API** → Microsoft Graph → Delegadas: `Calendars.ReadWrite`, `offline_access`, `User.Read`.
5. Em **Manifesto**: setar `requestedAccessTokenVersion: 2`.
6. Copiar `clientId` e `tenantId` (ou usar `'common'`) → colar em `TEAMS_CFG` no `index.html`.
7. Conceder consentimento de admin se o tenant exigir.

### 10.4 Roteiro de reconstrução do zero
1. Modelar entidades + tabela `STATUS_TRANSITIONS`.
2. Implementar `state` global, `persist()`/`loadPersisted()` com chave versionada.
3. UI base: sidebar + workspace + modais (HTML + CSS, sem framework).
4. Módulo **Agenda**: render mensal/semanal/diário, `findConflicts`, mini-calendário.
5. Módulo **Cronograma**: builder simples + template V2.
6. Módulo **Registros**: kinds com regras específicas (atendimento, treinamento, tarefa).
7. Módulo **OS**: modal, geração de PDF (html2pdf), envio SMTP/WhatsApp/mailto, link público de assinatura (canvas).
8. **Saldo de horas**: `hoursDebited` idempotente, débito na emissão, estorno no cancelamento.
9. Endpoint de envio (ex.: `/api/send-os-email`) com validações e healthcheck — ver `docs/EMAIL_ENVIO.md`.
10. **Microsoft Graph**: MSAL via CDN, botão "Conectar", `teamsSync(action, ev)` em `saveEvent`/`deleteEvent`.
11. `validateDataIntegrity()` para detectar/corrigir órfãos.
12. Configurar arquivo de deploy conforme a plataforma adotada (ex.: `vercel.json` como exemplo). 

---

## 11. Decisões e trade-offs

**LocalStorage como banco** → simplicidade radical, offline-first, custo zero. Custo: zero multi-usuário, perda de dados ao limpar navegador. Mitigação: botão de export/import JSON.

**Single-file `index.html`** → edição direta sem toolchain. Custo: arquivo grande (~22k linhas), busca lenta em editores, sem code-splitting. Mitigação: convenções claras de seções por comentários `/* ======== */`.

**MSAL Public Client (PKCE) no browser** → integração Microsoft sem servidor OAuth. Custo: refresh tokens limitados, token vive no localStorage. Aceitável para uso interno; trocar por Auth Code com backend se for SaaS público.

**Débito de horas na emissão (não na assinatura)** → cliente vê saldo já reservado quando OS é enviada. Custo: se OS for cancelada antes de assinar, precisa estornar. Mitigação: estorno automático via `osRefundHours()` ao cancelar, idempotente via `hoursDebited`.

---

## 12. O que **não** replicar literalmente

- Cores e tipografia da Faktory (Fraunces/Manrope, paleta champagne/forest) — substituir pela identidade visual do novo projeto.
- IDs Microsoft (`clientId`, `tenantId` em `TEAMS_CFG`) — registrar novo app, copiar IDs próprios.
- Domínio `agenda-inteligente-flow.vercel.app` — usar domínio próprio nos redirect URIs do Entra.
- Textos de e-mail (HTML body, mensagens WhatsApp, link público) — adaptar ao tom de voz do novo cliente.
- Regras de capacidade do consultor (jornada, almoço) — confirmar se modelo do novo cliente é o mesmo.
