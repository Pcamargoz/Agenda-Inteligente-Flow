# Faktory Flow Agenda

[![](https://img.shields.io/badge/Entrada-%C3%8Dndice-blue)](docs/INDEX.md)

[![Guia Operacional](https://img.shields.io/badge/Guia-Operacional-blue)](docs/GUIDA_OPERACIONAL.md) [![Documentação](https://img.shields.io/badge/Documenta%C3%A7%C3%A3o-tecnica-lightgrey)](docs/DOCUMENTACAO_TECNICA.md) [![Índice](https://img.shields.io/badge/%E2%86%92-Índice-green)](docs/INDEX.md)

Projeto SPA para gestão de agendas, cronogramas, registros operacionais e Ordens de Serviço (OS).

Visão rápida:
- Front-end: `index.html` (SPA, persistência via `localStorage`).
- Docs organizadas em `docs/` para leitura por tópicos.
- Envio de e-mails: fluxo tratado por um endpoint dedicado — detalhes em [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md).

Comece por:
- 📘 [Guia Operacional](docs/GUIDA_OPERACIONAL.md) — guia prático (coordenador / consultor).
- 🧭 [Índice Navegável](docs/INDEX.md) — índice navegável com os documentos por público.
- 📗 [Documentação Técnica](docs/DOCUMENTACAO_TECNICA.md) — documentação técnica principal.
 - 🗄️ [Estrutura do Banco de Dados (modelo sugerido - Postgres)](docs/09_estrutura_banco_de_dados.md) — modelo relacional sugerido.

Entrada recomendada: [docs/INDEX.md](docs/INDEX.md) — use este índice leve como ponto de partida para navegar pela documentação.

Para operações sensíveis (configuração de provedores, deploys e variáveis secretas), consulte a equipe responsável pela infraestrutura; detalhes operacionais foram removidos do README e centralizados nos arquivos de `docs/`.
