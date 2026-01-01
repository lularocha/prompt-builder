# Product Backlog & Implementation Plan

This document outlines the roadmap for advanced features to elevate the Prompt Builder from a static tool to a "smart" assistant.

## Feature 1: Persona Presets
**Goal:** Allow users to quickly assume expert roles tailored to their specific task.

### Implementation Plan
1.  **Data Structure:** Create a `lib/personas.ts` constant file containing preset objects.
    *   *Structure:* `{ id, name, description, systemPrompt }`
    *   *Examples:* "Senior Frontend Architect", "Data Scientist", "DevOps Engineer", "Technical Writer".
2.  **UI Component:**
    *   Add a "Quick Select" mechanism above the Persona text area.
    *   **Recommendation:** Use a **Combobox (Autocomplete Dropdown)**. This is cleaner than a massive list of buttons and allows for many presets.
    *   *Alternative:* A row of clickable "Chips" for the top 3-5 most common personas, plus a "More..." dropdown.
3.  **App Logic:**
    *   Selecting a preset fills the Persona text area.
    *   Allow the user to edit the text after selection (don't lock it).

## Feature 2: AI-Powered "Make it Specific" (Context)
**Goal:** Replace the mock dictionary with real Generative AI to truly refine user input.

### Implementation Plan
1.  **Backend (Next.js API Route):**
    *   Create `app/api/enhance/route.ts`.
    *   Integrate an LLM SDK (e.g., Google Generative AI SDK or OpenAI SDK).
    *   *Prompt logic:* "You are an expert PM. Rewrite this vague requirement to be specific, actionable, and technical: [User Input]"
2.  **Security:**
    *   Use `.env.local` to store API keys. Do NOT expose keys on the client side.
3.  **Frontend:**
    *   Update `handleEnhance` in `section-context.tsx` to `fetch` from the new API endpoint.
    *   Add a "Loading" state (spinner) to the button while waiting for the AI response.

## Feature 3: Smart Constraints & Tech Presets
**Goal:** Suggest technologies based on the project goal (Context) and role (Persona).

### Implementation Plan
1.  **Inference Engine (Rule-based first, then AI):**
    *   *Phase 1 (Rules):* Map keywords in Context to constraints.
        *   If Context contains "mobile" -> Suggest "React Native", "Expo", "iOS/Android".
        *   If Context contains "data" -> Suggest "Python", "Pandas", "SQL".
    *   *Phase 2 (AI):* Send Context to an API that returns a JSON list of recommended tech stacks.
2.  **UI Interaction (Hybrid Approach):**
    *   **"Smart Suggestions" Panel:**
        *   Instead of auto-filling (which might annoy users), display a "Recommended Stack" panel that appears dynamically.
        *   Users click a "+" button next to a suggestion to add it to their constraints.
    *   **Project Type Dropdown:**
        *   A manual override at the top of the Constraints section (e.g., "Template: Full Stack Next.js"). Selecting this pre-fills Next.js, Tailwind, Postgres, etc.

## Feature 4: Multimodal Vision Integration (Agent Analysis)
**Goal:** Automatically analyze uploaded design screenshots or wireframes to extract context and constraints.

### Implementation Plan
1.  **Vision Prompting:** Develop a specialized system prompt for analyzing UI screenshots (identifying colors, spacing, component types, and architectural patterns).
2.  **API Integration:** Use a Vision-capable model (e.g., Gemini 1.5 Pro) in the `app/api/analyze-image` route.
3.  **UI Feedback:**
    *   Show a "Scanning..." animation on the uploaded image thumbnail.
    *   Automatically populate a "Visual Context" summary in the Examples section after the analysis is complete.
    *   Include this visual summary in the final generated prompt.

## UI/UX Design Recommendation
For the best balance of speed and control, I recommend a **Hybrid Interface**:

1.  **For Personas:**
    *   **Dropdown Menu with Search:** Best for selecting from a potentially long list of roles.
    *   *Behavior:* "Select a generic role..." -> Fills text area -> User tweaks the details.

2.  **For Constraints:**
    *   **"As-you-type" Suggestions:** As the user types in the Context field, analyze the text 500ms after they stop typing (debounce).
    *   **Visual Feedback:** A small "Sparkles" icon appears near the Constraints section title: *"Based on your context, we recommend..."*
    *   **One-Click Add:** The suggestions appear as "ghost" badges that become solid/active when clicked.

## Next Steps (Technical)
1.  Set up the **Next.js API Routes** infrastructure to prepare for server-side logic (required for Feature 2).
2.  Define the **Persona JSON schema** and populate it with 5-10 high-quality starting roles.
3.  Design the **Auto-Suggestion UI component** for the Constraints section.
