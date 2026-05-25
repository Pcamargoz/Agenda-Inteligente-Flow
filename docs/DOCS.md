# Faktory Flow Agenda — DOCS

## 1. Visão Geral

Central de agendas de consultoria: cadastros, eventos, cronogramas, registros (atendimento/treino/tarefas), OSs com assinatura digital pública e controle de saldo de horas por cliente. Uso interno da Faktory.

## 2. Fluxo Principal

1. Usuário abre `index.html` (SPA) → `switchView('agenda')` reidrata estado do `localStorage`.
2. Cria consultores/empresas/cards de cliente em **Cadastros**.
3. Cria eventos na agenda (`saveEvent` em [index.html:7014](index.html#L7014)) → push em `EVENTS` + persist.
4. (Opcional) `teamsSync('create', ev)` POSTa no Microsoft Graph se o usuário estiver conectado.
5. Conclui registros (atendimento/treino) → vira candidato a OS (`Em OS`).
6. Gera OS via modal → envia por SMTP, mailto ou WhatsApp; `os.status='enviada'`.
7. **No envio**, `osDebitHours(os)` debita saldo de horas do card do cliente (idempotente).
8. Cliente acessa link público `publicOSLink(osId)`, revisa, desenha assinatura → `osMarkSigned` → `status='assinada'`.
9. Em cancelamento, `osRefundHours` estorna o saldo se `hoursDebited === true`.
10. Todo estado é serializado em `localStorage` a cada ação relevante (`persist()`).

## 3. Integrações Externas

**Envio de e-mails**
O sistema possui um fluxo para envio de Ordens de Serviço (OS) e notificações por e-mail. A descrição do fluxo, recomendações e comportamentos (retries, rate-limits, fallback) está consolidada em `docs/EMAIL_ENVIO.md`.

**Microsoft Graph via MSAL.js (SPA browser, sem backend)**
Replica eventos da agenda no calendário Outlook/Teams do usuário logado.
Credenciais: `TEAMS_CFG.clientId` e `TEAMS_CFG.tenantId` hardcoded em [index.html](index.html) (registro Entra ID do usuário). Sem env var — público por natureza no SPA.
Se cair: agenda local continua intacta; toast amarelo `"Teams não sincronizou"`. Nenhum dado se perde.

**html2pdf.js (CDN)**
Exportação de OSs/cronogramas em PDF dentro do navegador.
Credenciais: nenhuma.
Se cair: botões de exportar PDF param de funcionar; resto do sistema intacto.

**wa.me (deep link, sem API)**
Envio de OS via WhatsApp Web.
Credenciais: nenhuma.
Se cair (improvável): usuário precisa colar o conteúdo manualmente.

## 4. Automações e Jobs

`setInterval(updateSyncTime, 30000)` ([index.html:22617](index.html)) — atualiza o "Salvo X" no rodapé da sidebar. Cosmético; falha invisível.

Nenhuma automação de filas/worker adicional identificada no repositório. Operações de envio confiáveis e de longa duração são recomendadas para serem executadas por serviços assíncronos dedicados.

## 5. Operações sensíveis e variáveis

Algumas operações (envio de e-mails, integrações transacionais) dependem de credenciais e configurações sensíveis. A descrição do fluxo, recomendações operacionais e as variáveis envolvidas estão consolidadas em `docs/EMAIL_ENVIO.md`.

Para questões de deploy e configuração de secrets, contate a equipe de infraestrutura responsável — este repositório inclui uma implementação de exemplo, mas a configuração de produção varia conforme o ambiente.

## 6. Como Rodar Localmente (visão geral)

O projeto pode ser executado localmente para desenvolvimento da interface. Implementações de funções serverless são opcionais e a forma de rodá-las depende da plataforma escolhida; veja `docs/EMAIL_ENVIO.md` para detalhes operacionais sobre integrações de envio de e-mail.

Comandos típicos para desenvolvimento da interface:

```bash
npm install
npm run dev
```

Se sua equipe optar por executar funções serverless localmente, siga as instruções da plataforma escolhida (por exemplo, Vercel CLI) conforme a política interna de infraestrutura.

## 7. Decisões de Arquitetura

**Persistência em `localStorage`, sem backend de dados** → simplicidade radical, deploy zero-custo no Vercel free tier, funciona offline. Risco se mudar: precisa migrar todo o estado serializado para um banco (consultores, empresas, eventos, OSs, cards, logs) e reescrever todas as chamadas que hoje mutam arrays globais (`EVENTS`, `RECORDS`, etc.).

**Single-file `index.html` (~22k linhas, sem build/bundler)** → edição direta, sem toolchain, sem dependency tree. Risco se mudar: introduzir Vite/React quebra o fluxo de hot-edit e exige refatorar todo o estado global imperativo em componentes/state management.

**MSAL Public Client (PKCE) no browser, sem backend de auth** → integração com Teams/Outlook sem rodar servidor OAuth. Risco se mudar (ex.: introduzir backend de tokens): refresh tokens de longa duração precisam de armazenamento seguro server-side e nova rota; o `clientId`/`tenantId` atuais foram registrados como **SPA** no Entra — registro `Web` exige client secret.

## Documentação do Fluxo de Agendamento e Implantação

Abaixo estão os documentos detalhados que descrevem o fluxo operacional, visual e as recomendações para a equipe:



Observação: os fluxos detalhados em `docs/05`—`docs/07` foram consolidados no documento mestre [FLUXO_AGENDAMENTO_IMPLANTACAO.md](FLUXO_AGENDAMENTO_IMPLANTACAO.md). Os arquivos originais podem ter sido removidos ou mesclados; consulte o fluxo mestre para o passo a passo completo.


Se quiser, posso também gerar um índice `docs/INDEX.md` e criar um PDF unificado com todos esses documentos.
- [FLUXO_AGENDAMENTO_IMPLANTACAO.md](FLUXO_AGENDAMENTO_IMPLANTACAO.md) — Guia operacional completo (passo a passo para consultores).
- [docs/07_tarefas_atendimentos_treinamentos.md](docs/07_tarefas_atendimentos_treinamentos.md) — Como funcionam tarefas, atendimentos e treinamentos.
