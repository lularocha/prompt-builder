import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Wand2 } from "lucide-react"

interface SectionContextProps {
    value: string
    onChange: (value: string) => void
}

export function SectionContext({ value, onChange }: SectionContextProps) {
    const handleEnhance = () => {
        let enhanced = value

        // Simple dictionary of enhancements
        const enhancements: Record<string, string> = {
            "app ": "responsive web application ",
            "website ": "modern, high-performance website ",
            "people ": "target users including developers and designers ",
            "dashboard ": "analytics dashboard with real-time data visualization ",
            "calculator ": "scientific calculator with history and unit conversion ",
            "landing page ": "high-conversion landing page with hero section and feature grid ",
            "blog ": "SEO-optimized blog with markdown support and categories ",
            "user ": "authenticated user with role-based access control ",
            "store ": "e-commerce store with cart and checkout functionality ",
            "chat ": "real-time chat application with websocket support ",
        }

        Object.keys(enhancements).forEach(key => {
            if (enhanced.toLowerCase().includes(key)) {
                enhanced = enhanced.replace(new RegExp(key, 'gi'), enhancements[key])
            }
        })

        // If no keywords found, append a generic enhancement
        if (enhanced === value) {
            enhanced += " targeted at specific user demographics with clear accessibility requirements."
        }

        onChange(enhanced)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">1. Context</CardTitle>
                <CardDescription>
                    Describe what you are building, the problem, and the goal.
                    <span className="block text-white italic mt-1">E.g. I want to build a responsive admin dashboard for a SaaS platform using Next.js...</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Textarea
                    placeholder="E.g. I want to build a responsive admin dashboard for a SaaS platform using Next.js..."
                    className="min-h-[120px] resize-none focus-visible:ring-primary/50"
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
