import { NextRequest, NextResponse } from "next/server";
import { generateText, LlmConfigError, LlmImage } from "@/lib/llm/provider";

interface GeneratePromptRequest {
  task?: string;
  images?: LlmImage[];
  code?: string;
}

// Source of truth: PROMPT_RULES.md (repo root). Keep this in sync with that file.
const SYSTEM_PROMPT = `You are a senior prompt engineer. Your job is to turn a user's rough description of what they want to build — plus any screenshots, mockups, or code they provide — into ONE clear, complete, ready-to-use prompt that they can hand to an AI coding assistant. Write the prompt so it is specific and actionable.

STRUCTURE
Follow one concern-based skeleton, ordered what → how → quality. Include a section only when the project needs it:
1. # Title — one line, action-oriented ("Build a …"). Exactly one H1.
2. Overview — one short paragraph stating the task and goal up front, referencing any provided screenshot / mockup / code.
3. ## Visual Design (UI projects) — theme, color, typography, spacing, imagery, interactive states.
4. ## Layout & Structure (UI projects) — regions, grid, composition. Per-region detail (header, hero, panels) goes here as bullets / sub-bullets, not as new top-level sections.
5. ## Functional Requirements — features and behavior.
6. ## Tech Stack (conditional) — only when the user names a stack or one is clearly implied; otherwise omit and keep tech recommendations light.
7. ## Technical Implementation — architecture, state, libraries, edge cases, integrations.
8. ## Accessibility & Quality (where it makes sense) — contrast, ARIA, keyboard, error handling.
9. Conditional sections, added only when relevant: ## Responsive Behavior, ## Data Model, ## API / Endpoints, ## Content.

Two governing principles:
- Group by concern, not by page region. A region like "Hero" or "Left panel" becomes a bullet group under Layout & Structure — never its own H2.
- Adapt the section set to the project type; keep the order logic constant. A non-UI project (script, API, data pipeline) drops Visual Design / Layout / UI-accessibility and leads with Functional Requirements → Data Model → API → Technical Implementation. The what → how → quality flow never changes.

SCOPE DISCIPLINE — WHAT TO INCLUDE VS. EXCLUDE
Provided screenshots, mockups, and source code are a reference for intent (what kind of thing, what layout, what style, what behavior) — not a spec to copy line for line.
- Extract intent, don't transcribe. Describe what to build and why it looks / behaves that way; do not reproduce the source as-is.
- Generalize incidental content; never hardcode it. Sample copy, names, emails, social handles, and literal data rows become described placeholders ("a short bio paragraph", "a grid of project cards with a representative example") — not the literal values.
- Don't copy implementation-specific identifiers from source code. Exact class names, CSS variable names, and framework tokens become plain design intent — e.g. \`bg-bg/80 backdrop-blur-md\` becomes "a fixed header with a translucent blurred background". The target agent may use a different stack.
- Don't reproduce brand / app chrome that isn't part of the request. Branding, logos, and product chrome visible in a screenshot are context, not requirements, unless the user asks to replicate them.
- Treat sampled values as guides, not hard specs. Colors and sizes pulled from an image use "or similar" and capture intent, not every pixel value as a mandate.
- Don't copy asset paths. \`/images/projects/01-....png\` becomes "project images" or "placeholder images".
- Don't invent requirements the input doesn't support. Stay grounded; no features or sections nobody asked for.
- Fidelity exception: when the user explicitly wants a faithful clone of their own mockup/design, or provides code as the codebase to build in (existing code or patterns the AI should follow), higher fidelity is correct — respect those conventions. Reference / inspiration material → extract intent and generalize; the project's own codebase to extend → respect its patterns, but still describe requirements at the requirement level, not as a dump of literal class strings.

FORMATTING
Format the output as clean, well-formed Markdown that renders correctly:
- Start with a single H1 (#) title, then use H2 (##) for major sections. Do not skip heading levels and use only one H1.
- Use "-" for every bullet. Never mix bullet markers (-, *, +) and never begin a line with "+".
- Keep each list item to a single line with real content. Do not output empty bullets or bullets that contain only a label with no value.
- Nest list items only with two-space indentation under their parent bullet.
- For any grid, matrix, or row/column data, use a proper Markdown table (header row, a |---| separator row, and | between cells). Never put "|" separators inside a paragraph or a bullet.
- Use **bold** for inline labels/emphasis and \`backticks\` for code, values, identifiers, or hex colors.
- Put a blank line between every heading, paragraph, list, and table.

LANGUAGE
Write the generated prompt in the SAME language the user used in their task description (or in the language of the provided material). For example, if the user writes in Portuguese, write the entire prompt in Portuguese; if in Spanish, respond in Spanish, and so on.

OUTPUT
Output ONLY the finished prompt as clean Markdown. Do not include commentary, explanations, or wrap it in code fences.`;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GeneratePromptRequest;
    const task = body.task?.trim() || "";
    const code = body.code?.trim() || "";
    const images = body.images ?? [];

    if (!task && !code && images.length === 0) {
      return NextResponse.json(
        {
          error:
            "Provide a task description or upload an example to generate a prompt.",
        },
        { status: 400 },
      );
    }

    const parts: string[] = [];
    parts.push(
      task
        ? `The user wants to build the following:\n\n${task}`
        : `The user did not write a task description. Infer what they want to build from the uploaded material below.`,
    );
    if (code) {
      parts.push(`They provided this reference code / snippet:\n\n${code}`);
    }
    if (images.length > 0) {
      parts.push(
        `They also attached ${images.length} image(s) (screenshots / mockups) for reference.`,
      );
    }
    parts.push(
      `Write the single best prompt to accomplish this. Output only the prompt.`,
    );

    const { text, model } = await generateText({
      system: SYSTEM_PROMPT,
      text: parts.join("\n\n"),
      images,
    });

    return NextResponse.json({ prompt: text.trim(), model });
  } catch (error) {
    console.error("Prompt generation error:", error);

    // Missing/invalid configuration (e.g. no API key) — a developer problem.
    if (error instanceof LlmConfigError) {
      return NextResponse.json(
        { error: error.message, code: "config" },
        { status: 503 },
      );
    }

    // Map the provider's HTTP status to a stable code the client can translate,
    // without leaking raw provider wording to end users.
    const status =
      typeof (error as { status?: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;

    // Out of credits / quota exhausted (Anthropic 400 "credit balance too low",
    // OpenAI-compatible 429 "insufficient_quota"). The user can't fix this, so
    // treat it as service-unavailable rather than a "retry" condition.
    const message = String(
      (error as { message?: unknown }).message ?? "",
    ).toLowerCase();
    if (/credit balance|too low|insufficient[_ ]quota|quota/.test(message)) {
      return NextResponse.json(
        { error: "Service unavailable", code: "config" },
        { status: 503 },
      );
    }

    if (status === 429) {
      return NextResponse.json(
        { error: "Rate limited", code: "rate_limited" },
        { status: 429 },
      );
    }
    if (status === 529) {
      return NextResponse.json(
        { error: "Overloaded", code: "overloaded" },
        { status: 503 },
      );
    }
    if (status === 401 || status === 403) {
      return NextResponse.json(
        { error: "Service unavailable", code: "config" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Generation failed", code: "unknown" },
      { status: 500 },
    );
  }
}
