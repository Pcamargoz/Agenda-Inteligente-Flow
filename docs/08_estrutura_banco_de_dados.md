# Parte 8 — Estrutura do Banco de Dados

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

## Parte 8.1 — Modelo NoSQL (Firestore) — resumo

O conteúdo acima descreve o modelo orientado a documentos (Firestore) recomendado para prototipagem/POC. Mantém coleções enxutas e subcoleções quando necessário para reduzir leituras.

---

## Parte 8.2 — Modelo Relacional (Postgres) — sugestão

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
