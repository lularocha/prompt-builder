# Product Roadmap & Feature Status

This document tracks the implementation status and future roadmap for the Prompt Builder application.

**Latest update**: Major redesign — the app now uses AI to **generate** the
prompt (rather than assembling form fields), with a provider-agnostic LLM
backend, an editable output panel, and English/Brazilian-Portuguese i18n.
Since then: rule-driven generation (`PROMPT_RULES.md`), a Notion-style preview
modal, `.md`/`.docx` export, and graceful error handling.

---

## Current Implementation Status

### Completed

- **Task-first input**: A prominent "What do you want to build?" field at the
  top of the left column.
- **Optional context**: Upload a screenshot/mockup (image) and/or paste code to
  guide the AI.
- **AI prompt generation**: A "Generate Prompt" button sends task + images +
  code to the model, which writes one cohesive, ready-to-use prompt. This is a
  real AI call (`app/api/generate-prompt`), not client-side concatenation.
- **Rule-driven output**: Generation follows `PROMPT_RULES.md` — a single
  source-of-truth for structure, scope discipline, formatting, and language
  (mirrored into the system prompt).
- **Editable output**: The blue output panel is an editable textarea; Copy and
  Download use the edited text. Includes loading and empty states.
- **Formatted preview**: A preview modal renders the prompt in a Notion-style
  formatted view (react-markdown + remark-gfm).
- **Graceful error handling**: Rate-limit, overloaded, credit/quota, and config
  errors are classified server-side and shown as a translated inline banner
  with a Retry action.
- **Provider-agnostic LLM backend** (`lib/llm/provider.ts`): configurable via
  env for Anthropic (Claude, default), OpenRouter, DeepSeek, Moonshot/Kimi, or
  any OpenAI-compatible endpoint — no code changes to switch.
  - Anthropic uses `@anthropic-ai/sdk`; all others use the `openai` SDK with a
    configurable `baseURL`.
  - Vision is handled per-provider, with a text-only fallback note.
- **Input-language-aware generation**: The generated prompt is written in the
  same language the user used in their task/material (any language),
  independent of the UI language.
- **Internationalization**: English + Brazilian Portuguese (displayed as
  "BR"). EN/BR switcher in the header; choice persisted to localStorage.
- **Responsive UI**: Two-column layout; sticky output on desktop; 600px
  min-height editor so it fills mobile screens.
- **Copy & Download**: Copy, or export the prompt as Markdown (`.md`) or
  Word (`.docx`).

---

## Configuration

The LLM backend is configured through environment variables (see
`.env.example`):

- `LLM_PROVIDER` — `anthropic` (default) | `openrouter` | `deepseek` |
  `moonshot` | `openai-compatible`
- `LLM_MODEL` — model id (sensible default per provider)
- `LLM_API_KEY` — provider key (falls back to `ANTHROPIC_API_KEY` for Anthropic)
- `LLM_BASE_URL` — required only for `openai-compatible`; presets for known providers
- `LLM_SUPPORTS_VISION` — optional override

---

## Future Features

### More languages

**Status**: Not Started · **Complexity**: Low
Add further locales by extending `lib/i18n/translations.ts` and the switcher.
The architecture already supports arbitrary locales.

### Zip / code-archive upload

**Status**: Not Started · **Complexity**: High
Allow uploading a `.zip` code archive: parse it, let the user select files, and
feed them (within token limits) into generation. Deferred from the v1 redesign.

### Streaming generation

**Status**: Not Started · **Complexity**: Medium
Stream the generated prompt token-by-token into the editor for faster feedback.

### Regenerate / variations

**Status**: Not Started · **Complexity**: Medium
A "regenerate" action and the ability to produce alternative prompt variations,
ideally preserving the user's manual edits.

### Provider/model picker in the UI

**Status**: Not Started · **Complexity**: Medium
Expose provider/model selection in the UI (currently env-only) so users can
switch models without redeploying.

---

## Technical Notes

- **Framework**: Next.js 14+ with App Router
- **API Routes**: `app/api/generate-prompt` for server-side generation
- **AI Provider**: Pluggable via `lib/llm/provider.ts`
- **Environment Variables**: Store keys in `.env.local` (gitignored) and Vercel
- **State Management**: React hooks in `PromptBuilder`; i18n via React context
- **Image Processing**: Client-side base64 conversion, server-side API calls

---

## History (superseded)

The original app was a static, form-based prompt builder: a 2-part
System/User prompt structure with Persona/Constraints/Task/Requirements/Tech
fields, a checkbox-based "Agent Analysis" vision suggestion flow
(`analyze-image` route), and a read-only generated-prompt preview assembled
client-side. That flow — along with the "Learn +" info modal — was removed in
the redesign described above.
