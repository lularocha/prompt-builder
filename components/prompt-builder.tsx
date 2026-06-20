"use client";

import { useState } from "react";
import { SectionTask } from "./section-task";
import { SectionUpload } from "./section-upload";
import { GeneratedPrompt } from "./generated-prompt";
import { Button } from "./ui/button";
import { Sparkles, Loader2 } from "lucide-react";

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
  const [task, setTask] = useState("");
  const [code, setCode] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
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
        throw new Error(result.error || "Generation failed");
      }
      setGeneratedPrompt(result.prompt);
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 h-full">
      {/* Left Column: Inputs */}
      <div className="space-y-6 overflow-y-auto custom-scrollbar">
        <h2 className="text-[1.625rem] md:text-[1.75rem] tracking-tight leading-none mb-2 text-blue-400">
          Define what you want to build
        </h2>

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

        <div className="space-y-2">
          <Button
            size="lg"
            className="w-full"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Prompt
              </>
            )}
          </Button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="lg:sticky lg:top-8 h-fit space-y-6">
        <h2 className="text-[1.625rem] md:text-[1.75rem] tracking-tight leading-none mb-2 text-blue-400">
          Get your prompt
        </h2>

        <GeneratedPrompt
          prompt={generatedPrompt}
          onPromptChange={setGeneratedPrompt}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
