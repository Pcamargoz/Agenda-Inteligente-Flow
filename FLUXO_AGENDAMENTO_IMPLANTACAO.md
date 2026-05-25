# Fluxo de Uso — Agendamento e Implantação

Documento resumido descrevendo o fluxo de uso para agendamento e implantação.

**Visão Geral**
- Objetivo: registrar o passo a passo desde o cadastro do consultor e da empresa, criação de templates e cronogramas, até a execução dos treinamentos e geração de Ordens de Serviço (OS).
- Escopo: telas de `Cadastros`, `Templates`, `Atend. / Treino / Tarefas`, `Cronogramas`, e `Atendimentos`.

**Papéis principais**
- Coordenador de Atendimento (ex.: Rafaela): cadastra consultores e empresas; cria cronogramas/provisiona templates.
- Consultor: recebe cronogramas, executa treinamentos, registra horas, gera OS.
- Cliente: recebe cronograma para aprovação e valida agenda.

**Status importantes**
- Provisório: cronograma criado e enviado para aprovação do cliente.
- Aguardando cliente: esperando validação do cliente.
- Em andamento: cronograma aprovado; treinamentos com status "em andamento".
- Concluído / Cancelado: estados finais conforme execução.

**Resumo do fluxo (passos principais)**
1. Cadastro do consultor
   - `Configuração → Cadastros → Consultores`.
   - Campos principais: Nome, Iniciais, Cargo/Função, Especialidade, E‑mail, Telefone, Jornada (entrada/saída/almoco), e disponibilidade por dias da semana.

2. Cadastro da empresa
   - `Configuração → Cadastros → Empresas` (+Novo empresa).
   - Campos: Razão Social, Nome Fantasia, CNPJ, Responsável, Contato (email), Consultor Padrão, Tipo de agenda, Projeto associado.

3. Templates (opcional)
   - Criar templates compostos com treinamentos e tarefas.
   - Cada item tem duração, unidade, horário sugerido, recursos, descrição e checklist de tarefas.

4. Inserir cliente no Kanban
   - `Atend. / Treino / Tarefas` → `+ Novo cliente` no Kanban (se necessário).

5. Criar cronograma
   - Em `Cronogramas por empresa` → `Novo cronograma` ou usar `Usar templates`.
   - Selecionar período, empresa e consultor; aplicar template(s) ou sugerir dias livres.
   - Editar data/hora/dia de cada item; validação visual: verde = ok, vermelho = divergência.

6. Envio para aprovação
   - Ao finalizar, gerar anexos (PDF e Excel) e enviar por e‑mail/SMS ao cliente e opcionalmente ao consultor.
   - Enquanto não aprovado, itens ficam com status `Provisório`.

7. Aprovação do cliente
   - Cliente confirma (link no e‑mail ou via interface) → sistema notifica o consultor.
   - Status muda para `Em andamento` e o cronograma fica bloqueado para edição dos campos validados.

8. Acompanhamento e execução
   - Na aba `Atendimentos` é possível acompanhar o card do cliente, ver treinamentos, marcar como realizado/não realizado, reagendar, cancelar e adicionar pendências.
   - Dentro de um treinamento é possível marcar tarefas como `Pendente` (ex.: treinamento de vendas concluído, mas falta criar modelo de pedido de venda).

9. Gerar Ordem de Serviço (OS)
   - A partir do treinamento/atendimento: botão `Gerar OS` gera registro de horas e cria a OS.
   - OS inclui título, escopo/descrição, consultor responsável, participantes, pendências internas e pendências do cliente.

10. Finalizar OS / Exportar
   - Gerar PDF da OS (contendo horas de cada treinamento) e enviar por e‑mail ou WhatsApp.

**Vinculação de horas, dias e relações entre entidades**
- Tudo no sistema é rastreável por data e horas; a contabilização de horas é a base para faturamento, relatório e banco de horas.
- Regras de vinculação principais:
   - Um `Treinamento` está sempre vinculado a uma `Empresa` (cliente) e a um `Consultor` responsável; suas horas compõem o banco de horas do cliente e do consultor.
   - Uma `Tarefa` normalmente está vinculada a um `Treinamento` (checklist do treinamento). Tarefas também podem existir como itens independentes, mas quando vinculadas elas herdam contexto e regras de contabilização do treinamento pai.
   - Um `Atendimento` pode ser:
      - Vinculado a um `Treinamento` para concluir uma tarefa relacionada; ou
      - Um atendimento avulso (não associado a nenhum treinamento) — ainda assim, suas horas devem ser registradas e afetar o banco de horas do cliente e do consultor.
   - Ao gerar uma `Ordem de Serviço (OS)`, o usuário seleciona quais tarefas/atendimentos serão contabilizados dentro daquela OS além do próprio treinamento; esses itens são lançados com suas horas e responsáveis.

- Consequências práticas:
   - Relatórios e extratos de horas por cliente e por consultor agregam horas de treinamentos, tarefas vinculadas e atendimentos avulsos.
   - Alterações de data/hora em treinamentos devem atualizar a contabilização de horas e, quando aplicável, sincronizar com OS/relatórios.
   - Pendências registradas em um treinamento devem ser visíveis na OS e na fila de pendências do cliente para garantir rastreabilidade.

**Boas práticas e observações**
- Use templates para acelerar criação de cronogramas repetitivos.
- Sempre conferir disponibilidade do consultor antes de salvar cronograma (sugestão automática de dias livres disponível).
- Ao confirmar com o cliente, a operação é atômica: treinamentos e tarefas são criados e registrados — se falhar, nada é gravado.
- Pendências devem ser documentadas na OS para rastreabilidade.

**Próximos passos sugeridos**
- Revisar esta documentação junto com a equipe (coordenador, consultores) e ajustar campos obrigatórios se necessário.
- Adicionar exemplos de e‑mail enviados e anexos gerados (PDF/Excel) à documentação.

---
Arquivo gerado automaticamente a partir do walkthrough interativo (imagens e telas fornecidas pelo usuário).

**Documentação técnica detalhada (para equipe de desenvolvimento)**

1) Objetivo
- Fornecer informações técnicas suficientes para que a equipe de desenvolvimento implemente ou melhore telas e comportamentos do módulo de agendamento e implantação.

2) Entidades e campos essenciais
- `User` (interno)
   - id, name, email, role (admin, coordinator, consultant), companyId
- `Consultor`
   - id, userId, name, initials, role, specialty, email, phone, workDay {start, end, lunchMinutes}, availability: [Mon..Sun] booleans
- `Empresa` (Cliente)
   - id, name, tradeName, cnpj, contactEmail, responsible, defaultConsultantId, projectName, typeOfSchedule
- `Template`
   - id, name, description, items: [TemplateItem], active
- `TemplateItem`
   - id, templateId, type (training|task), title, duration, durationUnit, suggestedTimes, resources, checklist: [taskTemplates]
- `Cronograma`
   - id, companyId, consultantId, period {start,end}, status (draft|provisioned|sent|awaiting_client|confirmed|cancelled), items: [CronogramaItem], createdBy, createdAt
- `CronogramaItem`
   - id, cronogramaId, templateItemId?, type (training|task), title, date, startTime, endTime, status (provisional|scheduled|in_progress|done|cancelled), assignedTo, linkedTasks: [taskId]
- `Atendimento` / `Training` (runtime record)
   - id, companyId, cronogramaItemId, type, date, startTime, endTime, consultantId, participants, status
- `Tarefa`
   - id, title, description, trainingId?, cronogramaItemId?, assignedTo, status (open|pending|done|cancelled), dueDate
- `OS` (Ordem de Serviço)
   - id, title, scope, issueDate, consultantId, startDateTime, endDateTime, participants, internalPendencies, clientPendencies, linkedItems: [trainingId|taskId|attendanceId], attachments
- `Notification` (registro de envios)
   - id, type (cronograma_sent|cronograma_confirmed|os_generated), to, via (email|sms|whatsapp), payload, sentAt, status

3) Relacionamentos chave
- Cronograma → CronogramaItem(s) → TemplateItem? → Tarefa(s)
- Treinamento (CronogramaItem type=training) possui checklist de Tarefas; Tarefa pode gerar/necessitar de Atendimento para conclusão.
- OS vincula Treinamento/Tarefa/Atendimento e registra horas para consultor e cliente.

4) Fluxos de tela / interações (detalhado)
- Cadastro Consultor (Configurações)
   - Validações: `email` único, `inicial` única por empresa opcionalmente, jornada válida (start < end), lunchMinutes >=0.
   - UI: campos + calendário de disponibilidade; salvar ativa/atualiza `Consultor`.

- Cadastro Empresa
   - Campos obrigatórios: name, cnpj (formato), contactEmail.
   - Escolher `Consultor Padrão` (dropdown com consultores ativos), `Tipo de agenda` (enum), `Projeto`.

- Criação de Template
   - Permitir multi‑item; cada item pode ter checklist (tarefas internas) e marcações `data/hora obrigatórias`.

- Criação de Cronograma (builder)
   - Selecionar período, empresa, consultor.
   - Ações: `Sugerir dias livres` (calcula dias baseados na disponibilidade do consultor e bloqueios já existentes), `Usar templates` (mescla templateItems no preview), `Adicionar ao cronograma`.
   - Preview: lista de dias com controles de hora; validações em tempo real:
      - Overlap: sinalizar conflito com outros eventos do consultor → mostrar erro/vermelho.
      - Fora da jornada do consultor → sinalizar (vermelho).
      - Tudo ok → verde.
   - Botão `Salvar rascunho` ou `Enviar para aprovação do cliente` (gera PDFs/Excel e cria Notification).

- Envio e confirmação
   - `Enviar` cria Notification: anexa PDF e Excel. Link público opcional para visualização.
   - Confirmação do cliente: quando cliente clica no link ou confirma via interface, backend executa operação atômica:
      - Transação: para cada CronogramaItem com data/hora definidos, criar `Atendimento`/`Training` registros e atualizar status para `scheduled`/`in_progress` conforme regras.
      - Se qualquer passo falhar, rollback e notificar erro.

5) API proposta (exemplos)
- POST /api/consultants → create consultor (body: consultor data)
- POST /api/companies → create empresa
- GET /api/templates
- POST /api/cronograms → criar cronograma provisório (body: companyId, consultantId, period, items[])
- PUT /api/cronograms/:id/preview → aplicar template / ajustar itens
- POST /api/cronograms/:id/send → gerar anexos, criar Notification, status => sent
- POST /api/cronograms/:id/confirm → confirmar cronograma (executa operação atômica e cria atendimentos)
- POST /api/trainings/:id/generate-os → cria OS vinculada
- GET /api/companies/:id/attendance‑summary → extrato de horas por cliente

Exemplo payload (criar cronograma):
{
   "companyId": "cmp_123",
   "consultantId": "c_456",
   "period": {"start":"2026-06-01","end":"2026-06-30"},
   "items": [
      {"templateItemId":"t_1","type":"training","title":"Onboarding","date":"2026-06-01","startTime":"11:30","endTime":"12:30"}
   ]
}

6) Regras de negócio críticas
- Contabilização de horas: sempre armazenar start/end em UTC + timezone do cliente; duração calculada em minutos.
- Banco de horas: agregado por `companyId` e por `consultantId`. Inserções: treinamentos + tarefas vinculadas + atendimentos avulsos.
- Bloqueios: evitar double‑booking por `consultantId` e por `room/resource` se aplicável.
- Limpeza/edição: cronograma provisionado permite edição; após confirmação (atomic) campos validados ficam bloqueados.

7) Estados e transições (simplificado)
- Cronograma: draft → provisioned → sent → awaiting_client → confirmed | cancelled
- CronogramaItem: provisional → scheduled → in_progress → done | cancelled
- Training/Tarefa: open → pending → done | cancelled

8) Notificações / e‑mails
- Template de e‑mail de envio de cronograma: subject, body com link, anexos PDF/Excel.
- Notificação para consultor ao confirmar cronograma e ao gerar OS.
- Registrar `Notification` com status e tentar re‑envio em caso de falha.

9) Concurrency e atomicidade
- Use transações (DB) ou filas + compensações para confirmar cronograma. Garantir idempotência para endpoint `confirm` (retry safe).

10) Validações e checks automatizados (lista de testes)
- Criar integração/end‑to‑end tests para:
   - Evitar double booking (simular dois cronogramas concorrentes)
   - Confirmar atomicidade (simular falha parcial durante confirmação)
   - Geração de anexos e conteúdo do PDF/Excel (incluir horas corretas)
   - Fluxo de reenvio e notificação para consultor

11) Observações para UI/UX
- Mostrar cor de validação por item (verde/vermelho) e tooltip explicando o erro.
- No builder, permitir operações em massa: aplicar mesmo horário para todos treinamentos, distribuir em dias livres.
- Histórico: registrar todas alterações (quem, quando, campo alterado) para auditoria.

12) Checklist de entrega para desenvolvimento
- API endpoints implementados com contratos.
- Banco de dados: migrations para entidades acima.
- Worker para gerar PDFs/Excel e enviar notificações assíncronas.
- Jobs para recalcular bancos de horas quando datas/horas são alteradas.
- Testes unitários e E2E cobrindo os casos críticos.

---
Se quiser, gero um arquivo separado `FLUXO_TECNICO_API.md` com os exemplos completos de payloads, contratos OpenAPI e mock responses.
