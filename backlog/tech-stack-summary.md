# Tech Stack Summary

Quick reference for all technologies used in the Prompt Builder project.

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | App Router framework, server-side capabilities, API routes |
| **React** | Component-based UI, state management |
| **TypeScript** | Type safety across components |
| **Tailwind CSS** | Utility-first styling, responsive layout |
| **Custom CSS** | Glassmorphism effects, animations (`globals.css`) |
| **Lucide React** | Icon system (Copy, Download, Wand, etc.) |
| **Anthropic SDK** | Claude Sonnet 4 Vision API integration for image analysis |

## Dependencies

From `package.json`:
- `next`, `react`, `react-dom` - Core framework
- `@anthropic-ai/sdk` - Claude Vision API integration
- `lucide-react` - Icons
- `clsx`, `tailwind-merge` - Class name utilities
- `typescript` - Type checking

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, dark theme |
| `app/page.tsx` | Main page with PromptBuilder |
| `app/globals.css` | CSS variables, glassmorphism utilities |
| `app/api/analyze-image/route.ts` | Vision API endpoint for image analysis |
| `components/prompt-builder.tsx` | Main state container, API integration |
| `components/section-examples.tsx` | File upload, Agent Analysis UI |
| `lib/utils.ts` | `cn()` helper for class merging |

## Environment Variables

| Variable | Purpose | Location |
|----------|---------|----------|
| `ANTHROPIC_API_KEY` | Claude API authentication | `.env.local` (local), Vercel (production) |
