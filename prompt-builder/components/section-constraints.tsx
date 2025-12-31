import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface SectionConstraintsProps {
    selectedTech: string[]
    onToggleTech: (tech: string) => void
    customConstraints: string[]
    onAddConstraint: (constraint: string) => void
    onRemoveConstraint: (index: number) => void
}

const PRESET_TECH = ["Next.js", "React", "Vue", "Tailwind CSS", "Vanilla JS", "TypeScript", "Node.js", "Python"]

export function SectionConstraints({
    selectedTech,
    onToggleTech,
    customConstraints,
    onAddConstraint,
    onRemoveConstraint
}: SectionConstraintsProps) {
    const [inputValue, setInputValue] = useState("")

    const handleAdd = () => {
        if (inputValue.trim()) {
            onAddConstraint(inputValue.trim())
            setInputValue("")
        }
    }

    return (
        <Card className="glass-panel border-0 bg-opacity-50">
            <CardHeader>
                <CardTitle className="text-xl">2. Constraints & Tech Stack</CardTitle>
                <CardDescription>Define the boundaries and technologies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Tech Stack */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tech Stack</span>
                    <div className="flex flex-wrap gap-2">
                        {PRESET_TECH.map((tech) => (
                            <Badge
                                key={tech}
                                variant={selectedTech.includes(tech) ? "default" : "outline"}
                                className={`cursor-pointer transition-all ${selectedTech.includes(tech) ? 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30' : 'hover:border-primary/50'}`}
                                onClick={() => onToggleTech(tech)}
                            >
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Custom Constraints */}
                <div className="space-y-3">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Custom Constraints</span>
                    <div className="flex gap-2">
                        <Input
                            placeholder="E.g. Use localStorage for persistence..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            className="bg-black/20 border-white/10 focus-visible:ring-primary/50"
                        />
                        <Button onClick={handleAdd} size="icon" variant="secondary" className="bg-white/5 border border-white/10 hover:bg-white/10 shrink-0">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 mt-2">
                        {customConstraints.map((constraint, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 group">
                                <span className="text-sm text-gray-300">{constraint}</span>
                                <button
                                    onClick={() => onRemoveConstraint(index)}
                                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
