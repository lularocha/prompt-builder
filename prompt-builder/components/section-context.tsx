import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Wand2 } from "lucide-react"

interface SectionContextProps {
    value: string
    onChange: (value: string) => void
}

export function SectionContext({ value, onChange }: SectionContextProps) {
    return (
        <Card className="glass-panel border-0 bg-opacity-50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">1. Context</CardTitle>
                        <CardDescription>Describe what you are building, the problem, and the goal.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-primary gap-2">
                        <Wand2 className="w-3 h-3" />
                        Make it specific
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="E.g. I want to build a responsive admin dashboard for a SaaS platform using Next.js..."
                    className="min-h-[120px] bg-black/20 border-white/10 resize-none focus-visible:ring-primary/50"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </CardContent>
        </Card>
    )
}
