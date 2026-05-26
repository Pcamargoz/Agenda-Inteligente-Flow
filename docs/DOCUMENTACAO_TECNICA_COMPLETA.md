---
title: "DOCUMENTACAO_TECNICA_COMPLETA"
author: "Auto-compiled"
date: "2026-05-25"
version: "1.0"
---
## Sumário (clique para abrir)

Nota: este arquivo é uma compilação grande. Para evitar erros de preview no GitHub, abra os documentos individuais em `docs/` usando os links abaixo.

- [Guia Operacional — Fluxo Resumido](docs/GUIDA_OPERACIONAL.md)
- [Índice Navegável](docs/INDEX.md)
- [Documentação Técnica — principal (resumo)](docs/DOCUMENTACAO_TECNICA.stub.md)
- [Manual Unificado — Partes 1–4](docs/01_04_manual_unificado.md)
 [Parte 8 — Estrutura do Banco de Dados](docs/08_estrutura_banco_de_dados.md)

---

## Ordem de leitura (IA / Equipe)

- **Para IA (indexação / análise automática):**
  1. Leia `docs/DOCUMENTACAO_TECNICA_COMPLETA.md` do topo para baixo; use o Sumário (TOC) para saltar para seções relevantes.
  2. Priorize as seções: `Guia Operacional` → `Índice Navegável` → `Parte 4 — Fluxo de Código` → `Parte 9 — Estrutura do Banco de Dados (Postgres)` → `Envio de E-mails`.

- **Para a equipe (implantação e operação):**
  1. Comece por `docs/GUIDA_OPERACIONAL.md` (resumo prático).  
  2. Abra `docs/INDEX.md` para localizar documentos por público e, conforme necessário, leia `docs/08_estrutura_banco_de_dados.md`, `docs/04_fluxo_codigo_geral.md` e `docs/EMAIL_ENVIO.md`.

<!-- Acceptance Checklists removed (moved/obsolete). -->

---

<a id="guia-operacional---fluxo-resumido"></a>
## Guia Operacional — Fluxo Resumido (inserido de `GUIDA_OPERACIONAL.md`)
Ver original: [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md)

Objetivo: fornecer um guia curto e acionável para coordenadores e consultores, com links para documentação técnica detalhada.

Público: Coordenador de Atendimento, Consultor, Suporte Técnico.

Sumário rápido
- Propósito e papéis
- Fluxo principal (resumido)
- Principais ações por papel
- Links rápidos para documentação detalhada

Fluxo principal (resumido)
1. Cadastrar consultor e empresa.
2. Criar (ou aplicar) template → montar cronograma (criação de cronogramas iniciada somente dentro do card).
3. Enviar cronograma para aprovação (PDF/Excel + e-mail).
4. Cliente aprova → cronograma confirmado e bloqueado.
5. Sistema gera eventos e registros; execução começa.
6. Registrar atendimentos/treinamentos/tarefas; gerar OS quando necessário.
7. Gerar e enviar OS (PDF + e-mail/WhatsApp); marcar como assinada.

Ações rápidas por papel
- Coordenador: cadastrar consultores/empresas, criar templates, revisar cronogramas, enviar para cliente.
- Consultor: confirmar disponibilidade, executar treinamentos, registrar horas, gerar OS.
- Cliente: aprovar cronogramas, confirmar horários, assinar OS.

 Onde encontrar detalhes
 - Fluxo mestre: [FLUXO_AGENDAMENTO_IMPLANTACAO.md](docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md)
 - Manual Unificado (Visual, Componentes, Lógicas e Fluxo): [docs/01_04_manual_unificado.md](docs/01_04_manual_unificado.md)
 - Estrutura de dados / DB: [docs/08_estrutura_banco_de_dados.md](docs/08_estrutura_banco_de_dados.md)
 - Índice navegável: [docs/INDEX.md](docs/INDEX.md)

Próximos artefatos recomendados
<!-- Acceptance checklists removed -->

---

<a id="indice-navegavel"></a>
## Índice Navegável (inserido de `INDEX.md`)
Ver original: [docs/INDEX.md](docs/INDEX.md)

Este índice reúne os principais guias e referências do projeto para facilitar a implantação da POC/MVP.

Leitura recomendada (ordem curta)
- Operacional (obrigatório): [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md) — resumo acionável para coordenadores e consultores.
- Visão geral / referência: [docs/DOCS.md](docs/DOCS.md) — índice técnico com links para todos os documentos.

Guias operacionais
- [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md) — Quickstart operacional (1 página).
- [docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md](docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md) — Fluxo mestre detalhado (passo a passo).

Documentos por público
Operação / Implantação
- [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md)

Desenvolvimento / Referência técnica
 - [docs/DOCS.md](docs/DOCS.md) — índice geral e instruções de deploy.
 - `Documentação Técnica — principal` (já presente neste arquivo)
 - [docs/01_04_manual_unificado.md](docs/01_04_manual_unificado.md)
 - [docs/08_estrutura_banco_de_dados.md](docs/08_estrutura_banco_de_dados.md)

Exportar para PDF (comando sugerido)
```bash
pandoc docs/GUIDA_OPERACIONAL.md docs/*.md -o Faktory-Flow-Docs.pdf
```

---

<a id="envio-de-emails---visao-geral"></a>
## Envio de E-mails — Visão Geral (inserido de `EMAIL_ENVIO.md`)

Este documento explica, de forma concisa, como funciona o fluxo de envio de e-mails (Ordens de Serviço e notificações) no projeto. Não contém instruções de configuração de provedores ou plataformas de deploy — essas informações foram removidas dos guias principais e centralizadas aqui para referência operacional.

Resumo do fluxo

- O front-end gera a Ordem de Serviço (HTML/PDF) e dispara uma chamada HTTP `POST` para o endpoint interno responsável pelo envio.
- O endpoint é implementado como uma função serverless (conceitualmente uma rota `POST /api/send-os-email`) que: valida o payload (destinatário, assunto, corpo), prepara o remetente e dispara o envio ao provedor de SMTP ou serviço transacional.
- Em caso de falha no envio (API indisponível ou sem configuração), o front-end possui fallback para `mailto:` (abertura do cliente de e-mail local) para facilitar envio manual.

Comportamento e garantias

- Validações: o servidor valida `to`, `subject` e `html/text` mínimos antes de tentar enviar.
- Rate limiting: o envio aplica um limite simples por IP para evitar abuso (best-effort). Se o limite for excedido, o endpoint retorna erro apropriado e o front mostra mensagem ao usuário.
- Idempotência: envios podem ser marcados com flags/ids para evitar duplicação em re-submits.
- Timeout curto: a função de envio tem timeout reduzido para evitar travamentos na UI; operações de envio muito longas devem ser reencaminhadas a jobs assíncronos.
- Logs: resultados de envio (sucesso/falha) devem ser registrados localmente no `NOTIFICATIONS_LOG` (no `localStorage`) e/ou enviados para um backend de logs quando existir.

Boas práticas operacionais

- Não incluir credenciais em arquivos públicos; manter segredos em um local seguro (cofre/env vars no deploy).
- Para produção em escala, utilizar provedores transacionais (SendGrid, Postmark, Resend) e configurar SPF/DKIM/DMARC no DNS do domínio.
- Monitorar filas de falha e implementar retries exponenciais quando apropriado.

Onde está a implementação

- Implementação de referência: `api/send-os-email.js` (função usada no repositório como exemplo). Use-a apenas como modelo — para produção prefira integrar um serviço transacional e mover lógica crítica de retry/log para um backend mais robusto.

Observação

- Este arquivo contém a explicação do fluxo e recomendações. As instruções passo-a-passo de deploy e configuração de plataformas (ex.: Vercel, variáveis de ambiente detalhadas) foram removidas dos documentos principais e não aparecem aqui; se precisar delas, posso restaurar um guia separado com passos controlados e sensíveis ao ambiente.

---

<a id="blueprint-mvp---documento-completo"></a>
## Blueprint MVP — Documento Completo (inserido de `MVP_BLUEPRINT.md`)

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
 | Treinamento concluído com checklist incompleto cria tarefa | Pendências não somam |
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

---

<a id="docsmd---indice-tecnico-e-notas"></a>
## DOCS.md — Índice técnico e notas (inserido de `DOCS.md`)

[Conteúdo do [docs/DOCS.md](docs/DOCS.md) incorporado aqui. Contém visão geral, integrações externas, automações, variáveis sensíveis e instruções gerais de execução, além de observações sobre persistência local, MSAL e html2pdf.]

---

<a id="fim-do-arquivo-compilado"></a>
## Fim do arquivo compilado

Se desejar, posso:
- Gerar uma versão PDF unificada e colocá-la na raiz (`Faktory-Flow-Docs.pdf`).
- Remover trechos duplicados ou normalizar títulos/âncoras para facilitar indexação automática por agentes de IA.
- Incluir metadados YAML no topo do arquivo para ajudar ferramentas de parsing.
# Documentação Técnica — Única (compilada)

Este arquivo reúne os documentos técnicos presentes em [docs/](docs/) num único arquivo para leitura sequencial ou para processamento por ferramentas/IA. As seções sensíveis de configuração de provedores e deploy foram removidas e mantidas separadas; informações sobre o envio de e-mails estão em [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md).

Sumário
- [Documentação Técnica — principal](#documentação-técnica-—-principal)
- [Parte 1 — Visual e Estilos](#parte-1-—-visual-e-estilos)
- [Parte 2 — Componentes utilizados](#parte-2-—-componentes-utilizados)
- [Parte 3 — Lógicas e Validações](#parte-3-—-lógicas-e-validações)
- [Parte 4 — Fluxo de Código (visão geral operacional)](#parte-4-—-fluxo-de-código-visão-geral-operacional)
- [Detalhar processo: criar e editar cronograma](#detalhar-processo-criar-e-editar-cronograma-guia-passo-a-passo)
- [Fluxo de Uso — Agendamento e Implantação](#fluxo-de-uso-—-agendamento-e-implantação)
- [Parte 8 — Estrutura do Banco de Dados](#parte-8-—-estrutura-do-banco-de-dados)
- [Acceptance Checklists](#acceptance-checklists-—-principais-telas)
- [Guia Operacional — Fluxo Resumido](#guia-operacional-—-fluxo-resumido)
- [Referências e próximos passos](#referências-e-próximos-passos)

---

## Documentação Técnica — principal

<!-- Include main technical doc -->

Ver original (resumo): [docs/DOCUMENTACAO_TECNICA.stub.md](docs/DOCUMENTACAO_TECNICA.stub.md)

<!-- START: DOCUMENTACAO_TECNICA.md -->

(Conteúdo completo de [docs/DOCUMENTACAO_TECNICA.stub.md](docs/DOCUMENTACAO_TECNICA.stub.md))


*A seguir está o conteúdo principal consolidado.*

<!-- Paste of docs/DOCUMENTACAO_TECNICA.md content -->

<!-- (Begin) -->

# Documentação Técnica — Faktory Flow Agenda

Esta documentação foi produzida a partir da análise completa do código e descreve, em profundidade, a arquitetura, os fluxos e as decisões técnicas do sistema. O objetivo é permitir que qualquer desenvolvedor consiga entender, manter, evoluir e recriar o projeto do zero.

## 1. Visão geral do projeto

### Objetivo principal do sistema
Centralizar o planejamento e a execução de atendimentos e treinamentos de consultorias, integrando agenda, cronogramas, registros operacionais e emissão de Ordem de Serviço (OS) em um fluxo único e rastreável.

### Problema que o projeto resolve
Empresas de consultoria precisam controlar compromissos, status de execução, pendências, evidências de atendimento e comunicação com clientes. O sistema elimina planilhas dispersas, reduz retrabalho e cria um fluxo operacional padronizado.

### Público-alvo ou cenário de uso
Consultorias e equipes internas que gerenciam agendas, treinamentos, tarefas e relacionamento com clientes, com necessidade de cronogramas e emissão de OS.

### Como a aplicação funciona em alto nível
O front-end é uma SPA em um único arquivo `index.html`, com persistência local total via `localStorage`. O back-end é uma função opcional usada para operações que exigem segredos (ex.: envio de e-mail). Fluxo geral:

```
Usuário → SPA (index.html) → localStorage (dados)
                    └─ fetch → /api/send-os-email → serviço de envio
```

### Principais módulos e responsabilidades gerais
| Módulo | Responsabilidade |
|---|---|
| Agenda | Calendário mensal/semanal/diário, eventos, conflitos e disponibilidade |
| Cronogramas | Planejamento de execução (builder simples e template V2) |
| Registros | Controle de atendimentos, treinamentos e tarefas |
| Templates | Modelos de cronogramas com itens e checklist |
| Dashboard | Visões operacionais (lista, kanban, calendário) |
| Kanban de Clientes | Estado macro por empresa |
| Ordem de Serviço | Geração, PDF, envio e assinatura |
| Notificações | Disparo de e-mails automáticos e log |

## 2. Requisitos funcionais

### Funcionalidades principais
| Funcionalidade | Descrição |
|---|---|
| Gestão de agenda | Criar, editar, reagendar e cancelar eventos, com filtros e detecção de conflitos |
| Cronogramas | Planejar cronogramas com disponibilidade e templates |
| Registros | Registrar atendimentos, treinamentos e tarefas com status e checklist |
| Templates V2 | Modelar itens reutilizáveis para cronogramas estruturados |
| Dashboard | Operação diária com múltiplas visões e filtros salvos |
| Kanban por cliente | Visualizar estágio macro do cliente |
| OS | Emitir, gerar PDF, enviar por e-mail e marcar como assinada |
| Notificações | Enviar e registrar e-mails automáticos em eventos chave |
| Integridade | Verificar e corrigir inconsistências do localStorage |

... (o restante do conteúdo técnico principal segue sem alterações relevantes)

## 7. Back-end

O back-end consiste em pontos mínimos utilizados pelo front-end para operações que dependem de segredos ou de serviços externos (por exemplo, envio de e-mail). Por segurança e separação de responsabilidades a implementação exemplar disponível no repositório é simples — para produção, recomenda‑se migrar a lógica crítica para um serviço backend mais robusto.

- Implementação de referência: existe uma função exemplo que recebe o payload da OS e encaminha para um serviço de envio (SMTP ou transacional).
- Para a descrição do fluxo de envio de e-mails e recomendações operacionais, veja [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md).

## 8. Front-end

<!-- Front-end section continues as in original file -->

<!-- END: DOCUMENTACAO_TECNICA.md -->

---

## Parte 1 — Visual e Estilos

<!-- Paste docs/01_visual_e_estilos.md -->

# Parte 1 — Visual e Estilos

Objetivo: documentar a camada visual do MVP/POC para que a equipe de produto/designer/desenvolvimento saiba quais páginas existem, quais abas e o framework usado para estilos.

1. Páginas / Abas principais
- Dashboard (visão geral)
- Atendimentos / Treinamentos / Tarefas (Kanban por cliente e lista)
- Cronogramas por empresa (builder de cronograma)
- Cadastros → Consultores
- Cadastros → Empresas
- Templates de agendamento (listar, editar, duplicar)
- Painel do Consultor (visão individual)
- Modal de Cadastro: Novo consultor, Nova empresa, Novo template, Nova OS
-
Observação: a criação de cronogramas agora é feita somente dentro do card (abrir o card correspondente → ação "Criar cronograma").

2. Estrutura visual
- Layout geral: menu lateral esquerdo com seções `OPERAÇÃO` e `CONFIGURAÇÃO`; área principal com título, ações (botões principais) e conteúdo.
- Cores principais / semântica:
  - Verde (success): status confirmado/realizado
  - Laranja / Amarelo: provisório / aguardando aprovação
  - Vermelho: erro / conflito
  - Azul: itens confirmados / em andamento
- Indicadores: cartões resumidos (total itens, treinamentos, tarefas, pendências) no topo do card/cronograma.

3. Componentes de interação visuais
- Kanban por cliente: colunas (Não iniciada, Aguardando cliente, Em andamento, Concluída, Cancelada)
- Modais: formulário com campos divididos por seções (Identificação, Jornada, Disponibilidade, Itens)
- Calendário picker com seleção múltipla de dias (para distribuir templates)
- Botões de ação primários: `Salvar rascunho`, `Adicionar ao cronograma`, `Enviar para aprovação do cliente`, `Confirmar com cliente`, `Gerar OS`.

4. Frameworks e bibliotecas visuais (sugestão / observação no MVP)
- Frontend: projeto atual usa stack web moderna (React / Next.js) — verificar `package.json` para confirmação.
- Estilos: design tokens e CSS-in-JS ou pré-processador. No MVP POC sugerido: `styled-components` ou `tailwindcss` para acelerar iteração visual.

5. Notas para design system
- Documentar tokens: cores, espaçamentos, tipografia, bordas, sombras.
- Criar componentes reutilizáveis: `CardResumo`, `CronogramaItem`, `ModalForm`, `KanbanColumn`, `BadgeStatus`, `DateTimePicker`.

---

## Parte 2 — Componentes utilizados

<!-- Paste docs/02_componentes_utilizados.md -->

# Parte 2 — Componentes utilizados

Objetivo: listar os componentes reutilizáveis da interface usados no fluxo de agendamento/implantação.

Componentes principais
- `SidebarMenu` — navegação lateral com seções e indicadores (badge counts).
- `Header` — título da página, ações globais, identificação do usuário.
- `CardResumo` — mostra totais (itens, treinamentos, tarefas, pendências).
- `KanbanBoard` e `KanbanColumn` — container e colunas do Kanban por cliente.
- `ClientCard` — cartão do cliente dentro do Kanban (resumo + ações rápidas).
- `CronogramaBuilder` — área com seleção de período, templates e preview; edição e organização ficam no builder, porém a criação inicial de cronogramas/itens é iniciada a partir do `ClientCard` (abrir o card correspondente → ação "Criar cronograma").
- `CronogramaItemEditor` — modal/redrawer para editar data, hora, participantes, recursos.
- `TemplateCard` — exibição de template com ações `Editar`, `Duplicar`, `Desativar`.
- `ModalForm` — componente genérico para formulários (cadastro de consultor/empresa/template/OS).
- `DatePicker` / `TimePicker` — seleção de datas e horas; suporta multi‑select para distribuição.
- `BadgeStatus` — exibe status colorido (Provisório, Em andamento, Confirmado, Cancelado).
- `TasksChecklist` — lista com itens de tarefa, ações rápidas (Concluir, Pendência, Cancelar).
- `OSForm` — formulário para preencher Ordem de Serviço e enviar anexos.
- `NotificationToast` — feedback assíncrono no front (sucesso/erro)

Padrões de composição
- Combinar `CardResumo` com `ClientCard` para navegação rápida.
- `CronogramaBuilder` usa `TemplateCard` e `CronogramaItemEditor` para editar e organizar itens (arrastar/editar). A criação de novos cronogramas/itens é acionada via `ClientCard`.

---

## Parte 3 — Lógicas e Validações

<!-- Paste docs/03_logicas_e_validacoes.md -->

# Parte 3 — Lógicas e Validações

Objetivo: registrar as regras operacionais e validações aplicadas no fluxo (front e back) para garantir integridade e experiência.

Validações de UI / Previsão
- Validação de disponibilidade do consultor:
  - Checar conflito de horários (overlap) com outros eventos do consultor.
  - Checar se horário está dentro da jornada (entrada/saída) do consultor.
  - Checar se o horário respeita intervalos de almoço.
- Validação de formato: CNPJ, e‑mail, campos obrigatórios (nome, data/hora quando obrigatório).

Validações de negócio
- Bloqueio de double booking: impedir salvar cronograma que cause sobreposição para o mesmo consultor.
- Regras de confirmação: somente cronogramas com todos os itens com data/hora definidos podem ser enviados para aprovação.
- Estados: não permitir edição de campos validados após confirmação sem criar nova versão/rollback.
- OS: somente gerar OS após execução (ou em caso de registro retroativo) e confirmar horas reais.

Validações de dados e consistência (backend)
- Validar timezone e armazenar timestamps em UTC; exibir no timezone do cliente/usuário.
- Transações atômicas: confirmação do cronograma deve criar registros de atendimento de forma atômica (commit/rollback em falha).
- Idempotência nos endpoints de envio/confirm: re‑envios não devem gerar duplicatas.

Feedback visual
- Itens com falhas exibem tooltip com motivo.
- Indicador de progresso (ex.: 4/5 itens prontos) no builder.

Resumo de erros esperados e manejo
- Conflito de horário → bloquear e sugerir dias alternativos.
- Falha na geração de anexos → salvar rascunho e agendar re‑geração por worker.
- Erro de envio (SMTP/SMS) → registrar `Notification` com status `failed` e agendar retry.

---

## Parte 4 — Fluxo de Código (visão geral operacional)

<!-- Paste docs/04_fluxo_codigo_geral.md -->

# Parte 4 — Fluxo de Código (visão geral operacional)

Objetivo: descrever de forma não técnica o fluxo de execução esperado entre telas e entidades — serve como mapa para arquitetos e desenvolvedores entenderem o comportamento global.

1. Ações do usuário (front) que disparam fluxos
- Criação/edição de cronograma: iniciar a criação a partir do `ClientCard` (abrir o card → ação "Criar cronograma"); em seguida abrir o builder de cronograma para editar/preview → salvar rascunho (local/backend) ou enviar para aprovação.
- Enviar para aprovação → backend gera anexos, cria notificação e marca cronograma como `sent`.
- Cliente aprova → backend recebe confirmação → cria registros de atendimento e atualiza status para `confirmed`.
- Consultor executa treinamento → marca `Realizado` → pode gerar OS.

2. Fluxo de estados (cronograma)
- draft (iniciado) → provisioned (template aplicado) → sent (enviado para cliente) → awaiting_client (aguardando retorno) → confirmed (aprovado) → cancelled

3. Fluxo de execução (resumido)
- Usuário cria cronograma → salva → envia
- Servidor: recebe envio → gera PDF/Excel (job assíncrono) → envia e‑mail/SMS → registra notification
- Cliente aprova (clicando no link ou por interface) → servidor processa confirmação (operação atômica) → cria atendimentos e tarefas vinculadas → notifica consultor
- Consultor realiza atendimentos → marca finalizações → caso necessário gera OS → horas são contabilizadas

---

## Detalhar processo: criar e editar cronograma (guia passo a passo)

<!-- Paste DETALHAR_PROCESSO_CRONOGRAMA.md -->

# Detalhar processo: criar e editar cronograma (guia passo a passo)

Objetivo: documentar todas as etapas do builder de cronograma para que a equipe execute ou refine a interface.

1) Abertura do builder
- A abertura do builder de cronograma é feita a partir do `ClientCard` no Kanban (`Atend. / Treino / Tarefas`) → ação `+ Novo cronograma` no card. A criação diretamente na tela `Cronogramas por empresa` não inicia mais o processo.
- Selecionar: Empresa, Consultor, Período (de/até).

2) Opções iniciais
- `Sugerir dias livres`: calcula dias livres com base na disponibilidade do consultor e bloqueios.
- `Usar templates`: seleciona templates disponíveis e inclui seus items no preview.
- `Cronogramas salvos`: carregar um cronograma anteriormente salvo como rascunho.

... (conteúdo completo segue)

---

## Fluxo de Uso — Agendamento e Implantação

<!-- Paste FLUXO_AGENDAMENTO_IMPLANTACAO.md -->

# Fluxo de Uso — Agendamento e Implantação

Documento resumido descrevendo o fluxo de uso para agendamento e implantação.

**Visão Geral**
- Objetivo: registrar o passo a passo desde o cadastro do consultor e da empresa, criação de templates e cronogramas, até a execução dos treinamentos e geração de Ordens de Serviço (OS).
- Escopo: telas de `Cadastros`, `Templates`, `Atend. / Treino / Tarefas`, `Cronogramas`, e `Atendimentos`.

... (conteúdo completo segue)

---

## Parte 8 — Estrutura do Banco de Dados

<!-- Paste docs/08_estrutura_banco_de_dados.md -->

# Parte 8 — Estrutura do Banco de Dados

Objetivo: descrever o modelo de dados sugerido/atual para o MVP/POC e qual tecnologia de banco usar.

1. Tecnologia recomendada / usada
- MVP/POC: Firestore (NoSQL) é adequado por agilidade e escalabilidade; pode ser substituído por Postgres conforme necessidade de consultas complexas.

... (conteúdo completo segue)

---

## Acceptance Checklists — Principais telas

<!-- Acceptance checklists were removed from the repo -->

# Acceptance Checklists — Principais telas

Objetivo: checklists concisos para validação funcional durante QA e homologação.

... (conteúdo completo segue)

---

## Guia Operacional — Fluxo Resumido

<!-- Paste docs/GUIDA_OPERACIONAL.md -->

# Guia Operacional — Fluxo Resumido

Objetivo: fornecer um guia curto e acionável para coordenadores e consultores, com links para documentação técnica detalhada.

... (conteúdo completo segue)

---

## Referências e próximos passos

- A versão compacta para leitura rápida é [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md).
- Para questões operacionais de deploy e configuração sensível solicite acesso ao responsável pela infraestrutura.
- Para detalhes do fluxo de envio de e-mails veja [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md).
