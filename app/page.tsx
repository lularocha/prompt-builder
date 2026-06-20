"use client";

import { PromptBuilder } from "@/components/prompt-builder";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen flex-col items-center p-5 md:p-12 lg:pt-12 max-w-[1600px] mx-auto">
      <div className="w-full max-w-7xl z-10 flex flex-col gap-12">
        {/* Header */}
        <div className="text-left space-y-4">
          <p className="text-[16px]" style={{ color: "#f80", fontWeight: 500 }}>
            sugiro.ai
          </p>
          <div className="flex justify-between items-start !mt-0">
            <h1 className="text-4xl md:text-6xl font-semibold md:font-normal tracking-tighter text-white">
              Prompt Builder
            </h1>
            <LanguageSwitcher />
          </div>
          <p className="text-lg text-muted-foreground max-w-[1200px]">
            {t("header.tagline")}
          </p>
        </div>

        {/* Builder Interface */}
        <PromptBuilder />

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground mt-4 pb-8">
          <p>
            <span style={{ color: "rgb(250, 250, 250)" }}>
              {t("footer.developedBy")}
            </span>{" "}
            <a
              href="https://sugiro.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "#f80", fontWeight: 500 }}
            >
              sugiro.ai
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
