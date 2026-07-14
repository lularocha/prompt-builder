import type { Locale } from "./i18n/translations";
import en from "@/PROMPT_RULES_DISPLAY_EN.md";
import pt from "@/PROMPT_RULES_DISPLAY_PT.md";

// The in-app "Prompt Rules" modal reads its own per-language display files,
// kept separate from PROMPT_RULES.md (the agent/API system prompt). This lets
// the modal copy differ from the agent prompt — e.g. omit file-plumbing lines —
// without fragile string surgery. Keep these in step with PROMPT_RULES.md when
// the rules change.
export const promptRulesContent: Record<Locale, string> = {
  en,
  pt,
};
