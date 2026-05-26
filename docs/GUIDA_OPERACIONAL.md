# Guia Operacional — Fluxo Resumido

Objetivo: fornecer um guia curto e acionável para coordenadores e consultores, com links para documentação técnica detalhada.

Público: Coordenador de Atendimento, Consultor, Suporte Técnico.

[![Guia](https://img.shields.io/badge/Guia-Operacional-blue)](GUIDA_OPERACIONAL.md) [![Fluxo](https://img.shields.io/badge/Fluxo-Agendamento-green)](FLUXO_AGENDAMENTO_IMPLANTACAO.md) [![Docs](https://img.shields.io/badge/Docs-Index-lightgrey)](INDEX.md)

## Visual rápido

- ✅ Leitura inicial: siga os passos do diagrama abaixo.
- 🧭 Público: coordenador → consultor → cliente.

```mermaid
flowchart LR
	A["1. Cadastrar consultor/empresa"] --> B["2. Criar/aplicar template"]
	B --> C["3. Enviar cronograma (PDF e-mail)"]
	C --> D["4. Aprovação do cliente"]
	D --> E["5. Gerar eventos e registros"]
	E --> F["6. Execução (atend./treino/tarefas)"]
	F --> G["7. Gerar e enviar OS"]
	G --> H["8. Assinatura e fechamento"]
```


Sumário rápido
- Propósito e papéis
- Fluxo principal (resumido)
- Principais ações por papel
- Links rápidos para documentação detalhada

Fluxo principal (resumido)
1. Cadastrar consultor e empresa.
2. Criar (ou aplicar) template → montar cronograma.
3. Enviar cronograma para aprovação (PDF/Excel + e-mail).
4. Cliente aprova → cronograma confirmado e bloqueado.
5. Sistema gera eventos e registros; execução começa.
6. Registrar atendimentos/treinamentos/tarefas; gerar OS quando necessário.
7. Gerar e enviar OS (PDF + e-mail/WhatsApp); marcar como assinada.

Ações rápidas por papel
- Coordenador: cadastrar consultores/empresas, criar templates, revisar cronogramas, enviar para cliente.
- Consultor: confirmar disponibilidade, executar treinamentos, registrar horas, gerar OS.
- Cliente: aprovar cronogramas, confirmar horários, assinar OS.

 - Manual Unificado (Visual, Componentes, Lógicas e Fluxo): [docs/01_04_manual_unificado.md](docs/01_04_manual_unificado.md#L1)

Sugestões de uso
- Ler este guia antes de abrir o fluxo mestre completo.
- Usar os arquivos em `docs/` como referência quando precisar de detalhes técnicos ou tabelas.
- Ao documentar alterações, preferir atualizar o arquivo técnico específico em `docs/` e linkar aqui.

Próximos artefatos recomendados
<!-- Acceptance checklists removed -->
