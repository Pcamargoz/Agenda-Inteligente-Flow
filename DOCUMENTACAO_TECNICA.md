# Dokumentação Técnica — Faktory Flow Agenda

Abaixo está a documentação técnica completa, organizada e detalhada o suficiente para outra pessoa entender, manter e recriar o sistema do zero, cobrindo arquitetura, fluxos, regras de negócio, integrações, estados e decisões técnicas.

# 1. Visão geral e arquitetura

O projeto é uma **aplicação web single-file** (HTML/CSS/JS em `index.html`) com persistência **100% local via `localStorage`**, e um único backend **serverless** para envio de e-mails SMTP.
A escolha por **SPA estática** reduz custo operacional e facilita deploy (Vercel), enquanto o **serverless** guarda credenciais SMTP fora do navegador, evitando exposição.

**Visão macro:**

```
Browser (SPA) ──fetch──> /api/send-os-email (Vercel Function) ──SMTP──> Email
              └─ localStorage (dados)
```

# 2. Stack, bibliotecas, dependências e ferramentas

| Componente | Uso | Motivo da escolha |
|---|---|---|
| HTML/CSS/JS puro | UI, lógica e renderização | Zero build, deploy direto, fácil manutenção |
| `localStorage` | Persistência local de todos os dados | Sem backend de dados; experiência offline |
| `html2pdf.js` (CDN) | Geração de PDFs no browser | Evita backend para geração de documentos |
| Vercel Serverless | Endpoint de envio SMTP | Segredos no servidor, escala simples |
| `nodemailer` | Envio SMTP | Padrão no ecossistema Node |
| Vercel CLI (`vercel dev`) | Desenvolvimento local | Replica o runtime serverless |

# 3. Estrutura de pastas

| Caminho | Responsabilidade |
|---|---|
| `index.html` | Aplicação inteira: layout, estilos e lógica de negócio |
| `api/send-os-email.js` | Função serverless para envio de e-mails via SMTP |
| `package.json` | Dependência (`nodemailer`) e scripts de deploy |
| `vercel.json` | Configuração Vercel (headers, timeout, function) |
| `.env.example` | Modelo das variáveis SMTP |

# 4. Modelo de dados (entidades, campos e relações)

## 4.1 Convenções gerais
- IDs são gerados por `uid(prefix)` com prefixo semântico (`c`, `co`, `e`, `r`, `sch`, `tpl` etc.).
- Relações são por **ID** e não por referência direta.
- A maioria das entidades possui `history` com trilha de auditoria (ação, usuário e timestamp).

---

## 4.2 CONSULTANTS (consultores)
**Relações:**
- `EVENTS.consultantId`
- `RECORDS.consultantId`
- `COMPANIES.consultantId` (consultor padrão)

**Campos principais**
| Campo | Exemplo | Propósito |
|---|---|---|
| `id` | `c7h2...` | Identificador |
| `name` | `Ana Martins` | Nome |
| `initials` | `AM` | Avatar |
| `role` | `Consultora` | Cargo |
| `specialty` | `PCP` | Especialidade |
| `email` | `ana@...` | Contato para notificações |
| `phone` | `+55...` | Contato |
| `workStart/workEnd` | `08:00–17:00` | Jornada |
| `lunchMin` | `60` | Almoço |
| `freeDays` | `[1,2,3,4,5]` | Dias livres |
| `freePeriods` | `['manha']` | Preferência |
| `blockedDates` | `['2026-05-25']` | Bloqueios |
| `defaultRecurrence` | `weekly` | Recorrência padrão |
| `cls` | `c1..c5` | Cor do avatar |

**Regras importantes**
- `consultantDailyCapacityMin()` calcula capacidade diária descontando almoço.
- `consultantDayLoad()` calcula carga usada por dia (ocupado vs provisionado).
- `isConsultantFreeOn()` verifica se o consultor atende naquele dia (freeDays + bloqueios).

---

## 4.3 COMPANIES (empresas/cliente)
**Relações:**
- `EVENTS.companyId`, `RECORDS.companyId`, `SCHEDULES.companyId`, `CLIENT_CARDS.companyId`, `ORDERS_SERVICE.companyId`

**Campos principais**
| Campo | Exemplo | Propósito |
|---|---|---|
| `id` | `co1...` | Identificador |
| `razao` | `Empresa X LTDA` | Razão social |
| `fantasia` | `Empresa X` | Nome fantasia |
| `cnpj` | `00.000.000/0001-00` | CNPJ |
| `responsavel` | `João` | Pessoa de contato |
| `contato` | `joao@...` | E-mail |
| `consultantId` | `c...` | Consultor padrão |
| `tipoAgenda` | `consultoria` | Tipo padrão do evento |
| `projeto` | `Implantação PCP` | Projeto |
| `whatsapp/phone` | opcional | Envio de OS |

---

## 4.4 EVENT_TYPES / STATUSES / PERIODS / RECURRENCES
Tabelas auxiliares editáveis (Cadastros → Tabelas).
Influenciam UI, filtros e regras.

**Status principais e semântica**
- `criado`, `provisorio`, `confirmado`, `em-andamento`, `em-atendimento`, `atendido`, `concluido`, `pendente`, `reagendado`, `cancelado`
- Paleta semântica (warning/progress/success/danger) para UI.

**Transições permitidas**
Definidas em `STATUS_TRANSITIONS` e validadas por `canTransitionTo`.

---

## 4.5 EVENTS (agenda)
**Relações:**
- `seriesId` liga eventos de um cronograma ou recorrência
- `scheduleId`, `templateId`, `itemId` em cronogramas template

**Campos**
| Campo | Propósito |
|---|---|
| `consultantId`, `companyId` | Vínculos |
| `date`, `timeStart`, `timeEnd` | Data/hora |
| `typeId`, `title` | Tipo e título |
| `status` | Status da agenda |
| `period`, `recurrence` | Período/recorrência |
| `priority`, `desc`, `details`, `notes` | Metadados |
| `seriesId` | Série do cronograma |
| `reagendadoDe` | Link com evento original |

**Regra de negócio**
Eventos `cancelado` e `reagendado` **não aparecem** na agenda principal, a não ser que o filtro peça explicitamente.

---

## 4.6 SCHEDULES (cronogramas)
Existem **dois modos**:

1. **Builder simples (dias livres)**
   - Gera eventos diretos em `EVENTS`.
2. **Modo template (V2)**
   - Armazena **itens internos** (`items`) + gera eventos só quando há data/hora.
   - Suporta rascunho, envio ao cliente e confirmação.

**Campos principais**
| Campo | Propósito |
|---|---|
| `id`, `companyId`, `consultantId` | Identidade |
| `from/to` | Período macro |
| `status` | `rascunho`, `aguardando-cliente`, `confirmado` etc. |
| `mode` | `template` ou vazio |
| `items`, `itemIds` | Itens do cronograma |
| `eventIds` | Eventos criados |
| `history` | Auditoria |

---

## 4.7 RECORDS (atendimentos, treinamentos, tarefas)
**Tipos:** `atendimento`, `treinamento`, `tarefa`.

**Campos relevantes**
| Campo | Uso |
|---|---|
| `kind` | Tipo do registro |
| `consultantId`, `companyId` | Vínculos |
| `date`, `timeStart`, `timeEnd` | Datas |
| `status` | Status do ciclo de vida |
| `priority` | Apenas tarefa |
| `checklist` | Treinamento |
| `linkedTaskIds` | Atendimento → tarefas vinculadas |
| `linkedEventId` | Conexão com agenda |
| `history` | Auditoria |

**Regras críticas**
- Atendimento **não pode** ir direto para `concluido`; é convertido para `atendido`.
  OS é que marca `concluido`.
- Treinamento concluído com checklist incompleta gera **tarefa pendente** automática.

---

## 4.8 TEMPLATES (V2, composto)
Template = coleção de itens (treinamentos + tarefas).

**Item do template**
| Campo | Uso |
|---|---|
| `kind` | `treinamento` ou `tarefa` |
| `name/desc` | Título e descrição |
| `checklist` | Etapas (treino/tarefa) |
| `suggestedDays` | Dias sugeridos |
| `timeStart/timeEnd` | Sugestão de horário |
| `priority`, `defaultResponsibleId` | Tarefas |

---

## 4.9 CLIENT_CARDS (Kanban por cliente)
Representa o **estado macro** de uma empresa.

**Status do card**
`nao-iniciada`, `aguardando`, `em-andamento`, `concluida`, `cancelada`
Pode ser automático (com base nos itens) ou manual via drag-and-drop.

---

## 4.10 ORDERS_SERVICE (OS)
OS vinculada a `record` ou `event`.

**Campos essenciais**
| Campo | Uso |
|---|---|
| `itemSrc`, `itemId` | Origem |
| `title`, `scope` | Cabeçalho |
| `internalPending/clientPending` | Pendências |
| `status` | `rascunho`, `enviada`, `assinada` |
| `sentAt/signedAt` | Rastreamento |
| `history` | Envio/assinatura |

**Regras**
- Ao criar OS, o item de origem é movido para `concluido`.

---

## 4.11 USERS / DASH_VIEWS / NOTIFICATIONS_LOG
- `USERS`: perfis (`admin`, `editor`, `confirmador`, `visualizador`)
- `DASH_VIEWS`: filtros salvos por usuário
- `NOTIFICATIONS_LOG`: histórico de e-mails enviados/falhos

# 5. Estado de UI e persistência

## 5.1 `state`
Mantém visão atual, filtros, calendário, edição de cronogramas, etc.

Campos relevantes:
- `view`, `calView`, `viewYear/month`, `viewWeekStart`, `viewDay`
- `filters`, `regFilters`, `dashFilters`
- `evSelectedDates`, `evStatus`, `evEditingId`
- `croPreview`, `croTplItems`, `croDraftScheduleId`
- `tplEditing`, `tplPickerMonth/year`
- `osDraft`, `osEditingId`, `osContext`

## 5.2 Persistência
- Chave: `atelier_agenda_v2`
- `persist()` foi **estendido várias vezes** (V2/V3/V4/V5) para incluir novas entidades sem quebrar o legado.
- `loadPersisted()` também é encadeado para carregar versões antigas.

## 5.3 Integridade
`validateDataIntegrity()` detecta órfãos (cards, cronogramas, eventos, registros e OS).
A UI oferece botão **Verificar integridade** com correção automática.

# 6. Interface (views e modais)

**Views principais**
- Dashboard
- Agenda completa
- Cronogramas
- Registros (lista e Kanban)
- Cadastros

**Modais principais**
- Evento
- Agenda detalhada
- Cronograma (V1 e V2)
- Registro
- Reagendamento
- Template
- Configuração de item (hub)
- Ordem de Serviço
- Log de notificações

# 7. Fluxos principais e lógica de negócio

## 7.1 Agenda (eventos)
1. Usuário abre modal de evento.
2. Seleciona consultor, empresa, tipo, datas.
3. Pode selecionar múltiplos dias com mini-calendário.
4. Conflitos são detectados (`findConflicts`) e exibidos.
5. Recorrência semanal/quinzenal/mensal cria até 4 ocorrências extras.
6. Eventos `cancelado`/`reagendado` só aparecem se filtrados.

**Motivação**: a agenda é o centro operacional e precisa destacar conflitos, capacidade e disponibilidade real.

---

## 7.2 Cronograma (builder simples)
- Usa disponibilidade do consultor (`freeDays`, `blockedDates`) para sugerir datas.
- Permite marcar dias e gerar eventos provisórios.
- Pode gerar registros automáticos de treinamento se `isTraining` ativo.

---

## 7.3 Templates V2 + Hub de Configuração
- Template agrupa **treinamentos e tarefas**.
- Cada item pode ter dias sugeridos.
- Hub permite:
  - configurar itens em sequência,
  - marcar “pulado”,
  - distribuir datas livres,
  - salvar rascunho ou enviar para aprovação.

**Regras**
- Treinamento precisa de data e horário para envio ao cliente.
- Tarefa pode ficar “aguardando agendar”.

---

## 7.4 Confirmação com cliente
- Confirmação gera **records** automaticamente.
- Status inicial dos novos registros:
  - `em-andamento` (itens com data)
  - `pendente` (itens sem data)
- Card do cliente vai para `em-andamento` automaticamente.

---

## 7.5 Registros
- **Atendimento**: ao concluir, sistema corrige para `atendido` (OS é que conclui).
- **Treinamento**: checklist interativo; incompleto ao concluir → gera tarefa pendente.
- **Tarefa**: pode ser vinculada a um atendimento, movendo status para `em-atendimento`.

---

## 7.6 Kanban por cliente
- Cards são criados automaticamente quando cronograma é confirmado.
- Drag & drop altera status manualmente (marca `statusManual`).
- Itens podem ser enviados para **Pendências**, sem apagar o registro.

---

## 7.7 Ordem de Serviço (OS)
- Pode ser criada a partir de registros/eventos.
- Pré-preenche pendências:
  - Internas: checklist não concluído do treinamento.
  - Cliente: tarefas abertas do cliente.
- Geração de PDF via `html2pdf`.
- Envio por e-mail via API (SMTP), com fallback para `mailto:`.
- Envio por WhatsApp via `wa.me`.
- Pode ser marcada como **assinada**.

---

## 7.8 Notificações automáticas (e-mail)
Fluxos:
1. Treinamento criado → notificar consultor.
2. Cronograma enviado → notificar cliente.
3. Empresa atribuída → notificar consultor.
4. Reagendamento → notificar cliente.

Todos os envios são registrados em `NOTIFICATIONS_LOG`.

---

## 7.9 Reagendamento
- Cancela evento original (motivo obrigatório).
- Cria novo evento com vínculo (`reagendadoDe`).
- Pode reaproveitar datas do cronograma.
- Pode enviar e-mail automático ao cliente.

# 8. Integrações e API (serverless)

## Endpoint `/api/send-os-email`
**Métodos**
- `GET`: health check (retorna se SMTP está configurado).
- `POST`: envia e-mail via SMTP.
- `OPTIONS`: CORS.

**Validações**
- `to`, `subject`, `html|text`, formato de e-mail.
- Payload máximo ~9MB.
- Rate limit simples: 20 req/min/IP.

**Env vars necessárias**
`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_FROM_NAME`, `SMTP_BCC`.

**Timeouts**
- Connection: 10s
- Socket: 15s
Limite de execução da function: **15s** (ver `vercel.json`).

# 9. Padrões técnicos e decisões

- **Single-file SPA**: facilita deploy e manutenção sem build.
- **Estado global (`state`)**: simplifica controle sem framework.
- **Renderização manual**: functions `renderX` atualizam DOM.
- **Monkey-patching**: módulos V2/V3/V4 estendem funções sem reescrever o fluxo original.
- **LocalStorage como fonte de verdade**: ideal para uso interno e offline, sem backend.
- **Auditoria via `history`**: rastreia mudanças importantes.

# 10. Validações e comportamentos críticos

- **Conflitos de agenda**: detectados por sobreposição de horários.
- **Treinamentos** exigem data/hora para aprovação do cronograma.
- **Atendimento concluído** é corrigido para `atendido`.
- **Cronogramas confirmados** são bloqueados para edição.
- **OS criada** move item de origem para `concluido`.
- **Pendências** podem remover itens das abas normais e sinalizar o card.

# 11. Limitações, riscos e pontos de melhoria

**Limitações atuais**
1. Dados ficam só no `localStorage` (sem sincronização multiusuário).
2. Rate limit SMTP é em memória (por instância), não global.
3. Sem autenticação real; perfis são apenas locais.
4. PDFs são gerados no browser; dependem de CDN disponível.
5. E-mails de cronograma indicam PDF anexado, mas o envio atual **não anexa** PDF.

**Melhorias recomendadas**
1. Backend persistente (Postgres/Vercel KV) para uso multiusuário.
2. Autenticação real + controle de acesso no backend.
3. Substituir fallback `mailto` por fila de reenvio.
4. Anexar PDF do cronograma no envio ao cliente.
5. Observabilidade: logs centralizados (Sentry/Datadog).
6. Exportações e backups automáticos do localStorage.
7. Melhorar validação de e-mail/telefone no frontend.

# 12. Como recriar o projeto do zero

1. Crie um `index.html` contendo:
   - Layout completo, estilos e JS (a aplicação inteira).
2. Crie a função `api/send-os-email.js` com `nodemailer`.
3. Configure `vercel.json` para headers e `maxDuration`.
4. Crie `.env.example` com variáveis SMTP.
5. Suba no Vercel e configure variáveis de ambiente.
6. Rode com `vercel dev` para ambiente local.

