# Implementation Plan (Current State)

> **Status**: Reflects the app after the 2026 redesign to an AI-generated,
> provider-agnostic prompt builder with internationalization.

---

## Goal Description

A focused web app where the user describes what they want to build (and/or
uploads a screenshot/mockup or pastes code), and AI **writes a ready-to-use
prompt** for them. The generated prompt appears in an editable panel on the
right. The LLM backend is provider-agnostic, and the UI is available in
English and Brazilian Portuguese.

## Implementation Summary

### Tech Stack (Implemented)

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + custom CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **AI Integration**: Provider-agnostic layer — Anthropic SDK (Claude) +
  OpenAI SDK (OpenRouter, DeepSeek, Moonshot/Kimi, any OpenAI-compatible API)
- **Markdown preview**: react-markdown + remark-gfm (Notion-style modal)
- **Export**: `docx` for Word export; client-side Markdown blob for `.md`
- **i18n**: Lightweight custom solution (React context + dictionaries), no deps

### Directory Structure (Actual)

```
prompt-builder/
  ├── app/
  │   ├── api/
  │   │   └── generate-prompt/
  │   │       └── route.ts       # AI prompt generation (provider-agnostic)
  │   ├── layout.tsx             # Root layout, wraps app in I18nProvider
  │   ├── page.tsx               # Header + switcher, PromptBuilder, footer
  │   └── globals.css            # Global styles, CSS variables
  ├── components/
  │   ├── prompt-builder.tsx     # Main container + generation orchestration
  │   ├── section-task.tsx       # Task input (top of left column)
  │   ├── section-upload.tsx     # Image upload + paste-code
  │   ├── generated-prompt.tsx   # Editable output box, preview modal, .md/.docx export
  │   ├── markdown-preview.module.css # Notion-style preview styles
  │   ├── language-switcher.tsx  # EN / BR toggle
  │   └── ui/                    # Reusable UI primitives (button, card, etc.)
  ├── lib/
  │   ├── llm/
  │   │   └── provider.ts        # Provider-agnostic LLM layer
  │   ├── markdown-to-docx.ts    # Markdown → Word (.docx) conversion
  │   ├── i18n/
  │   │   ├── translations.ts    # EN + PT dictionaries
  │   │   └── context.tsx        # I18nProvider + useI18n hook
  │   └── utils.ts               # cn() helper
  ├── PROMPT_RULES.md            # Source-of-truth rules for prompt generation
  ├── backlog/                   # Documentation & roadmap
  ├── .env.example               # Documented LLM provider settings
  └── [config files]
```

### Components Implemented

| Component                      | Features                                                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prompt-builder.tsx`           | Holds task/code/image/output state; reads images to base64; POSTs to `/api/generate-prompt`; Generate button with loading; translated error banner with Retry |
| `section-task.tsx`             | "What do you want to build?" textarea                                                                                                                         |
| `section-upload.tsx`           | Image dropzone, uploaded-file list, paste-code textarea                                                                                                       |
| `generated-prompt.tsx`         | Editable `<textarea>` output (blue panel); Notion-style preview modal; copy + `.md`/`.docx` export; loading + empty states                                    |
| `markdown-preview.module.css`  | Scoped Notion-style styles for the preview modal                                                                                                              |
| `language-switcher.tsx`        | EN / BR buttons, persists choice to localStorage                                                                                                              |
| `api/generate-prompt/route.ts` | System prompt mirrored from `PROMPT_RULES.md`; calls the provider layer; returns `{ prompt }`; matches input language; classifies errors into codes           |
| `lib/llm/provider.ts`          | Resolves provider config from env; Anthropic + OpenAI-compatible adapters; per-provider vision handling                                                       |
| `lib/markdown-to-docx.ts`      | Converts the prompt Markdown into a Word `.docx` blob (lazy-loaded)                                                                                           |

---

## What Was Delivered

- Task-first input: a prominent "what do you want to build?" field
- Optional context: image/screenshot upload + paste-code
- **AI-generated prompts** (no longer client-side concatenation) via a single
  multimodal call
- **Rule-driven generation**: the system prompt is mirrored from
  `PROMPT_RULES.md` (consistent structure, scope discipline, formatting)
- **Editable** output panel (was read-only); copy/download use the edited text
- **Formatted preview**: Notion-style modal (react-markdown + remark-gfm)
- **Export**: download as Markdown (`.md`) or Word (`.docx`)
- **Graceful error handling**: rate-limit / overloaded / credit / config errors
  classified server-side and shown as a translated inline banner with Retry
- **Provider-agnostic LLM backend** configurable by env (Claude, OpenRouter,
  DeepSeek, Moonshot/Kimi, or any OpenAI-compatible endpoint)
- Generated prompt **follows the user's input language** (any language,
  including translated section headings)
- **Internationalization**: English + Brazilian Portuguese UI, EN/BR switcher
  in the header (replaced the old "Learn +" modal), choice persisted
- Responsive layout; the output editor uses a 600px min-height so it fills
  mobile screens without scrolling

## Notes / removed

- Removed the old form-based flow: System/User prompt sections, the
  suggestion/checkbox vision flow, and the `analyze-image` route.
- Removed the "Learn +" info modal.
