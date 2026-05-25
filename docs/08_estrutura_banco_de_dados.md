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
