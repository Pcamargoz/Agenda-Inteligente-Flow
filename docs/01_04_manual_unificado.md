---
title: "Manual Unificado — Visual, Componentes, Lógicas e Fluxo"
author: "Auto-compiled"
date: "2026-05-26"
version: "1.0"
---

# Manual Unificado — Parte 1 a 4

Este manual reúne as Partes 1, 2, 3 e 4 existentes (`Visual e Estilos`, `Componentes utilizados`, `Lógicas e Validações`, `Fluxo de Código`) para facilitar a leitura e manter um único ponto de referência.

---

## Parte 1 — Visual e Estilos

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

Objetivo: descrever de forma não técnica o fluxo de execução esperado entre telas e entidades — serve como mapa para arquitetos e desenvolvedores entenderem o comportamento global.

1. Ações do usuário (front) que disparam fluxos
- Criação/edição de cronograma: iniciar a criação a partir do `ClientCard` (abrir o card → ação "Criar cronograma"); em seguida abrir o builder de cronograma para editar/preview → salvar rascunho (local/backend) ou enviar para aprovação.
- Enviar para aprovação → backend gera anexos, cria notificação e marca cronograma como `sent`.
- Cliente aprova → backend recebe confirmação → cria registros de atendimento e atualiza status para `confirmed`.
- Consultor executa treinamento → marca `Realizado` → pode gerar OS.

2. Fluxo de estados (cronograma)
- draft (iniciado) → provisioned (template aplicado) → sent (enviado para cliente) → awaiting_client (aguardando retorno) → confirmed (aprovado) → cancelled

3. Fluxo de execução (resumido)
- Usuário (via card) cria/edita cronograma → salva → envia
- Servidor: recebe envio → gera PDF/Excel (job assíncrono) → envia e‑mail/SMS → registra notification
- Cliente aprova (clicando no link ou por interface) → servidor processa confirmação (operação atômica) → cria atendimentos e tarefas vinculadas → notifica consultor
- Consultor realiza atendimentos → marca finalizações → caso necessário gera OS → horas são contabilizadas

---

## Detalhar processo — Criar e editar cronograma (resumo)

Resumo operacional extraído do guia completo `docs/DETALHAR_PROCESSO_CRONOGRAMA.md`.

- Abertura do builder: via `ClientCard` no Kanban (`+ Novo cronograma`) — não abrir a criação na tela geral de Cronogramas.
- Seleção inicial: Empresa, Consultor, Período (de/até); opções: `Sugerir dias livres`, `Usar templates`, `Cronogramas salvos`.
- Preview: lista de dias com indicadores; adicionar items do template ao cronograma e editar cada item (nome, modalidade, local, instrutor, recursos, observações, data/hora, recorrência).
- Validações: impedir envio se houver conflitos de horário ou campos obrigatórios faltando; barra de progresso mostra itens prontos/total.
- Ajustes em massa: aplicar mesmo horário, distribuir nos dias livres, configurar em sequência.
- Salvar/Enviar: `Salvar rascunho` ou `Enviar para aprovação do cliente` (gera anexos e notifica o cliente).
- Pós‑envio: edição limitada enquanto `Aguardando cliente`; após `Confirmado` o cronograma é bloqueado e alterações exigem re‑agendamento formal.

Para o fluxo passo a passo completo e telas, consulte: [FLUXO_AGENDAMENTO_IMPLANTACAO.md](FLUXO_AGENDAMENTO_IMPLANTACAO.md)


## Parte 5 — Estrutura de Banco de Dados

Objetivo: descrever o modelo de dados sugerido/atual para o MVP/POC e qual tecnologia de banco usar.

1. Tecnologia recomendada / usada
- MVP/POC: Firestore (NoSQL) é adequado por agilidade e escalabilidade; pode ser substituído por Postgres conforme necessidade de consultas complexas.

2. Coleções recomendadas (Firestore)
- `companies` — documentos com dados da empresa/cliente
  - campos: name, tradeName, cnpj, contactEmail, responsible, defaultConsultantId, projectName, typeOfSchedule, createdAt
- `consultants` — dados dos consultores
  - campos: userId, name, initials, role, specialty, email, phone, workDay {start, end, lunch}, availability {mon..sun}, active
- `templates` — templates de agendamento
  - campos: name, description, items: [{title,type,duration,durationUnit,resources,checklist}], active
- `cronograms` (ou `cronograms`) — cronogramas por empresa
  - campos: companyId, consultantId, period {start,end}, status, items: [ {templateItemId?, type, title, date, startTime, endTime, status, assignedTo, linkedTasks} ], createdBy, createdAt
- `attendances` — registros de execução (treinamentos/atendimentos), também chamados `trainings` em algumas telas
  - campos: cronogramId, cronogramItemId, companyId, consultantId, date, startTime, endTime, participants, status, notes
- `tasks` — tarefas independentes ou vinculadas (subcoleção possível em `attendances`)
  - campos: title, description, assignedTo, status, dueDate, linkedAttendanceId?, linkedCronogramItemId?
- `orders` — Ordens de Serviço (OS)
  - campos: title, scope, issueDate, consultantId, start, end, participants, internalPendencies, clientPendencies, linkedItems, attachments
- `notifications` — histórico de envios (email/sms)
  - fields: type, to, via, payload, sentAt, status

3. Observações de modelagem
- Subcoleções por `company` ou `cronogram` podem ajudar a limitar leituras quando listando itens por empresa.
- Indexes: criar índices compostos por `companyId` + `period` / `consultantId` + `date` para consultas por intervalo.
- Auditoria: manter `history` ou coleções de `changeLogs` para rastrear alterações (quem, quando, o quê).

4. Snapshot de dados (exemplo simplificado)
companies/{companyId}
  - name: "ACME Ltda"
  - contactEmail: "contato@acme.com"
consultants/{consultantId}
  - name: "Iago Rossan"
cronograms/{cronogramId}
  - companyId: "companyId"
  - items: [ { title: "Onboarding", date: "2026-06-01", startTime: "11:30", endTime: "12:30" } ]

5. Migração/Backup
- Exportar coleções críticas (companies, cronograms, attendances, orders) periodicamente.

---

## Parte 5.1 — Modelo NoSQL (Firestore) — resumo

O conteúdo acima descreve o modelo orientado a documentos (Firestore) recomendado para prototipagem/POC. Mantém coleções enxutas e subcoleções quando necessário para reduzir leituras.

---

## Parte 5.2 — Modelo Relacional (Postgres) — sugestão

Este anexo reúne a proposta do arquivo anteriormente separado `09_estrutura_banco_de_dados.md`. Apresenta um modelo relacional em Postgres para suportar cronogramas, dias/horas, atendimentos, treinamentos, tarefas, ordens de serviço e entidades relacionadas. Inclui DDL, índices, consultas comuns e um diagrama ER (Mermaid).

Terminologia
- Company (empresa/cliente)
- Consultant (consultor)
- Schedule / Cronogram (cronograma: planificação macro)
- ScheduleItem / CronogramItem (item do cronograma — data/hora, tipo, duração)

Exemplo de entidades (ER sketch)
```
COMPANIES {
  uuid id PK
  text name
  text cnpj
  text contact_email
  timestamptz created_at
}
CONSULTANTS {
  uuid id PK
  text name
  text email
  time work_start
  time work_end
}
CRONOGRAMS {
  uuid id PK
  uuid company_id FK
  uuid consultant_id FK
  text title
  text status
  date period_from
  date period_to
}
CRONOGRAM_ITEMS {
  uuid id PK
  uuid cronogram_id FK
  text title
  text item_type
  date date
  time start_time
  int duration_minutes
}
ATTENDANCES {
  uuid id PK
  uuid cronogram_item_id FK
  uuid cronogram_id FK
  uuid company_id FK
  uuid consultant_id FK
  date date
  time start_time
  time end_time
  text type
}
TASKS {
  uuid id PK
  uuid assigned_to FK
  uuid linked_attendance_id FK
  text title
  text status
}
ORDERS {
  uuid id PK
  uuid company_id FK
  uuid consultant_id FK
  date issue_date
  numeric total_hours
  boolean signed
}
NOTIFICATIONS {
  uuid id PK
  uuid order_id FK
  text type
  text via
  json payload
}

COMPANIES ||--o{ CRONOGRAMS : has
CONSULTANTS ||--o{ CRONOGRAMS : owns
CRONOGRAMS ||--o{ CRONOGRAM_ITEMS : contains
CRONOGRAM_ITEMS ||--o{ ATTENDANCES : spawns
COMPANIES ||--o{ ATTENDANCES : receives
CONSULTANTS ||--o{ ATTENDANCES : conducts
ATTENDANCES ||--o{ TASKS : generates
COMPANIES ||--o{ ORDERS : issues
CONSULTANTS ||--o{ ORDERS : author
ORDERS ||--o{ NOTIFICATIONS : notifies
```

DDL (exemplo simplificado)

```sql
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cnpj text,
  contact_email text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE consultants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  work_start time,
  work_end time,
  lunch_min int,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE cronograms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES consultants(id),
  title text,
  status text,
  period_from date,
  period_to date,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE cronogram_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cronogram_id uuid REFERENCES cronograms(id) ON DELETE CASCADE,
  title text,
  item_type text,
  date date,
  start_time time,
  duration_minutes int,
  linked_order_id uuid,
  status text
);

CREATE TABLE attendances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cronogram_id uuid REFERENCES cronograms(id),
  cronogram_item_id uuid REFERENCES cronogram_items(id),
  company_id uuid REFERENCES companies(id),
  consultant_id uuid REFERENCES consultants(id),
  date date,
  start_time time,
  end_time time,
  type text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES consultants(id),
  due_date date,
  status text,
  linked_attendance_id uuid REFERENCES attendances(id)
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  consultant_id uuid REFERENCES consultants(id),
  issue_date date,
  total_hours numeric,
  status text,
  signed boolean DEFAULT false
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text,
  target text,
  via text,
  payload jsonb,
  sent_at timestamptz,
  status text
);
```

Índices sugeridos
- cronograms(company_id, status)
- cronogram_items(cronogram_id, date, start_time)
- attendances(consultant_id, date)
- tasks(assigned_to, status)

Consultas comuns (exemplos)
- Gerar agenda do consultor entre datas:
```sql
SELECT ci.*
FROM cronogram_items ci
JOIN cronograms c ON ci.cronogram_id = c.id
WHERE c.consultant_id = $1 AND ci.date BETWEEN $2 AND $3
ORDER BY ci.date, ci.start_time;
```

- Listar atendimentos realizados por empresa:
```sql
SELECT a.* FROM attendances a WHERE a.company_id = $1 ORDER BY date DESC;
```

----------------------

Parte C — Recomendações operacionais

1) Timestamps e timezone
- Armazene `timestamptz` (UTC) e apresente no timezone do usuário no front-end.

2) Status e enums
- Use campos `status` com valores bem definidos (ex.: draft|sent|approved|locked) e documente-os.

3) Auditoria
- Mantenha `created_by`, `updated_by`, `created_at`, `updated_at` em tabelas/coleções críticas.
- Use `changeLogs` (coleção/tabela) para reconstituir histórico.

4) Attachments
- Armazene arquivos em object storage (S3/Blob/GCS) e guarde apenas URLs + metadata no DB.

5) Escalabilidade
- Firestore para leitura intensiva e alto crescimento sem joins.
- Postgres para queries analíticas, joins e integridade referencial.

6) Migração
- Para migrar Firestore → Postgres: exportar coleções, normalizar arrays em tabelas, criar FK e índices.

7) Backups
- Agende backups regulares (pg_dump / export Firestore). Documente restauração e testes periódicos.

----------------------

Exemplos JSON (Firestore)

companies/abc123
```json
{
  "name":"ACME Ltda",
  "contactEmail":"contato@acme.com",
  "defaultConsultantId":"cons_01",
  "createdAt": "2026-05-25T10:00:00Z"
}
```

cronograms/cron_001
```json
{
  "companyId":"abc123",
  "consultantId":"cons_01",
  "title":"Implantação Maio",
  "status":"approved",
  "period":{ "from":"2026-06-01","to":"2026-06-30" },
  "createdAt":"2026-05-20T12:00:00Z"
}
```

cronograms/cron_001/items/item_01
```json
{
  "title":"Onboarding",
  "type":"training",
  "date":"2026-06-01",
  "startTime":"11:30",
  "durationMinutes":60,
  "participants":[{"companyId":"abc123","name":"Cliente X"}]
}
```

----------------------

Observação final
- Este é um ponto de partida. Se preferir, gero uma versão ER diagram (Mermaid) e uma versão SQL completa com constraints e UDFs específicas (ex.: cálculo de horas). Quer que eu gere um diagrama Mermaid agora?


## Histórico
- Este manual foi gerado automaticamente juntando `docs/01_visual_e_estilos.md`, `docs/02_componentes_utilizados.md`, `docs/03_logicas_e_validacoes.md` e `docs/04_fluxo_codigo_geral.md`.
