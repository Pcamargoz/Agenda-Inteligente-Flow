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
- Usuário (via card) cria/edita cronograma → salva → envia
- Servidor: recebe envio → gera PDF/Excel (job assíncrono) → envia e‑mail/SMS → registra notification
- Cliente aprova (clicando no link ou por interface) → servidor processa confirmação (operação atômica) → cria atendimentos e tarefas vinculadas → notifica consultor
- Consultor realiza atendimentos → marca finalizações → caso necessário gera OS → horas são contabilizadas
