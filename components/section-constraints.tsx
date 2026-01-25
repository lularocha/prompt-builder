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

const PRESET_TECH = ["HTML", "CSS", "Vanilla JS", "TypeScript", "React", "Vue", "Next.js", "Tailwind CSS", "Node.js", "Python"]

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
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">3. Tech Stack & Constraints</CardTitle>
                <CardDescription>Define the boundaries and technologies by selecting the options below and defining your custom constraints.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Tech Stack */}
                <div className="space-y-3">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tech Stack</span>
                    <div className="flex flex-wrap gap-2">
                        {PRESET_TECH.map((tech) => (
                            <Badge
                                key={tech}
                                className={`cursor-pointer transition-all ${selectedTech.includes(tech) ? 'bg-[#4242f8] text-white hover:bg-[#5555ff]' : 'bg-white/10 hover:bg-white/30'}`}
                                onClick={() => onToggleTech(tech)}
                            >
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Custom Constraints */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Custom Constraints</span>
                        <span className="block text-sm text-muted-foreground">Set limitations and/or define requirements.</span>
                        <span className="block text-sm text-white italic">E.g. Keep responses under 200 words, avoid deprecated methods and use local storage for persistence.</span>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="E.g. Use localStorage for persistence..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            className="focus-visible:ring-primary/50"
                        />
                        <Button onClick={handleAdd} size="icon" variant="secondary" className="bg-white/5 hover:bg-white/10 shrink-0">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2 mt-2">
                        {customConstraints.map((constraint, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-black/20 group">
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
