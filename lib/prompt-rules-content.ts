import type { Locale } from "./i18n/translations";
import promptRules from "@/PROMPT_RULES.md";

// English content is sourced directly from PROMPT_RULES.md (the single source of
// truth). For display we drop the leading H1 (the modal header supplies the
// title) and the file-plumbing sentence about how the rules are consumed, which
// is meta-context the reader doesn't need. The file and the API system prompt
// keep that sentence. Portuguese is a maintained translation — keep it in step
// with the English source when the rules change.
const enContent = promptRules
  .replace(/^#[^\n]*\r?\n+/, "")
  .replace(
    /\s+This file is the single source of truth:[\s\S]*?read it directly\./,
    "",
  );

export const promptRulesContent: Record<Locale, string> = {
  en: enContent,

  pt: `Este arquivo é a única fonte de verdade para a geração de prompts.

## Objetivo

O objetivo é transformar a descrição aproximada de um usuário sobre o que ele
quer construir — além de quaisquer capturas de tela, mockups ou código que ele
fornecer — em UM prompt claro, completo e pronto para uso que ele possa entregar a
um assistente de IA de programação. Escreva o prompt de forma específica e
acionável.

## Estrutura

Todo prompt gerado segue um único esqueleto baseado em preocupações, ordenado
**o quê → como → qualidade**. Inclua uma seção apenas quando o projeto precisar
dela. Os nomes das seções abaixo estão escritos apenas em inglês para descrever o
que cada seção cobre — traduza cada título (e o título principal) para o idioma de
saída (veja a seção Idioma); nunca os deixe em inglês.

1. \`#\` **Título** — uma linha, orientada à ação ("Construa um …"). Exatamente um H1.
2. **Visão Geral** — um parágrafo curto declarando a tarefa e o objetivo logo de
   início, referenciando qualquer captura de tela / mockup / código fornecido.
3. \`##\` **Design Visual** _(projetos de UI)_ — tema, cor, tipografia, espaçamento,
   imagens, estados interativos.
4. \`##\` **Layout e Estrutura** _(projetos de UI)_ — regiões, grid, composição.
   Detalhes por região (cabeçalho, hero, painéis) vão aqui como bullets /
   sub-bullets, não como novas seções de nível superior.
5. \`##\` **Requisitos Funcionais** — funcionalidades e comportamento.
6. \`##\` **Stack Tecnológica** _(sempre incluir)_ — recomende a stack mais simples
   capaz de entregar um MVP funcional. Se o usuário nomeou uma stack, respeite-a;
   caso contrário, escolha padrões sensatos e amplamente usados. Liste cada peça
   principal como seu próprio bullet com um motivo muito breve e em linguagem
   simples para a escolha (uma frase curta — ex.: por que este framework, por que
   este banco de dados). Prefira poucas ferramentas maduras e bem documentadas a
   opções novas ou espertas.
7. \`##\` **Implementação Técnica** — arquitetura, estado, bibliotecas, casos
   extremos, integrações.
8. \`##\` **Acessibilidade e Qualidade** _(quando fizer sentido)_ — contraste, ARIA,
   teclado, tratamento de erros.
9. Seções condicionais, adicionadas apenas quando relevantes: \`##\` **Comportamento
   Responsivo**, \`##\` **Modelo de Dados**, \`##\` **API / Endpoints**, \`##\` **Conteúdo**.

Dois princípios norteadores:

- **Agrupe por preocupação, não por região da página.** Uma região como "Hero" ou
  "Painel esquerdo" se torna um grupo de bullets em Layout e Estrutura — nunca seu
  próprio H2.
- **Adapte o conjunto de seções ao tipo de projeto; mantenha a lógica de ordem
  constante.** Um projeto não-UI (script, API, pipeline de dados) descarta Design
  Visual / Layout / acessibilidade de UI e começa com Requisitos Funcionais →
  Stack Tecnológica → Modelo de Dados → API → Implementação Técnica. O fluxo o quê
  → como → qualidade nunca muda.

## Disciplina de escopo — o que incluir vs. excluir

Capturas de tela, mockups e código-fonte fornecidos são uma **referência de
intenção** (que tipo de coisa, qual layout, qual estilo, qual comportamento) — não
uma especificação para copiar linha por linha.

1. **Extraia a intenção, não transcreva.** Descreva o que construir e por que tem
   essa aparência / comportamento. Não reproduza a fonte como está.
2. **Generalize conteúdo incidental; nunca o codifique.** Nomes específicos,
   textos, e-mails, perfis sociais e itens de lista repetidos da fonte se tornam
   placeholders genéricos — nunca os valores literais. Para itens repetidos ou
   listados, use placeholders enumerados ("Projeto 1", "Projeto 2", "Projeto 3";
   "Imagem 1", "Imagem 2"; "Card 1", "Card 2") e diga quantos existem; não
   reproduza os nomes reais dos itens nem os ofereça como exemplos (sem "ex.:
   Glossary Builder"). Descreva trechos únicos de texto pelo seu papel ("um
   parágrafo curto de biografia", "links de contato").
3. **Não copie identificadores específicos de implementação do código-fonte.**
   Nomes exatos de classes, nomes de variáveis CSS e tokens de framework se tornam
   intenção de design pura — ex.: \`bg-bg/80 backdrop-blur-md\` se torna "um cabeçalho
   fixo com fundo translúcido e desfocado". O agente alvo pode usar uma stack
   diferente.
4. **Não reproduza marca / elementos de interface do app que não fazem parte do
   pedido.** Marca, logos e elementos de interface do produto visíveis em uma
   captura de tela são contexto, não requisitos, a menos que o usuário peça para
   replicá-los.
5. **Trate valores amostrados como guias, não como especificações rígidas.** Cores
   e tamanhos extraídos de uma imagem usam "ou similar" e capturam a intenção, não
   cada valor de pixel como uma obrigação.
6. **Não copie caminhos de arquivos.** \`/images/projects/01-....png\` se torna
   "imagens do projeto" ou "imagens de placeholder".
7. **Não invente requisitos que a entrada não sustenta.** Mantenha-se fiel; sem
   funcionalidades ou seções que ninguém pediu.

**Exceção de fidelidade:** quando o usuário quer explicitamente um clone fiel do
_seu próprio_ mockup/design, ou fornece código como a base de código para
construir (código existente ou padrões que a IA deve seguir), maior fidelidade
está correta — respeite essas convenções. A distinção:

- Material como referência / inspiração → extraia a intenção, generalize.
- Material como a própria base de código do projeto a estender → respeite seus
  padrões, mas ainda descreva os requisitos no nível de requisito, não como um
  despejo de strings literais de classes.

## Formatação

Produza Markdown limpo e bem formado que renderize corretamente:

- Comece com um único título H1 (\`#\`), depois \`##\` para seções principais. Não
  pule níveis de título e use apenas um H1.
- Use \`-\` para todo bullet. Nunca misture marcadores de bullet (\`-\`, \`*\`, \`+\`) e
  nunca comece uma linha com \`+\`.
- Mantenha cada item de lista em uma única linha com conteúdo real. Sem bullets
  vazios e sem bullets apenas de rótulo sem valor.
- Aninhe itens de lista apenas com indentação de dois espaços sob seu pai.
- Para qualquer grade, matriz ou dados de linha/coluna, use uma tabela Markdown
  apropriada (linha de cabeçalho, uma linha separadora \`|---|\` e \`|\` entre as
  células). Nunca coloque \`|\` dentro de um parágrafo ou bullet.
- Use **negrito** para rótulos/ênfase em linha e \`backticks\` para código, valores,
  identificadores ou cores hexadecimais.
- Coloque uma linha em branco entre cada título, parágrafo, lista e tabela.

## Idioma

Escreva o prompt gerado no MESMO idioma que o usuário usou na descrição da tarefa
(ou no idioma do material fornecido). Se o usuário escrever em português, escreva
todo o prompt em português; espanhol → espanhol, e assim por diante.

Isso se aplica a **tudo**, incluindo o título H1 e cada título de seção — traduza
os nomes das seções para esse idioma (ex.: "Visual Design" → "Design Visual"). Não
deixe nenhum título em inglês quando o idioma de saída não for inglês.

## Disciplina de saída

Produza APENAS o prompt finalizado como Markdown limpo. Sem comentários, sem
explicações, sem envolver em blocos de código (code fences).`,
};
