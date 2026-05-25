# Detalhar processo: criar e editar cronograma (guia passo a passo)

Objetivo: documentar todas as etapas do builder de cronograma para que a equipe execute ou refine a interface.

1) Abertura do builder
- A partir de `Cronogramas → Cronogramas por empresa` ou do card do cliente → `+ Novo cronograma`.
- Selecionar: Empresa, Consultor, Período (de/até).

2) Opções iniciais
- `Sugerir dias livres`: calcula dias livres com base na disponibilidade do consultor e bloqueios.
- `Usar templates`: seleciona templates disponíveis e inclui seus items no preview.
- `Cronogramas salvos`: carregar um cronograma anteriormente salvo como rascunho.

3) Preview do cronograma
- Lista de dias com campos de hora e indicadores (livre, indisponível, evento existente).
- Selecionar items do template e clicar `Adicionar ao cronograma`.

4) Configurar itens (por item)
- Abrir o item → modal com campos:
  - Nome do treinamento/tarefa
  - Modalidade (presencial/online)
  - Local / link
  - Instrutor
  - Recursos / pré‑requisitos
  - Observações
  - Recorrência opcional
  - Data (obrigatória) e hora (início/fim)
  - Atalhos de horários sugeridos (manhã/tarde)
- Validar: se data/hora não preenchidas, item marcado em vermelho e impedirá envio para aprovação.

5) Validação em massa e ajustes
- Botões rápidos: `Mesmo horário p/ treinamentos`, `Mesmo horário p/ tarefas`, `Distribuir nos dias livres`.
- `Configurar em sequência`: alinha itens sequencialmente respeitando duração e janelas livres.

6) Salvar / Enviar
- `Salvar rascunho`: salva cronograma para edição posterior.
- `Salvar cronograma` / `Enviar para aprovação do cliente`: gera anexos e notificação ao cliente.

7) Mensagens e indicadores
- Barra de progresso (itens prontos / total) exibida no topo.
- Texto de ajuda e tooltips explicando motivos de erro (conflito, fora da jornada).

8) Edição pós‑envio
- Enquanto `Aguardando cliente`: permite edição limitada (os campos não validados ficam editáveis), mas recomenda notificar alterações.
- Após `Confirmado`: cronograma bloqueado; alterações exigem processo de re‑agendamento formal e registro histórico.

---
Arquivo: `DETALHAR_PROCESSO_CRONOGRAMA.md` — guia operacional do builder.
