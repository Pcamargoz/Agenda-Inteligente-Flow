# Faktory Flow Agenda

SPA para gestão de agendas, cronogramas, registros operacionais e Ordens de Serviço (OS).

---

## Documentação

| Documento | Descrição |
|---|---|
| [docs/GUIDA_OPERACIONAL.md](docs/GUIDA_OPERACIONAL.md) | Guia operacional — fluxo resumido por papel |
| [docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md](docs/FLUXO_AGENDAMENTO_IMPLANTACAO.md) | Fluxo mestre de implantação (passo a passo) |
| [docs/01_04_manual_unificado.md](docs/01_04_manual_unificado.md) | Manual unificado — Visual, Componentes, Lógicas e Fluxo |
| [docs/01_04_manual_unificado.md](docs/01_04_manual_unificado.md) | Manual Unificado — inclui Estrutura de Dados (Parte 5) |
| [docs/DOCUMENTACAO_TECNICA_COMPLETA.md](docs/DOCUMENTACAO_TECNICA_COMPLETA.md) | Compilado mestre — referência completa para IA e equipe |

---

## Como rodar localmente

```bash
python -m http.server 8000
# ou
npx serve . -l 8000
```

Abra `http://localhost:8000` no navegador.

---

## Processo (resumo)

1. Abrir o `ClientCard` do cliente no Kanban.
2. Dentro do card, criar `+ Novo cronograma` → ajustar e salvar.
3. Enviar para aprovação do cliente → cronograma confirmado gera eventos e registros.
4. Executar atendimentos/treinamentos → gerar OS (PDF) → enviar e marcar assinada.

---

## Sobre o código

- `index.html` — SPA único (~22k linhas), estado em `localStorage`.
- `api/send-os-email.js` — função serverless de exemplo para envio de OS.
- Entidades principais: `CONSULTANTS`, `COMPANIES`, `EVENTS`, `SCHEDULES`, `RECORDS`, `TEMPLATES`, `ORDERS_SERVICE`.
