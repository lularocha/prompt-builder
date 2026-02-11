import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"

interface SectionSystemPromptProps {
    persona: string
    onPersonaChange: (value: string) => void
    constraints: string
    onConstraintsChange: (value: string) => void
}

export function SectionSystemPrompt({
    persona,
    onPersonaChange,
    constraints,
    onConstraintsChange
}: SectionSystemPromptProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-[1.5rem]">1. System Prompt</CardTitle>
                <CardDescription className="pb-8">
                    Define reusable AI behavior: expertise and rules that apply across tasks.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Persona */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xl font-bold text-blue-400">Persona</h4>
                        <span className="block text-sm text-muted-foreground">Define AI domain expertise, role, and perspective.</span>
                    </div>
                    <Textarea
                        placeholder="Example: You are a senior frontend developer specializing in React and TypeScript..."
                        className="min-h-[100px] focus-visible:ring-primary/50"
                        value={persona}
                        onChange={(e) => onPersonaChange(e.target.value)}
                    />
                </div>

                {/* Constraints */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xl font-bold text-blue-400">Constraints</h4>
                        <span className="block text-sm text-muted-foreground">Define behavioral rules, quality standards, things to always/never do.</span>
                    </div>
                    <Textarea
                        placeholder={`Examples:\n- Prioritize readability and accessibility\n- Handle errors gracefully\n- Follow WCAG 2.1 AA standards`}
                        className="min-h-[100px] focus-visible:ring-primary/50"
                        value={constraints}
                        onChange={(e) => onConstraintsChange(e.target.value)}
                    />
                </div>

            </CardContent>
        </Card>
    )
}
