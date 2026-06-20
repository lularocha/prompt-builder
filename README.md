# Prompt Builder

Describe what you want to build — and/or upload a screenshot or paste code —
and AI writes a ready-to-use prompt for you. The generated prompt appears in an
editable panel you can refine, copy, and download. The LLM backend is
provider-agnostic, and the UI is available in English and Brazilian Portuguese.

## Features

- **Task-first input**: A "What do you want to build?" field drives generation
- **Optional context**: Upload a screenshot/mockup or paste code to guide the AI
- **AI prompt generation**: One cohesive, ready-to-use prompt per request
- **Editable output**: Tweak the generated prompt before copying/downloading
- **Provider-agnostic LLM backend**: Claude, OpenRouter, DeepSeek, Moonshot/Kimi,
  or any OpenAI-compatible endpoint — selected via environment variables
- **Input-language aware**: The prompt is written in the language you wrote your
  task in (any language)
- **Internationalization**: English / Brazilian Portuguese (EN / BR) switcher
- **Copy & Download**: Export the prompt as markdown with a project title
- **Responsive**: Works on desktop and mobile

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | App Router framework, API routes |
| **React 18** | Component-based UI, context (i18n) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |
| **Anthropic SDK** | Claude adapter (default provider) |
| **OpenAI SDK** | Adapter for OpenAI-compatible providers |

## Project Structure

```
prompt-builder/
├── app/
│   ├── api/
│   │   └── generate-prompt/   # AI prompt-generation endpoint
│   ├── page.tsx               # Header + switcher, PromptBuilder, footer
│   ├── layout.tsx             # Root layout, wraps app in I18nProvider
│   └── globals.css            # CSS variables, theme
├── components/
│   ├── prompt-builder.tsx     # Main state container & generation orchestration
│   ├── section-task.tsx       # Task input
│   ├── section-upload.tsx     # Image upload + paste-code
│   ├── generated-prompt.tsx   # Editable output panel
│   ├── language-switcher.tsx  # EN / BR toggle
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── llm/provider.ts        # Provider-agnostic LLM layer
│   ├── i18n/                  # Translations + context/hook
│   └── utils.ts               # cn() helper
├── backlog/                   # Product roadmap & documentation
└── public/                    # Static assets
```

## Getting Started

```bash
# Install dependencies
npm install

# Configure your LLM provider
cp .env.example .env.local   # then edit it (see below)

# Run development server
npm run dev

# Build for production
npm run build
```

Open the localhost URL shown in your terminal.

## Configuration

The LLM backend is configured entirely through environment variables — see
`.env.example` for the full list. Defaults work with Claude:

```bash
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

Switch providers without code changes, e.g. DeepSeek:

```bash
LLM_PROVIDER=deepseek
LLM_API_KEY=sk-...
# LLM_MODEL=deepseek-chat   # optional; sensible default per provider
```

Supported `LLM_PROVIDER` values: `anthropic` (default), `openrouter`,
`deepseek`, `moonshot`, and `openai-compatible` (requires `LLM_BASE_URL`).

## Status

Redesigned into an AI-generated, provider-agnostic prompt builder with an
editable output panel and EN/BR internationalization. See
`backlog/product_roadmap.md` for future plans.
