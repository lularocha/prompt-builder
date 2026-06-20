"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Copy, Check, Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"

interface GeneratedPromptProps {
    prompt: string
    onPromptChange: (value: string) => void
    isGenerating: boolean
    model?: string | null
}

export function GeneratedPrompt({ prompt, onPromptChange, isGenerating, model }: GeneratedPromptProps) {
    const { t } = useI18n()
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([prompt], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'generated-prompt.md'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <Card className="min-h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[1.5rem] leading-none tracking-tight text-blue-400">{t("output.title")}</CardTitle>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-primary/20 hover:text-blue-400"
                        onClick={handleDownload}
                        disabled={!prompt}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {t("output.download")}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-primary/20 hover:text-blue-400"
                        onClick={handleCopy}
                        disabled={!prompt}
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
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
                        className="absolute inset-0 h-full w-full rounded-md bg-[#000085] p-4 overflow-auto font-mono text-base md:text-lg leading-relaxed text-white placeholder:text-white/50 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
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
    )
}
