"use client";

import { useI18n } from "@/lib/i18n/context";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n/translations";

const LOCALES: Locale[] = ["en", "pt"];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full bg-[#1e1e23] p-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
            locale === l
              ? "bg-[#f80] text-white"
              : "text-white/60 hover:text-white"
          }`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
