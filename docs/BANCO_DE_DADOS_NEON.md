# Banco de dados Neon (PostgreSQL)

Este guia explica como ligar o app ao **Neon** para que o **link de assinatura de OS
funcione em qualquer dispositivo do cliente**.

## Por que isso é necessário

O app guarda tudo no `localStorage` do navegador que criou a OS. Quando o cliente
abre o link em outro celular/computador, aquele navegador não tem os dados — por isso
aparecia *"Ordem de Serviço não encontrada ou link expirado"*.

Com o Neon, ao enviar/copiar o link a OS é **publicada no banco**. O navegador do
cliente busca a OS pelo `id` + `token` e consegue abrir e assinar. A assinatura volta
para o banco e é sincronizada de volta ao admin quando ele abre a OS.

> Sem `DATABASE_URL` configurada, o app continua funcionando em modo local (o link só
> abre no mesmo navegador). Nada quebra — apenas o compartilhamento entre dispositivos
> fica indisponível.

---

## Passo a passo

### 1. Criar o projeto no Neon

1. Acesse <https://neon.tech> e crie uma conta grátis.
2. Crie um projeto (região sugerida: **AWS South America (São Paulo)** para menor latência).
3. Em **Dashboard → Connection string**, copie a opção **"Pooled connection"**
   (o host contém `-pooler`). Exemplo:

   ```
   postgresql://usuario:senha@ep-xxxx-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
   ```

> Use sempre a string **com `-pooler`** — funções serverless abrem muitas conexões
> curtas e o pooler evita esgotar o limite do banco.

### 2. Criar a tabela (opcional)

O app cria a tabela automaticamente na primeira chamada. Se quiser criar/conferir
manualmente, abra o **SQL Editor** do Neon e rode o conteúdo de
[`db/schema.sql`](../db/schema.sql).

### 3. Configurar a variável de ambiente

**Na Vercel** (produção): Project → **Settings → Environment Variables** → adicione:

| Nome           | Valor                                    |
| -------------- | ---------------------------------------- |
| `DATABASE_URL` | *(a connection string com `-pooler`)*    |

Aplique a **Production** (e Preview, se usar). Depois faça um **Redeploy**.

**Localmente** (`vercel dev`): copie `.env.example` para `.env.local` e preencha
`DATABASE_URL`.

### 4. Instalar a dependência

```bash
npm install
```

Isso instala `@neondatabase/serverless` (já listado no `package.json`).

---

## Como testar

1. **Health check** — abra no navegador: `https://SEU-APP/api/os`
   Deve responder algo como `{"service":"...","ready":true}`.
   Se `ready:false`, a `DATABASE_URL` não está chegando na função.

2. **Fluxo real:**
   - No app, abra uma OS → **"Enviar para assinatura online"** (ou copie o link).
   - Abra o link em **outro dispositivo** (ou aba anônima) → a OS deve carregar.
   - Assine → volte ao admin, reabra a OS → o status vira **"assinada"** com a assinatura.

---

## Endpoint `/api/os` (referência)

| Ação            | Requisição                                                        |
| --------------- | ----------------------------------------------------------------- |
| Ler OS          | `GET /api/os?id=<osId>&token=<token>`                             |
| Publicar OS     | `POST /api/os` → `{ "action":"save", "id", "token", "os" }`       |
| Registrar assin.| `POST /api/os` → `{ "action":"sign", "id", "token", "signature" }`|

O `token` (24 caracteres aleatórios, gerado no front) funciona como chave de acesso:
toda leitura/escrita exige `id` + `token` corretos.

## Segurança e privacidade

- O `payload` guarda um snapshot da OS (dados que o cliente já veria de qualquer forma).
- Quem não tiver o `token` não consegue ler nem alterar a OS.
- Considere uma rotina de limpeza periódica de OS antigas (ex.: `delete from public_os
  where updated_at < now() - interval '180 days'`), conforme sua política de retenção.
