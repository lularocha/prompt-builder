"use client";

import { PromptBuilder } from "@/components/prompt-builder";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PromptRulesLink } from "@/components/prompt-rules";
import { useI18n } from "@/lib/i18n/context";

export default function Home() {
  const { t } = useI18n();

  return (
    <main className="mx-auto mt-4 flex min-h-screen max-w-7xl flex-col gap-12 max-[1366px]:px-8">
      {/* Header */}
      <div className="text-left">
        <p
          className="md:mb-2 text-[16px]"
          style={{ color: "#f80", fontWeight: 500 }}
        >
          sugiro.ai
        </p>
        <div className="flex justify-between items-start">
          <h1 className="text-4xl md:text-[3.5rem] font-semibold md:font-normal tracking-tighter text-white">
            Prompt Builder
          </h1>
          <LanguageSwitcher />
        </div>
        <p className="mt-4 text-lg text-muted-foreground max-w-[1200px]">
          {t("header.tagline")}
        </p>
      </div>

      {/* Builder Interface */}
      <PromptBuilder />

      {/* Footer */}
      <footer className="text-center lg:text-left text-sm text-muted-foreground mt-auto pb-4">
        <p className="pb-4">
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
          <span className="px-2 text-muted-foreground">·</span>
          <PromptRulesLink />
        </p>
      </footer>
    </main>
  );
}
