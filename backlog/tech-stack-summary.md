# Tech Stack Summary

Quick reference for all technologies used in the Prompt Builder project.

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | App Router framework, server-side capabilities, API routes |
| **React** | Component-based UI, state management, context (i18n) |
| **TypeScript** | Type safety across components and the LLM layer |
| **Tailwind CSS** | Utility-first styling, responsive layout |
| **Custom CSS** | Theme, gradients, animations (`globals.css`) |
| **Lucide React** | Icon system (Copy, Download, Sparkles, Loader2, etc.) |
| **Anthropic SDK** | Native adapter for Claude (default provider) |
| **OpenAI SDK** | Universal adapter for any OpenAI-compatible provider (OpenRouter, DeepSeek, Moonshot/Kimi, custom) |

## Dependencies

From `package.json`:
- `next`, `react`, `react-dom` - Core framework
- `@anthropic-ai/sdk` - Anthropic/Claude adapter
- `openai` - OpenAI-compatible adapter (OpenRouter, DeepSeek, Moonshot, etc.)
- `lucide-react` - Icons
- `clsx`, `tailwind-merge` - Class name utilities
- `typescript` - Type checking

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, theme, wraps app in `I18nProvider` |
| `app/page.tsx` | Main page: header (+ language switcher), PromptBuilder, footer |
| `app/globals.css` | CSS variables, utilities |
| `app/api/generate-prompt/route.ts` | AI prompt-generation endpoint (provider-agnostic) |
| `components/prompt-builder.tsx` | Main state container, generation orchestration |
| `components/section-task.tsx` | Top "what do you want to build?" task field |
| `components/section-upload.tsx` | Image upload + paste-code context area |
| `components/generated-prompt.tsx` | Editable output box, copy/download |
| `components/language-switcher.tsx` | EN / BR language toggle |
| `lib/llm/provider.ts` | Provider-agnostic LLM layer (Anthropic + OpenAI-compatible adapters) |
| `lib/i18n/translations.ts` | EN + PT (Brazilian) string dictionaries |
| `lib/i18n/context.tsx` | `I18nProvider` + `useI18n` hook (localStorage-persisted) |
| `lib/utils.ts` | `cn()` helper for class merging |

## Environment Variables

The LLM backend is configured entirely via env vars (see `.env.example`).

| Variable | Purpose |
|----------|---------|
| `LLM_PROVIDER` | `anthropic` (default) \| `openrouter` \| `deepseek` \| `moonshot` \| `openai-compatible` |
| `LLM_MODEL` | Model id for the chosen provider (sensible default per provider) |
| `LLM_API_KEY` | API key for the chosen provider |
| `LLM_BASE_URL` | Base URL; auto-filled for known providers, required for `openai-compatible` |
| `LLM_SUPPORTS_VISION` | Optional override for whether the model can analyze images |
| `ANTHROPIC_API_KEY` | Backward-compatible fallback when `LLM_PROVIDER=anthropic` |

Keys live in `.env.local` (gitignored) locally and in Vercel for production.
