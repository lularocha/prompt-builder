import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Copy, Check, Download } from "lucide-react"
import { useState } from "react"

interface GeneratedPromptProps {
    prompt: string
}

export function GeneratedPrompt({ prompt }: GeneratedPromptProps) {
    const [copied, setCopied] = useState(false)
    const [promptTitle, setPromptTitle] = useState("")

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
        <Card className="min-h-[400px] resize-y overflow-auto flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl tracking-tight">Generated Prompt</CardTitle>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-primary/20 hover:text-blue-400"
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="hover:bg-primary/20 hover:text-blue-400"
                        onClick={handleCopy}
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden pt-4 space-y-3">
                <Input
                    placeholder="Name your prompt"
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                    className="focus-visible:ring-primary/50"
                />
                <div className="h-full w-full rounded-md bg-[#000085] p-4 overflow-auto font-mono text-sm leading-relaxed text-white">
                    <pre className="whitespace-pre-wrap">
{prompt ? `# ${promptTitle.trim() || "Generated Prompt"}\n\n${prompt}` : "Complete the sections on the left to generate your prompt..."}
                    </pre>
                </div>
            </CardContent>
        </Card>
    )
}
