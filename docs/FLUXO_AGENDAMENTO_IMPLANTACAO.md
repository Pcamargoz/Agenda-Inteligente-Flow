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
   - A criação de cronogramas agora é iniciada a partir do `ClientCard` no Kanban (`Atend. / Treino / Tarefas`) → ação `+ Novo cronograma` no card. A criação direta na tela `Cronogramas por empresa` não inicia mais o processo de criação.
   - Após iniciar no card, selecionar período, empresa e consultor; aplicar template(s) ou usar `Sugerir dias livres`.
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

**Guia operacional detalhado — fluxo para consultores**

Objetivo: descrever passo a passo as ações operacionais que o consultor executa na plataforma para criar cronogramas, gerenciar treinamentos, registrar atendimentos e gerar Ordens de Serviço (OS), sem aspectos técnicos de implementação.

1) Acesso e pré‑requisitos
- Login com usuário válido (perfil `consultor` ou `admin`/`coordenador`).
- O consultor deve estar cadastrado no sistema; a empresa/cliente deve existir no cadastro (coordenador pode criar se necessário).

2) Terminologia rápida
- Cronograma: sequência de treinamentos/tarefas planejadas para um cliente.
- Template: modelo reutilizável de treinamentos e tarefas.
- Item: treinamento ou tarefa dentro do cronograma.
- OS (Ordem de Serviço): registro formal do atendimento/treinamento realizado com horas e pendências.

3) Fluxo operacional (passo a passo)

- 3.1 Abrir Kanban de Atendimentos
   - Acesse `Atend. / Treino / Tarefas` → visualização `Kanban por cliente`.
   - Verifique se o cliente já tem um card. Caso não, clique `+ Novo cliente` e selecione a empresa para adicioná‑la ao Kanban.

-- 3.2 Criar cronograma para o cliente
   - Abra o `ClientCard` do cliente no Kanban (`Atend. / Treino / Tarefas`) e clique `+ Novo cronograma` no card para iniciar a criação.
   - O sistema abrirá o builder de cronograma com a empresa/consultor (auto‑preenchido quando aplicável).
   - Escolha o período (semana, mês, personalizado) e use `Usar templates` ou `Sugerir dias livres` para preencher os itens.

- 3.3 Configurar itens do cronograma
   - No preview, clique em cada item para abrir a tela de configuração.
   - Defina: data, hora de início e fim, modalidade (presencial/online), local/link, instrutor, participantes e recursos.
   - Adicione ou confirme tarefas vinculadas ao treinamento (checklist).
   - Verificação visual: itens válidos aparecem em verde; itens com conflito/erro aparecem em vermelho (hover mostra motivo).

- 3.4 Salvar e enviar para aprovação
   - Você pode `Salvar rascunho` para voltar depois ou `Enviar para aprovação do cliente`.
   - Ao enviar, o sistema gera anexos (PDF + Excel) e pergunta o destinatário (cliente e opcionalmente o consultor).
   - Após envio, o status do cronograma muda para `Provisório` / `Aguardando cliente`.

- 3.5 Aprovação do cliente
   - O cliente recebe o e‑mail com link para revisar e aprovar. Quando aprovado, o consultor recebe notificação por e‑mail.
   - Alternativamente, se o cliente confirmar verbalmente, o consultor pode clicar `Confirmar com cliente` na interface — isso também notifica o sistema e muda status para `Em andamento`.

- 3.6 Execução dos treinamentos e atendimentos
   - Em `Atendimentos` expanda o card do cliente para ver a lista de treinamentos.
   - Para cada item: marque `Realizado` ou `Não realizado` após a sessão; se necessário, clique `Reagendar` para alterar data/hora ou `Cancelar` para encerrar.
   - Em cada treinamento você pode:
      - Adicionar/editar tarefas do checklist.
      - Marcar tarefas como `Concluídas`, `Pendente` (se algo ficou faltando) ou `Cancelar`.
      - Registrar observações e anexar arquivos.

- 3.7 Gerar Ordem de Serviço (OS)
   - Ao lado do treinamento/tarefa há o botão `Gerar OS`.
   - Preencha a OS: título, escopo/descrição, participantes, pendências internas e pendências do cliente.
   - Escolha quais tarefas/atendimentos serão contabilizados nesta OS (além do próprio treinamento), e confirme horas efetivas.
   - Gere o PDF e envie por e‑mail ou WhatsApp ao cliente e ao consultor.

- 3.8 Pós‑execução e relatórios
   - OS gravada alimenta o extrato de horas do cliente e do consultor.
   - É possível exportar relatórios (PDF, Excel/CSV) por cliente, período e consultor.

4) Regras operacionais e boas práticas
- Sempre verificar conflitos (double booking) no preview antes de salvar. Use a opção `Sugerir dias livres` se estiver em dúvida.
- Marque tarefas pendentes claramente; vincule pendências à OS para rastreabilidade.
- Se ocorrer alteração após aprovação, documente no histórico de alterações e notifique o cliente quando necessário.
- Ao gerar OS, confirme participantes e horas para evitar retrabalho.

5) Mapeamento de status visuais
- Verde: item validado (data/hora dentro da jornada, sem conflito).
- Vermelho: conflito ou erro (sobreposição, fora da jornada, horário inválido).
- Laranja / Amarelo: provisório / aguardando aprovação.
- Azul: confirmado / em andamento.

6) Cenários comuns e solução rápida
- Cliente pede reagendamento de um item:
   - Na aba `Atendimentos`, selecione o treinamento → clique `Reagendar` → escolha nova data/hora → salve e envie notificação ao cliente.
- Falta de recursos (sala/link): adicione observação no item e registre a pendência; mover para OS se a pendência impactar execução.
- Tarefa não concluída após treinamento: marque como `Pendente` e crie um atendimento avulso vinculado para finalizar a tarefa; inclua a pendência na OS.

7) Checklist rápido antes de enviar o cronograma
- Confirmar consultor e participantes.
- Verificar disponibilidade do consultor (sem conflitos).
- Conferir horários e fusos (se aplicável).
- Garantir que tarefas essenciais estejam vinculadas e anotadas como pendências se necessário.

---
Atualizei o documento para focar no fluxo operacional do consultor. Se quiser, posso:
- Inserir este resumo no `DOCS.md` com um link direto.
- Gerar PDF pronto para imprimir e compartilhar com a equipe.

---

## Anexos — Fluxos operacionais (conteúdo mesclado)

Seguem os fluxos operacionais derivados dos documentos auxiliares (criar empresa / criar cronograma / tarefas e atendimentos). Estes trechos foram mesclados aqui para centralizar o material de operação.

### Fluxo: Criar empresa e adicionar card no Kanban

1. Registrar empresa (coordenador)
- Acesse `Configuração → Cadastros → Empresas` → `+ Nova empresa`.
- Preencha: Razão Social, Nome Fantasia, CNPJ, Responsável, Contato (e‑mail), Consultor Padrão, Tipo de agenda, Projeto associado.
- Salvar: cria registro da `Empresa` com `id`.

2. Adicionar empresa ao Kanban de Atendimentos
- Acesse `Atend. / Treino / Tarefas` → `Kanban por cliente`.
- Clique `+ Novo cliente` → busca por empresa cadastrada → selecione e confirme.
 - Sistema cria `ClientCard` no Kanban com resumo; o botão `+ Novo cronograma` fica disponível no card para iniciar a criação do cronograma.

3. Observações práticas
- Se a empresa ainda não tiver um `Consultor Padrão`, sugerir seleção obrigatória ou exibir aviso.
- Card criado já mostra resumo: total de itens, treinamentos e pendências (inicialmente zeros).

### Processo detalhado para criar e editar cronograma

1. Iniciar novo cronograma
- Abrir o `ClientCard` do cliente no Kanban e clicar `+ Novo cronograma` no card para iniciar a criação.
- Selecionar (se necessário): Empresa, Consultor, Período (start/end).

2. Preencher usando templates ou manualmente
- `Usar templates`: selecionar template(s) → `Adicionar ao cronograma` → os itens aparecem no preview.
- `Sugerir dias livres`: o sistema sugere datas baseadas na disponibilidade do consultor.

3. Configurar cada item (CronogramaItem)
- Abrir o editor do item:
   - Campos: Nome do treinamento, Modalidade, Local/Link, Instrutor, Recursos, Observações.
   - Data/hora (obrigatórias quando marcado): selecionar data e hora de início/fim.
   - Checklist: adicionar tarefas vinculadas ao treinamento.
   - Recorrência: opcional (ex.: toda segunda por 4 semanas).

4. Validações em tempo real
- Conflito com outros eventos do consultor → mostrar validação vermelha.
- Fora da jornada do consultor → aviso e bloqueio até corrigir.
- Itens sem data/hora → não permitem `Enviar para aprovação`.

5. Ações em massa
- `Marcar todos livres` / `Distribuir nos dias livres` / `Mesmo horário p/ treinamentos` — aplicar alterações em lote para agilizar.

6. Salvar / Enviar
- `Salvar rascunho`: persiste o cronograma no backend como rascunho (status draft).
- `Salvar e enviar para aprovação do cliente`: gera anexos (PDF/Excel), cria notification e marca cronograma como `sent`.

7. Editar cronograma provisionado
- Antes da confirmação do cliente: qualquer item pode ser editado; histórico de alterações deve ser mantido.
- Após confirmação: campos validados ficam bloqueados; para alterar é necessário reabrir processo (nova versão ou pedir reaprovação).

### Como funcionam Tarefas, Atendimentos e Treinamentos

1. Treinamento
- Definição: item principal planejado no cronograma (geralmente parte de um template).
- Ações possíveis: Confirmar data/hora, marcar `Realizado`/`Não realizado`, reagendar, cancelar, abrir checklist de tarefas.

2. Tarefas (checklist)
- São subtarefas vinculadas a um treinamento.
- Usos: validar passos (ex.: validar acesso do usuário, configurar parâmetros), coletar pendências.
- Status: `Open` → `Pending` → `Done` / `Cancelled`.
- Uma tarefa pode gerar um `Atendimento` para conclusão (se for necessária interação com cliente no campo).

3. Atendimento
- Definição: registro de execução (runtime) de um treinamento ou ação avulsa.
- Pode ser:
   - Vinculado a um treinamento (para concluir tarefas)
   - Avulso (não vinculado) — ex.: atendimento pontual do cliente
- Ações: gerar OS, registrar horas, adicionar participantes, anexar evidências.

4. Pendências e rastreabilidade
- Pendências internas: anotadas pelo consultor (ex.: falta documento) — visíveis na OS.
- Pendências do cliente: geram follow‑ups e podem abrir atendimentos avulsos.

5. Boas práticas de uso
- Sempre marcar tarefas concluídas imediatamente após verificação.
- Se tarefa ficar pendente, criar atendimento vinculado e registrar na OS para contabilização.
- Use observações e anexos para evidências (fotos, logs, arquivos de configuração).

## Endpoints (agrupados por fluxo operacional)

Nota: estes endpoints são sugestões/contratos para quando o MVP evoluir para um backend REST/HTTP. Inclua autenticação (JWT/oauth) e validações conforme roles.

1) Fluxo: Criar Empresa
- POST /api/companies
   - Cria novo cliente/empresa. Body: { name, tradeName, cnpj, contactEmail, responsible, defaultConsultantId, typeOfSchedule, projectName }
   - Retorna: { companyId }
- GET /api/companies/:companyId
   - Retorna dados da empresa.

2) Fluxo: Adicionar empresa ao Kanban / criar card
- POST /api/companies/:companyId/kanban
   - Adiciona empresa ao Kanban (cria card). Body: { addedBy }
   - Retorna: { cardId }

3) Fluxo: Criar Cronograma
- POST /api/cronograms
   - Cria cronograma provisório. Body: { companyId, consultantId, period: {start,end}, items: [ { templateItemId?, type, title, date?, startTime?, endTime?, resources? } ] }
   - Retorna: { cronogramId, preview: [...] }
- PUT /api/cronograms/:id/items/:itemId
   - Atualiza item do cronograma (data/hora/recorrência/checklist).
- POST /api/cronograms/:id/preview-apply-template
   - Aplica template(s) e retorna preview com sugestões de datas.
- POST /api/cronograms/:id/send
   - Gera anexos (PDF/Excel), cria notification e marca cronograma como `sent`.

4) Fluxo: Confirmar Cronograma (cliente)
- POST /api/cronograms/:id/confirm
   - Endpoint idempotente para confirmação. Executa operação atômica que cria `attendances`/`trainings` para itens com data/hora definidos e atualiza status.
   - Retorna relatório de resultados e quaisquer falhas.

5) Fluxo: Criar/Editar Treinamento (Atendimento runtime)
- POST /api/attendances
   - Cria um atendimento/treinamento (pode ser manual ou criado automaticamente na confirmação). Body: { cronogramId?, cronogramItemId?, companyId, consultantId, date, startTime, endTime, participants }
- PUT /api/attendances/:id
   - Atualiza status (realizado, reagendado, cancelado), anotações e anexos.
- POST /api/attendances/:id/generate-os
   - Cria OS vinculada às horas e itens selecionados; retorna osId e PDF anexo.

6) Fluxo: Tarefas (checklist)
- POST /api/tasks
   - Cria tarefa (vinculada a training ou independente). Body: { title, description, trainingId?, cronogramItemId?, assignedTo }
- PUT /api/tasks/:id/status
   - Atualiza status (concluir, pendência, cancelar).

7) Fluxo: Ordens de Serviço (OS)
- POST /api/orders
   - Cria OS manualmente (ou via generate-os). Body: { title, scope, issueDate, consultantId, start, end, participants, internalPendencies, clientPendencies, linkedItems }
- GET /api/orders/:id/pdf
   - Retorna PDF pronto para envio.

8) Fluxo: Notificações / Envio
- POST /api/notifications/send
   - Envia notificação por email/sms/whatsapp. Body: { type, to, via, payload }
- GET /api/notifications/:id/status
   - Checa status de envio.

9) Relatórios e extratos
- GET /api/companies/:id/hours-summary?from=&to=
   - Retorna extrato consolidado de horas do cliente (treinamentos, tarefas, atendimentos) no período.
- GET /api/consultants/:id/hours-summary?from=&to=
   - Extrato por consultor.

Observações finais:
- Todos endpoints de criação/alteração devem validar conflitos de horário (overlap) quando relevante e retornar códigos de erro detalhados (ex.: 409 CONFLICT com payload explicando conflito).
- Endpoints de confirmação (`/confirm`, `/send`) devem ser idempotentes e transacionais.


