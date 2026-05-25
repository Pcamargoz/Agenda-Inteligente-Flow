# Envio de E-mails — Visão Geral

Este documento explica, de forma concisa, como funciona o fluxo de envio de e-mails (Ordens de Serviço e notificações) no projeto. Não contém instruções de configuração de provedores ou plataformas de deploy — essas informações foram removidas dos guias principais e centralizadas aqui para referência operacional.

Resumo do fluxo

- O front-end gera a Ordem de Serviço (HTML/PDF) e dispara uma chamada HTTP `POST` para o endpoint interno responsável pelo envio.
- O endpoint é implementado como uma função serverless (conceitualmente uma rota `POST /api/send-os-email`) que: valida o payload (destinatário, assunto, corpo), prepara o remetente e dispara o envio ao provedor de SMTP ou serviço transacional.
- Em caso de falha no envio (API indisponível ou sem configuração), o front-end possui fallback para `mailto:` (abertura do cliente de e-mail local) para facilitar envio manual.

Comportamento e garantias

- Validações: o servidor valida `to`, `subject` e `html/text` mínimos antes de tentar enviar.
- Rate limiting: o envio aplica um limite simples por IP para evitar abuso (best-effort). Se o limite for excedido, o endpoint retorna erro apropriado e o front mostra mensagem ao usuário.
- Idempotência: envios podem ser marcados com flags/ids para evitar duplicação em re-submits.
- Timeout curto: a função de envio tem timeout reduzido para evitar travamentos na UI; operações de envio muito longas devem ser reencaminhadas a jobs assíncronos.
- Logs: resultados de envio (sucesso/falha) devem ser registrados localmente no `NOTIFICATIONS_LOG` (no `localStorage`) e/ou enviados para um backend de logs quando existir.

Boas práticas operacionais

- Não incluir credenciais em arquivos públicos; manter segredos em um local seguro (cofre/env vars no deploy).
- Para produção em escala, utilizar provedores transacionais (SendGrid, Postmark, Resend) e configurar SPF/DKIM/DMARC no DNS do domínio.
- Monitorar filas de falha e implementar retries exponenciais quando apropriado.

Onde está a implementação

- Implementação de referência: `api/send-os-email.js` (função usada no repositório como exemplo). Use-a apenas como modelo — para produção prefira integrar um serviço transacional e mover lógica crítica de retry/log para um backend mais robusto.

Observação

- Este arquivo contém a explicação do fluxo e recomendações. As instruções passo-a-passo de deploy e configuração de plataformas (ex.: Vercel, variáveis de ambiente detalhadas) foram removidas dos documentos principais e não aparecem aqui; se precisar delas, posso restaurar um guia separado com passos controlados e sensíveis ao ambiente.
