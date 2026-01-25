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
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">2. Persona</CardTitle>
                <CardDescription>
                    Define the AI's role, expertise, and perspective.
                    <span className="block text-white italic mt-1">E.g. You are an expert full-stack developer with 10+ years of experience in React and Node.js...</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Textarea
                    placeholder="E.g. You are an expert full-stack developer with 10+ years of experience in React and Node.js..."
                    className="min-h-[100px] resize-none focus-visible:ring-primary/50"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                {/* <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-400 gap-2 hover:bg-primary/20"
                    onClick={handleEnhance}
                >
                    <Wand2 className="w-3 h-3" />
                    Make it specific
                </Button> */}
            </CardContent>
        </Card>
    )
}
