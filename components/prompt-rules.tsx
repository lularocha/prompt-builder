"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useI18n } from "@/lib/i18n/context";
import { promptRulesContent } from "@/lib/prompt-rules-content";
import styles from "./markdown-preview.module.css";

// Footer link that opens the PROMPT_RULES document in a modal, reusing the
// generated-prompt preview's modal scheme and reading-view styles.
export function PromptRulesLink() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);

  // Close on Escape and lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:underline"
        style={{ color: "#f80", fontWeight: 500 }}
      >
        {t("footer.promptRules")}
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex h-[100dvh] items-center justify-center bg-black/70 p-4 animate-fade-in sm:p-8"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-zinc-100 pb-3 pl-8 pr-3 pt-6 text-gray-600 sm:pl-14">
                <h1 className="text-2xl font-bold tracking-[-0.05rem] text-[#f80]">
                  {t("promptRules.title")}
                </h1>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => setOpen(false)}
                  aria-label={t("promptRules.close")}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="overflow-auto bg-white px-8 py-10 sm:px-14 sm:py-12">
                <article className={styles.preview}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {promptRulesContent[locale]}
                  </ReactMarkdown>
                </article>

                <div className="mt-10 border-t border-gray-200 pt-4 text-left text-sm text-gray-600">
                  <span>{t("promptRules.developedBy")}</span>{" "}
                  <a
                    href="https://sugiro.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "#f80", fontWeight: 500 }}
                  >
                    sugiro.ai
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
