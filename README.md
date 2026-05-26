# Faktory Flow Agenda

Projeto SPA para gestão de agendas, cronogramas, registros operacionais e Ordens de Serviço (OS).

Quick links
- **Guia Operacional:** [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md) — resumo prático para coordenadores e consultores.
- **Índice Navegável:** [docs/INDEX.md](docs/INDEX.md) — mapa por público e documentos.
- **Manual Unificado (Partes 1–4):** [docs/01_04_manual_unificado.md](docs/01_04_manual_unificado.md) — Visual, Componentes, Lógicas e Fluxo.
- **Documentação Técnica — Completa:** [docs/DOCUMENTACAO_TECNICA_COMPLETA.md](docs/DOCUMENTACAO_TECNICA_COMPLETA.md) — compilado mestre (inclui Blueprint MVP e apêndices).
- **Estrutura do Banco de Dados:** [docs/08_estrutura_banco_de_dados.md](docs/08_estrutura_banco_de_dados.md).
- **Detalhar processo (cronograma):** [docs/DETALHAR_PROCESSO_CRONOGRAMA.md](docs/DETALHAR_PROCESSO_CRONOGRAMA.md) — guia passo a passo do builder.
- **Envio de e-mails / OS:** [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md).
- **Fluxo mestre (implantação):** [docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md](docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md).

Visão rápida
- Front-end: `index.html` (SPA, persistência via `localStorage`).
- Endpoint de exemplo para envio de OS: `api/send-os-email.js`.

Leitura recomendada (ordem curta)
1. [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md)
2. [docs/INDEX.md](docs/INDEX.md)
3. [docs/01_04_manual_unificado.md](docs/01_04_manual_unificado.md)
4. [docs/DOCUMENTACAO_TECNICA_COMPLETA.md](docs/DOCUMENTACAO_TECNICA_COMPLETA.md)

Como rodar localmente (modo rápido)
Usando Python 3 (porta 8000):
```bash
python -m http.server 8000
```
Ou com `npx`:
```bash
npx serve . -l 8000
```

Contribuindo / editando docs
- Atualize os arquivos em `docs/` e o compilado `docs/DOCUMENTACAO_TECNICA_COMPLETA.md` será refeito manualmente quando necessário.
- Para mudanças operacionais (deploy, segredos), contate o responsável de infraestrutura antes de commitar.

Contato
- Para dúvidas sobre o conteúdo técnico ou o fluxo operacional, abra uma issue ou contate o autor do projeto.

---------------------------------------

Processo: como o consultor usa o sistema
- Abertura: o consultor visualiza seu `Kanban de Clientes` e abre o `ClientCard` do cliente.
- Criar cronograma: dentro do `ClientCard` selecionar `+ Novo cronograma` → usar `Sugerir dias livres` ou `Usar templates` → ajustar e salvar rascunho ou enviar para aprovação.
- Execução: ao confirmar, os `EVENTS` e `RECORDS` são criados; o consultor marca `Realizado` e preenche checklist.
- OS: após execução, gerar OS (PDF) e enviar; o débito de horas ocorre na emissão da OS.

Resumo técnico (resumido)
- Arquitetura: SPA única (`index.html`) com persistência em `localStorage`; backend serverless mínimo para envio de e-mails.
- Modelo de dados: entidades principais — `CONSULTANTS`, `COMPANIES`, `EVENTS`, `SCHEDULES`, `RECORDS`, `TEMPLATES`, `ORDERS_SERVICE`.
- Estado e transições: cronogramas (`rascunho` → `aguardando-cliente` → `confirmado`), eventos e OS com fluxos descritos em `docs/DOCUMENTACAO_TECNICA_COMPLETA.md`.

Documentação técnica (completa, para IA)
- O arquivo compilado de referência é: [docs/DOCUMENTACAO_TECNICA_COMPLETA.md](docs/DOCUMENTACAO_TECNICA_COMPLETA.md). Ele contém o Blueprint MVP, modelo de dados detalhado, fluxos end-to-end, decisões de arquitetura e guias de replicação.

Guia Operacional (como o sistema funciona)
- Consulte: [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md) — resumo prático com passos por papel (Coordenador, Consultor, Cliente) e ações rápidas.

Sobre o código
- Entrada da aplicação: `index.html` (SPA). Para testes locais abra `index.html` no navegador servindo via servidor estático.
- API de exemplo: `api/send-os-email.js` — função serverless de referência para envio de OS.
- Estrutura recomendada: frontend puro para MVP; migrar para Next.js/Prisma/Postgres quando necessário para multiusuário.

Licença / Contato
- Licença: (preencha conforme apropriado).
- Autor / contato: consulte o repositório para informações de commit ou abra uma issue.
