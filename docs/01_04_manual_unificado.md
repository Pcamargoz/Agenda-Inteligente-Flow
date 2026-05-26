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


## Histórico
- Este manual foi gerado automaticamente juntando `docs/01_visual_e_estilos.md`, `docs/02_componentes_utilizados.md`, `docs/03_logicas_e_validacoes.md` e `docs/04_fluxo_codigo_geral.md`.
