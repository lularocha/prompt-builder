import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Wand2 } from "lucide-react"

interface SectionPersonaProps {
    value: string
    onChange: (value: string) => void
}

export function SectionPersona({ value, onChange }: SectionPersonaProps) {
    const handleEnhance = () => {
        // Mockup - does not modify the value
    }

    return (
        <Card className="glass-panel border-0 bg-opacity-50">
            <CardHeader>
                <CardTitle className="text-xl">1. Persona</CardTitle>
                <CardDescription className="space-y-2">
                    <div>Define the AI's role, expertise, and perspective.</div>
                    <div className="text-sm text-white italic">E.g. You are an expert full-stack developer with 10+ years of experience in React and Node.js...</div>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Textarea
                    placeholder="E.g. You are an expert full-stack developer with 10+ years of experience in React and Node.js..."
                    className="min-h-[100px] resize-none focus-visible:ring-primary/50"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary gap-2 hover:bg-primary/20"
                    onClick={handleEnhance}
                >
                    <Wand2 className="w-3 h-3" />
                    Make it specific
                </Button>
            </CardContent>
        </Card>
    )
}
