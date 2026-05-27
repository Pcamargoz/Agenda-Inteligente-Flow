# Faktory Flow Agenda

SPA para gestão de agendas, cronogramas, registros operacionais e Ordens de Serviço (OS) em consultorias.

> **Princípio arquitetural:** zero backend de dados. Tudo é persistido no `localStorage` do navegador. O backend serverless existe **apenas** para envio SMTP de e-mail — credenciais nunca tocam o cliente.

---

## Estrutura do projeto

```
Agenda-Inteligente-Flow/
├── index.html                                    # SPA completa (UI + lógica + estado)
├── api/
│   └── send-os-email.js                          # Função serverless: envio SMTP de OS
├── assets/
│   └── logo.png                                  # Identidade visual
├── docs/
│   ├── GUIDA_OPERACIONAL.md                      # Quickstart de 1 página (coordenador/consultor)
│   └── FLUXO_AGENDAMENTO_IMPLANTACAO.md          # Fluxo de implantação detalhado
├── DOC_01_VISAO_GERAL.md                         # Visão do sistema e regras de negócio
├── DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md    # Referência técnica completa
├── README.md
├── package.json                                  # Node ≥ 18, dep: nodemailer
├── vercel.json                                   # Config de deploy (exemplo)
├── .env.example                                  # Variáveis SMTP (template)
└── .gitignore
```

---

## Documentação

Comece por aqui (ordem sugerida):

| # | Documento | Para quem | Tempo de leitura |
|---|---|---|---|
| 1 | **[docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md)** | Coordenador / consultor | ~3 min |
| 2 | **[DOC_01_VISAO_GERAL.md](DOC_01_VISAO_GERAL.md)** | Coordenador, PM, IA | ~15 min — fluxo de negócio, entidades, 12 casos de uso, regras |
| 3 | **[docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md](docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md)** | Operação / implantação | ~20 min — passo a passo detalhado |
| 4 | **[DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md](DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md)** | Dev, arquiteto, devops, IA | ~25 min — stack, modelo de dados, integrações, endpoints |

---

## Como rodar localmente

```bash
npm install
npm run dev      # vercel dev — SPA + função serverless juntas
```

Abra `http://localhost:3000` (ou a porta exibida pelo `vercel dev`).

Para deploy em produção:

```bash
npm run deploy   # vercel --prod
```

**Pré-requisitos:** Node ≥ 18 + CLI da plataforma de deploy (ex.: `vercel`).
**Variáveis sensíveis:** copie `.env.example` para `.env.local` e configure SMTP localmente (ou via secrets da plataforma em produção).

---

## Fluxo de negócio (resumo)

1. **Cadastrar** consultor e empresa.
2. **Criar cronograma** (builder simples ou template) → ajustar e validar.
3. **Enviar para aprovação** → cliente aprova → sistema gera eventos e registros atomicamente.
4. **Executar** atendimentos/treinamentos → preencher checklist.
5. **Gerar OS** → PDF client-side → enviar por e-mail/WhatsApp → debita saldo de horas (idempotente).
6. **Cliente assina** via link público → OS encerrada.

Detalhes completos: [DOC_01_VISAO_GERAL.md §2](DOC_01_VISAO_GERAL.md#2-fluxo-de-negocio-principal).

---

## Sobre o código

- **`index.html`** — SPA única (~22k linhas) com UI + regras de negócio + estado em `localStorage` (chave `atelier_agenda_v2`).
- **`api/send-os-email.js`** — função serverless de envio SMTP via `nodemailer`.
- **`vercel.json`** — configuração de exemplo (headers `no-store` para `/api/*`, `maxDuration: 15s`).
- **Entidades principais:** `CONSULTANTS`, `COMPANIES`, `EVENTS`, `SCHEDULES`, `RECORDS`, `TEMPLATES`, `CLIENT_CARDS`, `ORDERS_SERVICE`, `NOTIFICATIONS_LOG`.
- **Persistência versionada:** V2 → V5 com migrações automáticas em `loadPersisted()`.
- **Integridade:** `validateDataIntegrity()` detecta e corrige órfãos no `localStorage`.

Stack completa, padrões e decisões: [DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md](DOC_02_ARQUITETURA_E_REFERENCIA_TECNICA.md).
