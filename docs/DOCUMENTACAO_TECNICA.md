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
O front-end é uma SPA em um único arquivo `index.html`, com persistência local total via `localStorage`. O back-end é opcional e, quando presente, implementa operações que exigem segredos (por exemplo, envio de e-mails). Fluxo geral (simplificado):

```
Usuário → SPA (index.html) → localStorage (dados)
                    └─ fetch → endpoint de envio (ex.: /api/send-os-email) → serviço de entrega
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

### Entidades principais e campos críticos
As entidades abaixo são persistidas no `localStorage` e representam o domínio funcional do sistema.

#### CONSULTANTS (consultores)
| Campo | Descrição |
|---|---|
| `id` | Identificador gerado por `uid(prefix)` |
| `name` | Nome completo |
| `initials` | Iniciais para avatar |
| `role` | Cargo |
| `specialty` | Especialidade |
| `email` | Contato principal |
| `phone` | Contato secundário |
| `workStart`, `workEnd` | Jornada de trabalho |
| `lunchMin` | Tempo de almoço |
| `freeDays` | Dias de trabalho disponíveis |
| `freePeriods` | Períodos preferenciais |
| `blockedDates` | Datas indisponíveis |
| `defaultRecurrence` | Recorrência padrão |
| `cls` | Classe visual do avatar |

Relações: usado em `EVENTS`, `RECORDS`, `SCHEDULES` e `COMPANIES`.

#### COMPANIES (empresas)
| Campo | Descrição |
|---|---|
| `id` | Identificador |
| `razao` | Razão social |
| `fantasia` | Nome fantasia |
| `cnpj` | Documento |
| `responsavel` | Contato principal |
| `contato` | E-mail |
| `consultantId` | Consultor padrão |
| `tipoAgenda` | Tipo padrão de evento |
| `projeto` | Projeto associado |
| `whatsapp`, `phone` | Contatos para OS |

Relações: usado em `EVENTS`, `RECORDS`, `SCHEDULES`, `CLIENT_CARDS` e `ORDERS_SERVICE`.

#### Tabelas auxiliares (cadastros)
| Tabela | Função |
|---|---|
| `EVENT_TYPES` | Tipos de evento e cores |
| `STATUSES` | Status e semântica visual |
| `PERIODS` | Períodos (manhã, tarde, etc.) |
| `RECURRENCES` | Recorrências (semanal, quinzenal, mensal) |
| `PRIORITIES` | Prioridades para tarefas |

#### EVENTS (agenda)
| Campo | Descrição |
|---|---|
| `id` | Identificador |
| `consultantId`, `companyId` | Vínculos |
| `date`, `timeStart`, `timeEnd` | Data e horário |
| `typeId`, `title` | Tipo e título |
| `status` | Estado operacional |
| `period`, `recurrence` | Período e recorrência |
| `priority` | Relevância |
| `desc`, `details`, `notes` | Observações |
| `seriesId` | Série de cronograma/recorrência |
| `scheduleId`, `templateId`, `itemId` | Origem do cronograma |
| `reagendadoDe` | Referência ao evento anterior |

#### SCHEDULES (cronogramas)
| Campo | Descrição |
|---|---|
| `id` | Identificador |
| `companyId`, `consultantId` | Vínculos |
| `from`, `to` | Período macro |
| `status` | Ciclo do cronograma |
| `mode` | `template` ou vazio |
| `items`, `itemIds` | Itens internos |
| `eventIds` | Eventos gerados |
| `history` | Auditoria |

#### RECORDS (registros)
| Campo | Descrição |
|---|---|
| `id` | Identificador |
| `kind` | `atendimento`, `treinamento`, `tarefa` |
| `consultantId`, `companyId` | Vínculos |
| `date`, `timeStart`, `timeEnd` | Execução |
| `status` | Status do ciclo |
| `priority` | Prioridade (tarefa) |
| `checklist` | Checklist (treinamento/tarefa) |
| `linkedTaskIds` | Tarefas vinculadas |
| `linkedEventId` | Ligação com agenda |
| `history` | Auditoria |

#### TEMPLATES (modelos V2)
| Campo | Descrição |
|---|---|
| `id` | Identificador |
| `name` | Nome do template |
| `items` | Itens do cronograma |

Campos de item de template: `kind`, `name`, `desc`, `checklist`, `suggestedDays`, `timeStart`, `timeEnd`, `priority`, `defaultResponsibleId`.

#### CLIENT_CARDS (kanban por cliente)
| Campo | Descrição |
|---|---|
| `id` | Identificador |
| `companyId` | Empresa |
| `status` | Estado do card |
| `statusManual` | Indica alteração manual |

#### ORDERS_SERVICE (ordens de serviço)
| Campo | Descrição |
|---|---|
| `id` | Identificador |
| `itemSrc`, `itemId` | Origem (registro/evento) |
| `title`, `scope` | Cabeçalho |
| `internalPending`, `clientPending` | Pendências |
| `status` | `rascunho`, `enviada`, `assinada` |
| `sentAt`, `signedAt` | Rastreamento |
| `history` | Auditoria |

#### USERS, DASH_VIEWS, NOTIFICATIONS_LOG
| Entidade | Função |
|---|---|
| `USERS` | Perfis (`admin`, `editor`, `confirmador`, `visualizador`) |
| `DASH_VIEWS` | Filtros salvos por usuário |
| `NOTIFICATIONS_LOG` | Histórico de notificações enviadas e falhas |

### Fluxos de uso
1. Cadastrar consultores, empresas e tabelas auxiliares.
2. Criar cronograma (builder simples ou template V2).
3. Enviar cronograma ao cliente e confirmar.
4. Gerar eventos e registros a partir do cronograma.
5. Registrar execução (atendimento/treinamento/tarefa).
6. Emitir OS e enviar para o cliente.
7. Monitorar com dashboard e kanban.

### Ações permitidas ao usuário
| Entidade | Ações |
|---|---|
| Consultores | Criar, editar, bloquear datas, definir jornada |
| Empresas | Criar, editar, vincular consultor e projeto |
| Eventos | Criar, editar, reagendar, cancelar, filtrar |
| Cronogramas | Criar, enviar, confirmar, bloquear edição |
| Registros | Criar, atualizar status, vincular tarefas |
| Templates | Criar itens, configurar checklist e sugestões |
| OS | Criar, editar, gerar PDF, enviar, assinar |

### Regras de criação, edição, exclusão e consulta
| Regra | Impacto |
|---|---|
| Eventos cancelados ou reagendados não aparecem por padrão | Evita poluição visual na agenda |
| Cronograma confirmado bloqueia edição | Garante consistência com cliente |
| Atendimento não pode ser “concluído” diretamente | OS é o documento que finaliza |
| Treinamento concluído com checklist incompleta cria tarefa | Evita perda de pendências |

### Comportamentos automáticos do sistema
| Automação | Descrição |
|---|---|
| Criação de registros ao confirmar cronograma | Cada item vira registro com status inicial |
| Atualização do card do cliente | Mudança automática para “em andamento” |
| Geração de tarefas pendentes | Checklist incompleto gera tarefa |
| OS move item de origem para concluído | Formaliza encerramento |

### Integrações com telas, componentes, serviços e APIs
| Integração | Como ocorre |
|---|---|
| OS → API | Envio de e-mail via `/api/send-os-email` |
| OS → WhatsApp | Link `wa.me` com mensagem pré-preenchida |
| PDF | `html2pdf.js` gera PDF no navegador |
| Notificações | Front chama API SMTP e registra em log |

### Estados possíveis de cada entidade importante
| Entidade | Estados |
|---|---|
| Evento | `criado`, `provisorio`, `confirmado`, `em-atendimento`, `atendido`, `reagendado`, `cancelado` |
| Cronograma | `rascunho`, `aguardando-cliente`, `confirmado` |
| Registro | `em-andamento`, `pendente`, `em-atendimento`, `atendido`, `concluido` |
| Card cliente | `nao-iniciada`, `aguardando`, `em-andamento`, `concluida`, `cancelada` |
| OS | `rascunho`, `enviada`, `assinada` |

## 3. Requisitos não funcionais

| Aspecto | Implementação atual | Implicação |
|---|---|---|
| Desempenho | Renderização manual e dados locais | Rápido para uso individual, sem latência de rede |
| Segurança | SMTP em servidor, dados locais | Segredos protegidos, mas sem autenticação real |
| Escalabilidade | Sem backend de dados | Não há sincronização multiusuário |
| Manutenibilidade | SPA single-file | Fácil deploy, difícil modularizar |
| Reuso de código | Funções utilitárias e tabelas de apoio | Evita duplicação de regras |
| UX | Várias views e modais, feedback visual | Processo guiado e operacional |
| Tratamento de erros | Validações e mensagens locais | Evita estados inválidos, mas não há logs centralizados |
| Logs/observabilidade | `NOTIFICATIONS_LOG` + console serverless | Rastreamento básico |
| Consistência de dados | `validateDataIntegrity()` | Reduz órfãos e inconsistências |
| Compatibilidade | HTML/CSS/JS padrão | Funciona em navegadores modernos |

## 4. Tecnologias, frameworks e bibliotecas

| Tecnologia | Por que foi escolhida | Onde é usada | Problema que resolve | Impacto no sistema |
|---|---|---|---|---|
| HTML/CSS/JS puro | Zero build e deploy simples | `index.html` | SPA sem dependências | Código centralizado |
| `localStorage` | Persistência sem servidor | Todos os dados | Mantém operação offline | Sem multiusuário |
| `html2pdf.js` | Geração de PDF client-side | OS e cronograma | Evita backend de documentos | Depende de CDN |
| Serverless (opcional) | Função de envio | `/api/send-os-email` (exemplo) | Operações confidenciais movidas para backend | Ver `docs/EMAIL_ENVIO.md` |

## 5. Arquitetura geral do sistema

### Separação de responsabilidades
O front-end concentra interface, regras de negócio e persistência local. O back-end existe apenas para envio de e-mails, mantendo credenciais fora do navegador. Não há banco de dados remoto.

### Organização entre front-end, back-end e serviços auxiliares
| Camada | Componentes | Função |
|---|---|---|
| Front-end | `index.html` | UI, regras, persistência, PDF, validações |
| Back-end | `api/send-os-email.js` | Envio SMTP, validações e rate limit |
| Serviços externos | SMTP | Transporte de e-mails |

### Fluxo de dados entre as camadas
1. Usuário altera dados na UI.
2. Estado global é atualizado.
3. Persistência grava em `localStorage`.
4. Renderizações atualizam a UI.
5. Quando necessário, a UI chama `/api/send-os-email`.

### Padrões arquiteturais adotados
| Padrão | Descrição | Motivo |
|---|---|---|
| SPA single-file | Tudo em um `index.html` | Simplicidade de deploy |
| Estado global | Objeto `state` centraliza contexto | Facilita renderização e filtros |
| Renderização manual | Funções `renderX` atualizam DOM | Controle total sem frameworks |
| Persistência por versão | `persist()` extendido em V2/V3/V4/V5 | Evolução sem quebrar legado |
| Auditoria | `history` em entidades | Rastreabilidade de mudanças |

### Dependências entre partes do sistema
| Origem | Destino | Dependência |
|---|---|---|
| Cronogramas | Eventos | Geração de compromissos |
| Cronogramas | Registros | Geração de execução |
| Registros | OS | Encerramento formal |
| Templates | Cronogramas | Base para planejamento |
| Eventos | Reagendamento | Cria novo evento e altera status |
| Notificações | API SMTP | Envio e registro |

## 6. Estrutura de pastas e arquivos

| Caminho | Responsabilidade | Conteúdo | Relação com o sistema |
|---|---|---|---|
| `index.html` | SPA completa | HTML, CSS, JS e regras de negócio | Núcleo de toda a aplicação |
| `api/send-os-email.js` | Exemplo de implementação | Roteiro de envio (modelo) | Veja `docs/EMAIL_ENVIO.md` para operações e recomendações |
| `package.json` | Dependências e scripts | Scripts de desenvolvimento | Dependendo da infra escolhida |
| `vercel.json` | Exemplo de configuração | Arquivo de exemplo para Vercel | Opcional — gerenciado pela infra |
| `.env.example` | Arquivo de exemplo | Demonstra variáveis sensíveis | Não inclua segredos em repositórios públicos |
| `README.md` | Instruções básicas | Uso e deploy | Onboarding inicial |

## 7. Back-end

O back-end consiste em pontos mínimos utilizados pelo front-end para operações que dependem de segredos ou de serviços externos (por exemplo, envio de e-mail). Por segurança e separação de responsabilidades a implementação exemplar disponível no repositório é simples — para produção, recomenda‑se migrar a lógica crítica para um serviço backend mais robusto.

- Implementação de referência: existe uma função exemplo que recebe o payload da OS e encaminha para um serviço de envio (SMTP ou transacional).
- Para a descrição do fluxo de envio de e-mails e recomendações operacionais, veja `docs/EMAIL_ENVIO.md`.


## 8. Front-end

### Estrutura geral de páginas e rotas
A SPA utiliza navegação interna por views. Principais views: Dashboard, Agenda, Cronogramas, Registros e Cadastros. Cada view possui renderização específica e filtros próprios.

### Componentes reutilizáveis e layout
O layout é composto por sidebar, header de filtros, área principal de conteúdo e modais. Os modais são usados para edição e criação de entidades.

### Views e modais principais
| View | Objetivo |
|---|---|
| Dashboard | Visão operacional consolidada |
| Agenda | Calendário e gestão de eventos |
| Cronogramas | Planejamento e aprovação de cronogramas |
| Registros | Execução de atendimentos, treinamentos e tarefas |
| Cadastros | Tabelas auxiliares e entidades base |

| Modal | Objetivo |
|---|---|
| Evento | Criar e editar eventos |
| Agenda detalhada | Visualização e ajustes rápidos |
| Cronograma | Criar e editar cronogramas |
| Registro | Atualizar status e checklist |
| Reagendamento | Criar novo evento e cancelar o anterior |
| Template | Criar e editar templates |
| Hub de item | Configurar itens em sequência |
| Ordem de Serviço | Criar, gerar PDF e enviar |
| Log de notificações | Auditoria de envios |

### Estado global e persistência
`state` guarda visão atual, filtros, seleção de datas e objetos em edição. `persist()` e `loadPersisted()` salvam e reconstroem toda a base via `localStorage`, com migrações graduais (V2 a V5).

### Estado global (`state`) e contexto de UI
| Campo | Função |
|---|---|
| `view`, `calView` | View atual e tipo de calendário |
| `viewYear`, `viewMonth` | Navegação mensal |
| `viewWeekStart`, `viewDay` | Navegação semanal/diária |
| `filters`, `regFilters`, `dashFilters` | Filtros por módulo |
| `evSelectedDates`, `evStatus`, `evEditingId` | Seleção e edição de eventos |
| `croPreview`, `croTplItems`, `croDraftScheduleId` | Contexto de cronogramas |
| `tplEditing`, `tplPickerMonth`, `tplPickerYear` | Estado de templates |
| `osDraft`, `osEditingId`, `osContext` | Contexto de OS |

### Persistência local e integridade
| Elemento | Descrição |
|---|---|
| `atelier_agenda_v2` | Chave principal no `localStorage` |
| `persist()` | Serializa estado e entidades |
| `loadPersisted()` | Carrega versões antigas e migra dados |
| `validateDataIntegrity()` | Detecta e corrige órfãos |

### Agenda
| Componente | Função |
|---|---|
| Agenda mensal/semanal/diária | Visualizar eventos por período |
| Mini calendário | Seleção múltipla de datas |
| Conflitos | `findConflicts` valida sobreposições |
| Reagendamento | Cria novo evento e cancela o original |

Recorrências semanais, quinzenais e mensais geram um número limitado de ocorrências adicionais para evitar excesso de eventos.

### Lógica de disponibilidade e conflito
| Função | Papel |
|---|---|
| `consultantDailyCapacityMin()` | Calcula capacidade diária com base em jornada e almoço |
| `consultantDayLoad()` | Soma a carga diária ocupada |
| `isConsultantFreeOn()` | Valida disponibilidade por dia e bloqueios |
| `findConflicts()` | Detecta sobreposição de horários |

### Cronogramas
Dois modos: builder simples e template V2.
| Modo | Característica |
|---|---|
| Builder simples | Sugere datas com base em disponibilidade |
| Template V2 | Itens com checklist, prioridades e pendências |

No builder simples, o sistema considera `freeDays`, `blockedDates` e carga diária do consultor para sugerir datas. No template V2, os itens ficam em rascunho, podem ser enviados ao cliente e, quando confirmados, geram registros automaticamente com status inicial conforme presença de data.

### Templates e Hub de configuração
Templates agrupam itens (treinamentos e tarefas). O hub permite configurar cada item em sequência, definir horários e marcar itens como “pulado” ou “aguardando agendar”.

### Registros
Registros são a execução operacional e se ligam a eventos e cronogramas. Existem regras específicas para atendimento, treinamento e tarefa.

### Dashboard e Kanban
O dashboard agrega filtros e visualizações. O kanban por cliente exibe status macro, com drag-and-drop e atualização automática baseada nos registros.

### Ordem de Serviço
Gera PDF no navegador e permite envio por e-mail e WhatsApp. A OS pode ser marcada como assinada e altera o status do item de origem.
Pendências internas são preenchidas a partir de checklist não concluído e pendências do cliente são coletadas de tarefas em aberto relacionadas à empresa.

### Notificações automáticas
O front dispara notificações de eventos chave e registra cada envio no `NOTIFICATIONS_LOG`.
Principais gatilhos: treinamento criado, cronograma enviado ao cliente, empresa atribuída a consultor e reagendamento.

## 9. Fluxo completo da aplicação

1. Usuário cadastra consultor e empresa.
2. Cria cronograma com base em template ou builder.
3. Envia o cronograma ao cliente e registra no log.
4. Cliente aprova, cronograma é confirmado.
5. Eventos e registros são criados automaticamente.
6. Atendimentos e treinamentos são executados e atualizados.
7. OS é criada, PDF gerado e enviado.
8. Sistema registra envio e mantém histórico.
9. Dashboard e kanban mostram status final.

## 10. Regras de negócio

| Regra | Intenção |
|---|---|
| Eventos cancelados e reagendados não aparecem na agenda padrão | Foco nos compromissos válidos |
| Atendimento concluído vira “atendido” | OS é o fechamento oficial |
| Treinamento com checklist incompleto gera tarefa | Garantir pendências |
| Cronograma confirmado bloqueia alterações | Integridade com o cliente |
| OS move item de origem para concluído | Formalização do encerramento |
| Registros pendentes saem das abas principais | Priorizar execução |
| Treinamento precisa de data e horário para envio ao cliente | Evitar cronograma inviável |
| Itens sem data podem ficar “aguardando agendar” | Manter cronograma parcial |
| Reagendamento exige motivo e cria vínculo `reagendadoDe` | Rastreabilidade |
| Capacidade do consultor é calculada por jornada e almoço | Evitar sobrecarga |
| Transições de status seguem `STATUS_TRANSITIONS` | Coerência de ciclo |
| OS preenche pendências internas e do cliente automaticamente | Padronizar fechamento |
| Card de cliente muda de status conforme progresso | Visão macro automática |

## 11. Estados, eventos e validações

### Estados por entidade
| Entidade | Estados detalhados |
|---|---|
| Evento | `criado`, `provisorio`, `confirmado`, `em-andamento`, `em-atendimento`, `atendido`, `reagendado`, `cancelado` |
| Cronograma | `rascunho`, `aguardando-cliente`, `confirmado` |
| Registro | `em-andamento`, `pendente`, `em-atendimento`, `atendido`, `concluido` |
| Template | `ativo` (implícito) com itens `treinamento` e `tarefa` |
| OS | `rascunho`, `enviada`, `assinada` |
| Notificação | `success` ou `error` no log |

### Transições de status
As transições válidas são definidas em `STATUS_TRANSITIONS` e verificadas por `canTransitionTo`, evitando saltos ilegais entre estados (por exemplo, pular etapas de atendimento).

### Eventos importantes
| Evento | Efeito |
|---|---|
| Reagendamento | Cancela original e cria novo evento |
| Confirmação de cronograma | Gera registros e altera card |
| Envio de OS | Registra no log e atualiza status |
| Conclusão de treinamento | Pode gerar tarefa pendente |

### Validações de entrada
| Validação | Onde ocorre |
|---|---|
| Horário inicial < final | Eventos e registros |
| Campos obrigatórios | Formulários de criação |
| Checklist completo | Treinamentos ao concluir |
| E-mail válido | Envio de OS/notificações |
| Conflito de horário | Agenda e cronogramas |
| Disponibilidade do consultor | Builder e criação de eventos |
| Recorrência limitada | Agenda para evitar excesso |

### Comportamentos assíncronos e fallback
Envio de e-mail é assíncrono via serverless. Em falha, há fallback para `mailto:` e registro no log. PDF é gerado localmente sem esperar backend.

## 12. Integrações e comunicação entre módulos

| Integração | Fluxo |
|---|---|
| Agenda ↔ Registros | Eventos criam registros e registros atualizam agenda |
| Templates ↔ Cronogramas | Templates geram itens, cronogramas geram eventos |
| Registros ↔ OS | OS finaliza registros |
| Notificações ↔ API | Front envia payload SMTP e registra resultado |
| Kanban ↔ Registros | Status do card depende dos registros |
| Cronograma ↔ Eventos | `seriesId`, `scheduleId`, `itemId` conectam itens |
| Registros ↔ Eventos | `linkedEventId` mantém vínculo operacional |
| OS ↔ Origem | `itemSrc` e `itemId` indicam origem |
| Dashboard ↔ Filtros | `DASH_VIEWS` armazena visões salvas |

## 13. Decisões técnicas e padrões de projeto

| Decisão | Vantagens | Desvantagens |
|---|---|---|
| SPA single-file | Deploy simples e rápido | Código grande e menos modular |
| LocalStorage | Offline e baixo custo | Sem multiusuário e risco de perda |
| Sem framework | Controle total | Menos reutilização estrutural |
| Persistência versionada | Evolução segura | Complexidade acumulada |
| Auditoria via `history` | Rastreamento fácil | Aumenta volume de dados |
| Renderização manual (`renderX`) | Atualização direta do DOM | Maior acoplamento de UI |
| Extensões V2/V3/V4/V5 por override | Evolução incremental | Manutenção mais delicada |

## 14. Pontos de melhoria, riscos e limitações

| Ponto | Risco atual | Melhoria sugerida |
|---|---|---|
| Dados locais | Perda ao limpar navegador | Persistência em backend |
| Sem autenticação | Acesso indiscriminado | Login e controle de acesso |
| Rate limit simples | Pode falhar em alta demanda | Rate limit centralizado |
| PDF client-side | Dependência de CDN | PDF no servidor ou bundle local |
| E-mail sem anexo | Comunicação incompleta | Anexar PDF do cronograma |
| Código monolítico | Manutenção complexa | Modularização gradual |

## 15. Guia para recriar o sistema

1. Definir o modelo de dados e entidades principais (consultores, empresas, eventos, registros, cronogramas, OS).
2. Implementar estado global e persistência em `localStorage` com versionamento.
3. Criar interface base com views e modais.
4. Implementar módulo de agenda com conflitos e filtros.
5. Criar cronogramas (builder simples e template V2).
6. Implementar registros e regras específicas de atendimento e treinamento.
7. Adicionar dashboard e kanban por cliente.
8. Implementar OS com geração de PDF e fluxo de envio (API ou transacional) conforme a arquitetura escolhida.
9. Se necessário, implementar um componente backend responsável por envio de e-mails com validações e healthcheck — veja `docs/EMAIL_ENVIO.md`.
10. Configurar deployment e gerenciamento de segredos conforme a plataforma de infraestrutura adotada.

## Atualizações recentes

- Novo documento mestre de fluxo: `FLUXO_AGENDAMENTO_IMPLANTACAO.md` (fluxo de agendamento e implantação, incluindo endpoints agrupados por fluxo).
 - Documentos de apoio criados em `docs/`: `01_visual_e_estilos.md`, `02_componentes_utilizados.md`, `03_logicas_e_validacoes.md`, `04_fluxo_codigo_geral.md`, `08_estrutura_banco_de_dados.md`.
- Arquivos removidos/mesclados: `docs/05_fluxo_criar_empresa_e_card.md`, `docs/06_fluxo_criar_editar_cronograma.md`, `docs/07_tarefas_atendimentos_treinamentos.md` (conteúdo consolidado no fluxo mestre).
- Próximas recomendações: adicionar um `docs/09_endpoints_por_fluxo.md` ou `openapi.yaml` para formalizar contratos de API.


