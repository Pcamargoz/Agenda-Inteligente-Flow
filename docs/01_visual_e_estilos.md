# Parte 1 — Visual e Estilos

Objetivo: documentar a camada visual do MVP/POC para que a equipe de produto/designer/desenvolvimento saiba quais páginas existem, quais abas e o framework usado para estilos.

1. Páginas / Abas principais
- Dashboard (visão geral)
- Atendimentos / Treinamentos / Tarefas (Kanban por cliente e lista)
- Cronogramas por empresa (builder de cronograma)
- Cadastros → Consultores
- Cadastros → Empresas
- Templates de agendamento (listar, editar, duplicar)
- Painel do Consultor (visão individual)
-- Modal de Cadastro: Novo consultor, Nova empresa, Novo template, Nova OS

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
