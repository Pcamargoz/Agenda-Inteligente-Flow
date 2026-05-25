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
