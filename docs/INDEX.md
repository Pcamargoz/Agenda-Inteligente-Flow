# Índice Navegável — Faktory Flow Agenda

Este índice reúne os principais guias e referências do projeto para facilitar a implantação da POC/MVP.

**Leitura recomendada (ordem curta)**
-- **Operacional (obrigatório):** [GUIDA_OPERACIONAL.md](GUIDA_OPERACIONAL.md) — resumo acionável para coordenadores e consultores.
- **Visão geral / referência:** [DOCS.md](DOCS.md) — índice técnico com links para todos os documentos.
- **QA / Aceitação:** [docs/ACCEPTANCE_CHECKLISTS.md](ACCEPTANCE_CHECKLISTS.md)
-- **Modelos de e-mail:** *não aplicável*

## Ordem de leitura (IA / Equipe)

- **Para IA (análise automatizada / indexação):**
	1. Abra `docs/DOCUMENTACAO_TECNICA_COMPLETA.md` e percorra o Sumário (TOC) do topo para baixo.
	2. Siga os links do TOC por seção conforme o caso de uso (ex.: Parte 9 — estrutura de banco, Parte 4 — fluxo de código, Envios de e-mail).

- **Para a equipe (implantação / operação):**
	1. Leia `docs/GUIDA_OPERACIONAL.md` (fluxo resumido) para entender papéis e passos operacionais.
	2. Use `docs/INDEX.md` como mapa e abra os documentos detalhados conforme a necessidade: `docs/09_estrutura_banco_de_dados.md`, `docs/04_fluxo_codigo_geral.md`, `docs/EMAIL_ENVIO.md`.

---

## Guias operacionais
- [GUIDA_OPERACIONAL.md](GUIDA_OPERACIONAL.md) — Quickstart operacional (1 página).
- [FLUXO_AGENDAMENTO_IMPLANTACAO.md](FLUXO_AGENDAMENTO_IMPLANTACAO.md) — Fluxo mestre detalhado (passo a passo).

## Documentos por público
**Operação / Implantação**
- [GUIDA_OPERACIONAL.md](GUIDA_OPERACIONAL.md)
- [docs/ACCEPTANCE_CHECKLISTS.md](ACCEPTANCE_CHECKLISTS.md)
 - *(Modelos de e-mail removidos)*

**Desenvolvimento / Referência técnica**
- [DOCS.md](DOCS.md) — índice geral e instruções de deploy.
- [Documentação Técnica — principal (resumo)](DOCUMENTACAO_TECNICA.stub.md)
- [Documentação Técnica — unificada (v2, resumo)](DOCUMENTACAO_TECNICA.stub.md)
- [docs/01_visual_e_estilos.md](01_visual_e_estilos.md)
- [docs/02_componentes_utilizados.md](02_componentes_utilizados.md)
- [docs/03_logicas_e_validacoes.md](03_logicas_e_validacoes.md)
- [docs/04_fluxo_codigo_geral.md](04_fluxo_codigo_geral.md)
- [docs/08_estrutura_banco_de_dados.md](08_estrutura_banco_de_dados.md)
 - [docs/09_estrutura_banco_de_dados.md](09_estrutura_banco_de_dados.md)

---

## Como usar este índice
- Leia `GUIDA_OPERACIONAL.md` para a jornada de implantação.
- Abra `DOCS.md` se precisar de detalhes técnicos (deploy, variáveis, APIs).
- Use os documentos em `docs/` como deep-dives: cada arquivo contém validações, templates ou exemplos.
- Para gerar um pacote PDF único, exporte `GUIDA_OPERACIONAL.md` + `docs/*` via sua ferramenta preferida (ex.: print-to-PDF ou `pandoc`).

## Exportar para PDF (comando sugerido)
Se quiser gerar um PDF único (Linux/WSL/Mac com `pandoc`):

```bash
pandoc docs/GUIDA_OPERACIONAL.md docs/*.md -o Faktory-Flow-Docs.pdf
```

---

Se precisar, eu posso:
- Gerar `docs/INDEX.md` (feito) e atualizar `DOCS.md` para linkar aqui.
- Exportar um PDF unificado e colocá-lo na raiz como `Faktory-Flow-Docs.pdf`.
