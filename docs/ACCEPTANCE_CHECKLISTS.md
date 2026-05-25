# Acceptance Checklists — Principais telas

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
