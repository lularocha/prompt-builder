import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface GeneratedPromptProps {
    prompt: string
}

export function GeneratedPrompt({ prompt }: GeneratedPromptProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card className="glass-panel border-0 bg-opacity-50 h-[600px] flex flex-col bg-black/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium text-primary">Generated Prompt</CardTitle>
                <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-primary/20 hover:text-primary"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied" : "Copy"}
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden pt-4">
                <div className="h-full w-full rounded-md bg-black/50 p-4 border border-white/10 overflow-auto font-mono text-sm leading-relaxed text-gray-300">
                    <pre className="whitespace-pre-wrap">{prompt || "Complete the sections on the left to generate your prompt..."}</pre>
                </div>
            </CardContent>
        </Card>
    )
}
