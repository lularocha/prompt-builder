import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"

interface SectionPersonaProps {
    value: string
    onChange: (value: string) => void
}

export function SectionPersona({ value, onChange }: SectionPersonaProps) {
    return (
        <Card className="glass-panel border-0 bg-opacity-50">
            <CardHeader>
                <CardTitle className="text-xl">1. Persona</CardTitle>
                <CardDescription className="space-y-2">
                    <p>Define the AI's role, expertise, and perspective.</p>
                    <p className="text-sm text-white italic">E.g. You are an expert full-stack developer with 10+ years of experience in React and Node.js...</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="E.g. You are an expert full-stack developer with 10+ years of experience in React and Node.js..."
                    className="min-h-[100px] bg-black/20 border-white/10 resize-none focus-visible:ring-primary/50"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </CardContent>
        </Card>
    )
}
