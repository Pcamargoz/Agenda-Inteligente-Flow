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
