# Tech Stack Summary

Quick reference for all technologies used in the Prompt Builder project.

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | App Router framework, server-side capabilities |
| **React** | Component-based UI, state management |
| **TypeScript** | Type safety across components |
| **Tailwind CSS** | Utility-first styling, responsive layout |
| **Custom CSS** | Glassmorphism effects, animations (`globals.css`) |
| **Lucide React** | Icon system (Copy, Download, Wand, etc.) |

## Dependencies

From `package.json`:
- `next`, `react`, `react-dom` - Core framework
- `lucide-react` - Icons
- `clsx`, `tailwind-merge` - Class name utilities
- `typescript` - Type checking

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, dark theme |
| `app/page.tsx` | Main page with PromptBuilder |
| `app/globals.css` | CSS variables, glassmorphism utilities |
| `components/prompt-builder.tsx` | Main state container |
| `lib/utils.ts` | `cn()` helper for class merging |
