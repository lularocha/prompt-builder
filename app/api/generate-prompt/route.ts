import { NextRequest, NextResponse } from "next/server";
import { generateText, LlmConfigError, LlmImage } from "@/lib/llm/provider";

interface GeneratePromptRequest {
  task?: string;
  images?: LlmImage[];
  code?: string;
}

const SYSTEM_PROMPT = `You are a senior prompt engineer. Your job is to turn a user's rough description of what they want to build — plus any screenshots, mockups, or code they provide — into ONE clear, complete, ready-to-use prompt that they can hand to an AI coding assistant.

Write the prompt so it is specific and actionable:
- State the task and goal up front.
- Infer sensible requirements (features, layout, visual style, interactions) from the description and any images.
- Recommend a concrete tech stack only when it is implied or clearly appropriate.
- Include relevant behavioral constraints and quality standards (accessibility, responsiveness, error handling) where they make sense.
- If code was provided, respect its existing patterns and conventions.

Write the generated prompt in the SAME language the user used in their task description (or in the language of the provided material). For example, if the user writes in Portuguese, write the entire prompt in Portuguese; if in Spanish, respond in Spanish, and so on.

Format the output as clean, well-formed Markdown that renders correctly:
- Start with a single H1 (#) title, then use H2 (##) for major sections. Do not skip heading levels and use only one H1.
- Use "-" for every bullet. Never mix bullet markers (-, *, +) and never begin a line with "+".
- Keep each list item to a single line with real content. Do not output empty bullets or bullets that contain only a label with no value.
- Nest list items only with two-space indentation under their parent bullet.
- For any grid, matrix, or row/column data, use a proper Markdown table (header row, a |---| separator row, and | between cells). Never put "|" separators inside a paragraph or a bullet.
- Use **bold** for inline labels/emphasis and \`backticks\` for code, values, identifiers, or hex colors.
- Put a blank line between every heading, paragraph, list, and table.

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

    if (error instanceof LlmConfigError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Generation failed: ${message}` },
      { status: 500 },
    );
  }
}
