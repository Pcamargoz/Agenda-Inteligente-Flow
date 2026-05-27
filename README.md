# Faktory Flow Agenda

SPA para gestão de agendas, cronogramas, registros operacionais e Ordens de Serviço (OS) em consultorias.

> **Princípio arquitetural:** zero backend de dados. Tudo persistido no `localStorage` do navegador. O backend serverless existe **apenas** para envio SMTP de e-mail — credenciais nunca tocam o cliente.

---

## Documentação principal

Para entender o sistema, comece pelos dois documentos consolidados na raiz:

| Documento | Para quem | O que contém |
|---|---|---|
| **[DOC_01_VISAO_GERAL.md](DOC_01_VISAO_GERAL.md)** | Coordenadores, consultores, PMs, IA | Propósito, fluxo de negócio end-to-end, entidades, 12 casos de uso, regras de negócio, validações, estados/transições |
| **[DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md](DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md)** | Devs, arquitetos, devops, IA | Stack, arquitetura, front/back, modelos de dados (localStorage / Firestore / Postgres), integrações, endpoints REST, decisões técnicas, roteiro de reconstrução, setup/deploy |

### Documentação de apoio (`docs/`)

| Documento | Descrição |
|---|---|
| [docs/INDEX.md](docs/INDEX.md) | Índice navegável por público |
| [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md) | Quickstart operacional (1 página) |
| [docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md](docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md) | Fluxo mestre de implantação (passo a passo) |
| [docs/MVP_BLUEPRINT.md](docs/MVP_BLUEPRINT.md) | Blueprint para replicar o sistema do zero |
| [docs/ACCEPTANCE_CHECKLISTS.md](docs/ACCEPTANCE_CHECKLISTS.md) | Checklists de QA/aceitação |
| [docs/EMAIL_ENVIO.md](docs/EMAIL_ENVIO.md) | Fluxo e boas práticas de envio de e-mail |
| [docs/09_estrutura_banco_de_dados.md](docs/09_estrutura_banco_de_dados.md) | Modelo relacional sugerido (Postgres) |

---

## Como rodar localmente

```bash
npm install
npm run dev      # vercel dev — SPA + função serverless
```

Abra `http://localhost:3000` (ou a porta exibida pelo `vercel dev`).

Para deploy em produção:

```bash
npm run deploy   # vercel --prod
```

**Pré-requisitos:** Node ≥ 18, CLI da plataforma de deploy (ex.: `vercel`).

---

## Fluxo (resumo)

1. **Cadastrar** consultor e empresa.
2. **Criar cronograma** (builder simples ou template) → ajustar e validar.
3. **Enviar para aprovação** → cliente aprova → sistema gera eventos e registros atomicamente.
4. **Executar** atendimentos/treinamentos → preencher checklist.
5. **Gerar OS** → PDF client-side → enviar por e-mail/WhatsApp → debita saldo de horas (idempotente).
6. **Cliente assina** via link público → OS encerrada.

Detalhes completos do fluxo: ver [DOC_01_VISAO_GERAL.md §2](DOC_01_VISAO_GERAL.md#2-fluxo-de-negocio-principal).

---

## Sobre o código

- **`index.html`** — SPA única (~22k linhas) com UI + regras de negócio + estado em `localStorage` (chave `atelier_agenda_v2`).
- **`api/send-os-email.js`** — função serverless de envio SMTP via `nodemailer`.
- **`vercel.json`** — configuração de exemplo (headers, timeout da função).
- **Entidades principais:** `CONSULTANTS`, `COMPANIES`, `EVENTS`, `SCHEDULES`, `RECORDS`, `TEMPLATES`, `CLIENT_CARDS`, `ORDERS_SERVICE`, `NOTIFICATIONS_LOG`.
- **Persistência versionada:** V2 → V5 com migrações automáticas em `loadPersisted()`.
- **Integridade:** `validateDataIntegrity()` detecta/corrige órfãos.

Stack completa, padrões e decisões: ver [DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md](DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md).
