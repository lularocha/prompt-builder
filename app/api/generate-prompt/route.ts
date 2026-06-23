import { NextRequest, NextResponse } from "next/server";
import { generateText, LlmConfigError, LlmImage } from "@/lib/llm/provider";
import promptRules from "@/PROMPT_RULES.md";

interface GeneratePromptRequest {
  task?: string;
  images?: LlmImage[];
  code?: string;
}

// Single source of truth: PROMPT_RULES.md (repo root), imported as a raw string
// via the .md webpack rule in next.config.js. Edit the rules in that file.
const SYSTEM_PROMPT = promptRules;

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
