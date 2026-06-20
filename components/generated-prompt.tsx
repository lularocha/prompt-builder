"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Check, Loader2, Download } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";

// Copy text with a clipboard-API path and a legacy execCommand fallback (iOS).
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// Save a blob via the native share sheet when possible (reliable on iOS),
// falling back to a download link on desktop.
async function saveFile(blob: Blob, filename: string, mimeType: string) {
  const file = new File([blob], filename, { type: mimeType });
  if (
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      // User cancelled — don't also trigger a download.
      if (err instanceof DOMException && err.name === "AbortError") return;
      // Otherwise fall through to the download fallback.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface GeneratedPromptProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  isGenerating: boolean;
  model?: string | null;
}

export function GeneratedPrompt({
  prompt,
  onPromptChange,
  isGenerating,
  model,
}: GeneratedPromptProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [buildingDocx, setBuildingDocx] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(prompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Base filename from the prompt's first markdown heading, if any.
  const deriveBaseName = () => {
    const heading = prompt.match(/^\s*#{1,6}\s+(.+?)\s*$/m)?.[1];
    const slug = (heading ?? "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "") // strip accents
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .replace(/^-+|-+$/g, "");
    return slug || "generated-prompt";
  };

  const handleDownloadMd = () => {
    // Prepend a UTF-8 BOM so viewers (e.g. on Android) detect the encoding
    // and render Unicode math symbols correctly.
    const blob = new Blob(["﻿" + prompt], {
      type: "text/markdown;charset=utf-8",
    });
    return saveFile(blob, `${deriveBaseName()}.md`, "text/markdown");
  };

  const handleDownloadDocx = async () => {
    if (!prompt || buildingDocx) return;
    setBuildingDocx(true);
    try {
      const { markdownToDocxBlob } = await import("@/lib/markdown-to-docx");
      const blob = await markdownToDocxBlob(prompt);
      await saveFile(
        blob,
        `${deriveBaseName()}.docx`,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
    } finally {
      setBuildingDocx(false);
    }
  };

  return (
    <Card className="min-h-[600px] flex flex-col lg:border-t-0 lg:pt-0">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-2">
        <CardTitle className="text-[1.5rem] leading-none tracking-tight text-blue-400">
          {t("output.title")}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-primary/20 hover:text-blue-400"
            onClick={handleDownloadMd}
            disabled={!prompt}
          >
            <Download className="w-4 h-4 mr-2" />
            .md
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-primary/20 hover:text-blue-400"
            onClick={handleDownloadDocx}
            disabled={!prompt || buildingDocx}
          >
            {buildingDocx ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            .docx
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-primary/20 hover:text-blue-400"
            onClick={handleCopy}
            disabled={!prompt}
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? t("output.copied") : t("output.copy")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-4 space-y-3">
        <div className="relative flex-1 min-h-[600px] lg:min-h-[600px]">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            spellCheck={false}
            placeholder={isGenerating ? "" : t("output.placeholder")}
            className="absolute inset-0 h-full w-full rounded-md bg-[#000085] p-4 overflow-auto font-mono text-base leading-relaxed text-white placeholder:text-white/50 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-[#000085]/80 text-white">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t("output.generating")}
            </div>
          )}
        </div>
        {prompt && model && (
          <p className="text-left text-xs text-muted-foreground">
            {t("output.generatedBy")} {model}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
