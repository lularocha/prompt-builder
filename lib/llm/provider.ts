import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

/**
 * Provider-agnostic LLM layer.
 *
 * Configured entirely through environment variables so the app can target
 * Claude, DeepSeek, Kimi/Moonshot, or any model reachable via OpenRouter or a
 * direct OpenAI-compatible endpoint — without code changes.
 *
 *   LLM_PROVIDER        anthropic | openrouter | deepseek | moonshot | openai-compatible
 *   LLM_MODEL           model id for the chosen provider
 *   LLM_API_KEY         api key (falls back to ANTHROPIC_API_KEY when provider=anthropic)
 *   LLM_BASE_URL        base url; required for openai-compatible, optional override otherwise
 *   LLM_SUPPORTS_VISION true | false; defaults inferred from the provider
 */

export type ProviderId =
  | "anthropic"
  | "openrouter"
  | "deepseek"
  | "moonshot"
  | "openai-compatible";

export interface LlmImage {
  /** base64-encoded image data (no data: prefix) */
  data: string;
  /** mime type, e.g. "image/png" */
  mediaType: string;
}

export interface GenerateOptions {
  system: string;
  text: string;
  images?: LlmImage[];
  maxTokens?: number;
}

interface ProviderPreset {
  baseURL?: string;
  defaultModel: string;
  supportsVision: boolean;
}

const PRESETS: Record<ProviderId, ProviderPreset> = {
  anthropic: {
    defaultModel: "claude-sonnet-4-5",
    supportsVision: true,
  },
  openrouter: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultModel: "anthropic/claude-sonnet-4.5",
    supportsVision: true,
  },
  deepseek: {
    baseURL: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    supportsVision: false,
  },
  moonshot: {
    baseURL: "https://api.moonshot.cn/v1",
    defaultModel: "moonshot-v1-8k",
    supportsVision: false,
  },
  "openai-compatible": {
    defaultModel: "",
    supportsVision: false,
  },
};

interface ResolvedConfig {
  provider: ProviderId;
  model: string;
  /** Human-friendly label for display (LLM_MODEL_LABEL, falls back to model id). */
  label: string;
  apiKey: string;
  baseURL?: string;
  supportsVision: boolean;
}

export class LlmConfigError extends Error {}

function resolveConfig(): ResolvedConfig {
  const provider = (process.env.LLM_PROVIDER || "anthropic") as ProviderId;
  const preset = PRESETS[provider];

  if (!preset) {
    throw new LlmConfigError(
      `Unknown LLM_PROVIDER "${provider}". Use one of: ${Object.keys(PRESETS).join(", ")}.`,
    );
  }

  const apiKey =
    process.env.LLM_API_KEY ||
    (provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : undefined) ||
    "";

  if (!apiKey) {
    throw new LlmConfigError(
      `No API key configured. Set LLM_API_KEY${provider === "anthropic" ? " (or ANTHROPIC_API_KEY)" : ""}.`,
    );
  }

  const model = process.env.LLM_MODEL || preset.defaultModel;
  if (!model) {
    throw new LlmConfigError(
      `No model configured. Set LLM_MODEL for provider "${provider}".`,
    );
  }

  const baseURL = process.env.LLM_BASE_URL || preset.baseURL;
  if (provider === "openai-compatible" && !baseURL) {
    throw new LlmConfigError(
      `Provider "openai-compatible" requires LLM_BASE_URL to be set.`,
    );
  }

  const supportsVision =
    process.env.LLM_SUPPORTS_VISION != null
      ? process.env.LLM_SUPPORTS_VISION === "true"
      : preset.supportsVision;

  const label = process.env.LLM_MODEL_LABEL || model;

  return { provider, model, label, apiKey, baseURL, supportsVision };
}

export interface GenerateResult {
  text: string;
  /** Display label of the model that produced the text. */
  model: string;
}

/** Generate text from the configured provider. */
export async function generateText(
  options: GenerateOptions,
): Promise<GenerateResult> {
  const config = resolveConfig();
  const maxTokens = options.maxTokens ?? 4096;
  const images = config.supportsVision ? options.images ?? [] : [];

  // If the provider can't see images but some were supplied, note that in text
  // so the model still knows uploads existed.
  let text = options.text;
  if (!config.supportsVision && (options.images?.length ?? 0) > 0) {
    text += `\n\n(Note: ${options.images!.length} image(s) were uploaded but the configured model is text-only, so they could not be analyzed.)`;
  }

  const generated =
    config.provider === "anthropic"
      ? await generateWithAnthropic(config, { ...options, text, images }, maxTokens)
      : await generateWithOpenAICompatible(
          config,
          { ...options, text, images },
          maxTokens,
        );

  return { text: generated, model: config.label };
}

async function generateWithAnthropic(
  config: ResolvedConfig,
  options: GenerateOptions,
  maxTokens: number,
): Promise<string> {
  const client = new Anthropic({ apiKey: config.apiKey, baseURL: config.baseURL });

  const content: Anthropic.ContentBlockParam[] = [];
  for (const img of options.images ?? []) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType as "image/png",
        data: img.data,
      },
    });
  }
  content.push({ type: "text", text: options.text });

  const response = await client.messages.create({
    model: config.model,
    max_tokens: maxTokens,
    system: options.system,
    messages: [{ role: "user", content }],
  });

  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("No text response from the model.");
  }
  return block.text;
}

async function generateWithOpenAICompatible(
  config: ResolvedConfig,
  options: GenerateOptions,
  maxTokens: number,
): Promise<string> {
  const client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL });

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];
  for (const img of options.images ?? []) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:${img.mediaType};base64,${img.data}` },
    });
  }
  userContent.push({ type: "text", text: options.text });

  const response = await client.chat.completions.create({
    model: config.model,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: options.system },
      { role: "user", content: userContent },
    ],
  });

  const message = response.choices[0]?.message?.content;
  if (!message) {
    throw new Error("No text response from the model.");
  }
  return message;
}
