"use client";

import { useState } from "react";
import { SectionTask } from "./section-task";
import { SectionUpload } from "./section-upload";
import { GeneratedPrompt } from "./generated-prompt";
import { Button } from "./ui/button";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface UploadedImage {
  name: string;
  size: number;
  data: string; // base64, no data: prefix
  mediaType: string;
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PromptBuilder() {
  const { t } = useI18n();
  const [task, setTask] = useState("");
  const [code, setCode] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [model, setModel] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const handleFilesUpload = async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    const newImages = await Promise.all(
      imageFiles.map(async (f) => ({
        name: f.name,
        size: f.size,
        data: await readAsBase64(f),
        mediaType: f.type,
      })),
    );
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const canGenerate =
    !isGenerating && (task.trim() || code.trim() || images.length > 0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorCode(null);
    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          code,
          images: images.map(({ data, mediaType }) => ({ data, mediaType })),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorCode(result.code || "unknown");
        return;
      }
      setGeneratedPrompt(result.prompt);
      setModel(result.model ?? null);
    } catch (err) {
      console.error("Generation error:", err);
      setErrorCode("unknown");
    } finally {
      setIsGenerating(false);
    }
  };

  const errorKey =
    errorCode === "rate_limited"
      ? "error.rateLimited"
      : errorCode === "overloaded"
        ? "error.overloaded"
        : errorCode === "config"
          ? "error.config"
          : "error.unknown";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 h-full">
      {/* Left Column: Inputs */}
      <div className="space-y-6 overflow-y-auto custom-scrollbar">
        <SectionTask task={task} onTaskChange={setTask} />

        <SectionUpload
          uploadedFiles={images.map((img) => ({
            name: img.name,
            size: img.size,
          }))}
          onFilesUpload={handleFilesUpload}
          onFileRemove={handleFileRemove}
          code={code}
          onCodeChange={setCode}
        />

        <div className="space-y-3">
          {errorCode && (
            <div className="flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1 space-y-2">
                <p>{t(errorKey)}</p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="font-medium text-red-200 underline underline-offset-2 hover:text-white disabled:opacity-50"
                >
                  {t("error.retry")}
                </button>
              </div>
            </div>
          )}
          <Button
            size="lg"
            className="w-full bg-[#f80] text-white hover:bg-[#f60]"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t("generate.loading")}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {t("generate.button")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="lg:sticky lg:top-8 h-fit space-y-6">
        <GeneratedPrompt
          prompt={generatedPrompt}
          onPromptChange={setGeneratedPrompt}
          isGenerating={isGenerating}
          model={model}
        />
      </div>
    </div>
  );
}
