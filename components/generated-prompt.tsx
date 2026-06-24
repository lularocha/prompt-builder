"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Check, Loader2, Download, Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useI18n } from "@/lib/i18n/context";
import styles from "./markdown-preview.module.css";

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
  const [previewOpen, setPreviewOpen] = useState(false);

  // Close the preview on Escape and lock background scroll while it's open.
  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [previewOpen]);

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

  // Export/copy actions, reused in the card header and the preview modal.
  const actionButtons = (
    <>
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
    </>
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-2">
        <CardTitle className="text-[1.5rem] leading-none tracking-tight text-blue-400">
          {t("output.title")}
        </CardTitle>
        <div className="flex flex-wrap gap-0">
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-primary/20 hover:text-blue-400"
            onClick={() => setPreviewOpen(true)}
            disabled={!prompt}
          >
            <Eye className="w-4 h-4 mr-2" />
            {t("output.preview")}
          </Button>
          {actionButtons}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pt-4 space-y-3">
        <div className="relative flex-1 min-h-[600px] lg:min-h-[770px]">
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

      {previewOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-fade-in sm:p-8"
            onClick={() => setPreviewOpen(false)}
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white pb-3 pl-8 pr-3 pt-6 text-gray-600 sm:pl-14">
                <h2 className="text-3xl font-bold tracking-[-0.05rem] text-[#f80]">
                  {t("output.title")}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  {actionButtons}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setPreviewOpen(false)}
                    aria-label={t("output.close")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="overflow-auto bg-white px-8 py-10 sm:px-14 sm:py-12">
                <article className={styles.preview}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {prompt}
                  </ReactMarkdown>
                </article>

                {model && (
                  <div className="mt-10 border-t border-gray-200 pt-4 text-left text-xs text-gray-500">
                    {t("output.generatedBy")} {model}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </Card>
  );
}
