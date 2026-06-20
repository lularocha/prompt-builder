"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Copy, Check, Download, Loader2 } from "lucide-react"
import { useState } from "react"

interface GeneratedPromptProps {
    prompt: string
    onPromptChange: (value: string) => void
    isGenerating: boolean
}

export function GeneratedPrompt({ prompt, onPromptChange, isGenerating }: GeneratedPromptProps) {
    const [copied, setCopied] = useState(false)
    const [promptTitle, setPromptTitle] = useState("")

    const composed = () => {
        const title = promptTitle.trim() || "Project Title"
        return `# ${title}\n\n${prompt}`
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(composed())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const blob = new Blob([composed()], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const filename = promptTitle.trim()
            ? `${promptTitle.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`
            : 'generated-prompt.md'
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <Card className="min-h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[1.5rem] tracking-tight">Generated Prompt</CardTitle>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-primary/20 hover:text-blue-400"
                        onClick={handleDownload}
                        disabled={!prompt}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-primary/20 hover:text-blue-400"
                        onClick={handleCopy}
                        disabled={!prompt}
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-4 space-y-3">
                <Input
                    placeholder="Name your Project"
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                    className="focus-visible:ring-primary/50"
                />
                <div className="relative flex-1 min-h-[600px] lg:min-h-[600px]">
                    <textarea
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        spellCheck={false}
                        placeholder={isGenerating ? "" : "Your AI-generated prompt will appear here. You can edit it freely once it's generated."}
                        className="absolute inset-0 h-full w-full rounded-md bg-[#000085] p-4 overflow-auto font-mono text-sm leading-relaxed text-white placeholder:text-white/50 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                    />
                    {isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-[#000085]/80 text-white">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating your prompt...
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
