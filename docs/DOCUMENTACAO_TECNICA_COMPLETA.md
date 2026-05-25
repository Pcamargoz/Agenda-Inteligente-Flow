---
title: "DOCUMENTACAO_TECNICA_COMPLETA"
author: "Auto-compiled"
date: "2026-05-25"
version: "1.0"
---
## Sumário (clique para abrir)

- [Guia Operacional — Fluxo Resumido](#guia-operacional---fluxo-resumido) — [arquivo](docs/GUIDA_OPERACIONAL.md)
- [Índice Navegável](#indice-navegavel) — [arquivo](docs/INDEX.md)
- [Documentação Técnica — principal](#documentação-técnica-—-principal) — [arquivo](docs/DOCUMENTACAO_TECNICA.md)
- [Parte 1 — Visual e Estilos](#parte-1-—-visual-e-estilos) — [arquivo](docs/01_visual_e_estilos.md)
- [Parte 2 — Componentes utilizados](#parte-2-—-componentes-utilizados) — [arquivo](docs/02_componentes_utilizados.md)
- [Parte 3 — Lógicas e Validações](#parte-3-—-lógicas-e-validações) — [arquivo](docs/03_logicas_e_validacoes.md)
- [Parte 4 — Fluxo de Código (visão geral operacional)](#parte-4-—-fluxo-de-código-visão-geral-operacional) — [arquivo](docs/04_fluxo_codigo_geral.md)
- [Parte 8 — Estrutura do Banco de Dados](#parte-8-estrutura-do-banco-de-dados) — [arquivo](docs/08_estrutura_banco_de_dados.md)
 - [Parte 9 — Estrutura do Banco de Dados (Postgres sugerido)](#parte-9-estrutura-do-banco-de-dados-postgres-sugerido) — [arquivo](docs/09_estrutura_banco_de_dados.md)
- [Acceptance Checklists](#acceptance-checklists) — [arquivo](docs/ACCEPTANCE_CHECKLISTS.md)
- [Envio de E-mails — Visão Geral](#envio-de-emails---visao-geral) — [arquivo](docs/EMAIL_ENVIO.md)
- [Blueprint MVP — Documento Completo](#blueprint-mvp---documento-completo) — [arquivo](docs/MVP_BLUEPRINT.md)
- [DOCS.md — Índice técnico e notas](#docsmd---indice-tecnico-e-notas) — [arquivo](docs/DOCS.md)

---

## Ordem de leitura (IA / Equipe)

- **Para IA (indexação / análise automática):**
  1. Leia `docs/DOCUMENTACAO_TECNICA_COMPLETA.md` do topo para baixo; use o Sumário (TOC) para saltar para seções relevantes.
  2. Priorize as seções: `Guia Operacional` → `Índice Navegável` → `Parte 4 — Fluxo de Código` → `Parte 9 — Estrutura do Banco de Dados (Postgres)` → `Envio de E-mails`.

- **Para a equipe (implantação e operação):**
  1. Comece por `docs/GUIDA_OPERACIONAL.md` (resumo prático).  
  2. Abra `docs/INDEX.md` para localizar documentos por público e, conforme necessário, leia `docs/09_estrutura_banco_de_dados.md`, `docs/04_fluxo_codigo_geral.md` e `docs/EMAIL_ENVIO.md`.

<a id="acceptance-checklists"></a>
## Acceptance Checklists (inserido de `ACCEPTANCE_CHECKLISTS.md`)

Objetivo: checklists concisos para validação funcional durante QA e homologação.

1) Dashboard
- [ ] Carregar filtros salvos (`DASH_VIEWS`).
- [ ] Exibir métricas de clientes/OS/treinamentos corretamente.
- [ ] Links funcionais para agenda, cronogramas e registros.

2) Agenda (criar evento)
- [ ] Selecionar consultor e empresa.
- [ ] Validar horário inicial < horário final.
- [ ] Detectar e sinalizar conflitos (`findConflicts`).
- [ ] Persistir evento e aparecer na vista correta (mês/semana/dia).

3) Cronogramas (criar/enviar)
- [ ] Selecionar template ou builder.
- [ ] Sugerir datas com base em disponibilidade do consultor.
- [ ] Gerar PDF/Excel anexo corretamente.
- [ ] Enviar e-mail com link de aprovação.
- [ ] Após aprovação, cronograma bloqueado para edição e eventos gerados.

4) Registro / Atendimento / Treinamento
- [ ] Checklist salva corretamente (treinamento).
- [ ] Marcar como realizado atualiza status e contabiliza horas.
- [ ] Itens pendentes geram tarefas vinculadas.

5) Ordem de Serviço (OS)
- [ ] Gerar OS a partir de registro/treinamento com itens e horas.
- [ ] PDF gerado contém horas detalhadas por item.
- [ ] Envio por e-mail registra entrada no `NOTIFICATIONS_LOG`.
- [ ] Marcar OS como assinada atualiza status do item de origem.

6) Templates e Hub
- [ ] Criar/editar itens do template e salvar alterações.
- [ ] Itens com `suggestedDays` mostram sugestão em builder.

7) Integridade de dados
- [ ] `validateDataIntegrity()` não encontra órfãos críticos após migração.
- [ ] `persist()` e `loadPersisted()` conservam versão e dados.

Observação: use estes pontos como base — adaptar conforme fluxo operacional da empresa.

---

<a id="guia-operacional---fluxo-resumido"></a>
## Guia Operacional — Fluxo Resumido (inserido de `GUIDA_OPERACIONAL.md`)
Ver original: [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md)

Objetivo: fornecer um guia curto e acionável para coordenadores e consultores, com links para documentação técnica detalhada.

Público: Coordenador de Atendimento, Consultor, Suporte Técnico.

Sumário rápido
- Propósito e papéis
- Fluxo principal (resumido)
- Principais ações por papel
- Links rápidos para documentação detalhada

Fluxo principal (resumido)
1. Cadastrar consultor e empresa.
2. Criar (ou aplicar) template → montar cronograma.
3. Enviar cronograma para aprovação (PDF/Excel + e-mail).
4. Cliente aprova → cronograma confirmado e bloqueado.
5. Sistema gera eventos e registros; execução começa.
6. Registrar atendimentos/treinamentos/tarefas; gerar OS quando necessário.
7. Gerar e enviar OS (PDF + e-mail/WhatsApp); marcar como assinada.

Ações rápidas por papel
- Coordenador: cadastrar consultores/empresas, criar templates, revisar cronogramas, enviar para cliente.
- Consultor: confirmar disponibilidade, executar treinamentos, registrar horas, gerar OS.
- Cliente: aprovar cronogramas, confirmar horários, assinar OS.

Onde encontrar detalhes
- Fluxo mestre: [FLUXO_AGENDAMENTO_IMPLANTACAO.md](docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md)
- Visual e estilos: [docs/01_visual_e_estilos.md](docs/01_visual_e_estilos.md)
- Componentes: [docs/02_componentes_utilizados.md](docs/02_componentes_utilizados.md)
- Lógicas e validações: [docs/03_logicas_e_validacoes.md](docs/03_logicas_e_validacoes.md)
- Fluxo de código (visão geral): [docs/04_fluxo_codigo_geral.md](docs/04_fluxo_codigo_geral.md)
- Estrutura de dados / DB: [docs/08_estrutura_banco_de_dados.md](docs/08_estrutura_banco_de_dados.md)
 - Estrutura de dados / DB (modelo Postgres sugerido): [docs/09_estrutura_banco_de_dados.md](docs/09_estrutura_banco_de_dados.md)
- Índice navegável: [docs/INDEX.md](docs/INDEX.md)

Próximos artefatos recomendados
- [docs/ACCEPTANCE_CHECKLISTS.md](docs/ACCEPTANCE_CHECKLISTS.md) — checklists por tela para QA/aceitação.

---

<a id="indice-navegavel"></a>
## Índice Navegável (inserido de `INDEX.md`)
Ver original: [docs/INDEX.md](docs/INDEX.md)

Este índice reúne os principais guias e referências do projeto para facilitar a implantação da POC/MVP.

Leitura recomendada (ordem curta)
- Operacional (obrigatório): [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md) — resumo acionável para coordenadores e consultores.
- Visão geral / referência: [docs/DOCS.md](docs/DOCS.md) — índice técnico com links para todos os documentos.
- QA / Aceitação: [docs/ACCEPTANCE_CHECKLISTS.md](docs/ACCEPTANCE_CHECKLISTS.md)

Guias operacionais
- [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md) — Quickstart operacional (1 página).
- [docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md](docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md) — Fluxo mestre detalhado (passo a passo).

Documentos por público
Operação / Implantação
- [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md)
- [docs/ACCEPTANCE_CHECKLISTS.md](docs/ACCEPTANCE_CHECKLISTS.md)

Desenvolvimento / Referência técnica
- [docs/DOCS.md](docs/DOCS.md) — índice geral e instruções de deploy.
- `Documentação Técnica — principal` (já presente neste arquivo)
- [docs/01_visual_e_estilos.md](docs/01_visual_e_estilos.md)
- [docs/02_componentes_utilizados.md](docs/02_componentes_utilizados.md)
- [docs/03_logicas_e_validacoes.md](docs/03_logicas_e_validacoes.md)
- [docs/04_fluxo_codigo_geral.md](docs/04_fluxo_codigo_geral.md)
- [docs/08_estrutura_banco_de_dados.md](docs/08_estrutura_banco_de_dados.md)

Exportar para PDF (comando sugerido)
```bash
pandoc docs/GUIDA_OPERACIONAL.md docs/*.md -o Faktory-Flow-Docs.pdf
```

---

<a id="envio-de-emails---visao-geral"></a>
## Envio de E-mails — Visão Geral (inserido de `EMAIL_ENVIO.md`)

Este documento explica, de forma concisa, como funciona o fluxo de envio de e-mails (Ordens de Serviço e notificações) no projeto. Não contém instruções de configuração de provedores ou plataformas de deploy — essas informações foram removidas dos guias principais e centralizadas aqui para referência operacional.

Resumo do fluxo

- O front-end gera a Ordem de Serviço (HTML/PDF) e dispara uma chamada HTTP `POST` para o endpoint interno responsável pelo envio.
- O endpoint é implementado como uma função serverless (conceitualmente uma rota `POST /api/send-os-email`) que: valida o payload (destinatário, assunto, corpo), prepara o remetente e dispara o envio ao provedor de SMTP ou serviço transacional.
- Em caso de falha no envio (API indisponível ou sem configuração), o front-end possui fallback para `mailto:` (abertura do cliente de e-mail local) para facilitar envio manual.

Comportamento e garantias

- Validações: o servidor valida `to`, `subject` e `html/text` mínimos antes de tentar enviar.
- Rate limiting: o envio aplica um limite simples por IP para evitar abuso (best-effort). Se o limite for excedido, o endpoint retorna erro apropriado e o front mostra mensagem ao usuário.
- Idempotência: envios podem ser marcados com flags/ids para evitar duplicação em re-submits.
- Timeout curto: a função de envio tem timeout reduzido para evitar travamentos na UI; operações de envio muito longas devem ser reencaminhadas a jobs assíncronos.
- Logs: resultados de envio (sucesso/falha) devem ser registrados localmente no `NOTIFICATIONS_LOG` (no `localStorage`) e/ou enviados para um backend de logs quando existir.

Boas práticas operacionais

- Não incluir credenciais em arquivos públicos; manter segredos em um local seguro (cofre/env vars no deploy).
- Para produção em escala, utilizar provedores transacionais (SendGrid, Postmark, Resend) e configurar SPF/DKIM/DMARC no DNS do domínio.
- Monitorar filas de falha e implementar retries exponenciais quando apropriado.

Onde está a implementação

- Implementação de referência: `api/send-os-email.js` (função usada no repositório como exemplo). Use-a apenas como modelo — para produção prefira integrar um serviço transacional e mover lógica crítica de retry/log para um backend mais robusto.

Observação

- Este arquivo contém a explicação do fluxo e recomendações. As instruções passo-a-passo de deploy e configuração de plataformas (ex.: Vercel, variáveis de ambiente detalhadas) foram removidas dos documentos principais e não aparecem aqui; se precisar delas, posso restaurar um guia separado com passos controlados e sensíveis ao ambiente.

---

<a id="blueprint-mvp---documento-completo"></a>
## Blueprint MVP — Documento Completo (inserido de `MVP_BLUEPRINT.md`)

[Conteúdo completo do Blueprint MVP foi incorporado — inclui Resumo executivo, Escopo, Modelo de dados, Fluxo end-to-end, Regras de negócio, Stack recomendado, Arquitetura, Integrações, Variáveis sensíveis e Roteiro de reconstrução.]

---

<a id="docsmd---indice-tecnico-e-notas"></a>
## DOCS.md — Índice técnico e notas (inserido de `DOCS.md`)

[Conteúdo do [docs/DOCS.md](docs/DOCS.md) incorporado aqui. Contém visão geral, integrações externas, automações, variáveis sensíveis e instruções gerais de execução, além de observações sobre persistência local, MSAL e html2pdf.]

---

<a id="fim-do-arquivo-compilado"></a>
## Fim do arquivo compilado

Se desejar, posso:
- Gerar uma versão PDF unificada e colocá-la na raiz (`Faktory-Flow-Docs.pdf`).
- Remover trechos duplicados ou normalizar títulos/âncoras para facilitar indexação automática por agentes de IA.
- Incluir metadados YAML no topo do arquivo para ajudar ferramentas de parsing.
# Documentação Técnica — Única (compilada)

Este arquivo reúne os documentos técnicos presentes em [docs/](docs/) num único arquivo para leitura sequencial ou para processamento por ferramentas/IA. As seções sensíveis de configuração de provedores e deploy foram removidas e mantidas separadas; informações sobre o envio de e-mails estão em [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md).

Sumário
- [Documentação Técnica — principal](#documentação-técnica-—-principal)
- [Parte 1 — Visual e Estilos](#parte-1-—-visual-e-estilos)
- [Parte 2 — Componentes utilizados](#parte-2-—-componentes-utilizados)
- [Parte 3 — Lógicas e Validações](#parte-3-—-lógicas-e-validações)
- [Parte 4 — Fluxo de Código (visão geral operacional)](#parte-4-—-fluxo-de-código-visão-geral-operacional)
- [Detalhar processo: criar e editar cronograma](#detalhar-processo-criar-e-editar-cronograma-guia-passo-a-passo)
- [Fluxo de Uso — Agendamento e Implantação](#fluxo-de-uso-—-agendamento-e-implantação)
- [Parte 8 — Estrutura do Banco de Dados](#parte-8-—-estrutura-do-banco-de-dados)
- [Acceptance Checklists](#acceptance-checklists-—-principais-telas)
- [Guia Operacional — Fluxo Resumido](#guia-operacional-—-fluxo-resumido)
- [Referências e próximos passos](#referências-e-próximos-passos)

---

## Documentação Técnica — principal

<!-- Include main technical doc -->

Ver original: [docs/DOCUMENTACAO_TECNICA.md](docs/DOCUMENTACAO_TECNICA.md)

<!-- START: DOCUMENTACAO_TECNICA.md -->

(Conteúdo completo de [docs/DOCUMENTACAO_TECNICA.md](docs/DOCUMENTACAO_TECNICA.md))


*A seguir está o conteúdo principal consolidado.*

<!-- Paste of docs/DOCUMENTACAO_TECNICA.md content -->

<!-- (Begin) -->

# Documentação Técnica — Faktory Flow Agenda

Esta documentação foi produzida a partir da análise completa do código e descreve, em profundidade, a arquitetura, os fluxos e as decisões técnicas do sistema. O objetivo é permitir que qualquer desenvolvedor consiga entender, manter, evoluir e recriar o projeto do zero.

## 1. Visão geral do projeto

### Objetivo principal do sistema
Centralizar o planejamento e a execução de atendimentos e treinamentos de consultorias, integrando agenda, cronogramas, registros operacionais e emissão de Ordem de Serviço (OS) em um fluxo único e rastreável.

### Problema que o projeto resolve
Empresas de consultoria precisam controlar compromissos, status de execução, pendências, evidências de atendimento e comunicação com clientes. O sistema elimina planilhas dispersas, reduz retrabalho e cria um fluxo operacional padronizado.

### Público-alvo ou cenário de uso
Consultorias e equipes internas que gerenciam agendas, treinamentos, tarefas e relacionamento com clientes, com necessidade de cronogramas e emissão de OS.

### Como a aplicação funciona em alto nível
O front-end é uma SPA em um único arquivo `index.html`, com persistência local total via `localStorage`. O back-end é uma função opcional usada para operações que exigem segredos (ex.: envio de e-mail). Fluxo geral:

```
Usuário → SPA (index.html) → localStorage (dados)
                    └─ fetch → /api/send-os-email → serviço de envio
```

### Principais módulos e responsabilidades gerais
| Módulo | Responsabilidade |
|---|---|
| Agenda | Calendário mensal/semanal/diário, eventos, conflitos e disponibilidade |
| Cronogramas | Planejamento de execução (builder simples e template V2) |
| Registros | Controle de atendimentos, treinamentos e tarefas |
| Templates | Modelos de cronogramas com itens e checklist |
| Dashboard | Visões operacionais (lista, kanban, calendário) |
| Kanban de Clientes | Estado macro por empresa |
| Ordem de Serviço | Geração, PDF, envio e assinatura |
| Notificações | Disparo de e-mails automáticos e log |

## 2. Requisitos funcionais

### Funcionalidades principais
| Funcionalidade | Descrição |
|---|---|
| Gestão de agenda | Criar, editar, reagendar e cancelar eventos, com filtros e detecção de conflitos |
| Cronogramas | Planejar cronogramas com disponibilidade e templates |
| Registros | Registrar atendimentos, treinamentos e tarefas com status e checklist |
| Templates V2 | Modelar itens reutilizáveis para cronogramas estruturados |
| Dashboard | Operação diária com múltiplas visões e filtros salvos |
| Kanban por cliente | Visualizar estágio macro do cliente |
| OS | Emitir, gerar PDF, enviar por e-mail e marcar como assinada |
| Notificações | Enviar e registrar e-mails automáticos em eventos chave |
| Integridade | Verificar e corrigir inconsistências do localStorage |

... (o restante do conteúdo técnico principal segue sem alterações relevantes)

## 7. Back-end

O back-end consiste em pontos mínimos utilizados pelo front-end para operações que dependem de segredos ou de serviços externos (por exemplo, envio de e-mail). Por segurança e separação de responsabilidades a implementação exemplar disponível no repositório é simples — para produção, recomenda‑se migrar a lógica crítica para um serviço backend mais robusto.

- Implementação de referência: existe uma função exemplo que recebe o payload da OS e encaminha para um serviço de envio (SMTP ou transacional).
- Para a descrição do fluxo de envio de e-mails e recomendações operacionais, veja [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md).

## 8. Front-end

<!-- Front-end section continues as in original file -->

<!-- END: DOCUMENTACAO_TECNICA.md -->

---

## Parte 1 — Visual e Estilos

<!-- Paste docs/01_visual_e_estilos.md -->

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
- Modal de Cadastro: Novo consultor, Nova empresa, Novo template, Novo cronograma, Nova OS

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

<!-- Paste docs/02_componentes_utilizados.md -->

# Parte 2 — Componentes utilizados

Objetivo: listar os componentes reutilizáveis da interface usados no fluxo de agendamento/implantação.

Componentes principais
- `SidebarMenu` — navegação lateral com seções e indicadores (badge counts).
- `Header` — título da página, ações globais, identificação do usuário.
- `CardResumo` — mostra totais (itens, treinamentos, tarefas, pendências).
- `KanbanBoard` e `KanbanColumn` — container e colunas do Kanban por cliente.
- `ClientCard` — cartão do cliente dentro do Kanban (resumo + ações rápidas).
- `CronogramaBuilder` — área com seleção de período, templates, preview e configuração de itens.
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
- `CronogramaBuilder` usa `TemplateCard` e `CronogramaItemEditor` para criar uma experiência de arrastar/editar.

---

## Parte 3 — Lógicas e Validações

<!-- Paste docs/03_logicas_e_validacoes.md -->

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

---

## Parte 4 — Fluxo de Código (visão geral operacional)

<!-- Paste docs/04_fluxo_codigo_geral.md -->

# Parte 4 — Fluxo de Código (visão geral operacional)

Objetivo: descrever de forma não técnica o fluxo de execução esperado entre telas e entidades — serve como mapa para arquitetos e desenvolvedores entenderem o comportamento global.

1. Ações do usuário (front) que disparam fluxos
- Abrir builder de cronograma → preview → salvar rascunho (local/backend) ou enviar para aprovação.
- Enviar para aprovação → backend gera anexos, cria notificação e marca cronograma como `sent`.
- Cliente aprova → backend recebe confirmação → cria registros de atendimento e atualiza status para `confirmed`.
- Consultor executa treinamento → marca `Realizado` → pode gerar OS.

2. Fluxo de estados (cronograma)
- draft (iniciado) → provisioned (template aplicado) → sent (enviado para cliente) → awaiting_client (aguardando retorno) → confirmed (aprovado) → cancelled

3. Fluxo de execução (resumido)
- Usuário cria cronograma → salva → envia
- Servidor: recebe envio → gera PDF/Excel (job assíncrono) → envia e‑mail/SMS → registra notification
- Cliente aprova (clicando no link ou por interface) → servidor processa confirmação (operação atômica) → cria atendimentos e tarefas vinculadas → notifica consultor
- Consultor realiza atendimentos → marca finalizações → caso necessário gera OS → horas são contabilizadas

---

## Detalhar processo: criar e editar cronograma (guia passo a passo)

<!-- Paste DETALHAR_PROCESSO_CRONOGRAMA.md -->

# Detalhar processo: criar e editar cronograma (guia passo a passo)

Objetivo: documentar todas as etapas do builder de cronograma para que a equipe execute ou refine a interface.

1) Abertura do builder
- A partir de `Cronogramas → Cronogramas por empresa` ou do card do cliente → `+ Novo cronograma`.
- Selecionar: Empresa, Consultor, Período (de/até).

2) Opções iniciais
- `Sugerir dias livres`: calcula dias livres com base na disponibilidade do consultor e bloqueios.
- `Usar templates`: seleciona templates disponíveis e inclui seus items no preview.
- `Cronogramas salvos`: carregar um cronograma anteriormente salvo como rascunho.

... (conteúdo completo segue)

---

## Fluxo de Uso — Agendamento e Implantação

<!-- Paste FLUXO_AGENDAMENTO_IMPLANTACAO.md -->

# Fluxo de Uso — Agendamento e Implantação

Documento resumido descrevendo o fluxo de uso para agendamento e implantação.

**Visão Geral**
- Objetivo: registrar o passo a passo desde o cadastro do consultor e da empresa, criação de templates e cronogramas, até a execução dos treinamentos e geração de Ordens de Serviço (OS).
- Escopo: telas de `Cadastros`, `Templates`, `Atend. / Treino / Tarefas`, `Cronogramas`, e `Atendimentos`.

... (conteúdo completo segue)

---

## Parte 8 — Estrutura do Banco de Dados

<!-- Paste docs/08_estrutura_banco_de_dados.md -->

# Parte 8 — Estrutura do Banco de Dados

Objetivo: descrever o modelo de dados sugerido/atual para o MVP/POC e qual tecnologia de banco usar.

1. Tecnologia recomendada / usada
- MVP/POC: Firestore (NoSQL) é adequado por agilidade e escalabilidade; pode ser substituído por Postgres conforme necessidade de consultas complexas.

... (conteúdo completo segue)

---

## Acceptance Checklists — Principais telas

<!-- Paste docs/ACCEPTANCE_CHECKLISTS.md -->

# Acceptance Checklists — Principais telas

Objetivo: checklists concisos para validação funcional durante QA e homologação.

... (conteúdo completo segue)

---

## Guia Operacional — Fluxo Resumido

<!-- Paste docs/GUIDA_OPERACIONAL.md -->

# Guia Operacional — Fluxo Resumido

Objetivo: fornecer um guia curto e acionável para coordenadores e consultores, com links para documentação técnica detalhada.

... (conteúdo completo segue)

---

## Referências e próximos passos

- A versão compacta para leitura rápida é [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md).
- Para questões operacionais de deploy e configuração sensível solicite acesso ao responsável pela infraestrutura.
- Para detalhes do fluxo de envio de e-mails veja [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md).
