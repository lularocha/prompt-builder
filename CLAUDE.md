# Project notes

## Writing / copy conventions

- **Use standard, correct English — not gender-neutral "singular they."** The
  user's stated personal preference is conventional English usage. Do not write
  the generic user (or similar generic subjects) as "they/them/their"; use
  **he / him / his** with matching verb agreement (e.g. "what he wants", "code
  he provides"). Treating such a subject as "they" is considered a grammar
  mistake here. This applies to prose I write for the user as well as product
  copy. Portuguese follows the same intent with **ele / seu**.

## Prompt Rules modal architecture

- `PROMPT_RULES.md` (repo root) is the **agent / API system prompt** — the
  single source of truth for generation. It is imported directly by
  `app/api/generate-prompt/route.ts`.
- The in-app "Prompt Rules" modal reads **separate per-language display files**,
  not `PROMPT_RULES.md`:
  - `PROMPT_RULES_DISPLAY_EN.md`
  - `PROMPT_RULES_DISPLAY_PT.md`
  These are imported by `lib/prompt-rules-content.ts` and rendered by
  `components/prompt-rules.tsx`. Editing modal copy means editing these files —
  no regex stripping of the agent prompt.
- Keep the display files in step with `PROMPT_RULES.md` when the underlying
  rules change. The display files intentionally omit file-plumbing lines the
  agent prompt keeps (e.g. the "single source of truth" sentence).
